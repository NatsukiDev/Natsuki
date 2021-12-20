const Discord = require('discord.js');

const UserData = require('../../models/user');
const Char = require('../../models/char');
const AniData = require('../../models/anime');
const CF = require('../../models/charfav');

const {Tag} = require('../../util/tag');
const {TagFilter} = require('../../util/tagfilter');
const ask = require('../../util/ask');
const ans = require('../../util/anime/anisearch');
const chs = require('../../util/anime/charsearch');
const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "char",
    aliases: ['ch', 'character'],
    /*meta: {
        category: 'Anime',
        description: "",
        syntax: '` <>`',
        extra: null
    },*/
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Characters")
    .setDescription("Incomplete command, please stand by <3")
    .addField("Syntax", "`char`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}char\``);}
        
        let queue = false;
        let forceAni = false;
        let options = {};
        let dmch;
        if (['a', 'add', 'n', 'new'].includes(args[0])) {
            let tu = await UserData.findOne({uid: message.author.id});
            if (!tu || !tu.staff) {
                await message.channel.send("Since you aren't a Natsuki Staff member, this character will be __submitted__ for reviewal!");
                queue = true;
            }
            options = new TagFilter([
                new Tag(['ask', 'question'], 'ask', 'toggle'),
                new Tag(['name', 'n'], 'name', 'append'),
                new Tag(['description', 'desc', 'p', 'personality'], 'personality', 'append'),
                new Tag(['anime', 'ani', 'a'], 'anime', 'append'),
                new Tag(['thumb', 'thumbnail'], 'thumbnail', 'append'),
                new Tag(['img', 'image'], 'images', 'listAppend'),
                new Tag(['loveInterest', 'dating', 'married', 'li'], 'loveInterest', 'append'),
                new Tag(['gender', 'g', 'sex'], 'gender', 'append'),
                new Tag(['nickname', 'nn', 'nick'], 'nicknames', 'listAppend')
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
                client.misc.activeDMs.set(message.author.id, 'char-add');

                let mesg = await message.author.send("I'm going to ask you some questions about the character's info. Just reply with the answer and use good grammar and spelling and be as accurate as possible. To cancel the process, just leave the question unanswered for a few minutes and I'll let you know that the question timed out and is not longer answerable.")
                .catch(() => {return message.reply("Something went wrong there! Most likely, your DMs are closed.");});
                if (message.guild) {await message.channel.send("Check your DMs!");}

                function clearDM() {client.misc.activeDMs.delete(message.author.id);}
                dmch = mesg.channel;

                options.name = await ask(mesg, "What is the character's name?", 60000, true); if (!options.name) {return;}
                if (options.name.length > 75) {clearDM(); return dmch.send("The character name can't be more than 75 characters!");}

                options.anime = await ask(mesg, "What anime (or game) did the character appear in? If the character is an OC, say 'none'", 60000, true); if (!options.anime) {return;}
                if (options.anime.length > 75) {clearDM(); return dmch.send("The anime name can't be more than 75 characters!");}
                if (options.anime.trim().toLowerCase() === 'none') {options.anime = null;}
                else {
                    let asr = await ans(mesg, client, options.anime.trim().toLowerCase());
                    if (asr === 0) {
                        let conf = await ask(mesg, "That search returned no results. Would you like me to put the anime you specified down anyways? Otherwise, I'll abandon this process, and we can try again.", 60000, true);
                        if (!['y', 'yes', 'ye', 'n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("You must specify yes or no! Please try again.");}
                        conf = ['y', 'yes', 'ye'].includes(conf.trim().toLowerCase());
                        if (!conf) {
                            clearDM();
                            return dmch.send("Okay! You can try remaking the character if you'd like.");
                        } else {
                            forceAni = true;
                            fn = options.anime;
                        }
                    } else if (asr instanceof Pagination) {
                        await asr.start({user: message.author.id, startPage: 1, endTime: 60000});
                        await asr.message.react('✅');
                        await dmch.send("React with :white_check_mark: when you've found the anime you want!");
                        let arc;
                        try {arc = await asr.message.awaitReactions({filter: (r, u) => ['✅', '⏹'].includes(r.emoji.name), max: 1, errors: ['time']});}
                        catch {return dmch.send("Looks like you didn't find the anime you were looking for, so I went ahead and ended the character creation for you.");}
                        collected = arc.first().emoji.name;
                        if (collected === '✅') {
                            fn = client.misc.cache.anime.get(asr.getCurrentPage().title.trim());
                            asr.stop();
                        }
                        else {return dmch.send("Looks like you didn't find the anime you were looking for, so I went ahead and ended the character creation for you.");}
                    } else {
                        await dmch.send({embeds: [asr.embed]});
                        let conf = await ask(mesg, "Is this the anime you meant?", 60000, true);
                        if (!['y', 'yes', 'ye', 'n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("You must specify yes or no! Please try again.");}
                        conf = ['y', 'yes', 'ye'].includes(conf.trim().toLowerCase());
                        if (!conf) {return mesg.channel.send("Well, I've got nothing, then. If that doesn't match the anime you're looking for then I would try again with a more narrow search.");}
                        fn = asr.id;
                    }
                    options.anime = fn;
                }

                options.gender = await ask(mesg, "What is the character's gender?", 60000, true); if (!options.name) {return;}
                if (options.gender.length > 75) {clearDM(); return dmch.send("That's one heck of a gender. Maybe like... abbreviate?");}

                options.thumbnail = await ask(mesg, "Give me an image **URL** *do not upload the image* to use for the character", 120000, true); if (!options.thumbnail) {return clearDM();}
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
            let aniData = await AniData.findOne({id: options.anime});
            let amEmbed = new Discord.MessageEmbed()
                .setTitle(`New Character -> ${options.name}`)
                .setDescription(`${queue ? 'Requested' : 'Added'} by ${message.author.tag}`)
                .addField('Info', `**Name:** ${options.name}`)
                .addField('Other', `**Anime**: ${forceAni ? options.anime : `${aniData.name} | ${aniData.japname} | \`${aniData.id}\``}\n\n**Gender**: ${options.gender}\n`)
                .setColor("c375f0")
                .setImage(options.thumbnail)
                .setFooter('Natsuki', client.user.avatarURL())
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
                        while (true) {options.id = require('../../util/makeid')(4); if (!await Char.findOne({id: options.id})) {break;}}
                        if (!queue) {
                            amEmbed.addField("Reviewed", `Reviewed and submitted by <@${message.author.id}>`);
                            client.misc.cache.chars.set(options.name, options.id);
                        }
                        else {amEmbed.addField("ID", options.id);}
                        amEmbed.setAuthor(!queue ? "Character Added" : "Character Submitted", message.author.avatarURL());
                        if (!queue) {options.queued = false;}
                        await new Char(options).save();
                        if (aniData) {
                            aniData.characters.push(options.id);
                            aniData.markModified('characters');
                            aniData.save();
                        }
                        client.guilds.fetch('762707532417335296').then(g => g.channels.cache.get('817466729293938698').send({embeds: [amEmbed]}));
                        return message.author.send(`Your character has been ${!queue ? "added" : "submitted"}`);
                    } else {
                        return message.author.send("Oh, okay. I'll discard that then!");
                    }
                });
                rc.on("end", collected => {if (!collected.size) {return message.author.send("Looks like you ran out of time! Try again?");}});
            } catch {return message.author.send("Hmm... there was some kind of error when I tried to submit that character. Try again, and if it keeps not working, then go yell at my devs!");}
        }
        if (['s', 'search'].includes(args[0].trim().toLowerCase())) {
            args.shift();
            if (!args[0]) {
                let tempchar = await ask(message, "What character would you like to search for?", 60000, false, true);
                if (!tempchar) {return;}
                args = tempchar.split(/\s+/g);
            }
            let asr = await chs(message, client, args.join(" ").trim().toLowerCase(), -100000);
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
                let tempchar = await ask(message, "What character would you like to view?", 60000, false, true);
                if (!tempchar) {return;}
                args = tempchar.split(/\s+/g);
            }
            let asr = await chs(message, client, args.join(" ").trim().toLowerCase(), -700);
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
            if (!tu || !tu.staff) {await message.channel.send("Since you aren't a Natsuki Staff member, you can't reject character submissions!");}
            let tr = await CharData.findOne({id: args[1].toLowerCase()});
            if (!tr) {return message.reply("That character submission doesn't seem to exist!");}
            if (tr.queued !== true) {return message.reply("That character was already accepted, so you can't reject it.");}
            return await CharData.deleteOne({id: args[1].toLowerCase()})
            .then(() => {return message.channel.send("I got that submission out of here!");})
            .catch(() => {return message.reply("It seems that submission wasn't deleted for some reason. \*insert head scratching*");});
        }
        if (['r', 'rand', 'random', 'any'].includes(args[0].toLowerCase())) {
            let asr = await chs(message, client, client.misc.cache.chars.random(), -100000);
            return await message.channel.send({embeds: [asr.embed]});
        }
        if (['l', 'love', 'favorite', 'fav'].includes(args[0].toLowerCase())) {
            args.shift();
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
                await message.channel.send("React with :white_check_mark: when you've found the character you want!");
                let arc;
                try {arc = await asr.message.awaitReactions({filter: (r, u) => ['✅', '⏹'].includes(r.emoji.name), max: 1, errors: ['time']});}
                catch {return message.channel.send("Looks like you didn't find the character you were looking for, so I went ahead and ended the character creation for you.");}
                collected = arc.first().emoji.name;
                if (collected === '✅') {
                    fn = client.misc.cache.chars.get(asr.getCurrentPage().title.trim());
                    asr.stop();
                }
                else {return message.reply("Looks like you didn't find the character you were looking for.");}
            } else {
                await message.channel.send({embeds: [asr.embed]});
                let conf = await ask(message, "Is this the character you meant?", 60000);
                if (!['y', 'yes', 'ye', 'n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("You must specify yes or no! Please try again.");}
                conf = ['y', 'yes', 'ye'].includes(conf.trim().toLowerCase());
                if (!conf) {return message.channel.send("Well, I've got nothing, then. If that doesn't match the character you're looking for then I would try again with a more narrow search.");}
                fn = asr.id;
            }
            let cf = await CF.findOne({uid: message.author.id}) || new CF({uid: message.author.id});
            if (cf.loved.includes(fn)) {return message.channel.send("Look like that character is already on your loved list!");}
            let tfc = await Char.findOne({id: fn});
            tfc.loved += 1;
            tfc.markModified('loved');
            tfc.save();
            cf.loved.push(fn);
            cf.markModified('loved');
            cf.save();
            return message.channel.send(`I've added **${tfc.name}** to your loved/favorited character list!`);
        }
        if (['loved', 'favorites', 'favs'].includes(args[0].toLowerCase())) {
            let cf = await CF.findOne({uid: mention ? mention.id : message.author.id});
            if (!cf || !cf.loved.length) {return message.channel.send(`Looks like ${mention ? 'they' : 'you'} haven't favorited any characters!`);}
            let chars = cf.loved;
            chars = chars.map(tc => Array.from(client.misc.cache.chars.keys()).filter(c => client.misc.cache.chars.get(c) === tc));
            let n = mention ? message.guild ? message.mentions.members.first().displayName : message.mentions.users.first().username : message.guild ? message.member.displayName : message.author.username;
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setAuthor(`${n}${n.endsWith('s') ? '' : "'s"} Favorited Characters`, mention ? mention.avatarURL() : message.author.avatarURL())
                    .setDescription(`**${chars.length} character${chars.length === 1 ? '': 's'} favorited**\n\n${chars.join(", ")}`)
                    .setColor('c375f0')
                    .setFooter("Natsuki")
                    .setTimestamp()
            ]});
        }
    }
};