const mongoose = require('mongoose');

const cf = new mongoose.Schema({
    uid: {type: String, unique: true},
    loved: {type: [String], default: []}
});

module.exports = mongoose.model('charfav', cf);