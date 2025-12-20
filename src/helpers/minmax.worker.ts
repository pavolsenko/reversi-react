import { MinMaxWorkerData, MinMaxWorkerResult } from '@/interfaces/game';
import { negamax } from '@/helpers/game';

onmessage = (event: MessageEvent<MinMaxWorkerData>) => {
    const { board, depth, player, alpha, beta } = event.data;

    try {
        const score = negamax(board, depth, alpha, beta, player);
        const result: MinMaxWorkerResult = { score };
        postMessage(result);
    } catch (err) {
        const result: MinMaxWorkerResult = {
            error: (err as Error).message,
        };
        postMessage(result);
    }
};
