import { useCallback, useReducer, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import InputArea from '@/components/InputArea';
import Message from '@/components/Message';
import { chatReducer, initialState } from '@/state';
import { buildMessage } from '@/lib/utils';
import { ACTION_TYPE, Message as MessageType } from '@/types';
import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import TypingIndicator from '@/components/TypingIndicator';


interface ChatPageProps {
  sessionId: string;
  hcaptchaSiteKey?: string; // opcional já que vem do getServerSideProps
}


const sendMessage = async (text: string, sessionId?: string): Promise<MessageType> => {
  try {
    const response = await fetch('api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, sessionId }),
    });

    if (!response.ok) {
      console.error('Chat API error response:', response.status, response.statusText);
      throw new Error(`Chat API respondeu com status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Chat API response data:', data);
    
    // Verificar se a resposta contém texto válido
    let responseText = '';
    if (data && typeof data === 'object') {
      responseText = data.text || data.message || data.response || '';
    } else if (typeof data === 'string') {
      responseText = data;
    }
    
    if (!responseText) {
      console.warn('API returned empty or invalid response:', data);
      responseText = 'Desculpe, recebi uma resposta vazia do servidor. Por favor, tente novamente.';
    }
    
    return buildMessage(responseText, 'bot');
  } catch (error) {
    console.error('Error in sendMessage:', error);
    const errorMessage = error instanceof Error 
      ? `Erro: ${error.message}` 
      : 'Erro desconhecido ao enviar mensagem';
    return buildMessage(errorMessage, 'bot');
  }
}

export default function ChatPage({ sessionId: initialSessionId }: ChatPageProps) {
  // Inicializar o estado com o sessionId recebido das props
  const [{ messages, sessionId, loading }, dispatch] = useReducer(
    chatReducer, 
    { ...initialState, sessionId: initialSessionId }
  );

  const handleSendMessage = useCallback(async (message: string) => {
    try {
      dispatch({ type: ACTION_TYPE.SET_LOADING, payload: true });
      dispatch({ type: ACTION_TYPE.SEND_MESSAGE, payload: buildMessage(message, 'user') });
      
      const response = await sendMessage(message, sessionId);
      dispatch({ type: ACTION_TYPE.RECEIVE_MESSAGE, payload: response });
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      // Enviar mensagem de erro para o usuário
      const errorMessage = buildMessage(
        'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        'bot'
      );
      dispatch({ type: ACTION_TYPE.RECEIVE_MESSAGE, payload: errorMessage });
    } finally {
      dispatch({ type: ACTION_TYPE.SET_LOADING, payload: false });
    }
  }, [sessionId]);

  // Referência para o contêiner de chat
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Função para rolar para o final do chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Efeito para rolar para o final quando as mensagens mudarem ou quando o loading mudar
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-white text-black p-6" style={{
    padding: '0px 10px 0px 10px', 
    ...(messages.length > 0 ? { 
      display: 'flex',
      paddingTop: '56px', 
      flexDirection: 'column',
      justifyContent: 'space-between' 
    } : {justifyContent: 'center', alignItems: 'center'})
  }}>
      {messages.length === 0 ? (
        <div className="welcome-section" id="welcomeSection">
          <div className="welcome-content">
            <Image src="/logo_pgmfi.svg" alt="PGM Foz do Iguaçu" width={250} height={200} />
            <div className="welcome-text">
              <h1 className="welcome-title">Sou o assistente Virtual de Suporte ao novo Sistema.</h1>
              <p className="welcome-subtitle">Como posso ajudar você hoje?</p>
            </div>
          </div>
        </div>
      ) : (          <div id="chat-container" ref={chatContainerRef} style={{ 
            maxHeight: 'calc(100vh - 200px)', 
            overflowY: 'auto',
            paddingBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {messages.length > 0 ?
              messages.map((msg) => (
                <motion.div
                  key={msg.timestamp}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  {msg.sender !== 'user' && (
                    <div className="avatar mr-3 flex-shrink-0">
                      <img src="/profile.png" alt="PGM Foz do Iguaçu" width={40} height={40} className="rounded-full" />
                    </div>
                  )}
                  <Message {...msg} />
                </motion.div>
              )) : ''
            }
            {loading && <TypingIndicator />}
          </div>
        )}
        <div className="input-section">
            <div className="input-container">
                <InputArea sendChatMessage={handleSendMessage} loading={loading} />
            </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<ChatPageProps> = async (context) => {
  const sessionId = context.req.cookies.sessionId;

  if (!sessionId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionId,
      hcaptchaSiteKey: process.env.HCAPTCHA_SITE_KEY,
    },
  };
};
