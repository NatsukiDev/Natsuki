const Discord = require('discord.js');

const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const VC = require('../../models/vscount');

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
            return message.channel.send(message.guild ? new Discord.MessageEmbed()
            .setTitle(`${message.guild ? message.member.displayName : message.author.username} wants a kiss!`)
            .setThumbnail(message.author.avatarURL({size: 2048}))
            .setDescription(`Give them a little kiss with \`${prefix}kiss @${message.member.displayName}\`!`)
            .setColor('328ba8')
            .setFooter('Luno', client.user.avatarURL())
            .setTimestamp()
            : "Sorry..my lips are for Crescent only!"
        );}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("I'd rather kiss in public..maybe try in a server?");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("That person must have ran from your love..");}
            if (message.author.id === mention.id) {return message.reply("A self-kiss ought to be a little hard, don't you think?");}
            let kiss = await VC.findOne({uid: message.author.id, countOf: 'kiss'}) || new VC({uid: message.author.id, countOf: 'kiss'});
            kiss.against[mention.id] = kiss.against[mention.id] ? kiss.against[mention.id] + 1 : 1;
            kiss.total++;
            kiss.markModified(`against.${mention.id}`);
            kiss.save();
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} gives ${message.guild.members.cache.get(mention.id).displayName} a kiss!`, message.author.avatarURL())
                .setDescription(`You've kissed them **${kiss.against[mention.id] === 1 ? 'once' : `${kiss.against[mention.id]} times!`}**`)
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('ac0f0f')
                .setFooter(`${kiss.total} kisse${kiss.total === 1 ? '' : 's'} total`)
            );
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new kissing GIFs.");}
            let e = true;
            let id;
            while (e === true) {id = makeId(6); if (!saves.has(id)) {e = false;}}
            args.shift();
            saves.set(id, args.join(" ").trim());
            savess.saves = saves;
            savess.save();
            return message.channel.send("Save added master!");
        }
    }
};