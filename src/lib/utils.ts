import { Message } from "../types";

export const buildMessage = (text: string | undefined | null, sender: 'bot' | 'user'): Message => {
  // Verificação de segurança para texto
  const safeText = text || '';
  
  if (!text && text !== '') {
    console.warn('buildMessage received invalid text:', { text, sender });
  }
  
  return {
    timestamp: Date.now().toString(), // Usar toString() é mais seguro que toPrecision()
    sender,
    text: safeText,
  };
};
