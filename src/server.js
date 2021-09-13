const Fastify = require('fastify');
const fastifyCors = require('fastify-cors');

const { DEFAULT_SERVICE_PORT } = require('./constants');

const VisitorsController = require('./controller');

class Server {
  constructor(opts) {
    this._opts = opts;

    this._fastify = new Fastify({
      ignoreTrailingSlash: true,
      logger: true,
    });

    this._visitorCtrl = new VisitorsController(opts);
  }

  async start() {
    const { rest: restOpts = {} } = this._opts;

    // Register visitors controller routes
    const port = (restOpts.port != null) ? restOpts.port : DEFAULT_SERVICE_PORT;
    const allowedOrigins = restOpts.origins != null
      ? [`http://localhost:${restOpts.port}`, ...restOpts.origins]
      : `http://localhost:${restOpts.port}`;

    this._fastify.register(fastifyCors, { origin: allowedOrigins });
    this._fastify.register(this._visitorCtrl.registerRoutes.bind(this));
    await this._fastify.listen(port, '0.0.0.0');
  }
}

module.exports = Server;
