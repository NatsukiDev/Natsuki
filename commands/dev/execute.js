const Discord = require('discord.js');

const cp = require("child_process");

module.exports = {
    name: "execute",
    aliases: ['exec'],
    meta: {
        category: 'Developer',
        description: "Execute a console command",
        syntax: '`Execute <command>`',
        extra: null
    },
    help: "Dev only! Executes a console command",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!client.developers.includes(message.author.id)) {return message.channel.send("You must be a developer to do this!");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}execute <command>\``);}
        if (args.join(" ").match(/^rm\s+/gm)) {return message.channel.send(":(");}
        return cp.exec(args.join(" "), function(error, stdout, stderr) {
            if (error) {
                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setTitle("Error")
                    .setDescription(`\`\`\`${error}\`\`\``)
                    .setColor("ff446a")
                    .setFooter("Natsuki", client.user.avatarURL())
                    .setTimestamp()]}
                );
            }

            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setTitle("Execution Successful")
                .setDescription(`\`\`\`${stdout}\`\`\``)
                .setColor("c375f0")
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()]}
            );
        });
    }
};