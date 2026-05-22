require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { sequelize } = require('./models');

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
  })
);

/* =========================================================
   CORS
========================================================= */
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
  'https://seemanchal-smartvyapaar-consultancy.vercel.app',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error('❌ CORS Blocked:', origin);

      return callback(new Error('CORS not allowed'));
    },

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* =========================================================
   BODY PARSERS
========================================================= */
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================================
   LOGGER
========================================================= */
app.use(morgan('combined'));

/* =========================================================
   RATE LIMITER
========================================================= */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP.',
});

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

app.use('/api/services', require('./routes/services'));

app.use('/api/projects', require('./routes/projects'));

app.use('/api/settings', require('./routes/settings'));

app.use('/api/testimonials', require('./routes/testimonials'));

app.use(
  '/api/homepage-sections',
  require('./routes/homepage')
);

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
  .sync()
  .then(() => {

    console.log('Database synced successfully');

    app.listen(PORT, () => {

      console.log(`Server is running on port ${PORT}`);

      console.log('✅ Allowed Origins:', allowedOrigins);

    });

  })
  .catch((err) => {

    console.error('❌ Database connection failed:', err);

  });