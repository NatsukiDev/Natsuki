const {Collection} = require("discord.js");

module.exports = async client => {
    ['commands', 'events'].forEach(x => {
        client[x] = new Collection();
        require(`../collect/${x}`)(client);
    });
};