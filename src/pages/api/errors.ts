// pages/api/errors.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface ErrorReport {
  message: string;
  stack?: string;
  context: string;
  timestamp: string;
  url?: string;
  userAgent?: string;
  userId?: string;
}

interface ErrorResponse {
  success: boolean;
  message: string;
  errorId?: string;
}

// In-memory error storage (in production, use a proper logging service)
const errorStore = new Map<string, ErrorReport[]>();
const MAX_ERRORS_PER_SESSION = 50;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const {
      message,
      stack,
      context,
      timestamp,
      url,
    }: Partial<ErrorReport> = req.body;

    // Basic validation
    if (!message || !context || !timestamp) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: message, context, timestamp'
      });
    }

    // Generate error ID
    const errorId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get client info
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const sessionId = Array.isArray(clientIP) ? clientIP[0] : clientIP;

    // Create error report
    const errorReport: ErrorReport = {
      message: message.substring(0, 1000), // Limit message length
      stack: stack?.substring(0, 2000), // Limit stack trace length
      context: context.substring(0, 100),
      timestamp,
      url: url?.substring(0, 500),
      userAgent: userAgent.substring(0, 200)
    };

    // Store error (with session-based cleanup)
    const sessionErrors = errorStore.get(sessionId) || [];
    sessionErrors.push(errorReport);
    
    // Keep only recent errors
    if (sessionErrors.length > MAX_ERRORS_PER_SESSION) {
      sessionErrors.splice(0, sessionErrors.length - MAX_ERRORS_PER_SESSION);
    }
    
    errorStore.set(sessionId, sessionErrors);

    // Log to server console
    console.error('Client Error Report:', {
      errorId,
      context,
      message,
      url,
      sessionId,
      timestamp: new Date(timestamp).toISOString()
    });

    // In production, you would send this to a logging service
    // Example: await sendToLoggingService(errorReport);

    res.status(200).json({
      success: true,
      message: 'Error report received',
      errorId
    });

  } catch (error) {
    console.error('Failed to process error report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process error report'
    });
  }
}