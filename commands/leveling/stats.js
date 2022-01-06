const Discord = require('discord.js');
const Canvas = require('canvas');
Canvas.registerFont('./resources/fonts/Nunito-Regular.ttf', {family: "Nunito"});

const Monners = require('../../models/monners');

const applyText = (base, canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = base;

	do {ctx.font = `${fontSize -= 2}px "Nunito"`;}
    while (ctx.measureText(text).width > canvas.width - 460);

	return ctx.font;
};

function roundRect(ctx, x, y, width, height, radius=5, fill=false, stroke=true, clip=false) {
    if (typeof radius === 'number') {radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (let side in defaultRadius) {radius[side] = radius[side] || defaultRadius[side];}
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {ctx.fill();}
    if (stroke) {ctx.stroke();}
    if (clip) {ctx.clip();}
}

const LXP = require('../../models/localxp');

module.exports = {
    name: "stats",
    aliases: ['level', 'xp', 'lvl'],
    meta: {
        category: 'Leveling',
        description: "View your rank in the server",
        syntax: '`stats [@user|userID]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Stats")
        .setDescription("View your level and XP in the server, or someone else's")
        .addField("Syntax", "`stats [@user|userID]`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!client.misc.cache.lxp.enabled.includes(message.guild.id)) {return message.channel.send("Your server doesn't have leveling enabled!");}
        let u = args[0] ? (message.mentions.members.first() || message.guild.members.cache.get(args[0])) : message.member;
        if (!u) {return message.channel.send("I can't find that user!");}
        let xp;
        if (!client.misc.cache.lxp.xp[message.guild.id] || !client.misc.cache.lxp.xp[message.guild.id][u.id]) {
            let txp = await LXP.findOne({gid: message.guild.id});
            if (!txp) {return message.channel.send("Your server doesn't have leveling enabled!");}
            if (!txp.xp[u.id]) {return message.channel.send(`${u.id === message.author.id ? "You" : "That user"} doesn't have any leveling info available!`);}
            xp = {xp: txp.xp[u.id][0], level: txp.xp[u.id][1]};
        } else {xp = client.misc.cache.lxp.xp[message.guild.id][u.id];}
        let tmoon = client.misc.cache.monners[u.id] ? {currency: client.misc.cache.monners[u.id]} : await Monners.findOne({uid: u.id});
        let tcur = tmoon ? tmoon.currency : 0;
        if (!message.channel.permissionsFor(message.guild.me.id).has("ATTACH_FILES")) {
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setTitle(`${u.displayName}${u.displayName.toLowerCase().endsWith('s') ? "'" : "'s"} Stats`)
                .setDescription("Local leveling stats")
                .addField("Level", `${xp.level}`, true)
                .addField("XP", `**${xp.xp}** of **${Math.ceil(100 + (((xp.level / 3) ** 2) * 2))}** needed to level up`, true)
                .addField(`${message.misc.mn}`, `<:monners:926736756047495218> ${tcur}`)
                .setThumbnail(client.users.cache.get(u.id).avatarURL({size: 2048}))
                .setColor("c375f0")
                .setFooter({text: "Natsuki"})
                .setTimestamp()
            ]});
        } else {
            const canvas = Canvas.createCanvas(1193, 411);
            const ctx = canvas.getContext('2d');

            const background = await Canvas.loadImage('./resources/images/nat-lvl.jpg');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#13131337'; //darken img
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const avatar = await Canvas.loadImage(u.displayAvatarURL({format: 'jpg', size: 2048}));
            ctx.drawImage(avatar, 40, 40, canvas.height - 80, canvas.height - 80); //draw avatar

            ctx.font = applyText(50, canvas, `${u.displayName}${u.displayName.toLowerCase().endsWith('s') ? "'" : "'s"} Stats`); //center text
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${u.displayName}${u.displayName.toLowerCase().endsWith('s') ? "'" : "'s"} Stats`, canvas.width / 2.8, canvas.height / 2);

            ctx.font = applyText(120, canvas, `${xp.xp} / ${Math.ceil(100 + (((xp.level / 3) ** 2) * 2))} | Level ${xp.level}`); //top text
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${xp.xp} / ${Math.ceil(100 + (((xp.level / 3) ** 2) * 2))} | Level ${xp.level}`, canvas.width / 2.8, canvas.height / 3.2);

            const monnersImage = await Canvas.loadImage('https://cdn.discordapp.com/emojis/926736756047495218');
            ctx.drawImage(monnersImage, canvas.width / 2.8, (canvas.height / 1.53) - 11, 58, 60); //draw monners icon
            ctx.font = `50px "Nunito"`;
            ctx.fillText(`${tcur}`, (canvas.width / 2.8) + 70, (canvas.height / 1.53) + 57 - 20);
            ctx.fillText(` | `, (canvas.width / 2.8) + 70 + ctx.measureText(`${tcur}`).width, (canvas.height / 1.53) + 57 - 24); // draw monners amount
            let monnersWidth = ctx.measureText(`${tcur} | `).width + 75; //get width of monners text and icon to account for bar size later
            
            //draw the bar borders
            ctx.strokeStyle = '#ffffff';
            ctx.strokeWidth = 6;
            roundRect(ctx, (canvas.width / 2.8) + monnersWidth, canvas.height / 1.53, canvas.width - (canvas.width / 2.8) - monnersWidth - 80, 40, 10, false, true, false);
            //set a clipping area to keep the bar filler inside the rounded borders
            roundRect(ctx, (canvas.width / 2.8) + monnersWidth, canvas.height / 1.53, canvas.width - (canvas.width / 2.8) - monnersWidth - 80, 40, 10, false, false, true);
            ctx.fillStyle = '#4aa4e0c8';
            //draw the bar filler
            ctx.fillRect((canvas.width / 2.8) + monnersWidth, canvas.height / 1.53, (xp.xp / Math.ceil(100 + (((xp.level / 3) ** 2) * 2))) * (canvas.width - (canvas.width / 2.8) - monnersWidth - 80), 40);

            message.channel.send({files: [new Discord.MessageAttachment(canvas.toBuffer(), 'xp-stats.png')]});
        }
    }
};