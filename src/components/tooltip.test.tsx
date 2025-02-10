import { render, screen } from '@testing-library/react';
import Tooltip from './tooltip';

describe('Tooltip', () => {
  it('renders children content', () => {
    const testContent = 'Test Content';
    render(<Tooltip>{testContent}</Tooltip>);
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('renders with correct styling', () => {
    render(<Tooltip>Content</Tooltip>);
    const tooltip = screen.getByText('Content').parentElement?.parentElement;
    expect(tooltip).toHaveStyle({
      position: 'absolute',
      backgroundColor: '#fff',
      minWidth: '200px'
    });
  });
});
