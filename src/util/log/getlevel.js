const config = require('../../json/config.json');
const levels = require('../ts/log/levels.json');
const validStrings = Object.keys(levels);

const getLevel = (level) => {
    if (typeof level === 'number') {
        if (level <= 0) {return 0;}
        if (level > 3) {return 3;}
        return Math.floor(level);
    } else {
        const levelM = `${level}`.trim().toUpperCase();
        return validStrings.includes(levelM) ? levels[levelM] : typeof config.log.defaultLevel === 'number' ? getLevel(config.log.defaultLevel) : 1;
    }
};