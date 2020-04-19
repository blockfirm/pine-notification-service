import apn from 'apn';
import logger from '../logger';

const SOUND_PING = 'ping.aiff';
const PUSH_TYPE_ALERT = 'alert';

export default class ApnClient {
  constructor(config) {
    this.config = config;
    this.logger = logger.child({ scope: 'ApnClient' });

    this._tryConnect();
  }

  _tryConnect() {
    try {
      this._connect();
    } catch (error) {
      this.logger.error(`Unable to connect to APN service: ${error.message}`);
    }
  }

  _connect() {
    const config = this.config;

    if (!config || !config.token || !config.token.key) {
      throw new Error('Missing APN configuration');
    }

    this.provider = new apn.Provider({
      production: config.production,
      token: {
        ...config.token
      }
    });

    this.logger.info('Connected to APN service');
  }

  // eslint-disable-next-line max-params, max-statements
  send(title, message, context, deviceToken) {
    const notification = new apn.Notification();

    if (!this.provider) {
      this.logger.error('Cannot send notification: Missing provider');
      return Promise.resolve();
    }

    if (!message) {
      this.logger.error(`Cannot send notification: Missing message`);
      return Promise.resolve();
    }

    notification.expiry = Math.floor(Date.now() / 1000) + (3600 * 72); // Expires in 3 days from now.
    notification.badge = 1;
    notification.sound = SOUND_PING;
    notification.title = title;
    notification.body = message;
    notification.topic = this.config.bundleId;
    notification.payload = context;
    notification.contentAvailable = 1; // This enables background fetch.
    notification.pushType = PUSH_TYPE_ALERT;

    return this.provider.send(notification, [deviceToken]);
  }
}
