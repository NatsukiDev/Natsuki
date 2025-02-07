const chalk = require('chalk');
const moment = require('moment');
const lastfm = require("lastfm");

const GuildSettings = require('../models/guild');
const BotDataSchema = require('../models/bot');
const LogData = require('../models/log');
const Saves = require('../models/saves');

const siftStatuses = require('../util/siftstatuses');
const localXPCacheClean = require('../util/lxp/cacheloop');
const monitorCacheClean = require('../util/monitorloop');
const vcloop = require('../util/vcloop');

let prefix = 'n?';

module.exports = async client => {
	if (client.misc.readied) {return;}
	client.misc.readied = true;
	await client.misc.botFinished;
	
	const config = client.config;

    console.log(`\n${chalk.green('[BOOT]')} >> [${moment().format('L LTS')}] -> ${chalk.greenBright("Connected to Discord")}.`);
    let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
    console.log(`\n${chalk.gray('[INFO]')} >> ${chalk.white(`Logged in at ${date}.`)}`);
    console.log(`\n${chalk.gray('[INFO]')} >> ${chalk.white(`Logged in as ${client.user.username}!`)}`);
    console.log(`${chalk.gray('[INFO]')} >> ${chalk.white(`Client ID: ${client.user.id}`)}`);
    console.log(`${chalk.gray('[INFO]')} >> ${chalk.white(`Running on ${client.guilds.cache.size} servers!`)}`);
	console.log(`${chalk.gray('[INFO]')} >> ${chalk.white(`Serving ${client.users.cache.size} users!`)}`);

	client.lfm = new lastfm.LastFmNode({api_key: client.config.lfm.key, secret: client.config.lfm.secret});

	let responses = {
		"PLAYING": [
			`with my darling`, 'RAIN: Shadow Lords', "with my waifu", "with the neko formula",
			"with magic", "terrible anime games", "anime OSTs at max volume",
			`${Math.ceil(Math.random() * 100)} days of trying to become a samurai`,
			"with the sauce", "witch hats are >", "explosion magic is the best magic",
			"with Kazuma's sanity", "please help i gave myself cat ears",
			"starting my own harem", "wor. wor never changes", "a little more UwU than necessary",
			"please i just want a cat girl in my life", "i'm your waifu now.",
			"i'm in intervention for my neko addiction", "i tried to make a catgirl and broke my staff",
			"fluffy tails = drugs", "in a dungeon without wearing my plot armor",
			"benefits of Natsuki worship: my beautiful face"
			,`in ${client.guilds.cache.size} servers`
		],
		"WATCHING": [
			`for ${client.commands.size} commands`,
			"I'm not a bad slime, slurp!", "Lelouch rule the world!",
			"a slime somehow start an empire", "a fox-maid get her tail fluffed",
			"a raccoon-girl and some guy with a shield", "some chick with unusually red hair",
			"Mob hit 100", "a really bad harem anime", "The Black Swordsman",
			"The Misfit of Demon King Academy", "Akame ga Kill", "a witch explode a castle",
			"Code Geass", "\"did you really think ___ would be enough to kill me?\"",
			"hentacle tentai", "JIBUN WO-", "he did it... he actually made risotto",
			"sasageyo, sasageyo, chi nto wo sasegeyo", "scientists make nekos real :3",
			"yet another isekai don't @ me", "magical girl anime", "episode 1 of One Piece.. pain.",
			"a white-haired dude and a goddess with some MELONS"
			,`over ${client.guilds.cache.size} servers`
		]
	};
	const setR = () => {
		let type = Object.keys(responses)[Math.floor(Math.random() * Object.keys(responses).length)];
		if (type === "PLAYING") {client.user.setActivity(responses[type][Math.floor(Math.random() * responses[type].length)] + " | " + prefix + "help");}
		else {client.user.setActivity(responses[type][Math.floor(Math.random() * responses[type].length)] + " | " + prefix + "help", {type: type});}
	}
	setR();
	setInterval(setR, 14400000);

	const setPL = async () => {let tg; for (tg of Array.from(client.guilds.cache.values)) {
		let tguild = await GuildSettings.findOne({gid: tg.id});
		if (tguild && tguild.prefix && tguild.prefix.length) {client.guildconfig.prefixes.set(tg.id, tguild.prefix);}
		let tl = await LogData.findOne({gid: tg.id});
		if (tl) {
			let keys = Object.keys(tl.logs);
			let k; for (k of keys) {if (typeof tl.logs[k] === "string" && tl.logs[k].length) {
				if (!client.guildconfig.logs.has(tg.id)) {client.guildconfig.logs.set(tg.id, new Map());}
				client.guildconfig.logs.get(tg.id).set(k, tl.logs[k]);
			}}
		}
	}};
	setPL();

	siftStatuses();
	setInterval(() => {siftStatuses(client, null);}, 120000);

	await require('../util/cache')(client);

	let mnsaves = await Saves.findOne({name: 'monnersnames'}) || new Saves({name: 'monnersnames'});
	client.misc.cache.monnersNames = mnsaves.saves;

	setInterval(() => localXPCacheClean(client), 150000);
	setInterval(() => monitorCacheClean(client), 150000);

	setInterval(() => vcloop(client), 60000);

	let botData = await BotDataSchema.findOne({finder: 'lel'}) || new BotDataSchema({
			finder: 'lel',
			commands: 0,
			servers: 0,
			servers_all: 0,
			restarts: 0,
			lastRestart: new Date(),
			errors_all: 0,
		});
    if (!client.misc.config.dev) {
		botData.restarts = botData.restarts + 1;
    	botData.lastRestart = new Date();
		await botData.save();
	}

	await require('../util/lht')(client);

	console.log(`${chalk.gray('\n[INFO]')} >> ${chalk.white(`This is restart #${botData.restarts}.`)}`);

	let cms = new Date().getTime();
	console.log(`${chalk.gray('\n[INFO]')} >> ${chalk.white(`Startup completed in ${cms - client.misc.startup.getTime() - (client.misc.forcedReady ? 5000 : 0)}ms (${cms - client.misc.startupNoConnect.getTime() - (client.misc.forcedReady ? 5000 : 0)}ms post-connect).`)}`);

	client.misc.fullyReady = true;

	require('../console')(client);
};