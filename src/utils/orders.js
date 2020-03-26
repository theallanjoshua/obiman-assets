import Network from './network';
import { ORDERS_API_URL } from '../constants/endpoints';

export const fetchOrders = async (businessId, orderIds = []) => {
  try {
    const { orders } = await Network.get(ORDERS_API_URL(businessId, orderIds));
    return orders.sort((prv, nxt) => prv.updatedDate - nxt.updatedDate);
  } catch (errorMessage) {
    throw errorMessage
  }
}

export const getEnrichedOrders = (orders, products, bills) => orders.map(order => {
  const { label: productLabel } = products.filter(({ id }) => id === order.productId)[0] || { label: order.productLabel };
  const { source, sourceId } = bills.filter(({ id }) => id === order.billId)[0] || {};
  return {
    ...order,
    productLabel,
    source,
    sourceId
  };
})