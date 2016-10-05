// Configuration information for each resource
module.exports = {
  kaufmann: {
    name: 'Maltese-German Dictionary',
    description: '',
    authors: ['Wolfgang Kaufmann', 'Uwe Petersen'],
    year: '1996',
    license: 'CC BY-NC-SA'
  },
  minsel: {
    name: 'Minsel Etymological Dictionary',
    description: 'Minsel is a new etymological dictionary for Maltese, being compiled by researchers at the Department of Oriental Studies at the University of Malta. There\'s currently not much here, but new entries are being added slowly.',
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
