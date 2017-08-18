var express = require('express');
var router = express.Router();

var playerController = require('../controllers/playerController.js');

router.get('/', playerController.create_get);
router.post('/', playerController.create_post);

module.exports = router;
