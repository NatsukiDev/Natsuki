const mongoose = require('mongoose');

const AR = new mongoose.Schema({
    gid: {type: String, unique: true},
    ars: {type: [String], default: []},
    triggers: {type: [String], default: []},
    ignoreChs: {type: [String], default: []}
});

module.exports = mongoose.model('ar', AR);