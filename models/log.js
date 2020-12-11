const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    gid: {type: String, unique: true},
    mdelete: {type: String, default: ''},
    medit: {type: String, default: ''},
    chnew: {type: String, default: ''},
    chedit: {type: String, default: ''},
    chdelete: {type: String, default: ''},
    vcjoin: {type: String, default: ''},
    vcleave: {type: String, default: ''},
    servervcmute: {type: String, default: ''},
    servervcdeafen: {type: String, default: ''},
    kick: {type: String, default: ''},
    ban: {type: String, default: ''},
    mute: {type: String, default: ''},
    warn: {type: String, default: ''},
    giverole: {type: String, default: ''},
    takerole: {type: String, default: ''},
    addrole: {type: String, default: ''},
    editrole: {type: String, default: ''},
    deleterole: {type: String, default: ''},
    serverjoin: {type: String, default: ''},
    serverleave: {type: String, default: ''},
    nickname: {type: String, default: ''},
    username: {type: String, default: ''},
    avatar: {type: String, default: ''}
});

module.exports = mongoose.model('log', logSchema);