"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
class Tag {
    constructor(triggers, tagName, filterType) {
        this.triggers = [];
        let trigger;
        for (trigger of triggers) {
            this.triggers.push(trigger.trim().startsWith("-") ? trigger.trim() : `-${trigger.trim()}`);
        }
        this.tagName = tagName;
        this.filterType = filterType;
    }
    ;
    addTrigger(trigger) {
        this.triggers.push(trigger.trim().startsWith("-") ? trigger.trim() : `-${trigger.trim()}`);
        return this;
    }
    ;
}
exports.Tag = Tag;
