import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

export class AuthExpiredError extends Error {
  constructor() {
    super('Auth expired')
    this.name = 'AuthExpiredError'
  }
}

export class AuthService {
  protected firstCheck = true

  protected session: Session | null = null

  protected resolved = false

  static inject = [getSession]

  constructor(public sessionCheck: typeof getSession) {}

  async getAuth(fromCache = true) {
    if (!this.resolved || !fromCache) {
      this.session = await this.sessionCheck.call(null)
      this.resolved = true
    }

    return this.session
  }
}
