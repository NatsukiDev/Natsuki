const Discord = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const UserData = require("../models/user");

module.exports = {
    name: "reload",
    aliases: ['relog', 'rel', 'refresh'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> System Reloading")
        .setDescription("Reloads the system extensions by refreshing all command and event files into client without terminating the node process. *Hi I'm Wubzy and this makes no sense to anyone but discord.js devs because we're nerds*")
        .addField("Syntax", "`refresh [log]`. Adding 'log' will log to the console as though the bot were in startup.")
        .addField("Notice", "This command is only available to Natsuki developers."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {
            const tu = await UserData.findOne({uid: message.author.id});
            if (!tu || !tu.developer) {return message.channel.send("You must be a Natsuki developer in order to do this!");}

            var commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            console.log(`\n${chalk.yellow('[WARN]')} >> ${chalk.gray('Reload:')} ${chalk.white('All commands and events are being reloaded!')}`);
            console.log(`${chalk.gray('[INFO]')} >> ${chalk.hex('ff4fd0')(`Developer ${message.author.username} initiated the system refresh`)}\n`);

            ['commands', 'aliases'].forEach(x => client[x] = new Discord.Collection());
            for (let commandf of commands) {
                if (Object.keys(require.cache).includes(require.resolve(`./${commandf}`))) {delete require.cache[require.resolve(`./${commandf}`)];}
                var command = require(`./${commandf}`);
                client.commands.set(command.name, command);
                if (command.aliases) {command.aliases.forEach(a => client.aliases.set(a, command.name));}
            }
            console.log(`${chalk.gray('[LOG]')}  >> ${chalk.blue('Loaded all Commands')}`);

            let eventFilter = fs.readdirSync('./events/').filter(x => x.endsWith('.js'));
            for (let file of eventFilter) {
                let evtName = file.split('.')[0];
                if (Object.keys(require.cache).includes(require.resolve('../events/' + file))) {delete require.cache[require.resolve('../events/' + file)];}
                let evt = require('../events/' + file);
                client.removeAllListeners(evtName);
                client.on(evtName, evt.bind(null, client));
            }
            console.log(`${chalk.gray('[LOG]')}  >> ${chalk.blue('Loaded all Events')}`);

            console.log(`\n${chalk.gray('[INFO]')} >> ${chalk.hex('ff4fd0')(`Client refresh successful`)}\n`);

            return message.channel.send("Done!")
        }
        if (['l', 'log', 'ns', 'nosilent', 'notsilent'].includes(args[0].toLowerCase())) {
            ['commands', 'aliases'].forEach(x => client[x] = new Discord.Collection());
            ['command', 'event'].forEach(x => require(`../handle/${x}`)(client));
            return message.channel.send("Done!");
        }
        else {return message.channel.send("Oi! 'log' is the only valid arg to use. Use no args if you want a cleaner console output instead.");}
    }
};