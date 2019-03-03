Pine Notification Service
=========================

[![GitHub Release](https://img.shields.io/github/release/blockfirm/pine-notification-service.svg?style=flat-square)](https://github.com/blockfirm/pine-notification-service/releases)
[![Build Status](https://img.shields.io/travis/blockfirm/pine-notification-service.svg?branch=master&style=flat-square)](https://travis-ci.org/blockfirm/pine-notification-service)
[![Coverage Status](https://img.shields.io/coveralls/blockfirm/pine-notification-service.svg?style=flat-square)](https://coveralls.io/r/blockfirm/pine-notification-service)

REST API to send push notifications to [Pine](https://pinewallet.co) users.

## Table of Contents

* [Dependencies](#dependencies)
* [Getting started](#getting-started)
* [API Docs](#api)
  * [Endpoints](#endpoints)
  * [Error handling](#error-handling)
  * [Rate limiting](#rate-limiting)
* [Contributing](#contributing)
* [Licensing](#licensing)

## Dependencies

* [Node.js](https://nodejs.org) and [Restify](http://restify.com) for creating the REST API
* [APN](https://developer.apple.com/notifications/) for sending push notifications to iOS devices

## Getting started

1. Clone this repo:
    ```
    $ git clone https://github.com/blockfirm/pine-notification-service.git
    $ cd pine-notification-service
    ```
2. Install dependencies:
    ```
    $ npm install
    ```
3. [Create a new key](https://developer.apple.com/account/ios/authkey) in your Apple Developer account to be used with the Apple Push Notifications Service
4. Open `src/config.js`
5. Enter your key credentials (key path, key ID, and team ID) in `apn.token`
6. Enter your app's bundle ID in `apn.bundleId`
7. Start the API server in development mode:
    ```
    $ npm run dev
    ```
8. Or build it and run in production mode:
    ```
    $ npm run build
    $ npm start
    ```

## API

### Endpoints

Endpoints for retrieving and submitting information to the bitcoin blockchain and network.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | [/v1/info](#get-v1info) | Get information about the server |
| POST | [/v1/notifications](#post-v1notifications) | Send a push notification |

### `GET` /v1/info

Returns information about the server.

#### Returns

```
{
  "ok": true (boolean) Indicates that the server is up and running (used for monitoring purposes)
}
```

### `POST` /v1/notifications

Sends a push notification to an iOS device using the specified device token.

#### Body

Encoded as JSON.

| Name | Type | Description |
| --- | --- | --- |
| deviceToken | *string* | Device token to send the notification to |
| type | *string* | Type of notification to send. One of `'newPayment'`, `'contactRequest'`, and `'contactRequestAccepted'` |
| context | *object* | *Optional.* Context to use when rendering the message (see `src/config.js`) |

#### Returns

The response from [`apn.Provider#send()`](https://github.com/node-apn/node-apn/blob/master/doc/provider.markdown#class-apnprovider).

Example of a successful response:

```json
{
    "sent": [
        {
            "device": "<device-token>"
        }
    ],
    "failed": []
}
```

Example of an unsuccessful response:

```json
{
    "sent": [],
    "failed": [
        {
            "device": "<bad-device-token>",
            "status": "400",
            "response": {
                "reason": "BadDeviceToken"
            }
        }
    ]
}
```

### Error handling

Errors are returned as JSON in the following format:

```json
{
    "code": "<error code>",
    "message": "<error message>"
}
```

### Rate limiting

The API is rate limited to 1 request per second with bursts up to 5 requests. The rate limiting is
based on the [Token Bucket](https://en.wikipedia.org/wiki/Token_bucket) algorithm and can be configured
in `src/config.js` at `api.rateLimit`.

The limit is per IP number, so if your server is behind a reverse proxy or similar you must change the
config to rate limit by the `X-Forwarded-For` header instead of the actual IP:

```js
rateLimit: {
  ...
  ip: false,
  xff: true
  ...
}
```

## Contributing

Want to help us making Pine better? Great, but first read the
[CONTRIBUTING.md](CONTRIBUTING.md) file for instructions.

## Licensing

Pine is licensed under the Apache License, Version 2.0.
See [LICENSE](LICENSE) for full license text.
