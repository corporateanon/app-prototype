var chai = require('chai');
var spies = require('chai-spies');
var Api = require('app/Api')['default'];
var HedgehogsDataSource = require('app/data-sources/HedgehogsDataSource')['default'];
var Hedgehog = require('app/data-sources/Hedgehog')['default'];
var Cache = require('memory-cache');

var expect = chai.expect;
chai.use(spies);

// describe('Api', function() {
//   it('should do a GET request', function(done) {
//     Api('GET /get', {
//       base: 'http://httpbin.org'
//     })({
//       foo: 'bar'
//     }).then(function(res) {
//       expect(res.data).to.equal({
//         foo: 'bar'
//       });
//       done();
//     }, function(err) {
//       done(err);
//     });
//   });
// });


function createDataSource() {
  var ds = new HedgehogsDataSource();
  ds.apiResource.list = function() {
    return new Promise(function(resolve, reject) {
      resolve({
        data: [{
          id: 1,
          name: 'foo',
        }, {
          id: 2,
          name: 'bar',
        }]
      });
    });
  }
  ds.apiResource.item = function(params) {
    console.log('called with params', params);
    return new Promise(function(resolve, reject) {
      resolve({
        data: [{
          id: 1,
          name: 'foo',
        }, {
          id: 2,
          name: 'bar',
        }].filter(function(item) {
          return item.id === params.id;
        })[0]
      });
    });
  }
  return ds;
}

describe('HedgehogsDataSource', function() {
  beforeEach(function() {
    Cache.clear();
  });


  it('should call some API methods', function(done) {
    var ds = createDataSource()

    ds.getList().then(function(items) {
      expect(items).to.have.deep.property('[0].name', 'foo');
      done();
    }).catch(done);
  });

  it('should call the same methods with same params once', function(done) {
    var ds = createDataSource();

    var old = ds.apiResource.list;
    ds.apiResource.list = chai.spy(ds.apiResource.list);

    ds.getList()
      .then(function() {
        return ds.getList();
      })
      .then(function() {
        return ds.getList({
          foo: 'bar'
        });
      })
      .then(function() {
        return ds.getList({
          foo: 'bar'
        });
      })
      .then(function(items) {
        expect(ds.apiResource.list).to.be.called.exactly(2);
        done();
      })
      .catch(done);
  });


  it('should call item() API method', function(done) {
    var ds = createDataSource()

    ds.get({
      id: 2
    }).then(function(item) {
      expect(item).to.have.property('name', 'bar');
      done();
    }).catch(done);
  });


});
