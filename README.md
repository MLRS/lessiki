# Lessiki — A platform for lexica of the Maltese language

## Resources

- Each dictionary or lexicon is a **resource** with a name e.g. `kaufmann` or `minsel`
- Configuration info for each resource is maintained in `resources-config.js`
- Each resource can have multiple **entities**, where the default one is named **entry**.
- Each entity corresponds to a collection in the database:
  - For single-entity resources, a default collection is assumed with the same name as resource, e.g. `kaufmann`
  - For multi-entity resources, collection names should be specified in `resources-config.js`, e.g.:
  ```js
  minsel: {
      ...,
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
  ```
- JSON schemas must be specified for each entity, e.g. `resources/minsel/entry.json`, `resources/minsel/schemas/language.json` etc.

## Generic API

These methods do not need to be implemented for each resource.
They are implemented in `routes/generic-api.js`

| Method | Path                           | Description           | Notes                                                                                                                                                                                                                                       |
|:-------|:-------------------------------|:----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GET    | `/resources/<resource>/search` | Search                | Supports `s` parameter which translates to fields in `entities.entry.search_fields` when present, else just the `lemma` field.<br/>Explicit field names also supported, e.g. `?definitions.gloss=Fleisch`<br/>Values are substring-matched. |
| POST   | `/resources/<resource>/`       | Create new entry      |                                                                                                                                                                                                                                             |
| GET    | `/resources/<resource>/<id>`   | Read single entry     |                                                                                                                                                                                                                                             |
| POST   | `/resources/<resource>/<id>`   | Update existing entry |                                                                                                                                                                                                                                             |
| DELETE | `/resources/<resource>/<id>`   | Delete entry          |                                                                                                                                                                                                                                             |

## Resource-Specific API

Custom API methods for each resource can be added to the file `resources/<resource>/custom-api.js`.
In this way it is possible to shadow the methods above.
Note that the `search` command should at least support the `s` query parameter.

## Pages

| Path      | Query parameters             | Description                                                   |
|:----------|:-----------------------------|:--------------------------------------------------------------|
| `/search` | `resource`*, `s`             | Search. `resource` can be specified multiple times.           |
| `/index`  | `resource`, `id`             | Show all entries                                              |
| `/view`   | `resource`, `id`             | View single entry                                             |
| `/add`    | `resource`, [`entity`]       | Create new entry. If ommitted, `entity` defaults to `entry`.  |
| `/edit`   | `resource`, [`entity`], `id` | Edit single entry. If ommitted, `entity` defaults to `entry`. |

## Installing

1. Clone the git repo
1. Install Node modules with `npm install`
1. Create `server-config.js` (you can copy `server-config.sample.js`)
1. Populate database
1. Start with `pm2 start processes.json`
1. Open <http://localhost:3002/>

## Users

Example document:

```json
{
  "username" : "...",
  "password" : "...",
  "access" : ["kaufmann", "minsel"]
}
```

Where
 - `password` is an SHA-1 hash of your salted password
 - `access` can also be `"all"` instead of a list
