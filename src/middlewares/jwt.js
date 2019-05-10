import errors from 'restify-errors';
import jwt from 'jsonwebtoken';

const jwtMiddleware = (options) => {
  const { publicKey } = options;

  return function (request, _response, next) {
    if (!request.authorization || request.authorization.scheme !== 'Bearer') {
      return next(
        new errors.UnauthorizedError('Missing authentication')
      );
    }

    try {
      const { credentials } = request.authorization;
      request.user = jwt.verify(credentials, publicKey, { algorithms: ['RS256'] });
    } catch (error) {
      return next(
        new errors.InvalidCredentialsError('Authentication failed')
      );
    }

    return next();
  };
};

export default jwtMiddleware;
