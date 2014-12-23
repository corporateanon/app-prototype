import HttpRequestTemplate from 'app/HttpRequestTemplate';
import HttpClientRequest from 'app/HttpClientRequest';
import Api from 'app/Api';
import ApiResource from 'app/ApiResource';

console.log(new HttpRequestTemplate('PUT /api/example/:id?foo=bar&:hell').apply({
  id: 700,
  hell: 'yeah!',
  crazy: 'stuff',
}));

console.log(new HttpRequestTemplate('/api/example/:id?foo=bar').apply({
  id: 700,
  hell: 'yeah!',
  crazy: 'stuff',
}));


// new HttpClientRequest('PUT /example/:id?foo=bar&:hell')
//   .execute({
//     id: 700,
//     hell: 'yeah!',
//     crazy: 'stuff',
//   })
//   .then(function(httpResponse) {
//     console.info(httpResponse);
//   })
//   .catch(function(httpErrorResponse) {
//     console.warn(httpErrorResponse);
//   });

// Api('PUT /example/:id?foo=bar&:hell')({
//     id: 700,
//     hell: 'yeah!',
//     crazy: 'stuff',
//   })
//   .then(function(httpResponse) {
//     console.info(httpResponse);
//   })
//   .catch(function(httpErrorResponse) {
//     console.warn(httpErrorResponse);
//   });


var exampleResource = new ApiResource({
  list: 'GET /example',
  create: 'POST /example',
  item: 'GET /example/:id',
  remove: 'DELETE /example/:id',
  update: 'PUT /example/:id?foo=bar&:hell',
}, {
  prefix: '/api/v3/fucking/hedgehogs',
});


// exampleResource.list();
debugger
exampleResource.create({
    foo: 'bar',
  })
  .then(function(httpResponse) {
    console.info(httpResponse);
  })
  .catch(function(httpErrorResponse) {
    console.warn(httpErrorResponse);
  });
