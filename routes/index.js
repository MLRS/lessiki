var express = require('express')
var router = express.Router()
var fs = require('fs')
var async = require('async')
// var passport = require('passport')
// var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
// var ensureLoggedIn = require('../middlewares/ensureLoggedIn')
var checkResource = require('../middlewares/checkResource')
var config = require('../server-config')
var resources = require('../resources-config')
var marked = require('marked')

// -- Main pages -------------------------------------------------------------

/* Home page */
router.get('/', function (req, res, next) {
  res.render('index', {
    resources: resources
  })
})

/* Readme */
router.get('/readme', function (req, res, next) {
  fs.readFile('README.md', 'utf8', function (err, data) {
    if (err) data = ''
    var content = marked(data)
    content = content.replace(/<table>/g, '<table class="table">')
    res.render('page', {
      content: content
    })
  })
})

/* Load stuff we need for add/edit */
var add_edit = function (req, res, next, params) {
  var entity = req.query.entity ? req.query.entity : 'entry'
  var schema_file = 'resources/' + req.query.resource + '/schemas/' + entity + '.json'
  async.parallel({
    schema: function (callback) {
      fs.readFile(schema_file, 'utf8', function (err, data) {
        if (err) data = '{}'
        callback(err, data)
      })
    }},

    // All tasks done
    function (err, data) {
      if (err) {
        console.log(err)
      }
      res.render('edit', {
        title: params.title,
        resource: req.query.resource,
        schema: data.schema,
        id: params.id
      })
    }
  )
}

/* Search, potentially in multiple resources */
router.get('/search',
  function (req, res, next) {
    res.render('search', {
      'search': {
        'query': req.query.s,
        'resources': req.query.resource ?  req.query.resource : []
      },
      'resources': resources
    })
  }
)

/* Add new entry */
router.get('/add',
  // ensureLoggedIn(config.baseURL+'/login'),
  checkResource(),
  function (req, res, next) {
    add_edit(req, res, next, {
      'title': 'New entry',
      'id': null
    })
  }
)

/* Edit entry */
router.get('/edit',
  // ensureLoggedIn(config.baseURL+'/login'),
  checkResource(),
  function (req, res, next) {
    add_edit(req, res, next, {
      'title': 'Edit entry',
      'id': req.query.id
    })
  }
)

// -- Login stuff ------------------------------------------------------------

// /* GET login */
// router.get('/login',
//   function (req, res, next) {
//     res.render('login', {
//       title: 'Login',
//       messages: req.flash()
//     })
//   }
// )
//
// /* POST login */
// router.post('/login',
//   passport.authenticate('local', {
//     successReturnToOrRedirect: config.baseURL+'/', // Allows redirection to original dest
//     failureRedirect: config.baseURL+'/login',
//     failureFlash: true
//   }),
//   function(req, res) {
//     res.redirect(config.baseURL+'/')
//   }
// )
//
// /* GET logout */
// router.get('/logout',
//   function (req, res) {
//     req.logout()
//     res.redirect(config.baseURL+'/')
//   }
// )

module.exports = router
