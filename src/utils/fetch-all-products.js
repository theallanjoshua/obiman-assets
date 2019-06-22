import Network from './network';
import { PRODUCTS_API_URL } from '../constants/endpoints';

export const fetchAllProducts = async () => {
  try {
    const response = await Network.get(PRODUCTS_API_URL);
    const products = response.products
      .sort((prevProduct, nextProduct) => prevProduct.label.localeCompare(nextProduct.label));
    return products;
  } catch (errorMessage) {
    throw errorMessage
  }
}