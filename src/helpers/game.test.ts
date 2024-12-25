import {
    applyMoveForPlayer,
    checkIsGameOver,
    countItemsOnBoard,
    findBestMoveForPlayer,
    getStartGame,
    getValidMovesForPlayer,
    isValidMove,
} from './game';

import { BLACK, Board, EMPTY, Move, WHITE } from '../interfaces/game';

import {
    basicGame1,
    basicGame2,
    basicGame3,
    basicGame4,
    endGame,
} from './__mocks__/boards';

describe('game helper:', () => {
    describe('getStartGame', () => {
        it('should return the correct start game', () => {
            const startGame = getStartGame();
            expect(startGame[4][4].type).toBe(WHITE);
            expect(startGame[1][1].type).toBe(EMPTY);
            expect(countItemsOnBoard(startGame, WHITE)).toBe(2);
            expect(countItemsOnBoard(startGame, BLACK)).toBe(2);
        });
    });

    describe('checkIsGameOver', () => {
        it('should return false if game is not over', () => {
            expect(checkIsGameOver(getStartGame())).toBeFalsy();
            expect(checkIsGameOver(basicGame3)).toBeFalsy();
        });

        it('should return true if game is over', () => {
            expect(checkIsGameOver(endGame)).toBeTruthy();
        });
    });

    describe('countItemsOnBoard', () => {
        it('should get white count on board', () => {
            expect(countItemsOnBoard(basicGame1, WHITE)).toEqual(3);
        });

        it('should get black count on board', () => {
            expect(countItemsOnBoard(basicGame1, BLACK)).toEqual(3);
        });
    });

    describe('isValidMove', () => {
        it('should return true if move is valid for player', () => {
            expect(
                isValidMove(getStartGame(), { x: 5, y: 3 }, WHITE),
            ).toBeTruthy();
        });

        it('should return false if move is not valid for player', () => {
            expect(
                isValidMove(getStartGame(), { x: 0, y: 0 }, WHITE),
            ).toBeFalsy();
            expect(
                isValidMove(getStartGame(), { x: 3, y: 3 }, BLACK),
            ).toBeFalsy();
            expect(
                isValidMove(getStartGame(), { x: 4, y: 3 }, BLACK),
            ).toBeFalsy();
        });
    });

    describe('getValidMoves', () => {
        it('should return all valid moves for player', () => {
            const validMoves: Move[] = [
                {
                    x: 4,
                    y: 2,
                },
                {
                    x: 5,
                    y: 3,
                },
                {
                    x: 2,
                    y: 4,
                },
                {
                    x: 3,
                    y: 5,
                },
            ];
            expect(getValidMovesForPlayer(getStartGame(), WHITE)).toEqual(
                validMoves,
            );

            expect(getValidMovesForPlayer(endGame, BLACK)).toEqual([]);
        });
    });

    describe('applyMoveForPlayer', () => {
        it('should return the correct board after player moves', () => {
            const newBoard: Board = applyMoveForPlayer(basicGame3, BLACK, {
                x: 7,
                y: 7,
            });
            expect(newBoard).toEqual(basicGame4);
            expect(countItemsOnBoard(newBoard, WHITE)).toEqual(60);
            expect(countItemsOnBoard(newBoard, BLACK)).toEqual(4);
            expect(checkIsGameOver(newBoard)).toBeTruthy();
        });
    });

    describe('findBestMoveForPlayer', () => {
        it('should return the best move for player', () => {
            expect(findBestMoveForPlayer(basicGame2, BLACK, 4)).toEqual({
                x: 6,
                y: 0,
            });
            expect(findBestMoveForPlayer(basicGame1, WHITE, 6)).toEqual({
                x: 3,
                y: 2,
            });
        });
    });
});
