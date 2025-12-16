import { NextRequest, NextResponse } from 'next/server';
// Import rateLimit function later when available

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: number;
}

export function createApiResponse<T>(
  data?: T,
  error?: ApiError
): ApiResponse<T> {
  return {
    success: !error,
    data,
    error,
    timestamp: Date.now(),
  };
}

export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: string
): NextResponse {
  const response = createApiResponse(undefined, {
    message,
    status,
    code,
  });

  return NextResponse.json(response, { status });
}

export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  const response = createApiResponse(data);
  return NextResponse.json(response, { status });
}

export async function handleApiError(
  error: unknown,
  context?: string
): Promise<NextResponse> {
  console.error(`API Error ${context ? `in ${context}` : ''}:`, error);

  if (error instanceof Error) {
    if (error.message.includes('rate limit')) {
      return createErrorResponse(
        'Too many requests. Please try again later.',
        429,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    if (error.message.includes('validation')) {
      return createErrorResponse(
        error.message,
        400,
        'VALIDATION_ERROR'
      );
    }

    if (error.message.includes('unauthorized')) {
      return createErrorResponse(
        'Unauthorized access',
        401,
        'UNAUTHORIZED'
      );
    }

    if (error.message.includes('forbidden')) {
      return createErrorResponse(
        'Forbidden access',
        403,
        'FORBIDDEN'
      );
    }

    if (error.message.includes('not found')) {
      return createErrorResponse(
        'Resource not found',
        404,
        'NOT_FOUND'
      );
    }

    return createErrorResponse(
      error.message,
      500,
      'INTERNAL_ERROR'
    );
  }

  return createErrorResponse(
    'An unexpected error occurred',
    500,
    'UNKNOWN_ERROR'
  );
}

export function validateJsonBody<T>(
  body: any,
  requiredFields: (keyof T)[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    errors.push('Request body must be a valid JSON object');
    return { isValid: false, errors };
  }

  for (const field of requiredFields) {
    if (!(field in body) || body[field] === undefined || body[field] === null) {
      errors.push(`Missing required field: ${String(field)}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse(
        'Missing or invalid authorization header',
        401,
        'UNAUTHORIZED'
      );
    }

    const token = authHeader.substring(7);
    
    // Add your JWT validation logic here
    if (!token || token === 'invalid') {
      return createErrorResponse(
        'Invalid token',
        401,
        'INVALID_TOKEN'
      );
    }

    return await handler(request);
  } catch (error) {
    return handleApiError(error, 'authentication');
  }
}

export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
  limit: number = 10
): Promise<NextResponse> {
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Simple rate limiting implementation
    const now = Date.now();
    const key = `rate_limit:${ip}`;
    
    // This would typically use Redis or a proper rate limiting service
    // For now, we'll implement a basic in-memory rate limiter
    
    return await handler(request);
  } catch (error) {
    return handleApiError(error, 'rate limiting');
  }
}

export async function withValidation<T>(
  request: NextRequest,
  requiredFields: (keyof T)[],
  handler: (request: NextRequest, body: T) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validation = validateJsonBody<T>(body, requiredFields);

    if (!validation.isValid) {
      return createErrorResponse(
        `Validation failed: ${validation.errors.join(', ')}`,
        400,
        'VALIDATION_ERROR'
      );
    }

    return await handler(request, body as T);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return createErrorResponse(
        'Invalid JSON in request body',
        400,
        'INVALID_JSON'
      );
    }
    return handleApiError(error, 'validation');
  }
}

export function corsHeaders(origin?: string | null) {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://optik.vercel.app',
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean);

  return {
    'Access-Control-Allow-Origin': 
      origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export function withCors(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> | NextResponse {
  const origin = request.headers.get('origin');

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders(origin),
    });
  }

  return handler(request).then(response => {
    const corsHeadersObj = corsHeaders(origin);
    Object.entries(corsHeadersObj).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  });
}

export function logApiRequest(
  request: NextRequest,
  context: string,
  additionalData?: Record<string, any>
) {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';

  console.log(
    JSON.stringify({
      timestamp,
      context,
      method,
      url,
      ip,
      userAgent,
      ...additionalData,
    })
  );
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}