module.exports = async (member, client, text) => {
    text = text
        .replace(/(?:{{member}}|{{m}})/gm, member.displayName)
        .replace(/(?:{{membercount}}|{{mc}})/gm, `${member.guild.members.cache.size}`)
        .replace(/(?:{{owner}}|{{o}})/gm, member.guild.owner.displayName);
    return text;
};