import Network from './network';
import { BUSINESSES_API_URL } from '../constants/endpoints';

export const fetchBusinesses = async (businessIds = []) => {
  try {
    const { businesses } = await Network.get(`${BUSINESSES_API_URL}?${businessIds.map(businessId => `businessId=${businessId}`).join('&')}`);
    return businesses
      .sort((prv, nxt) => prv.label.localeCompare(nxt.label));;
  } catch (errorMessage) {
    throw errorMessage
  }
}