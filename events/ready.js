const Discord = require('discord.js');
const chalk = require('chalk');
const moment = require('moment');
const mongoose = require('mongoose');

var prefix = 'n?';

module.exports = async client => {
	const config = client.config;
	try {
		await mongoose.connect(`mongodb+srv://${config.database.user}:${config.database.password}@${config.database.cluster}.3jpp4.mongodb.net/test`, {
			useFindAndModify: false, useNewUrlParser: true, dbName: 'Natsuki-Main', useUnifiedTopology: true
		});
	} catch (e) {
		let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
		console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | Occurred while trying to connect to Mongo Cluster`)}`, e);
	}

    console.log(`\n${chalk.green('[BOOT]')} >> [${moment().format('L LTS')}] -> ${chalk.greenBright("Connected to Discord")}.`);
    let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
    console.log(`\n${chalk.gray('[INFO]')} >> ${chalk.white(`Logged in at ${date}.`)}`);
    console.log(`\n${chalk.gray('[INFO]')} >> ${chalk.white(`Logged in as ${client.user.username}!`)}`);
    console.log(`${chalk.gray('[INFO]')} >> ${chalk.white(`Client ID: ${client.user.id}`)}`);
    console.log(`${chalk.gray('[INFO]')} >> ${chalk.white(`Running on ${client.guilds.cache.size} servers!`)}`);
    console.log(`${chalk.gray('[INFO]')} >> ${chalk.white(`Serving ${client.users.cache.size} users!`)}`);

	let responses = {
		"PLAYING": [
			`in ${client.guilds.cache.size} servers`
		],
		"WATCHING": [
			`for ${client.commands.size} commands`
			,`over ${client.guilds.cache.size} servers`
		]
	};
	const setR = () => {
		let type = Object.keys(responses)[Math.floor(Math.random() * Object.keys(responses).length)];
		client.user.setActivity(responses[type][Math.floor(Math.random() * responses[type].length)] + " | " + prefix + "help", {type: type});};
	setR();
	setInterval(setR, 14400000);
	
	const BotDataSchema = require('../models/bot');

	let botData = await BotDataSchema.findOne({finder: 'lel'})
		? await BotDataSchema.findOne({finder: 'lel'})
		: new BotDataSchema({
			finder: 'lel',
			commands: 0,
			servers: 0,
			servers_all: 0,
			restarts: 0,
			lastRestart: new Date(),
			errors_all: 0,
		});
    botData.servers = client.guilds.cache.size;
    botData.servers_all = botData.servers_all + 1;
    botData.restarts = botData.restarts + 1;
    botData.lastRestart = new Date();

	console.log(`${chalk.gray('\n[INFO]')} >> ${chalk.white(`This is restart #${botData.restarts}.`)}`);

    await botData.save();
};