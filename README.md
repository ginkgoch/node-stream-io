# node-stream-io
A stream reader/writer for nodejs with async methods. No extra lib referenced.

## StreamReader
```javascript
const fs = require('fs');
const { StreamReader } = require('ginkgoch-stream-io') 

const stream = fs.createReadStream(filename, { encoding: 'utf-8' });
async function load(stream) {
    let sr = new StreamReader(stream);
    await sr.open();
    
    let r = undefined;
    while(r = await sr.read(16)) {
        console.log(r);
    }
}

load(stream);
```

## StreamWriter
```javascript
const fs = require('fs');
const { StreamWriter } = require('ginkgoch-stream-io') 

async function load(stream) {
    const sw = new StreamWriter(stream)
    await sw.writeLine('Content 1')
    await sw.writeLine('Content 2')
    await sw.writeLine('Content 3')
    await sw.end()
}

const stream = fs.createWriteStream(filename, { encoding: 'utf-8' })
load(stream);
```
