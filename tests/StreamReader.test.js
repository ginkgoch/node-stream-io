const fs = require('fs');
const path = require('path');
const StreamReader = require('../index');

describe('StreamReader test', () => {
    test('Read normal test', async () => {
        const rs = fs.createReadStream(path.join(__dirname, 'data/demo.dat'), { flags: 'r', autoClose: false });
        const sr = new StreamReader(rs);
        await sr.open();

        const buffer = await sr.readV2(15);
        expect(buffer).toEqual(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
    });

    test('Read test - cache update', async () => {
        const rs = fs.createReadStream(path.join(__dirname, 'data/demo.dat'), { flags: 'r', autoClose: false });
        const sr = new StreamReader(rs);
        sr.bufferCacheCapacity = 8;
        await sr.open();
        
        let buffer = await sr.readV2(6);
        expect(buffer).toEqual(Buffer.from([1, 2, 3, 4, 5, 6]));

        buffer = await sr.readV2(6);
        expect(buffer).toEqual(Buffer.from([7, 8, 9, 10, 11, 12]));

        buffer = await sr.readV2(3);
        expect(buffer).toEqual(Buffer.from([13, 14, 15]));
    });

    test('Read test - read more than cache cap', async () => {
        const rs = fs.createReadStream(path.join(__dirname, 'data/demo.dat'), { flags: 'r', autoClose: false });
        const sr = new StreamReader(rs);
        await sr.open();
        sr.bufferCacheCapacity = 8;
        
        let buffer = await sr.readV2(6);
        expect(buffer).toEqual(Buffer.from([1, 2, 3, 4, 5, 6]));

        buffer = await sr.readV2(6);
        expect(buffer).toEqual(Buffer.from([7, 8, 9, 10, 11, 12]));
        expect(sr.bufferCache.cache.length).toBe(9);
        expect(sr.bufferCache.cache).toEqual(Buffer.from([ 7, 8, 9, 10, 11, 12, 13, 14, 15 ]));
        expect(sr.bufferCache.cacheOffset).toBe(6);

        buffer = await sr.readV2(3);
        expect(buffer).toEqual(Buffer.from([13, 14, 15]));
        expect(sr.bufferCache.cache).toEqual(Buffer.from([ 7, 8, 9, 10, 11, 12, 13, 14, 15 ]));
        expect(sr.bufferCache.cacheOffset).toBe(6);

        buffer = await sr.readV2(3);
        expect(buffer).toEqual(Buffer.alloc(0));
        expect(sr.bufferCache.cache).toEqual(Buffer.alloc(0));
        expect(sr.bufferCache.cacheOffset).toBe(15);
    });
});