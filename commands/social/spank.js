const Discord = require('discord.js');

const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const VC = require('../../models/vscount');

const makeId = require('../../util/makeid');

module.exports = {
    name: "spank",
    help: "Tell someone they're being a little too naughty :3 by mentioning someone to spank!",
    meta: {
        category: 'Social',
        description: "Give someone a spanking :v",
        syntax: '`spank <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'spank'}) ? await Saves.findOne({name: 'spank'}) : new Saves({name: 'spank'});
        let saves = savess.saves;
        if (!args.length) {return message.channel.send("You have to mention someone to spank!");}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("Please make sure you're in a server so you can mention someone other than me to spank!");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("That user is not in this server!");}
            if (message.author.id === mention.id) {return message.reply("You turn around and... whoop your own ass? Nah, I don't think it really works.");}
            let spanks = await VC.findOne({uid: message.author.id, countOf: 'spank'}) || new VC({uid: message.author.id, countOf: 'spank'});
            spanks.against[mention.id] = spanks.against[mention.id] ? spanks.against[mention.id] + 1 : 1;
            spanks.total++;
            spanks.markModified(`against.${mention.id}`);
            spanks.save();
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} gives ${message.guild.members.cache.get(mention.id).displayName} a spank!`, message.author.avatarURL())
                .setDescription(`You've spanked them **${spanks.against[mention.id] === 1 ? 'once' : `${spanks.against[mention.id]} times!`}**`)
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('52c7bb')
                .setFooter(`${spanks.total} spank${spanks.total === 1 ? '' : 's'} total`)
            );
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new spank GIFs.");}
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