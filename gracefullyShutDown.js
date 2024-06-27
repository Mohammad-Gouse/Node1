// Gracefull shutdown, preventing data loss.

const { logger } = require("./config");
const { controller } = require("./web/server");


// i.e. wait for existing connections and processes
module.exports = function () {
    const gracefulShutdown = function (err, origin) {
      const timestamp = Date.now();
      if (err) {
        logger.info(`ProcessId: ${timestamp} uncaughtException: ${err.message}`);
        logger.info(`ProcessId: ${timestamp} Shutting down gracefully.`);
  
        logger.error(`ProcessId: ${timestamp} uncaughtException: ${err}`);
        logger.error(`ProcessId: ${timestamp} Error stack:`, err.stack);
        logger.error(`ProcessId: ${timestamp} Error origin:`, origin);
      } else {
        logger.info(`ProcessId: ${timestamp} Received kill signal, shutting down gracefully.`);
        logger.error(`ProcessId: ${timestamp} Error origin:`, origin);
      }
  
      // stop reciving connections.
      controller.abort();
      logger.info(`Closed out remaining connections. ProcessId: ${timestamp}`);
      if (err) {
        logger.info('Shutting Down Forcefully');
        setTimeout(() => {
          process.exit(1);
        }, 6 * 1000);
      } else {
        logger.info('Shutting Down');
        // process.exit(0); /** Doing this to serve the ongoing requests down below */
      }
  
      // Wait for 20 second to close all open connections and processes before hard shutdown
      setTimeout(() => {
        logger.error(`Could not close connections in time, forcefully shutting down. ProcessId: ${timestamp}`);
        logger.info('Shutting Down Forcefully');
        process.exit(1);
      }, 20 * 1000);
    };
  
    // listen for TERM signal .e.g. kill
    process.on('SIGTERM', gracefulShutdown);
  
    // listen for INT signal e.g. Ctrl-C
    process.on('SIGINT', gracefulShutdown);
  
    // uncaughtException Exception
    process.on('uncaughtException', gracefulShutdown);
  
    // capture unhandledRejection
    process.on('unhandledRejection', (err) => {
      if (err) {
        logger.error(`unhandledRejection captured. Error: ${err}`);
        logger.error('unhandledRejection captured. Error stack:', err.stack);
      }
    });
  
    process.on('exit', (code) => {
      logger.error(`Process exit event with code: ${code}`);
    });
  };