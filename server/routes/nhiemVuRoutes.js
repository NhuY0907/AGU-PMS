const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/nhiemVuController');
const auth = require('../middlewares/authMiddleware');

router.get('/giangvien/:gvId', auth, ctrl.getByGiangVien);

router.get('/hocky/:hocKyId', auth, ctrl.getByHocKy);

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.delete);

router.post('/tinh-gio', ctrl.tinhGio);

router.post('/tien-do', ctrl.capNhatTienDo);

module.exports = router;