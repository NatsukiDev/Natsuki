const Discord = require('discord.js');
const Canvas = require('canvas');
Canvas.registerFont('./resources/fonts/Nunito-Regular.ttf', {family: "Nunito"});

const LXP = require('../../models/localxp');
const LR = require('../../models/levelroles');

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 120;

	do {context.font = `${fontSize -= 5}px "Nunito"`;}
    while (context.measureText(text).width > canvas.width - 250);

	return context.font;
};

module.exports = async (client, member, channel) => {
    client.misc.cache.lxp.xp[channel.guild.id][member].lastXP = new Date().getTime();
    client.misc.cache.lxp.xp[channel.guild.id][member].xp += 10;

    let x = client.misc.cache.lxp.xp[channel.guild.id][member].level;
    let max = Math.ceil(100 + (((x / 3) ** 2) * 2));

    if (client.misc.cache.lxp.xp[channel.guild.id][member].xp > max) {
        client.misc.cache.lxp.xp[channel.guild.id][member].xp -= max;
        client.misc.cache.lxp.xp[channel.guild.id][member].level += 1;

        LXP.findOne({gid: channel.guild.id}).then(async xp => {
            if (!xp || !xp.msg) {return;}
            try {
                let ch = xp.lvch.length ? channel.guild.channels.cache.get(xp.lvch) : channel;
                if (ch.partial) {await ch.fetch().catch(() => {});}
                if (ch && ch.permissionsFor(ch.guild.me.id).has('SEND_MESSAGES')) {
                    if (!ch.permissionsFor(ch.guild.me.id).has('ATTACH_FILES')) {ch.send(`<:awoo:560193779764559896> <@${member}> has reached **Level ${x + 1}**!`).catch((e) => {/*console.error(e)*/});}
                    else {
                        const canvas = Canvas.createCanvas(1193, 411);
                        const context = canvas.getContext('2d');

                        const background = await Canvas.loadImage('./resources/images/nat-lvl.jpg');
                        context.drawImage(background, 0, 0, canvas.width, canvas.height);

                        context.fillStyle = '#13131337'; //darken img
                        context.fillRect(0, 0, canvas.width, canvas.height);

                        context.font = '50px "Nunito"'; //top text
                        context.fillStyle = '#ffffff';
                        context.fillText(`Level up - Level ${x + 1}`, canvas.width / 2.8, canvas.height / 3);

                        context.font = applyText(canvas, `${ch.guild.members.cache.get(member).displayName}`); //center text
                        context.fillStyle = '#ffffff';
                        context.fillText(`${ch.guild.members.cache.get(member).displayName}`, canvas.width / 2.8, canvas.height / 1.5);

                        const avatar = await Canvas.loadImage(ch.guild.members.cache.get(member).displayAvatarURL({format: 'jpg', size: 2048}));
                        context.drawImage(avatar, 40, 40, canvas.height - 80, canvas.height - 80);

                        ch.send({
                            content: `<:awoo:560193779764559896> <@${member}> has reached **Level ${x + 1}**!`,
                            files: [new Discord.MessageAttachment(canvas.toBuffer(), 'level-up.png')]
                        });
                    }
                }
                if (client.misc.cache.lxp.hasLevelRoles.includes(channel.guild.id)) {
                    LR.findOne({gid: channel.guild.id}).then(async lr => {
                        if (!lr) {return;}
                        if (Object.keys(lr.roles).includes(`${client.misc.cache.lxp.xp[channel.guild.id][member].level}`)) {
                            try {
                                let role = channel.guild.roles.cache.get(`${lr.roles[client.misc.cache.lxp.xp[channel.guild.id][member].level]}`);
                                if (!role) {return;}
                                if (!channel.guild.me.permissions.has("MANAGE_ROLES")) {return;}
                                let m = channel.guild.members.cache.get(member);
                                if (!m) {return;}
                                m.roles.add(role).catch((e) => {/*console.error(e);*/});
                            } catch (e) {/*console.error(e);*/}
                        }
                    });
                }
            } catch (e) {/*console.error(e);*/}
        }).catch((e) => {/*console.error(e);*/})
    }
};