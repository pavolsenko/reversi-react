import { MouseEvent } from 'react';

import {
    Box,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    useTheme,
} from '@mui/material';

import { Difficulty } from '@/interfaces/game';

import { gameSettingsStyles } from './gameStyles.ts';

interface GameSettingsProps {
    difficulty: Difficulty;
    onDifficultyChange: (
        event: MouseEvent<HTMLElement>,
        difficulty: Difficulty,
    ) => void;
    onResetClick: () => void;
    isResetDisabled: boolean;
}

export function GameSettings(props: GameSettingsProps) {
    const theme = useTheme();

    return (
        <Box sx={gameSettingsStyles(theme)}>
            <Box>
                <Button
                    onClick={props.onResetClick}
                    variant={'outlined'}
                    size={'medium'}
                    disabled={props.isResetDisabled}
                >
                    Reset game
                </Button>
            </Box>
            <ToggleButtonGroup
                value={props.difficulty}
                exclusive
                onChange={props.onDifficultyChange}
                size={'small'}
                color={'primary'}
                disabled={props.isResetDisabled}
            >
                <ToggleButton value={Difficulty.EASY}>Easy</ToggleButton>
                <ToggleButton value={Difficulty.MEDIUM}>Medium</ToggleButton>
                <ToggleButton value={Difficulty.HARD}>Hard</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}
