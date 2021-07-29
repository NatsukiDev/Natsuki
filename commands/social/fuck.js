const Discord = require('discord.js');

const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const VC = require('../../models/vscount');

const makeId = require('../../util/makeid');

module.exports = {
    name: "fuck",
    help: "Tell others you're horny with `{{p}}fuck`, or bang someone by mentioning someone to fuck!",
    meta: {
        category: 'Social',
        description: "Show someone you REALLY love them ;)",
        syntax: '`fuck <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'fuck'}) ? await Saves.findOne({name: 'fuck'}) : new Saves({name: 'fuck'});
        let saves = savess.saves;
        if (!args.length) {
            return message.channel.send(message.guild ? new Discord.MessageEmbed()
            .setTitle(`${message.guild ? message.member.displayName : message.author.username} is horny!`)
            .setThumbnail(message.author.avatarURL({size: 2048}))
            .setDescription(`Show them some love with \`${prefix}fuck @${message.member.displayName}\`!`)
            .setColor('dda0dd')
            .setFooter('Luno', client.user.avatarURL())
            .setTimestamp()
            : "You can't bang me.......only Crescent can."
        );}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("Can't bang someone that doesn't exist.");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("They ran away from you..I wonder why.");}
            if (message.author.id === mention.id) {return message.reply("Go fuck yourself..oh wait you can't.");}
            let fuck = await VC.findOne({uid: message.author.id, countOf: 'fuck'}) || new VC({uid: message.author.id, countOf: 'fuck'});
            fuck.against[mention.id] = fuck.against[mention.id] ? fuck.against[mention.id] + 1 : 1;
            fuck.total++;
            fuck.markModified(`against.${mention.id}`);
            fuck.save();
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} bangs ${message.guild.members.cache.get(mention.id).displayName}!...Kinky! `, message.author.avatarURL())
                .setDescription(`You've banged them **${fuck.against[mention.id] === 1 ? 'once' : `${fuck.against[mention.id]} times!`}**`)
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('dda0dd')
                .setFooter(`${fuck.total} fuck${fuck.total === 1 ? '' : 's'} total`)
            );
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new bang GIFs.");}
            let e = true;
            let id;
            while (e === true) {id = makeId(6); if (!saves.has(id)) {e = false;}}
            args.shift();
            saves.set(id, args.join(" ").trim());
            savess.saves = saves;
            savess.save();
            return message.channel.send("Save added!.....master..");
        }
    }
};