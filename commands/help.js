const Discord = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h", "commands", "cmds"],
    help: 'you silly! What did you expect me to respond with?',
    execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {

        } else {
            var command;
            if (client.commands.has(args[0])) {command = client.commands.get(args[0]);}
            else if (client.aliases.has(args[0])) {command = client.commands.get(client.aliases.get(args[0]));}
            else {return message.reply("I don't have that command! Try using `" + prefix + "help` to get a list of my commands");}

            return message.reply(command.help
                ? command.help instanceof Discord.MessageEmbed
                    ? command.help.setFooter("Natsuki | <required> [optional]", client.user.avatarURL()).setColor("c375f0").setTimestamp()
                    : command.help.replace(/{{p}}/g, prefix)
                : "I don't seem to have any help info available for that command."
            );
        }
    }
};