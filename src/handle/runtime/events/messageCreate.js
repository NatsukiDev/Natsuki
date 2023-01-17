const chalk = require('chalk');

module.exports = async (client, message) => {
    if (!message.content || !message.content.length) {return;} //privileged intent fallback
    
    if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(message.content.trim())) {} //TODO insert ping hello

    let cmd = {};
    cmd.msg = message.content.toLowerCase().trim(); //i believe in shitty naming conventions :D

    let prefixUsed = cmd.msg.startsWith(client.basePrefix) ? client.basePrefix //stamdard default/dev client prefix
        : cmd.msg.startsWith(`<@${client.user.id}>`) ? `<@${client.user.id}>` //mention prefix
        : cmd.msg.startsWith(`<@!${client.user.id}>`) ? `<@!${client.user.id}>` //nicknamed mention prefix
        : null //no prefix used

    cmd.prefix = prefixUsed;

    if (!cmd.prefix) {return;} // ----------> PREFIXED GATEWAY <----------

    cmd.msg = cmd.msg.slice(prefixUsed.length);
    let args = cmd.msg.split(/\s+/gm); //"args" is split by ALL WHITESPACE AND IS LOWERCASED
    cmd.name = args.shift(); //the command without the prefix
    cmd.msg = args.join(" ");
    cmd.args = message.content.trim().slice(prefixUsed.length).trim().split(/ +/gm).slice(1); //args but preserves text state and newlines

    let cmdToRun = client.commands.get(cmd.name) || client.commands.get(client.aliases.get(cmd.name));
    if (!cmdToRun) {return;}
    try {cmdToRun.run(client, message, args, cmd).catch(e => client.error(`There was an error in the ${cmdToRun.name} command.`, 0, 1, e, '\n'));}
    catch (e) {client.error(`There was an error in the ${cmdToRun.name} command.`, 0, 1, e, '\n');}
};