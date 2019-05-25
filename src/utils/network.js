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
    const params = {
      method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      referrer: 'no-referrer'
    };
    const body = typeof data === 'string' ? data : JSON.stringify(data);
    const init = data ? { ...params, body } : { ...params };
    try {
      const response = await fetch(url, init);
      if(response.ok) {
        return response.json();
      } else {
        throw response.statusText;
      }
    } catch(error) {
      throw error;
    }
  }
}

export default new Network();