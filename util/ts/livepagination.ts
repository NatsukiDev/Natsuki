import {TextChannel, Message, MessageEmbed, Client, MessageReaction, ReactionCollector, DiscordAPIError} from 'discord.js';
import {Pagination} from './pagination';

export class LivePagination extends Pagination {

    knownMax: number;

    private _onScrollAttempt: (pagination: LivePagination, pos: number, exists: boolean, inBounds: boolean) => void;


    constructor (channel: TextChannel, pages: MessageEmbed[], originalMessage: Message, client: Client, loopPages?: boolean, message?: Message) {
        super(channel, pages, originalMessage, client, loopPages, message);
    };



    public setOnScrollAttemptHandler(func: (pagination: LivePagination, pos: number, exists: boolean, inBounds: boolean) => void) {
        this._onScrollAttempt = func;
        return this;
    };

    public async start(options?: {endTime?: number, time?: number, startPage?: number, user?: 'any' | string}): Promise<LivePagination> {
        if (!this._onScrollAttempt) {LivePagination.throwNoScrollAttempt();}
        await super.start(options);
        return this;
    }

    public async setControllers(endTime: number, user: 'any' | string): Promise<LivePagination> {
        if (!this._onScrollAttempt) {LivePagination.throwNoScrollAttempt();}
        await super.setControllers(endTime, user);
        return this;
    };

    public async setPage(page: number): Promise<LivePagination> {
        if (!this._onScrollAttempt) {LivePagination.throwNoScrollAttempt();}
        this._onScrollAttempt(this, page, typeof this.pages[page] !== 'undefined' && this.pages[page] !== null, typeof this.knownMax === 'number' ? page < this.knownMax : true);
        await super.setPage(page);
        return this;
    };


    private static throwNoScrollAttempt() {
        throw new Error("Fatal Pagination Error: You tried to start the LivePagination without setting a scrollAttemptEvent. This is necessary to allow the pagination to be built as the user scrolls. If you don't know what you're doing here, just make a Pagination instead.");
    }


    set onScrollAttempt(func: (pagination: LivePagination, pos: number, exists: boolean, inBounds: boolean) => void) {
        this._onScrollAttempt = func;
    };

}



interface ExtraControls {

}

interface ControllerData {
    endTime: number,
    enabled: boolean,
    lastInteraction: Date,
    collector: ReactionCollector
}