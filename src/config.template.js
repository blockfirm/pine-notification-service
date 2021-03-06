const config = {
  api: {
    version: 'v1',
    port: 50427,
    publicKey: 'certs/public.key',
    rateLimit: {
      burst: 5,
      rate: 1,
      ip: true, // Set to true if directly exposed to the internet.
      xff: false, // Set to true if behind a reverse proxy or similar.
      maxKeys: 100000
    }
  },
  apn: {
    production: false,
    bundleId: 'se.blockfirm.Pine',
    token: {
      key: 'certs/xyz.p8', // Path to .p8 key file.
      keyId: '',
      teamId: ''
    },
    notifications: {
      incomingPayment: {
        title: '${address}',
        message: 'sent you a payment'
      },
      contactRequest: {
        title: '${address}',
        message: 'wants to add you as a contact'
      },
      contactRequestAccepted: {
        title: '${address}',
        message: 'accepted your contact request'
      },
      channelOpened: {
        title: 'Pine',
        message: 'Pine is now ready to be used with Lightning'
      }
    }
  },
  log: {
    level: 'info', // One of 'info', 'warn', 'error'.
    dir: '/var/log/pine'
  }
};

export default config;
