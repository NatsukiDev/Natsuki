const fz = require('fuzzysort');
const Discord = require('discord.js');

const Ani = require('../../models/anime');
const Char = require('../../models/char');

const {Pagination} = require("../../util/pagination");

module.exports = async (message, client, search, threshold=-10000, type='top') => {
    const me = async (ani) => {
        let an = await Ani.findOne({id: client.misc.cache.anime.get(ani)});
        let chs = [];
        for (let i = 0; i < an.characters.length; i++) {
            let tch = await Char.findOne({id: an.characters[i]});
            if (tch) {chs.push(tch.name);}
        }
        return {embed: new Discord.MessageEmbed()
            .setTitle(an.name)
            .setAuthor('Anime Search', message.author.avatarURL())
            .setDescription(`**Name:** ${an.name}\n**Japanese Name:** ${an.japname}\n\n**Publishers:** ${an.publishers.join(", ")}\n**Studios:** ${an.studios.join(", ")}`)
            .addField('Description', an.plot)
            .addField('Length', `**# of Seasons:** ${an.seasons}\n**# of Episodes:** ${an.episodes}`)
            .addField('Airing', `**Began:** ${an.airStartDate}\n**Ended:** ${an.isComplete ? an.airEndDate : 'This anime is still airing!'}`)
            .addField('Other', `**Genre(s):** ${an.genres.join(", ")}\n**Tags:** ${an.tags.join(", ")}\n**Characters:** ${chs.join(", ")}\n**Stream this at:** ${an.streamAt.join(" ")}`)
            .setColor("c375f0")
            .setImage(an.thumbnail)
            .setFooter('Natsuki', client.user.avatarURL())
            .setTimestamp(), id: an.id};
    };

    let attF = await Ani.findOne({id: search.trim().toLowerCase()});
    if (attF) {return await me(res[0]);}

    const res = fz.go(search, Array.from(client.misc.cache.anime.keys()), {threshold: threshold, limit: 10}).sort((a,b)=>a.score-b.score).map(k => k.target);
    if (res.length === 0) {return 0;}
    else if (res.length > 1) {
        let tp = [];
        await res.forEach(ca => tp.push(me(ca)));
        tp = await Promise.all(tp);
        return new Pagination(message.channel, tp.map(k => k.embed), message, client, true);
    } else {return await me(res[0]);}
}