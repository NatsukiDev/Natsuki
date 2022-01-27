const Discord = require('discord.js');

const AniData = require("../../models/anime");
const UserData = require('../../models/user');
const CharData = require('../../models/char');

const {Pagination} = require('../../util/pagination');
const {Tag} = require('../../util/tag');
const {TagFilter} = require('../../util/tagfilter');

module.exports = {
    name: "anipulse",
    aliases: ['ap'],
    meta: {
        category: 'Developer',
        description: "Get a pulse check of anime",
        syntax: '`anipulse`',
        extra: null
    },
    help: "Not much to see here!",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let tu = await UserData.findOne({uid: message.author.id});
        if (!tu || !tu.staff) {return message.channel.send("You must be Natsuki staff in order to use this command.");}

        let sm = await message.channel.send("One moment while I gather that information for you...");

        let options = new TagFilter([
            new Tag(['c', 'ch', 'char', 'chars', 'character', 'characters'], 'chars', 'append'),
            new Tag(['a', 'ani', 'anime'], 'anime', 'append')
        ]).test(args.join(" "));
        Object.keys(options).forEach(o => {if (isNaN(Number(options[o]))) {delete options[o];}});

        let ani = client.misc.cache.animeID.size;
        let char = client.misc.cache.charsID.size;
        let nick = Array.from(client.misc.cache.chars.keys()).filter(x => !Array.from(client.misc.cache.charsID.values()).includes(x)).length;

        let charThresh = (options.chars !== undefined ? Number(options.chars) : 2);
        let aniThresh = (options.anime !== undefined ? Number(options.anime) : 15);

        let lowChars = [];
        for await (const ani of AniData.find()) {
            if (ani.characters.length < aniThresh) {lowChars.push(ani);}
        }

        let lowIms = [];
        for await (const char of CharData.find()) {
            if (char.images.length < charThresh) {lowIms.push(char);}
        }

        let pages = [new Discord.MessageEmbed()
            .setTitle("Anime Database Pulse Check")
            .setDescription(`**${ani}** Anime\n**${char}** Characters\n**${nick}** Nicknames`)
            .addField(`Anime with < ${aniThresh} character${client.utils.s(aniThresh)}`, `${lowChars.length}`)
            .addField(`Characters with < ${charThresh} extra image${client.utils.s(charThresh)}`, `${lowIms.length}`)
            .setColor('c375f0')
        ];

        let ma = Math.floor(lowIms.length / 10);
        for (let i = 0; i < ma; i++) {
            if (!lowChars.slice(10 * i, Math.min((10 * i) + 10, lowChars.length)).length) {break;}
            pages.push(new Discord.MessageEmbed()
                .setTitle("Anime Database Pulse Check")
                .setDescription(`**${ani}** Anime\n**${char}** Characters\n**${nick}** Nicknames`)
                .addField(`Anime with < ${aniThresh} character${client.utils.s(aniThresh)}`, lowChars.slice(10 * i, Math.min((10 * i) + 10, lowChars.length)).filter(x=>![null,undefined].includes(x)).map((ani, y) => `${(10*i)+y+1}. ${ani.name} -> **${ani.characters.length}** Char${client.utils.s(ani.characters.length)}.`).join('\n'))
                .setColor('c375f0')
        );}
        
        let mc = Math.floor(lowIms.length / 10);
        for (let i = 0; i < mc; i++) {
            if (!lowIms.slice(10 * i, Math.min((10 * i) + 10, lowIms.length)).length) {break;}
            pages.push(new Discord.MessageEmbed()
                .setTitle("Anime Database Pulse Check")
                .setDescription(`**${ani}** Anime\n**${char}** Characters\n**${nick}** Nicknames`)
                .addField(`Characters with < ${charThresh} extra image${client.utils.s(charThresh)}`, lowIms.slice(10 * i, Math.min((10 * i) + 10, lowIms.length)).filter(x=>![null,undefined].includes(x)).map((ch, y) => `${(10*i)+y+1}. ${ch.name} -> **${ch.images.length}** Image${client.utils.s(ch.images.length)}.`).join('\n'))
                .setColor('c375f0')
        );}

        const pag = new Pagination(message.channel, pages, message, client, true);
        sm.delete().catch(() => {});

        return await pag.start({user: message.author.id, time: 60000});
    }
};