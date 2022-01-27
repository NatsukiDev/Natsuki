const Discord = require('discord.js');
const cp = require('child_process');

module.exports = {
    name: "restart",
    aliases: ['res'],
    meta: {
        category: 'Developer',
        description: "Fully restart Natsuki",
        syntax: '`restart`',
        extra: null
    },
    help: "Fully restarts the bot. Developer-only.",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!client.developers.includes(message.author.id)) {return message.channel.send("You must be a developer in order to do that!");}
        try {
            await require('../../util/lxp/cacheloop')(client);
            await require('../../util/vcloop')(client);
            await require('../../util/monitorloop')(client);
            await message.channel.send("Cache synchronized with DB! Restarting...");
            return cp.exec("pm2 restart natsuki", function(error, stdout, stderr) {
                if (error) {
                    return message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription(`\`\`\`${error}\`\`\``)
                        .setColor("ff446a")
                        .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
                        .setTimestamp()]}
                    );
                }
            });
        } catch {return message.channel.send("There was an error in trying to do that!");}
    }
};