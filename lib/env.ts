import { z } from 'zod'

// Define environment schema
const envSchema = z.object({
  // Required environment variables
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  ADMIN_USERNAME: z.string().min(3, 'ADMIN_USERNAME must be at least 3 characters'),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters'),
  
  // Optional environment variables
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
  
  // Vercel-specific (auto-populated)
  VERCEL: z.string().optional(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  VERCEL_URL: z.string().optional(),
})

// Type for validated environment
export type Env = z.infer<typeof envSchema>

// Validate environment variables
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n')
      
      console.error('❌ Invalid environment variables:')
      console.error(missingVars)
      console.error('\nPlease check your .env.local file and ensure all required variables are set.')
      
      // In development, provide helpful message
      if (process.env.NODE_ENV === 'development') {
        console.error('\n💡 Tip: Copy .env.example to .env.local and fill in the values:')
        console.error('cp .env.example .env.local')
      }
      
      // Don't crash in development, but do in production
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Invalid environment variables')
      }
    }
    throw error
  }
}

// Export validated environment (singleton)
export const env = validateEnv()

// Helper to check if all required services are configured
export function checkServiceConfiguration() {
  const services = {
    auth: !!env.JWT_SECRET && !!env.ADMIN_USERNAME && !!env.ADMIN_PASSWORD,
    analytics: !!env.NEXT_PUBLIC_GA_ID,
    maps: !!env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  }
  
  return {
    allConfigured: Object.values(services).every(v => v),
    services
  }
}