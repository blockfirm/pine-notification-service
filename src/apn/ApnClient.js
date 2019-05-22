import apn from 'apn';

const SOUND = 'ping.aiff';

export default class ApnClient {
  constructor(config) {
    this.config = config;
    this._connect();
  }

  _connect() {
    const config = this.config;

    if (!config || !config.token || !config.token.key) {
      return;
    }

    this.provider = new apn.Provider({
      production: config.production,
      token: {
        ...config.token
      }
    });

    console.log('[APN] ✅ Connected');
  }

  // eslint-disable-next-line max-params
  send(title, message, context, deviceToken) {
    const notification = new apn.Notification({
      aps: {
        'content-available': 1 // This enables background fetch.
      }
    });

    if (!this.provider || !message) {
      return Promise.resolve();
    }

    notification.expiry = Math.floor(Date.now() / 1000) + (3600 * 72); // Expires in 3 days from now.
    notification.badge = 1;
    notification.sound = SOUND;
    notification.title = title;
    notification.body = message;
    notification.topic = this.config.bundleId;
    notification.payload = context;

    return this.provider.send(notification, [deviceToken]);
  }
}
