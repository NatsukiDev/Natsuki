const ws = require('ws');
const chalk = require('chalk');

const port = 1029;

const wss = new ws.Server({port: port});

console.log(`\n${chalk.white("[BOOT]")} >> ${chalk.greenBright(`Initialized Websocket on`)} ${chalk.white(`port ${port}`)}\n`);

wss.on('connection', (ws) => {
    console.log(`\n${chalk.white("[SCKT]")} >> ${chalk.blue("Received new websocket connection")}\n`);
    ws.on('message', (msg) => {console.log(msg);});
});