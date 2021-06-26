import {TextChannel, Message, MessageEmbed, Client, MessageReaction, ReactionCollector} from 'discord.js';

export class Pagination {
    channel: TextChannel;
    message: Message;
    pages: MessageEmbed[];
    originalMessage: Message;
    currentPage: number;
    client: Client;
    loopPages: boolean = true;
    controllers: ControllerData = {enabled: false, endTime: null, collector: null, lastInteraction: null};
    timeoutInterval: any;



    constructor (channel: TextChannel, pages: MessageEmbed[], originalMessage: Message, client: Client, loopPages?: boolean, message?: Message) {
        this.channel = channel;
        this.pages = pages;
        this.originalMessage = message;
        this.client = client;
        this.currentPage = 0;

        if (message) {this.message = message;}
        if (loopPages) {this.loopPages = loopPages;}
    };



    public async setPage(page: number): Promise<Pagination> {
        if (this.pages.length < page + 1) {}

        if (!this.message) {
            let tempm = await this.channel.send("One moment...")
                .catch(() => {this.originalMessage.reply("There seemed to be a problem doing that..."); return this;});
            if (tempm instanceof Pagination) {return this;}
            else {this.message = tempm;}
        }

        await this.message.edit('', this.pages[page]
            .setFooter(`${this.client.user.username} | Page ${page + 1} of ${this.pages.length}`, this.client.user.avatarURL())
            .setTimestamp()
        );
        this.currentPage = page;

        return this;
    };

    public async nextPage(): Promise<Pagination> {
        await this.setPage(typeof this.currentPage === "number"
            ? this.currentPage + 1 == this.pages.length
                ? this.loopPages
                    ? 0
                    : this.currentPage
                : this.currentPage + 1
            : 0
        );
        return this;
    };

    public async prevPage(): Promise<Pagination> {
        await this.setPage(typeof this.currentPage === "number"
            ? this.currentPage === 0
                ? this.loopPages
                    ? this.pages.length - 1
                    : 0
                : this.currentPage - 1
            : this.pages.length - 1
        );
        return this;
    };

    public addPage(page: MessageEmbed): Pagination {
        this.pages.push(page);
        return this;
    };

    public replacePage(index: number, page: MessageEmbed): Pagination {
        if (index < 0) {throw new RangeError("replacePage() param 'index' must be a value greater than 0");}
        if (index > this.pages.length - 1) {throw new RangeError("replacePage() param 'index' must be a value corresponding to an index that already exists in this instance's pages.");}

        this.pages[index] = page;
        return this;
    };


    public async setControllers(endTime: number, user?: 'any' | string, extraControls?: ExtraControls): Promise<Pagination> {
        if (this.controllers.enabled) {return;}

        await this.message.react('⬅');
        await this.message.react('➡');
        await this.message.react('⏹');

        let emoji = ['⬅', '➡', '⏹'];
        let filter = user && user.toLowerCase().trim() !== 'any'
            ? (r: MessageReaction, u) => {return u.id === user.trim() && emoji.includes(r.emoji.name);}
            : (r: MessageReaction) => {return emoji.includes(r.emoji.name);};

        this.controllers.collector = this.message.createReactionCollector(filter, {time: 450000});

        this.controllers.collector.on('collect', async (r: MessageReaction) => {
            let functions = {
                '⬅': () => {return this.prevPage();},
                '➡': () => {return this.nextPage();},
                '⏹': () => {return this.endControllers();}
            }
            this.controllers.lastInteraction = new Date();
            return functions[r.emoji.name]();
        });

        this.controllers.enabled = true;
        this.controllers.endTime = endTime;
        this.controllers.lastInteraction = new Date();

        this.timeoutInterval = setInterval(() => {
            if (new Date().getTime() - this.controllers.lastInteraction.getTime() > this.controllers.endTime && this.controllers.enabled) {return this.endControllers();}
        }, this.controllers.endTime);

        return this;
    };

    public async updateControllers(): Promise<Pagination> {return this;};

    public async endControllers(): Promise<Pagination> {
        await this.message.reactions.removeAll();
        this.controllers.collector.stop();

        let fe = this.message.embeds[0];
        fe.setDescription(`${fe.description}\n\n*This menu has ended, start a new one to interact with it!*`);
        fe.setFooter(`${fe.footer.text} | Menu ended`, this.client.user.avatarURL());
        await this.message.edit(fe);

        clearInterval(this.timeoutInterval);

        return this;
    };


    public async start(options?: {endTime?: number, startPage?: number, user?: 'any' | string}): Promise<Pagination> {
        await this.setPage(options && options.startPage ? options.startPage : 0);
        await this.setControllers(options && options.endTime ? options.endTime : 60, options && options.user ? options.user : 'any');

        return this;
    };

    public async stop(): Promise<Pagination> {
        return await this.endControllers();
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
