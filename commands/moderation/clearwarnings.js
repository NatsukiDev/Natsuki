const Discord = require('discord.js');

const Mod = require('../../models/mod');

module.exports = {
    name: "clearwarnings",
    aliases: ['clearwarn', 'cw', 'warnclear', 'wc', 'clearwarning'],
    meta: {
        category: 'Moderation',
        description: "Clear a user's warnings in your server.",
        syntax: '`clearwarnings <@user|userID>`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Warn Clearing")
        .setDescription("Clears the warnings of a user")
        .addField("Syntax", "`clearwarnings <@user|userID>`")
        .addField("Notice", "You must be a server moderator in order to use this command."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}clearwarnings <@user|userID>\``);}
        if (!message.member.permissions.has("MANAGE_MESSAGES") && !message.member.permissions.has("MANAGE_GUILD")) {return message.reply("You must be a server moderator (manage messages or manage server permissions) to use this command.");}

        let user = message.mentions.members.first() && args[0].match(/^<@(?:!)(?:\d+)>$/) ? message.mentions.members.first() : message.guild.members.cache.has(args[0]) ? message.guild.members.cache.get(args[0]) : null;
        if (!user) {return message.channel.send("Either you didn't mention a user, or I can't find that user!");}

        if (user.id === client.user.id) {return message.reply("don't worry about clearing any warnings from me... you can't give me warnings in the first place");}
        if (client.users.cache.get(user.id).bot) {return message.reply("it's not like a bot would have any warnings in the first place...");}
        
        user = user ? user : message.member;
        let mh = await Mod.findOne({gid: message.guild.id});
        if (!mh || !Object.keys(mh.warnings).length) {return message.reply("There are no warnings available in this server.");}

        if (!Object.keys(mh.warnings).includes(user.id) || !mh.warnings[user.id].length) {return message.reply(`${user.id === message.author.id ? 'You have' : 'That user has'} never been warned in this server.`);}

        let mhcases = mh.cases;
        let moddedcases = [];
        let cwc = 0; var wc = 0;
        let warning; for (warning of mh.warnings[user.id]) {
            if (mhcases[`${warning - 1}`].status !== "Cleared") {
                let tcase = mhcases[`${warning - 1}`];
                tcase.status = "Cleared";
                tcase.history.push(`${new Date().toISOString()} - ${message.author.username} - Cleared the warning.`);
                moddedcases.push(`${warning - 1}`);
                wc++;
                if (!tcase.moderators.includes(message.author.id)) {tcase.moderators.push(message.author.id);}
                mhcases[`${warning - 1}`] = tcase;
            } else {cwc++;}
        }
        if (cwc === mh.warnings[user.id].length) {return message.reply("That user has no uncleared warnings.");}

        if (moddedcases.length) {let c; for (c of moddedcases) {mh.markModified(`cases.${c}.history`);}}

        mh.cases = mhcases;
        mh.save();
        return message.reply(`Cleared ${wc} warnings from ${user.displayName}.`);
    }
};