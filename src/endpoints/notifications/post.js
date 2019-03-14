import errors from 'restify-errors';

const renderMessage = (template, context) => {
  let message = template;

  if (!template) {
    return;
  }

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

    const notification = this.config.apn.notifications[type || 'newPayment'];

    if (!notification) {
      throw new errors.BadRequestError(
        'Unknown notification type'
      );
    }

    const title = renderMessage(notification.title, context || {});
    const message = renderMessage(notification.message, context || {});

    return this.apn.send(title, message, context, deviceToken).then((result) => {
      response.send(result);
    });
  });
};

export default post;
