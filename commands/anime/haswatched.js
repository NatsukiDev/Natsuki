const AF = require("../../models/anifav");
const AniData = require('../../models/anime');

const ask = require('../../util/ask');
const ans = require('../../util/anime/anisearch');
const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "haswatched",
    aliases: ['hw', 'chwatch', 'chwa'],
    meta: {
        category: 'Anime',
        description: "Check if you or another user has watched an anime",
        syntax: '`haswatched [@user|userID] <animeName>`',
        extra: null
    },
    cooldown: {
        time: 10000,
        silent: false
    },
    help: "Check if you or another user has watched an anime with `{{p}}haswatched`",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let user;
        if (args[0] && args[0].match(/<@!?\d+>|\d+/gm)) {
            user = message.guild ? (mention || client.users.cache.get(args[0])) : message.author;
            if (!user) {return message.channel.send("Hmmm... for some reason I can't find the user you're looking for?");}
            args.shift();
        } else {user = message.author;}
        if (!args[0]) {
            let tempchar = await ask(message, `What anime would you like to check if ${user.id === message.author.id ? "you" : "they"}'ve watched?`, 60000, false, true);
            if (!tempchar) {return;}
            args = tempchar.split(/\s+/g);
        }
        let asr = await ans(message, client, args.join(" ").trim().toLowerCase(), -700, 0);
        let fn;
        if (asr === 0) {
            return message.channel.send("That search returned no results! Try again?");
        } else if (asr instanceof Pagination) {
            await asr.start({user: message.author.id, startPage: 0, endTime: 60000});
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
        } else {fn = asr.id;}
        let ani = await AniData.findOne({id: fn});
        let af = await AF.findOne({uid: user.id});
        if (!af || !af.watched.includes(fn)) {return message.channel.send(`${user.id === message.author.id ? "You haven't" : "That person hasn't"} watched **${ani.name}**.`);}
        else {return message.channel.send(`${user.id === message.author.id ? "You have" : "That person has"} watched **${ani.name}**.`);}
    }
};