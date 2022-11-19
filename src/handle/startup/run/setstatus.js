module.exports = client => {
    const prefix = client.prefix;
    const statuses = {
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

    try {if (client.misc.statusTimeout) {clearTimeout(client.misc.statusTimeout)};} catch {}

    const setStatus = () => {
        let type = Object.keys(statuses)[Math.floor(Math.random() * Object.keys(statuses).length)];
        if (type === "PLAYING") {client.user.setActivity(statuses[type][Math.floor(Math.random() * statuses[type].length)] + " | " + prefix + "help");}
        else {client.user.setActivity(statuses[type][Math.floor(Math.random() * statuses[type].length)] + " | " + prefix + "help", {type: type});}
    };
    setStatus();
    client.misc.statusTimeout = setTimeout(setStatus, 14400000);
};