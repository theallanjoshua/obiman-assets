import { getCurrentBusinessId } from '../utils/businesses';

export const HOME = '/';
export const BUSINESS = '/business';
export const INGREDIENTS = '/ingredients';
export const PRODUCTS = '/products';
export const BILLS = '/bills';
export const ORDERS = '/orders';
export const EDIT = '/edit';

export const BUSINESS_EDIT = `${BUSINESS}${EDIT}`;
export const BUSINESS_RESOURCE = `${BUSINESS}/:businessId`;

export const getBusinessSpecificUrl = url => `${BUSINESS}/${getCurrentBusinessId()}${url}`;
export const getPathFromLocation = () => window.location.hash.replace('#', '');

export const HOME_MENU_ITEM_TITLE = 'Home';
export const BUSINESS_MENU_ITEM_TITLE = 'Business';
export const INGREDIENTS_MENU_ITEM_TITLE = 'Ingredients';
export const PRODUCTS_MENU_ITEM_TITLE = 'Products';
export const BILLS_MENU_ITEM_TITLE = 'Bills';
export const ORDERS_MENU_ITEM_TITLE = 'Orders';
export const EDIT_MENU_ITEM_TITLE = 'Edit';

export const PAGE_URL_TITLE_MAP = {
  [HOME]: HOME_MENU_ITEM_TITLE,
  [BUSINESS]: BUSINESS_MENU_ITEM_TITLE,
  [INGREDIENTS]: INGREDIENTS_MENU_ITEM_TITLE,
  [PRODUCTS]: PRODUCTS_MENU_ITEM_TITLE,
  [BILLS]: BILLS_MENU_ITEM_TITLE,
  [ORDERS]: ORDERS_MENU_ITEM_TITLE,
  [EDIT]: EDIT_MENU_ITEM_TITLE
}