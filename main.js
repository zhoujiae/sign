import webc from './utils/webc.js';
import ajax from './utils/ajax.js';

export const sendTx = async function (keyStore, nodeInfo, from, pass, type, msg, msgs) {
  // 1. get account state (account_number & sequence)
  let accState = {
    account_number: '0',
    sequence: '0'
  };
  try {
    const {
      data
    } = await ajax.get(`/auth/accounts/${from}`);
    accState = data.result.value;
  } catch (e) {
    return Promise.resolve({
      data: 'netError'
    });
  }
  // 2. build cosmos stdTx
  const para = getTxPara(from, type, accState, nodeInfo, msg, msgs);
  const stdTx = webc.tx.buildTx(para);
  // 3. sign tx
  let req = {};
  // 3.1. get privateKey from keyStore
  let account = {};
  try {
    account = webc.account.fromV3KeyStore(keyStore, pass);
  } catch (e) {
    return Promise.resolve({
      data: 'passError'
    });
  }
  // 3.2. sign with local wallet
  const signature = webc.tx.sign(stdTx.GetSignBytes(), account.privateKey);
  stdTx.SetSignature(signature);
  req = stdTx.GetData();
  // 4. post to lcd api
  const res = await ajax.post(`/txs`, req);
  return Promise.resolve(res);
};
const getTxPara = (from, type, accState, nodeInfo, msg, msgs) => {
  return {
    chain_id: nodeInfo,
    from,
    account_number: accState.account_number,
    sequence: accState.sequence,
    memo: msg.memo || '',
    fees: {
      denom: 'ugard',
      amount: '50000'
    },
    gas: 10000000,
    type,
    msg,
    msgs
  };
};