const Discord = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const gs = require('gradient-string');

let iters = ['command', 'event', 'response'];

module.exports = async client => {
    return new Promise(resolve => {
        let commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        let dirSet = new Map();
        fs.readdirSync('./commands').filter(file => !file.includes('.')).forEach(dir => fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js')).forEach(x => {commands.push(x); dirSet.set(x, dir)}));
        
        commands.sort();
        const log = client.misc.config.spinners ? (i) => client.misc.cache.spinLog.push(i) : (i) => console.log(i);
        log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Getting Commands...')}\n`);
        for (let commandf of commands) {
            if (Object.keys(require.cache).includes(require.resolve(`../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`))) {delete require.cache[require.resolve(`../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`)];}
            let command = require(`../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`);
            const addCommand = (command) => {
                client.commands.set(command.name, command);
                if (command.aliases) {command.aliases.forEach(a => client.aliases.set(a, command.name));}
                log(`${chalk.gray('[LOAD]')} >> ${chalk.blueBright('Loaded Command')} ${chalk.white(command.name)} ${chalk.blueBright('with')} ${chalk.white(command.aliases && command.aliases.length ? command.aliases.length : 0)} ${chalk.blueBright('aliases')}`);
            };
            if (command.commands) {command.commands.forEach(cmd => addCommand(cmd));}
            else {addCommand(command);}
        }
        log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Loaded all Commands')}`);
        client.misc.cache.spin.success('command', {text: iters.map(i => `Loaded ${i.slice(0, 1).toUpperCase()}${i.slice(1)}s`).map(i => client.misc.config.gradients ? gs.instagram(i) : chalk.blue(i))[0]});
        resolve(0);
    });
};