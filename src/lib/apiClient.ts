import axios from 'axios';
import * as https from 'https';

const serverUrl = process.env.SERVER_URL;

if (!serverUrl) {
  throw new Error('SERVER_URL is not set');
}


export const sendMessageApi = async (
  text: string,
  sessionId: string,
) => {
  const response = await fetch(serverUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, sessionId }),
  });
  
  // Verifique se a resposta foi bem-sucedida
  if (!response.ok) {
    throw new Error(`API respondeu com status: ${response.status}`);
  }
  
  return response; // Retorna o objeto Response para ser processado no handler
};