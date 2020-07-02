import axios from 'axios';

class API {
  constructor() {
    this.rootUrl = 'http://0.0.0.0:8000/';
  }

  sendRequest = (method, path, data) => {
    return axios({
      method,
      url: `${this.rootUrl}${path}`,
      data,
    });
  };

  doSignInWithEmailAndPassword = (email, password) =>
    this.sendRequest('POST', 'api/token/', { email, password });
}

export default API;
