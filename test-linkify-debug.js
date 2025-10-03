// Teste para debug da função autoLinkify

function autoLinkify(text) {
  let processedText = text;
  
  // Array para armazenar placeholders e evitar processamento duplo
  const placeholders = [];
  
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

// Teste com o exemplo específico
const testText = "O site da Secretaria de Finanças e Orçamento (Fazenda) é: https://efoz.pmfi.pr.gov.br/";
const result = autoLinkify(testText);

console.log("Input:", testText);
console.log("Output:", result);
console.log("Expected: O site da Secretaria de Finanças e Orçamento (Fazenda) é: [https://efoz.pmfi.pr.gov.br/](https://efoz.pmfi.pr.gov.br/)");
