import Network from './network';
import { BUSINESSES_API_URL } from '../constants/endpoints';
import { BUSINESS, EDIT, getPathFromLocation } from '../constants/pages';

export const fetchBusinesses = async (businessIds = []) => {
  try {
    const { businesses } = businessIds.length ? await Network.get(`${BUSINESSES_API_URL}?businessIds=${businessIds.join(',')}`) : { businesses: [] };
    return businesses.sort((prv, nxt) => prv.label.localeCompare(nxt.label));
  } catch (errorMessage) {
    throw errorMessage
  }
}

export const isBusinessPath = (path = getPathFromLocation()) => path.includes(BUSINESS);
export const getBusinessIdFromPath = path => {
  const businessId = isBusinessPath(path) ? path.replace(BUSINESS, '').split('/')[1] || '' : '';
  return `/${businessId}` !== EDIT ? businessId : '';
}
export const getCurrentBusinessId = () => getBusinessIdFromPath(getPathFromLocation());