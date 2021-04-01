const Discord = require('discord.js');
const os = require('os');

module.exports = {
    name: "mem",
    aliases: ['memory', 'ram', 'memstats'],
    meta: {
        category: 'Misc',
        description: "Shows memory usage stats",
        syntax: '`mem`',
        extra: null
    },
    help: "shows my memory usage stats",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle("RAM Usage")
            .setDescription(`\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\` heap of \`${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)}MB\` allocated. | **${Math.floor((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)}%**\nTotal RAM: \`${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB\` | Free RAM: \`${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)}GB\``)
            .setColor('c375f0')
        );
    }
};