/**
 * Check that specified resource is valid
 */
var config = require('../server-config')

module.exports = function checkResource() {
  return function(req, res, next) {
    var resource = (req.params.resource) ? req.params.resource : req.query.resource
    if (!config.resources.hasOwnProperty(resource)) {
      res.status(401).send("Invalid resource: " + resource)
      return
    }
    next()
  }
}
