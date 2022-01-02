const mongoose = require('mongoose');

const lxp = new mongoose.Schema({
    gid: {type: String, unique: true},
    msg: {type: Boolean, default: true},
    xp: {type: Object, default: {}},
    lvch: {type: String, default: ''},
    chests: {type: Object},
    noGains: {type: [String]}
});

module.exports = mongoose.model('localxp', lxp);