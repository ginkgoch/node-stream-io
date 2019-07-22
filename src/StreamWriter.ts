import { WriteStream } from "fs";

export default class StreamWriter {
    stream: WriteStream

    /**
     * @param {stream.Writable} stream Writable stream.
     */
    constructor(stream: WriteStream) {
        this.stream = stream
    }

    cork() {
        this.stream.cork()
    }

    uncork() {
        this.stream.uncork()
    }

    write(chunk: any, encoding = 'utf-8'): Promise<void> {
        return new Promise<void>(res => {
            this.stream.write(chunk, encoding, () => {
                res()
            })
        })
    }

    async writeLine(str: string, encoding = 'utf-8') {
        await this.write(str + '\r\n', encoding)
    }

    end(): Promise<void> {
        return new Promise<void>(res => { 
            this.stream.end(() => {
                res()
            }) 
        })
    }
}