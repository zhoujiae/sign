const Amino = require('../base');
const Utils = require('../../util/utils');
const Config = require('../../config');

function MsgIssue(properties) {
    if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
}

MsgIssue.prototype.GetSignBytes = function() {
    let sortMsg = Utils.sortObjectKeys({ ...this });
    return Amino.MarshalJSON(this.type, sortMsg);
};

MsgIssue.prototype.ValidateBasic = function() {};

MsgIssue.prototype.GetMsg = function() {
    return { ...this };
};

module.exports = class Issue {
    static CreateMsgIssue(req) {
        MsgIssue.prototype.type = req.msg.type;
        delete req.msg.type;
        return new MsgIssue({ ...req.msg });
    }
};
