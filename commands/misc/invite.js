const Discord = require('discord.js');

module.exports = {
    name: "invite",
    aliases: ['inv', 'botinvite'],
    meta: {
        category: 'Misc',
        description: "Get the bot invite and support server invite",
        syntax: '`invite`',
        extra: null
    },
    help: "Shows you my invite and support server invite",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        return message.channel.send({embeds: [new Discord.MessageEmbed()
            .setTitle("My links!")
            .setThumbnail(client.user.displayAvatarURL({size: 2048}))
            .setDescription("[Bot Invite](https://discord.com/oauth2/authorize?client_id=762701327431237644&scope=bot&permissions=1581116647)\n`->` Use this link to invite Natsuki to your server! This has all the required permissions in it that the I need to work, and it is not recommended that you change them. Doing so will make it so that some commands don't function properly or won't complete (I'll usually tell you when I'm missing a permission).\n\n[Support Server Invite](https://discord.gg/u9c2uD24wB)\n`->` Use this to join my support server! Here you can talk to the devs, suggest features, hang out with the community, get update alerts, report bugs/issues and get help, or just stop and say hi!")
            .setColor("c375f0")
            .setFooter({text: "Natsuki"})
            .setTimestamp()
        ]});
    }
};