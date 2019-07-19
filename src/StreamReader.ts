import { ReadStream } from 'fs';

export default class StreamReader {
    _readable: Promise<boolean>;
    _stream: ReadStream;
    _resolve?: (res: boolean) => void;
    _reject?: (err: any) => void;

    constructor(stream: ReadStream) {
        this._readable = this._promise(this);
        this._stream = stream.on('readable', this._read.bind(this))
            .on('end', this._end.bind(this))
            .on('close', this._end.bind(this))
            .on('error', this._error.bind(this));
    }

    async open() {
        return await this._resolve;
    }

    async read(length: number) {
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
            res();
            // if(stream.destroyed) return res();
            // stream.once('close', res).destroy();
        });
    }

    _promise(source: StreamReader): Promise<boolean> {
        return new Promise((res, rej) => {
            source._resolve = res;
            source._reject = rej;
        });
    }

    _read() {
        const resolve = this._resolve;
        this._readable = this._promise(this);
        resolve && resolve(false);
    }

    _end() {
        const resolve = this._resolve;
        this._readable = Promise.resolve(true);
        this._resolve = this._reject = this._empty;
        resolve && resolve(true);
    }
    
    _error(err: any) {
        const reject = this._reject;
        this._readable = Promise.reject(err);
        this._resolve = this._reject = this._empty;
        reject && reject(err);
    }

    _empty() { }
}