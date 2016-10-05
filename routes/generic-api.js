var express = require('express')
var router = express.Router()

var resources = require('../resources-config')

// -- Search Page -----------------------------------------------------------

/* Search page = GET / */
router.get('/:resource/',
  function (req, res, next) {
    res.render('resource-index', {
      'search': {
        'query': req.query.s,
        'results': [] // TODO
      },
      'resource': resources[req.params.resource]
    })
  })

// -- Search Methods --------------------------------------------------------

/* Search = GET /search */
router.get('/:resource/search',
  function (req, res, next) {
    var collection
    var search_fields = []
    if (resources[req.params.resource].entities) {
      collection = req.db.get(resources[req.params.resource].entities.entry.collection)
      search_fields = resources[req.params.resource].entities.entry.search_fields
    } else {
      collection = req.db.get(req.params.resource)
      search_fields = ['lemma']
    }

    var conditions = {}
    // s param
    if (req.query.hasOwnProperty('s')) {
      let or = []
      for (let i in search_fields) {
        let obj = {}
        obj[search_fields[i]] = new RegExp(req.query.s)
        or.push(obj)
      }
      conditions['$or'] = or
      delete req.query.s
    }
    // any other fields as params
    for (let k in req.query) {
      conditions[k] = new RegExp(req.query[k])
    }

    console.log(conditions)
    collection.find(conditions, function (err, data) {
      if (err) {
        console.error(err)
        return res.status(500).send(err.message)
      }
      res.json(data)
    })
  })

// -- CRUD Methods ----------------------------------------------------------

/* Create = POST / */
/* Content-Type: application/json */
router.post('/:resource',
  // passport.authenticate('basic', {
  //   session: false
  // }),
  function (req, res, next) {
    var collection = req.db.get(req.params.resource)
    collection.insert(req.body, function (err, data) {
      if (err) {
        console.error(err)
        return res.status(500).send(err.message)
      }
      res.json(data)
    })
  })

/* Index = GET / */
// router.get('/:resource/',
//   function (req, res, next) {
//     var collection = req.db.get(req.params.resource)
//     collection.find({}, function (err, data) {
//       if (err) {
//         console.error(err)
//         return res.status(500).send(err.message)
//       }
//       res.json(data)
//     })
//   })

/* Read = GET /:id */
router.get('/:resource/:id',
  function (req, res, next) {
    var collection = req.db.get(req.params.resource)
    collection.findOne(req.params.id, function (err, data) {
      if (err) {
        console.error(err)
        return res.status(500).send(err.message)
      }
      res.json(data)
    })
  })

/* Update = POST /:id */
/* Content-Type: application/json */
/* _id in body should match :id or be omitted (otherwise will fail) */
router.post('/:resource/:id',
  // passport.authenticate('basic', {
  //   session: false
  // }),
  function (req, res, next) {
    var collection = req.db.get(req.params.resource)
    collection.update(req.params.id, req.body, function (err) {
      if (err) {
        console.error(err)
        return res.status(500).send(err.message)
      }
      collection.findOne(req.params.id, function (err, data) {
        if (err) {
          console.error(err)
          return res.status(500).send(err.message)
        }
        res.json(data)
      })
    })
  })

/* Delete = DELETE /:id */
router.delete('/:resource/:id',
  // passport.authenticate('basic', {
  //   session: false
  // }),
  function (req, res, next) {
    var collection = req.db.get(req.params.resource)
    collection.remove(req.params.id, function (err) {
      if (err) {
        console.error(err)
        return res.status(500).send(err.message)
      }
      res.end()
    })
  })

module.exports = router
