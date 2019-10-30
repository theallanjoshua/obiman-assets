import Credentials from './credentials';
import { FILE_API_URL } from '../constants/endpoints';

class Network {
  get = async url => {
    try{
      return await this.DO_NOT_USE_fetch(url);
    } catch (error) {
      throw error;
    }
  }
  post = async (url, data) => {
    try{
      return await this.DO_NOT_USE_fetch(url, 'POST', data);
    } catch (error) {
      throw error;
    }
  }
  put = async (url, data) => {
    try{
      return await this.DO_NOT_USE_fetch(url, 'PUT', data);
    } catch (error) {
      throw error;
    }
  }
  delete = async url => {
    try{
      return await this.DO_NOT_USE_fetch(url, 'DELETE');
    } catch (error) {
      throw error;
    }
  }
  getFile = async s3Key => {
    try {
      return await this.DO_NOT_USE_fetch(`${FILE_API_URL}?operation=getObject&s3Key=${encodeURIComponent(s3Key)}`);
    } catch (error) {
      throw error;
    }
  }
  uploadFile = async file => {
    try {
      const { size, name, type } = file;
      const { url, label, tags } = await this.DO_NOT_USE_fetch(`${FILE_API_URL}?operation=putObject&s3Key=${encodeURIComponent(name)}&size=${size}`);
      const params = {
        method: 'PUT',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': type,
          'x-amz-tagging': tags
        },
        body: file,
        redirect: 'follow',
        referrer: 'no-referrer'
      }
      await fetch(url, params);
      return label;
    } catch (error) {
      throw error;
    }
  }
  DO_NOT_USE_fetch = async (url, method = 'GET', data) => {
    try {
      const authorization = await Credentials.getAuthorizationToken();
      const params = {
        method,
        cache: 'no-cache',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          authorization
        },
        redirect: 'follow',
        referrer: 'no-referrer'
      };
      const body = typeof data === 'string' ? data : JSON.stringify(data);
      const init = data ? { ...params, body } : { ...params };
      const response = await fetch(`${process.env.NODE_ENV !== 'development' ?  'https://api.theobiman.com' : ''}/${url}`, init);
      const { output, errors } = { ...(await response.json()) };
      if(response.ok) {
        return output;
      } else {
        switch(response.status) {
          case 428: {
            throw `Oops! Looks like somebody else beat you to it. Refresh ${errors.join(', ')}, apply your changes and try again!`;
          }
          default: {
            throw errors.join(', ');
          }
        }
      }
    } catch(error) {
      throw error;
    }
  }
}

export default new Network();