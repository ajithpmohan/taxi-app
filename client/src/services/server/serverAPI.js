import axios from 'axios';

class ServerAPI {
  constructor() {
    this.domain = process.env.REACT_APP_SERVER_DOMAIN;
  }

  sendRequest = (method, path, data, headers = {}) => {
    return axios({
      method,
      url: `http://${this.domain}${path}`,
      data,
      headers,
    });
  };

  doSignInWithEmailAndPassword = (email, password) =>
    this.sendRequest('POST', '/v1/account/token/', {
      email,
      password,
    });

  doSignUpWithEmailAndPassword = (data) =>
    this.sendRequest('POST', '/v1/account/sign-up/', data);
}

export default ServerAPI;
