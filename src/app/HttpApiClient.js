import http from 'axios';

/*
  url: '/user',
  method: 'get', // default
  transformRequest: [function (data) {
    return data;
  }],
  transformResponse: [function (data) {
    return data;
  }],

  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `param` are the URL parameters to be sent with the request
  params: {
    ID: 12345
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // When no `transformRequest` is set, must be a string, an ArrayBuffer or a hash
  data: {
    firstName: 'Fred'
  },

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default

  // `responseType` indicates the type of data that the server will respond with
  // options are 'arraybuffer', 'blob', 'document', 'json', 'text'
  responseType: 'json', // default

  // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN' // default
*/



export default class HttpApiClient {
  static createRequest(config, params) {
    var mapping = config.mapping || {};
    Object.keys(params).reduce(((parts, paramName) => {
      let targetParts = mapping[paramName] || [];
      for (let partName of targetParts) {
        parts[partName] = params[paramName];
      }
      return parts;
    }), {
      headers: {},
      query: {},
      body: {},
      path: {},
    });
  }

  static call(config, params) {
    var httpRequest = this.createRequest(config, params);
  }
}


