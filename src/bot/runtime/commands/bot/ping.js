module.exports = {
    name: "ping",
    aliases: ["p"],
    syntax: '`ping`',
    async run(client, message, args, cmd) {
        message.reply("Pong! This is Natsuki v2 you're speaking with \\*tips hat*");
    }
};