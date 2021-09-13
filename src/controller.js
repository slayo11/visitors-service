const VisitorsCounter = require('./service');

class VisitorsController {
  constructor(opts, logger) {
    this._opts = opts;
    this._logger = logger;

    this._visitorSvc = new VisitorsCounter(opts, logger.child({ name: 'Visitor service' }));
  }

  async start() {
    await this._visitorSvc.start();
    this._logger.info('Visitors controller started');
  }

  async registerRoutes(fastify) {
    fastify.get('/status', (req, reply) => {
      reply.send({ msg: 'This is visitors service!' });
    });
    fastify.get('/logs', async (req, reply) => {
      await this._visitorSvc.getInfo(req, reply);
    });
    fastify.post('/logs', async (req, reply) => {
      await this._visitorSvc.updateCount(req, reply);
    });
  }
}

module.exports = VisitorsController;
