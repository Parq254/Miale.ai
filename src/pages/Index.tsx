import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import WelcomeHeader from '@/components/WelcomeHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import Logo from '@/components/Logo';
import LocationFeatures from '@/components/LocationFeatures';
import AuthSection from '../components/AuthSection';
import MapComponent from '../components/MapComponent';
import axios from 'axios';

const Index: React.FC = () => {
  const [messages, setMessages] = useState<{ id: number; type: 'user' | 'ai'; content: string }[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [latitude, setLatitude] = useState<number>(-1.286389); // Default latitude (Nairobi)
  const [longitude, setLongitude] = useState<number>(36.817223); // Default longitude (Nairobi)
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to the bottom of the chat area when messages change
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleLocationUpdate = (lat: number, lng: number) => {
    console.log("Location Updated:", { lat, lng });
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSendMessage = async (content: string) => {
    // user's message
    setMessages((prev) => [...prev, { id: Date.now(), type: 'user', content }]);

    try {
      // Call the Miale agent API
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [{ role: 'user', content }],
      }, {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Replace with your OpenAI API key
          'Content-Type': 'application/json',
        },
      });

      // Add Miale's response to the chat
      const aiMessage = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { id: Date.now(), type: 'ai', content: aiMessage }]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages((prev) => [...prev, { id: Date.now(), type: 'ai', content: 'Sorry, something went wrong. Please try again.' }]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="container flex flex-col py-4">
        <Logo />
      </div>
      {/* <div className="container flex flex-col py-4">
        <h1 className="text-3xl font-bold mb-6">Welcome to Miale AI</h1>
      </div> */}

      {/* Chat Section */}
      <div className="container mb-6">
        {!isAuthenticated ? (
          <AuthSection
            onLogin={() => setIsAuthenticated(true)}
            onRegister={() => setIsAuthenticated(true)}
          />
        ) : (
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-4">Start a Conversation</h2>
            <div className="flex-grow flex flex-col">
              {messages.length === 0 ? (
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
                  onSendImage={(imageUrl, analysis) => {
                    setMessages((prev) => [
                      ...prev,
                      { id: Date.now(), type: 'user', content: 'Shared an image', imageUrl, imageAnalysis: analysis },
                    ]);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location Features Section */}
      <div className="container flex flex-col md:flex-row py-2 gap-6 flex-grow">
        <div className="md:w-2/3 space-y-4">
          <LocationFeatures onLocationUpdate={handleLocationUpdate} />
        </div>

        {/* Map Section */}
        <div className="md:w-1/3 space-y-4">
          <MapComponent latitude={latitude} longitude={longitude} />
        </div>
      </div>
    </div>
  );
};

export default Index;

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-o9N1j8REr2z3k2JL8u9F2zW2D1p2U6p6s2e5x6z8+9k="
  crossorigin=""
/>
