import axios from 'axios';

class API {
  constructor() {
    this.rootUrl = 'http://0.0.0.0:9000/api/v1/';
  }

  sendRequest = (method, path, data) => {
    return axios({
      method,
      url: `${this.rootUrl}${path}`,
      data,
    });
  };

  doSignInWithEmailAndPassword = (email, password) =>
    this.sendRequest('POST', 'account/token/', { email, password });

  doSignOut = () => {
    // TODO
  };
}

export default API;
