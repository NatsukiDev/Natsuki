"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivePagination = void 0;
const pagination_1 = require("./pagination");
class LivePagination extends pagination_1.Pagination {
    constructor(channel, pages, originalMessage, client, loopPages, message) {
        super(channel, pages, originalMessage, client, loopPages, message);
    }
    ;
    setOnScrollAttemptHandler(func) {
        this._onScrollAttempt = func;
        return this;
    }
    ;
    async start(options) {
        if (!this._onScrollAttempt) {
            LivePagination.throwNoScrollAttempt();
        }
        await super.start(options);
        return this;
    }
    async setControllers(endTime, user) {
        if (!this._onScrollAttempt) {
            LivePagination.throwNoScrollAttempt();
        }
        await super.setControllers(endTime, user);
        return this;
    }
    ;
    async setPage(page) {
        if (!this._onScrollAttempt) {
            LivePagination.throwNoScrollAttempt();
        }
        this._onScrollAttempt(this, page, typeof this.pages[page] !== 'undefined' && this.pages[page] !== null, typeof this.knownMax === 'number' ? page < this.knownMax : true);
        await super.setPage(page);
        return this;
    }
    ;
    static throwNoScrollAttempt() {
        throw new Error("Fatal Pagination Error: You tried to start the LivePagination without setting a scrollAttemptEvent. This is necessary to allow the pagination to be built as the user scrolls. If you don't know what you're doing here, just make a Pagination instead.");
    }
    set onScrollAttempt(func) {
        this._onScrollAttempt = func;
    }
    ;
}
exports.LivePagination = LivePagination;
