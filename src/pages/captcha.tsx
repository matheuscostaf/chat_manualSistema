import axios from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';
import { setCookie } from 'nookies';
import * as crypto from 'crypto';
import * as https from 'https';

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;

// Primary verification using native Node.js https module (more reliable)
const verifyHcaptchaWithHttps = async (token: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const postData = new URLSearchParams({
      secret: HCAPTCHA_SECRET!,
      response: token,
    }).toString();

    const options = {
      hostname: 'api.hcaptcha.com',
      port: 443,
      path: '/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Node.js hCaptcha Verification/1.0',
      },
      timeout: 20000, // 20 seconds timeout
      // Only disable SSL verification in development if needed
      rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false,
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('hCaptcha HTTPS verification result:', result);
          resolve(result.success === true);
        } catch (e) {
          console.error('Failed to parse hCaptcha response:', e, 'Raw data:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error('hCaptcha HTTPS request error:', {
        message: error.message,
        code: (error as any).code,
        errno: (error as any).errno,
        syscall: (error as any).syscall,
      });
      resolve(false);
    });

    req.on('timeout', () => {
      console.error('hCaptcha HTTPS request timeout');
      req.destroy();
      resolve(false);
    });

    req.setTimeout(20000);
    req.write(postData);
    req.end();
  });
};

const verifyHcaptcha = async (token: string, retries = 2): Promise<boolean> => {
  if (!token) {
    console.error('No hCaptcha token provided');
    return false;
  }

  if (!HCAPTCHA_SECRET) {
    console.error('HCAPTCHA_SECRET environment variable not set');
    return false;
  }

  // Primary method: Use native HTTPS (more reliable)
  console.log('Attempting hCaptcha verification with native HTTPS...');
  try {
    const httpsResult = await verifyHcaptchaWithHttps(token);
    if (httpsResult) {
      console.log('hCaptcha verification successful with HTTPS');
      return true;
    }
    console.warn('HTTPS verification returned false, trying axios fallback...');
  } catch (error) {
    console.warn('HTTPS verification failed, falling back to axios:', error);
  }

  // Fallback: Use axios with retries
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`hCaptcha axios verification attempt ${attempt}/${retries}`);
      
      const response = await axios.post(
        'https://api.hcaptcha.com/siteverify',
        new URLSearchParams({
          secret: HCAPTCHA_SECRET,
          response: token,
        }).toString(),
        {
          timeout: 15000, // 15 seconds timeout
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Node.js hCaptcha Verification/1.0',
          },
          validateStatus: (status) => status < 500, // Don't throw on 4xx errors
          maxRedirects: 0, // Disable redirects
        }
      );

      if (response.status === 200 && response.data) {
        console.log('hCaptcha axios API response:', response.data);
        return response.data.success === true;
      } else {
        console.warn(`hCaptcha API returned status ${response.status} on attempt ${attempt}`);
      }
    } catch (error) {
      const errorInfo = {
        attempt,
        message: error instanceof Error ? error.message : 'Unknown error',
        code: axios.isAxiosError(error) ? error.code : 'UNKNOWN',
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        isTimeout: axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.message.includes('timeout')),
        isSocketHangUp: axios.isAxiosError(error) && (error.code === 'ECONNRESET' || error.message.includes('socket hang up')),
      };
      
      console.error('hCaptcha axios verification error:', errorInfo);

      // If this is the last attempt, return false
      if (attempt === retries) {
        console.error('Max axios retries reached, failing verification');
        return false;
      }

      // Wait before retrying (1s, 2s)
      const waitTime = attempt * 1000;
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  console.error('All verification attempts failed');
  return false;
};

// Adicione um componente React simples
const CaptchaVerification: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Verificando captcha...</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const token = context.query.token as string;
    
    if (!token) {
      console.error('No hCaptcha token provided in query params');
      return {
        redirect: {
          destination: '/error?message=No captcha token provided',
          permanent: false,
        }
      };
    }

    console.log('Starting hCaptcha verification...');
    const isHuman = await verifyHcaptcha(token);

    if (!isHuman) {
      console.warn('hCaptcha verification failed');
      return {
        redirect: {
          destination: '/error?message=Failed to verify hCaptcha',
          permanent: false,
        }
      };
    }

    // Generate a more secure session ID
    const sessionId = crypto.randomBytes(32).toString('hex');
    
    setCookie(context, 'sessionId', sessionId, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: true, // Make cookie HTTP-only for security
    });
    
    console.log('hCaptcha verification successful, redirecting to chat');
    return {
      redirect: {
        destination: '/chat',
        permanent: false,
      }
    };
  } catch (error) {
    console.error('Unexpected error in getServerSideProps:', error);
    return {
      redirect: {
        destination: '/error?message=Server error during captcha verification',
        permanent: false,
      }
    };
  }
};

// Exportação padrão do componente React
export default CaptchaVerification;
