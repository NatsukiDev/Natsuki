const Discord = require('discord.js');

const Mod = require('../../models/mod');

const {TagFilter} = require('../../util/tagfilter');
const {Tag} = require('../../util/tag');

module.exports = {
    name: "warn",
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Warnings")
        .setDescription("Warn misbehaving members that what they are doing is wrong, and have it stored in a database in order to see a list of all their past warnings")
        .addField("Syntax", "`warn <@member> <warningMessage|check|clear>`")
        .addField("Notice", "You must be a server administrator in order to use this command."),
    meta: {
        category: 'Moderation',
        description: "Warn misbehaving members that what they are doing is wrong, and have it stored in a database in order to see a list of all their past warnings",
        syntax: '`warn <@member> <warningMessage|check|clear>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.channel.send("This is a server-only command.");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}warn <@member> <warningMessage|check|clear>\``);}
        if (!message.member.permissions.has("ADMINISTRATOR")) {return message.reply("You must be a server administrator to use this command.");}
        if (args.length < 2 && !['check', 'c', 'list', 'l', 'clear', 'e', 'empty'].includes(args[0].toLowerCase())) {return message.channel.send("You must provide a reason for warning the user, or `check` or `clear`.");}

        let user = message.mentions.members.first() && args[0].match(/^<@(?:!)(?:\d+)>$/) ? message.mentions.members.first() : message.guild.members.cache.has(args[0]) ? message.guild.members.cache.get(args[0]) : null;
        if (!user && args.length > 1) {return message.channel.send("Either you didn't mention a user, or I can't find that user!");}
        if (args.length > 1) {args.shift();}

        if (['check', 'c', 'list', 'l'].includes(args[0].toLowerCase())) {
            user = user ? user : message.member;
            let mh = await Mod.findOne({gid: message.guild.id});
            if (!mh || !Object.keys(mh.warnings).length) {return message.reply("There are no warnings available in this server.");}

            if (!mh.warnings[user.id] || !mh.warnings[user.id].length) {return message.reply(`${user.id === message.author.id ? 'You have' : 'That user has'} never been warned in this server.`);}
            //console.log(mh.cases, mh.warnings);
            let ws = '';
            let cwc = 0;
            let warning; for (warning of mh.warnings[user.id]) {
                let tcase = mh.cases[warning - 1];
                if (tcase.status !== "Cleared") {
                    ws += `\`Case #${warning}\` - Issued by <@${tcase.moderators[0]}>\n${tcase.reason}\n\n`;
                } else {cwc++;}
            }
            if (cwc > 0) {ws += '*Plus ' + cwc + ' other warnings that have been cleared.*';}
            if (cwc === mh.warnings[user.id].length) {return message.reply("That user has no uncleared warnings.");}
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("User Warnings")
                .setThumbnail(client.users.cache.get(user.id).avatarURL({size: 1024}))
                .setDescription(`For ${user.displayName}`)
                .addField("Warnings", ws)
                .setColor("c375f0")
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()
            );
        }

        else if (['clear', 'e', 'empty'].includes(args[0].toLowerCase())) {
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

        else {
            if (user.id === message.author.id) {return message.channel.send("You can't warn yourself!");}
            if (user.id === client.user.id) {return message.channel.send("You can't warn me, silly! What do you want me to do, spank myself?");}
            if (client.users.cache.get(user.id).bot) {return message.channel.send("You can't warn a bot!");}

            let options = new TagFilter([
                new Tag(['r', 'reason'], 'reason' ,'append'),
                new Tag(['nd', 'nm', 'nomessage', 'nodm'], 'nodm' ,'toggle'),
                new Tag(['silent', 's'], 'silent', 'toggle'),
                new Tag(['note', 'n', 'notes'], 'notes', 'append')
            ]).test(args.join(" "));

            if (Object.keys(options).length && (!options.reason || !options.reason.length)) {return message.channel.send("You *must* use -r or -reason to specify your reason if you include any other tags. Please try again!");}
            let reason = options.reason && options.reason.length ? options.reason : args.join(" ");
            if (reason.length > 200) {return message.reply("Please keep your reason short and sweet - less than 200 characters, please!");}
            if (options.notes && options.notes.length > 150) {return message.reply("Please keep your notes short and sweet - less than 150 characters, please!");}
            let notes = options.notes && options.notes.length ? [options.notes] : [];

            let mh = await Mod.findOne({gid: message.guild.id}) || new Mod({gid: message.guild.id});

            let mhcases = mh.cases;
            mhcases.push({
                members: [user.id],
                punishment: "Warned",
                reason: reason,
                status: "Closed",
                moderators: [message.author.id],
                notes: notes,
                history: [`${new Date().toISOString()} - ${message.author.username} - Created case`, `${new Date().toISOString()} - ${message.author.username} - Warned ${client.users.cache.get(user.id).username}`],
                issued: new Date().toUTCString()
            });

            let mhwarnings = mh.warnings;
            let mhwarningsk = Object.keys(mhwarnings);

            if (mhwarningsk.includes(user.id)) {let tw = mhwarnings[user.id]; tw.push(mhcases.length); mhwarnings[user.id] = tw;}
            else {mhwarnings[user.id] = [mhcases.length];}

            mh.warnings = mhwarnings;
            mh.warnings[user.id] = mhwarnings[user.id];
            mh.cases = mhcases;

            if (!options.silent) {message.channel.send(`Case ${mh.cases.length} - Member has been warned. Reason: \`${reason}\``);}
            if (!options.silent && !options.nodm) {client.users.cache.get(user.id).send(`\`${message.author.username}\` has warned you in \`${message.guild.name}\`. Reason: **${reason}**`);}
            
            mh.markModified(`warnings.${user.id}`);

            mh.save();
            return null;
        }
    }
};