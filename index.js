require('dotenv').config();
const { logger } = require('./config');

// Set globals
require('./globals');

// Initaializing config

const { pg } = require('./db');

process.env.TZ = 'Asia/Kolkata';

pg.pool.connect((err, client) => {
  if (err) {
    logger.error('Unable to connect to Database | ' + err.message);
  } else {
    logger.info('Database connected successfully');
  }
});

// Running the required scripts
/** Updatingn the database for logging the IP informations */
const { createFolders } = require('./scripts');

createFolders.init([
  'log',
]);



// Start server
const { app } = require('./web/server');

require('./gracefullyShutDown')(app);