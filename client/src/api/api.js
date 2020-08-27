import axios from 'axios';

class API {
  constructor() {
    this.domain = process.env.REACT_APP_SERVER_DOMAIN;
  }

  sendRequest = (method, path, data) => {
    return axios({
      method,
      url: `http://${this.domain}${path}`,
      data,
    });
  };

  doSignInWithEmailAndPassword = (email, password) =>
    this.sendRequest('POST', '/api/v1/account/token/', { email, password });

  doSignUpWithEmailAndPassword = (data) =>
    this.sendRequest('POST', '/api/v1/account/sign-up/', data);
}

export default API;
