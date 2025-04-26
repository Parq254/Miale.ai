import React, { useState } from 'react';
import { submitQuery } from '@/lib/apiService';

const ChatInput: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);

    try {
      // Call the backend API to submit the query
      const data = await submitQuery(inputText, chatHistory);

      // Update the chat history
      setChatHistory((prev) => [
        ...prev,
        { user: inputText, assistant: data.output },
      ]);

      setInputText(''); // Clear the input field
    } catch (error) {
      console.error('Error submitting query:', error);
      setChatHistory((prev) => [
        ...prev,
        { user: inputText, assistant: 'Failed to get a response. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="chat-history mb-4 p-4 border rounded h-64 overflow-y-auto bg-gray-100">
        {chatHistory.map((entry, index) => (
          <div key={index} className="mb-4">
            <div className="text-blue-600 font-semibold">User:</div>
            <div className="bg-white p-2 rounded shadow mb-2">{entry.user}</div>
            <div className="text-green-600 font-semibold">Assistant:</div>
            <div className="bg-white p-2 rounded shadow">{entry.assistant}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your query..."
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
