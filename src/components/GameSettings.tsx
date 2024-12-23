import { MouseEvent } from 'react';
import {
    Box,
    Button,
    FormLabel,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';

import { Difficulty } from '../interfaces/game';

interface GameSettingsProps {
    difficulty: Difficulty;
    onDifficultyChange: (
        event: MouseEvent<HTMLElement>,
        difficulty: Difficulty,
    ) => void;
    onResetClick: () => void;
}

export function GameSettings(props: GameSettingsProps) {
    return (
        <Box>
            <Box>
                <Button
                    onClick={props.onResetClick}
                    variant={'text'}
                    sx={{ m: 1 }}
                    size={'medium'}
                >
                    Reset game
                </Button>
            </Box>
            <Box>
                <FormLabel>Difficulty:</FormLabel>
                <ToggleButtonGroup
                    value={props.difficulty}
                    exclusive
                    onChange={props.onDifficultyChange}
                    size={'small'}
                    color={'primary'}
                >
                    <ToggleButton value={Difficulty.EASY}>Easy</ToggleButton>
                    <ToggleButton value={Difficulty.MEDIUM}>
                        Medium
                    </ToggleButton>
                    <ToggleButton value={Difficulty.HARD}>Hard</ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    );
}
