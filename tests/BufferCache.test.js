const BufferCache = require('../BufferCache');

describe('BufferCache tests', () => {
    test('case 1', async () => {
        const source = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const bufferCache = new BufferCache(source, 0);
        let buff = await bufferCache.read(4);
        expect(buff).toEqual(Buffer.from([1, 2, 3, 4]));

        buff = await bufferCache.read(4);
        expect(buff).toEqual(Buffer.from([5, 6, 7, 8]));

        buff = await bufferCache.read(1);
        expect(buff).toEqual(Buffer.from([9]));

        let mockup = jest.fn(async (pos, length) => {
            return await Promise.resolve(Buffer.from([10, 11, 12, 13]));
        });
        bufferCache.fetchCache = mockup;

        buff = await bufferCache.read(4);
        expect(mockup.mock.calls.length).toBe(1);;
        expect(buff).toEqual(Buffer.from([10, 11, 12, 13]));

        bufferCache.fetchCache = null;
        buff = await bufferCache.read(4);
        expect(buff).toEqual(Buffer.alloc(0));
    });

    test('empty test', () => {
        let cache = new BufferCache();
        expect(cache._isEmpty()).toBeTruthy();
    });
});