const Discord = require('discord.js');

const UserData = require('../../models/user');
const AniData = require('../../models/anime');
const AF = require('../../models/anifav');

const {TagFilter} = require("../../util/tagfilter");
const {Tag} = require ("../../util/tag");
const ask = require('../../util/ask');
const ans = require('../../util/anime/anisearch');
const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "anime",
    aliases: ['ani', 'an'],
    meta: {
        category: 'Anime',
        description: "View, submit, favorite, and rate animes",
        syntax: '``',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Anime")
        .setDescription("View and find anime in our huge list of anime!")
        .addField("Syntax", "`anime <>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}anime <>\``);}
        let queue = false;
        let options = {};
        let dmch;
        if (['a', 'add', 'n', 'new'].includes(args[0].trim().toLowerCase())) {
            let tu = await UserData.findOne({uid: message.author.id});
            if (!tu || !tu.staff) {
                await message.channel.send("Since you aren't a Natsuki Staff member, this anime will be __submitted__ for reviewal!");
                queue = true;
            }
            options = new TagFilter([
                new Tag(['ask', 'question'], 'ask', 'toggle'),
                new Tag(['title', 't', 'name', 'n'], 'name', 'append'),
                new Tag(['japname', 'japanesename', 'jn'], 'japname', 'append'),
                new Tag(['description', 'desc', 'd', 'plot', 'p'], 'plot', 'append'),
                new Tag(['pub', 'pubs', 'publishers', 'publisher', 'pb'], 'publishers', 'listAppend'),
                new Tag(['stud', 's', 'studio', 'studs', 'studios'], 'studios', 'listAppend'),
                new Tag(['began', 'airstart', 'as'], 'airStartDate', 'append'),
                new Tag(['ended', 'airend', 'ae'], 'airEndDate', 'append'),
                new Tag(['iscomplete', 'completed', 'ic'], 'isComplete', 'toggle'),
                new Tag(['seasons', 'sns'], 'seasons', 'append'),
                new Tag(['episodes', 'es'], 'episodes', 'append'),
                new Tag(['genres', 'g'], 'genres', 'listAppend'),
                new Tag(['tags', 'ta', 'tgs', 'tg', 'tag'], 'tags', 'listAppend'),
                new Tag(['cs', 'characters', 'chars', 'chs'], 'characters', 'listAppend'),
                new Tag(['streams', 'streamat', 'sa'], 'streamAt', 'listAppend'),
                new Tag(['img', 'thumb', 'thumbnail', 'image'], 'thumbnail', 'append')
            ]).test(args.join(' '));

            if (Object.keys(options).length) {
                let foptions = {};
                let option; for (option of Object.keys(options)) {
                    if (Array.isArray(options[option])) {
                        let s = '';
                        let data;
                        for (data of options[option]) {
                            s += data;
                            s += options[option].indexOf(data) < (options[option].length - 1) ? ', ' : '';
                        }
                        foptions[option] = s;
                    }
                }
            } else {
                if (client.misc.activeDMs.has(message.author.id)) {return message.channel.send("I'm already asking you questions in a DM! Finish that first, then try this command again.");}
                client.misc.activeDMs.set(message.author.id, 'anime-add');

                let mesg = await message.author.send("I'm going to ask you some questions about the anime's info. Just reply with the answer and use good grammar and spelling and be as accurate as possible. To cancel the process, just leave the question unanswered for a few minutes and I'll let you know that the question timed out and is not longer answerable.")
                .catch(() => {return message.reply("Something went wrong there! Most likely, your DMs are closed.");});
                if (message.guild) {await message.channel.send("Check your DMs!");}

                function clearDM() {client.misc.activeDMs.delete(message.author.id);}
                dmch = mesg.channel;

                options.name = await ask(mesg, "What is the anime's name? Make sure to use proper capitalization and spelling. This applies to the rest of the questions I'll ask you.", 60000, true); if (!options.name) {return;}
                if (options.name.length > 75) {clearDM(); return dmch.send("The anime name can't be more than 75 characters!");}

                options.plot = await ask(mesg, "How would you describe the anime? Give a very brief description of things like its plot, main characters, and setting.", 240000, true); if (!options.plot) {return clearDM();}
                if (options.plot.length > 500) {clearDM(); return dmch.send("Oi! I said give a \"very brief\" description of the anime!");}

                options.japname = await ask(mesg, "What is the anime's japanese name? (The romanization, not the Japanese characters.)", 120000, true); if (!options.japname) {return clearDM();}
                if (options.japname.length > 75) {clearDM(); return dmch.send("The japanese name can't be more than 75 characters!");}

                options.studios = await ask(mesg, "What studio created the anime? If there are multiple studios, please separate them with a comma.", 120000, true); if (!options.studios) {return clearDM();}
                if (options.studios.length > 150) {clearDM(); return dmch.send("No way there were actually that many studios...");}
                options.studios = options.studios.split(/,\s+/gm);
                if (options.studios.length > 5) {clearDM(); return dmch.send("No way there were actually that many studios...");}

                options.publishers = await ask(mesg, "What company published the anime? If there are multiple publishers, please separate them with a comma.", 120000, true); if (!options.publishers) {return clearDM();}
                if (options.publishers.length > 150) {clearDM(); return dmch.send("No way there were actually that many publishers...");}
                options.publishers = options.publishers.split(/,\s+/gm);
                if (options.publishers.length > 5) {clearDM(); return dmch.send("No way there were actually that many publishers...");}

                options.airStartDate = await ask(mesg, "When did the anime start? Please format this as \"Month Day, Year\" - e.g. January 1, 2021", 120000, true); if (!options.airStartDate) {return clearDM();}
                options.airEndDate = await ask(mesg, "When did the anime end? If the anime never ended, you can say \"N/A\"", 120000, true); if (!options.airEndDate) {return clearDM();}
                options.lastUpdate = await ask(mesg, "When was the last time a new episode was released for the anime?", 120000, true); if (!options.lastUpdate) {return clearDM();}

                options.isComplete = await ask(mesg, "Is the anime completed? (If the most recent season has finished, you may only say \"no\" if the next season is *confirmed* by the *studio or publishers* or the next season is in the works.", 60000, true); if (!options.isComplete) {return clearDM();}
                if (!['y', 'yes', 'ye', 'n', 'no'].includes(options.isComplete.trim().toLowerCase())) {clearDM(); return dmch.send("You must specify yes or no! Please try again.");}
                options.isComplete = ['y', 'yes', 'ye'].includes(options.isComplete.trim().toLowerCase());

                options.seasons = await ask(mesg, "How many seasons does the anime have? Please don't include spinoffs. (Gun Gale Online spinoff doesn't count as a Sword Art Online season.)", 120000, true); if (!options.seasons) {return clearDM();}
                if (isNaN(options.seasons) || Number(options.seasons < 1)) {clearDM(); return dmch.send("You either didn't give a number, or it was < 1.");}
                options.seasons = Number(options.seasons);

                options.episodes = await ask(mesg, "How many episodes does the anime have? Try not to include OVAs or spinoffs, unless they're canon and widely considered by the community to be a part of the series.", 120000, true); if (!options.episodes) {return clearDM();}
                if (isNaN(options.episodes) || Number(options.episodes < 1)) {clearDM(); return dmch.send("You either didn't give a number, or it was < 1.");}
                options.episodes = Number(options.episodes);

                options.genres = await ask(mesg, "What genre(s) describe the anime? If there are multiple genres, please separate them with a comma.", 120000, true); if (!options.genres) {return clearDM();}
                if (options.genres.length > 200) {clearDM(); return dmch.send("That's too many genres!");}
                options.genres = options.genres.split(/,\s+/gm);
                if (options.genres.length > 10) {clearDM(); return dmch.send("That's too many genres!");}

                /*options.tags = await ask(mesg, "What tags describe the anime? Please separate tags with a comma, and *do not put the # in the tag!*.", 120000, true); if (!options.tags) {return clearDM();}
                if (options.tags.length > 200) {clearDM(); return dmch.send("That's too many tags!");}
                options.tags = options.tags.split(/,\s+/gm);
                if (options.tags.length > 25) {clearDM(); return dmch.send("That's too many tags!");}*/

                options.streamAt = await ask(mesg, "What streaming services can you use to watch the anime? If there are multiple stream sites, please separate them with a comma. Please include only legal, licensed industries such as Netflix, Funimation, Crunchyroll, or Hulu. 9anime, cartooncrazy, GoGoAnime, and similar sites are illegal and won't be listed here.", 120000, true); if (!options.streamAt) {return clearDM();}
                if (options.streamAt.length > 150) {clearDM(); return dmch.send("No way there are actually that many streaming sites to watch the anime on...");}
                options.streamAt = options.streamAt.split(/,\s+/gm);
                if (options.streamAt.length > 8) {clearDM(); return dmch.send("No way there are actually that many streaming sites to watch the anime on...");}

                options.thumbnail = await ask(mesg, "Give me an image to use for the anime. You may upload an image or send a URL to an image **that is hosted on Discord**. Please do not upload NSFW or copyrighted images.", 120000, true); if (!options.thumbnail) {return clearDM();}
                if (options.thumbnail.length > 350) {clearDM(); return dmch.send("That URL is a bit too long. Consider uploading it to imgur or another image sharing site and trying again.");}

                options.characters = [];
                clearDM();
            }

            let am;
            let foptions = {};
            let option; for (option of Object.keys(options)) {
                if (Array.isArray(options[option])) {
                    let s = '';
                    let data;
                    for (data of options[option]) {
                        s += data;
                        s += options[option].indexOf(data) < (options[option].length - 1) ? ', ' : '';
                    }
                    foptions[option] = s;
                }
            }
            if (!options.characters) {options.characters = [];}
            let amEmbed = new Discord.MessageEmbed()
                .setTitle(`New Anime -> ${options.name}`)
                .setDescription(`${queue ? 'Requested' : 'Added'} by ${message.author.tag}`)
                .addField('Info', `**Name:** ${options.name}\n**Japanese Name:** ${options.japname}\n\n**Publishers:** ${foptions.publishers}\n**Studios:** ${foptions.studios}`)
                .addField('Description', options.plot)
                .addField('Length', `**# of Seasons:** ${options.seasons}\n**# of Episodes:** ${options.episodes}`)
                .addField('Airing', `**Began:** ${options.airStartDate}\n**Ended:** ${options.isComplete ? options.airEndDate : 'This anime is still airing!'}`)
                .addField('Other', `**Genre(s):** ${foptions.genres}\n**Tags:** ${foptions.tags}\n**Characters:** ${foptions.characters}\n**Stream this at:** ${foptions.streamAt}`)
                .setColor("c375f0")
                .setImage(options.thumbnail)
                .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
                .setTimestamp();
            try {
                am = await dmch.send({embeds: [amEmbed]});
                await am.react('👍');
                await am.react('👎');
            } catch {return dmch.send(":thinking: hmmm... something went wrong there. I might not have permissions to add reactions to messages, and this could be the issue.");}
            try {
                let rc = am.createReactionCollector({filter: (r, u) => ['👍', '👎'].includes(r.emoji.name) && u.id === message.author.id, max: 1, time: 60000});
                rc.on("collect", async r => {
                    if (r.emoji.name !== '👎') {
                        while (true) {options.id = require('../../util/makeid')(4); if (!await AniData.findOne({id: options.id})) {break;}}
                        if (!queue) {
                            amEmbed.addField("Reviewed", `Reviewed and submitted by <@${message.author.id}>`);
                            client.misc.cache.anime.set(options.name, options.id);
                            client.misc.cache.anime.set(options.japname, options.id);
                            client.misc.cache.animeID.set(options.id, options.name);
                        }
                        else {amEmbed.addField("ID", options.id);}
                        amEmbed.setAuthor({name: !queue ? "Anime Added" : "Anime Submitted", iconURL: message.author.avatarURL()});
                        client.guilds.fetch('762707532417335296').then(g => g.channels.cache.get('817466729293938698').send({embeds: [amEmbed]}));
                        if (!queue) {options.queued = false;}
                        await new AniData(options).save();
                        return message.author.send(`Your anime has been ${!queue ? "added" : "submitted"}`);
                    } else {
                        return message.author.send("Oh, okay. I'll discard that then!");
                    }
                });
                rc.on("end", collected => {if (!collected.size) {return message.author.send("Looks like you ran out of time! Try again?");}});
            } catch {return message.author.send("Hmm... there was some kind of error when I tried to submit that anime. Try again, and if it keeps not working, then go yell at my devs!");}
            return;
        }

        if (['s', 'search'].includes(args[0].trim().toLowerCase())) {
            args.shift();
            if (!args[0]) {
                let tempchar = await ask(message, "What anime would you like to search for?", 60000, false, true);
                if (!tempchar) {return;}
                args = tempchar.split(/\s+/g);
            }
            let asr = await ans(message, client, args.join(" ").trim().toLowerCase());
            if (asr === 0) {
                return message.channel.send("That search returned no results! Try again?");
            } else if (asr instanceof Pagination) {
                await asr.start({user: message.author.id, startPage: 1, endTime: 60000});
            } else {
                await message.channel.send({embeds: [asr.embed]});
            }
            return;
        }

        if (['v', 'view'].includes(args[0].trim().toLowerCase())) {
            args.shift();
            if (!args[0]) {
                let tempchar = await ask(message, "What anime would you like to view?", 60000, false, true);
                if (!tempchar) {return;}
                args = tempchar.split(/\s+/g);
            }
            let asr = await ans(message, client, args.join(" ").trim().toLowerCase(), -700);
            if (asr === 0) {
                return message.channel.send("That search returned no results! Try again?");
            } else if (asr instanceof Pagination) {
                await asr.start({user: message.author.id, startPage: 1, endTime: 60000});
            } else {
                await message.channel.send({embeds: [asr.embed]});
            }
            return;
        }
        
        if (['reject'].includes(args[0].trim().toLowerCase())) {
            let tu = await UserData.findOne({uid: message.author.id});
            if (!tu || !tu.staff) {await message.channel.send("Since you aren't a Natsuki Staff member, you can't reject anime submissions!");}
            let tr = await AniData.findOne({id: args[1].toLowerCase()});
            if (!tr) {return message.reply("That anime submission doesn't seem to exist!");}
            if (tr.queued !== true) {return message.reply("That anime was already accepted, so you can't reject it.");}
            return await AniData.deleteOne({id: args[1].toLowerCase()})
            .then(() => {return message.channel.send("I got that submission out of here!");})
            .catch(() => {return message.reply("It seems that submission wasn't deleted for some reason. \*insert head scratching*");});
        }

        if (['r', 'rand', 'random', 'any'].includes(args[0].toLowerCase())) {
            let asr = await ans(message, client, client.misc.cache.anime.random(), -100000);
            return await message.channel.send({embeds: [asr.embed]});
        }

        if (['w', 'watched'].includes(args[0].toLowerCase())) {
            args.shift();
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
    }
};
