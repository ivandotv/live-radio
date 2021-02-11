import { getSession } from 'next-auth/client'

export class AuthService {
  async isAuthenticated() {
    const session = await getSession()

    console.log('Auth service ', !!session)

    return Boolean(session)
  }
}
