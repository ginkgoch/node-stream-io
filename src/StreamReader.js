module.exports = class StreamReader {
    constructor(stream) {
        this._readable = this._promise(this);
        this._stream = stream.on('readable', this._read.bind(this))
            .on('end', this._end.bind(this))
            .on('close', this._end.bind(this))
            .on('error', this._error.bind(this));
    }

    async open() {
        return await this._resolve;
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
}