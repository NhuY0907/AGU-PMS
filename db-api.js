// lightweight in-browser "database" implementation using localStorage
// this is a mock driver so the front-end can work without a real backend

const DatabaseAPI = (function() {
    
    // helpers
    function _get(key) {
        const json = localStorage.getItem(key);
        return json ? JSON.parse(json) : [];
    }
    function _set(key, arr) {
        localStorage.setItem(key, JSON.stringify(arr));
    }
    function _nextId(list) {
        return list.length ? Math.max(...list.map(x => x.ID)) + 1 : 1;
    }

    // table names / storage keys
    const tables = {
        hocKy: 'HOC_KY_NAM_HOC',
        nhiemVu: 'NHIEM_VU',
        khoa: 'KHOA',
        boMon: 'BOMON',
        chucDanh: 'CHUC_DANH',
        giangVien: 'GIANG_VIEN',
        nguoiDung: 'NGUOI_DUNG',
        theoDoiTienDo: 'THEO_DOI_TIEN_DO',
        thongBao: 'THONG_BAO',
        caiDat: 'CAI_DAT',
        lichDay: 'CHI_TIET_GIANG_DAY',  // lịch dạy & công tác
        congTac: 'CHI_TIET_CONG_TAC',    // công tác
        nckh: 'CHI_TIET_NCKH',         // nghiên cứu khoa học
        hopTap: 'CHI_TIET_HOCTAP',      // học tập nâng cao
        phucVuCongDong: 'CHI_TIET_PHUC_VU_CONG_DONG',  // phục vụ cộng đồng
        hoatDongKhac: 'CHI_TIET_HOAT_DONG_KHAC',  // các hoạt động khác
        minhChung: 'MINH_CHUNG', // kho minh chứng
        baoCaoKhoa: 'BAO_CAO_KHOA' // báo cáo khoa
    };

    // public API
    // seed initial data
    if (!_get(tables.hocKy).length) {
        _set(tables.hocKy, [{ID:1, TEN_HOC_KY:'Học kỳ 1', NAM_HOC:'2025-2026'}]);
    }
    // ensure schedule table exists
    if (!_get(tables.lichDay).length) {
        _set(tables.lichDay, []);
    }
    // ensure business travel table exists
    if (!_get(tables.congTac).length) {
        _set(tables.congTac, []);
    }
    // ensure research table exists
    if (!_get(tables.nckh).length) {
        _set(tables.nckh, []);
    }
    // ensure learning/training table exists
    if (!_get(tables.hopTap).length) {
        _set(tables.hopTap, []);
    }
    // ensure community service table exists
    if (!_get(tables.phucVuCongDong).length) {
        _set(tables.phucVuCongDong, []);
    }
    // ensure other activities table exists
    if (!_get(tables.hoatDongKhac).length) {
        _set(tables.hoatDongKhac, []);
    }
    // ensure minh chứng table exists
    if (!_get(tables.minhChung).length) {
        _set(tables.minhChung, []);
    }
    // ensure báo cáo khoa table exists
    if (!_get(tables.baoCaoKhoa).length) {
        _set(tables.baoCaoKhoa, []);
    }

    return {
        getDanhSachHocKy: async function() {
            return _get(tables.hocKy);
        },
        getDanhSachNhiemVu: async function(idHocKy) {
            let list = _get(tables.nhiemVu);
            if (idHocKy) list = list.filter(x => x.ID_HOC_KY == idHocKy);
            return list;
        },
        taoNhiemVu: async function(obj) {
            const arr = _get(tables.nhiemVu);
            obj.ID = _nextId(arr);
            arr.push(obj);
            _set(tables.nhiemVu, arr);
            return { success: true, id: obj.ID };
        },
        capNhatNhiemVu: async function(id, updates) {
            const arr = _get(tables.nhiemVu);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx === -1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.nhiemVu, arr);
            return { success:true };
        },
        getDanhSachKhoa: async function() { return _get(tables.khoa); },
        taoKhoa: async function(name) {
            const arr = _get(tables.khoa);
            const exists = arr.some(x=>x.TEN_KHOA===name);
            if (exists) return { success:false, message:'Tồn tại' };
            arr.push({ ID:_nextId(arr), TEN_KHOA:name });
            _set(tables.khoa, arr);
            return { success:true };
        },
        capNhatKhoa: async function(id, updates) {
            const arr = _get(tables.khoa);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.khoa, arr);
            return { success:true };
        },
        xoaKhoa: async function(id) {
            let arr = _get(tables.khoa);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.khoa, arr);
            return { success:true };
        },
        getDanhSachBoMon: async function(idKhoa) {
            let arr = _get(tables.boMon);
            if (idKhoa) arr = arr.filter(x=>x.ID_KHOA==idKhoa);
            return arr;
        },
        taoBoMon: async function(name, idKhoa) {
            const arr = _get(tables.boMon);
            arr.push({ ID:_nextId(arr), TEN_BO_MON:name, ID_KHOA:idKhoa });
            _set(tables.boMon, arr);
            return { success:true };
        },
        capNhatBoMon: async function(id, updates) {
            const arr = _get(tables.boMon);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.boMon, arr);
            return { success:true };
        },
        xoaBoMon: async function(id) {
            let arr = _get(tables.boMon);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.boMon, arr);
            return { success:true };
        },
        getDanhSachChucDanh: async function() { return _get(tables.chucDanh); },
        taoChucDanh: async function(name, tyle) {
            const arr = _get(tables.chucDanh);
            arr.push({ ID:_nextId(arr), TEN_CHUC_DANH:name, TI_LE_GIAM:tyle });
            _set(tables.chucDanh, arr);
            return { success:true };
        },
        capNhatChucDanh: async function(id, updates) {
            const arr = _get(tables.chucDanh);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.chucDanh, arr);
            return { success:true };
        },
        xoaChucDanh: async function(id) {
            let arr = _get(tables.chucDanh);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.chucDanh, arr);
            return { success:true };
        },
        getDanhSachGiangVien: async function() { return _get(tables.giangVien); },
        taoGiangVien: async function(obj) {
            const arr = _get(tables.giangVien);
            obj.ID = _nextId(arr);
            arr.push(obj);
            _set(tables.giangVien, arr);
            return { success:true };
        },
        capNhatGiangVien: async function(id, updates) {
            const arr = _get(tables.giangVien);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.giangVien, arr);
            return { success:true };
        },
        xoaGiangVien: async function(id) {
            let arr = _get(tables.giangVien);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.giangVien, arr);
            return { success:true };
        },
        getDanhSachNguoiDung: async function() { return _get(tables.nguoiDung); },
        taoNguoiDung: async function(obj) {
            const arr = _get(tables.nguoiDung);
            obj.ID = _nextId(arr);
            arr.push(obj);
            _set(tables.nguoiDung, arr);
            return { success:true };
        },
        capNhatNguoiDung: async function(id, updates) {
            const arr = _get(tables.nguoiDung);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.nguoiDung, arr);
            return { success:true };
        },
        xoaNguoiDung: async function(id) {
            let arr = _get(tables.nguoiDung);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.nguoiDung, arr);
            return { success:true };
        },
        // ===== LỊCH DẠY & CÔNG TÁC =====
        getDanhSachLich: async function(hkId) {
            let arr = _get(tables.lichDay);
            if (hkId) arr = arr.filter(x=>x.ID_HOC_KY==hkId);
            return arr;
        },
        taoLich: async function(entry) {
            const arr = _get(tables.lichDay);
            entry.ID = _nextId(arr);
            arr.push(entry);
            _set(tables.lichDay, arr);
            return { success:true, id: entry.ID };
        },
        capNhatLich: async function(id, updates) {
            const arr = _get(tables.lichDay);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.lichDay, arr);
            return { success:true };
        },
        xoaLich: async function(id) {
            let arr = _get(tables.lichDay);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.lichDay, arr);
            return { success:true };
        },
        // ===== CÔNG TÁC =====
        getDanhSachCongTac: async function(hkId) {
            let arr = _get(tables.congTac);
            if (hkId) arr = arr.filter(x=>x.ID_HOC_KY==hkId);
            return arr;
        },
        taoCongTac: async function(entry) {
            const arr = _get(tables.congTac);
            entry.ID = _nextId(arr);
            arr.push(entry);
            _set(tables.congTac, arr);
            return { success:true, id: entry.ID };
        },
        capNhatCongTac: async function(id, updates) {
            const arr = _get(tables.congTac);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.congTac, arr);
            return { success:true };
        },
        xoaCongTac: async function(id) {
            let arr = _get(tables.congTac);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.congTac, arr);
            return { success:true };
        },
        // ===== NCKH =====
        getDanhSachNckh: async function(hkId) {
            let arr = _get(tables.nckh);
            if (hkId) arr = arr.filter(x=>x.ID_HOC_KY==hkId);
            return arr;
        },
        taoNckh: async function(entry) {
            const arr = _get(tables.nckh);
            entry.ID = _nextId(arr);
            arr.push(entry);
            _set(tables.nckh, arr);
            return { success:true, id: entry.ID };
        },
        capNhatNckh: async function(id, updates) {
            const arr = _get(tables.nckh);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.nckh, arr);
            return { success:true };
        },
        xoaNckh: async function(id) {
            let arr = _get(tables.nckh);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.nckh, arr);
            return { success:true };
        },
        // ===== HỌC TẬP NÂNG CAO =====
        getDanhSachHopTap: async function(hkId) {
            let arr = _get(tables.hopTap);
            if (hkId) arr = arr.filter(x=>x.ID_HOC_KY==hkId);
            return arr;
        },
        taoHopTap: async function(entry) {
            const arr = _get(tables.hopTap);
            entry.ID = _nextId(arr);
            arr.push(entry);
            _set(tables.hopTap, arr);
            return { success:true, id: entry.ID };
        },
        capNhatHopTap: async function(id, updates) {
            const arr = _get(tables.hopTap);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.hopTap, arr);
            return { success:true };
        },
        xoaHopTap: async function(id) {
            let arr = _get(tables.hopTap);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.hopTap, arr);
            return { success:true };
        },
        // ===== PHỤC VỤ CỘNG ĐỒNG =====
        getDanhSachPhucVuCongDong: async function() {
            let arr = _get(tables.phucVuCongDong);
            return arr;
        },
        taoPhucVuCongDong: async function(entry) {
            const arr = _get(tables.phucVuCongDong);
            entry.ID = _nextId(arr);
            arr.push(entry);
            _set(tables.phucVuCongDong, arr);
            return { success:true, id: entry.ID };
        },
        capNhatPhucVuCongDong: async function(id, updates) {
            const arr = _get(tables.phucVuCongDong);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.phucVuCongDong, arr);
            return { success:true };
        },
        xoaPhucVuCongDong: async function(id) {
            let arr = _get(tables.phucVuCongDong);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.phucVuCongDong, arr);
            return { success:true };
        },
        // ===== CÁC HOẠT ĐỘNG KHÁC =====
        getDanhSachHoatDongKhac: async function() {
            let arr = _get(tables.hoatDongKhac);
            return arr;
        },
        taoHoatDongKhac: async function(entry) {
            const arr = _get(tables.hoatDongKhac);
            entry.ID = _nextId(arr);
            arr.push(entry);
            _set(tables.hoatDongKhac, arr);
            return { success:true, id: entry.ID };
        },
        capNhatHoatDongKhac: async function(id, updates) {
            const arr = _get(tables.hoatDongKhac);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.hoatDongKhac, arr);
            return { success:true };
        },
        xoaHoatDongKhac: async function(id) {
            let arr = _get(tables.hoatDongKhac);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.hoatDongKhac, arr);
            return { success:true };
        },
        // ===== MINH CHỨNG =====
        getDanhSachMinhChung: async function(hkId) {
            let arr = _get(tables.minhChung);
            if (hkId) arr = arr.filter(x=>x.ID_HOC_KY==hkId);
            return arr;
        },
        taoMinhChung: async function(entry) {
            const arr = _get(tables.minhChung);
            entry.ID = _nextId(arr);
            arr.push(entry);
            _set(tables.minhChung, arr);
            return { success:true, id: entry.ID };
        },
        capNhatMinhChung: async function(id, updates) {
            const arr = _get(tables.minhChung);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.minhChung, arr);
            return { success:true };
        },
        xoaMinhChung: async function(id) {
            let arr = _get(tables.minhChung);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.minhChung, arr);
            return { success:true };
        },
        // ===== BÁO CÁO KHOA =====
        getDanhSachBaoCaoKhoa: async function(hkId, gvId) {
            let arr = _get(tables.baoCaoKhoa);
            if (hkId) arr = arr.filter(x=>x.ID_HOC_KY==hkId);
            if (gvId) arr = arr.filter(x=>x.ID_GV==gvId);
            return arr;
        },
        taoBaoCaoKhoa: async function(entry) {
            const arr = _get(tables.baoCaoKhoa);
            entry.ID = _nextId(arr);
            arr.push(entry);
            _set(tables.baoCaoKhoa, arr);
            return { success:true, id: entry.ID };
        },
        capNhatBaoCaoKhoa: async function(id, updates) {
            const arr = _get(tables.baoCaoKhoa);
            const idx = arr.findIndex(x=>x.ID==id);
            if (idx===-1) return { success:false };
            Object.assign(arr[idx], updates);
            _set(tables.baoCaoKhoa, arr);
            return { success:true };
        },
        xoaBaoCaoKhoa: async function(id) {
            let arr = _get(tables.baoCaoKhoa);
            arr = arr.filter(x=>x.ID!=id);
            _set(tables.baoCaoKhoa, arr);
            return { success:true };
        },

        capNhatCaiDat: async function(updates) {
            let item = _get(tables.caiDat)[0] || {};
            Object.assign(item, updates);
            _set(tables.caiDat, [item]);
            return { success:true };
        },
        getThongBao: async function() {
            return _get(tables.thongBao);
        }
    };
})();
