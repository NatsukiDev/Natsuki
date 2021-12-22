const Discord = require('discord.js');

const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const VC = require('../../models/vscount');

const makeId = require('../../util/makeid');

module.exports = {
    name: "pat",
    help: "Give someone a pat to let them know they're wholesome ^^",
    meta: {
        category: 'Social',
        description: "Give someone some pats, or ask for some",
        syntax: '`pat <@user>`',
        extra: null
    },
    aliases: ['p', 'pet'],
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'pat'}) ? await Saves.findOne({name: 'pat'}) : new Saves({name: 'pat'});
        let saves = savess.saves;
        if (!args.length) {
            return message.channel.send(message.guild ? {embeds: [new Discord.MessageEmbed()
            .setTitle(`${message.guild ? message.member.displayName : message.author.username} wants some pats!`)
            .setThumbnail(message.author.avatarURL({size: 2048}))
            .setDescription(`Give them some with \`${prefix}pat @${message.member.displayName}\`!`)
            .setColor('c375f0')
            .setFooter('Natsuki', client.user.avatarURL())
            .setTimestamp()]}
            : "Sorry, but I'm only able to pat one person, and it's not you ^^"
        );}
        if (mention && args[0].match(/^<@!?\d+>$/)) {
            if (!message.guild) {return message.reply("Please make sure you're in a server so you can mention someone other than me to pat!");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("That user is not in this server!");}
            if (message.author.id === mention.id) {return message.reply("Self pats just don't work mate. Maybe try asking for some!");}
            let pats = await VC.findOne({uid: message.author.id, countOf: 'pat'}) || new VC({uid: message.author.id, countOf: 'pat'});
            pats.against[mention.id] = pats.against[mention.id] ? pats.against[mention.id] + 1 : 1;
            pats.total++;
            pats.markModified(`against.${mention.id}`);
            pats.save();
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} pats ${message.guild.members.cache.get(mention.id).displayName}!`, message.author.avatarURL())
                .setDescription(`You've given them **${pats.against[mention.id]}** pat${pats.against[mention.id] === 1 ? '' : 's'}!`)
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('52c7bb')
                .setFooter(`${pats.total} pat${pats.total === 1 ? '' : 's'} total`)
            ]});
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Natsuki Developer in order to add new hug GIFs.");}
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