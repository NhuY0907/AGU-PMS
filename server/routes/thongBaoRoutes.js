const router = require('express').Router();
const ctrl = require('../controllers/thongBaoController');
const auth = require('../middlewares/authMiddleware');

router.get('/user/:id', auth, ctrl.getByUser);
router.get('/', auth, ctrl.getAll);
router.post('/', auth, ctrl.create);
router.put('/:id/read', auth, ctrl.markAsRead);

module.exports = router;