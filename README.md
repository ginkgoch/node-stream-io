# node-stream-reader
A stream reader for nodejs with async methods. No extra lib referenced.
```javascript
const fs = require('fs');
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
