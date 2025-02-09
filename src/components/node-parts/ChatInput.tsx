import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [inputText, setInputText] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-4">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border-t px-2 py-1 text-sm outline-none"
        placeholder="Type a message and press Enter"
      />
    </div>
  );
};

export default ChatInput;
