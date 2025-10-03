import { NextApiRequest, NextApiResponse } from 'next';
import * as https from 'https';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    environmentVariables: {
      hcaptchaSecretSet: !!process.env.HCAPTCHA_SECRET,
      hcaptchaSiteKeySet: !!process.env.HCAPTCHA_SITE_KEY,
      serverUrlSet: !!process.env.SERVER_URL,
    },
    networkTest: null as any,
  };

  // Test network connectivity to hCaptcha API
  try {
    const networkTest = await testHcaptchaConnectivity();
    diagnostics.networkTest = networkTest;
  } catch (error) {
    diagnostics.networkTest = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  res.status(200).json(diagnostics);
}

function testHcaptchaConnectivity(): Promise<any> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = https.request({
      hostname: 'api.hcaptcha.com',
      port: 443,
      path: '/siteverify',
      method: 'HEAD',
      timeout: 10000,
    }, (res) => {
      const endTime = Date.now();
      resolve({
        success: true,
        statusCode: res.statusCode,
        responseTime: endTime - startTime,
        headers: res.headers,
      });
    });

    req.on('error', (error) => {
      const endTime = Date.now();
      resolve({
        success: false,
        error: error.message,
        code: (error as any).code,
        responseTime: endTime - startTime,
      });
    });

    req.on('timeout', () => {
      const endTime = Date.now();
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout',
        responseTime: endTime - startTime,
      });
    });

    req.end();
  });
}