const Discord = require('discord.js');
const UserData = require('../models/user');
const GuildData = require('../models/guild')

module.exports = {
    name: "blacklist",
    aliases: ['bl'],
    meta: {
        category: 'Developer',
        description: "Completely blocks a user or server from using Natsuki!",
        syntax: '`blacklist <user|guild> <add|delete> [@mention|ID]`',
        extra: null
    },
    help: "Disables a user from using Natsuki (Usage: `{{p}}blacklist <user|guild> <add|delete> [@mention|ID])`",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send("Syntax: `blacklist <user|guild> <add|delete> [@mention|ID]`");}

        let tu = await UserData.findOne({uid: message.author.id});

        if (['g', 'guild'].includes(args[0].toLowerCase())) {
            if (!tu || !tu.admin) {return message.channel.send('Sorry... you have to be a Natsuki Admin to do this!');}

            let guild = !args[1].match(/\d+/) ? message.guild ? message.guild : null : client.guilds.cache.has(args[1]) ? client.guilds.cache.get(args[1]) : null;
            if (!guild) {return message.channel.send("You must provide a guild ID or be in a guild that you wish to blacklist!");}

            let tg = await GuildData.findOne({gid: guild.id}) || new GuildData({gid: guild.id});

            if (args[1].match(/\d+/)) {args.shift();}
            if (!args[1]) {return message.channel.send("You must specify whether to `add` or `del` a guild's blacklist!");}

            if (message.guild.id === "762707532417335296") {return message.reply("You can't blacklist my support server!");}

            if (['a', 'add'].includes(args[1].toLowerCase())) {
                if (tg.blacklisted) {return message.reply("That guild is already blacklisted!");}
                tg.blacklisted = true;
                tg.save();
                client.misc.cache.bl.guild.push(message.guild.id);
                return message.channel.send("Gotcha! This server will not be able to use my commands!");
            }

            if (['r', 'rem', 'remove', 'd', 'del', 'delete'].includes(args[1].toLowerCase())) {
                if (!tg.blacklisted) {return message.reply("That guild isn't blacklisted in the first place!");}
                tg.blacklisted = false;
                tg.save();
                delete client.misc.cache.bl.guild[client.misc.cache.bl.guild.indexOf(message.guild.id)];
                return message.channel.send("I have graced your merciful request; this server can once again make use of my wonderous abilities!");
            }

            return message.channel.send("Valid args: `[guildID] <add|del>`");
        }

        if (['u', 'user'].includes(args[0].toLowerCase())) {
            args.shift();

            if (!args[1]) {return message.channel.send("You must specify whether to `add` or `del` a user's blacklist!");}

            function checkPerms(tu, bu) {
                if (!tu.developer && bu.support) {message.channel.send("You can't blacklist any member of staff unless you're a developer!"); return null;}
                if (!tu.admin) {message.channel.send("You must be at least admin to do that!"); return null;}
                if (bu.developer) {message.channel.send("Developers cannot be blacklisted!"); return null;}
            }

            if (['a', 'add'].includes(args[1].toLowerCase())) {
                let blacklistUser = args[0].match(/^<@(?:!?)(?:\d+)>$/) && mention && client.users.cache.has(mention.id) ? mention.id : client.users.cache.has(args[0]) ? client.users.cache.get(args[0]).id : null;
                if (!blacklistUser) {return message.reply("You must specify a user to blacklist!");}
                let usersData = await UserData.findOne( { uid: blacklistUser } ) || new UserData({uid: blacklistUser});

                if (!checkPerms(tu, usersData)) {return;}
                
                if (usersData.blacklisted === true) {return message.reply('they\'re already blacklisted :eyes:');}
                
                await UserData.findOneAndUpdate({ uid: blacklistUser }, { blacklisted: true }.catch(() => {}));
                client.misc.cache.bl.user.push(blacklistUser);

                return message.channel.send(`Another one bites the dust! **${blacklistUser.user.tag}** has been blacklisted!`)
            }

            if (['r', 'rem', 'remove', 'd', 'del', 'delete'].includes(args[1].toLowerCase())) {
                let blacklistedUser = args[0].match(/^<@(?:!?)(?:\d+)>$/) && mention && client.users.cache.has(mention.id) ? mention.id : client.users.cache.has(args[0]) ? client.users.cache.get(args[0]).id : null;
                if (!blacklistedUser) { return message.reply("You need to specify who you're letting free..." );}
                let userData = await UserData.findOne( { uid: blacklistedUser } ) || new UserData({uid: blacklistedUser});

                if (!checkPerms(tu, userData)) {return;}

                if(userData.blacklisted === false) {return message.reply('hate to break it you... they\'re not even blacklisted!');}

                await UserData.findOneAndUpdate({ uid: blacklistedUser }, { blacklisted: false }.catch(() => {}));
                delete client.misc.cache.bl.user[client.misc.cache.bl.user.indexOf(blacklistedUser)];

                return message.channel.send(`Alright, there you go, I unblacklisted **${blacklistedUser.user.tag}**`)
            }

            return message.channel.send("Valid args: `<userID|@user> <add|del>`");
        }

        return message.channel.send("Valid args: `<user|guild>`");
    }};