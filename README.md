# Lessiki — A generic platform for lexica of Maltese

## Naming

Each dictionary or lexicon is a **resource** with a name e.g. `kaufmann` or `minsel`.

## Generic API

These methods do not need to be implemented for each resource.
They are implemented in `routes/generic-api.js`

| Method | Path                           | Description           | Notes                                                           |
|:-------|:-------------------------------|:----------------------|:----------------------------------------------------------------|
| GET    | `/resources/<resource>/search` | Search                | Use actual field names in query string, e.g. `?lemma=abbanduna` |
| POST   | `/resources/<resource>/`       | Create new entry      |                                                                 |
| GET    | `/resources/<resource>/<id>`   | Read single entry     |                                                                 |
| POST   | `/resources/<resource>/<id>`   | Update existing entry |                                                                 |
| DELETE | `/resources/<resource>/<id>`   | Delete entry          |                                                                 |

## Resource-Specific API

Custom API methods for each resource can be added to the file `resources/<resource>/custom-api.js`.
It should be OK to shadow the methods above, if that's the desired behaviour.

## Pages

| Path                                 | Description       |
|:-------------------------------------|:------------------|
| `/search?resource=<resource>`        | Search            |
| `/index?resource=<resource>&id=<id>` | Show all entries  |
| `/view?resource=<resource>&id=<id>`  | View single entry |
| `/add?resource=<resource>`           | Create new entry  |
| `/edit?resource=<resource>&id=<id>`  | Edit single entry |

## Installing

1. Clone the git repo
1. Install Node modules with `npm install`
1. Create `server-config.js` (you can copy `server-config.sample.js`)
1. Populate database
1. Start with `pm2 start processes.json`
1. Open <http://localhost:3002/>
