var express = require('express')
var router = express.Router()

// -- Search Methods --------------------------------------------------------

/* Search = GET /search */
router.get('/:resource/search/',
  function (req, res, next) {
    var collection = req.db.get(req.params.resource)
    // TODO: handle regex or by default make everything substring
    // TODO: handle unicode querystring
    collection.find(req.query, function (err, data) {
      if (err) {
        res.status(500).send(err)
      }
      res.json(data)
    })
  })

// -- CRUD Methods ----------------------------------------------------------

/* Create = POST / */
/* Content-Type: application/json */
router.post('/:resource/',
  // passport.authenticate('basic', {
  //   session: false
  // }),
  function (req, res, next) {
    var collection = req.db.get(req.params.resource)
    collection.insert(req.body, function (err, data) {
      if (err) {
        res.status(500).send(err)
      }
      res.json(data)
    })
  })

/* Index = GET / */
router.get('/:resource/',
  function (req, res, next) {
    var collection = req.db.get(req.params.resource)
    collection.find({}, function (err, data) {
      if (err) {
        res.status(500).send(err)
      }
      res.json(data)
    })
  })

/* Read = GET /:id */
router.get('/:resource/:id',
  function (req, res, next) {
    var collection = req.db.get(req.params.resource)
    collection.findOne(req.params.id, function (err, data) {
      if (err) {
        res.status(500).send(err)
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
        res.status(500).send(err)
      }
      collection.findOne(req.params.id, function (err, data) {
        if (err) {
          res.status(500).send(err)
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
        res.status(500).send(err)
      }
      res.end()
    })
  })

module.exports = router
