const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    gid: {type: String, unique: true},
    staffrole: String,
    vip: Boolean,
    wch: String,
    lch: String,
    logch: String,
    chests: String,
    autoquote: String,
    welcomeroll: String,
    joinrole: String,
    cooldowns: Boolean,
    levelmessage: String
});

module.exports = mongoose.model("guild", guildSchema);