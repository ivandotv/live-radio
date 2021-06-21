import { getSession } from 'next-auth/client'

export class AuthService {
  constructor() {}

  async isAuthenticated() {
    const session = await getSession()

    return Boolean(session)
  }
}
