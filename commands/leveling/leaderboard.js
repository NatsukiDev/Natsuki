const Discord = require('discord.js');

const XP = require('../../models/localxp');

module.exports = {
    name: "leaderboard",
    aliases: ['lb', 'rank'],
    meta: {
        category: 'Leveling',
        description: "Find your place in the server's ranks and see the top-ranking members in the server.",
        syntax: '`leaderboard`',
        extra: null,
        guildOnly: true
    },
    help: "Find your place in the server's ranks and see the top-ranking members in the server.",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let cfmh = '<a:xp:870418598047387668>';

        let gxp = await XP.findOne({gid: message.guild.id});
        let xp = gxp.xp;
    
        let lvlp = Object.keys(xp).sort((a, b) => {return xp[a][1] - xp[b][1];}).reverse();
        let lvl = lvlp.slice(0, Object.keys(xp).length >= 5 ? 5 : Object.keys(xp).length);
        let lvls = ``;
        let i; for (i=0; i<lvl.length; i++) {lvls += `${i+1}. <@${lvl[i]}> -> **Level ${xp[lvl[i]][1]}**\n`;}
        lvls += `\n${cfmh} *You are ranked **#${lvlp.indexOf(message.author.id) + 1}** at Level ${xp[lvlp[lvlp.indexOf(message.author.id)]][1]}.*`;

        return message.channel.send(new Discord.MessageEmbed()
            .setTitle("Server Leaderboard")
            .setThumbnail(message.guild.iconURL({size: 2048, dynamic: true}))
            .addField("Level", lvls)
            .setColor('c375f0')
            .setFooter("Natsuki | Stats may be up to 2 minutes out of sync")
            .setTimestamp()
        );

        /*u = Object.keys(tm.messages.members).sort((a, b) => {return tm.messages.members[a] - tm.messages.members[b];}).reverse().slice(0, Object.keys(tm.messages.members).length >= 5 ? 5 : Object.keys(tm.messages.members).length);
        us = ``;
        let i2; for (i2=0; i2<u.length; i2++) {us += `${i2+1}. <@${u[i2]}> -> **${tm.messages.members[u[i2]]} Messages**\n`;}*/
        //if (args[0] && ['mooners', 'currency', 'balance', 'bal'].includes(args[0].toLowerCase())) {}
        //else {}
    }
};
