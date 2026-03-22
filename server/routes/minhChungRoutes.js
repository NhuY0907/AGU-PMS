const router = require('express').Router();
const ctrl = require('../controllers/minhChungController');
const auth = require('../middlewares/authMiddleware');

router.get('/nhiemvu/:id', auth, ctrl.getByNhiemVu);

router.get('/', auth, ctrl.getAll);
router.post('/', auth, ctrl.create);
router.delete('/:id', auth, ctrl.delete);

module.exports = router;