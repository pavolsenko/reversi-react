import { useCallback, useEffect, useState } from 'react';
import {
    applyMoveForPlayer,
    checkIsGameOver,
    countItemsOnBoard,
    findBestMoveForPlayer,
    getValidMovesForPlayer,
    getStartGame,
} from '../helpers/game';

import {
    BLACK,
    Difficulty,
    EMPTY,
    Board,
    Move,
    Player,
    WHITE,
} from '../interfaces/game';

interface UseGame {
    resetGame: () => void;
    isGameOver: boolean;
    onMove: (player: Player, x: number, y: number) => void;
    currentPlayer: Player;
    board: Board;
    whiteCount: number;
    blackCount: number;
    difficulty: Difficulty;
    setDifficulty: (difficulty: Difficulty) => void;
}

export function useGame(): UseGame {
    const [board, setBoard] = useState<Board>(getStartGame());
    const [currentPlayer, setCurrentPlayer] = useState<Player>(WHITE);
    const [whiteCount, setWhiteCount] = useState<number>(2);
    const [blackCount, setBlackCount] = useState<number>(2);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<number>(0);

    const onMove = useCallback(
        function (player: Player, x: number, y: number) {
            if (player !== currentPlayer) {
                return;
            }

            const field = board[x][y];
            if (field.type !== EMPTY) {
                return;
            }

            const legalMoves: Move[] = getValidMovesForPlayer(
                board,
                player,
            ).filter(function (item: Move) {
                return item.x === x && item.y === y;
            });

            if (legalMoves.length === 0) {
                return;
            }

            setBoard(() => {
                const newBoard = applyMoveForPlayer(board, player, { x, y });

                const newWhiteLegalMoves = getValidMovesForPlayer(
                    newBoard,
                    WHITE,
                );
                const newBlackLegalMoves = getValidMovesForPlayer(
                    newBoard,
                    BLACK,
                );

                if (player === WHITE && newBlackLegalMoves.length > 0) {
                    setCurrentPlayer(BLACK);
                }

                if (player === BLACK && newWhiteLegalMoves.length > 0) {
                    setCurrentPlayer(WHITE);
                }

                return newBoard;
            });
        },
        [board, currentPlayer],
    );

    useEffect(() => {
        if (currentPlayer === WHITE) {
            return;
        }

        const blackLegalMoves = getValidMovesForPlayer(board, BLACK);

        if (blackLegalMoves.length === 0) {
            setCurrentPlayer(WHITE);
            return;
        }

        const currentDifficulty = difficulty * 2 + 1;
        let blackMove = findBestMoveForPlayer(board, BLACK, currentDifficulty);
        if (!blackMove) {
            blackMove =
                blackLegalMoves[
                    Math.floor(Math.random() * blackLegalMoves.length)
                ];
        }

        setTimeout(function () {
            const newBoard = applyMoveForPlayer(board, BLACK, blackMove);
            setBoard(newBoard);
            setCurrentPlayer(WHITE);
        }, 1000);
    }, [board, currentPlayer, onMove, difficulty]);

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
    }

    return {
        resetGame,
        isGameOver,
        onMove,
        board,
        whiteCount,
        blackCount,
        currentPlayer,
        difficulty,
        setDifficulty,
    };
}
