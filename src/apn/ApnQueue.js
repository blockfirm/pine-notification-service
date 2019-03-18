import Queue from 'bull';
import ApnClient from './ApnClient';

export default class ApnQueue {
  constructor(config) {
    this._apnClient = new ApnClient(config.apn);

    this._queue = new Queue('apn', {
      redis: config.redis
    });

    this._process();
  }

  _process() {
    this._queue.process((job) => {
      const { data } = job;

      return this._apnClient.send(
        data.title,
        data.message,
        data.context,
        data.deviceToken
      );
    });
  }

  // eslint-disable-next-line max-params
  send(title, message, context, deviceToken) {
    this._queue.add({ title, message, context, deviceToken });
  }
}
