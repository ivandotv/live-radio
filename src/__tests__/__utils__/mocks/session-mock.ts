import { DefaultUser } from 'next-auth'

export function sessionMock(user: DefaultUser) {
  return () => {
    return {
      user,
      expires: '2022-07-11T17:12:22.142Z'
    }
  }
}
