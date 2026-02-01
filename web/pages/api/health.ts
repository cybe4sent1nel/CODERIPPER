import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, isMongoConfigured, getMaskedMongoUrl, isConnected } from '@/lib/mongodb';

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    mongodb: {
      configured: boolean;
      connected: boolean;
      url?: string;
      error?: string;
    };
    app: {
      version: string;
      environment: string;
      url: string;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: { configured: false, connected: false, error: 'Method not allowed' },
        app: { version: '0.1.0', environment: process.env.NODE_ENV || 'development', url: process.env.NEXT_PUBLIC_APP_URL || 'https://coderipper.vercel.app' }
      }
    });
  }

  let mongoStatus: HealthResponse['services']['mongodb'] = {
    configured: isMongoConfigured,
    connected: isConnected(),
  };

  // Try to connect to MongoDB if configured
  if (isMongoConfigured) {
    try {
      await connectToDatabase();
      mongoStatus = {
        configured: true,
        connected: true,
        url: getMaskedMongoUrl()
      };
    } catch (error) {
      mongoStatus = {
        configured: true,
        connected: false,
        url: getMaskedMongoUrl(),
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  const overallStatus: HealthResponse['status'] = 
    !isMongoConfigured ? 'degraded' :
    mongoStatus.connected ? 'healthy' : 'unhealthy';

  return res.status(overallStatus === 'unhealthy' ? 503 : 200).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoStatus,
      app: {
        version: process.env.npm_package_version || '0.1.0',
        environment: process.env.NODE_ENV || 'development',
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://coderipper.vercel.app'
      }
    }
  });
}
