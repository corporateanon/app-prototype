export default class BatchLoader {
  constructor({keyField='ids', cache, get}) {
    this._keyField = keyField;
    this._cache = cache;
    this._getItem = get;
  }


}
