const BufferCache = require('./BufferCache');

module.exports = class StreamReader {
    constructor(stream) {
        this.position = 0;
        this.bufferCache = new BufferCache();
        this.bufferCache.fetchCache = this._fetchCache.bind(this);
        this.bufferCacheCapacity = 0x200000;
        this._readable = this._promise(this);
        this._stream = stream.on('readable', this._read.bind(this))
            .on('end', this._end.bind(this))
            .on('close', this._end.bind(this))
            .on('error', this._error.bind(this));
    }

    async open() {
        return await this._resolve;
    }

    async readV2(length) {
        return await this.bufferCache.read(length);
    }

    async read(length) {
        let that = this;
        return await new Promise(function slice(res, rej) {
            let buffer = that._stream.read(length);
            if (buffer !== null) return res(buffer);
            that._readable.then(done => {
                return done ? res(null) : slice(res, rej);
            }).catch(rej);
        });
    }

    async cancel() {
        let stream = this._stream;
        return await new Promise(res => {
            if(stream.destroyed) return res();
            stream.once('close', res).destroy();
        });
    }

    _promise(source) {
        return new Promise((res, rej) => {
            source._resolve = res;
            source._reject = rej;
        });
    }

    _read() {
        const resolve = this._resolve;
        this._readable = this._promise(this);
        resolve(false);
    }

    _end() {
        const resolve = this._resolve;
        this._readable = Promise.resolve(true);
        this._resolve = this._reject = this._empty;
        resolve(true);
    }
    
    _error(err) {
        const reject = this._reject;
        this._readable = Promise.reject(err);
        this._resolve = this._reject = this._empty;
        reject(err);
    }

    _empty() { }

    async _fetchCache(position, length) {
        const cacheSize = Math.max(length, this.bufferCacheCapacity);
        const buffer = await this.read(cacheSize);
        if (buffer !== null) {
            this.position += buffer.length;
        }

        return buffer;
    }
}