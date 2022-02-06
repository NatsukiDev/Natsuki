const Discord = require('discord.js');

const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const VC = require('../../models/vscount');

const makeId = require('../../util/makeid');

module.exports = {
    name: "hug",
    help: "Tell others that you need a hug with `{{p}}hug`, or give one by mentioning someone to hug!",
    meta: {
        category: 'Social',
        description: "Give someone a hug, or tell others that you need one! We've got your back :p",
        syntax: '`hug <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'hug'}) ? await Saves.findOne({name: 'hug'}) : new Saves({name: 'hug'});
        let saves = savess.saves;
        if (!args.length) {
            return message.channel.send(message.guild ? {embeds: [new Discord.MessageEmbed()
            .setTitle(`${message.guild ? message.member.displayName : message.author.username} needs a hug!`)
            .setThumbnail(message.author.displayAvatarURL({size: 2048}))
            .setDescription(`Show them some love with \`${prefix}hug @${message.member.displayName}\`!`)
            .setColor('c375f0')
            .setFooter({text: "Natsuki", iconURL: client.user.displayAvatarURL()})
            .setTimestamp()]}
            : "Sorry, but I'm a bot, and I can't hug you. Go into a server and ask for some hugs!"
        );}
        if (mention && args[0].match(/^<@!?\d+>$/)) {
            if (!message.guild) {return message.reply("Please make sure you're in a server so you can mention someone other than me to hug!");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("That user is not in this server!");}
            if (message.author.id === mention.id) {return message.reply("Sorry if you're that lonely, but you can't hug yourself!");}
            let hugs = await VC.findOne({uid: message.author.id, countOf: 'hug'}) || new VC({uid: message.author.id, countOf: 'hug'});
            hugs.against[mention.id] = hugs.against[mention.id] ? hugs.against[mention.id] + 1 : 1;
            hugs.total++;
            hugs.markModified(`against.${mention.id}`);
            hugs.save();
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `${message.guild ? message.member.displayName : message.author.username} gives ${message.guild.members.cache.get(mention.id).displayName} a hug!`, iconURL: message.author.displayAvatarURL()})
                .setDescription(`You've hugged them **${hugs.against[mention.id] === 1 ? 'once' : `${hugs.against[mention.id]} times!`}**`)
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('52c7bb')
                .setFooter({text: `${hugs.total} hug${hugs.total === 1 ? '' : 's'} total`})
            ]});
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.staff) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Natsuki Staff member in order to add new hug GIFs.");}
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