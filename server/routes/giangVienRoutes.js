const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/giangVienController');
const auth = require('../middlewares/authMiddleware');

router.get('/khoa/:khoaId', auth, ctrl.getByKhoa);
router.get('/bomon/:boMonId', auth, ctrl.getByBoMon);

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.delete);

module.exports = router;