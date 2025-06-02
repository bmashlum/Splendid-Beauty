#!/usr/bin/env node

// Test script to verify health check functionality
// Run with: node scripts/test-health-check.js

async function testHealthCheck() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  
  const healthUrl = `${baseUrl}/api/health`;
  
  console.log(`Testing health check at: ${healthUrl}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Vercel?', !!process.env.VERCEL);
  console.log('KV configured?', !!(process.env.KV_URL || process.env.KV_REST_API_URL));
  console.log('---');
  
  try {
    const response = await fetch(healthUrl);
    const data = await response.json();
    
    console.log('Status:', data.status);
    console.log('Uptime:', Math.round(data.uptime), 'seconds');
    console.log('\nChecks:');
    console.log('- Write Storage:', data.checks.filesystem ? '✓' : '✗');
    console.log('- Cache:', data.checks.cache ? '✓' : '✗');
    console.log('- Environment:', data.checks.environment ? '✓' : '✗');
    console.log('- Storage:', data.checks.storage ? '✓' : '✗');
    console.log('- Memory:', `${data.checks.memory.percentage}% used`);
    
    console.log('\nServices:');
    console.log('- Auth:', data.services.auth ? '✓' : '✗');
    console.log('- Analytics:', data.services.analytics ? '✓' : '✗');
    console.log('- Maps:', data.services.maps ? '✓' : '✗');
    
    if (data.errors && data.errors.length > 0) {
      console.log('\nErrors:');
      data.errors.forEach(error => console.log(`- ${error}`));
    }
    
    console.log('\nOverall health check:', response.status === 200 ? 'PASSED' : 'FAILED');
  } catch (error) {
    console.error('Failed to fetch health check:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Run the test
testHealthCheck().catch(console.error);
