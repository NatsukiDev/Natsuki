"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
class Pagination {
    constructor(channel, pages, originalMessage, client, loopPages, message) {
        this.loopPages = true;
        this.controllers = { enabled: false, endTime: null, collector: null, lastInteraction: null };
        this.channel = channel;
        this.pages = pages;
        this.originalMessage = message;
        this.client = client;
        this.currentPage = 0;
        if (message) {
            this.message = message;
        }
        if (loopPages) {
            this.loopPages = loopPages;
        }
    }
    ;
    async setPage(page) {
        if (this.pages.length < page + 1) { }
        if (!this.message) {
            let tempm = await this.channel.send("One moment...")
                .catch(() => { this.originalMessage.reply("There seemed to be a problem doing that..."); return this; });
            if (tempm instanceof Pagination) {
                return this;
            }
            else {
                this.message = tempm;
            }
        }
        await this.message.edit('', this.pages[page]
            .setFooter(`Natsuki | Page ${page + 1} of ${this.pages.length}`, this.client.user.avatarURL())
            .setTimestamp());
        this.currentPage = page;
        return this;
    }
    ;
    async nextPage() {
        await this.setPage(typeof this.currentPage === "number"
            ? this.currentPage + 1 == this.pages.length
                ? this.loopPages
                    ? 0
                    : this.currentPage
                : this.currentPage + 1
            : 0);
        return this;
    }
    ;
    async prevPage() {
        await this.setPage(typeof this.currentPage === "number"
            ? this.currentPage === 0
                ? this.loopPages
                    ? this.pages.length - 1
                    : 0
                : this.currentPage - 1
            : this.pages.length - 1);
        return this;
    }
    ;
    addPage(page) {
        this.pages.push(page);
        return this;
    }
    ;
    replacePage(index, page) {
        if (index < 0) {
            throw new RangeError("replacePage() param 'index' must be a value greater than 0");
        }
        if (index > this.pages.length - 1) {
            throw new RangeError("replacePage() param 'index' must be a value corresponding to an index that already exists in this instance's pages.");
        }
        this.pages[index] = page;
        return this;
    }
    ;
    async setControllers(endTime, user, extraControls) {
        if (this.controllers.enabled) {
            return;
        }
        await this.message.react('⬅');
        await this.message.react('➡');
        await this.message.react('⏹');
        let emoji = ['⬅', '➡', '⏹'];
        let filter = user && user.toLowerCase().trim() !== 'any'
            ? (r, u) => { return u.id === user.trim() && emoji.includes(r.emoji.name); }
            : (r) => { return emoji.includes(r.emoji.name); };
        this.controllers.collector = this.message.createReactionCollector(filter, { time: 450000 });
        this.controllers.collector.on('collect', async (r) => {
            console.log(r);
            let functions = {
                '⬅': () => { return this.prevPage(); },
                '➡': () => { return this.nextPage(); },
                '⏹': () => { return this.endControllers(); }
            };
            this.controllers.lastInteraction = new Date();
            return functions[r.emoji.name]();
        });
        this.controllers.enabled = true;
        this.controllers.endTime = endTime;
        this.controllers.lastInteraction = new Date();
        this.timeoutInterval = setInterval(() => {
            if (new Date().getTime() - this.controllers.lastInteraction.getTime() > this.controllers.endTime && this.controllers.enabled) {
                return this.endControllers();
            }
        }, this.controllers.endTime);
        return this;
    }
    ;
    async updateControllers() { return this; }
    ;
    async endControllers() {
        await this.message.reactions.removeAll();
        this.controllers.collector.stop();
        let fe = this.message.embeds[0];
        fe.setDescription(`${fe.description}\n\n*This menu has ended, start a new one to interact with it!*`);
        fe.setFooter(`${fe.footer.text} | Menu ended`, this.client.user.avatarURL());
        await this.message.edit(fe);
        clearInterval(this.timeoutInterval);
        return this;
    }
    ;
    async start(options) {
        await this.setPage(options && options.startPage ? options.startPage : 0);
        await this.setControllers(options && options.endTime ? options.endTime : 60, options && options.user ? options.user : 'any');
        return this;
    }
    ;
    async stop() {
        return await this.endControllers();
    }
    ;
}
exports.Pagination = Pagination;
