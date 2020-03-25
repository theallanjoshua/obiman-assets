import Network from './network';
import { INGREDIENTS_API_URL } from '../constants/endpoints';

export const fetchAllIngredients = async businessId => {
  try {
    const { ingredients } = await Network.get(INGREDIENTS_API_URL(businessId));
    return ingredients.sort((prv, nxt) => prv.label.localeCompare(nxt.label));;
  } catch (errorMessage) {
    throw errorMessage;
  }
}