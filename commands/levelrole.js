const Discord = require('discord.js');

const GuildData = require('../models/guild');
const LR = require('../models/levelroles');

const ask = require('../util/ask');

module.exports = {
    name: "levelrole",
    aliases: ['lr', 'levelroles', 'levelingroles', 'rolereward', 'rolerewards'],
    meta: {
        category: 'Leveling',
        description: "Sets a role to be given to users when they reach a certain level.",
        syntax: '`levelrole <set|view|remove|clear>`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Level Roles")
    .setDescription("Sets a role to be given to users when they reach a certain level.")
    .addField("Syntax", "`levelrole <set|view|remove|clear>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}levelrole <set|view|remove|clear>\``);}
        let tg = await GuildData.findOne({gid: message.guild.id});
        if ((!tg || !tg.staffrole || !tg.staffrole.length || !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You don't have the permissions to do that in this server! Ask a server admin to do it for you");}
        
        if (['set', 's', 'add', 'a'].includes(args[0].toLowerCase())) {
            if (!message.guild.me.permissions.has("MANAGE_ROLES")) {return message.channel.send("I don't have permissions to add roles to members in this server, so it would be useless to try and setup any level roles!");}
            if (!args[1]) {return message.reply("please provide a level and a role to reward for reaching that level!");}
            let level = args[1];
            if (isNaN(Number(level)) || Number(level) > 200 || Number(level) < 1) {return message.reply("the level must be a positive number lower than 200!");}
            if (!args[2]) {return message.channel.send("Please try again and provide a role mention or ID of the role you'd like to add after the level!");}
            if (!args[2].match(/<@\&\d+>/gm) && !args[2].match(/\d+/gm)) {return message.channel.send("Hmm, it doesn't look like you gave me a role.");}
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
            if (!role) {return message.channel.send("I can't find that role!");}
            role = role.id;
            let lr = await LR.findOne({gid: message.guild.id}) || new LR({gid: message.guild.id}); 
            if (Object.keys(lr.roles).length >= 10) {return message.channel.send("Due to data storage concerns, you can only have 10 level roles in this server. If you believe you need more, come to the support server and talk to my devs and see if they would be willing to raise this requirement for you.");}
            lr.roles[level] = role;
            lr.markModified(`roles.${level}`);
            lr.save();
            if (!client.misc.cache.lxp.hasLevelRoles.includes(message.guild.id)) {client.misc.cache.lxp.hasLevelRoles.push(message.guild.id);}
            return message.channel.send(`Got it, I'll now give members the role \`${message.guild.roles.cache.get(role).name}\` when they reach Level ${level}`);
        }

        if (['v', 'view', 'l', 'list'].includes(args[0].toLowerCase())) {
            let lr = await LR.findOne({gid: message.guild.id});
            if (!lr) {return message.channel.send("Your server doesn't seem to have any leveling roles set up!");}
            let s = '';
            let rs = [];
            let r; for (r of Object.keys(lr.roles)) {
                let role = message.guild.roles.cache.get(lr.roles[r]);
                if (role) {rs.push({level: r, role: role});}
                else {
                    role = await message.guild.roles.fetch(lr.roles[r]);
                    if (role) {rs.push({level: r, role: role});}
                }
            }
            rs.sort((a, b) => a.level - b.level);
            for (let i = 0; i < rs.length; i++) {s += `**${i + 1}.** Level ${rs[i].level} - <@&${rs[i].role.id}>\n`;}
            if (!s.length) {return message.channel.send("Hmm, there was some kind of error there. It may be that your server's leveling roles were deleted, or there was some internal error when trying to read them. Contact my devs if the problem persists.");}
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Server Leveling Roles")
                .setThumbnail(message.guild.iconURL({size: 2048}))
                .setDescription(s)
                .setColor('c375f0')
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()
            );
        }

        if (['d', 'delete', 'r', 'remove'].includes(args[0].toLowerCase())) {
            let lr = await LR.findOne({gid: message.guild.id});
            if (!lr) {return message.channel.send("Your server doesn't seem to have any leveling roles set up!");}
            if (!args[1]) {return message.channel.send("Please provide the level you'd like to remove from the level roles *not the role you want to remove*");}
            if (!lr.roles[args[1]]) {return message.channel.send("Hmm, it looks like that level doesn't have a role for it. Make sure you provided the *level* and not the *role*.");}
            delete lr.roles[args[1]];
            lr.markModified(`roles.${args[1]}`);
            lr.save();
            return message.channel.send("Removed that leveling role!");
        }

        if (['c', 'clear'].includes(args[0].toLowerCase())) {
            if (!message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("Unfortunately, you must be an administrator in this server to clear all the leveling roles.");}
            let lr = await LR.findOne({gid: message.guild.id});
            if (!lr) {return message.channel.send("Your server doesn't seem to have any leveling roles set up!");}
            let conf = await ask(message, "Are you sure you want to clear your server's leveling roles? This is irreversible! (Accepts only \"yes\" or \"no\")"); if (!conf) {return;}
            if (conf.toLowerCase() !== "yes") {return message.channel.send("Fear not! Your leveling roles are safe, I will still be giving roles to people when they level up.");}
            return LR.deleteOne({gid: message.guild.id}).then(() => {
                return message.channel.send("Leveling roles cleared successfully!");
            }).catch(() => {
                return message.channel.send("There was some kind of issue in deleting your server's leveling roles. Contact my devs if the problem persists!");
            });
        }

        return message.channel.send(`Invalid arg! Syntax: \`${prefix}levelrole <set|view|remove|clear>\``);
    }
};