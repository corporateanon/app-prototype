import HttpClientRequest from './HttpClientRequest';

export default function Api(template, options = {}) {
  var client = new HttpClientRequest(template, options);

  var fn = function (params) {
    return client.execute(params);
  }
  fn.displayName = `API: ${template}`;
  return fn;
}
