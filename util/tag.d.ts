export declare class Tag {
    triggers: string[];
    tagName: string;
    filterType: TagFilterType;
    constructor(triggers: string[], tagName: string, filterType: TagFilterType);
    addTrigger(trigger: string): Tag;
}
declare type TagFilterType = "append" | "toggle" | "listAppend";
export {};
