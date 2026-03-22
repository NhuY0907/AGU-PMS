const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/caiDatController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, ctrl.getByUser);
router.post('/', auth, ctrl.update);

module.exports = router;