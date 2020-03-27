import Network from './network';
import { BILLS_API_URL, CUSTOMER_BILLS_API_URL } from '../constants/endpoints';
import { Bill } from 'obiman-data-models';

export const getBillQueryParamsFromQuery = query => Object.keys(query).reduce((acc, key) => {
  switch(key) {
    case 'sourceId':
    case 'customer':
    case 'status':
    case 'source': {
      return query[key].length ? [ ...acc, `${key}=${query[key].join(',')}` ]: [ ...acc ];
    };
    case 'updatedDateFrom':
    case 'updatedDateTo': {
      return query[key] ? [ ...acc, `${key}=${query[key].valueOf()}`] : [ ...acc ];
    };
    default: {
      return [ ...acc ];
    }
  }
}, []).join('&');

export const fetchBills = async (businessId, query) => {
  try {
    const params = getBillQueryParamsFromQuery(query);
    const { bills } = await Network.get(BILLS_API_URL(businessId, params));
    return bills;
  } catch (errorMessage) {
    throw errorMessage;
  }
}

export const fetchBillsByCustomer = async (customer, query) => {
  try {
    const params = getBillQueryParamsFromQuery(query);
    const { bills } = await Network.get(CUSTOMER_BILLS_API_URL(customer, params));
    return bills;
  } catch (errorMessage) {
    throw errorMessage;
  }
}

export const getEnrichedBills = (bills, products, orders) => bills.map(item => new Bill(item).enrich(products, orders).get());