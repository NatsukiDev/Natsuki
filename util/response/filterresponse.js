module.exports = async (member, client, text) => {
    const go = await member.guild.fetchOwner();
    text = text
        .replace(/(?:{{member}}|{{m}})/gm, member.displayName)
        .replace(/(?:{{membercount}}|{{mc}})/gm, `${member.guild.members.cache.size}`)
        .replace(/(?:{{owner}}|{{o}})/gm, go.displayName)
        .replace(/(?:{{ping}}|{{mp}}|{{memberping}}|{{p}})/gm, `<@${member.id}>`)
        .replace(/(?:{{s}}|{{server}}|{{servername}}|{{sn}})/gm, member.guild.name)
        .replace(/{{n}}/gm, '\n')
        .replace(/{{nn}}/gm, '\n\n');
    return text;
};