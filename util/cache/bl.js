const GuildData = require('../../models/guild');
const UserData = require('../../models/user');

module.exports = async (client) => {
    client.misc.cache.bl = {
        guild: [],
        user: []
    };

    for await (const guild of GuildData.find()) {
        if (guild.blacklisted) {client.misc.cache.bl.guild.push(guild.gid);}
    }

    for await (const user of UserData.find()) {
        if (user.blackisted) {client.misc.cache.bl.user.push(user.uid);}
    }
};