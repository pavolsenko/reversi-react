import { useCallback, useEffect, useState } from 'react';

import {
    applyMoveForPlayer,
    getValidMovesForPlayer,
    getDifficultyDepth,
    findBestMoveForPlayer,
    getStartGame,
    countItemsOnBoard,
    checkIsGameOver,
} from '@/helpers/game';
import {
    BLACK,
    Difficulty,
    EMPTY,
    Board,
    Player,
    WHITE,
} from '@/interfaces/game';

interface UseGame {
    resetGame: () => void;
    isGameOver: boolean;
    onWhiteMove: (x: number, y: number) => void;
    currentPlayer: Player;
    board: Board;
    whiteCount: number;
    blackCount: number;
    difficulty: Difficulty;
    setDifficulty: (difficulty: Difficulty) => void;
    isMoveInProgress: boolean;
}

export function useGame(): UseGame {
    const [board, setBoard] = useState<Board>(getStartGame());
    const [currentPlayer, setCurrentPlayer] = useState<Player>(WHITE);
    const [whiteCount, setWhiteCount] = useState<number>(2);
    const [blackCount, setBlackCount] = useState<number>(2);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
    const [isMoveInProgress, setIsMoveInProgress] = useState<boolean>(false);

    const onWhiteMove = useCallback(
        (x: number, y: number) => {
            if (currentPlayer !== WHITE || isMoveInProgress) {
                return;
            }
            if (board[x][y] !== EMPTY) {
                return;
            }

            const validMoves = getValidMovesForPlayer(board, WHITE).filter(
                (move) => move.x === x && move.y === y,
            );

            if (validMoves.length === 0) {
                return;
            }

            const newBoard = applyMoveForPlayer(board, WHITE, { x, y });
            const newBlackValidMoves = getValidMovesForPlayer(newBoard, BLACK);

            setBoard(newBoard);

            if (newBlackValidMoves.length > 0) {
                setIsMoveInProgress(true);
                setCurrentPlayer(BLACK);
            }
        },
        [board, currentPlayer, isMoveInProgress],
    );

    useEffect(() => {
        if (currentPlayer !== BLACK) {
            return;
        }

        const blackValidMoves = getValidMovesForPlayer(board, BLACK);

        if (blackValidMoves.length === 0) {
            setCurrentPlayer(WHITE);
            setIsMoveInProgress(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const numberOfMoves =
                countItemsOnBoard(board, WHITE) +
                countItemsOnBoard(board, BLACK);

            let blackMove = await findBestMoveForPlayer(
                board,
                BLACK,
                getDifficultyDepth(difficulty, numberOfMoves),
                difficulty,
            );

            if (!blackMove) {
                blackMove =
                    blackValidMoves[
                        Math.floor(Math.random() * blackValidMoves.length)
                    ];
            }

            setBoard((prevBoard) => {
                const newBoard = applyMoveForPlayer(
                    prevBoard,
                    BLACK,
                    blackMove!,
                );
                setCurrentPlayer(WHITE);
                setIsMoveInProgress(false);
                return newBoard;
            });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [board, currentPlayer, difficulty]);

    useEffect(() => {
        setWhiteCount(countItemsOnBoard(board, WHITE));
        setBlackCount(countItemsOnBoard(board, BLACK));
        setIsGameOver(checkIsGameOver(board));
    }, [board]);

    function resetGame() {
        setIsGameOver(false);
        setBoard(getStartGame());
        setCurrentPlayer(WHITE);
        setWhiteCount(2);
        setBlackCount(2);
        setIsMoveInProgress(false);
    }

    return {
        resetGame,
        isGameOver,
        onWhiteMove,
        board,
        whiteCount,
        blackCount,
        currentPlayer,
        difficulty,
        setDifficulty,
        isMoveInProgress,
    };
}
