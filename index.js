const express = require('express');
const connectDB = require('./db/connectDB');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes.js');
const UserRoutes = require('./routes/userRoutes.js');
const supportRoutes = require('./routes/supportRoutes.js');
const reportRoutes = require('./routes/reportRoutes.js');
const errorHandler = require('./middlewares/errorHandler.js');
const settingsRoutes = require('./routes/settings');
const contactsRoutes = require('./routes/contacts');
const multer = require('multer');
const winston = require('winston');
const helmet = require('helmet');


// const rateLimiter = require("express-rate-limit")

const PORT = process.env.PORT || 3500;

const app = express();
const upload = multer({ dest: 'uploads/' });

// default middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(
  cors({
    origin: 'http://localhost:5173', // allow requests from this origin
    credentials: true, // allow sessions to persist across different requests
  })
);



// custom middleware
app.use(errorHandler);

// routes
app.use('/auth', authRoutes);
app.use('/customers', customerRoutes);
app.use('/users', UserRoutes);
app.use('/support/tickets', supportRoutes);
app.use('/analytics', reportRoutes);
app.use('/settings', settingsRoutes);
app.use('/contacts', contactsRoutes);

// Schedule a job to clear logs periodically (example: daily at midnight)
schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await Log.deleteMany();
    logger.info('Scheduled log clearance executed');
  } catch (err) {
    logger.error('Error during scheduled log clearance', err);
  }
});

connectDB()
  .then(() => {
    console.log('database connected to mongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('Database not connected', err));
