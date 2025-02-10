import { ReactNode } from 'react';
import './tooltip.css';

interface TooltipProps {
  children: ReactNode;
}

const Tooltip = ({ children }: TooltipProps) => {
  return (
    <div className="tooltip-container">
      <div className="tooltip-arrow" />
      <div className="tooltip-content">{children}</div>
    </div>
  );
};

export default Tooltip;
