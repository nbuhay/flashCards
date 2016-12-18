var express = require('express');
var router = express.Router();
var mockDataCtrl = require('../controllers/mockDataCtrl');
var userCtrl = require('../controllers/userCtrl');
var deckCtrl = require('../controllers/deckCtrl');

router.get('/mockData', mockDataCtrl.insert);
router.get('/mockData/users', mockDataCtrl.insertUsers);

router.get('/user/name/:userName', userCtrl.findOne);
router.post('/user', userCtrl.newUser);
router.post('/user/:userName/learning/:deck_id', userCtrl.insertLearning);

router.get('/deck/name/:name', deckCtrl.findOne);
router.get('/deck/_id/:_id', deckCtrl.findOneId);

module.exports = router;