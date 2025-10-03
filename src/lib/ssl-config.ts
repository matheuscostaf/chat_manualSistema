/** 
 * Development configuration for handling SSL/TLS in development environment
 * This approach is safer than setting global environment variables
 */

import https from 'https';

// Create HTTPS agent for development that handles self-signed certificates
export const createDevelopmentHttpsAgent = () => {
  if (process.env.NODE_ENV === 'development') {
    return new https.Agent({
      rejectUnauthorized: false, // Only in development
      timeout: 30000,
    });
  }
  
  // Production - use default secure settings
  return new https.Agent({
    timeout: 30000,
  });
};

// Fetch wrapper with proper SSL handling
export const secureFetch = async (url: string, options: RequestInit = {}) => {
  // Note: fetch() in Node.js doesn't directly support custom agents
  // For more complex SSL handling, consider using axios or node-fetch with agents
  
  if (process.env.NODE_ENV === 'development') {
    // In development, we might need to handle self-signed certificates
    // This is a placeholder for more complex SSL handling if needed
    console.log('Using development SSL configuration for:', url);
  }
  
  return fetch(url, {
    ...options,
    // Add any development-specific options here
  });
};

// Environment configuration
export const getEnvironmentConfig = () => {
  return {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    serverUrl: process.env.SERVER_URL,
    hcaptchaSecret: process.env.HCAPTCHA_SECRET,
    hcaptchaSiteKey: process.env.HCAPTCHA_SITE_KEY,
  };
};