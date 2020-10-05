const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');

module.exports = client => {
    let eventFilter = fs.readdirSync('./events/').filter(x => x.endsWith('.js'));
    console.log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Getting Events...')}\n`);
    for (let file of eventFilter) {
        let evt = require('../events/' + file);
        let evtName = file.split('.')[0];
        client.on(evtName, evt.bind(null, client));
        console.log(`${chalk.gray('[LOG] ')} >> ${chalk.blueBright('Loaded Event')} ${chalk.white(evtName)}`);
    };
    console.log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Loaded all Events')}`);
};