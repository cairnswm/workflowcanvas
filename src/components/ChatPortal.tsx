import { createPortal } from 'react-dom';
import ChatPanel from './ChatPanel';

interface ChatPortalProps {
  nodeId: string;
  messages: any[];
  onAddMessage: (message: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onClose: () => void;
  position?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
}

function ChatPortal(props: ChatPortalProps) {
  return createPortal(
    <ChatPanel {...props} />,
    document.body
  );
}

export default ChatPortal;