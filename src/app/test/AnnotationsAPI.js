export var list = API('GET /api/:gameId/annotations');
export var get  = API('GET /api/:gameId/annotations/:id');
export var create  = API('POST /api/:gameId/annotations?:format&:year');

get({gameId:13123, id:120, format:'xml'})

create({
  gameId: 23423,
  name: 34895,
  date: '2000',
  format: 'xml',
});
