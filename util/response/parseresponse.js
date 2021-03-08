const {Tag} = require('../tag');
const {TagFilter} = require('../tagfilter');

module.exports = async (message, client, args) => {
    let options = new TagFilter([
        new Tag(['em', '-embed'], 'embed', 'toggle'),
        new Tag(['-msg', 'message'], 'message', 'toggle'),

        new Tag(['name', 'n'], 'name', 'append'),
        new Tag(['ch', 'channel'], 'channel', 'append'),

        new Tag(['text', 'txt'], 'text', 'append'),

        new Tag(['title', 't'], 'title', 'append'),
        new Tag(['description', 'desc', 'd'], 'description', 'append'),
        new Tag(['fieldname', 'fn', 'newfield', 'nf'], 'fieldnames', 'listAppend'),
        new Tag(['fieldtext', 'ft', 'fieldcontent', 'fc'], 'fieldtexts', 'listAppend'),
        new Tag(['image', 'i'], 'image', 'append'),
        new Tag(['thumbnail', 'thumb', 'th'], 'thumbnail', 'append'),
        new Tag(['servericonthumbnail', 'serverthumbnail', 'sit', 'st'], 'guildthumb', 'toggle'),
        new Tag(['servericonimage', 'serverimage', 'sii', 'si'], 'guildimage', 'toggle'),
        new Tag(['color', 'colour', 'col', 'c'], 'color', 'append'),
    ]).test(args.join(" "));

    if (options.fieldnames && options.fieldnames.length) {
        if (!options.fieldtexts || !options.fieldtexts.length || options.fieldnames.length !== options.fieldtexts.length) {
            message.reply("You must have the same amount of field names as you do field texts."); return null;
        }
    }
    if (options.embed) {
        if (options.text && options.text.length && (options.text.includes(`@everyone`) || options.text.includes('@here')) && !message.member.permissions.has("MENTION_EVERYONE")) {message.reply("You don't have permissions to mention everyone!"); return null;}
        if (options.fieldnames && options.fieldnames.length > 10) {message.reply("You can't have more than 10 fields!"); return null;}
        if (options.color && options.color.length && (![3, 6].includes(options.color.length))) {message.reply("Your color must be a hex value 3 or 6 digits long."); return null;}
        if (options.title && options.title.length > 65) {message.reply("Your title should be less than 65 characters, please :)"); return null;}
        if (options.description && options.description.length > 750) {message.reply("Your description should be less than 750 characters."); return null;}
        if ((!options.title || !options.title.length) || (!options.description || !options.description.length)) {message.reply("You need have a title and a description!"); return null;}
        if (options.image && options.image.length > 300) {message.reply("Your image URL is a bit too long. Try shortening the URL or hosting it somewhere like imgur."); return null;}
        if (options.thumbnail && options.image.thumbnail > 300) {message.reply("Your thumbnail URL is a bit too long. Try shortening the URL or hosting it somewhere like imgur."); return null;}
        if (options.fieldnames) {
            let fn; let ft;
            for (fn of options.fieldnames) {
                if (fn.length > 65) {message.reply("One of your field names is longer than 65 characters. Please shorten it!"); return null;}
            } for (ft of options.fieldtexts) {
                if (ft.length > 500) {message.reply("One of your field texts is longer than 500 characters. Please shorten it!"); return null;}
            }
        }
        if (options.guildthumb) {options.thumbnail = message.guild.iconURL({size: 2048});}
        if (options.guildimage) {options.image = message.guild.iconURL({size: 2048});}
    } else if (options.message) {
        if (options.text && options.text.length > 750) {message.reply("Please keep your message text under 750 characters!"); return null;}
        if (!options.text || !options.text.length) {return message.reply("You must specify -text for your message.");}
    } else {message.reply("You must specify either '-message' or '-embed' for the format of your response."); return null;}

    if (options.channel && options.channel.length) {if (!options.channel.match(/^<#(?:\d+)>$/) && !message.guild.channels.cache.has(options.channel.slice(options.channel.search(/\d/), options.channel.search(">")))) {message.reply("You must use a valid channel in this server."); return null;}}

    if (options.name && options.name.length) {
        options.name = options.name.toLowerCase();
        if (options.name.length > 10) {message.reply("The option name must be less than 10 characters."); return null;}
        if (!options.name.match(/^[a-z0-9-_]+$/)) {message.reply("You can only use a-z, numbers, hyphens, and underscores."); return null;}
    }

    return options;
};