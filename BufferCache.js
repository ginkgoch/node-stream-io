const EventEmitter = require('events');

module.exports = class BufferCache extends EventEmitter {
    constructor(cache, cacheOffset) {
        super();
        this.fetchCache = undefined;
        this.update(cache, cacheOffset);
    }

    async read(length) {
        await this._updateCache(length);
        if(this._isEmpty()) return null;

        const buffer = this.cache.slice(this.position, this.position + length);
        this.position += buffer.length;
        return buffer;
    }

    update(cache, cacheOffset) {
        this.position = 0;
        this.cache = cache;
        this.cacheOffset = (cacheOffset === undefined) ? 0 : cacheOffset;
    }

    async _updateCache(length) {
        if (!this._isEmpty() && this.position + length <= this.cache.length) { return; }

        const absPosition = this.cacheOffset + this.position;
        let newCache = null;
        if (this.fetchCache) {
            newCache = await this.fetchCache(absPosition, length);
        }

        const restCache = this._getRestCache();
        this.update(Buffer.concat([restCache, newCache].filter(b => b !== null)), absPosition);
    }

    _getRestCache() {
        let rest = null;
        if (!this._isEmpty() && this.position < this.cache.length - 1) {
            rest = this.cache.slice(this.position);  
        }

        return rest;
    }

    _isEmpty() {
        return this.cache === undefined || this.cache === null || this.cacheOffset === undefined;
    }
}