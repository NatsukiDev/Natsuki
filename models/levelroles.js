const mongoose = require('mongoose');

const LR = new mongoose.Schema({
    gid: {type: String, unique: true},
    roles: {type: Object, default: {}}
});

module.exports = mongoose.model('levelroles', LR);