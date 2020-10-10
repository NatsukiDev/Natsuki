const Discord = require('discord.js');
const mongoose = require('mongoose');
const chalk = require('chalk');
const wait = require('../util/wait');
const UserData = require('../models/user');

module.exports = async (client, message) => {
    if (message.author.bot) {return undefined;}
	if (message.channel.type == 'dm') /*{var dmch = true;} else {var dmch = false};*/ {return undefined;}
	if (message.channel.type !== 'text' && message.channel.type !== 'dm') {return undefined;}

	//if (message.channel.type == "text") {if (settings[message.guild.id]) {prefix = settings[message.guild.id].prefix;};};

    if (message.guild && !message.member.permissions.has("SEND_MESSAGES")) {return undefined;}
	
    var prefix = message.guild ? client.guildconfig.prefixes.has(message.guild.id) ? client.guildconfig.prefixes.get(message.guild.id) !== null ? client.guildconfig.prefixes.get(message.guild.id) : 'n?' : 'n?' : 'n?';

	var msg = message.content.toLowerCase();
	var mention = message.mentions.users.first();
    var args = msg.startsWith(prefix) 
        ? message.content.slice(prefix.length).trim().split(/\s+/g)
        : msg.startsWith('<@!') 
            ? message.content.slice(4 + client.user.id.length).trim().split(/\s+/g)
            : message.content.slice(3 + client.user.id.length).trim().split(/\s+/g);
	var cmd = args.shift().toLowerCase().trim();

	if (mention && message.guild) {require('../util/mention')(message, msg, args, cmd, prefix, mention, client);}
    let tu = await UserData.findOne({uid: message.author.id});
	if (tu && tu.statusmsg.length && tu.statusclearmode === 'auto') {
        tu.statusmsg = '';
        tu.statustype = '';
        tu.save();
        message.reply('Hey there! You asked me to clear your status when you send a message next, so I went ahead and did that for you.');
	}

    try {
        if (msg.startsWith(prefix) || msg.startsWith(`<@${client.user.id}>`) || msg.startsWith(`<@!${client.user.id}>`)) {
            let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
            if (!command) {return;}
            message.channel.startTyping();
            await wait(800);
            message.channel.stopTyping();
            require('../util/oncommand')(message, msg, args, cmd, prefix, mention, client);
            command.execute(message, msg, args, cmd, prefix, mention, client);
        }
    } catch (e) {
        var date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
        console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | In ${message.guild.name}\n`)}`, e);
    }
};