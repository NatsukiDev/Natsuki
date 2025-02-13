const fs = require('fs');
const chalk = require('chalk');
const {Collection} = require('discord.js');

const commandsDirName = './src/bot/runtime/commands';

module.exports = async client => {
    client.aliases = new Collection();

    let dirErrors = []; let fileErrors = []; //collect error objects to output them all at the end
    let readDirs = []; //list of dirs to print at the end
    let conflictingAliases = {};
    client.log('Loading commands...', {source: 'boot', color: 'blue'}, 0, 1);
    const readDir = dir => { //when you're trying to comment your code but realize you have good variable naming for once and don't need to :D
        let dirRead;
        try {dirRead = fs.readdirSync(dir);}
        catch (e) {
            client.error(`Failed to read directory ${chalk.white(dir)}`);
            return dirErrors.push([`Unable to read directory ${chalk.white(dir)}. Error:`, e]);
        }
        let files = dirRead.filter(item => item.endsWith('.js'));
        let folders = dirRead.filter(item => fs.lstatSync(`${dir}/${item}`).isDirectory());
        files.forEach(file => {
            try {
                const command = require(`../../../../${dir.slice(2)}/${file}`);
                client.commands.set(command.name, command);
                if (command.aliases) {command.aliases.forEach(alias => {
                    if (client.aliases.has(alias)) {
                        if (conflictingAliases[alias]) {conflictingAliases[alias].push(command.name);} //object of alias conflictions keyed by alias -> by array[command names]
                        else {conflictingAliases[alias] = [command.name];}
                    }
                    client.aliases.set(alias, command.name);
                });}
                client.log(`Loaded ${chalk.white(command.name)} with ${chalk.white(`${command.aliases ? command.aliases.length : 0}`)} alias${command.aliases && command.aliases.length === 1 ? '' : 'es'}.`, {color: 'blueBright', source: 'boot', sourceColor: 'blue'});
            }
            catch (e) {
                client.error(`Failed to read file ${chalk.white(file)}`);
                return fileErrors.push([`Unable to read file ${chalk.white(file)}. Error:`, e]);
            }
        });
        readDirs.push(`${dir.split('/').slice(4).join('/')}/`); // "commands/..."
        return folders.forEach(folder => readDir(`${dir}/${folder}`)); //recurse infinitely
    };
    readDir(commandsDirName);
    console.log("");
    dirErrors.forEach(error => client.error(error[0], 0, 0, 1, error[1]));
    fileErrors.forEach(error => client.error(error[0], 0, 0, 1, error[1]));
    readDirs.forEach(dir => client.log(`Read from directory ${chalk.green(dir)}`, {source: 'proc'}));
    console.log('');
    Object.keys(conflictingAliases).forEach(alias => client.warn(`Alias ${chalk.white(alias)} appears on ${client.utils.as(conflictingAliases[alias].length, 'command')} ${chalk.white(conflictingAliases[alias].join(chalk.yellow(', ')))}`));
    if (Object.keys(conflictingAliases).length) {console.log('')};
    client.log(`Loaded ${chalk.white(client.commands.size)} command${client.utils.s(client.commands.size)}!`, {color: 'blue', source: 'boot'}, 0, 1);
};