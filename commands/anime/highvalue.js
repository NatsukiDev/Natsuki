const Discord = require('discord.js');

const UserData = require('../../models/user');
const CharData = require('../../models/char');

const ask = require('../../util/ask');
const chs = require('../../util/anime/charsearch');
const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "highvalue",
    aliases: ['hvc', 'mainchar', 'maincharacter'],
    meta: {
        category: 'Anime',
        description: "Mark a character as high value, making their rarity stats different",
        syntax: '`highvalue <char>`',
        extra: null
    },
    help: "Mark a character as high value. Must be a member of Natsuki staff to do this.",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let tu = await UserData.findOne({uid: message.author.id});
        if (!tu || !tu.staff) {return message.channel.send("You cannot do this unless you are a member of Natsuki staff.");}
        if (!args[0]) {
            let tempchar = await ask(message, "What character would you like to add to your favorites list?", 60000, false, true);
            if (!tempchar) {return;}
            args = tempchar.split(/\s+/g);
        }
        let asr = await chs(message, client, args.join(" ").trim().toLowerCase(), -700, 0);
        let fn;
        if (asr === 0) {
            return message.channel.send("That search returned no results! Try again?");
        } else if (asr instanceof Pagination) {
            await asr.start({user: message.author.id, startPage: 1, endTime: 60000});
            await asr.message.react('✅');
            let noticeDel = await message.channel.send("React with :white_check_mark: when you've found the character you want!");
            let arc;
            try {arc = await asr.message.awaitReactions({filter: (r) => ['✅', '⏹'].includes(r.emoji.name), max: 1, errors: ['time']});}
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
        const char = await CharData.findOne({id: fn});
        if (!char) {return message.channel.send("For some reason, I couldn't find that character. This specific error message should be reported to my devs!");}
        char.highValue = true;
        char.save();
        return message.channel.send(`I have made **${char.name}** a High-Value Character`);
    }
};