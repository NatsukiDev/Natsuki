const Discord = require('discord.js');

const UserData = require('../models/user');

module.exports = {
    name: "setstatus",
    aliases: ['sst'],
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
    .setTitle("Help -> Status-Setting")
    .setDescription("Sets the bot's status")
    .addField("Syntax", "`setstatus <status> [type]`")
    .addField('Notice', "This command is **developer-only**"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}setstatus <status> [type]\``);}
        let tu = await UserData.findOne({uid: message.author.id});
        if (!tu || !tu.developer) {return message.channel.send("You must be a Natsuki developer in order to do that!");}
        if (args[0].length > 30) {return message.reply("That status is a bit too long.");}
        if (args[1]) {if (!['playing', 'watching', 'listening'].includes(args[0].toLowerCase())) {return message.channel.send("That's not a valid type!");}}
        
        if (args[1]) {client.user.setActivity(args[0], {type: args[1].toUpperCase()});}
        else {client.user.setActivity(args[0]);}
        return message.channel.send(`Status set to: \`${args[1] ? `${args[1].slice(0, 1).toUpperCase()}${args[1].slice(1).toLowerCase()}${args[1] && args[1].toLowerCase() == 'listening'} ` ? 'to ' : '' : ''}${args[0]}\`.`);
    }
};