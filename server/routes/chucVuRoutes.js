const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/chucVuController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.delete);

module.exports = router;