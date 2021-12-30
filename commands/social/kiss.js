const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "kiss",
    help: "Ask for a kiss with `{{p}}kiss`, or give one by mentioning someone!",
    meta: {
        category: 'Social',
        description: "Give someone a kiss, or show that you're looking for one. Best of luck pal!",
        syntax: '`kiss <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'kiss'}) ? await Saves.findOne({name: 'kiss'}) : new Saves({name: 'kiss'});
        let saves = savess.saves;
        if (!args.length) {
            return message.channel.send(message.guild ? {embeds: [new Discord.MessageEmbed()
                    .setTitle(`${message.guild ? message.member.displayName : message.author.username} wants a kiss!`)
                    .setThumbnail(message.author.avatarURL({size: 2048}))
                    .setDescription(`Give them a little kiss with \`${prefix}kiss @${message.member.displayName}\`!`)
                    .setColor('c375f0')
                    .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
                    .setTimestamp()]}
                : "I'm not really into that kind of thing. Maybe try asking in a server?"
            );}
        if (mention && args[0].match(/^<@!?\d+>$/)) {
            if (!message.guild) {return message.reply("Please make sure you're in a server so you can mention someone other than me to kiss!");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("That user is not in this server!");}
            if (message.author.id === mention.id) {return message.reply("A self-kiss ought to be a little hard, don't you think?");}
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `${message.guild ? message.member.displayName : message.author.username} kisses ${message.guild.members.cache.get(mention.id).displayName}`, iconURL: message.author.avatarURL()})
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('d428a0')
            ]});
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Natsuki Developer in order to add new kiss GIFs.");}
            let e = true;
            let id;
            while (e === true) {id = makeId(6); if (!saves.has(id)) {e = false;}}
            args.shift();
            saves.set(id, args.join(" ").trim());
            savess.saves = saves;
            savess.save();
            return message.channel.send("Save added!");
        }
    }
};