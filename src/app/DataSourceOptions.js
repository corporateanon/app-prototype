import t from 'tcomb';

const {
  maybe, dict, list, struct, Str, Obj
} = t;


var DataSourceLink = struct({
  source: Obj,
  key: Str,
  kind: Str,
}, 'DataSourceLink');

export default struct({
  listApi: maybe(Str),
  itemApi: maybe(Str),
  linkedSources: maybe(dict(Str, DataSourceLink))
}, 'DataSourceOptions');
