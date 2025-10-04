import React, { useState, useEffect } from 'react';

interface TypingIndicatorProps {
  showDelayMessage?: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ showDelayMessage = true }) => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    if (!showDelayMessage) return;

    // Mostrar mensagem de demora após 15 segundos
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [showDelayMessage]);

  return (
    <div className="message" id="isTyping">
      <div className="avatar">
        <img src="/profile.png" alt="PGM Foz do Iguaçu" width={60} height={60} />
      </div>
      <div className="message-content">
        {showSlowMessage ? (
          <div className="text-sm text-gray-600 mb-2">
            Processando sua solicitação... Respostas complexas podem demorar até 2 minutos.
          </div>
        ) : null}
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;