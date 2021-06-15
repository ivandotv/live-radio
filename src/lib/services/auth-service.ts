import { getSession } from 'next-auth/client'

export class AuthService {
  constructor() {
    console.log('auth service window ', typeof window)
  }

  async isAuthenticated() {
    const session = await getSession()

    return Boolean(session)
  }
}
