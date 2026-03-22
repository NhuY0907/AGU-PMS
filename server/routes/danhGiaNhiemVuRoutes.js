const router = require('express').Router();
const ctrl = require('../controllers/danhGiaNhiemVuController');
const auth = require('../middlewares/authMiddleware');

router.get('/:id', auth, ctrl.getByTask);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);

module.exports = router;