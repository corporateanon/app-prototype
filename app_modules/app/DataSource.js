import t from 'tcomb';
import PromiseCache from 'app/PromiseCache';
import BatchLoader from 'app/BatchLoader';

export default class DataSource {
  constructor(options = {}) {
    var {
      api
    } = options;
    this.api = this.createApiResource(api);
  }

  get cacheTtl() {
    return 60000;
  }
  get createApiResource() {
    abstract();
  }
  get model() {
    abstract();
  }

  get getListDecode() {
    return pass;
  }
  get getItemDecode() {
    return pass;
  }

  createBatchLoader() {
    return new BatchLoader({
      get: this.get.bind(this)
    });
  }

  getList(params = {}) {
    return this.cached(
      'getList',
      params,

      () => this.callApi(this.api.list, params)
      .then(this.getListDecode.bind(this))
      .then(this.assertArray.bind(this))
      .then(this.toModelList.bind(this))
    )
  }

  get(params = {}) {
    return this.cached(
      'get',
      params,

      () => this.callApi(this.api.item, params)
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
    return rawList.map((rawItem) => this.toModel(rawItem));
  }

  toModel(rawItem) {
    return this.model(rawItem);
  }

  cached(staticKey, dynamicKey, fn) {
    var key = `${ staticKey }.${ JSON.stringify(dynamicKey) }`;
    return PromiseCache(this.constructor.cache, key, this.cacheTtl, fn);
  }

  callApi(method, params) {
    return method(params);
  }

  static get cache() {
    abstract();
  }
}


function pass(data) {
  return data;
}

function abstract(data) {
  throw new Error('abstract method');
}
