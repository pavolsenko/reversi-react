import {
    checkIsGameOver,
    countItemsOnBoard,
    getLegalMoves,
    getStartGame,
} from './game';

import { BLACK, EMPTY, Move, WHITE } from '../interfaces/game';

import {
    basicGame1,
    basicGame2,
    basicGame3,
    endGame,
} from './__mocks__/boards';

describe('game helper:', () => {
    describe('getStartGame', () => {
        const startGame = getStartGame();
        expect(startGame[4][4].type).toBe(WHITE);
        expect(startGame[1][1].type).toBe(EMPTY);
    });

    describe('checkIfGameOver', () => {
        it('should return false', () => {
            expect(checkIsGameOver(getStartGame())).toBeFalsy();
        });

        it('should return false', () => {
            expect(checkIsGameOver(basicGame3)).toBeFalsy();
        });

        it('should return true', () => {
            expect(checkIsGameOver(endGame)).toBeTruthy();
        });
    });

    describe('countItemsOnBoard', () => {
        it('should get white count', () => {
            expect(countItemsOnBoard(basicGame1, WHITE)).toEqual(3);
        });

        it('should get black count', () => {
            expect(countItemsOnBoard(basicGame1, BLACK)).toEqual(3);
        });
    });

    describe('getLegalMoves', () => {
        it('should get legal moves', () => {
            const legalMoves: Move[] = [
                {
                    x: 1,
                    y: 0,
                },
                {
                    x: 2,
                    y: 0,
                },
                {
                    x: 2,
                    y: 0,
                },
                {
                    x: 3,
                    y: 0,
                },
                {
                    x: 3,
                    y: 0,
                },
                {
                    x: 4,
                    y: 0,
                },
                {
                    x: 5,
                    y: 0,
                },
                {
                    x: 1,
                    y: 1,
                },
                {
                    x: 5,
                    y: 4,
                },
                {
                    x: 5,
                    y: 4,
                },
                {
                    x: 2,
                    y: 5,
                },
                {
                    x: 3,
                    y: 5,
                },
                {
                    x: 3,
                    y: 5,
                },
                {
                    x: 5,
                    y: 5,
                },
            ];

            expect(getLegalMoves(basicGame2, WHITE)).toStrictEqual(legalMoves);
        });
    });
});
