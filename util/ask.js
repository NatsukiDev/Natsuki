module.exports = async (message, toAsk, time, nf) => {
    let msg = await message.channel.send(toAsk);
    let filter = nf ? () => true : m => m.author.id === message.author.id;
    try {
        let collected = await msg.channel.awaitMessages(filter, {max: 1, errors: ['time'], time: time});
        collected = collected.first().content;
        return collected;
    } catch {
        message.reply("This question has timed out! Please try again.");
        return null;
    }
};