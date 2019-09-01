import Network from './network';
import { PRODUCTS_API_URL } from '../constants/endpoints';
import { Product, ProductCompositionEntity, Ingredient, Utils } from 'obiman-data-models';

export const fetchAllProducts = async businessId => {
  try {
    const { products } = await Network.get(PRODUCTS_API_URL(businessId));
    return products
      .sort((prv, nxt) => prv.label.localeCompare(nxt.label));;
  } catch (errorMessage) {
    throw errorMessage
  }
}

export const getEnrichedProducts = (products, ingredients) => products.map(item => {
  const product = new Product(item);
  const productData = product.get();
  const composition = productData.composition.map(item => {
    const productCompositionEntity = new ProductCompositionEntity(item);
    const productCompositionEntityData = productCompositionEntity.get();
    const { id: pceId, label: pceLabel, quantity: pceQuantity, unit: pceUnit } = productCompositionEntityData;
    const defaultIngredientData = new Ingredient()
      .setLabel(`${pceLabel} - DELETED INGREDIENT`)
      .setQuantity(pceQuantity)
      .setUnit(pceUnit)
      .get();
    const ingredientData = ingredients.filter(({ id }) => id === pceId)[0] || { ...defaultIngredientData };
    const { label, quantity, unit } = ingredientData;
    const availableQuantity = new Utils().convert(quantity, unit, pceUnit);
    const quantityGap = availableQuantity - pceQuantity;
    const maxRepetition = Math.floor(availableQuantity/pceQuantity);
    return { ...productCompositionEntityData, label, quantityGap, maxRepetition}
  });
  const lowInventoryIngredients = composition.filter(({ quantityGap }) => quantityGap < 0).map(({ label }) => label);
  const maxRepetition = Math.floor(composition.map(({ maxRepetition }) => maxRepetition).sort((prv, nxt) => prv - nxt)[0] || 0);
  return { ...productData, composition, lowInventoryIngredients, maxRepetition };
});