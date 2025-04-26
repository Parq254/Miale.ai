import axios from 'axios';

const BASE_URL = 'https://vast-forest-72814-53f29bba2a82.herokuapp.com/api/solar/agent/'; // Replace with your backend URL

// POST: Submit a user query
export const submitQuery = async (query: string, chatHistory: any[] = [], sessionId?: string) => {
  const headers = sessionId ? { 'Session-ID': sessionId } : {};
  const response = await axios.post(
    BASE_URL,
    { query, chat_history: chatHistory },
    { headers }
  );
  return response.data;
};

// GET: Retrieve the current design state
export const getDesignState = async (sessionId: string) => {
  const response = await axios.get(BASE_URL, {
    headers: { 'Session-ID': sessionId },
  });
  return response.data;
};

// DELETE: Clear the session's agent state
export const clearSessionState = async (sessionId: string, resetOnly = false) => {
  const response = await axios.delete(BASE_URL, {
    headers: { 'Session-ID': sessionId },
    params: { reset_only: resetOnly },
  });
  return response.data;
};

// OPTIONS: Generate a new session ID
export const generateSessionId = async () => {
  const response = await axios.options(BASE_URL);
  return response.data;
};