import chai from 'chai';
import spies from 'chai-spies';
import Api from 'app/Api';
import HedgehogsDataSource from 'test/data-sources/HedgehogsDataSource';
import Hedgehog from 'test/data-sources/Hedgehog';

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

  var items = [
    { id: 1, name: 'one'   },
    { id: 2, name: 'two'   },
    { id: 3, name: 'three' },
    { id: 4, name: 'four'  },
  ];

  ds.api.list = function(params) {
    if(params.ids) {
      return Promise.resolve(items.filter( (item)=> params.ids.indexOf(item.id) !== -1 ));
    } else {
      return Promise.resolve(items);
    }
  };

  ds.api.item = function(params) {
    return Promise.resolve(items.filter( (item)=> item.id === params.id )[0]);
  };
  return ds;
}

describe('HedgehogsDataSource', () => {

  beforeEach(() => HedgehogsDataSource.cache.clear());



  it('should call some API methods', (done) => {
    var ds = createDataSource();

    ds.getList().then((items) => {
      expect(items).to.have.deep.property('[0].name', 'one');
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
      expect(item).to.have.property('name', 'two');
      done();
    }).catch(done);
  });

  it('should load batch items', (done) => {
    var ds = createDataSource();
    ds.api.list = chai.spy(ds.api.list);
    ds.batchLoader
      .load([1, 2])
      .then((items) => {
        expect(items).to.eql({
          '1': {
            id: 1,
            name: 'one'
          },
          '2': {
            id: 2,
            name: 'two'
          }
        });
      })
      .then(() => {
        return ds.batchLoader.load([1, 2]);
      })
      .then(() => {
        return ds.batchLoader
          .load([1, 2, 3])
          .then((items) => {
            expect(ds.api.list).to.be.called.exactly(2);
            expect(ds.api.list).to.be.called.with({ids:[1,2]});
            expect(ds.api.list).to.be.called.with({ids:[3]});

            expect(items).to.eql({
              '1': {
                id: 1,
                name: 'one',
              },
              '2': {
                id: 2,
                name: 'two',
              },
              '3': {
                id: 3,
                name: 'three',
              }
            });

            done();
          });
      })
      .catch(done);
  });


});
