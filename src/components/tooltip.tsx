import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
}

const Tooltip = ({ children }: TooltipProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fff',
        padding: '12px',
        borderRadius: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '200px',
        border: '1px solid #ddd',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '12px',
          height: '12px',
          backgroundColor: '#fff',
          borderLeft: '1px solid #ddd',
          borderTop: '1px solid #ddd',
          zIndex: -1
        }}
      />
      <div>{children}</div>
    </div>
  );
};

export default Tooltip;
