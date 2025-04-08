
import React from 'react';
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: {
    id: string;
    type: 'user' | 'system';
    content: string;
    imageUrl?: string;
    imageAnalysis?: string;
  };
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-xl p-4",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {message.content && (
          <p className="text-sm md:text-base whitespace-pre-wrap break-words">{message.content}</p>
        )}
        
        {message.imageUrl && (
          <div className="mt-2">
            <img 
              src={message.imageUrl} 
              alt="User uploaded image" 
              className="max-h-60 rounded-md object-contain"
            />
            {message.imageAnalysis && (
              <div className="mt-2 p-2 bg-background/50 rounded text-xs md:text-sm italic">
                <p>{message.imageAnalysis}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
