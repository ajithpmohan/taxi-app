import axios from 'axios';

class API {
  constructor() {
    this.rootUrl = process.env.REACT_APP_SERVER_URL
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

  doSignUpWithEmailAndPassword = (data) =>
    this.sendRequest('POST', 'account/sign-up/', data);
}

export default API;
