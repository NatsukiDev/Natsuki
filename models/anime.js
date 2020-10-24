const mongoose = require('mongoose');

const AniSchema = new mongoose.Schema({
    id: {type: String, unique: true},
    name: String,
    japname: String,
    plot: String,
    publishers: [String],
    studio: [String],
    airStartDate: Date,
    airEndDate: Date,
    isComplete: Boolean,
    seasons: Number,
    episodes: Number,
    genres: [String],
    tags: [String],
    characters: [String],
    streamAt: [String],
    watchers: Number,
    listed: Number,
    liked: Number,
    rating: Number
});

module.exports = mongoose.model('anime', AniSchema);