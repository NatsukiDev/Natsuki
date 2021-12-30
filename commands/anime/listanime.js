const Discord = require('discord.js');
const fz = require('fuzzysort');

const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "listanime",
    aliases: ['la', 'listani', 'lanime', 'allani', 'allanime', 'anilist', 'animelist', 'anil'],
    meta: {
        category: 'Anime',
        description: "View a list of every anime Natsuki has in her database at the moment",
        syntax: '`listanime [query]`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Anime Listing")
        .setDescription("See a list of every Natsuki anime, or add a search query.")
        .addField("Syntax", "`listanime [query]`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let anime = [];
        let matches = `anime in the database`;

        if (args.length) {
            anime = fz.go(args.join(" "), Array.from(client.misc.cache.animeID.values()), {limit: 200}).sort((a,b)=>a.score-b.score).map(k => client.misc.cache.anime.get(k.target));
            if (!anime.length) {return message.channel.send("That query returned no results!");}
            matches = `matches`;
        } else {anime = Array.from(client.misc.cache.animeID.keys());}

        let pages = [];
        let pl = (Math.floor(anime.length / 10) + 1);
        for (let i = 0; i < pl; i++) {
            if (!anime[(i * 10) + 1]) {break;}
            let s = `${anime.length} ${matches}.\n\n`;
            let ps = [];
            for (let x = 0; x < 10; x++) {
                if (!anime[(i * 10) + x]) {break;}
                ps.push(`**${x + (i * 10) + 1}.** ${client.misc.cache.animeID.get(anime[(i * 10) + x])}`);
            }
            s = `${s}${ps.join('\n')}`;
            pages.push(new Discord.MessageEmbed()
                .setTitle("Anime Database")
                .setThumbnail(client.user.avatarURL({size: 1024, dynamic: true, format: 'png'}))
                .setDescription(s)
                .setColor('c375f0')
                .setTimestamp()
            );
        }
        if (pages.length > 1) {
            let pag = new Pagination(message.channel, pages, message, client, true);
            return await pag.start({user: message.author.id, time: 60000});
        } else {return message.channel.send({embeds: [pages[0].setFooter({text: "Natsuki"})]});}
    }
};