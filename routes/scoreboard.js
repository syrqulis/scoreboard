var express = require('express');
var router = express.Router();

var scoreboardController = require('../controllers/scoreboardController.js');

router.get('/', scoreboardController.create_get);
router.post('/', scoreboardController.create_post);

module.exports = router;
