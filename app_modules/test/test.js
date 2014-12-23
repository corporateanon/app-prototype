import chai from 'chai';
import spies from 'chai-spies';
import Api from 'app/Api';
import HedgehogsDataSource from 'app/data-sources/HedgehogsDataSource';
import Hedgehog from 'app/data-sources/Hedgehog';
import Cache from 'memory-cache';

var {
  expect
} = chai;
chai.use(spies);

describe('Api', function() {
  it('should do a GET request', function(done) {
    Api('GET /get', {
      base: 'http://httpbin.org'
    })({
      foo: 'bar'
    }).then(function(res) {
      expect(res.args).to.eql({
        foo: 'bar'
      });
      done();
    }).catch(function(err) {
      done(err);
    });
  });
});


function createDataSource() {
  var ds = new HedgehogsDataSource();

  ds.apiResource.list = function() {
    return new Promise(function(resolve, reject) {
      resolve([{
        id: 1,
        name: 'foo',
      }, {
        id: 2,
        name: 'bar',
      }]);
    });
  }

  ds.apiResource.item = function(params) {
    return new Promise(function(resolve, reject) {
      resolve([{
        id: 1,
        name: 'foo',
      }, {
        id: 2,
        name: 'bar',
      }].filter(function(item) {
        return item.id === params.id;
      })[0]);
    });
  }
  return ds;
}

describe('HedgehogsDataSource', () => {

  beforeEach(() => HedgehogsDataSource.cache.clear());



  it('should call some API methods', (done) => {
    var ds = createDataSource()

    ds.getList().then((items) => {
      expect(items).to.have.deep.property('[0].name', 'foo');
      done();
    }).catch(done);
  });

  it('should call the same methods with same params once', (done) => {
    var ds = createDataSource();

    ds.apiResource.list = chai.spy(ds.apiResource.list);

    ds.getList()
      .then(() => ds.getList())
      .then(() => ds.getList({
        foo: 'bar'
      }))
      .then(() => ds.getList({
        foo: 'bar'
      }))
      .then((items) => {
        expect(ds.apiResource.list).to.be.called.exactly(2);
        done();
      })
      .catch(done);
  });


  it('should call item() API method', (done) => {
    var ds = createDataSource()

    ds.get({
      id: 2
    }).then((item) => {
      expect(item).to.have.property('name', 'bar');
      done();
    }).catch(done);
  });


});
