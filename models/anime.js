const mongoose = require('mongoose');

const AniSchema = new mongoose.Schema({
    id: {type: String, unique: true},
    name: String,
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
    streamAt: [String]
});

module.exports = mongoose.model('anime', AniSchema);