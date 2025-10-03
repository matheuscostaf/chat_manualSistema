import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="message" id="isTyping">
      <div className="avatar">
        <img src="/profile.png" alt="PGM Foz do Iguaçu" width={60} height={60} />
      </div>
      <div className="typing">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;