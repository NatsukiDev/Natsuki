const Discord = require('discord.js');
const chalk = require('chalk');

const wait = require('../util/wait');

const UserData = require('../models/user');
const AR = require('../models/ar');
const LXP = require('../models/localxp');
const Monitors = require('../models/monitor');
const Monners = require('../models/monners');

const channelTypes = ["GUILD_MESSAGE", "DM", "GUILD_NEWS_THREAD", "GUILD_PRIVATE_THREAD", "GUILD_PUBLIC_THREAD", "GUILD_NEWS", "GROUP_DM", "GUILD_STORE", "GUILD_TEXT"];

module.exports = async (client, message) => {
    if (!client.misc.fullyReady) {return;}

    if (message.partial) {await message.fetch();}
    if (message.channel.partial) {await message.channel.fetch();}

    if (!message.author || message.author.bot) {return undefined;}

	if (!channelTypes.includes(message.channel.type)) {return undefined;}

    if (message.guild && !message.member.permissions.has("SEND_MESSAGES")) {return undefined;}
	
    let defaultPrefix = client.misc.config.dev ? 'n!' : 'n?';
    let prefix = message.guild ? client.guildconfig.prefixes.has(message.guild.id) ? client.guildconfig.prefixes.get(message.guild.id) !== null ? client.guildconfig.prefixes.get(message.guild.id) : defaultPrefix : defaultPrefix : defaultPrefix;

	let msg = message.content.toLowerCase().replace('\u200E', '');
	let mention = message.mentions.users.first();
    let args = msg.startsWith(prefix)
        ? message.content.slice(prefix.length).trim().replace('\u200E', '').split(/\s+/g)
        : msg.startsWith('<@!')
            ? message.content.slice(4 + client.user.id.length).trim().replace('\u200E', '').split(/\s+/g)
            : message.content.slice(3 + client.user.id.length).trim().replace('\u200E', '').split(/\s+/g);
	let cmd = args.shift().toLowerCase().trim();

    message.misc = {mn: message.guild ? (client.misc.cache.monnersNames.get(message.guild.id) || 'Monners') : 'Monners'};

    if (message.content.includes("@everyone")) {return;}

	if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(msg)) {
	    return message.channel.send({embeds: [new Discord.MessageEmbed()
        .setTitle(["Yep, that's me!", "^^ Hiya!", "Oh, hi there!", "Sure, what's up?", "How can I help!", "Natsuki is busy, but I can take a message for you!", "Teehee that's me!", "You were looking for Natsuki Tivastl, right?", "Sure! What's up?", "Pong!"][Math.floor(Math.random() * 10)])
        .setDescription(`My prefix here is \`${prefix}\`. Use \`${prefix}help\` to see what commands you can use.`)
        .setColor('c375f0')]}).catch(() => {});
    }

	if (mention && message.guild) {require('../util/mention')(message, msg, args, cmd, prefix, mention, client);}
    UserData.findOne({uid: message.author.id}).then(async (tu) => {
	if (tu && tu.statusmsg.length && tu.statusclearmode === 'auto') {
        tu.statusmsg = '';
        tu.statustype = '';
        tu.save();
        require('../util/siftstatuses')(client, message.author.id, true);
        message.reply('Hey there! You asked me to clear your status when you send a message next, so I went ahead and did that for you.').then(m => {setTimeout(() => {m.delete().catch(() => {});}, 5000);}).catch(() => {});
	}});

	if (message.guild && client.misc.cache.ar.has(message.guild.id) && client.misc.cache.ar.get(message.guild.id).includes(msg.trim()) && !(client.misc.cache.arIgnore.has(message.guild.id) && client.misc.cache.arIgnore.get(message.guild.id).includes(message.channel.id))) {
	    AR.findOne({gid: message.guild.id}).then(ar => {
	        if (ar && ar.triggers.length && ar.triggers.includes(msg.trim())) {return message.channel.send(ar.ars[ar.triggers.indexOf(msg.trim())]).catch(() => {});}
	    });
	}

	if (message.guild && client.misc.cache.lxp.enabled.includes(message.guild.id)) {
        if (!client.misc.cache.lxp.disabledChannels.has(message.guild.id) || !client.misc.cache.lxp.disabledChannels.get(message.guild.id).includes(message.channel.id)) {
            if (!client.misc.cache.lxp.xp[message.guild.id]) {client.misc.cache.lxp.xp[message.guild.id] = {};}
            if (!client.misc.cache.lxp.xp[message.guild.id][message.author.id]) {
                LXP.findOne({gid: message.guild.id}).then(xp => {
                    client.misc.cache.lxp.xp[message.guild.id][message.author.id] = {
                        xp: xp.xp[message.author.id] ? xp.xp[message.author.id][0] : 0,
                        level: xp.xp[message.author.id] ? xp.xp[message.author.id][1] : 1,
                        lastXP: new Date().getTime() - 60000
                    };
                    require('../util/lxp/gainxp')(client, message.member.id, message.channel);
                });
            }
            else if (new Date().getTime() - client.misc.cache.lxp.xp[message.guild.id][message.author.id].lastXP > 60000) {
                require('../util/lxp/gainxp')(client, message.member.id, message.channel);
            }
        }
    }

    if (message.guild && client.misc.cache.chests.enabled.includes(message.guild.id)) {require('../util/lxp/spawnchest')(client, message.member, message.channel, prefix);}

    if (!client.misc.cache.monners[message.author.id]) {
        let tmonners = await Monners.findOne({uid: message.author.id}) || new Monners({uid: message.author.id});
        client.misc.cache.monners[message.author.id] = tmonners.currency;
    }

    if (message.guild && client.misc.cache.monitEnabled.includes(message.guild.id)) {
        if (!client.misc.cache.monit[message.guild.id]) {
            let tm = await Monitors.findOne({gid: message.guild.id});
            client.misc.cache.monit[tm.gid] = {
                messages: tm.messages,
                voice: tm.voice,
                expiry: new Date()
            };
        }
        if (!client.misc.cache.monit) {client.misc.cache.monit = {};}
        if (!client.misc.cache.monit[message.guild.id].messages.channels[message.channel.id]) {client.misc.cache.monit[message.guild.id].messages.channels[message.channel.id] = 0;}
        if (!client.misc.cache.monit[message.guild.id].messages.members[message.author.id]) {client.misc.cache.monit[message.guild.id].messages.members[message.author.id] = 0;}
        client.misc.cache.monit[message.guild.id].messages.channels[message.channel.id] += 1;
        client.misc.cache.monit[message.guild.id].messages.members[message.author.id] += 1;
        client.misc.cache.monit[message.guild.id].messages.total += 1;
        client.misc.cache.monit[message.guild.id].expiry.setTime(Date.now());
    }

    try {
        if (msg.startsWith(prefix) || msg.startsWith(`<@${client.user.id}>`) || msg.startsWith(`<@!${client.user.id}>`)) {
            let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

            if (command && command.name !== "blacklist") {
                if (message.guild && client.misc.cache.bl.guild.includes(message.guild.id)) {return message.channel.send("Your server has been blacklisted from using my commands! Shame, tsk tsk").catch(() => {});}
                if (client.misc.cache.bl.user.includes(message.author.id)) {return message.channel.send("You've been blacklisted from using my commands! Now what'd ya do to deserve that??").catch(() => {});}
            }

            if (!command) {let trigger; for (trigger of client.responses.triggers) {if (await trigger[1](message, msg, args, cmd, prefix, mention, client)) {await client.responses.commands.get(trigger[0]).execute(message, msg, args, cmd, prefix, mention, client); break;}} return;}
            if (message.guild && !message.channel.permissionsFor(client.user.id).has('SEND_MESSAGES')) {return message.author.send(`You tried to run the \`${command.name}\` command, but I don't seem to be able to send messages in <#${message.channel.id}>, so I can't do that!`).catch(() => {});};
            await message.channel.sendTyping().catch(() => {});
            if (!require('../util/cooldownhandler')(client, message, command)) {return;}
            if (command.meta && command.meta.guildOnly && !message.guild) {return message.channel.send("You must be in a server to use this command!").catch(() => {});}
            require('../util/oncommand')(message, msg, args, cmd, prefix, mention, client);
            if (client.misc.loggers.cmds) {client.misc.loggers.cmds.send(`${chalk.gray("[CMDL]")} >> ${chalk.white("Command")} ${chalk.blue(command.name)} ${message.guild ? `|| ${chalk.blue("Guild ID: ")} ${chalk.blueBright(message.guild.id)}` : ''} || ${chalk.blue("User ID: ")} ${chalk.blueBright(message.author.id)}`);}
            return command.execute(message, msg, args, cmd, prefix, mention, client);
        }
        let trigger; for (trigger of client.responses.triggers) {if (await trigger[1](message, msg, args, cmd, prefix, mention, client)) {await client.responses.commands.get(trigger[0]).execute(message, msg, args, cmd, prefix, mention, client); break;}}
    } catch (e) {
        let date = new Date(); date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
        console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | In ${message.guild ? message.guild.name : `a DM with ${message.author.username}`}\n`)}`, e);
    }
};