import { Tag } from "./tag";
export declare class TagFilter {
    tags: Tag[];
    triggers: Map<String, String>;
    filterTypes: Map<String, TagFilterType>;
    constructor(tags: Tag[]);
    test(text: string): object;
}
declare type TagFilterType = "append" | "toggle";
export {};
