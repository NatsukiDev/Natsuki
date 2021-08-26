const chalk = require('chalk');
const readline = require('readline');

module.exports = (client) => {
    console.log(`\n${chalk.green('[CONS]')} >> ${chalk.magentaBright(`Type `)}${chalk.white(`"help"`)} ${chalk.magentaBright("for a list of console commands.")}`);

    client.misc.rl.on("line", async (line) => {
        if (!line.length) {return;}

        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 1);

        console.log("");

        const text = line;
        const args = text.split(/\s+/gm);
        const cmd = args.shift().toLowerCase();
        
        const command = client.executables.get(cmd);
        if (!command) {return console.log(`${chalk.yellow('[CONS]')} >> ${chalk.yellowBright(`Command `)}${chalk.white(`"${cmd}"`)} ${chalk.yellowBright("doesn't exist.")}`);}
        await command.execute(client, text, args, cmd);
    });
};