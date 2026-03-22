const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/chiTietPhucVuCongDongController');
const auth = require('../middlewares/authMiddleware');

router.get('/:id_nhiem_vu', auth, ctrl.getByNhiemVu);

router.post('/', auth, ctrl.create);
router.put('/:id_nhiem_vu', auth, ctrl.update);
router.delete('/:id_nhiem_vu', auth, ctrl.delete);

module.exports = router;