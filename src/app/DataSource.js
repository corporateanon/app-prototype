import t from 'tcomb';
import PromiseCache from './PromiseCache';

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

  getList(params) {
    return this.cached(
      'getList',
      params,

      (params) => this.callApi(this.apiResource.list, params)
      .then(this.getListDecode.bind(this))
      .then(this.assertArray.bind(this))
      .then(this.toModelList.bind(this))
    )
  }

  get(params) {
    return this.invoke(this.apiResource.item(params));
  }

  unwrapHttp(promise) {
    return promise.then(
      this.processHttpResponse.bind(this),
      this.processHttpError.bind(this)
    );
  }

  processHttpResponse(httpErrorResponse) {
    return httpErrorResponse.data;
  }

  processHttpError(httpErrorResponse) {
    return new Error(httpErrorResponse);
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

  toModel(rawList) {
    return this.model(item);
  }

  cached(staticKey, dynamicKey, fn) {
    var key = `${ this.cacheNamespace }.${ staticKey }.${ JSON.stringify(dynamicKey) }`;
    return PromiseCache(key, this.cacheTtl, fn);
  }

  callApi(method, params) {
    return method(params).then(this.processHttpResponse.bind(this), this.processHttpError.bind(this));
  }
}


function pass(data) {
  return data;
}

function abstract(data) {
  throw new Error('abstract method');
}
