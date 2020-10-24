const mongoose = require('mongoose');

const StarSchema = new mongoose.Schema({
    gid: {type: String, unique: true},
    stars: {type: Object, default: {}},
    starCount: {type: Object, default: {}},
    serverStarCount: {type: Number, default: 0}
});

module.exports = mongoose.model('stars', StarSchema);