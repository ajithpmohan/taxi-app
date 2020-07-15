import axios from 'axios';

class API {
  constructor() {
    this.rootUrl = 'http://0.0.0.0:9000/api/v1/';
  }

  sendRequest = (
    method,
    path,
    data,
    contentType = 'application/json',
  ) => {
    const config = {
      headers: {
        'content-type': contentType,
      },
    };
    return axios({
      method,
      url: `${this.rootUrl}${path}`,
      data,
      config,
    });
  };

  doSignInWithEmailAndPassword = (email, password) =>
    this.sendRequest('POST', 'account/token/', { email, password });

  doSignUpWithEmailAndPassword = (data, contentType) =>
    this.sendRequest('POST', 'account/sign-up/', data, contentType);

  doSignOut = () => {
    // TODO
  };
}

export default API;
