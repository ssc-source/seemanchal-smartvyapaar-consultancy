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

/* =========================================================
   ADMIN ROUTES
========================================================= */
app.use('/api/admin/leads', require('./routes/adminLeads'));

app.use('/api/admin/services', require('./routes/adminServices'));

app.use('/api/admin/projects', require('./routes/adminProjects'));

app.use('/api/admin/settings', require('./routes/adminSettings'));

app.use('/api/admin/media', require('./routes/media'));

app.use(
  '/api/admin/homepage-sections',
  require('./routes/adminHomepage')
);

/* =========================================================
   PUBLIC ROUTES
========================================================= */
app.use('/api/auth', require('./routes/auth'));

app.use('/api/inquiries', require('./routes/inquiries'));

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

app.use('/api/admin/content-pages', require('./routes/adminContentPages'));
app.use('/api/admin/job-openings', require('./routes/adminJobOpenings'));
app.use('/api/admin/community-items', require('./routes/adminCommunityItems'));

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

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('✅ Allowed Origins:', allowedOrigins);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });
