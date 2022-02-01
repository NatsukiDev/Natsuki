const Discord = require('discord.js');

const AF = require("../../models/anifav");
const AniData = require('../../models/anime');

const {Pagination} = require('../../util/pagination');
const ask = require('../../util/ask');
const ans = require('../../util/anime/anisearch');

module.exports = {
    name: "watchlist",
    aliases: ['wl'],
    meta: {
        category: 'Anime',
        description: "Add anime to your list of animes you want to watch",
        syntax: '`watchlist <view|add|remove>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> WatchList")
        .setDescription("Add anime to your watchlist (not to be confused with \"watchedlist\"; this is your list of anime you want to watch but haven't yet. You can view your list or anothers' list as well.)")
        .addField("Removal from List", "If you're removing an item from your list because you've *seen* the anime, please run the `watched` command instead. It will automatically remove the anime from your watchlist and place it in your watchedlist.")
        .addField("Syntax", "`watchlist <view|add|remove>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}watchlist <view|add|remove>\``);}
        if (['v', 'view'].includes(args[0].toLowerCase())) {
            if (mention) {args.shift();}
            let user = mention || message.author;
            let af = await AF.findOne({uid: user.id});
            if (!af || !af.toWatch.length) {return message.channel.send(`${user.id === message.author.id ? "You don't" : "That person doesn't"} have any watchlisted anime.`);}
            let pages = [];
            let pl = (Math.floor(af.toWatch.length / 10) + 1);
            for (let i = 0; i < pl; i++) {
                let s = '';
                for (let x = 0; x < 10; x++) {
                    if (!af.toWatch[(i * 10) + x]) {break;}
                    s += `**${x + (i * 10) + 1}.** ${client.misc.cache.animeID.get(af.toWatch[(i * 10) + x])}\n`;
                }
                pages.push(new Discord.MessageEmbed()
                    .setAuthor({
                        name: message.guild ? message.guild.members.cache.get(user.id).displayName : user.username, 
                        iconURL: message.guild ? message.guild.members.cache.get(user.id).displayAvatarURL({dynamic: true}) : user.displayAvatarURL({dynamic: true})
                    })
                    .setTitle("Anime Watch List")
                    .setDescription(s)
                    .setColor('c375f0')
                    .setTimestamp()
                );
            }
            if (pages.length > 1) {
                let pag = new Pagination(message.channel, pages, message, client, true);
                return await pag.start({user: message.author.id, time: 60000});
            } else {return message.channel.send({embeds: [pages[0].setFooter({text: "Natsuki"})]});}
        }
        
        if (['a', 'add'].includes(args[0].toLowerCase())) {
            args.shift();
            if (!args[0]) {
                let tempchar = await ask(message, "What anime would you like to add to your watch list?", 60000, false, true);
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
                let noticeDel = await message.channel.send("React with :white_check_mark: when you've found the anime you want!");
                let arc;
                try {arc = await asr.message.awaitReactions({filter: (r) => ['✅', '⏹'].includes(r.emoji.name), max: 1, errors: ['time']});}
                catch {return message.reply("Looks like you didn't find the anime you were looking for.");}
                collected = arc.first().emoji.name;
                if (collected === '✅') {
                    fn = client.misc.cache.anime.get(asr.getCurrentPage().title.trim());
                    await asr.stop();
                    await asr.message.delete().catch(() => {});
                    await noticeDel.delete().catch(() => {});
                }
                else {return message.reply("Looks like you didn't find the anime you were looking for.");}
            } else {
                let preConfEmbed = await message.channel.send({embeds: [asr.embed]});
                let conf = await ask(message, "Is this the anime you meant?", 60000, undefined, undefined, true);
                if (!['y', 'yes', 'ye', 'n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("You must specify yes or no! Please try again.");}
                conf = ['y', 'yes', 'ye'].includes(conf.trim().toLowerCase());
                preConfEmbed.delete().catch(() => {});
                if (!conf) {return message.channel.send("Well, I've got nothing, then. If that doesn't match the anime you're looking for then I would try again with a more narrow search.");}
                fn = asr.id;}
            let af = await AF.findOne({uid: message.author.id}) || new AF({uid: message.author.id});
            if (af.toWatch.includes(fn)) {return message.channel.send("Looks like that anime is already on your watch list!");}
            if (af.watched.includes(fn)) {return message.channel.send("That anime is on your **watched** list already...");}
            const tfc = await AniData.findOne({id: fn});
            if (!tfc) {return message.channel.send("Huh... guess that anime just... vanished into thin air? I would go yell at my devs.");}
            af.toWatch.push(fn);
            af.markModified('toWatch');
            af.save();
            tfc.listed++;
            tfc.save();
            return message.channel.send(`I've added **${client.misc.cache.animeID.get(fn)}** to your watch list! ${[`Let me know if it's any good when you get around to it :3`, `Hope it's good!`, 'Try not to wait *too* long before you watch it.', `I've heard good things about that one.`][Math.floor(Math.random() * 4)]}`);
        }

        if (['d', 'delete', 'remove', 'r'].includes(args[0].toLowerCase())) {
            let conf = await ask(message, "Real quick, before anything else, I have to ask: are you trying to remove an anime from your watch list because you've now watched it?", 60000);
            if (!['y', 'yes', 'ye', 'n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("You must specify yes or no! Please try again.");}
            conf = ['y', 'yes', 'ye'].includes(conf.trim().toLowerCase());
            if (conf) {return message.channel.send(`Good thing I asked then :brain: Please instead use the \`${prefix}watched\` command to handle removing the anime from your watch list.`);}
            args.shift();
            if (!args[0]) {
                let tempchar = await ask(message, "What anime would you like to remove from your watch list?", 60000, false, true);
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
            } else {
                await message.channel.send({embeds: [asr.embed]});
                let conf = await ask(message, "Is this the anime you meant?", 60000, undefined, undefined, true);
                if (!['y', 'yes', 'ye', 'n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("You must specify yes or no! Please try again.");}
                conf = ['y', 'yes', 'ye'].includes(conf.trim().toLowerCase());
                if (!conf) {return message.channel.send("Well, I've got nothing, then. If that doesn't match the anime you're looking for then I would try again with a more narrow search.");}
                fn = asr.id;}
            let af = await AF.findOne({uid: message.author.id}) || new AF({uid: message.author.id});
            if (!af.toWatch.includes(fn)) {return message.channel.send("Looks like that anime isn't on your watch list!");}
            const tfc = await AniData.findOne({id: fn});
            if (!tfc) {return message.channel.send("Huh... guess that anime just... vanished into thin air? I would go yell at my devs.");}
            af.toWatch.splice(af.toWatch.indexOf(fn), 1);
            af.markModified('toWatch');
            af.save();
            tfc.listed--;
            tfc.save();
            return message.channel.send(`${['Guess it wasn\'t worth the watch after all, huh?', 'Oof. Did you lose interest? Well, either way,', 'Got it, got it.', 'Okie dokie!'][Math.floor(Math.random() * 4)]} I've removed **${client.misc.cache.animeID.get(fn)}** from your watch list.`);
        }
    }
};