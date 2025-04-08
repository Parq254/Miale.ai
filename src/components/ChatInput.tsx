
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ImageRecognition from './ImageRecognition';
import voiceRecognitionService from '@/utils/voiceRecognition';

type ChatInputProps = {
  onSendMessage: (text: string) => void;
  onSendImage: (imageUrl: string, analysis: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onSendImage }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const toggleVoiceRecognition = () => {
    if (isRecording) {
      voiceRecognitionService.stop();
      setIsRecording(false);
      setInterimTranscript('');
    } else {
      const success = voiceRecognitionService.start({
        onResult: (transcript, isFinal) => {
          if (isFinal) {
            setInputText(prev => `${prev}${transcript} `);
            setInterimTranscript('');
          } else {
            setInterimTranscript(transcript);
          }
        },
        onError: (error) => {
          toast({
            title: "Speech Recognition Error",
            description: error,
            variant: "destructive",
          });
          setIsRecording(false);
        }
      });
      
      if (success) {
        setIsRecording(true);
        toast({
          title: "Listening...",
          description: "Start speaking now",
        });
      }
    }
  };

  const handleImageProcessed = (imageUrl: string, analysis: string) => {
    onSendImage(imageUrl, analysis);
  };

  const handleImageError = (error: string) => {
    toast({
      title: "Image Processing Error",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="pr-24 min-h-[60px] max-h-[200px] resize-none overflow-y-auto"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        {interimTranscript && (
          <div className="absolute inset-x-0 -top-8 bg-muted/40 p-1.5 rounded text-sm text-muted-foreground animate-pulse-subtle">
            {interimTranscript}...
          </div>
        )}
        
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <ImageRecognition 
            onImageProcessed={handleImageProcessed}
            onError={handleImageError}
          />
          
          <Button
            type="button"
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            onClick={toggleVoiceRecognition}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={isRecording ? "animate-pulse" : ""}
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </Button>
          
          <Button type="submit" size="icon" disabled={!inputText.trim()}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
