import {
    applyMoveForPlayer,
    getDifficultyDepth,
    getStartGame,
    getValidMovesForPlayer,
    isValidMove,
    negamax,
    orderMoves,
} from '@/helpers/game';
import { BLACK, WHITE, Move, Difficulty } from '@/interfaces/game';

describe('game.helper:', () => {
    describe('isValidMove', () => {
        it('should return false for occupied square', () => {
            const board = getStartGame();
            expect(isValidMove(board, { x: 3, y: 3 }, BLACK)).toBe(false);
        });

        it('should return true for valid opening move', () => {
            const board = getStartGame();
            expect(isValidMove(board, { x: 2, y: 3 }, WHITE)).toBe(true);
        });

        it('should return false for move not flipping anything', () => {
            const board = getStartGame();
            expect(isValidMove(board, { x: 0, y: 0 }, BLACK)).toBe(false);
        });
    });

    describe('getValidMovesForPlayer', () => {
        it('returns correct number of valid moves in starting position', () => {
            const board = getStartGame();
            const blackMoves = getValidMovesForPlayer(board, BLACK);
            const whiteMoves = getValidMovesForPlayer(board, WHITE);
            expect(blackMoves.length).toBe(4);
            expect(whiteMoves.length).toBe(4);
        });
    });

    describe('applyMoveForPlayer', () => {
        it('flips the opponent pieces in one direction', () => {
            const board = getStartGame();
            const newBoard = applyMoveForPlayer(board, BLACK, { x: 2, y: 3 });
            expect(newBoard[3][3]).toBe(BLACK);
        });

        it('does not mutate original board', () => {
            const board = getStartGame();
            const boardCopy = structuredClone(board);
            applyMoveForPlayer(board, BLACK, { x: 2, y: 3 });
            expect(board).toEqual(boardCopy);
        });
    });

    describe('orderMoves', () => {
        it('prioritizes corner moves over others', () => {
            const board = getStartGame();
            const moves: Move[] = [
                { x: 0, y: 0 },
                { x: 2, y: 3 },
            ];
            const [first] = orderMoves(moves, board, BLACK, Difficulty.MEDIUM);
            expect(first).toEqual({ x: 0, y: 0 });
        });
    });

    describe('minmax', () => {
        it('returns a numerical score', () => {
            const board = getStartGame();
            const score = negamax(board, 1, -Infinity, Infinity, BLACK);
            expect(typeof score).toBe('number');
        });

        it('returns higher score if player has more pieces', () => {
            const board = getStartGame();
            const strongerBoard = applyMoveForPlayer(board, BLACK, {
                x: 2,
                y: 3,
            });
            const originalScore = negamax(board, 1, -Infinity, Infinity, BLACK);
            const strongerScore = negamax(
                strongerBoard,
                1,
                -Infinity,
                Infinity,
                BLACK,
            );
            expect(strongerScore).toBeGreaterThanOrEqual(originalScore);
        });
    });

    describe('getDifficultyDepth', () => {
        it('returns correct depth for EASY early game', () => {
            expect(
                getDifficultyDepth(Difficulty.EASY, 5),
            ).toBeGreaterThanOrEqual(2);
        });

        it('returns correct depth for HARD late game', () => {
            expect(getDifficultyDepth(Difficulty.HARD, 50)).toBeGreaterThan(4);
        });
    });
});
