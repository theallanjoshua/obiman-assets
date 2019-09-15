import Credentials from './credentials';

class Network {
  get = async url => {
    try{
      return await this.DO_NOT_USE_fetch(url, 'GET');
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

  DO_NOT_USE_fetch = async (url, method, data) => {
    try {
      const authorization = await Credentials.getAuthorizationToken();
      const params = {
        method,
        mode: 'cors',
        cache: 'no-cache',
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
      const response = await fetch(url, init);
      const { output, errors } = { ...(await response.json()) };
      if(response.ok) {
        return output;
      } else {
        switch(response.status) {
          case 428: {
            throw `Oops! Looks like somebody else beat you to it. Refresh ${errors.join(', ')}, apply your changes and try again!`;
          }
          case 417: {
            throw `Oops! Looks like there isn't enough inventory to create this bill for these ingredients: ${errors.join(', ')}, apply your changes and try again!`;
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