import t from 'tcomb';

export default t.struct({
  id: t.Num,
  name: t.Str,
}, 'Hedgehog');
