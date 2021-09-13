const redis = require('redis');

class VisitorsCounter {
  constructor(opts, logger) {
    this._opts = opts;
    this._logger = logger;
    this._redisClient = redis.createClient();

    this._redisClient.on('error', (err) => logger.error('Redis Client Error', err));
  }

  async start() {
    await this._redisClient.connect();
    this._logger.info('Connected to REDIS');
  }

  async updateCount(req, reply) {
    const { body: { timestamp, ip } } = req;

    // Use HyperLogLog data structure to perform stream unique counts
    try {
      await this._redisClient.sendCommand(['PFADD', 'unique-visitors', ip]);
      this._logger.trace({ timestamp, ip }, `Added '${ip}' to HLL data structure`);
      reply.send({ msg: 'done' });
    } catch (err) {
      this._logger.error({ timestamp, ip, err }, 'An error occurred while updating unique visitors counter');
      reply.statusCode(500).send('An error occurred while updating visits counter');
    }
  }

  async getInfo(request, reply) {
    try {
      const count = await this._redisClient.sendCommand(['PFCOUNT', 'unique-visitors']);
      reply.send(count);
    } catch (err) {
      this._logger.error({ err }, 'An error occurred while counting unique visitors');
      reply.statusCode(500).send('An error occurred while updating visits counter');
    }
  }
}

module.exports = VisitorsCounter;
