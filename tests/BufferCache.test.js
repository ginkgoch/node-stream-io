const BufferCache = require('../BufferCache');

describe('BufferCache tests', () => {
    test('case 1', () => {
        const source = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const bufferCache = new BufferCache(source, 0);
        let buff = bufferCache.read(4);
        expect(buff).toEqual(Buffer.from([1, 2, 3, 4]));

        buff = bufferCache.read(4);
        expect(buff).toEqual(Buffer.from([5, 6, 7, 8]));

        buff = bufferCache.read(1);
        expect(buff).toEqual(Buffer.from([9]));

        let mockup = jest.fn((pos, length) => {
            bufferCache.update(Buffer.from([10, 11, 12, 13]), pos);
        });
        bufferCache.on('update', mockup);

        buff = bufferCache.read(4);
        expect(mockup.mock.calls.length).toBe(1);;
        expect(buff).toEqual(Buffer.from([10, 11, 12, 13]));

        const errorFunc = () => {
            buff = bufferCache.read(1);
        };

        bufferCache.removeAllListeners('update');

        mockup = jest.fn();
        bufferCache.on('update', mockup);
        expect(errorFunc).toThrow(/Buffer reads out of bounds/);
        expect(mockup.mock.calls.length).toBe(1);
    });
});