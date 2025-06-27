import { MinMaxWorkerData, MinMaxWorkerResult } from '@/interfaces/game';
import { minmax } from '@/helpers/game';

onmessage = (event: MessageEvent<MinMaxWorkerData>) => {
    const { board, depth, player, alpha, beta } = event.data;

    try {
        const score = minmax(board, depth, player, alpha, beta);
        const result: MinMaxWorkerResult = { score };
        postMessage(result);
    } catch (err) {
        const result: MinMaxWorkerResult = {
            error: (err as Error).message,
        };
        postMessage(result);
    }
};
