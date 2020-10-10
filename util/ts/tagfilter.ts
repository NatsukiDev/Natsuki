import {Tag} from "./tag";

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

        let words = text.trim().split(/\s+/g);
        let word: string; for (word of words) {
            if (word.startsWith('-') && word.length > 1 && this.triggers.has(word.trim())) {
                reading = this.filterTypes.get(this.triggers.get(word.trim())) == "toggle" ? null : word.trim();
                if (!reading) {filtered[`${this.triggers.get(word.trim())}`] = true;}
                else {filtered[`${this.triggers.get(reading)}`] = '';}
            }
            else if (reading) {
                filtered[`${this.triggers.get(reading)}`] = `${filtered[`${this.triggers.get(reading)}`]} ${word}`;
            }
        }
        
        let key: string; for (key of Object.keys(filtered)) {
            if (typeof filtered[key] == 'string') {filtered[key] = filtered[key].trim();}
        }

        return filtered;
    };
}

type TagFilterType = "append" | "toggle";