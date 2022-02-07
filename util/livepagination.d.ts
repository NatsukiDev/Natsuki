import { TextChannel, Message, MessageEmbed, Client } from 'discord.js';
import { Pagination } from './pagination';
export declare class LivePagination extends Pagination {
    knownMax: number;
    private _onScrollAttempt;
    constructor(channel: TextChannel, pages: MessageEmbed[], originalMessage: Message, client: Client, loopPages?: boolean, message?: Message);
    setOnScrollAttemptHandler(func: (pagination: LivePagination, pos: number, exists: boolean, inBounds: boolean) => void): this;
    start(options?: {
        endTime?: number;
        time?: number;
        startPage?: number;
        user?: 'any' | string;
    }): Promise<LivePagination>;
    setControllers(endTime: number, user: 'any' | string): Promise<LivePagination>;
    setPage(page: number): Promise<LivePagination>;
    private static throwNoScrollAttempt;
    set onScrollAttempt(func: (pagination: LivePagination, pos: number, exists: boolean, inBounds: boolean) => void);
}
