const chalk = require('chalk');

const {Tag, TagFilter} = require('../../../util/ts/tagfilter');

module.exports = client => {
    const options = new TagFilter([
        new Tag(['dev', 'd', 'developer', 'test'], 'dev', 'toggle'),
        new Tag(['prefix', 'devprefix'], 'prefix', 'append')
    ]).test(process.argv.slice(2).join(" "));
    client.config.options = {};

    if (Object.keys(options).length) { //log and set options
        client.log(`${chalk.gray.bold("Arguments detected.")}`, {source: 'args'}, 0, 1);
        Object.keys(options).forEach(arg => {
            client.config.options[arg] = options[arg];
            client.log(`${chalk.gray.bold(arg)}${chalk.gray(':')} ${chalk.blue(options[arg])}`, {source: 'args'});
        });
        console.log('');
    }
};