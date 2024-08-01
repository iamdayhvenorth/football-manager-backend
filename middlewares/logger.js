const { validationResult } = require('express-validator');
const winston = require('winston');
const schedule = require('node-schedule');


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'combined.log' }),
      new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});


module.exports = logger;