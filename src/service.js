const redis = require('redis');

class VisitorsCounter {
  constructor(opts, logger, hllName = 'unique-visitors') {
    this._opts = opts;
    this._hllName = hllName;
    this._logger = logger;
    this._redisClient = redis.createClient({ ...opts.redis });

    this._redisClient.on('error', (err) => logger.error('Redis Client Error', err));
  }

  async start() {
    await this._redisClient.connect();
    this._logger.info('Connected to REDIS');
  }

  async stop() {
    try {
      await this._redisClient.quit();
    } catch (err) {
      this._logger.error('An error occurred while closing redis connection gracefully. '
        + 'Forcing disconnection...');
      this._redisClient.end(true);
    }
    this._logger.info('Disconnected from REDIS');
  }

  async updateCount(body) {
    // Assuming body is well-formed
    const { timestamp, ip } = body;
    let statusCode = 200;
    let payload;

    // Use HyperLogLog data structure to perform stream unique counts
    try {
      await this._redisClient.sendCommand(['PFADD', this._hllName, ip]);
      this._logger.trace({ timestamp, ip }, `Added '${ip}' to HLL data structure`);
      payload = { msg: 'done' };
    } catch (err) {
      this._logger.error({ timestamp, ip, err }, 'An error occurred while updating unique visitors counter on redis');
      statusCode = 500;
      payload = { msg: 'An error occurred while updating visits counter' };
    }

    return { payload, statusCode };
  }

  async getInfo() {
    let statusCode = 200;
    let payload;

    try {
      const count = await this._redisClient.sendCommand(['PFCOUNT', this._hllName]);
      payload = { visitors: count };
    } catch (err) {
      this._logger.error({ err }, 'An error occurred while counting unique visitors from redis');
      statusCode = 500;
      payload = 'An error occurred while retrieving';
    }

    return { payload, statusCode };
  }
}

module.exports = VisitorsCounter;
