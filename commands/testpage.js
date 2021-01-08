const Discord = require('discord.js');
const {Pagination} = require('../util/pagination');

module.exports = {
    name: "testpage",
    aliases: ['tp'],
    meta: {
        category: "",
        perms: "",
        staff: false,
        vip: "",
        serverPerms: [],
        writtenBy: "",
        serverOnly: false
    },
    tags: [],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> ")
        .setDescription("")
        .addField("Syntax", "``"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let p = await new Pagination(message.channel, [
            new Discord.MessageEmbed()
                .setTitle("bonk")
                .setDescription("bonk horny jail")
                .addField("bonk", "you have been bonked")
                .setColor('c375f0'),
            new Discord.MessageEmbed()
                .setTitle("stonks")
                .setDescription("yeet")
                .setColor('c375f0'),
            new Discord.MessageEmbed()
                .setTitle("honks")
                .setDescription("such wow many honks")
                .addField("aye", "lul text")
                .setColor('c375f0'),
            new Discord.MessageEmbed()
                .setTitle("yoink")
                .setDescription("give me the vibes")
                .addField("vibecheck", "your vibe will now be checked.")
                .setColor('c375f0'),
        ], message, client).start({endTime: 60000, user: message.author.id});
    }
};