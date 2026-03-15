const API_PREFIX = '/api/v1'

export const apiEndpoints = {
  system: {
    healthz: '/healthz',
  },
  auth: {
    register: `${API_PREFIX}/auth/register`,
    login: `${API_PREFIX}/auth/login`,
    requestEmailVerification: `${API_PREFIX}/auth/verify-email/request`,
    confirmEmailVerification: `${API_PREFIX}/auth/verify-email/confirm`,
    forgotPassword: `${API_PREFIX}/auth/password/forgot`,
    resetPassword: `${API_PREFIX}/auth/password/reset`,
    refresh: `${API_PREFIX}/auth/refresh`,
    logout: `${API_PREFIX}/auth/logout`,
    me: `${API_PREFIX}/auth/me`,
  },
}
