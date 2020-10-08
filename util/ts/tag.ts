export class Tag {
    triggers: string[] = [];
    tagName: string;
    filterType: TagFilterType;

    constructor(triggers: string[], tagName: string, filterType: TagFilterType) {
        let trigger: string; for (trigger of triggers) {
            this.triggers.push(
                trigger.trim().startsWith("-") ? trigger.trim() : `-${trigger.trim()}`
            );
        }

        this.tagName = tagName;
        this.filterType = filterType;
    };

    public addTrigger(trigger: string): Tag {
        this.triggers.push(
            trigger.trim().startsWith("-") ? trigger.trim() : `-${trigger.trim()}`
        );
        return this;
    };
}

type TagFilterType = "append" | "toggle";