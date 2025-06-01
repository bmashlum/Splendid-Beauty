import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { errorLogger } from '@/lib/error-logger'

async function verifyAuth(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token || !process.env.JWT_SECRET) return false
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  // Verify authentication
  if (!await verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    
    // Get recent errors
    const errors = errorLogger.getRecentErrors(limit)
    
    return NextResponse.json({
      errors,
      count: errors.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve errors' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Verify authentication
  if (!await verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    // Clear error logs
    errorLogger.clearLogs()
    
    return NextResponse.json({
      message: 'Error logs cleared',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear errors' },
      { status: 500 }
    )
  }
}