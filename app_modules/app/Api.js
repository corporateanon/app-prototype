import HttpClientRequest from 'app/HttpClientRequest';

export default function Api(template, options = {}) {
  var client = new HttpClientRequest(template, options);

  var fn = function(params) {
    return client
      .execute(params)
      .then(processHttpResponse, processHttpError);
  }
  fn.displayName = `API: ${template}`;
  return fn;
}


function processHttpResponse(httpResponse) {
  return httpResponse.data;
}

function processHttpError(httpErrorResponse) {
  throw new Error(httpErrorResponse);
}
