const chalk = require('chalk');

const {Tag} = require('../util/tag');
const {TagFilter} = require('../util/tagfilter');

module.exports = {
    name: "help",
    description: "Displays a list of usable commands.",
    help: "Displays a list of usable commands.",
    usage: "help [command]",
    args: ['list'],
    execute(client, text, args, cmd) {
        const options = args.length ? new TagFilter([new Tag(['l', 'list'], 'list', 'toggle')]).test(args.join(" ")) : {};

        const sp = '       >> ';

        if (args[0] || options.cmd) {
            if (!client.executables.has(args[0].toLowerCase())) {return console.log(`${chalk.yellow('[CONS]')} >> ${chalk.yellowBright(`Command `)}${chalk.white(`"${ex.name}"`)} ${chalk.yellowBright("doesn't exist.")}`);}
            const ex = client.executables.get(args[0]);
            return console.log(`${chalk.gray('[CONS]')} >> [${chalk.blue(`HELP`)}] -> ${chalk.blueBright(ex.name)}\n\n${sp}<${chalk.hex('#b57124')(ex.name)}> - ${chalk.greenBright(ex.usage)}\n${sp}${ex.description} > ${chalk.gray(ex.args.length ? `-${ex.args.join(', -')}` : 'No args')}`);
        } else {
            let s = '';
            s += `${chalk.gray('[CONS]')} >> [${chalk.blue(`HELP`)}] -> ${chalk.blueBright(`Available commands:`)}`;
            Array.from(client.executables.values()).sort((a, b) => a.name > b.name ? 1 : -1).forEach(e => s += `\n\n${sp}<${chalk.hex('#b57124')(e.name)}> - ${chalk.greenBright(e.usage)}\n${sp}${e.description} > ${chalk.gray(e.args.length ? `-${e.args.join(', -')}` : 'No args')}`);
            return console.log(s.slice(0, s.length - 2));
        }
    }
};