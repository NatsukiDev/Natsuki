const Discord = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
//const ora = require('ora');

module.exports = client => {
    let commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    let dirSet = new Map();
    fs.readdirSync('./commands').filter(file => !file.includes('.')).forEach(dir => fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js')).forEach(x => {commands.push(x); dirSet.set(x, dir)}));

    //console.log('');
    //let cora = ora(`${chalk.white("Loading commands into client.")} ${chalk.blue("[")}${chalk.blueBright("0")}${chalk.blue("/")}${chalk.blueBright(`${commands.length}`)}${chalk.blue("]")}`).start();
    //let num = 0;
    commands.sort();
    console.log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Getting Commands...')}\n`);
    for (let commandf of commands) {
        //num++;
        //cora.text = `${chalk.white("Loading commands into client.")} ${chalk.blue("[")}${chalk.blueBright(`${num}`)}${chalk.blue("/")}${chalk.blueBright(`${commands.length}`)}${chalk.blue("]")}`;
        if (Object.keys(require.cache).includes(require.resolve(`../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`))) {delete require.cache[require.resolve(`../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`)];}
        let command = require(`../commands/${dirSet.has(commandf) ? `${dirSet.get(commandf)}/`: ''}${commandf}`);
        client.commands.set(command.name, command);
        if (command.aliases) {command.aliases.forEach(a => client.aliases.set(a, command.name));}
        console.log(`${chalk.gray('[LOAD]')} >> ${chalk.blueBright('Loaded Command')} ${chalk.white(command.name)} ${chalk.blueBright('with')} ${chalk.white(command.aliases && command.aliases.length ? command.aliases.length : 0)} ${chalk.blueBright('aliases')}`);
    }
    /*cora.stop(); cora.clear();
    console.log(`${chalk.gray('[BOOT]')} >> ${chalk.blue('Getting Commands...')}\n`);
    Array.from(client.commands.values()).forEach(command => {
        console.log(`${chalk.gray('[LOAD]')} >> ${chalk.blueBright('Loaded Command')} ${chalk.white(command.name)} ${chalk.blueBright('with')} ${chalk.white(command.aliases && command.aliases.length ? command.aliases.length : 0)} ${chalk.blueBright('aliases')}`);
    });*/
    console.log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Loaded all Commands')}`);
};