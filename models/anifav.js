const mongoose = require('mongoose');

const af = new mongoose.Schema({
    uid: {type: String, unique: true},
    watched: {type: [String], default: []},
    liked: {type: [String], default: []},
    toWatch: {type: [String], default: []},
    ratings: {type: [Object], default: {}}
});

module.exports = mongoose.model('anifav', af);