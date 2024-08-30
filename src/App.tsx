import { Box } from '@mui/material';

import { Game } from './components/Game.tsx';

import { appStyles } from './styles.ts';

function App() {
    return (
        <Box sx={appStyles}>
            <Game/>
        </Box>
    );
}

export default App;
