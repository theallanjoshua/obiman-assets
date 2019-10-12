import Network from './network';
import { FILE_API_URL } from '../constants/endpoints';

export const fetchS3Object = async s3Key => await Network.get(FILE_API_URL(s3Key));