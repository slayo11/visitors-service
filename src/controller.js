const VisitorsCounter = require('./service');

class VisitorsController {
  constructor(opts) {
    this._opts = opts;

    this._visitorSvc = new VisitorsCounter(opts);
  }

  async registerRoutes(fastify) {
    fastify.get('/status', (req, reply) => {
      reply.send({ msg: 'This is visitors service!' });
    });
    fastify.post('/logs', async (req, reply) => {
      const visitorsInfo = this._visitorSvc.getInfo();
      reply.send(visitorsInfo);
    });
  }
}

module.exports = VisitorsController;
