const Discord = require('discord.js');
const GuildData = require('../../models/guild');
const ask = require('../../util/ask');

module.exports = {
    name: "starboard",
    aliases: ['sb'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> StarBoard")
        .setDescription("Setup and view information on this server's starboard! This allows messages to be sent to a dedicated channel when they receive a set number of star messages.")
        .addField("Syntax", "`starboard <setup|view|enable|disable|toggle>`")
        .addField("Notice", "You must have the staff-role or be an admin in order to set up or toggle the starboard"),
    meta: {
        category: 'Social',
        description: "Set up a star board to feature users' messages in",
        syntax: '`starboard <setup|view|enable|disable|toggle>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("You must be in a server in order to use this command.");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}starboard <setup|view|enable|disable|toggle>\``);}
        let tg = await GuildData.findOne({gid: message.guild.id}) ? await GuildData.findOne({gid: message.guild.id}) : new GuildData({gid: message.guild.id});
        if (['v', 'view', 'c', 'check'].includes(args[0])) {return message.reply(tg.starchannel.length ? tg.starsenabled ? `I'm watching for stars in <#${tg.starchannel}>. Messages will be Starred when they receive ${tg.starreq} :star: reactions.` : "StarBoard has been set up for this server, but isn't enabled at this time." : "StarBoard has not yet been set up in this server. You can do so with `" + prefix + "starboard setup`.");}
        if ((tg.staffrole.length && !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You don't have permissions to edit starboard settings in this server!");}

        if (['setup', 's', 'config', 'c'].includes(args[0])) {
            if (tg.starchannel.length) {message.channel.send("You already have a starboard set up in your server! This means that by continuing the setup, you'll be overwriting your previous settings.");}

            let ch = await ask(message, 'What channel would you like the starboard to be in? (Time: 30s)', 30000); if (!ch) {return;}
            if (ch.match(/^<#(?:\d+)>$/) && message.guild.channels.cache.has(ch.slice(ch.search(/\d/), ch.search('>')))) {tg.starchannel = ch.slice(ch.search(/\d/), ch.search('>'));}
            else if (message.guild.channels.cache.has(ch)) {tg.starchannel = ch;}
            else {return message.reply("Please specify a channel that actually exists! Try again.");}

            let starNum = await ask(message, 'How many stars should be reacted to a message in order for it to be starred? Please just send a number. (Time: 30s)', 30000); if (!starNum) {return;}
            if (isNaN(Number(starNum))) {return message.reply("That isn't a number! Please try again.");}
            starNum = Number(starNum);
            if (starNum < 3) {return message.reply("You need to have at least 3 stars. Try again");}
            if (starNum > 100) {return message.reply("You can't require more than 100 stars! Try again.");}
            tg.starreq = starNum;

            tg.starsenabled = true;
            tg.save();

            return message.channel.send(`Got it! I will now be watching for messages with at least ${starNum} reactions, and I'll send them to <#${tg.starchannel}>!`);
        }

        else if (['e', 'enable'].includes(args[0]) || (['t', 'toggle'].includes(args[0]) && !tg.starsenabled)) {
            if (tg.starsenabled) {return message.reply("StarBoard is already enabled in this server!");}
            if (!tg.starchannel.length) {return message.reply(`Please setup StarBoard first! \`${prefix}starboard setup\`.`);}
            tg.starsenabled = true;
            tg.save();
            return message.channel.send(`I've re-enabled your StarBoard. It's kept the same settings as you had when you disabled it!`);
        }

        else if (['d', 'disable'].includes(args[0]) || (['t', 'toggle'].includes(args[0]) && tg.starsenabled)) {
            if (!tg.starsenabled) {return message.reply("StarBoard is already disabled in this server!");}
            if (!tg.starchannel.length) {return message.reply(`Please setup StarBoard first! \`${prefix}starboard setup\`.`);}
            tg.starsenabled = false;
            tg.save();
            return message.channel.send(`I've disabled your StarBoard. Your StarBoard configuration will be kept for if/when you re-enable StarBoard.`);
        }

        else {return message.reply(`Invalid arg! Syntax: \`${prefix}starboard <setup|view|enable|disable|toggle>\``);}
    }
};