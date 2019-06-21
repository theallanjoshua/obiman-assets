import Network from './network';
import { Ingredient } from 'obiman-data-models';
import { INGREDIENTS_API_URL } from '../constants/endpoints';

export const fetchAllIngredients = async () => {
  try {
    const response = await Network.get(INGREDIENTS_API_URL);
    const ingredients = response.ingredients
      .map(item => new Ingredient(item).get())
      .sort((prevIngredient, nextIngredient) => prevIngredient.label.localeCompare(nextIngredient.label));
    return ingredients;
  } catch (errorMessage) {
    throw errorMessage;
  }
}