const Discord = require("discord.js");
const GuildData = require('../models/guild');
const StarData = require('../models/starboard');

module.exports = async (client, reaction, user) => {
    if (reaction.partial) {try {await reaction.fetch();} catch {return;}}

    if (reaction.emoji.name === "⭐") {
        if (!reaction.message.guild) {return;}
        let tg = await GuildData.findOne({gid: reaction.message.guild.id});
        if (!tg) {return;}
        if (tg.starchannel.length && tg.starsenabled && reaction.message.guild.channels.cache.has(tg.starchannel) && reaction.message.guild.channels.cache.get(tg.starchannel).permissionsFor(client.user.id).has('SEND_MESSAGES')) {
            if (reaction.message.channel.id === tg.starchannel) {return;}
            let sd = await StarData.findOne({gid: reaction.message.guild.id}) ? await StarData.findOne({gid: reaction.message.guild.id}) : new StarData({gid: reaction.message.guild.id});

            let starEmbed = new Discord.MessageEmbed()
                .setTitle('Starred Message!')
                .setDescription(`Sent by ${reaction.message.member.displayName} (<@${reaction.message.author.id}>) || Channel: ${reaction.message.channel.name} (<#${reaction.message.channel.id}>)\n[Jump to Message](${reaction.message.url})`)
                .setThumbnail(reaction.message.author.displayAvatarURL({size: 2048}))
                .setColor('ebb931')
                .setFooter({text: "Natsuki", iconURL: client.user.displayAvatarURL()})
                .setTimestamp();
            if (reaction.message.content.length) {starEmbed.addField("Message", reaction.message.content);}
            starEmbed
                .addField("Stars", `:star: ${reaction.count}`, true)
                .addField(`${reaction.message.member.displayName.toLowerCase().endsWith('s') ? `${reaction.message.member.displayName}'` : `${reaction.message.member.displayName}'s`} StarBoard Count`, sd.starCount[reaction.message.author.id] ? sd.starCount[reaction.message.author.id] + 1 : 1, true);
            if (reaction.message.attachments.size) {starEmbed.setImage(reaction.message.attachments.first().url);}
            if (Object.keys(sd.stars).includes(reaction.message.id)) {
                let starMessage = await reaction.message.guild.channels.cache.get(tg.starchannel).messages.fetch(sd.stars[reaction.message.id]);
                if (starMessage) {await starMessage.edit({embeds: [starEmbed]});}
            } else {
                if (reaction.count < tg.starreq) {return;}
                let starEmbedMessage = await reaction.message.guild.channels.cache.get(tg.starchannel).send({embeds: [starEmbed]});
                sd.stars[reaction.message.id] = starEmbedMessage.id;
                sd.starCount[reaction.message.author.id] = sd.starCount[reaction.message.author.id] ? sd.starCount[reaction.message.author.id] + 1 : 1;
                sd.serverStarCount += 1;
                sd.markModified(`starCount.${reaction.message.author.id}`);
                sd.markModified(`stars.${reaction.message.id}`);
                sd.save();
            }
        }
    }
};