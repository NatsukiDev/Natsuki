const Discord = require('discord.js');

const UserData = require('../../models/user');
const Char = require('../../models/char');
const AniData = require('../../models/anime');

const {Tag} = require('../../util/tag');
const {TagFilter} = require('../../util/tagfilter');
const ask = require('../../util/ask');
const ans = require('../../util/anime/anisearch');
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
                if (message.guild) {await mesg.channel.send("Check your DMs!");}

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
                .addField('Other', `**Anime**: ${aniData.name} | ${aniData.japname} | \`${aniData.id}\`\n\n**Gender**: ${options.gender}\n`)
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
                        client.guilds.fetch('762707532417335296').then(g => g.channels.cache.get('817466729293938698').send({embeds: [amEmbed]}));
                        if (!queue) {amEmbed.addField("Reviewed", `Reviewed and submitted by <@${message.author.id}>`);}
                        else {amEmbed.addField("ID", options.id);}
                        amEmbed.setAuthor(!queue ? "Character Added" : "Character Submitted", message.author.avatarURL());
                        while (true) {options.id = require('../../util/makeid')(4); if (!await Char.findOne({id: options.id})) {break;}}
                        if (!queue) {options.queued = false;}
                        await new Char(options).save();
                        return message.author.send(`Your character has been ${!queue ? "added" : "submitted"}`);
                    } else {
                        return message.author.send("Oh, okay. I'll discard that then!");
                    }
                });
                rc.on("end", collected => {if (!collected.size) {return message.author.send("Looks like you ran out of time! Try again?");}});
            } catch {return message.author.send("Hmm... there was some kind of error when I tried to submit that character. Try again, and if it keeps not working, then go yell at my devs!");}
        }
    }
};