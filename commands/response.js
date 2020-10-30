const Discord = require('discord.js');
const GuildData = require('../models/guild');
const Responses = require('../models/responses');

const sendResponse = require('../util/response/sendresponse');
const parseResponse = require('../util/response/parseresponse');
const saveResponse = require('../util/response/saveresponse');
const getResponse = require('../util/response/getresponse');

module.exports = {
    name: "response",
    aliases: ['r', 'resp'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Responses")
        .setDescription("Configure your server's saved responses. These are reusable and editable, and can be placed in things like welcome messages and used for announcements.")
        .addField("Syntax", "`response <new|edit|view|list|delete|test|quick>`")
        .addField("Notice", "You must have your server's staff role or be an admin to use this command."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("You must be in a server to use this command.");}
        let tg = await GuildData.findOne({gid: message.guild.id});
        if (!tg && !['q', 'quick'].includes(args[0].toLowerCase()) && (tg.staffrole.length && !message.member.roles.cache.has(tg.staffrole)) && message.member.permissions.has("ADMINISTRATOR")) {return message.reply("you need to be staff or admin in this server in order to edit those settings.");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}response <new|edit|view|list|delete|test|quick>\``);}

        if (args.length < 1) {return message.reply("You have to tell me what I'm supposed to find or save!");}

        if (['q', 'quick'].includes(args[0].toLowerCase())) {return await sendResponse(message.member, message.channel, 'quick', client, await parseResponse(message, client, args));}
        if (['n', 'new', 's', 'save'].includes(args[0].toLowerCase())) {return await saveResponse(await parseResponse(message, client, args), message);}
        if (['t', 'test', 'send'].includes(args[0].toLowerCase())) {return await sendResponse(message.member, message.channel, 'quick', client, await getResponse(message, args[1]));}
        if (['r', 'remove', 'd', 'delete', 'del'].includes(args[0].toLowerCase())) {
            let tr = await Responses.findOne({gid: message.guild.id});
            if (!tr) {return message.reply("This server has no responses for me to delete.");}
            if (!tr.responses.has(args[1].toLowerCase())) {return message.reply("I can't find that response.");}
            tr.responses.delete(args[1].toLowerCase());
            let hadBinding = false;
            let bm = '';
            tr.bindings.forEach((v, k) => {if (v === args[1].toLowerCase()) {
                tr.bindings.delete(v);
                hadBinding = true;
                bm += `This response was bound to \`${k}\`, so that has also been removed.\n`;
            }});
            tr.save();
            return message.channel.send(`I removed the response \`${args[1].toLowerCase()}\`.${hadBinding ? `\n\n${bm}` : ''}`);
        }

        return message.channel.send(`Syntax: \`${prefix}response <new|edit|view|list|delete|test|quick>\``);
    }
};