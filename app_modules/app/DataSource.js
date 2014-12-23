import t from 'tcomb';
import PromiseCache from 'app/PromiseCache';

export default class DataSource {
  constructor(options) {
    this.apiResource = this.createApiResource(options);
  }

  get cacheTtl() {
    return 60000;
  }
  get createApiResource() {
    return abstract;
  }
  get model() {
    return abstract;
  }

  get getListDecode() {
    return pass;
  }
  get getItemDecode() {
    return pass;
  }

  getList(params = {}) {
    return this.cached(
      'getList',
      params,

      () => this.callApi(this.apiResource.list, params)
      .then(this.getListDecode.bind(this))
      .then(this.assertArray.bind(this))
      .then(this.toModelList.bind(this))
    )
  }

  get(params = {}) {
    return this.cached(
      'get',
      params,

      () => this.callApi(this.apiResource.item, params)
      .then(this.getItemDecode.bind(this))
      .then(this.toModel.bind(this))
    )
  }

  assertArray(data) {
    if (!t.Arr.is(data)) {
      throw new TypeError('Array expected');
    }
    return data;
  }

  toModelList(rawList) {
    return rawList.map((item) => this.model(item));
  }

  toModel(rawItem) {
    return this.model(rawItem);
  }

  cached(staticKey, dynamicKey, fn) {
    var key = `${ this.cacheNamespace }.${ staticKey }.${ JSON.stringify(dynamicKey) }`;
    return PromiseCache(key, this.cacheTtl, fn);
  }

  callApi(method, params) {
    return method(params);
  }
}


function pass(data) {
  return data;
}

function abstract(data) {
  throw new Error('abstract method');
}
