// pages/api/test-connection-advanced.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Desativar verificação de certificado SSL para testes
  // ATENÇÃO: Use apenas em ambiente de desenvolvimento!
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  const targetUrl = 'https://n8n-h1.pmfi.pr.gov.br/webhook-test/93fca1b0-9224-43fa-b08a-07f481c9d040';
  
  // Parâmetros estáticos para teste
  const testPayload = {
    session_id: "jfg4pk",
    text: "Isso é um teste de conexão"
  };
  
  console.log(`[TEST] Iniciando teste de conexão para: ${targetUrl}`);
  console.log(`[TEST] Payload: ${JSON.stringify(testPayload)}`);
  
  try {
    // Criar agente HTTPS personalizado que ignora erros de certificado
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true,
    });
    
    // Configurar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos
    
    // Fazer a requisição POST com o agente personalizado
    const startTime = Date.now();
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload),
      signal: controller.signal,
      // @ts-ignore - O tipo do fetch não inclui agent, mas funciona
      agent: httpsAgent
    });
    const endTime = Date.now();
    
    // Limpar o timeout
    clearTimeout(timeoutId);
    
    // Tentar obter o corpo da resposta
    let responseBody;
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        responseBody = await response.json();
      } else {
        const text = await response.text();
        responseBody = text.substring(0, 500) + (text.length > 500 ? '...(truncado)' : '');
      }
    } catch (err) {
      responseBody = `[Erro ao ler corpo: ${err}]`;
    }
    
    // Retornar resultado detalhado
    return res.status(200).json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseTime: `${endTime - startTime}ms`,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody,
      url: targetUrl
    });
    
  } catch (error) {
    console.error('[TEST] Erro na conexão:', error);
    
    // Restaurar configuração de SSL
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    
    // Retornar detalhes do erro
    return res.status(500).json({error});
  } finally {
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  }
}
