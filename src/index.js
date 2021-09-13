const logger = require('pino')();

const Server = require('./server');

const conf = require('../conf/conf.json');

const server = new Server(conf);

(async () => {
  try {
    await server.start();
    logger.info('Server started');
  } catch (err) {
    logger.error('An error occurred: terminating...');
  }
})();
