module.exports = (client, message, cmd) => {
    if (!cmd.cooldown) {return true;}
    if (client.misc.cooldown.has(message.author.id) && client.misc.cooldown.get(message.author.id).includes(cmd.name)) {
        if (typeof cmd.cooldown !== 'number' && !cmd.cooldown.silent) {
            message.channel.send(cmd.cooldown.message || "This command has a cooldown, and it looks like you exceeded it. Slow down a little bit!");
        }
        return false;
    } else {
        setTimeout(() => {
            client.misc.cooldown.get(message.author.id).splice(client.misc.cooldown.get(message.author.id).indexOf(cmd.name), 1);
            if (!client.misc.cooldown.get(message.author.id).length) {client.misc.cooldown.delete(message.author.id);}
        }, typeof cmd.cooldown === 'number' ? cmd.cooldown : cmd.cooldown.time);
        if (!client.misc.cooldown.has(message.author.id)) {client.misc.cooldown.set(message.author.id, []);}
        client.misc.cooldown.get(message.author.id).push(cmd.name);
        return true;
    }
};