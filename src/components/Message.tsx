import { Message as MessageType } from "../types";
import ReactMarkdown from 'react-markdown';

interface MessageProps extends MessageType {}

// Função para detectar e converter links automáticos
function autoLinkify(text: string): string {
  // Verificação de segurança: retorna string vazia se text for undefined, null ou não for string
  if (!text || typeof text !== 'string') {
    console.warn('autoLinkify received invalid text:', text);
    return '';
  }
  
  let processedText = text;
  
  // Array para armazenar placeholders e evitar processamento duplo
  const placeholders: Array<{id: string, content: string}> = [];
  
  // 1. Primeiro salva emails como placeholders
  const emailRegex = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g;
  processedText = processedText.replace(emailRegex, (match) => {
    const id = `__EMAIL_${placeholders.length}__`;
    placeholders.push({
      id,
      content: `[${match}](mailto:${match})`
    });
    return id;
  });
  
  // 2. Salva telefones como placeholders
  const phoneRegex = /\((\d{2})\)\s*(\d{4,5})-(\d{4})/g;
  processedText = processedText.replace(phoneRegex, (match, area, number, suffix) => {
    const cleanPhone = `${area}${number}${suffix}`;
    const whatsappNumber = `55${cleanPhone}`;
    const id = `__PHONE_${placeholders.length}__`;
    placeholders.push({
      id,
      content: `[${match}](https://wa.me/${whatsappNumber})`
    });
    return id;
  });
  
  // 3. Converte URLs com protocolo como placeholders para evitar reprocessamento
  const urlWithProtocolRegex = /(https?:\/\/[^\s\)]+)/g;
  processedText = processedText.replace(urlWithProtocolRegex, (match) => {
    // Remove pontuação final comum se existir
    let cleanMatch = match;
    let punctuation = '';
    
    // Verifica se termina com pontuação que deve ficar fora do link
    const punctuationMatch = match.match(/^(.*?)([\.,:;!?]+)$/);
    if (punctuationMatch) {
      cleanMatch = punctuationMatch[1];
      punctuation = punctuationMatch[2];
    }
    
    const id = `__URL_${placeholders.length}__`;
    placeholders.push({
      id,
      content: `[${cleanMatch}](${cleanMatch})${punctuation}`
    });
    return id;
  });
  
  // 4. Converte URLs sem protocolo (domínios), mas evita emails e placeholders
  const domainRegex = /\b([a-zA-Z0-9-]+\.(?:com|org|net|gov|edu|br|pr\.gov\.br|gov\.br)+(?:\.[a-zA-Z]{2,})?)\b/g;
  processedText = processedText.replace(domainRegex, (match) => {
    // Não processa se contém @ (email) ou é um placeholder
    if (match.includes('@') || match.includes('__')) {
      return match;
    }
    
    // Remove pontuação final se existir
    let cleanMatch = match;
    const lastChar = match.slice(-1);
    if (/[\.,:;!?]/.test(lastChar)) {
      cleanMatch = match.slice(0, -1);
      return `[${cleanMatch}](https://${cleanMatch})${lastChar}`;
    }
    
    return `[${cleanMatch}](https://${cleanMatch})`;
  });
  
  // 5. Restaura os placeholders
  placeholders.forEach(placeholder => {
    processedText = processedText.replace(placeholder.id, placeholder.content);
  });
  
  return processedText;
}

export default function Message({ sender, text }: MessageProps) {
  // Verificação de segurança para texto
  const safeText = text || '';
  
  if (!safeText && text !== '') {
    console.warn('Message component received invalid text:', { sender, text });
  }
  
  const classes = ['p-3', 'rounded-lg', 'mb-2', 'max-w-[80%]', 'break-words'];
  
  if (sender === 'bot') {
    classes.push('bg-blue-50', 'self-start', 'border', 'border-blue-100');
  } else {
    classes.push('bg-gray-100', 'self-end');
  }

  // Processa o texto para auto-detectar links, usando o texto seguro
  const processedText = autoLinkify(safeText);

  return (
    <div className={classes.join(' ')}>
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200"
            />
          ),
          p: ({ node, ...props }) => (
            <p {...props} className="mb-2 last:mb-0 leading-relaxed" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-semibold text-gray-900" />
          ),
          em: ({ node, ...props }) => (
            <em {...props} className="italic" />
          ),
          code: ({ node, ...props }) => (
            <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800" />
          ),
          pre: ({ node, ...props }) => (
            <pre {...props} className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-sm font-mono my-2" />
          ),
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc list-inside mb-2 space-y-1" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal list-inside mb-2 space-y-1" />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="ml-2" />
          ),
        }}
      >
        {processedText}
      </ReactMarkdown>
    </div>
  );
}
