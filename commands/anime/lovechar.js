const Discord = require('discord.js');

const CF = require("../../models/charfav");
const Char = require('../../models/char');

const ask = require('../../util/ask');
const chs = require('../../util/anime/charsearch');
const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "lovechar",
    aliases: ['lc', 'lovecharacter', 'lchar', 'lch', 'favchar', 'favoritechar', 'favoritecharacter', 'fch', 'favch'],
    meta: {
        category: 'Anime',
        description: "Show your love for an anime character",
        syntax: '`lovechar <charName|view>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Character Favoriting")
        .setDescription("Show your love for a character with this command. A replica of running `char love <charName>`.")
        .addField("Syntax", "`lovechar <charName|view>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (args[0] && ['v', 'view'].includes(args[0].toLowerCase())) {
            let cf = await CF.findOne({uid: mention ? mention.id : message.author.id});
            if (!cf || !cf.loved.length) {return message.channel.send(`Looks like ${mention ? 'they' : 'you'} haven't favorited any characters!`);}
            let chars = cf.loved;
            chars = chars.map(tc => client.misc.cache.charsID.get(tc));
            let n = mention ? message.guild ? message.mentions.members.first().displayName : message.mentions.users.first().username : message.guild ? message.member.displayName : message.author.username;
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setAuthor({name: `${n}${n.endsWith('s') ? '' : "'s"} Favorited Characters`, iconURL: mention ? mention.avatarURL() : message.author.avatarURL()})
                    .setDescription(`**${chars.length} character${chars.length === 1 ? '': 's'} favorited**\n\n${chars.join(", ")}`)
                    .setColor('c375f0')
                    .setFooter({text: "Natsuki"})
                    .setTimestamp()
            ]});
        } else {
            if (!args[0]) {
                let tempchar = await ask(message, "What character would you like to add to your favorites list?", 60000, false, true);
                if (!tempchar) {return;}
                args = tempchar.split(/\s+/g);
            }
            let asr = await chs(message, client, args.join(" ").trim().toLowerCase(), -700);
            let fn;
            if (asr === 0) {
                return message.channel.send("That search returned no results! Try again?");
            } else if (asr instanceof Pagination) {
                await asr.start({user: message.author.id, startPage: 1, endTime: 60000});
                await asr.message.react('✅');
                let noticeDel = await message.channel.send("React with :white_check_mark: when you've found the character you want!");
                let arc;
                try {arc = await asr.message.awaitReactions({filter: (r, u) => ['✅', '⏹'].includes(r.emoji.name), max: 1, errors: ['time']});}
                catch {return message.reply("Looks like you didn't find the character you were looking for.");}
                collected = arc.first().emoji.name;
                if (collected === '✅') {
                    fn = client.misc.cache.chars.get(asr.getCurrentPage().title.trim());
                    await asr.stop();
                    await asr.message.delete().catch(() => {});
                    await noticeDel.delete().catch(() => {});
                }
                else {return message.reply("Looks like you didn't find the character you were looking for.");}
            } else {
                let preConfEmbed = await message.channel.send({embeds: [asr.embed]});
                let conf = await ask(message, "Is this the character you meant?", 60000, undefined, undefined, true);
                if (!['y', 'yes', 'ye', 'n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("You must specify yes or no! Please try again.");}
                conf = ['y', 'yes', 'ye'].includes(conf.trim().toLowerCase());
                preConfEmbed.delete().catch(() => {});
                if (!conf) {return message.channel.send("Well, I've got nothing, then. If that doesn't match the character you're looking for then I would try again with a more narrow search.");}
                fn = asr.id;
            }
            let cf = await CF.findOne({uid: message.author.id}) || new CF({uid: message.author.id});
            if (cf.loved.includes(fn)) {return message.channel.send("Looks like that character is already on your loved list!");}
            let tfc = await Char.findOne({id: fn});
            tfc.loved += 1;
            tfc.markModified('loved');
            tfc.save();
            cf.loved.push(fn);
            cf.markModified('loved');
            cf.save();
            return message.channel.send(`I've added **${tfc.name}** to your loved/favorited character list!`);
        }
    }
};