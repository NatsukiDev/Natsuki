const Discord = require('discord.js');

const AF = require("../../models/anifav");
const AniData = require('../../models/anime');

const ask = require('../../util/ask');
const ans = require('../../util/anime/anisearch');
const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "watched",
    aliases: ['watchedani', 'fl', 'finishedani', 'finshedlist'],
    meta: {
        category: 'Anime',
        description: "Add an anime to your list of finished anime",
        syntax: '`watched <anime>`',
        extra: null
    },
    help: "Add an anime to your list of finished animes with {{p}}watched.",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (args[0] && ['v', 'view'].includes(args[0].toLowerCase())) {
            if (mention) {args.shift();}
            let user = mention || message.author;
        }

        if (!args[0]) {
            let tempchar = await ask(message, "What anime would you like to add to your finished list?", 60000, false, true);
            if (!tempchar) {return;}
            args = tempchar.split(/\s+/g);
        }
        let asr = await ans(message, client, args.join(" ").trim().toLowerCase(), -700, 0);
        let fn;
        if (asr === 0) {
            return message.channel.send("That search returned no results! Try again?");
        } else if (asr instanceof Pagination) {
            await asr.start({user: message.author.id, startPage: 1, endTime: 60000});
            await asr.message.react('✅');
            await message.channel.send("React with :white_check_mark: when you've found the anime you want!");
            let arc;
            try {arc = await asr.message.awaitReactions({filter: (r) => ['✅', '⏹'].includes(r.emoji.name), max: 1, errors: ['time']});}
            catch {return message.reply("Looks like you didn't find the anime you were looking for.");}
            collected = arc.first().emoji.name;
            if (collected === '✅') {
                fn = client.misc.cache.anime.get(asr.getCurrentPage().title.trim());
                asr.stop();
            }
            else {return message.reply("Looks like you didn't find the anime you were looking for.");}
        } else {
            await message.channel.send({embeds: [asr.embed]});
            let conf = await ask(message, "Is this the anime you meant?", 60000);
            if (!['y', 'yes', 'ye', 'n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("You must specify yes or no! Please try again.");}
            conf = ['y', 'yes', 'ye'].includes(conf.trim().toLowerCase());
            if (!conf) {return message.channel.send("Well, I've got nothing, then. If that doesn't match the anime you're looking for then I would try again with a more narrow search.");}
            fn = asr.id;}
        let af = await AF.findOne({uid: message.author.id}) || new AF({uid: message.author.id});
        if (af.watched.includes(fn)) {return message.channel.send("Looks like that anime is already on your finished list!");}
        let tfc = await AniData.findOne({id: fn});
        tfc.watchers += 1;
        tfc.markModified('watchers');
        tfc.save();
        af.watched.push(fn);
        af.markModified('watched');
        af.save();
        return message.channel.send(`I've added **${tfc.name}** to your list of finished animes!`);
    }
};