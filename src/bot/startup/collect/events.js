const fs = require('fs');
const chalk = require('chalk');
const {Collection} = require('discord.js');

const eventsDirName = './src/bot/runtime/events';

module.exports = async client => {
    client.aliases = new Collection();

    let dirErrors = []; let fileErrors = []; //collect error objects to output them all at the end
    let readDirs = []; //list of dirs to print at the end
    let totalEvents = 0;
    client.log('Loading events...', {source: 'boot', color: 'blue'}, 0, 1);
    const readDir = dir => {
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
                const event = require(`../../../../${dir.slice(2)}/${file}`);
                const eventName = file.split('.')[0];
                client.removeAllListeners(eventName);
                client.on(eventName, event.bind(null, client));
                client.log(`Loaded event ${chalk.white(eventName)}`, {color: 'blueBright', source: 'boot', sourceColor: 'blue'});
            }
            catch (e) {
                client.error(`Failed to read file ${chalk.white(file)}`);
                return fileErrors.push([`Unable to read file ${chalk.white(file)}. Error:`, e]);
            }
        });
        readDirs.push(`${dir.split('/').slice(4).join('/')}/`); // "events/..."
        return folders.forEach(folder => readDir(`${dir}/${folder}`)); //recurse infinitely
    };
    readDir(eventsDirName);
    console.log("");
    dirErrors.forEach(error => client.error(error[0], 0, 0, 1, error[1]));
    fileErrors.forEach(error => client.error(error[0], 0, 0, 1, error[1]));
    readDirs.forEach(dir => client.log(`Read from directory ${chalk.green(dir)}`, {source: 'proc'}));
    client.log(`Loaded ${chalk.white(totalEvents)} event${client.utils.s(totalEvents)}!`, {color: 'blue', source: 'boot'}, 1, 1);
};