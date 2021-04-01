const Discord = require('discord.js');
const client = new Discord.Client();

const chalk = require('chalk');
const ora = require('ora');
const mongoose = require('mongoose');

client.misc = {
    savers: ['497598953206841375', '480535078150340609', '468903364533420074'],
    activeDMs: new Discord.Collection(),
    statusPings: new Discord.Collection(),
    startup: new Date(),
    startupNoConnect: null,
    cache: {
        ar: new Map(),
        arIgnore: new Map(),
        bl: {
            guild: [],
            user: []
        },
        lxp: {
            enabled: [],
            xp: {},
            hasLevelRoles: []
        }
    }
};

//const config = require('./config.js');
const auth = require('./auth.json');

//client.config = config;

async function init() {
    let cloginsp = ora(chalk.magentaBright('Connecting Discord client...')).start();
    let pclc = new Date().getTime();
    await client.login(auth.token);
    cloginsp.stop(); cloginsp.clear();
    console.log(`${chalk.green('[BOOT]')} >> ${chalk.greenBright(`Connected to Discord in `)}${chalk.white(`${new Date().getTime() - pclc}ms`)}`);

    client.misc.startupNoConnect = new Date();
    client.config = auth;

    let mloginsp = ora(chalk.magentaBright('Connecting to Mongo client...')).start();
    let pmcc = new Date().getTime();
    const config = client.config;
    try {
        await mongoose.connect(`mongodb+srv://${config.database.user}:${config.database.password}@${config.database.cluster}.3jpp4.mongodb.net/test`, {
            useFindAndModify: false, useNewUrlParser: true, dbName: 'Natsuki-Main', useUnifiedTopology: true, useCreateIndex: true
        }).catch(e => {
            let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
            console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | Occurred while trying to connect to Mongo Cluster`)}`, e);
            mloginsp.stop(); mloginsp.clear();
        });
        mloginsp.stop(); mloginsp.clear();
        console.log(`${chalk.green('[BOOT]')} >> ${chalk.greenBright(`Connected to Mongo Database in `)}${chalk.white(`${new Date().getTime() - pmcc}ms`)}`);
    } catch (e) {
        let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
        console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | Occurred while trying to connect to Mongo Cluster`)}`, e);
        mloginsp.stop(); mloginsp.clear();
    }

    ['commands', 'aliases'].forEach(x => client[x] = new Discord.Collection());
    client.responses = {triggers: [], commands: new Discord.Collection()};

    ['command', 'event', 'response'].forEach(x => require(`./handle/${x}`)(client));

    client.developers = ["330547934951112705", "673477059904929802"];
    client.utils = {};

    client.utils.logch = async () => {return client.guilds.cache.get('762707532417335296').channels.cache.get('762732961753595915');};
    client.guildconfig = {};
    client.guildconfig.prefixes = new Map();

    client.guildconfig.logs = new Map();

    await require('./events/ready')(client);
}
init().then(() => {});