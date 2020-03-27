export const USERS_API_URL = 'api/users';
export const BUSINESSES_API_URL = 'api/businesses';
export const CUSTOMER_API_URL = 'api/customers';
export const INGREDIENTS_API_URL = businessId => `${BUSINESSES_API_URL}/${businessId}/ingredients`;
export const PRODUCTS_API_URL = businessId => `${BUSINESSES_API_URL}/${businessId}/products`;
export const BILLS_API_URL = (businessId, query) => `${BUSINESSES_API_URL}/${businessId}/bills${query ? `?${query}` : ``}`;
export const CUSTOMER_BILLS_API_URL = (customer, query) => `${CUSTOMER_API_URL}/${customer}/bills${query ? `?${query}` : ``}`;
export const ORDERS_API_URL = (businessId, orderIds = []) => `${BUSINESSES_API_URL}/${businessId}/orders${orderIds.length ? `?orderIds=${orderIds.join(',')}` : ''}`;
export const FILE_API_URL = 'api/file';