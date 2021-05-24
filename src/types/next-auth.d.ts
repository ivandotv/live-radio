/** Example on how to extend the built-in session types */
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
declare module 'next-auth' {
  interface Session {
    id: string
    user: User
  }
  interface User {
    id: string
  }
}
