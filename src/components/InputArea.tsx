import { useCallback, useState } from "react";
import { ArrowUp, RefreshCcw } from "lucide-react";

interface InputAreaProps {
  sendChatMessage: (message: string) => Promise<void>;
  loading?: boolean;
}

export default function InputArea({
  sendChatMessage,
  loading = false,
}: InputAreaProps) {
  const [input, setInput] = useState('');

  const handleSendChatMessage = useCallback((e: any) => {
    e.preventDefault();
    if (canSubmit) {
      return;
    }

    sendChatMessage(input);
    setInput('');
  }, [input, sendChatMessage]);

  const canSubmit = loading || input.trim().length === 0;

  return (
    <form onSubmit={handleSendChatMessage}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="chat-input"
        placeholder="Digite sua mensagem..."
        multiple
        autoComplete="off"
      />
        <button type="submit" disabled={canSubmit} className="send-button" id="send-button">
            <svg width="16" height="16" viewBox="0 0 14 16" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7 16c-.595 0-1.077-.462-1.077-1.032V1.032C5.923.462 6.405 0 7 0s1.077.462 1.077 1.032v13.936C8.077 15.538 7.595 16 7 16z" fill="currentColor"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M.315 7.44a1.002 1.002 0 0 1 0-1.46L6.238.302a1.11 1.11 0 0 1 1.523 0c.421.403.421 1.057 0 1.46L1.838 7.44a1.11 1.11 0 0 1-1.523 0z" fill="currentColor"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.685 7.44a1.11 1.11 0 0 1-1.523 0L6.238 1.762a1.002 1.002 0 0 1 0-1.46 1.11 1.11 0 0 1 1.523 0l5.924 5.678c.42.403.42 1.056 0 1.46z" fill="currentColor"/>
            </svg>
        </button>
    </form>
  );
}
