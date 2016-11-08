var express = require('express')
var router = express.Router()

const collection_name = 'petersenkaufmann'

// http://stackoverflow.com/a/1026087/98600
function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/* Overrides default search */
router.get('/search/',
  function (req, res, next) {
    var collection = req.db.get(collection_name)
    var re = new RegExp(req.query.s)
    var re_capit = new RegExp(capitalizeFirstLetter(req.query.s)) // fleisch -> /Fleisch/
    var conditions = {
      '$or': [
        { 'lemma': re },
        { 'definitions.gloss': re },
        { 'definitions.gloss': re_capit }
      ]
    }
    collection.find(conditions, function (err, data) {
      if (err) {
        console.error(err)
        return res.status(500).send(err.message)
      }
      res.json(data)
    })
  })

module.exports = router
