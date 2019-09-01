import Network from './network';
import { USERS_API_URL } from '../constants/endpoints';
import { fetchBusinesses } from './businesses';

export const fetchUser = async email => {
  try {
    const user = await Network.get(`${USERS_API_URL}${email}`);
    const businesses = await fetchBusinesses(user.businesses);
    return { ...user, businesses };
  } catch (errorMessage) {
    throw errorMessage;
  }
}