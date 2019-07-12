module.exports = class StreamWriter {
    /**
     * @param {stream.Writable} stream Writable stream.
     */
    constructor(stream) {
        this.stream = stream
    }

    cork() {
        this.stream.cork()
    }

    uncork() {
        this.stream.uncork()
    }

    async write(chunk, encoding = 'utf-8') {
        return await new Promise(res => {
            this.stream.write(chunk, encoding, () => {
                res()
            })
        })
    }

    async end() {
        return await new Promise(res => { 
            this.stream.end(() => {
                res()
            }) 
        })
    }
}