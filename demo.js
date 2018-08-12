const fs = require('fs');
const path = require('path');
const StreamReader = require('./index');
const BufferCache = require('./BufferCache');

async function load() {
    // const rs = fs.createReadStream(path.join(__dirname, 'tests/data/demo.dat'), { flags: 'r', autoClose: false });
    // const sr = new StreamReader(rs);
    // sr.bufferCacheCapacity = 8;
    // await sr.open();
    
    // let buffer = await sr.readV2(6);
    // buffer = await sr.readV2(6);
    // buffer = await sr.readV2(3);

    // const source = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    // const bufferCache = new BufferCache(source, 0);
    // let buff = await bufferCache.read(4);
    // // expect(buff).toEqual(Buffer.from([1, 2, 3, 4]));

    // buff = await bufferCache.read(4);
    // // expect(buff).toEqual(Buffer.from([5, 6, 7, 8]));

    // buff = await bufferCache.read(1);
    // // expect(buff).toEqual(Buffer.from([9]));

    // let mockup = async (pos, length) => {
    //     return await Promise.resolve(Buffer.from([10, 11, 12, 13]));
    // };
    // bufferCache.fetchCache = mockup;

    // buff = await bufferCache.read(4);

    let buff = Buffer.alloc(0);
    let b = buff.slice(2, 4);
    console.log(b);
}

load();