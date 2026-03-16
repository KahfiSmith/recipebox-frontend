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
  dashboard: {
    overview: `${API_PREFIX}/dashboard`,
    recipes: `${API_PREFIX}/recipes`,
    recipeById: (id: string) => `${API_PREFIX}/recipes/${id}`,
    mealPlans: `${API_PREFIX}/meal-plans`,
    mealPlanById: (id: string) => `${API_PREFIX}/meal-plans/${id}`,
    shoppingItems: `${API_PREFIX}/shopping-items`,
    shoppingItemById: (id: string) => `${API_PREFIX}/shopping-items/${id}`,
  },
}
