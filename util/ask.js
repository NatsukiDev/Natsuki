module.exports = async (message, toAsk, time) => {
    let msg = await message.channel.send(toAsk);
    let filter = m => m.author.id === message.author.id;
    try {
        let collected = await message.channel.awaitMessages(filter, {max: 1, errors: ['time'], time: time});
        collected = collected.first().content;
        return collected;
    } catch {
        message.reply("This question has timed out! Please try again.");
        return null;
    }
};