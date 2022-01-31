const Discord = require('discord.js');

const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const VC = require('../../models/vscount');

const makeId = require('../../util/makeid');

module.exports = {
    name: "snuggle",
    help: "Tell others that you need a snuggle with `{{p}}snuggle`, or give one by mentioning someone to snuggle!",
    aliases: ['cuddle'],
    meta: {
        category: 'Social',
        description: "Give someone a snuggle, or tell others that you need one! We've got your back :p",
        syntax: '`snuggle <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'snuggle'}) ? await Saves.findOne({name: 'snuggle'}) : new Saves({name: 'snuggle'});
        let saves = savess.saves;
        if (!args.length) {
            return message.channel.send(message.guild ? {embeds: [new Discord.MessageEmbed()
            .setTitle(`${message.guild ? message.member.displayName : message.author.username} needs a snuggle!`)
            .setThumbnail(message.author.avatarURL({size: 2048}))
            .setDescription(`Show them some love with \`${prefix}snuggle @${message.member.displayName}\`!`)
            .setColor('c375f0')
            .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
            .setTimestamp()]}
            : "Sorry, but I'm a bot, and I can't snuggle you. Go into a server and ask for some snuggles!"
        );}
        if (mention && args[0].match(/^<@!?\d+>$/)) {
            if (!message.guild) {return message.reply("Please make sure you're in a server so you can mention someone other than me to snuggle!");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("That user is not in this server!");}
            if (message.author.id === mention.id) {return message.reply("Sorry if you're that lonely, but you can't snuggle yourself!");}
            let snuggles = await VC.findOne({uid: message.author.id, countOf: 'snuggle'}) || new VC({uid: message.author.id, countOf: 'snuggle'});
            snuggles.against[mention.id] = snuggles.against[mention.id] ? snuggles.against[mention.id] + 1 : 1;
            snuggles.total++;
            snuggles.markModified(`against.${mention.id}`);
            snuggles.save();
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `${message.guild ? message.member.displayName : message.author.username} gives ${message.guild.members.cache.get(mention.id).displayName} a snuggle!`, iconURL: message.author.avatarURL()})
                .setDescription(`You've snuggled them **${snuggles.against[mention.id] === 1 ? 'once' : `${snuggles.against[mention.id]} times!`}**`)
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('52c7bb')
                .setFooter({text: `${snuggles.total} snuggle${snuggles.total === 1 ? '' : 's'} total`})
            ]});
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.staff) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Natsuki Staff member in order to add new snuggle GIFs.");}
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