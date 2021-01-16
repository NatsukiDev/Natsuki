import { TextChannel, Message, MessageEmbed, Client, ReactionCollector } from 'discord.js';
export declare class Pagination {
    channel: TextChannel;
    message: Message;
    pages: MessageEmbed[];
    originalMessage: Message;
    currentPage: number;
    client: Client;
    loopPages: boolean;
    controllers: ControllerData;
    timeoutInterval: any;
    constructor(channel: TextChannel, pages: MessageEmbed[], originalMessage: Message, client: Client, loopPages?: boolean, message?: Message);
    setPage(page: number): Promise<Pagination>;
    nextPage(): Promise<Pagination>;
    prevPage(): Promise<Pagination>;
    addPage(page: MessageEmbed): Pagination;
    replacePage(index: number, page: MessageEmbed): Pagination;
    setControllers(endTime: number, user?: 'any' | string, extraControls?: ExtraControls): Promise<Pagination>;
    updateControllers(): Promise<Pagination>;
    endControllers(): Promise<Pagination>;
    start(options?: {
        endTime?: number;
        startPage?: number;
        user?: 'any' | string;
    }): Promise<Pagination>;
    stop(): Promise<Pagination>;
}
interface ExtraControls {
}
interface ControllerData {
    endTime: number;
    enabled: boolean;
    lastInteraction: Date;
    collector: ReactionCollector;
}
export {};
