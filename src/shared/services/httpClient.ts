type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions<TBody> extends Omit<RequestInit, 'method' | 'body'> {
  query?: Record<string, string | number | boolean | undefined>
  body?: TBody
  skipAuthRefresh?: boolean
  skipUnauthorizedHandler?: boolean
}

type RefreshAccessTokenHandler = () => Promise<void>
type UnauthorizedHandler = () => Promise<void> | void

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
let accessToken: string | null = null
let refreshAccessTokenHandler: RefreshAccessTokenHandler | null = null
let unauthorizedHandler: UnauthorizedHandler | null = null
let refreshPromise: Promise<void> | null = null
let unauthorizedPromise: Promise<void> | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function setAuthHandlers(handlers: {
  refreshAccessToken?: RefreshAccessTokenHandler | null
  handleUnauthorized?: UnauthorizedHandler | null
}) {
  refreshAccessTokenHandler = handlers.refreshAccessToken ?? null
  unauthorizedHandler = handlers.handleUnauthorized ?? null
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError'

const toQueryString = (query?: RequestOptions<unknown>['query']) => {
  if (!query) return ''
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return
    params.set(key, String(value))
  })
  return `?${params.toString()}`
}

const isUnauthorizedStatus = (status: number) => status === 401 || status === 403

const isHttpError = (error: unknown): error is HttpError => error instanceof HttpError

const parseErrorResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''
  let message = ''

  if (contentType.includes('application/json')) {
    const payload = (await response.json()) as { message?: string; error?: string }
    message = payload.message ?? payload.error ?? ''
  } else {
    message = await response.text()
  }

  return new HttpError(message || `Request failed with status ${response.status}`, response.status)
}

const refreshAccessToken = async () => {
  if (!refreshAccessTokenHandler) return false

  if (!refreshPromise) {
    refreshPromise = refreshAccessTokenHandler().finally(() => {
      refreshPromise = null
    })
  }

  await refreshPromise
  return true
}

const handleUnauthorized = async () => {
  if (!unauthorizedHandler) return

  if (!unauthorizedPromise) {
    unauthorizedPromise = Promise.resolve(unauthorizedHandler()).finally(() => {
      unauthorizedPromise = null
    })
  }

  await unauthorizedPromise
}

async function request<TResponse = unknown, TBody = unknown>(
  path: string,
  method: HttpMethod,
  options: RequestOptions<TBody> = {},
  canRetryUnauthorized = true,
): Promise<TResponse> {
  const {
    body,
    query,
    headers,
    skipAuthRefresh = false,
    skipUnauthorizedHandler = false,
    ...rest
  } = options
  const url = `${API_BASE_URL}${path}${toQueryString(query)}`
  const requestHeaders = new Headers(headers)

  requestHeaders.set('Accept', 'application/json')

  if (body) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (accessToken) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  let response: Response

  try {
    response = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
      headers: requestHeaders,
      ...rest,
    })
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }

    throw new HttpError(
      `Unable to reach API at ${url}. Check VITE_API_BASE_URL, backend server, and CORS configuration.`,
      0,
    )
  }

  if (!response.ok) {
    if (
      response.status === 401
      && canRetryUnauthorized
      && !skipAuthRefresh
      && Boolean(accessToken)
      && refreshAccessTokenHandler
    ) {
      try {
        await refreshAccessToken()
        return request<TResponse, TBody>(path, method, options, false)
      } catch (error) {
        if (isHttpError(error) && isUnauthorizedStatus(error.status) && !skipUnauthorizedHandler) {
          await handleUnauthorized()
        }

        throw error
      }
    }

    const error = await parseErrorResponse(response)

    if (isUnauthorizedStatus(error.status) && Boolean(accessToken) && !skipUnauthorizedHandler) {
      await handleUnauthorized()
    }

    throw error
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return (await response.json()) as TResponse
  }

  return (await response.text()) as TResponse
}

export const apiClient = {
  get<TResponse>(path: string, options?: RequestOptions<never>) {
    return request<TResponse>(path, 'GET', options)
  },
  post<TResponse, TBody = unknown>(path: string, body: TBody, options?: RequestOptions<TBody>) {
    return request<TResponse, TBody>(path, 'POST', { ...options, body })
  },
  put<TResponse, TBody = unknown>(path: string, body: TBody, options?: RequestOptions<TBody>) {
    return request<TResponse, TBody>(path, 'PUT', { ...options, body })
  },
  patch<TResponse, TBody = unknown>(path: string, body: TBody, options?: RequestOptions<TBody>) {
    return request<TResponse, TBody>(path, 'PATCH', { ...options, body })
  },
  delete<TResponse>(path: string, options?: RequestOptions<never>) {
    return request<TResponse>(path, 'DELETE', options)
  },
}
