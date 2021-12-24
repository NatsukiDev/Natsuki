const Discord = require('discord.js');

const chalk = require('chalk');
const ora = require('ora');
const mongoose = require('mongoose');
const readline = require('readline');

const {SlashCommand} = require('./util/slash');
const {SlashManager} = require('./util/slashmanager');
const {SlashCommandBuilder} = require('@discordjs/builders');

const flags = Discord.Intents.FLAGS;
let fl = []; Object.keys(flags).forEach(flag => fl.push(flags[flag]));
let client = new Discord.Client({intents: fl, partials: ["CHANNEL", "REACTION", "MESSAGE"]});

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
        },
        monit: {},
        monitEnabled: [],
        inVC: [],
        VCG: {},
        activeVC: [],
        chars: new Discord.Collection(),
        anime: new Discord.Collection(),
        charsID: new Discord.Collection(),
        animeID: new Discord.Collection(),
        charsNum: 0
    },
    loggers: {},
    rl: readline.createInterface({input: process.stdin, output: process.stdout}),
    cooldown: new Discord.Collection()
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

    client.slash = new SlashManager(client).setTestServer('691122844339404800').importCommands().init();
    client.slash.register();
    client = client.slash.client;

    let mloginsp = ora(chalk.magentaBright('Connecting to Mongo client...')).start();
    let pmcc = new Date().getTime();
    const config = client.config;
    try {
        await mongoose.connect(`mongodb+srv://${config.database.user}:${config.database.password}@${config.database.cluster}.3jpp4.mongodb.net/test`, {
            useFindAndModify: false, useNewUrlParser: true, dbName: 'Natsuki-Main', useUnifiedTopology: true, useCreateIndex: true
        }).catch(e => {
            let date = new Date(); date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
            console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | Occurred while trying to connect to Mongo Cluster`)}`, e);
            mloginsp.stop(); mloginsp.clear();
        });
        mloginsp.stop(); mloginsp.clear();
        console.log(`${chalk.green('[BOOT]')} >> ${chalk.greenBright(`Connected to Mongo Database in `)}${chalk.white(`${new Date().getTime() - pmcc}ms`)}`);
    } catch (e) {
        let date = new Date(); date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
        console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | Occurred while trying to connect to Mongo Cluster`)}`, e);
        mloginsp.stop(); mloginsp.clear();
    }

    ['commands', 'aliases', 'executables'].forEach(x => client[x] = new Discord.Collection());
    client.responses = {triggers: [], commands: new Discord.Collection()};

    ['command', 'event', 'response', 'console'].forEach(x => require(`./handle/${x}`)(client));

    client.developers = ["330547934951112705", "673477059904929802"];
    client.utils = {};

    client.utils.logch = async () => {return client.guilds.cache.get('762707532417335296').channels.cache.get('762732961753595915');};
    client.guildconfig = {};
    client.guildconfig.prefixes = new Map();

    client.guildconfig.logs = new Map();

    await require('./util/wait')(5000);
    if (!client.misc.readied) {client.misc.forcedReady = true; await require('./events/ready')(client);}
}
init().then(() => {});