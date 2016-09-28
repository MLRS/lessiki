// Configuration information for each resource
module.exports = {
  kaufmann: {
    name: 'Maltese-German Dictionary',
    authors: ['Wolfgang Kaufmann', 'Uwe Petersen'],
    year: '1996',
    license: 'CC BY-NC-SA'
  },
  minsel: {
    name: 'Minsel Etymological Dictionary',
    authors: ['Martin R. Zammit', 'Saviour Sam Agius', 'Kurstin Gatt'],
    year: '2015–',
    license: null,
    entities: {
      entry: {
        collection: 'minsel.entries',
        search_fields: ['lemma', 'senses.description']
      },
      language: {
        collection: 'minsel.languages'
      },
      reference: {
        collection: 'minsel.references'
      }
    }
  }
}
