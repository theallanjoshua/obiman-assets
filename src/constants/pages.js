import { getCurrentBusinessId } from '../utils/businesses';

export const HOME = '/';
export const BUSINESS = '/business';
export const INGREDIENTS = '/ingredients';
export const PRODUCTS = '/products';
export const BILLS = '/bills';
export const ORDERS = '/orders';

export const BUSINESS_EDIT = `${BUSINESS}/edit`;
export const BUSINESS_RESOURCE = `${BUSINESS}/:businessId`;

export const BUSINESS_SPECIFIC_URL_MAP = {
  [HOME]: `${BUSINESS}/${getCurrentBusinessId()}${HOME}`,
  [INGREDIENTS]: `${BUSINESS}/${getCurrentBusinessId()}${INGREDIENTS}`,
  [PRODUCTS]: `${BUSINESS}/${getCurrentBusinessId()}${PRODUCTS}`,
  [BILLS]: `${BUSINESS}/${getCurrentBusinessId()}${BILLS}`,
  [ORDERS]: `${BUSINESS}/${getCurrentBusinessId()}${ORDERS}`
}

export const HOME_MENU_ITEM_TITLE = 'Home';
export const BUSINESS_MENU_ITEM_TITLE = 'Business';
export const INGREDIENTS_MENU_ITEM_TITLE = 'Ingredients';
export const PRODUCTS_MENU_ITEM_TITLE = 'Products';
export const BILLS_MENU_ITEM_TITLE = 'Bills';
export const ORDERS_MENU_ITEM_TITLE = 'Orders';

export const PAGE_URL_TITLE_MAP = {
  [HOME]: HOME_MENU_ITEM_TITLE,
  [BUSINESS]: BUSINESS_MENU_ITEM_TITLE,
  [INGREDIENTS]: INGREDIENTS_MENU_ITEM_TITLE,
  [PRODUCTS]: PRODUCTS_MENU_ITEM_TITLE,
  [BILLS]: BILLS_MENU_ITEM_TITLE,
  [ORDERS]: ORDERS_MENU_ITEM_TITLE
}
export const BREADCRUMB_MAP = {
  [INGREDIENTS]: [INGREDIENTS],
  [PRODUCTS]: [PRODUCTS],
  [BILLS]: [BILLS],
  [ORDERS]: [ORDERS]
};