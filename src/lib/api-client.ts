import axios from 'axios';
import { auth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
        const { getToken } = await auth();
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // Anonymous or unconfigured auth
    }

    try {
      const headersList = await headers();
      const ip = headersList.get('x-forwarded-for');
      if (ip) {
        config.headers['X-Forwarded-For'] = ip;
      }
    } catch (error) {
      // Ignore errors if headers() is called outside request context (e.g. build)
      console.warn('Could not set X-Forwarded-For header:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
