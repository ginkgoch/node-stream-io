const fs = require('fs')
const StreamWriter = require('../src/StreamWriter')

const filename = './test.txt'
async function write(stream) {
    const sw = new StreamWriter(stream)
    await sw.writeLine('Content 1')
    await sw.writeLine('Content 2')
    await sw.writeLine('Content 3')
    await sw.end()
}

const stream = fs.createWriteStream('./test.txt', { encoding: 'utf-8' })
write(stream)