var express = require('express');
var router = express.Router();

var golferController = require('../controllers/golferController.js');

router.get('/', golferController.create_get);
router.post('/', golferController.create_post);

module.exports = router;
