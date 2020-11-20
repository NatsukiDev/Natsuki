const mongoose = require('mongoose');

const ModModel = new mongoose.Schema({
    gid: {type: String, unique: true},
    cases: {type: Map, default: new Map()},
    rules: {type: Map, default: new Map()},
    auto: {type: Map, default: new Map()},
    warnings: {type: Map, default: new Map()},
    maxWarnings: {type: Number, default: 0},
    onMaxWarn: {type: String, default: 'kick'}
});

module.exports = mongoose.model('mod', ModModel);