import React from "react";
import { ChatMessage } from "../../hooks/useNodeCommon";

interface ChatMessagesProps {
  messages?: ChatMessage[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => (
  <div className="p-2 overflow-y-auto" style={{ height: "calc(100% - 70px)" }}>
    {messages?.map((msg) => (
      <div key={msg.id} className="text-sm mb-1">
        {msg.text}
      </div>
    ))}
  </div>
);

export default ChatMessages;
