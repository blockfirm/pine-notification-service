import restify from 'restify';
import fs from 'fs';

import config from './config';
import logger from './logger';
import jwtMiddleware from './middlewares/jwt';
import setupRoutes from './setupRoutes';

const server = restify.createServer();
const publicKey = fs.readFileSync(config.api.publicKey);

server.use(restify.plugins.bodyParser({
  mapParams: true
}));

server.use(restify.plugins.queryParser());
server.use(restify.plugins.throttle(config.api.rateLimit));
server.use(restify.plugins.authorizationParser());
server.use(jwtMiddleware({ publicKey }));

// eslint-disable-next-line max-params
server.on('after', (request, response, route, error) => {
  const { method } = request;
  const { statusCode, statusMessage } = response;

  if (error) {
    return logger.error(
      `HTTP ${statusCode} ${statusMessage} ${method} ${request.url}: ${error.message}`, {
        scope: 'Api',
        route: route && route.path,
        status: statusCode,
        method
      }
    );
  }

  let logFunction;

  if (statusCode < 200 || statusCode > 299) {
    logFunction = logger.error.bind(logger);
  } else {
    logFunction = logger.info.bind(logger);
  }

  logFunction(
    `HTTP ${statusCode} ${statusMessage} ${method} ${route.path}`, {
      route: route.path,
      status: statusCode,
      method
    }
  );
});

setupRoutes(server);

server.listen(config.api.port, () => {
  logger.info(`Pine Notification Service is listening at ${server.url}`);
});
