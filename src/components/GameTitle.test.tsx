import { render, screen } from '@testing-library/react';

import { WHITE } from '@/interfaces/game';
import { GameTitle } from '@/components/GameTitle';

describe('<GameTitle/> component:', () => {
    it('should render correctly', () => {
        render(
            <GameTitle
                whiteCount={2}
                blackCount={6}
                isGameOver={false}
                currentPlayer={WHITE}
            />,
        );
        expect(screen.findByText('| Next turn: WHITE')).toBeTruthy();
    });
});
