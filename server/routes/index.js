const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
/*
router.use('/nguoidung', require('./nguoiDungRoutes'));
router.use('/giangvien', require('./giangVienRoutes'));
router.use('/khoa', require('./khoaRoutes'));
router.use('/bomon', require('./boMonRoutes'));
router.use('/chucvu', require('./chucVuRoutes'));
router.use('/chucdanh', require('./chucDanhRoutes'));
router.use('/hockynamhoc', require('./hocKyNamHocRoutes'));
router.use('/loainhiemvu', require('./loaiNhiemVuRoutes'));
router.use('/nhiemvu', require('./nhiemVuRoutes'));
router.use('/minhchung', require('./minhChungRoutes'));
router.use('/baocaokhoa', require('./baoCaoKhoaRoutes'));
router.use('/caidat', require('./caiDatRoutes'));
router.use('/thongbao', require('./thongBaoRoutes'));
router.use('/theodoitiendo', require('./theoDoiTienDoRoutes'));
router.use('/danhgianhiemvu', require('./danhGiaNhiemVuRoutes'));
router.use('/chitietgiangday', require('./chiTietGiangDayRoutes'));
router.use('/chitietcongtac', require('./chiTietCongTacRoutes'));
router.use('/chitietnckh', require('./chiTietNCKHRoutes'));
router.use('/chitiethoctap', require('./chiTietHocTapRoutes'));
router.use('/chitietphucvu', require('./chiTietPhucVuCongDongRoutes'));
router.use('/chitiethoatdongkhac', require('./chiTietHoatDongKhacRoutes'));
*/
module.exports = router;