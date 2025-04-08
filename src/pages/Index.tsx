
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import WelcomeHeader from '@/components/WelcomeHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import Logo from '@/components/Logo';
import LocationFeatures from '@/components/LocationFeatures';

type Message = {
  id: string;
  type: 'user' | 'system';
  content: string;
  imageUrl?: string;
  imageAnalysis?: string;
};

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showLocationFeatures, setShowLocationFeatures] = useState<boolean>(true); // Set to true by default
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Check for location or weather related queries
    const lowerContent = content.toLowerCase();
    if (
      lowerContent.includes('location') || 
      lowerContent.includes('weather') || 
      lowerContent.includes('uv') || 
      lowerContent.includes('technician') ||
      lowerContent.includes('davis') || 
      lowerContent.includes('shirtliff')
    ) {
      setShowLocationFeatures(true);
    }
    
    setTimeout(() => {
      const systemResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: getSimulatedResponse(content)
      };
      
      setMessages(prev => [...prev, systemResponse]);
    }, 1000);
  };
  
  const handleSendImage = (imageUrl: string, analysis: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: "I've shared an image",
      imageUrl,
      imageAnalysis: analysis
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    setTimeout(() => {
      const systemResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: "I've analyzed the image you shared. " + 
                 (analysis.includes("Extracted text") ? 
                 "I can see there's text in this image. Is there anything specific you'd like to know about it?" : 
                 "What would you like to know about this image?")
      };
      
      setMessages(prev => [...prev, systemResponse]);
    }, 1500);
  };

  const getSimulatedResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I help you today?";
    } else if (lowerMessage.includes("help")) {
      return "I'm here to help! You can communicate with me through text, voice, or by sharing images. What would you like assistance with?";
    } else if (lowerMessage.includes("image") || lowerMessage.includes("picture")) {
      return "You can upload images using the image button in the chat input. I can analyze them and extract any text they contain.";
    } else if (lowerMessage.includes("voice")) {
      return "You can use voice input by clicking the microphone button. I'll transcribe what you say in real-time!";
    } else if (lowerMessage.includes("location")) {
      setShowLocationFeatures(true);
      return "I've enabled location features for you. You can now track your location, view historical UV data, and find nearby Davis & Shirtliff technicians.";
    } else if (lowerMessage.includes("weather") || lowerMessage.includes("uv")) {
      setShowLocationFeatures(true);
      return "I've activated the weather history feature. You can now view historical UV data based on your location, which is useful for water purification system planning.";
    } else if (lowerMessage.includes("technician") || lowerMessage.includes("davis") || lowerMessage.includes("shirtliff")) {
      setShowLocationFeatures(true);
      return "I've enabled the technician finder feature. You can now find nearby Davis & Shirtliff technicians based on your current location.";
    } else {
      return "Thanks for your message. In a real implementation, I'd connect to an API to provide a meaningful response. Is there anything specific you'd like to know about using this interface?";
    }
  };

  const showEmptyState = messages.length === 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="container flex flex-col py-4">
        <Logo />
      </div>
      <div className="container flex flex-col md:flex-row py-2 gap-6 flex-grow">
        <div className="flex flex-col flex-grow md:max-w-[65%]">          
          <div className="flex-grow flex flex-col">
            {showEmptyState ? (
              <div className="flex-grow flex items-center justify-center">
                <WelcomeHeader />
              </div>
            ) : (
              <ScrollArea className="flex-grow relative pr-4" ref={scrollAreaRef}>
                <div className="py-4 space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
              </ScrollArea>
            )}
            
            <div className="mt-4">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                onSendImage={handleSendImage} 
              />
            </div>
          </div>
        </div>
        
        <div className="md:w-1/3 space-y-4">
          {showLocationFeatures ? (
            <LocationFeatures />
          ) : (
            <Card className="h-[70vh] md:h-auto">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Chat History</h2>
              </div>
              
              <ScrollArea className="h-[calc(100%-53px)]">
                <div className="p-4">
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div key={index} className="py-2 border-b last:border-0">
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-2 ${message.type === 'user' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                          <div>
                            <p className="text-sm font-medium">
                              {message.type === 'user' ? 'You' : 'Assistant'}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {message.content || (message.imageUrl ? 'Shared an image' : '')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No messages yet</p>
                      <p className="text-xs mt-1">Start a conversation to see your history</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
