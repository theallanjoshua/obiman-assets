export const USERS_API_URL = '/api/users/';
export const USERS_BUSINESSES_API_URL = '/businesses';
export const BUSINESSES_API_URL = '/api/businesses';
export const INGREDIENTS_API_URL = businessId => `${BUSINESSES_API_URL}/${businessId}/ingredients`;
export const PRODUCTS_API_URL = businessId => `${BUSINESSES_API_URL}/${businessId}/products`;
export const BILLS_API_URL = (businessId, query) => `${BUSINESSES_API_URL}/${businessId}/bills${query ? `?${query}` : ``}`;
export const FILE_API_URL = (s3Key = '') => `/api/file/${encodeURIComponent(s3Key)}`;