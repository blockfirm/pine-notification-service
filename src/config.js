const config = {
  api: {
    version: 'v1',
    port: 50427,
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
      key: '', // Path to .p8 key file.
      keyId: '',
      teamId: ''
    },
    notifications: {
      newPayment: 'You just received a new payment!',
      contactRequest: '${address} wants to add you as a contact'
    }
  }
};

export default config;
