import { TextChannel, Message, MessageEmbed, Client } from 'discord.js';
export declare class Pagination {
    channel: TextChannel;
    message: Message;
    pages: MessageEmbed[];
    originalMessage: Message;
    currentPage: number;
    client: Client;
    constructor(channel: TextChannel, pages: MessageEmbed[], originalMessage: Message, client: Client, message?: Message);
    setPage(page: number): Promise<Pagination>;
    nextPage(): Promise<Pagination>;
    prevPage(): Promise<Pagination>;
    addPage(page: MessageEmbed): Pagination;
    replacePage(index: number, page: MessageEmbed): Pagination;
}
