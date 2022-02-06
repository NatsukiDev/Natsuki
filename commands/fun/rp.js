const Discord = require('discord.js');

const RP = require("../../models/rpch");

const {Tag} = require('../../util/tag');
const {TagFilter} = require('../../util/tagfilter');
const ask = require('../../util/ask');

module.exports = {
    name: "rp",
    aliases: ['roleplay'],
    meta: {
        category: 'Fun',
        description: "Add and edit characters for roleplaying",
        syntax: '`rp <add|enable|edit|delete|view|list>`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Roleplay Characters")
        .setDescription("Add and edit characters to roleplay with!")
        .addField("Syntax", "`rp <add|enable|edit|delete|view|list>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}rp <add|enable|edit|delete|view|list>\``);}
        if (['add', 'a', 'n', 'new'].includes(args[0].toLowerCase())) {
            let tags = true;
            let options = new TagFilter([
                new Tag(['i', 'img', 'image', 'pfp', 'thumbnail', 't', 'thumb'], 'image', 'append'),
                new Tag(['n', 'name'], 'name', 'append'),
                new Tag(['p', 'prefix'], 'prefix', 'append')
            ]).test(args.join(" "));
            if (!options.image || !options.name || !options.prefix) {
                tags = false;
                const name = await ask(message, "What is the character's name?", 60000, false, undefined, true); if (!name) {return;}
                if (name.length > 75) {return message.channel.send("That name is a little too long.");}
                options.name = name;
                
                let prefix = await ask(message, "What is the character's prefix? This is how you will use the character.", 60000, false, undefined, true); if (!prefix) {return;}
                if (prefix.length > 8) {return message.channel.send("Your prefix should be less than 8 characters.");}
                if (!prefix.match(/^[a-zA-Z0-9-_]+$/)) {return message.channel.send("Your prefix must contain only alphanumeric characters.");}
                options.prefix = prefix.toLowerCase();

                let imp = await message.channel.send("Please send an image for the character's profile picture. **Do not** send NSFW.");
                try {
                    const im = await message.channel.awaitMessages({filter: m => m.author.id === message.author.id, time: 60000, max: 1, errors: ['time']});
                    imp.delete().catch(() => {});
                    if (!im.first().attachments.size) {return message.channel.send("You must directly upload an image to use for the profile picture.");}
                    options.image = im.first().attachments.first().url;
                }
                catch {imp.delete().catch(() => {}); return message.reply("Your character creation timed out.");}
            } else {
                if (options.prefix.length > 8) {return message.channel.send("Your prefix should be less than 8 characters.");}
                if (!options.prefix.match(/^[a-zA-Z0-9-_]+$/)) {return message.channel.send("Your prefix must contain only alphanumeric characters.");}
            }

            if (!options.image.startsWith('https://cdn.discordapp.com/attachments/')) {return message.channel.send(tags ? "You must provide a cdn.discordapp.com link." : "It seems you didn't upload an image, or there was an error on my side. If the problem persists, please contact my developers.");}

            let rp = await RP.findOne({uid: message.author.id}) || new RP({uid: message.author.id});
            if (rp.chars[options.prefix]) {return message.channel.send("You already have a character with that prefix. Please try again with a different prefix.");}
            rp.chars[options.prefix] = options;
            rp.markModified(`chars.${options.prefix}`);
            rp.save();

            return message.channel.send(`${options.name} has been added successfully to your characters list. To use this character, you'll need to be in a channel that is RP-enabled. \`${options.prefix}: <message>\``);
        } else if (['list', 'l'].includes(args[0].toLowerCase())) {
            let rp = await RP.findOne({uid: message.author.id});
            if (!rp) {return message.channel.send("You don't have any characters made!");}
            let n = message.member ? message.member.displayName : message.author.username;
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `${n}${n.endsWith('s') ? "'" : "'s"} RP Characters`, iconURL: (message.member || message.author).displayAvatarURL({dynamic: true})})
                .setDescription(Object.keys(rp.chars).map(ch => `\`${ch}\`: ${rp.chars[ch].name}`).join(','))
                .setColor('c375f0')
                .setFooter({text: "Natsuki"})
                .setTimestamp()
            ]});
        } else if (['view', 'v'].includes(args[0].toLowerCase())) {
            let rp = await RP.findOne({uid: message.author.id});
            if (!rp) {return message.channel.send("You don't have any characters made!");}
            if (!args[1] || !rp.chars[args[1].toLowerCase()]) {return message.channel.send("You don't have a character with that prefix.");}
            let ch = rp.chars[args[1]];
            let n = message.member ? message.member.displayName : message.author.username;
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `${n}${n.endsWith('s') ? "'" : "'s"} RP Character`, iconURL: (message.member || message.author).displayAvatarURL({dynamic: true})})
                .setTitle(ch.name)
                .setColor('c375f0')
                .setFooter({text: "Natsuki"})
                .setImage(ch.image)
                .setTimestamp()
            ]});
        } else if (['edit', 'e'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send(`Syntax: \`${prefix}rp edit <char> <>\``)}
        } else if (['delete', 'd'].includes(args[0].toLowerCase())) {

        } else if (['enable', 'en'].includes(args[0].toLowerCase())) {

        }

        return message.channel.send(`Invalid arg! Syntax: \`${prefix}rp <add|enable|edit|delete|view|list>\``);
    }
};