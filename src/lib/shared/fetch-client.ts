export type FetchClient = typeof client

export type ClientRequest = RequestInit & {
  token?: string
  data?: Record<string, unknown>
  query?: Record<string, string>
}

export async function client<T = any>(
  endpoint: string,
  customConfig: ClientRequest = {}
): Promise<T> {
  const { data, token, headers: customHeaders, ...rest } = customConfig

  endpoint = customConfig.query
    ? `${endpoint}?${new URLSearchParams(customConfig.query).toString()}`
    : endpoint
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      // @ts-expect-error  - can't return undefined here
      Authorization: token ? `Bearer ${token}` : undefined,
      // @ts-expect-error - can't return undefined here
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders
    },
    ...rest
  }

  const response = await fetch(endpoint, config)
  if (response.ok) {
    return await response.json()
  } else {
    throw response
  }
}
