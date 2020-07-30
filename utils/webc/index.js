/**
 * some dependencies need older versions:
 *
 * "bip39": "2.5.0",
 * "bn": "git+https://github.com/shineabel/bn.git",
 * "secp256k1": "3.5.0"
 *
 */

const Crypto = require('./crypto');
const Builder = require('./builder').Builder;
const config = require('./config');

function getBuilder(chainName) {
  return Builder.getBuilder(chainName);
}

function getCrypto(chainName) {
  return Crypto.getCrypto(chainName);
}

module.exports = {
  getCrypto,
  getBuilder,
  config
};