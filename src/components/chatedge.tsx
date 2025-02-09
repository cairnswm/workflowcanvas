import React from 'react';
import { BaseEdge, EdgeProps, getStraightPath } from 'reactflow';

const ChatEdge = ({ sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY
  });

  return (
    <BaseEdge
      path={edgePath}
      style={{
        strokeWidth: 2,
        stroke: '#555'
      }}
    />
  );
};

export default ChatEdge;
