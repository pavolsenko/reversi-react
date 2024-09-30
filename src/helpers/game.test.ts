import { checkIsGameOver, countBlack, countWhite, getLegalMoves, getStartGame } from './game';

import { EMPTY, LegalMove, WHITE } from '../interfaces/game';

import { basicGame1, basicGame2 } from './__mocks__/fields';

describe('game helper:', () => {
    describe('getStartGame', () => {
        const startGame = getStartGame();
        expect(startGame[4][4].type).toBe(WHITE);
        expect(startGame[1][1].type).toBe(EMPTY);
    });


    describe('checkIfGameOver', () => {
        it('should return true', () => {
            expect(checkIsGameOver(getStartGame(), [], [])).toBeTruthy();
        });
    });

    describe('countWhite', () => {
        it('should get white count', () => {
            expect(countWhite(basicGame1)).toEqual(3);
        });
    });

    describe('countBlack', () => {
        it('should get black count', () => {
            expect(countBlack(basicGame1)).toEqual(3);
        });
    });

    describe('getLegalMoves', () => {
        it('should get legal moves', () => {
            const legalMoves: LegalMove[] = [
                {
                    coordinates: { x: 2, y: 0 },
                    direction: 'S',
               },
                {
                    coordinates: { x: 3, y: 0 },
                    direction: 'S',
                },
           ];

            expect(getLegalMoves(basicGame2, WHITE)).toStrictEqual(legalMoves);
        });
    });
});
