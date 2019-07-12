const fs = require('fs')
const StreamWriter = require('../src/StreamWriter')

async function writeFileAsync() {
    const writableStream = fs.createWriteStream('./test.txt', { encoding: 'utf-8' })
    const sw = new StreamWriter(writableStream)
    await sw.write('Howard Ni Hao... \r\n')
    await sw.write('Bibioo is comming... let\'s go away! \r\n')
    await sw.write('Yoki is coming too, let\' do it.')
    await sw.end()
}