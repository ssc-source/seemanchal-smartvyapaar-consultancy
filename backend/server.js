// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const path = require('path');
// const { sequelize } = require('./models');

// const app = express();

// // Security Middlewares
// app.use(helmet({
//   crossOriginResourcePolicy: false // Allow loading images cross-origin
// }));
// app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('combined'));

// // Rate Limiting
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window`
//   message: 'Too many requests from this IP, please try again later.',
// });
// app.use('/api/', apiLimiter);

// // Serve static files from public directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Admin Routes (Protected)
// app.use('/api/admin/leads', require('./routes/adminLeads'));
// app.use('/api/admin/services', require('./routes/adminServices'));
// app.use('/api/admin/projects', require('./routes/adminProjects'));
// app.use('/api/admin/settings', require('./routes/adminSettings'));
// app.use('/api/admin/media', require('./routes/media'));
// app.use('/api/admin/homepage-sections', require('./routes/adminHomepage'));

// // Public Setup routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/inquiries', require('./routes/inquiries'));
// app.use('/api/services', require('./routes/services'));
// app.use('/api/projects', require('./routes/projects'));
// app.use('/api/settings', require('./routes/settings'));
// app.use('/api/testimonials', require('./routes/testimonials'));
// app.use('/api/homepage-sections', require('./routes/homepage'));

// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'API is running' });
// });

// //handle server errors externally

// app.get("/", (req, res) => {
//   res.send("RJ Concept Backend is Running 🚀");
// });

// // Handle unhandled routes (404) with JSON
// app.use((req, res, next) => {
//   res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
// });

// // Global Error handling middleware
// const globalErrorHandler = require('./middlewares/errorHandler');
// app.use(globalErrorHandler);

// const PORT = process.env.PORT || 5000;

// sequelize.sync().then(() => {
//   console.log('Database synced successfully');
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// }).catch(err => {
//   console.error('Unable to connect to the database:', err);
// });


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
   TRUST PROXY (Required for Render / Railway / VPS proxies)
========================================================= */
app.set('trust proxy', 1);

/* =========================================================
   SECURITY MIDDLEWARES
========================================================= */
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow loading images cross-origin
  })
);

/* =========================================================
   CORS CONFIGURATION
========================================================= */
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
  'https://seemanchal-smartvyapaar-consultancy.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, curl)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('❌ CORS Blocked Origin:', origin);
        callback(new Error('CORS not allowed'));
      }
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
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   LOGGING
========================================================= */
app.use(morgan('combined'));

/* =========================================================
   RATE LIMITING
========================================================= */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
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
app.use('/api/admin/homepage-sections', require('./routes/adminHomepage'));

/* =========================================================
   PUBLIC ROUTES
========================================================= */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/services', require('./routes/services'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/homepage-sections', require('./routes/homepage'));

/* =========================================================
   HEALTH CHECK
========================================================= */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API is running',
  });
});

/* =========================================================
   ROOT ROUTE
========================================================= */
app.get('/', (req, res) => {
  res.send('RJ Concept Backend is Running 🚀');
});

/* =========================================================
   404 HANDLER
========================================================= */
app.use((req, res, next) => {
  res.status(404).json({
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
   SERVER START
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
    console.error('Unable to connect to the database:', err);
  });