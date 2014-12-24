import chai from 'chai';
import spies from 'chai-spies';
import Api from 'app/Api';
import HedgehogsDataSource from 'app/data-sources/HedgehogsDataSource';
import Hedgehog from 'app/data-sources/Hedgehog';

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

  ds.api.list = function() {
    return new Promise(function(resolve, reject) {
      resolve([{
        id: 1,
        name: 'foo',
      }, {
        id: 2,
        name: 'bar',
      }]);
    });
  };

  ds.api.item = function(params) {
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
  };
  return ds;
}

describe('HedgehogsDataSource', () => {

  beforeEach(() => HedgehogsDataSource.cache.clear());



  it('should call some API methods', (done) => {
    var ds = createDataSource();

    ds.getList().then((items) => {
      expect(items).to.have.deep.property('[0].name', 'foo');
      done();
    }).catch(done);
  });

  it('should call the same methods with same params once', (done) => {
    var ds = createDataSource();

    ds.api.list = chai.spy(ds.api.list);

    ds.getList()
      .then(() => ds.getList())
      .then(() => ds.getList({
        foo: 'bar'
      }))
      .then(() => ds.getList({
        foo: 'bar'
      }))
      .then((items) => {
        expect(ds.api.list).to.be.called.exactly(2);
        done();
      })
      .catch(done);
  });


  it('should call item() API method', (done) => {
    var ds = createDataSource();

    ds.get({
      id: 2
    }).then((item) => {
      expect(item).to.have.property('name', 'bar');
      done();
    }).catch(done);
  });


});
