import {TextChannel, Message, MessageEmbed, Client} from 'discord.js';

export class Pagination {
    channel: TextChannel;
    message: Message;
    pages: MessageEmbed[];
    originalMessage: Message;
    currentPage: number;
    client: Client;



    constructor (channel: TextChannel, pages: MessageEmbed[], originalMessage: Message, client: Client, message?: Message) {
        this.channel = channel;
        this.pages = pages;
        this.originalMessage = message;
        this.client = client;
        this.currentPage = 0;

        if (message) {this.message = message;}
    };



    public async setPage(page: number): Promise<Pagination> {
        if (this.pages.length < page + 1) {}

        if (!this.message) {
            let tempm = await this.channel.send("One moment...")
            .catch(() => {this.originalMessage.reply("There seemed to be a problem doing that..."); return this;});
            if (tempm instanceof Pagination) {return this;}
            else {this.message = tempm;}
        }

        await this.message.edit(this.pages[page]
            .setFooter(`Natsuki | Page ${page + 1} of ${this.pages.length}`, this.client.user.avatarURL())
            .setTimestamp()
        );
        this.currentPage = page;

        return this;
    };

    public async nextPage(): Promise<Pagination> {
        await this.setPage(typeof this.currentPage === "number" ? this.currentPage + 1 == this.pages.length ? this.currentPage : this.currentPage + 1 : 0);
        return this;
    };

    public async prevPage(): Promise<Pagination> {
        await this.setPage(typeof this.currentPage === "number" ? this.currentPage === 0 ? 0 : this.currentPage - 1 : this.pages.length - 1);
        return this;
    };

    public addPage(page: MessageEmbed): Pagination {
        this.pages.push(page);
        return this;
    }

    public replacePage(index: number, page: MessageEmbed): Pagination {
        if (index < 0) {throw new RangeError("replacePage() param 'index' must be a value greater than 0");}
        if (index > this.pages.length - 1) {throw new RangeError("replacePage() param 'index' must be a value corresponding to an index that already exists in this instance's pages.");}

        this.pages[index] = page;
        return this;
    }
}