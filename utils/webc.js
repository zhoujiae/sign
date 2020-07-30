import Webc from '../utils/webc/index';
const account = Webc.getCrypto('cosmos');
const tx = Webc.getBuilder('cosmos');

export default {
  account,
  tx
};