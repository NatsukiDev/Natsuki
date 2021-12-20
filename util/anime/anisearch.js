const fz = require('fuzzysort');
const Discord = require('discord.js');

const Ani = require('../../models/anime');

const {Pagination} = require("../../util/pagination");

module.exports = async (message, client, search, type='top') => {
    const res = fz.go(search, Array.from(client.misc.cache.anime.keys()), {threshold: -300, limit: 10}).sort((a,b)=>a.score-b.score).map(k => k.target);
    const me = async (ani) => {
        let an = await Ani.findOne({id: client.misc.cache.anime.get(ani)});
        return {embed: new Discord.MessageEmbed()
            .setTitle(an.name)
            .setAuthor('Anime Search', message.author.avatarURL())
            .addField('Info', `**Name:** ${an.name}\n**Japanese Name:** ${an.japname}\n\n**Publishers:** ${an.publishers}\n**Studios:** ${an.studios}`)
            .addField('Description', an.plot)
            .addField('Length', `**# of Seasons:** ${an.seasons}\n**# of Episodes:** ${an.episodes}`)
            .addField('Airing', `**Began:** ${an.airStartDate}\n**Ended:** ${an.isComplete ? an.airEndDate : 'This anime is still airing!'}`)
            .addField('Other', `**Genre(s):** ${an.genres}\n**Tags:** ${an.tags}\n**Characters:** ${an.characters}\n**Stream this at:** ${an.streamAt}`)
            .setColor("c375f0")
            .setImage(an.thumbnail)
            .setFooter('Natsuki', client.user.avatarURL())
            .setTimestamp(), id: an.id};
    };
    if (res.length > 1) {
        let tp = [];
        await res.forEach(async ca => tp.push(await me(ca)));
        let pag = new Pagination(message.channel, tp.map(k => k.embed), message, client, true);
        pag.ids = tp.map(k => k.id);
        return pag;
    } else {return await me(res[0]);}
}