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
                    coordinates: {
                        x: 1,
                        y: 0
                    },
                    direction: "SE"
                },
                {
                    coordinates: {
                        x: 2,
                        y: 0
                    },
                    direction: "SE"
                },
                {
                    coordinates: {
                        x: 2,
                        y: 0
                    },
                    direction: "S"
                },
                {
                    coordinates: {
                        x: 3,
                        y: 0
                    },
                    direction: "SE"
                },
                {
                    coordinates: {
                        x: 3,
                        y: 0
                    },
                    direction: "S"
                },
                {
                    coordinates: {
                        x: 4,
                        y: 0
                    },
                    direction: "SW"
                },
                {
                    coordinates: {
                        x: 5,
                        y: 0
                    },
                    direction: "SW"
                },
                {
                    coordinates: {
                        x: 1,
                        y: 1
                    },
                    direction: "E"
                },
                {
                    coordinates: {
                        x: 5,
                        y: 4
                    },
                    direction: "W"
                },
                {
                    coordinates: {
                        x: 5,
                        y: 4
                    },
                    direction: "NW"
                },
                {
                    coordinates: {
                        x: 2,
                        y: 5
                    },
                    direction: "NE"
                },
                {
                    coordinates: {
                        x: 3,
                        y: 5
                    },
                    direction: "N"
                },
                {
                    coordinates: {
                        x: 3,
                        y: 5
                    },
                    direction: "NE"
                },
                {
                    coordinates: {
                        x: 5,
                        y: 5
                    },
                    direction: "NW"
                }
            ];

            expect(getLegalMoves(basicGame2, WHITE)).toStrictEqual(legalMoves);
        });
    });
});
