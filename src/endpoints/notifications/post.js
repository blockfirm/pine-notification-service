import errors from 'restify-errors';

const renderMessage = (template, context) => {
  let message = template;

  message = message.replace('${address}', context.address || 'Someone');

  return message;
};

const post = function post(request, response) {
  const { deviceToken, type, context } = request.params;

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

    if (context && typeof context !== 'object') {
      throw new errors.BadRequestError(
        'The context must be an object'
      );
    }

    const template = this.config.apn.notifications[type || 'newPayment'];

    if (!template) {
      throw new errors.BadRequestError(
        'Unknown notification type'
      );
    }

    const message = renderMessage(template, context || {});

    return this.apn.send(message, deviceToken).then((result) => {
      response.send(result);
    });
  });
};

export default post;
