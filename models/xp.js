const mongoose = require('mongoose');

const XP = mongoose.Schema({
    uid: {type: String, unique: true},
    level: {type: Number}
})