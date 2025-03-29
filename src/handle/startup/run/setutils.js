module.exports = client => {
    client.utils = {}; //small collection of basic string manipulation utilities so prettier strings are easier

    //pluralize most strings based on a number
    client.utils.s = num => num === 1 ? '' : 's';
    //pluralize but pass in the text to make plural
    client.utils.as = (num, text) => `${text}${client.utils.s(num)}`;
    // "a" or "an" based on the provided string, caps to begin with capital letter
    client.utils.an = (text, caps) => `${caps ? 'A' : 'a'}${['a', 'e', 'i', 'o', 'u'].includes(text.toLowerCase().trim().slice(0, 1)) ? 'n' : ''} ${text}`;
    //capitalize a string automatically, "a" if rest of string should be automatically lowercased
    client.utils.c = (text, a=true) => `${text.slice(0, 1).toUpperCase()}${a ? text.slice(1).toLowerCase() : text.slice(1)}`;
    //split text into words and autocap each one
    client.utils.ca = (text, a=true) => text.split(/\s+/gm).map(t => client.utils.c(t, a)).join(" ");
    //format a moment-presice-range object
    client.utils.sm = (mpr, ago=true) => `${mpr.years ? `${mpr.years} year${client.utils.s(mpr.years)} ` : ''}${mpr.months ? `${mpr.months} month${client.utils.s(mpr.months)} ` : ''}${mpr.days} day${client.utils.s(mpr.days)}${ago ? ' ago' : ''}`;
    //add a grammatically correct possessive indicator to the end of a word/string
    client.utils.p = (text) => text.endsWith('s') ? "'" : "'s";
    //possessivise but pass in the text to possessivize
    client.utils.ps = (text) => `${text}${client.utils.p(text)}`;
    //random element of array
    client.utils.gr = list => list[Math.floor(Math.random() * list.length)];
};