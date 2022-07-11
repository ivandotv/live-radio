import { defineConfig } from 'cypress'

console.log('Cypress config file ', process.env.NEXT_PUBLIC_VERCEL_URL)

export default defineConfig({
  video: false,
  e2e: {
    // baseUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false
  }
})
