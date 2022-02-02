const fz = require('fuzzysort');
const Discord = require('discord.js');

const Ani = require('../../models/anime');

const {Pagination} = require("../../util/pagination");

module.exports = async (message, client, search, threshold=-10000, type='full') => {
    let da = [];
    const me = async (ani) => {
        if (da.includes(client.misc.cache.anime.get(ani))) {return 0;}
        let an = ani.plot ? ani : await Ani.findOne({id: client.misc.cache.anime.get(ani)});
        let rte = new Discord.MessageEmbed()
            .setTitle(an.name)
            .setAuthor({name: 'Anime Search', iconURL: message.author.avatarURL()})
            .setDescription(`**Name:** ${an.name}\n**Japanese Name:** ${an.japname}\n\n**Publishers:** ${an.publishers.join(", ")}\n**Studios:** ${an.studios.join(", ")}`)
            .setColor("c375f0")
            .setImage(an.thumbnail)
            .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
            .setTimestamp()
        if (type === 'full') {
            rte
                .addField('Description', an.plot)
                .addField('Length', `**# of Seasons:** ${an.seasons}\n**# of Episodes:** ${an.episodes}`)
                //.addField('Airing', `**Began:** ${an.airStartDate}\n**Ended:** ${an.isComplete ? an.airEndDate : 'This anime is still airing!'}`)
                .addField("Cast", `**${an.characters.length} Characters**\n${(an.characters.length > 50 ? an.characters.slice(0, 49) : an.characters).map(char => client.misc.cache.charsID.get(char)).join(', ')}${an.characters.length > 50 ? `\n**+${an.characters.length - 50} Others**` : ''}`)
                .addField('Other', `**Genre(s):** ${an.genres.join(", ")}\n**Stream this at:** ${an.streamAt.join(", ")}${an.altNames && an.altNames.length ? `\n\n**Other names:** ${an.altNames.map(n => `\`${n}\``).join(', ')}` : ''}`)
                .addField('Love', `**Watchers**: **${an.watchers} Natsuki ${client.utils.as(an.watchers, 'user')}** ${an.watchers === 1 ? 'has' : "have"} this anime on their list of finished anime!\n\`n?watched ${an.name}\`\n**Watchlisted**: **${an.listed} Natsuki ${client.utils.as(an.listed, 'user')}** ${an.listed === 1 ? 'has' : "have"} this anime on their list of anime they want to watch!\n\`n?watchlist add ${an.name}\`\n**Favorited**: **${an.liked} Natsuki ${client.utils.as(an.liked, 'user')}** ${an.liked === 1 ? 'has' : "have"} this anime favorited!\n\`n?favanime ${an.name}\``)
        }
        da.push(an.id);
        return {embed: rte, id: an.id};
    };

    let attF = await Ani.findOne({id: search.trim().toLowerCase()});
    if (attF) {return await me(attF);}

    const res = fz.go(search, Array.from(client.misc.cache.anime.keys()), {threshold: threshold, limit: 10}).sort((a,b)=>a.score-b.score).map(k => k.target);
    
    if (res.length === 0) {return 0;}
    else if (res.length > 1) {
        let tp = [];
        for (let i = 0; i < res.length; i++) {
            const tres = await me(res[i]);
            if (tres !== 0) {tp.push(tres);}
        }
        tp = await Promise.all(tp);
        return tp.length > 1 ? new Pagination(message.channel, tp.map(k => k.embed), message, client, true) : tp[0];
    } else {return await me(res[0]);}
}