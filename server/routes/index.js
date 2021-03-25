var express = require('express');
const app = require('../app');
var router = express.Router();
const PORT = process.env.PORT || 5000;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/host', (req, res) => {
    res.send({host : 'hi'});
})

module.exports = router;
