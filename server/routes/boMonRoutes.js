const router = require('express').Router();
const ctrl = require('../controllers/boMonController');
const auth = require('../middlewares/authMiddleware');

router.get('/khoa/:khoaId', auth, ctrl.getByKhoa);

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.delete);

module.exports = router;