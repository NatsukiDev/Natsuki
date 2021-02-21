const Discord = require('discord.js');
const chalk = require('chalk');

const wait = require('../util/wait');

const UserData = require('../models/user');
const AR = require('../models/ar');
const LXP = require('../models/localxp');

module.exports = async (client, message) => {
    if (message.author.bot) {return undefined;}
	if (message.channel.type !== 'text' && message.channel.type !== 'dm') {return undefined;}

	//if (message.channel.type == "text") {if (settings[message.guild.id]) {prefix = settings[message.guild.id].prefix;};};

    if (message.guild && !message.member.permissions.has("SEND_MESSAGES")) {return undefined;}
	
    let prefix = message.guild ? client.guildconfig.prefixes.has(message.guild.id) ? client.guildconfig.prefixes.get(message.guild.id) !== null ? client.guildconfig.prefixes.get(message.guild.id) : 'n?' : 'n?' : 'n?';

	let msg = message.content.toLowerCase();
	let mention = message.mentions.users.first();
    let args = msg.startsWith(prefix)
        ? message.content.slice(prefix.length).trim().split(/\s+/g)
        : msg.startsWith('<@!') 
            ? message.content.slice(4 + client.user.id.length).trim().split(/\s+/g)
            : message.content.slice(3 + client.user.id.length).trim().split(/\s+/g);
	let cmd = args.shift().toLowerCase().trim();

	if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(msg)) {
	    return message.channel.send(new Discord.MessageEmbed()
        .setTitle(["Yep, that's me!", "^^ Hiya!", "Oh, hi there!", "Sure, what's up?", "How can I help!", "Natsuki is busy, but I can take a message for you!", "Teehee that's me!", "You were looking for Natsuki Tivastl, right?", "Sure! What's up?", "Pong!"][Math.floor(Math.random() * 10)])
        .setDescription("My prefix here is `" + prefix + "`. Use `" + prefix + "help` to see what commands you can use.")
        .setColor('c375f0'));
    }

	if (mention && message.guild) {require('../util/mention')(message, msg, args, cmd, prefix, mention, client);}
    UserData.findOne({uid: message.author.id}).then(async (tu) => {
	if (tu && tu.statusmsg.length && tu.statusclearmode === 'auto') {
        tu.statusmsg = '';
        tu.statustype = '';
        tu.save();
        require('../util/siftstatuses')(client, message.author.id, true);
        message.reply('Hey there! You asked me to clear your status when you send a message next, so I went ahead and did that for you.').then(m => {m.delete({timeout: 5000});});
	}});

	if (message.guild && client.misc.cache.ar.has(message.guild.id) && client.misc.cache.ar.get(message.guild.id).includes(msg.trim()) && !(client.misc.cache.arIgnore.has(message.guild.id) && client.misc.cache.arIgnore.get(message.guild.id).includes(message.channel.id))) {
	    AR.findOne({gid: message.guild.id}).then(ar => {
	        if (ar && ar.triggers.length && ar.triggers.includes(msg.trim())) {return message.channel.send(ar.ars[ar.triggers.indexOf(msg.trim())]);}
	    });
	}

	if (message.guild && client.misc.cache.lxp.enabled.includes(message.guild.id)) {
	    LXP.findOne({gid: message.guild.id}).then(xp => {
            if (!client.misc.cache.lxp.xp[message.guild.id]) {client.misc.cache.lxp.xp[message.guild.id] = {};}
            if (!client.misc.cache.lxp.xp[message.guild.id][message.author.id]) {client.misc.cache.lxp.xp[message.guild.id][message.author.id] = {
                xp: xp.xp[message.author.id] ? xp.xp[message.author.id][0] : 0,
                level: xp.xp[message.author.id] ? xp.xp[message.author.id][1] : 1,
                lastXP: new Date().getTime() - 60000
            };}
            if (new Date().getTime() - client.misc.cache.lxp.xp[message.guild.id][message.author.id].lastXP > 60000) {
                require('../util/lxp/gainxp')(client, message.member.id, message.channel);
            }
        });
    }



    try {
        if (msg.startsWith(prefix) || msg.startsWith(`<@${client.user.id}>`) || msg.startsWith(`<@!${client.user.id}>`)) {
            let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

            if (command && command.name !== "blacklist") {
                if (message.guild && client.misc.cache.bl.guild.includes(message.guild.id)) {return message.channel.send("Your server has been blacklisted from using my commands! Shame, tsk tsk");}
                if (client.misc.cache.bl.user.includes(message.author.id)) {return message.channel.send("You've been blacklisted from using my commands! Now what'd ya do to deserve that??");}
            }

            if (!command) {let trigger; for (trigger of client.responses.triggers) {if (await trigger[1](message, msg, args, cmd, prefix, mention, client)) {await client.responses.commands.get(trigger[0]).execute(message, msg, args, cmd, prefix, mention, client); break;}} return;}
            message.channel.startTyping();
            await wait(800);
            message.channel.stopTyping();
            if (command.meta && command.meta.guildOnly && !message.guild) {return message.channel.send("You must be in a server to use this command!");}
            require('../util/oncommand')(message, msg, args, cmd, prefix, mention, client);
            return command.execute(message, msg, args, cmd, prefix, mention, client);
        }
        let trigger; for (trigger of client.responses.triggers) {if (await trigger[1](message, msg, args, cmd, prefix, mention, client)) {await client.responses.commands.get(trigger[0]).execute(message, msg, args, cmd, prefix, mention, client); break;}}
    } catch (e) {
        let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
        console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | In ${message.guild ? message.guild.name : `a DM with ${message.author.username}`}\n`)}`, e);
    }
};