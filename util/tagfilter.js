"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagFilter = void 0;
class TagFilter {
    constructor(tags) {
        this.tags = tags;
        this.triggers = new Map();
        this.filterTypes = new Map();
        let tag;
        for (tag of this.tags) {
            let trigger;
            for (trigger of tag.triggers) {
                this.triggers.set(trigger, tag.tagName);
            }
            if (!this.filterTypes.has(tag.tagName)) {
                this.filterTypes.set(tag.tagName, tag.filterType);
            }
        }
    }
    test(text) {
        var filtered = {};
        var reading = null;
        let words = text.trim().split(/\s+/g);
        let word;
        for (word of words) {
            if (word.startsWith('-') && word.length > 1 && this.triggers.has(word.trim())) {
                reading = this.filterTypes.get(this.triggers.get(word.trim())) == "toggle" ? null : word.trim();
                if (!reading) {
                    filtered[`${this.triggers.get(word.trim())}`] = true;
                }
                else {
                    filtered[`${this.triggers.get(reading)}`] = '';
                }
            }
            else if (reading) {
                filtered[`${this.triggers.get(reading)}`] = `${filtered[`${this.triggers.get(reading)}`]} ${word}`;
            }
        }
        let key;
        for (key of Object.keys(filtered)) {
            if (typeof filtered[key] == 'string') {
                filtered[key] = filtered[key].trim();
            }
        }
        return filtered;
    }
    ;
}
exports.TagFilter = TagFilter;
