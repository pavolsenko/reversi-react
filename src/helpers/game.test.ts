import { getLegalMoves } from './game';
import { BLACK } from '../interfaces/game';

describe('game helper:', () => {
    describe('getLegalMoves', () => {
        it('should return legal moves', () => {
            const moves = getLegalMoves([], BLACK);
            expect(moves).toEqual([]);
        });
    });
});
