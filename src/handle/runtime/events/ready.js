const Discord = require('discord.js');

module.exports = async client => {
    client.prefix = "n?";

    require('../../startup/run/hello')(client); // startup info
    require('../../startup/run/setstatus')(client);
};