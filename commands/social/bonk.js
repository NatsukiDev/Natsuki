const Discord = require('discord.js');

const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const VC = require('../../models/vscount');

const makeId = require('../../util/makeid');

module.exports = {
    name: "bonk",
    help: "Give someone a healthy bonk with `{{p}}bonk`!",
    meta: {
        category: 'Social',
        description: "Give someone a good bonking!",
        syntax: '`bonk <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'bonk'}) ? await Saves.findOne({name: 'bonk'}) : new Saves({name: 'bonk'});
        let saves = savess.saves;
        if (!args.length) {
            return message.channel.send(message.guild ? new Discord.MessageEmbed()
            .setTitle(`${message.guild ? message.member.displayName : message.author.username} needs a good bonk!`)
            .setThumbnail(message.author.avatarURL({size: 2048}))
            .setDescription(`Give them one with \`${prefix}bonk @${message.member.displayName}\`!`)
            .setColor('dda0dd')
            .setFooter('Luno', client.user.avatarURL())
            .setTimestamp()
            : "I fucking dare you to hit me."
        );}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("I dare you to hit me.");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("You missed your bonk..");}
            if (message.author.id === mention.id) {return message.reply("I should bonk you for attempting to self harm.");}
            let bonk = await VC.findOne({uid: message.author.id, countOf: 'bonk'}) || new VC({uid: message.author.id, countOf: 'bonk'});
            bonk.against[mention.id] = bonk.against[mention.id] ? bonk.against[mention.id] + 1 : 1;
            bonk.total++;
            bonk.markModified(`against.${mention.id}`);
            bonk.save();
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} bonks ${message.guild.members.cache.get(mention.id).displayName}!...ouch! `, message.author.avatarURL())
                .setDescription(`You've bonked them **${bonk.against[mention.id] === 1 ? 'once' : `${bonk.against[mention.id]} times!`}**`)
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('dda0dd')
                .setFooter(`${bonk.total} bonk${bonk.total === 1 ? '' : 's'} total`)
            );
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new bonk GIFs.");}
            let e = true;
            let id;
            while (e === true) {id = makeId(6); if (!saves.has(id)) {e = false;}}
            args.shift();
            saves.set(id, args.join(" ").trim());
            savess.saves = saves;
            savess.save();
            return message.channel.send("Ayy new ways to bonk people");
        }
    }
};