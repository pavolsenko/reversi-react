import { BLACK, WHITE, MinMaxWorkerData } from '../interfaces/game';
import { countItemsOnBoard } from './board';
import { applyMoveForPlayer, getValidMovesForPlayer, minmax } from './game';

onmessage = (event: MessageEvent<MinMaxWorkerData>) => {
    const { board, depth, player } = event.data;
    let alpha = event.data.alpha;
    let beta = event.data.beta;
    const opponent = player === BLACK ? WHITE : BLACK;
    const legalMoves = getValidMovesForPlayer(board, player);

    if (depth === 0 || legalMoves.length === 0) {
        postMessage(countItemsOnBoard(board, player));
        return;
    }

    let score = player === BLACK ? -Infinity : Infinity;

    for (const move of legalMoves) {
        const newBoard = applyMoveForPlayer(board, player, move);
        const evaluation = minmax(newBoard, depth - 1, opponent, alpha, beta);

        if (player === BLACK) {
            score = Math.max(score, evaluation);
            alpha = Math.max(alpha, score);
        } else {
            score = Math.min(score, evaluation);
            beta = Math.min(beta, score);
        }

        if (beta <= alpha) {
            break;
        }
    }

    postMessage(score);
};
