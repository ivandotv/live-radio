import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: process.env.NEXT_PUBLIC_VERCEL_URL
  }
})
