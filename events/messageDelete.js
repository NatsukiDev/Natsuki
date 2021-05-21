const Discord = require('discord.js');

module.exports = async (client, message) => {
	if (message.channel.type !== "text") {return;}
	//if (!Object.keys(snipe.delete).includes(message.guild.id)) {snipe.delete[message.guild.id] = {};};
	//snipe.delete[message.guild.id][message.channel.id] = message;

	let ts = client.guildconfig.logs.has(message.guild.id) && client.guildconfig.logs.get(message.guild.id).has('mdelete') ? client.guildconfig.logs.get(message.guild.id).get('mdelete') : null;
	if (ts) {if (message.guild.channels.cache.has(ts) && message.guild.channels.cache.get(ts).permissionsFor(client.user.id).has("SEND_MESSAGES")) {
		let mde = new Discord.MessageEmbed()
			.setTitle('Message Deleted')
			.setDescription(`Sent by <@${message.author.id}> | In <#${message.channel.id}>`)
			.setThumbnail(message.author.avatarURL({size: 1024}))
			.setColor('ecff8f').setFooter("Natsuki", client.user.avatarURL()).setTimestamp();
		if (message.content && message.content.length) {mde.addField("Message", "`-> `" + message.content.toString());}
		if (message.attachments.size) {
			if (message.attachments.first().url.includes(".png") || message.attachments.first().url.includes(".jpg") || message.attachments.first().url.includes(".gif")) {/*console.log('e');*/ try {mde.setImage(message.attachments.first().url);} catch {}}
			let av = Array.from(message.attachments.values());
			let as = ''; for (let a of av) {
				as += `[Att. ${av.indexOf(a) + 1}](${a.url})`;
				if (av.indexOf(a) + 1 < av.length) {as += ' | ';}
			}
			if (as.length) {mde.addField('Attachments', as);}
		}
		message.guild.channels.cache.get(ts).send(mde).catch(() => {});
	}}
}