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

// Lista de perguntas frequentes
const FAQ_ITEMS = [
  {
    id: 1,
    question: "Como faço login no sistema?",
    answer: "Como faço login no sistema?"
  },
  {
    id: 2,
    question: "Como alterar minha senha?",
    answer: "Como alterar minha senha?"
  },
  {
    id: 3,
    question: "Como acessar relatórios?",
    answer: "Como acessar relatórios?"
  },
  {
    id: 4,
    question: "Como cadastrar um novo usuário?",
    answer: "Como cadastrar um novo usuário?"
  },
  {
    id: 5,
    question: "Como recuperar dados perdidos?",
    answer: "Como recuperar dados perdidos?"
  },
  {
    id: 6,
    question: "Como configurar permissões?",
    answer: "Como configurar permissões?"
  },
  {
    id: 7,
    question: "Como fazer backup dos dados?",
    answer: "Como fazer backup dos dados?"
  },
  {
    id: 8,
    question: "Como integrar com outros sistemas?",
    answer: "Como integrar with outros sistemas?"
  }
];


const sendMessage = async (text: string, sessionId?: string): Promise<MessageType> => {
  try {
    const response = await fetch('/api/chat', {
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

  // Estado para controlar a visibilidade do menu FAQ
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isFaqContentExpanded, setIsFaqContentExpanded] = useState(true);

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

  // Função para lidar com clique em pergunta do FAQ
  const handleFaqClick = useCallback((question: string) => {
    handleSendMessage(question);
    setIsFaqOpen(false); // Fechar o menu em dispositivos móveis
  }, [handleSendMessage]);

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
      <div className="flex min-h-screen bg-white text-black relative">
        {/* Menu FAQ Lateral */}
        <div className={`fixed left-0 top-0 h-screen bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden z-40 ${
          isFaqOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:flex-shrink-0 flex flex-col ${
          isFaqContentExpanded ? 'lg:w-80 w-72' : 'lg:w-16 w-16'
        }`}>
          <div className={`border-b border-gray-200 flex-shrink-0 transition-all duration-300 ${
            isFaqContentExpanded ? 'p-4' : 'p-2 lg:p-2'
          }`}>
            <div className="flex items-center justify-between">
              {/* Título quando expandido */}
              <h2 className={`text-lg font-semibold text-gray-800 transition-opacity duration-300 ${
                isFaqContentExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-0'
              } ${!isFaqContentExpanded ? 'hidden lg:hidden' : ''}`}>Perguntas Frequentes</h2>
              
              {/* Ícone quando recolhido - centralizado */}
              <div className={`flex-1 flex justify-center transition-opacity duration-300 ${
                !isFaqContentExpanded ? 'opacity-100 lg:opacity-100' : 'opacity-0 lg:opacity-0'
              } ${isFaqContentExpanded ? 'hidden lg:hidden' : ''}`}>
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsFaqContentExpanded(!isFaqContentExpanded)}
                  className="p-1 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-gray-800 hidden lg:block"
                  title={isFaqContentExpanded ? 'Recolher menu' : 'Expandir menu'}
                >
                  <svg className="w-5 h-5 transform transition-transform duration-200" style={{
                    transform: isFaqContentExpanded ? 'rotate(0deg)' : 'rotate(180deg)'
                  }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsFaqOpen(false)}
                  className="lg:hidden p-1 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          <div className={`overflow-y-auto flex-1 pb-4 transition-all duration-300 ${
            isFaqContentExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-0'
          } ${!isFaqContentExpanded ? 'hidden lg:hidden' : ''}`}>
            {FAQ_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleFaqClick(item.question)}
                className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-100 transition-colors duration-200 group"
              >
                <div className="text-sm text-gray-700 group-hover:text-blue-600 leading-relaxed">
                  {item.question}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Overlay para dispositivos móveis */}
        {isFaqOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsFaqOpen(false)}
          />
        )}

        {/* Botão para abrir FAQ em dispositivos móveis */}
        <button
          onClick={() => setIsFaqOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Área principal do chat */}
        <div className="flex-1 flex flex-col min-h-screen max-w-4xl mx-auto" style={{
          padding: '20px 60px', 
          ...(messages.length > 0 ? { 
            display: 'flex',
            paddingTop: '56px', 
            flexDirection: 'column'
          } : {})
        }}>
          {messages.length === 0 ? (
            <div className="welcome-section flex-1" id="welcomeSection">
              <div className="welcome-content">
                <Image src="/logo_pgmfi.svg" alt="PGM Foz do Iguaçu" width={250} height={200} className="mb-6" />
                <div className="welcome-text">
                  <h1 className="welcome-title text-2xl font-bold text-gray-800 mb-4">Sou o assistente Virtual de Suporte ao novo Sistema.</h1>
                  <p className="welcome-subtitle text-lg text-gray-600">Como posso ajudar você hoje?</p>
                </div>
              </div>
            </div>
          ) : (
            <div id="chat-container" ref={chatContainerRef} className="flex-1 overflow-y-auto" style={{ 
              maxHeight: 'calc(100vh - 200px)', 
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
          <div className="input-section mt-auto pt-4">
              <div className="input-container">
                  <InputArea sendChatMessage={handleSendMessage} loading={loading} />
              </div>
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
