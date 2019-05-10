import restify from 'restify';
import fs from 'fs';

import config from './config';
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

setupRoutes(server);

server.listen(config.api.port, () => {
  console.log('Pine Notification Service is listening at %s', server.url);
});
