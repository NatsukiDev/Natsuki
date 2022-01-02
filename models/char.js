const mongoose = require('mongoose');

const char = new mongoose.Schema({
    id: {type: String, unique: true},
    name: String,
    anime: String,
    thumbnail: String,
    images: {type: [String], default: []},
    nicknames: {type: [String], default: []},
    loved: {type: Number, default: 0},
    personality: {type: String, defualt: null},
    gender: String,
    loveInterest: {type: String, defualt: null},
    queued: {type: Boolean, default: true},
    highValue: {type: Boolean}
});

module.exports = mongoose.model('char', char);