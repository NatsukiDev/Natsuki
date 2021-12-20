const fz = require('fuzzysort');
const Discord = require('discord.js');

const Ani = require('../../models/anime');
const Char = require('../../models/char');

const {Pagination} = require("../../util/pagination");

module.exports = async (message, client, search, threshold=-10000, type='top') => {
    const me = async (char) => {
        let cch = char.anime ? char : await Char.findOne({id: client.misc.cache.chars.get(char)});
        let ani = await Ani.findOne({id: cch.anime});
        let forceAni = false; if (!ani) {forceAni = true;}
        return {embed: new Discord.MessageEmbed()
            .setTitle(cch.name)
            .setAuthor('Character Search', message.author.avatarURL())
            .setDescription(`**Name:** ${cch.name}`)
            .addField('Other', `**Anime**: ${forceAni ? cch.anime : `${ani.name} | ${ani.japname} | \`${ani.id}\``}\n\n**Gender**: ${cch.gender}\n`)
            .setColor("c375f0")
            .setImage(cch.thumbnail)
            .setFooter('Natsuki', client.user.avatarURL())
            .setTimestamp(), id: cch.id};
    };

    let attF = await Char.findOne({id: search.trim().toLowerCase()});
    if (attF) {return await me(attF);}

    const res = fz.go(search, Array.from(client.misc.cache.chars.keys()), {threshold: threshold, limit: 10}).sort((a,b)=>a.score-b.score).map(k => k.target);
    if (res.length === 0) {return 0;}
    else if (res.length > 1) {
        let tp = [];
        await res.forEach(ca => tp.push(me(ca)));
        tp = await Promise.all(tp);
        return new Pagination(message.channel, tp.map(k => k.embed), message, client, true);
    } else {return await me(res[0]);}
}