const mongoose = require('mongoose');

const Monitor = new mongoose.Schema({
    gid: {type: String, unique: true},
    messages: {type: Object, default: {}},
    voice: {type: Object, default: {}}
});

module.exports = mongoose.model("monitor", Monitor);