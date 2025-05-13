import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// Simple auth credentials - in production, these should be environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SplendidBeauty2024!';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt:', {
      providedUsername: username,
      providedPassword: password,
      expectedUsername: ADMIN_USERNAME,
      expectedPassword: ADMIN_PASSWORD
    });

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log('Login successful');
      // Create JWT token
      const secret = new TextEncoder().encode(JWT_SECRET);
      const token = await new SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

      // Create the response
      const response = NextResponse.json({ success: true });

      // Set the token as an HTTP-only cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    } else {
      console.log('Login failed: Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
