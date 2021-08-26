const fs = require('fs');
const chalk = require('chalk');

module.exports = client => {
    var executables = fs.readdirSync('./executables').filter(file => file.endsWith('.js'));
    console.log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Getting Console Commands...')}\n`);
    for (let execf of executables) {
        if (Object.keys(require.cache).includes(require.resolve(`../executables/${execf}`))) {delete require.cache[require.resolve(`../executables/${execf}`)];}
        var exec = require(`../executables/${execf}`);
        client.executables.set(exec.name, exec);
        console.log(`${chalk.gray('[LOAD]')} >> ${chalk.blueBright('Loaded CMD')} ${chalk.white(exec.name)}`);
    }
    console.log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Loaded all Executables.')}`);
};