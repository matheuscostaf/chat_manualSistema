import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const serverUrl = process.env.SERVER_URL;
  
  if (!serverUrl) {
    return res.status(500).json({ error: 'SERVER_URL not configured' });
  }

  try {
    console.log('Testing external server connectivity...');
    console.log('Server URL:', serverUrl);
    console.log('Test payload:', { text: 'test', session_id: 'test-session' });

    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ChatPGM-Test/1.0',
      },
      body: JSON.stringify({
        text: 'test message',
        session_id: 'test-session-' + Date.now()
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    
    let responseData;
    const rawText = await response.text();
    
    console.log('Raw response text:', rawText);
    console.log('Response text length:', rawText.length);
    
    if (rawText.trim() === '') {
      responseData = { empty: true, message: 'Server returned empty response' };
    } else {
      try {
        responseData = JSON.parse(rawText);
      } catch (e) {
        responseData = { 
          raw: rawText, 
          error: 'Failed to parse as JSON',
          parseError: e instanceof Error ? e.message : 'Unknown error'
        };
      }
    }

    return res.status(200).json({
      test: 'External server connectivity test',
      serverUrl,
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        contentLength,
        contentType,
        data: responseData,
        rawTextLength: rawText.length,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('External server test error:', error);
    
    return res.status(500).json({
      test: 'External server connectivity test',
      error: 'Failed to connect to external server',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
      },
      serverUrl,
      timestamp: new Date().toISOString(),
    });
  }
}