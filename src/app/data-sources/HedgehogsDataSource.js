import Hedgehog from './Hedgehog';
import ApiResource from '../ApiResource';
import DataSource from '../DataSource';

export default class HedgehogsDataSource extends DataSource {
  //get
  //getList

  get model() {
    return Hedgehog;
  }

  createApiResource(options) {
    return new ApiResource({
      list: 'GET /hedgehogs',
      item: 'GET /hedgehogs/:id',
      create: 'POST /hedgehogs',
      update: 'PUT /hedgehogs/:id?foo=bar&:hell',
      remove: 'DELETE /hedgehogs/:id',

      difference: 'GET /hedgehogs/diff/:idLeft/:idRight',
      restart: 'POST /hedgehogs/restart/:id',
    }, options);
  }
}
