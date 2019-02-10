import errors from 'restify-errors';

const post = function post(request, response) {
  const deviceToken = request.params.deviceToken;

  return Promise.resolve().then(() => {
    if (!deviceToken || typeof deviceToken !== 'string') {
      throw new errors.BadRequestError(
        'The deviceToken parameter must be a string'
      );
    }

    if (deviceToken.length > 512) {
      throw new errors.BadRequestError(
        'The deviceToken string is too long'
      );
    }

    return this.apn.send(this.config.apn.notifications.newPayment, deviceToken).then((result) => {
      response.send(result);
    });
  });
};

export default post;
