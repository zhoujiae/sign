'use strict';

const Codec = require('../util/codec');
const Sha256 = require('sha256');
const Config = require('../config');
const R_Cosmos = require('./cosmos/tx/tx');

/**
 * 处理amino编码（目前支持序列化）
 *
 */
class Amino {
    constructor() {
        this._keyMap = {};
    }

    GetRegisterInfo(key) {
        let info = this._keyMap[key];
        if (info === undefined) {
            throw new Error('not Registered');
        }
        return info;
    }

    /**
     * 注册amino类型
     *
     * @param class field的类型
     * @param key amino前缀
     */
    RegisterConcrete(type, key) {
        this._keyMap[key] = {
            prefix: this._aminoPrefix(key),
            classType: type
        };
    }

    /**
     * 给消息加上amino前缀
     *
     * @param key amino前缀
     * @param message 编码msg
     * @returns { Array }
     */
    MarshalBinary(key, message) {
        let prefixBytes = this._keyMap[key].prefix;
        prefixBytes = Buffer.from(prefixBytes.concat(message.length));
        prefixBytes = Buffer.concat([prefixBytes, message]);
        return prefixBytes;
    }

    MarshalJSON(key, message) {
        let pair = {
            type: key,
            value: message
        };
        return pair;
    }

    _aminoPrefix(name) {
        let a = Sha256(name);
        let b = Codec.Hex.hexToBytes(a);
        while (b[0] === 0) {
            b = b.slice(1, b.length - 1);
        }
        b = b.slice(3, b.length - 1);
        while (b[0] === 0) {
            b = b.slice(1, b.length - 1);
        }
        b = b.slice(0, 4); //注意和go-amino v0.6.2以前的不一样
        return b;
    }
}

let amino = new Amino();
amino.RegisterConcrete(null, Config.cosmos.amino.pubKey);
amino.RegisterConcrete(null, Config.cosmos.amino.signature);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgDelegate, Config.cosmos.tx.delegate.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgSend, Config.cosmos.tx.transfer.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgSetWithdrawAddress, Config.cosmos.tx.setWithdrawAddress.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgWithdrawDelegatorReward, Config.cosmos.tx.withdrawDelegatorReward.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgWithdrawValidatorCommission, Config.cosmos.tx.withdrawValidatorCommission.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgUndelegate, Config.cosmos.tx.undelegate.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgBeginRedelegate, Config.cosmos.tx.beginRedelegate.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.StdTx, Config.cosmos.tx.stdTx.prefix);

module.exports = amino;
