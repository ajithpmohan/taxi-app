import axios from 'axios';

class API {
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
    this.sendRequest('POST', '/api/v1/account/token/', {
      email,
      password,
    });

  doSignUpWithEmailAndPassword = (data) =>
    this.sendRequest('POST', '/api/v1/account/sign-up/', data);

  dofetchTrip = (id, accessToken) =>
    this.sendRequest('GET', `/api/v1/trips/${id}/`, null, {
      Authorization: `Bearer ${accessToken}`,
    });
}

export default API;
