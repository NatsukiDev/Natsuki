const mongoose = require('mongoose');

const Chests = new mongoose.Schema({
    gid: {type: String, unique: true},
    channel: {type: String, default: ''}
});

module.exports = mongoose.model('chests', Chests);