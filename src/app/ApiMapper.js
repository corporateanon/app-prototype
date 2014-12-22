import t from 'tcomb';

var defaultConfig = null;
/*

{
  baseUrl: 'http://example.com/api',
  httpVerb: 'POST',
  mapping: {
    param1: 'header',
    param2: 'query',
    param3: ['body', 'path'],
  }

}

*/

function merge(defaultConfig, overrideConfig) {
  return Object.assign({}, defaultConfig, overrideConfig);
}

export default class ApiMapper {
  static create(overrideConfig = {}) {
    var config = merge(defaultConfig, overrideConfig);

    return function(params) {
      return HttpApiClient.call(config, params);
    };
  }

  static setDefaultConfig(conf) {
    defaultConfig = conf;
  }
}
