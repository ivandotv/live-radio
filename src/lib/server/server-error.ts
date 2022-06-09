export class ServerError extends Error {
  status: number

  logIt: boolean

  diagnostics?: Record<string, any>

  body?: Record<string, any>

  constructor(opts?: {
    message?: string
    status?: number
    expose?: boolean
    body?: Record<string, any>
    logIt?: boolean
    diagnostics?: Record<string, any>
  }) {
    let message = 'Internal server error'
    if (opts?.message) {
      message = opts.message
    } else {
      if (opts?.body?.msg) {
        message = opts.body.msg
      } else if (opts?.body?.message) {
        message = opts.body.message
      }
    }

    super(message)

    this.status = opts?.status || 500
    this.logIt = opts?.logIt || true
    this.diagnostics = opts?.diagnostics

    if (opts?.body) {
      this.body = opts.body
      if (message && opts.body.message === undefined) {
        this.body.msg = message
      }
    }
  }
}
