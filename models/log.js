const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    gid: {type: String, unique: true},
    logs: {type: Object, default: {}}
});

module.exports = mongoose.model('log', logSchema);