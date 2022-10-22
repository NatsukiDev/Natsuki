const mongoose = require('mongoose');
module.exports = mongoose.model('guildlist', new mongoose.Schema({
    gid: {type: String, unique: true},
    lists: {type: Object, default: {}},
    admin: {type: Boolean, default: false}
}));