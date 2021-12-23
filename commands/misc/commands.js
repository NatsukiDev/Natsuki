const Discord = require('discord.js');

module.exports = {
    name: "commands",
    aliases: ['cmds', 'commandlist', 'cmdlist'],
    meta: {
        category: 'Misc',
        description: "Shows a list of my commands",
        syntax: '`commands`',
        extra: null
    },
    help: "Shows a list of all my commands",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let categories = [];
        Array.from(client.commands.values()).forEach(c => {if (!categories.includes(c.meta ? c.meta.category : 'Uncategorized')) {categories.push(c.meta ? c.meta.category : 'Uncategorized');}});
        let ce = new Discord.MessageEmbed()
            .setTitle("Commands")
            .setDescription(`You can use \`${prefix}help\` on any command to get more help on it.`)
            .setColor('c375f0')
            .setFooter("Natsuki", client.user.avatarURL())
            .setTimestamp();
        categories.forEach(category => ce.addField(category, Array.from(client.commands.values()).filter(command => command.meta ? command.meta.category === category : category === "Uncategorized").map(cmd => `\`${cmd.name}\``).join(', ')));
        return message.channel.send({embeds: [ce]});
    }
};