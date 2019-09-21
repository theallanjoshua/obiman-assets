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
    const { label, quantity, unit, expiryDate } = ingredientData;
    const availableQuantity = new Utils().convert(quantity, unit, pceUnit);
    const quantityGap = availableQuantity - pceQuantity;
    const maxRepetition = Math.floor(availableQuantity / pceQuantity);
    return { ...productCompositionEntityData, label, quantityGap, maxRepetition, expiryDate };
  });
  const issues = composition.reduce((acc, { quantityGap, expiryDate, unit, label }) => {
    const quantityIssue = quantityGap < 0 ? [`${label} - Need ${quantityGap * -1}${unit} more`] : [];
    const expiryIssue = expiryDate && expiryDate <= Date.now() ? [`${label} - Expired`] : [];
    return [ ...acc, ...quantityIssue, ...expiryIssue ];
  }, []);
  const maxRepetition = Math.floor(composition.map(({ maxRepetition }) => maxRepetition).sort((prv, nxt) => prv - nxt)[0] || 0);
  return { ...productData, composition, issues, maxRepetition };
});