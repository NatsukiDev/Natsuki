const mongoose = require('mongoose');

const AniSchema = new mongoose.Schema({
    id: {type: String, unique: true},
    name: String,
    japname: String,
    plot: String,
    publishers: [String],
    studios: [String],
    airStartDate: String,
    airEndDate: String,
    isComplete: Boolean,
    seasons: Number,
    episodes: Number,
    genres: [String],
    tags: [String],
    characters: [String],
    streamAt: [String],
    watchers: {type: Number, default: 0},
    listed: {type: Number, default: 0},
    liked: {type: Number, default: 0},
    rating: {type: Number, default: 0},
    lastUpdate: String,
    thumbnail: String,
    queued: {type: Boolean, default: true}
});

module.exports = mongoose.model('anime', AniSchema);