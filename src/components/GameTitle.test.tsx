import { render } from '@testing-library/react';

import { WHITE } from '../interfaces/game';
import { GameTitle } from './GameTitle';

describe('<GameTitle/> component:', () => {
    it('should render correctly', () => {
        const { findByText } = render(
            <GameTitle
                whiteCount={2}
                blackCount={6}
                isGameOver={false}
                currentPlayer={WHITE}/>
        );
        expect(findByText('| Next turn: WHITE')).toBeTruthy();
    });
});
