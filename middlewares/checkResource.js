/**
 * Check that specified resource is valid
 * Looks for resource first in params, then in search query
 */
var resources = require('../resources-config')

module.exports = function checkResource () {
  return function (req, res, next) {
    var resource = (req.params.resource) ? req.params.resource : req.query.resource
    if (!resources.hasOwnProperty(resource)) {
      res.status(404).send('Invalid resource: ' + resource)
      return
    }
    next()
  }
}
