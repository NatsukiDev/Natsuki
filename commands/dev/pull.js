const Discord = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const UserData = require('../../models/user');
const cp = require('child_process');

module.exports = {
    name: "pull",
    help: new Discord.MessageEmbed()
        .setTitle("Help -> VCS Pull")
        .setDescription("Pulls new commits from VCS")
        .addField("Syntax", "`pull`")
        .addField("Notice", "This command is only available to Natsuki developers."),
    meta: {
        category: 'Developer',
        description: "Pull new commits from VSC and update the bot. Otaku zone, non-otakus not allowed.",
        syntax: '`pull`',
        extra: "You'll still need to use `reload` afterwards"
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        const tu = await UserData.findOne({uid: message.author.id});
        if (!tu || !tu.developer) {return message.channel.send("You must be a Natsuki developer in order to do this!");}

        console.log(`\n${chalk.yellow('[WARN]')} >> ${chalk.gray('VCS:')} ${chalk.white('Initiating remote->local VCS sync/refresh!')}`);

        cp.exec("git pull origin master", function(error, stdout, stderr) {
            if (stderr || error) {
                let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
                console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | Occurred while trying to pull from VCS`)}`, stderr || error);
            } else {
                console.log(`\n${chalk.gray('[INFO]')} >> ${chalk.hex('ff4fd0')(`VCS Pull successful`)}\n`);
            }
            return message.channel.send(`Done with ${stderr || error ? 'an error' : 'no errors'}!`);
        });
    }
};