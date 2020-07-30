const Root = require('./tx/tx');
const Amino = require('../base');
const Utils = require('../../util/utils');
const Config = require('../../config');
const BECH32 = require('bech32');
const MsgDelegate = Root.cosmos.MsgDelegate;
const MsgUndelegate = Root.cosmos.MsgUndelegate;
const MsgBeginRedelegate = Root.cosmos.MsgBeginRedelegate;

MsgDelegate.prototype.type = Config.cosmos.tx.delegate.prefix;
MsgDelegate.prototype.GetSignBytes = function() {
    let msg = {
        delegator_address: BECH32.encode(Config.cosmos.bech32.accAddr, this.DelegatorAddr),
        validator_address: BECH32.encode(Config.cosmos.bech32.valAddr, this.ValidatorAddr),
        amount: this.Amount
    };
    let sortMsg = Utils.sortObjectKeys(msg);
    return Amino.MarshalJSON(this.type, sortMsg);
};

MsgDelegate.prototype.ValidateBasic = function() {
    if (Utils.isEmpty(this.DelegatorAddr)) {
        throw new Error('delegatorAddr is  empty');
    }
    if (Utils.isEmpty(this.ValidatorAddr)) {
        throw new Error('validatorAddr is  empty');
    }
};

MsgDelegate.prototype.GetMsg = function() {
    const BECH32 = require('bech32');
    let delegator_addr = BECH32.fromWords(this.DelegatorAddr);
    let validator_addr = BECH32.fromWords(this.ValidatorAddr);

    return {
        DelegatorAddr: delegator_addr,
        ValidatorAddr: validator_addr,
        Amount: this.Amount
    };
};

MsgUndelegate.prototype.type = Config.cosmos.tx.undelegate.prefix;
MsgUndelegate.prototype.GetSignBytes = function() {
    let msg = {
        delegator_address: BECH32.encode(Config.cosmos.bech32.accAddr, this.DelegatorAddr),
        validator_address: BECH32.encode(Config.cosmos.bech32.valAddr, this.ValidatorAddr),
        amount: this.Amount
    };
    let sortMsg = Utils.sortObjectKeys(msg);
    return Amino.MarshalJSON(this.type, sortMsg);
};

MsgUndelegate.prototype.ValidateBasic = function() {
    if (Utils.isEmpty(this.DelegatorAddr)) {
        throw new Error('delegatorAddr is  empty');
    }
    if (Utils.isEmpty(this.ValidatorAddr)) {
        throw new Error('validatorAddr is  empty');
    }
};

MsgUndelegate.prototype.GetMsg = function() {
    const BECH32 = require('bech32');
    let delegator_addr = BECH32.fromWords(this.DelegatorAddr);
    let validator_addr = BECH32.fromWords(this.ValidatorAddr);

    return {
        DelegatorAddr: delegator_addr,
        ValidatorAddr: validator_addr,
        Amount: this.Amount
    };
};

MsgBeginRedelegate.prototype.type = Config.cosmos.tx.beginRedelegate.prefix;
MsgBeginRedelegate.prototype.GetSignBytes = function() {
    let msg = {
        delegator_address: BECH32.encode(Config.cosmos.bech32.accAddr, this.DelegatorAddr),
        validator_src_address: BECH32.encode(Config.cosmos.bech32.valAddr, this.ValidatorSrcAddr),
        validator_dst_address: BECH32.encode(Config.cosmos.bech32.valAddr, this.ValidatorDstAddr),
        amount: this.Amount
    };
    let sortMsg = Utils.sortObjectKeys(msg);
    return Amino.MarshalJSON(this.type, sortMsg);
};

MsgBeginRedelegate.prototype.ValidateBasic = function() {
    if (Utils.isEmpty(this.DelegatorAddr)) {
        throw new Error('delegatorAddr is  empty');
    }
    if (Utils.isEmpty(this.ValidatorSrcAddr)) {
        throw new Error('validatorSrcAddr is  empty');
    }
    if (Utils.isEmpty(this.ValidatorDstAddr)) {
        throw new Error('validatorDstAddr is  empty');
    }
    if (Utils.isEmpty(this.Amount)) {
        throw new Error('Amount is  empty');
    }
};

MsgBeginRedelegate.prototype.GetMsg = function() {
    const BECH32 = require('bech32');
    let delegator_addr = BECH32.fromWords(this.DelegatorAddr);
    let validator_src_addr = BECH32.fromWords(this.ValidatorSrcAddr);
    let validator_dst_addr = BECH32.fromWords(this.ValidatorDstAddr);

    return {
        DelegatorAddr: delegator_addr,
        ValidatorSrcAddr: validator_src_addr,
        ValidatorDstAddr: validator_dst_addr,
        Amount: this.Amount
    };
};

module.exports = class Stake {
    static createMsgDelegate(req) {
        let value = {
            denom: req.msg.delegation.denom,
            amount: Utils.toString(req.msg.delegation.amount)
        };

        let delegator_addr = BECH32.decode(req.from).words;
        let validator_addr = BECH32.decode(req.msg.validator_addr).words;

        return new MsgDelegate({
            DelegatorAddr: delegator_addr,
            ValidatorAddr: validator_addr,
            Amount: value
        });
    }

    static createMsgUndelegate(req) {
        let amount = req.msg.amount;
        amount.amount = Utils.toString(amount.amount);

        let delegator_addr = BECH32.decode(req.from).words;
        let validator_addr = BECH32.decode(req.msg.validator_addr).words;

        return new MsgUndelegate({
            DelegatorAddr: delegator_addr,
            ValidatorAddr: validator_addr,
            Amount: amount
        });
    }

    static createMsgBeginRedelegate(req) {
        let amount = req.msg.amount;
        amount.amount = Utils.toString(amount.amount);

        let delegator_addr = BECH32.decode(req.from).words;
        let validator_src_addr = BECH32.decode(req.msg.validator_src_addr).words;
        let validator_dst_addr = BECH32.decode(req.msg.validator_dst_addr).words;

        return new MsgBeginRedelegate({
            DelegatorAddr: delegator_addr,
            ValidatorSrcAddr: validator_src_addr,
            ValidatorDstAddr: validator_dst_addr,
            Amount: amount
        });
    }
};

class Dec {
    static String(share) {
        if (share.indexOf('.') === -1) {
            share = share + '.000000000000000000';
        } else {
            let padLen = 18 - share.split('.')[1].length;
            for (let i = 0; i < padLen; i++) {
                share = `${share}0`;
            }
        }
        return share;
    }
}
