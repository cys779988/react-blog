var express = require('express');
var router = express.Router();

const mysqlConnObj = require('../config/mysql');
const mysqlConn = mysqlConnObj.init();
mysqlConnObj.open(mysqlConnObj);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});




module.exports = router;
