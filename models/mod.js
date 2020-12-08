const mongoose = require('mongoose');

const ModModel = new mongoose.Schema({
    gid: {type: String, unique: true},
    cases: {type: [{
        members: [String],
        punishment: String,
        reason: String,
        status: String,
        moderators: [String],
        notes: [String],
        history: [String],
        issued: Date
    }], default: []},
    rules: {type: [{
        name: String,
        description: String,
        punishment: String,
        automod: String
    }], default: []},
    auto: {type: Object, default: {}},
    warnings: {type: Object, default: {}},
    maxWarnings: {type: Number, default: 0},
    onMaxWarn: {type: String, default: 'kick'}
});

module.exports = mongoose.model('mod', ModModel);