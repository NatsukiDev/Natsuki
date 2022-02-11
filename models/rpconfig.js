const mongoose = require('mongoose');

const s = new mongoose.Schema({
    gid: {type: String, required: true, unique: true},
    channels: {type: [String], default: []}
});

module.exports = mongoose.model('rpconfig', s);