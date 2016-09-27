var express = require('express')
var router = express.Router()

const collection_name = 'kaufmann'

/* Overrides default search */
router.get('/search/',
  function (req, res, next) {
    var collection = req.db.get(collection_name)
    collection.find(req.query, function (err, data) {
      if (err) {
        res.status(500).send(err)
      }
      res.json(data)
    })
  })

module.exports = router
