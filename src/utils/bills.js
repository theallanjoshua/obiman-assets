import Network from './network';
import { BILLS_API_URL } from '../constants/endpoints';

export const fetchBills = async (businessId, query) => {
  try {
    const { status, source, updatedDateFrom, updatedDateTo } = query;
    const params = Object.keys(query).reduce((acc, key) => {
      switch(key) {
        case 'status': {
          return status.length ? [ ...acc, `status=${status.join(',')}` ]: [ ...acc ];
        };
        case 'source': {
          return source.length ? [ ...acc, `source=${source.join(',')}` ]: [ ...acc ];
        };
        case 'updatedDateFrom': {
          return updatedDateFrom ? [ ...acc, `updatedDateFrom=${updatedDateFrom.valueOf()}`] : [ ...acc ];
        };
        case 'updatedDateTo': {
          return updatedDateTo ? [ ...acc, `updatedDateTo=${updatedDateTo.valueOf()}`] : [ ...acc ];
        }
        default: {
          return [ ...acc ];
        }
      }
    }, []);
    const { bills } = await Network.get(BILLS_API_URL(businessId, params.join('&')));
    return bills;
  } catch (errorMessage) {
    throw errorMessage;
  }
}