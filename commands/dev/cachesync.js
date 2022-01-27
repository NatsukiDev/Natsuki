const Discord = require('discord.js');

const UserData = require('../../models/user');

module.exports = {
    name: "cachesync",
    aliases: ['preres', 'pres'],
    meta: {
        category: 'Developer',
        description: "Sync cached XP, monners, and monitor data to make client safe for a restart",
        syntax: '`cachesync`',
        extra: null
    },
    help: "Nothing to see here!",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        const tu = await UserData.findOne({uid: message.author.id});
        if ((!tu || !tu.developer) && !client.developers.includes(message.author.id)) {return message.channel.send("You must be a developer in order to do this!");}
        await require('../../util/lxp/cacheloop')(client);
        await require('../../util/vcloop')(client);
        await require('../../util/monitorloop')(client);
        return message.channel.send("Cache synchronized with DB!");
    }
};