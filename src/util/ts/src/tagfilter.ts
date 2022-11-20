import {Tag} from "./tag";

export {Tag};
export class TagFilter {
    tags: Tag[];
    triggers: Map<String, String>;
    filterTypes: Map<String, TagFilterType>;
    
    constructor(tags: Tag[]) {
        this.tags = tags;
        this.triggers = new Map<String, String>();
        this.filterTypes = new Map<String, TagFilterType>();
        let tag: Tag;
        for (tag of this.tags) {
            let trigger: string; for (trigger of tag.triggers) {
                this.triggers.set(trigger, tag.tagName);
            }
            if (!this.filterTypes.has(tag.tagName)) {this.filterTypes.set(tag.tagName, tag.filterType);}
        }
    }

    public test(text: string): object {
        var filtered: object = {};
        var reading: string = null;
        var filterType: TagFilterType;
        var ticks = {};

        let words = text.trim().split(/\s+/g);
        let word: string; for (word of words) {
            if (word.startsWith('-') && word.length > 1 && this.triggers.has(word.trim())) {
                filterType = this.filterTypes.get(this.triggers.get(word.trim()));
                reading = !['append', 'listAppend'].includes(filterType) ? null : word.trim();
                if (!reading) {filtered[`${this.triggers.get(word.trim())}`] = true;}
                else {filtered[`${this.triggers.get(reading)}`] = filterType == 'append' ? '' : Array.isArray(filtered[`${this.triggers.get(reading)}`]) ? filtered[`${this.triggers.get(reading)}`] : [];}
                if (filterType == "listAppend") {
                    if (ticks[`${this.triggers.get(word.trim())}`] && ticks[`${this.triggers.get(word.trim())}`].length) {filtered[`${this.triggers.get(word.trim())}`].push(ticks[`${this.triggers.get(word.trim())}`]);}
                    ticks[`${this.triggers.get(word.trim())}`] = '';
                }
            }
            else if (reading) {
                if (filterType == "listAppend") {ticks[`${this.triggers.get(reading)}`] += ` ${word}`;}
                else {filtered[`${this.triggers.get(reading)}`] = `${filtered[`${this.triggers.get(reading)}`]} ${word}`;}
            }
        }

        let tick: string; for (tick of Object.keys(ticks)) {
            if (ticks[tick].length) {filtered[tick].push(ticks[tick]);}
        }
        
        let key: string; for (key of Object.keys(filtered)) {
            if (typeof filtered[key] == 'string') {filtered[key] = filtered[key].trim();}
            else if (Array.isArray(filtered[key])) {
                let subkey: string; for (subkey of filtered[key]) {
                    filtered[key][filtered[key].indexOf(subkey)] = subkey.trim();
                }
            }
        }

        return filtered;
    };
}

type TagFilterType = "append" | "toggle" | "listAppend";