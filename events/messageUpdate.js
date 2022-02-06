const Discord = require('discord.js');

const channelTypes = ["GUILD_MESSAGE", "DM", "GUILD_NEWS_THREAD", "GUILD_PRIVATE_THREAD", "GUILD_PUBLIC_THREAD", "GUILD_NEWS", "GROUP_DM", "GUILD_STORE"];

module.exports = async (client, oldM, newM) => {
    if (oldM.partial) {await oldM.fetch().catch(() => {});}
    if (newM.partial) {await newM.fetch().catch(() => {});}
	if (oldM.channel.partial) {await oldM.channel.fetch().catch(() => {});}

	if (!channelTypes.includes(oldM.channel.type)) {return;};
	if (!oldM.author || oldM.author.bot) {return;}
	//if (oldM.deleted) {return;}
	//if (!Object.keys(snipe.edit).includes(oldM.guild.id)) {snipe.edit[oldM.guild.id] = {};};
	//snipe.edit[oldM.guild.id][oldM.channel.id] = {old: oldM, cur: newM};

    if (!oldM.guild || !oldM.author) {return;}

	let ts = client.guildconfig.logs.has(oldM.guild.id) && client.guildconfig.logs.get(oldM.guild.id).has('medit') ? client.guildconfig.logs.get(oldM.guild.id).get('medit') : null;
	if (ts) {if (oldM.guild.channels.cache.has(ts) && oldM.guild.channels.cache.get(ts).permissionsFor(client.user.id).has("SEND_oldMS")) {
        let embed = new Discord.MessageEmbed()
            .setTitle('Message Edited')
            .setDescription(`Sent by <@${oldM.author.id}> | In <#${oldM.channel.id}> | [See Message](${oldM.url})`)
            .setThumbnail(oldM.author.displayAvatarURL({size: 1024}))
            .addField("Old Message", "`-> `" + oldM.content.toString())
            .addField("New Message", "`-> `" + newM.content.toString())
            .setColor('8034eb').setFooter({text: "Natsuki", iconURL: client.user.displayAvatarURL()}).setTimestamp();
        if (newM.attachments.size && ['.png', '.jpg', '.gif'].includes(newM.attachments.first().url.slice(newM.attachments.first().url.length - 4, newM.attachments.first().url.length))) {embed.setImage(newM.attachments.first().url);}
        oldM.guild.channels.cache.get(ts).send({embeds: [embed]}).catch(() => {});
	}}
}