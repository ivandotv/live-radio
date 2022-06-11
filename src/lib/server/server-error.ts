import Joi from 'joi'

export class ServerError extends Error {
  status: number

  logIt: boolean

  diagnostics?: Record<string, any>

  body?: Record<string, any>

  expose = false

  dev?: any

  constructor(opts?: {
    message?: string
    status?: number
    logIt?: boolean
    diagnostics?: Record<string, any>
    dev?: any
  }) {
    const message = opts?.message || 'Internal server error'

    super(message)

    this.status = opts?.status || 500
    this.logIt = opts?.logIt ?? true
    this.diagnostics = opts?.diagnostics
    this.dev = opts?.dev
  }
}

export class PublicServerError extends ServerError {
  constructor(opts?: {
    message?: string
    status?: number
    body?: Record<string, any>
    logIt?: boolean
    diagnostics?: Record<string, any>
    dev?: any
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

    super({
      message,
      status: opts?.status,
      logIt: opts?.logIt,
      diagnostics: opts?.diagnostics,
      dev: opts?.dev
    })
    this.expose = true
    this.body = opts?.body || { msg: message }
  }
}

export class ValidationError extends PublicServerError {
  validationError?: Joi.ValidationError

  constructor(opts?: {
    body?: Record<string, any>
    error?: Joi.ValidationError
    dev?: any
  }) {
    super({
      logIt: false,
      status: 400,
      body: opts?.body || { msg: 'validation failed' },
      dev: opts?.dev
    })

    this.validationError = opts?.error
  }
}

export class RadioApiError extends PublicServerError {
  constructor(e: any) {
    super({ message: 'radio api not available', diagnostics: e, status: 503 })
  }
}
