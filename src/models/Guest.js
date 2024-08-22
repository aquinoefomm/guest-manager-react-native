import Realm from 'realm';

class Guest extends Realm.Object {}
Guest.schema = {
  name: 'Guest',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    present: { type: 'bool', default: false }, // Adicionado
  },
};

export default new Realm({ schema: [Guest.schema] });
