require('dotenv').config();


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');


const { sequelize } = require('./models');
const { allowedOrigins, corsOptions, apiLimiter, validateEnvironment } = require('./security/config');
const { requestContext, sanitizeInput } = require('./middlewares/requestContext');


validateEnvironment();


const app = express();


/* =========================================================
   TRUST PROXY
========================================================= */
app.set('trust proxy', 1);


/* =========================================================
   SECURITY
========================================================= */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  })
);


/* =========================================================
   CORS
========================================================= */
app.use(cors(corsOptions));


/* =========================================================
   BODY PARSERS
========================================================= */
app.use(requestContext);


// Webhook endpoints require raw body for signature verification; mount a raw parser for razorpay webhooks before JSON body parser
app.use('/api/webhooks/razorpay', express.raw({ type: 'application/json' }));


app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT || '1mb' }));


app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.REQUEST_BODY_LIMIT || '1mb',
  })
);


app.use(sanitizeInput);


/* =========================================================
   LOGGER
========================================================= */
app.use(morgan('combined'));


/* =========================================================
   RATE LIMITER
========================================================= */
app.use('/api/', apiLimiter);


/* =========================================================
   STATIC FILES
========================================================= */
app.use(express.static(path.join(__dirname, 'public')));


// ✅ FIX: Serve certificates directory statically for downloadCertificate()
app.use(
  "/certificates",
  express.static(path.join(__dirname, "public", "certificates"))
);


/* =========================================================
   ROUTE HELPERS
========================================================= */
// Safe mount for routes that might fail gracefully
const safeMount = (mountPath, modulePath) => {
  try {
    app.use(mountPath, require(modulePath));
  } catch (err) {
    console.warn(`Failed to mount ${modulePath}:`, err && err.message ? err.message : err);
    app.use(mountPath, (req, res) => res.status(200).json({ success: true, data: [] }));
  }
};


/* =========================================================
   ADMIN ROUTES
========================================================= */
app.use('/api/admin/auth', require('./routes/adminAuth'));
app.use('/api/admin/dashboard', require('./routes/adminDashboard'));
app.use('/api/admin/leads', require('./routes/adminLeads'));
app.use('/api/admin/internships', require('./routes/adminInternships'));
app.use('/api/admin/batches', require('./routes/adminBatches'));
app.use('/api/admin/students', require('./routes/adminStudents'));
app.use('/api/admin/quizzes', require('./routes/adminQuizzes'));
app.use('/api/admin/certificates', require('./routes/adminCertificates'));
app.use('/api/admin/revenue', require('./routes/adminRevenue'));


// Admin users import
safeMount('/api/admin/users', './routes/adminUsers');


// Payments and webhooks
app.use('/api/payments', require('./routes/payments'));
app.use('/api/webhooks/razorpay', require('./routes/webhooks'));


app.use('/api/admin/services', require('./routes/adminServices'));
app.use('/api/admin/projects', require('./routes/adminProjects'));


app.use('/api/admin/settings', require('./routes/adminSettings'));


app.use('/api/admin/media', require('./routes/media'));


app.use(
  '/api/admin/homepage-sections',
  require('./routes/adminHomepage')
);


app.use('/api/admin/seo', require('./routes/adminSeo'));


// Future Skills Lab Admin Routes
safeMount('/api/admin/future-skills', './routes/adminFutureSkills');


// Admin Blogs (Blog posts, categories, tags, revisions)
safeMount('/api/admin/blogs', './routes/adminBlogs');
safeMount('/api/admin/blog-categories', './routes/adminBlogCategories');
safeMount('/api/admin/blog-tags', './routes/adminBlogTags');


/* =========================================================
   PUBLIC ROUTES
========================================================= */
app.use('/api/auth', require('./routes/auth'));


app.use('/api/inquiries', require('./routes/inquiries'));


// Future Skills Lab Public Routes
safeMount('/api/future-skills', './routes/futureSkills');


app.use(
  '/api/career-applications',
  require('./routes/careerApplications')
);


app.use(
  '/api/community-applications',
  require('./routes/communityApplications')
);


app.use('/api/services', require('./routes/services'));


app.use('/api/projects', require('./routes/projects'));


app.use('/api/settings', require('./routes/settings'));


app.use('/api/testimonials', require('./routes/testimonials'));


app.use(
  '/api/homepage-sections',
  require('./routes/homepage')
);


app.use('/api/content-pages', require('./routes/contentPages'));
app.use('/api/job-openings', require('./routes/jobOpenings'));
app.use('/api/community-items', require('./routes/communityItems'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/certificates', require('./routes/certificates'));


// Student routes (authenticated)
app.use('/api/student', require('./routes/students'));
app.use('/api/students', require('./routes/students'));


app.use('/api/seo', require('./routes/seo'));


app.use('/api/admin/content-pages', require('./routes/adminContentPages'));
app.use('/api/admin/job-openings', require('./routes/adminJobOpenings'));
app.use('/api/admin/community-items', require('./routes/adminCommunityItems'));
// Public blog routes
app.use('/api/blogs', require('./routes/blogs'));


/* =========================================================
   HEALTH ROUTE
========================================================= */
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    status: 'OK',
    message: 'API is running',
  });
});


app.get('/api/live', (req, res) => {
  return res.status(200).json({ success: true, status: 'live' });
});


app.get('/api/ready', async (req, res, next) => {
  try {
    await sequelize.authenticate();
    return res.status(200).json({ success: true, status: 'ready' });
  } catch (error) {
    error.statusCode = 503;
    return next(error);
  }
});


/* =========================================================
   ROOT ROUTE
========================================================= */
app.get('/', (req, res) => {
  res.send('SSC Backend Running 🚀');
});


// Lightweight admin UI placeholder for blog CMS stabilization
app.get('/admin/blogs', (req, res) => {
  return res.status(200).send('Blog CMS is under development');
});


/* =========================================================
   404 HANDLER
========================================================= */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */
const globalErrorHandler = require('./middlewares/errorHandler');


app.use(globalErrorHandler);


/* =========================================================
   START SERVER
========================================================= */
const PORT = process.env.PORT || 5000;


// Add timeout for database authentication
const authenticateWithTimeout = async (timeout = 10000) => {
  try {
    await Promise.race([
      sequelize.authenticate(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database connection timeout')), timeout)
      )
    ]);
    console.log('Database connection established.');
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.warn('⚠️ Starting server anyway with graceful degradation...');
    return false;
  }
};


authenticateWithTimeout(10000).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('✅ Allowed Origins:', allowedOrigins);
  });
});