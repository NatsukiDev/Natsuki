const Discord = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');

const UserData = require("../../models/user");

module.exports = {
    name: "reload",
    aliases: ['relog', 'rel', 'refresh'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> System Reloading")
        .setDescription("Reloads the system extensions by refreshing all command and event files into client without terminating the node process. *Hi I'm Wubzy and this makes no sense to anyone but discord.js devs because we're nerds*")
        .addField("Syntax", "`refresh [log]`. Adding 'log' will log to the console as though the bot were in startup.")
        .addField("Notice", "This command is only available to Natsuki developers."),
    meta: {
        category: 'Developer',
        description: "Refresh all client commands and events and clear most of the require cache. Only two people can use this command and they're probably not you.",
        syntax: '`reload`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        const tu = await UserData.findOne({uid: message.author.id});
        if (!tu || !tu.developer) {return message.channel.send("You must be a Natsuki developer in order to do this!");}

        if (!args.length) {
            let timer = new Date().getTime();
            let commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            let dirSet = new Map();
            fs.readdirSync('./commands').filter(file => !file.includes('.')).forEach(dir => fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js')).forEach(x => {commands.push(x); dirSet.set(x, dir)}));
            console.log(`\n${chalk.yellow('[WARN]')} >> ${chalk.gray('Reload:')} ${chalk.white('All commands and events are being reloaded!')}`);
            console.log(`${chalk.gray('[INFO]')} >> ${chalk.hex('ff4fd0')(`Developer ${message.author.username} initiated the system refresh`)}\n`);

            let cmdspinner = ora(chalk.blue('Loading Commands')).start();
            ['commands', 'aliases'].forEach(x => client[x] = new Discord.Collection());
            for (let commandf of commands) {
                if (Object.keys(require.cache).includes(require.resolve(`../../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`))) {delete require.cache[require.resolve(`../../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`)];}
                let command = require(`../../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`);
                client.commands.set(command.name, command);
                if (command.aliases) {command.aliases.forEach(a => client.aliases.set(a, command.name));}
            }
            cmdspinner.stop(); cmdspinner.clear();
            console.log(`${chalk.gray('[PROC]')} >> ${chalk.blue('Loaded all Commands')}`);

            let eventspinner = ora(chalk.blue('Loading Events')).start();
            let eventFilter = fs.readdirSync('./events/').filter(x => x.endsWith('.js'));
            for (let file of eventFilter) {
                let evtName = file.split('.')[0];
                if (Object.keys(require.cache).includes(require.resolve('../../events/' + file))) {delete require.cache[require.resolve('../../events/' + file)];}
                let evt = require('../../events/' + file);
                client.removeAllListeners(evtName);
                client.on(evtName, evt.bind(null, client));
            }
            eventspinner.stop(); eventspinner.clear();
            console.log(`${chalk.gray('[PROC]')} >> ${chalk.blue('Loaded all Events')}`);

            let rspspinner = ora(chalk.blue('Loading Commands')).start();
            let responses = fs.readdirSync('./responses').filter(file => file.endsWith('.js'));
            client.responses.triggers = [];
            for (let responsef of responses) {
                if (Object.keys(require.cache).includes(require.resolve(`../../responses/${responsef}`))) {delete require.cache[require.resolve(`../../responses/${responsef}`)];}
                let response = require(`../../responses/${responsef}`);
                client.responses.triggers.push([response.name, response.condition]);
                client.responses.commands.set(response.name, response);
            }
            rspspinner.stop(); rspspinner.clear();
            console.log(`${chalk.gray('[PROC]')} >> ${chalk.blue('Loaded all Responses')}`);

            console.log(`\n${chalk.gray('[INFO]')} >> ${chalk.hex('ff4fd0')(`Client refresh successful`)}\n`);

            return message.channel.send(`Done! Reloaded ${commands.length} commands, ${eventFilter.length} events, and ${responses.length} responses in ${new Date().getTime() - timer}ms.`);
        }

        if (['l', 'log', 'ns', 'nosilent', 'notsilent'].includes(args[0].toLowerCase())) {
            ['commands', 'aliases'].forEach(x => client[x] = new Discord.Collection());
            client.responses = {triggers: [], commands: new Discord.Collection()};
            ['command', 'event', 'response'].forEach(x => require(`./${x}`)(client));
            return message.channel.send("Done!");
        }

        if (['c', 'cmd', 'command'].includes(args[0].toLowerCase())) {
            let timer = new Date().getTime();
            if (!args[1]) {return message.channel.send("Oi there you headass! You have to actually tell me what command to reload!");}
            let tc = args[1].toLowerCase();
            let lf = client.commands.get(tc) || client.commands.get(client.aliases.get(tc));
            lf = lf ? lf.name : tc;
            let res;
            fs.readdirSync(`./commands`).forEach(x => {
                if (!x.includes('.')) {fs.readdirSync(`./commands/${x}`).forEach(y => {if (`${lf}.js` === y) {res = `../../commands/${x}/${y}`;}});}
                else {if (x === `${lf}.js`) {res = `../../commands/${x}`;}}
            });
            if (!res) {return message.channel.send("I can't reload that command as I can't find file!");}
            if (require.resolve(res) in require.cache) {delete require.cache[require.resolve(res)];}
            client.commands.set(lf, require(res));
            return message.channel.send(`Reloaded command \`${lf}\` in ${new Date().getTime() - timer}ms`);
        }

        else {return message.channel.send("Oi! 'log' is the only valid arg to use. Use no args if you want a cleaner console output instead.");}
    }
};