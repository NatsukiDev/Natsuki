const chalk = require('chalk');
const fs = require('fs');
const ora = require('ora');
const Discord = require('discord.js');

module.exports = {
    name: "reload",
    description: "Reloads the client without restarting it.",
    help: "Reloads client. Use -cmd, -event, -resp, or -exec flags to fine-tune the results.",
    usage: "help [command]",
    args: ['cmd', 'event', 'resp', 'exec'],
    execute(client, text, args, cmd) {
            let timer = new Date().getTime();
            let commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            let dirSet = new Map();
            fs.readdirSync('./commands').filter(file => !file.includes('.')).forEach(dir => fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js')).forEach(x => {commands.push(x); dirSet.set(x, dir)}));
            console.log(`${chalk.gray('[CONS]')} >> [${chalk.blue(`RELOAD`)}] -> Clean (no-argument) reload:`);
            console.log(`${chalk.yellow('[WARN]')} >> ${chalk.gray('Reload:')} ${chalk.white('All commands and events are being reloaded!')}\n`);

            let cmdspinner = ora(chalk.blue('Loading Commands')).start();
            ['commands', 'aliases'].forEach(x => client[x] = new Discord.Collection());
            for (let commandf of commands) {
                if (Object.keys(require.cache).includes(require.resolve(`../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`))) {delete require.cache[require.resolve(`../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`)];}
                let command = require(`../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`);
                client.commands.set(command.name, command);
                if (command.aliases) {command.aliases.forEach(a => client.aliases.set(a, command.name));}
            }
            cmdspinner.stop(); cmdspinner.clear();
            console.log(`${chalk.gray('[PROC]')} >> ${chalk.blue('Loaded all Commands')}`);

            let eventspinner = ora(chalk.blue('Loading Events')).start();
            let eventFilter = fs.readdirSync('./events/').filter(x => x.endsWith('.js'));
            for (let file of eventFilter) {
                let evtName = file.split('.')[0];
                if (Object.keys(require.cache).includes(require.resolve('../events/' + file))) {delete require.cache[require.resolve('../events/' + file)];}
                let evt = require('../events/' + file);
                client.removeAllListeners(evtName);
                client.on(evtName, evt.bind(null, client));
            }
            eventspinner.stop(); eventspinner.clear();
            console.log(`${chalk.gray('[PROC]')} >> ${chalk.blue('Loaded all Events')}`);

            let rspspinner = ora(chalk.blue('Loading Responses')).start();
            let responses = fs.readdirSync('./responses').filter(file => file.endsWith('.js'));
            client.responses.triggers = [];
            for (let responsef of responses) {
                if (Object.keys(require.cache).includes(require.resolve(`../responses/${responsef}`))) {delete require.cache[require.resolve(`../responses/${responsef}`)];}
                let response = require(`../responses/${responsef}`);
                client.responses.triggers.push([response.name, response.condition]);
                client.responses.commands.set(response.name, response);
            }
            rspspinner.stop(); rspspinner.clear();
            console.log(`${chalk.gray('[PROC]')} >> ${chalk.blue('Loaded all Responses')}`);
            
            let exespinner = ora(chalk.blue('Loading Console Commands')).start();
            let executables = fs.readdirSync('./executables').filter(file => file.endsWith('.js'));
            for (let execf of executables) {
                if (Object.keys(require.cache).includes(require.resolve(`../executables/${execf}`))) {delete require.cache[require.resolve(`../executables/${execf}`)];}
                var exec = require(`../executables/${execf}`);
                client.executables.set(exec.name, exec);
            }
            exespinner.stop(); exespinner.clear();
            console.log(`${chalk.gray('[PROC]')} >> ${chalk.blue('Loaded all Console Commands')}`);

            console.log(`\n${chalk.gray('[INFO]')} >> Client refresh successful.`);
            return console.log(`${chalk.gray('[CONS]')} >> ${chalk.greenBright(`Done!`)} Reloaded ${chalk.blue(commands.length)} ${chalk.blueBright(`commands`)}, ${chalk.blue(eventFilter.length)} ${chalk.blueBright(`events`)}, and ${chalk.blue(responses.length)} ${chalk.blueBright(`responses`)} in ${chalk.green(`${new Date().getTime() - timer}ms`)}.`);
    }
};