const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');

module.exports = client => {
    let eventFilter = fs.readdirSync('./events/').filter(x => x.endsWith('.js'));
    console.log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Getting Events...')}\n`);
    for (let file of eventFilter) {
        let evtName = file.split('.')[0];
        if (Object.keys(require.cache).includes(require.resolve('../events/' + file))) {delete require.cache[require.resolve('../events/' + file)];}
        let evt = require('../events/' + file);
        client.removeAllListeners(evtName);
        client.on(evtName, evt.bind(null, client));
        console.log(`${chalk.gray('[LOAD]')} >> ${chalk.blueBright('Loaded Event')} ${chalk.white(evtName)}`);
    }
    console.log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Loaded all Events')}`);
};