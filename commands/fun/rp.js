const Discord = require('discord.js');

const RP = require("../../models/rpch");
const RPC = require('../../models/rpconfig');

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
                if (name.length > 50) {return message.channel.send("That name is a little too long.");}
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
            if (options.image.length > 350) {return message.channel.send("That image URL is a little too long.");}

            let rp = await RP.findOne({uid: message.author.id}) || new RP({uid: message.author.id});
            if (rp.chars[options.prefix]) {return message.channel.send("You already have a character with that prefix. Please try again with a different prefix.");}
            if (Object.keys(rp.chars).length >= 20) {return message.channel.send("The current maximum of characters is 20, and you've reached that maximum. Sorry!");}
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
            const rp = await RP.findOne({uid: message.author.id});
            if (!rp || !Object.keys(rp.chars).length) {return message.channel.send("You don't have any characters to edit.");}
            if (!args[1]) {return message.channel.send("You must provide the prefix of a character to edit!");}
            if (!rp.chars[args[1].toLowerCase()]) {return message.channel.send("A character with that prefix doesn't exist.");}
            let char = rp.chars[args[1].toLowerCase()];

            if (!args[2]) {return message.channel.send(`Syntax: \`${prefix}rp edit <char> <prefix|image|name>\``);}

            if (['p', 'prefix'].includes(args[2].toLowerCase())) {
                let old = char.prefix;
                let prefix;
                if (!args[3]) {
                    prefix = await ask(message, "What prefix would you like to set?", 60000);
                    if (!prefix) {return;}
                } else {prefix = args[3];}
                prefix = prefix.toLowerCase();
                if (prefix.length > 8) {return message.channel.send("Your prefix should be less than 8 characters.");}
                if (!prefix.match(/^[a-zA-Z0-9-_]+$/)) {return message.channel.send("Your prefix must contain only alphanumeric characters.");}
                if (prefix === old) {return message.channel.send("That's the same prefix you already had, silly!");}
                char.prefix = prefix;
                delete rp.chars[old];
                rp.chars[prefix] = char;
                ['chars', `chars.${old}`, `chars.${prefix}`].forEach(x => rp.markModified(x));
                rp.save();
                return message.channel.send("Prefix saved!");
            } else if (['i', 'image', 'img'].includes(args[2].toLowerCase())) {
                let image;
                if (!args[3]) {
                    image = await ask(message, "What image would you like to set?", 60000);
                    if (!image) {return;}
                } else {image = args[3];}
                if (!image.startsWith('https://cdn.discordapp.com/attachments/')) {return message.channel.send("You must provide a cdn.discordapp.com link.");}
                if (image.length > 350) {return message.channel.send("That image URL is a little too long.");}
                rp.chars[char.prefix].image = image;
                rp.markModified(`chars.${char.prefix}`);
                rp.save();
                return message.channel.send("Image saved!");
            } else if (['n', 'name'].includes(args[2].toLowerCase())) {
                args = args.slice(3);
                let name;
                if (!args[0]) {
                    name = await ask(message, "What name would you like to set?", 60000);
                    if (!name) {return;}
                } else {name = args.join(" ");}
                if (name.length > 50) {return message.channel.send("That name is a little too long.");}
                rp.chars[char.prefix].name = name;
                rp.markModified(`chars.${char.prefix}`);
                rp.save();
                return message.channel.send("Name saved!");
            } else {return message.channel.send(`Invalid arg! Syntax: \`${prefix}rp edit <char> <prefix|image|name>\``);}
        } else if (['delete', 'd'].includes(args[0].toLowerCase())) {
            const rp = await RP.findOne({uid: message.author.id});
            if (!rp || !Object.keys(rp.chars).length) {return message.channel.send("You don't have any characters to delete.");}
            if (!args[1]) {return message.channel.send("You must provide the prefix of a character to delete!");}
            if (!rp.chars[args[1].toLowerCase()]) {return message.channel.send("A character with that prefix doesn't exist.");}
            let char = rp.chars[args[1].toLowerCase()];
            let conf = await ask(message, `Are you sure you want to delete ${char.name}?`, 60000);
            if (!conf) {return;}
            if (!['yes', 'y', 'sure', 'mhm', 'ye'].includes(conf.toLowerCase())) {return message.channel.send("Okay, I won't do anything then.");}
            delete rp.chars[char.prefix];
            rp.markModified(`chars.${char.prefix}`);
            rp.save();
            return message.channel.send("I've deleted that character for you.");
        } else if (['enable', 'en'].includes(args[0].toLowerCase())) {
            if (!message.guild) {return message.channel.send("You must be in a server in order to enable RP character usage for a specific channel.");}
            if (!message.member.permissionsIn(message.channel.id).has("MANAGE_WEBHOOKS")) {return message.channel.send("You must have permissions to edit webhooks here in order to do that.");}
            if (!message.guild.me.permissions.has("MANAGE_WEBHOOKS")) {return message.channel.send("I don't have permissions to manage webhooks in this server.");}
            if (!message.guild.me.permissionsIn(message.channel.id).has("MANAGE_WEBHOOKS")) {return message.channel.send("I don't have the permissions to edit webhooks in this channel.");}
            const webhooks = await message.channel.fetchWebhooks();
            if (webhooks.find(wh => wh.token)) {return message.channel.send("It would seem RP is already enabled in this channel. If it's not working in this channel, please contact my developers.");}
            try {
                return message.channel.createWebhook("Natsuki RP Webhook", {avatar: client.user.avatarURL({size: 2048})})
                    .then(async () => {
                        const config = await RPC.findOne({gid: message.guild.id}) || new RPC({gid: message.guild.id});
                        config.channels.push(message.channel.id);
                        config.markModified('channels');
                        if (!client.misc.cache.rp.has(message.guild.id)) {client.misc.cache.rp.set(message.guild.id, []);}
                        client.misc.cache.rp.get(message.guild.id).push(message.channel.id);
                        config.save();
                        return message.channel.send("RP features were successfully enabled in this channel.");
                    })
                    .catch(message.channel.send("There was an error doing that. Please make sure my permissions are properly set in this channel and try again. If the error persists, please contact my developers."));
            } catch {return message.channel.send("There was an error doing that. Please make sure my permissions are properly set in this channel and try again. If the error persists, please contact my developers.");}
        }

        return message.channel.send(`Invalid arg! Syntax: \`${prefix}rp <add|enable|edit|delete|view|list>\``);
    }
};