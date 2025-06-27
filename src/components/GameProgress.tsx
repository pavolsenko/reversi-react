import { LinearProgress } from '@mui/material';

import { gameProgressStyles } from '@/components/gameStyles';

interface GameProgressProps {
    inProgress: boolean;
}

export function GameProgress(props: Readonly<GameProgressProps>) {
    if (!props.inProgress) {
        return null;
    }

    return (
        <LinearProgress
            variant="indeterminate"
            sx={gameProgressStyles}
        />
    );
}
