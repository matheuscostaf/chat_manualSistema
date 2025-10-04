// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

// Create a custom HTTPS agent with proper SSL configuration
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Only for development - remove in production
  timeout: 120000, // 2 minutes timeout
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Chat API request received:', {
      method: req.method,
      hasSessionId: !!req.cookies.sessionId,
      hasBodySessionId: !!req.body?.sessionId,
      bodyText: req.body?.text?.substring(0, 50) + '...',
    });

    // Verificar método e parâmetros necessários
    if (req.method !== 'POST') {
      console.error('Invalid method:', req.method);
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const sessionId = req.cookies.sessionId || req.body.sessionId;
    if (!sessionId) {
      console.error('No session ID found');
      return res.status(400).json({ error: 'SessionId não encontrado' });
    }

    const { text } = req.body;
    if (!text) {
      console.error('No text provided in request');
      return res.status(400).json({ error: 'Texto da mensagem é obrigatório' });
    }

    const serverUrl = process.env.SERVER_URL;
    if (!serverUrl) {
      console.error('SERVER_URL environment variable not set');
      return res.status(500).json({ error: 'Configuração do servidor não encontrada' });
    }

    console.log('Sending request to external server...');
    
    // Use fetch with proper error handling and timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout

    try {
      const externalResponse = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ChatPGM/1.0',
        },
        body: JSON.stringify({
          text: text,
          session_id: sessionId
        }),
        signal: controller.signal,
        // Note: fetch doesn't support custom agents directly
        // For Node.js environments, we might need to use a different approach
      });

      clearTimeout(timeoutId);

      console.log('External server response:', {
        status: externalResponse.status,
        statusText: externalResponse.statusText,
        headers: Object.fromEntries(externalResponse.headers.entries()),
        contentLength: externalResponse.headers.get('content-length'),
      });

      if (!externalResponse.ok) {
        console.error('External server returned error:', externalResponse.status);
        return res.status(externalResponse.status).json({
          error: 'Erro do servidor externo',
          status: externalResponse.status,
          statusText: externalResponse.statusText,
        });
      }

      // Handle response based on content-type
      const contentType = externalResponse.headers.get('content-type') || '';
      const transferEncoding = externalResponse.headers.get('transfer-encoding');
      
      console.log('Response headers analysis:', {
        contentType,
        transferEncoding,
        hasChunkedEncoding: transferEncoding === 'chunked',
        contentEncoding: externalResponse.headers.get('content-encoding')
      });
      
      let responseBody;
      
      try {
        // Sempre tenta ler o texto da resposta primeiro
        const text = await externalResponse.text();
        console.log('Raw response text length:', text.length);
        console.log('Raw response text preview:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
        
        // Check if response is actually empty
        if (!text || text.trim() === '') {
          console.log('External server returned truly empty response');
          responseBody = {
            message: 'Resposta processada com sucesso, mas servidor retornou resposta vazia',
            status: 'success',
            timestamp: new Date().toISOString()
          };
        } else if (contentType.includes('application/json')) {
          try {
            responseBody = JSON.parse(text);
            console.log('Successfully parsed JSON response');
          } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            console.log('Failed to parse as JSON, treating as text');
            responseBody = {
              text: text,
              message: text,
              status: 'success',
              timestamp: new Date().toISOString()
            };
          }
        } else {
          // Handle non-JSON responses as text
          console.log('Non-JSON response, treating as text');
          responseBody = {
            text: text,
            message: text,
            status: 'success',
            timestamp: new Date().toISOString()
          };
        }
      } catch (readError) {
        console.error('Error reading response body:', readError);
        return res.status(500).json({
          error: 'Erro ao ler resposta do servidor',
          message: 'Não foi possível processar a resposta do servidor externo'
        });
      }

      console.log('Sending response to client:', {
        type: typeof responseBody,
        isString: typeof responseBody === 'string',
        isObject: typeof responseBody === 'object',
        hasText: responseBody && typeof responseBody === 'object' && ('text' in responseBody),
        hasMessage: responseBody && typeof responseBody === 'object' && ('message' in responseBody),
        responseKeys: typeof responseBody === 'object' ? Object.keys(responseBody) : [],
        preview: typeof responseBody === 'string' 
          ? responseBody.substring(0, 100) + (responseBody.length > 100 ? '...' : '')
          : JSON.stringify(responseBody).substring(0, 100) + (JSON.stringify(responseBody).length > 100 ? '...' : '')
      });

      // Garantir que sempre enviamos uma resposta válida
      if (typeof responseBody === 'string') {
        responseBody = {
          text: responseBody,
          message: responseBody,
          status: 'success',
          timestamp: new Date().toISOString()
        };
      }

      // Retornar resposta para o cliente
      return res.status(200).json(responseBody);

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Request timeout to external server');
        return res.status(504).json({
          error: 'Timeout na comunicação com o servidor',
          message: 'O servidor demorou mais de 2 minutos para responder. Tente novamente.'
        });
      }
      
      throw fetchError; // Re-throw to be caught by outer catch
    }

  } catch (error) {
    console.error('Chat API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });

    return res.status(500).json({
      error: 'Falha na comunicação com o servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString(),
    });
  }
}
