const mongoose = require('mongoose');

const SaveSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    saves: {type: Map, default: new Map()}
});

module.exports = mongoose.model('saves', SaveSchema);