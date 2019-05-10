#!/usr/bin/env node

const jwt = require('jsonwebtoken');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('generate-key <domain> <private-key>', 'Generate a new API key', (yargs) => {
    return yargs
      .option('domain', {
        type: 'string',
        describe: 'Domain name of the server that will use the API key'
      })
      .option('private-key', {
        type: 'string',
        describe: 'Path to private key to use for generating the API key'
      });
  }, (argv) => {
    const privateKey = fs.readFileSync(argv.privateKey);
    const keyId = `${uuidv4()}@${argv.domain}`;
    const keySecret = jwt.sign(keyId, privateKey, { algorithm: 'RS256' });

    console.log(
      `Key ID: ${keyId}\n` +
      `Key Secret: ${keySecret}`
    );
  })
  .help()
  .argv;
