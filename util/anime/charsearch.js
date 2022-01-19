const fz = require('fuzzysort');
const Discord = require('discord.js');

const Ani = require('../../models/anime');
const Char = require('../../models/char');

const {Pagination} = require("../../util/pagination");

module.exports = async (message, client, search, threshold=-10000, type='full') => {
    let da = [];
    const me = async (char) => {
        if (da.includes(client.misc.cache.chars.get(char))) {return 0;}
        let cch = char.anime ? char : await Char.findOne({id: client.misc.cache.chars.get(char)});
        let ani = await Ani.findOne({id: cch.anime});
        let forceAni = false; if (!ani) {forceAni = true;}
        //console.log(cch.images, cch.thumbnail);
        cch.images.push(cch.thumbnail);
        let rte = new Discord.MessageEmbed()
            .setTitle(cch.name)
            .setAuthor({name: 'Character Search', iconURL: message.author.avatarURL()})
            .setDescription(`**Name:** ${cch.name}`)
            .addField('Other', `**Anime**: ${forceAni ? cch.anime : `${ani.name} | ${ani.japname} | \`${ani.id}\``}\n\n**Gender**: ${cch.gender}\n`)
            .setColor("c375f0")
            .setImage(cch.images[Math.floor(Math.random() * cch.images.length)])
            .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
            .setTimestamp();
        if (type === 'full') {
            rte.addField("Loved by", `**${cch.loved}** Natsuki user${cch.loved === 1 ? '' : 's'}!\n\`char love ${cch.name}\``);
            if (cch.nicknames.length) {rte.addField("Nicknames/Other Names", cch.nicknames.join(", "));}
        }
        da.push(cch.id);
        return {embed: rte, id: cch.id};
    };

    let attF = await Char.findOne({id: search.trim().toLowerCase()});
    if (attF) {return await me(attF);}

    const res = fz.go(search, Array.from(client.misc.cache.chars.keys()), {threshold: threshold, limit: 10}).sort((a,b)=>a.score-b.score).map(k => k.target);

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