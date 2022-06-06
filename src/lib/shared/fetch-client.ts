export type FetchClient = typeof client

export type ClientRequest = RequestInit & {
  token?: string
  data?: Record<string, unknown>
}

export async function client<T = any>(
  endpoint: string,
  customConfig: ClientRequest = {}
): Promise<T> {
  const { data, token, headers: customHeaders, ...rest } = customConfig

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
