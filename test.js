const test = require('tape');
const strip = require('strip-ansi');
const flamongo = require('./lib/tester');

test('flamongo', function (t) {
  t.plan(1);

  const schema = {
    name: {
      first: 'first',
      last: 'last',
    },
    vegan: 'bool',
    happy: {
      _type: 'bool',
      args: { likelihood: 10 },
    },
    birthday: 'date',
    jobTitle: {
      _type: 'enum',
      options: ['software developer', 'football player'],
    },
    friends: [{
      name: {
        first: 'first',
        last: 'last',
      },
    }],
  };

  const indexKeys = [
    { 'name.last': 1 },
    { 'name.last': 1, vegan: 1 },
    { 'name.first': 1, vegan: 1 },
  ];

  const queries = [
    { 'name.first': 'Richard' },
    { 'name.first': 'John', vegan: false, 'name.last': { $nin: ['Smith'] } }
  ];

  flamongo(indexKeys, queries, schema, { verbose: false, preserveData: false })
    .then((queryResults) => {
      const indexUseRegex = /.*Examined [\d]+ keys on index name.first_1_vegan_1 in a forward direction.*/;
      t.ok(indexUseRegex.test(strip(queryResults[1].output)));
      t.end();
    });
});
