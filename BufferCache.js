const EventEmitter = require('events');
const assert = require('assert');

module.exports = class BufferCache extends EventEmitter {
    constructor(cache, cacheOffset) {
        super();
        this.update(cache, cacheOffset);
    }

    read(length) {
        this._updateCache(length);

        const buffer = this.cache.slice(this.position, this.position + length);
        this.position += length;
        return buffer;
    }

    update(cache, cacheOffset) {
        this.position = 0;
        this.cache = cache;
        this.cacheOffset = cacheOffset;
    }

    _updateCache(length) {
        if (this.position + length <= this.cache.length) { return; }

        const absPosition = this.cacheOffset + this.position;
        this.emit('update', absPosition, length);
        this._checkNotOOB(length);
    }

    _checkNotOOB(length) {
        assert((this.position + length <= this.cache.length), 'Buffer reads out of bounds'); 
    }
}