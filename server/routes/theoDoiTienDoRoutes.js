const router = require('express').Router();
const ctrl = require('../controllers/theoDoiTienDoController');
const auth = require('../middlewares/authMiddleware');

router.get('/nhiemvu/:id', auth, ctrl.getByNhiemVu);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);

module.exports = router;