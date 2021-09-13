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
    fastify.get('/visitors', async (req, reply) => {
      const { payload, statusCode } = await this._visitorSvc.getInfo();
      reply.code(statusCode).send(payload);
    });
    fastify.post('/logs', async (req, reply) => {
      const { payload, statusCode } = await this._visitorSvc.updateCount(req.body);
      reply.code(statusCode).send(payload);
    });
  }
}

module.exports = VisitorsController;
