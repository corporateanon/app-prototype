var expect = require('chai').expect;
var Api = require('./src/app/Api')['default'];
var HedgehogsDataSource = require('./src/app/data-sources/HedgehogsDataSource')['default'];
var Hedgehog = require('./src/app/data-sources/Hedgehog')['default'];

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


describe('HedgehogsDataSource', function() {
  it('should call its methods', function(done) {
    var ds = new HedgehogsDataSource();


    ds.apiResource.list = function() {
      return new Promise(function(resolve, reject) {
        resolve({
          data: [{
            id: 1,
            name: 'Otakar',
          }, {
            id: 2,
            name: 'István',
          }]
        });
      });
    }

    ds.getList().then(function() {
      done();
    }, function(err) {
      done(err);
    });
  });
});
