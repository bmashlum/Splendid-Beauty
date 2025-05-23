import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import crypto from 'crypto';

// Auth configuration
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Rate limiting map (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  try {
    // Check if auth is properly configured
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
      console.error('Auth configuration missing');
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }

    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    // Check rate limiting
    const attempts = loginAttempts.get(clientIP);
    if (attempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      
      if (attempts.count >= MAX_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);
        return NextResponse.json(
          { error: `Too many login attempts. Please try again in ${remainingTime} minutes.` },
          { status: 429 }
        );
      }
      
      // Reset if lockout has expired
      if (timeSinceLastAttempt >= LOCKOUT_DURATION) {
        loginAttempts.delete(clientIP);
      }
    }

    const { username, password } = await request.json();

    // Validate input
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Validate credentials (timing-attack safe comparison)
    const usernameValid = crypto.timingSafeEqual(
      Buffer.from(username),
      Buffer.from(ADMIN_USERNAME)
    );
    const passwordValid = crypto.timingSafeEqual(
      Buffer.from(password),
      Buffer.from(ADMIN_PASSWORD)
    );

    if (usernameValid && passwordValid) {
      // Clear login attempts on successful login
      loginAttempts.delete(clientIP);
      
      // Create JWT token with additional claims
      const secret = new TextEncoder().encode(JWT_SECRET);
      const token = await new SignJWT({ 
        username,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('12h')
        .setJti(crypto.randomUUID())
        .sign(secret);

      // Create the response
      const response = NextResponse.json({ success: true });

      // Set the token as an HTTP-only cookie with security headers
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 12 // 12 hours
      });
      
      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');

      return response;
    } else {
      // Track failed login attempt
      const current = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
      loginAttempts.set(clientIP, {
        count: current.count + 1,
        lastAttempt: Date.now()
      });
      
      // Generic error message to prevent username enumeration
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Clean up old login attempts periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, attempts] of loginAttempts.entries()) {
    if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
      loginAttempts.delete(ip);
    }
  }
}, 60 * 60 * 1000); // Every hour
