module.exports = async (message, toAsk, time, nofilter, timeoutResponse, deleteAfter) => {
    let msg = await message.channel.send(toAsk);
    let filter = nofilter ? () => true : m => m.author.id === message.author.id;
    try {
        let collectedO = await msg.channel.awaitMessages({filter: filter, max: 1, errors: ['time'], time: time});
        let collected;
        if (collectedO.first().attachments.size > 0) {collected = collectedO.first().attachments.first().url;}
        else {collected = collectedO.first().content;}
        if (deleteAfter) {
            msg.delete().catch(() => {});
            collectedO.first().delete().catch(() => {});
        }
        return collected;
    } catch {
        if (timeoutResponse) {message.reply("This question has timed out! Please try again.");}
        return null;
    }
};