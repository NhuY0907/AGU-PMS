// ==========================================
// AGU-PMS: QUẢN LÝ NHIỆM VỤ GIẢNG VIÊN
// Tích hợp Database API
// ==========================================

let tasks = [];
let currentUser = null;
let currentSemesterId = null;
// 1. Khởi tạo ứng dụng
async function initApp() {
    // Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        // Chưa đăng nhập - redirect về login page
        // nếu dự án chưa có login page, ta vẫn cho phép tiếp tục
        window.location.href = 'login.html';
        return;
    }

    currentUser = user;
    
    await loadProfile(); 

    // Load danh sách học kỳ
    await loadHocKy();
    
    // Load nhiệm vụ
    await loadNhiemVu();
}
/*
localStorage.setItem("userId", result.User.ID);

function goProfile() {
    document.querySelectorAll(".view").forEach(v => v.style.display = "none");
    document.getElementById("profile-view").style.display = "block";
}
*/
function goProfile() {
    const profile = document.getElementById('profile-view');
    // profile.classList.toggle('open');
    // mở popup
    profile.classList.add("open");

    // Ẩn menu nhỏ khi mở hồ sơ
    document.getElementById('profileMenu').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const avatarInput = document.getElementById("avatarInput");

    if (avatarInput) {
        avatarInput.addEventListener("change", function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function() {
                    document.getElementById("profileAvatar").src = reader.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // Hiển thị tên
    document.getElementById('usernameDisplay').innerText =
        user.hoTen || user.username;

    // Avatar mặc định nếu không có
    const avatarImg = document.getElementById('avatarImg');

    if (user.avatar && user.avatar.trim() !== '') {
        avatarImg.src = user.avatar;
    } else {
        avatarImg.src = 'assets/images/user.jpg';
    }
}

window.addEventListener('load', loadUserInfo);

// Hồ sơ cá nhân
async function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // gọi API lấy thông tin giảng viên
    const res = await DatabaseAPI.getProfile(user.id);

    const gv = res.data;

    document.getElementById('maGV').value = gv.MA_GIANG_VIEN;
    document.getElementById('hoTen').value = gv.HO_TEN;
    document.getElementById('gioiTinh').value = gv.GIOI_TINH;
    document.getElementById('email').value = gv.EMAIL;
    document.getElementById('dienThoai').value = gv.DIEN_THOAI;
    document.getElementById('dinhMuc').value = gv.DINH_MUC_GIO_GOC;
    document.getElementById('nguoidung').value = gv.TEN_DANG_NHAP

    // avatar
    document.getElementById('profileAvatar').src = gv.AVATAR || 'assets/images/user.jpg';

    // load dropdown
    loadDropdowns(gv);
}
async function loadDropdowns(gv) {
    const dsKhoa = await DatabaseAPI.getDanhSachKhoa();
    const dsBoMon = await DatabaseAPI.getDanhSachBoMon();
    const dsChucDanh = await DatabaseAPI.getDanhSachChucDanh();

    const khoaSelect = document.getElementById('khoaSelect');
    const bomonSelect = document.getElementById('bomonSelect');
    const chucDanhSelect = document.getElementById('chucDanhSelect');

    // Khoa
    khoaSelect.innerHTML = dsKhoa.map(k => 
        `<option value="${k.ID}" ${k.ID == gv.ID_KHOA ? 'selected' : ''}>${k.TEN_KHOA}</option>`
    ).join('');

    // Bộ môn
    bomonSelect.innerHTML = dsBoMon.map(b => 
        `<option value="${b.ID}" ${b.ID == gv.ID_BO_MON ? 'selected' : ''}>${b.TEN_BO_MON}</option>`
    ).join('');

    // Chức danh
    chucDanhSelect.innerHTML = dsChucDanh.map(c => 
        `<option value="${c.ID}" ${c.ID == gv.ID_CHUC_DANH ? 'selected' : ''}>${c.TEN_CHUC_DANH}</option>`
    ).join('');
}
async function saveProfile() {
    const user = JSON.parse(localStorage.getItem('user'));

    const data = {
        HO_TEN: document.getElementById('hoTen').value,
        GIOI_TINH: document.getElementById('gioiTinh').value,
        EMAIL: document.getElementById('email').value,
        DIEN_THOAI: document.getElementById('dienThoai').value,
        ID_KHOA: document.getElementById('khoaSelect').value,
        ID_BO_MON: document.getElementById('bomonSelect').value,
        ID_CHUC_DANH: document.getElementById('chucDanhSelect').value
    };

    const res = await DatabaseAPI.updateProfile(user.id, data);

    if (res.success) {
        alert('Cập nhật thành công!');
    } else {
        alert('Lỗi cập nhật!');
    }
}

function openProfile() {
    document.getElementById('profileSidebar').classList.add('open');
}

function closeProfile() {
    document.getElementById('profileSidebar').classList.remove('open');
}

// Cài đặt
function applySettings() {
    const color = document.getElementById('themeColorPicker').value;
    const darkMode = document.getElementById('darkModeToggle').checked;
    const language = document.getElementById('languageSelect').value;
    const emailNotify = document.getElementById('emailNotifyToggle').checked;
    const reminder = document.getElementById('reminderDays').value;

    // Áp dụng UI
    document.documentElement.style.setProperty('--primary', color);

    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Lưu local (demo)
    const settings = {
        color,
        darkMode,
        language,
        emailNotify,
        reminder
    };

    localStorage.setItem('settings', JSON.stringify(settings));

    alert('Đã lưu cài đặt!');

    saveSettingsToServer();
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings'));
    if (!settings) return;

    document.getElementById('themeColorPicker').value = settings.color;
    document.getElementById('darkModeToggle').checked = settings.darkMode;
    document.getElementById('languageSelect').value = settings.language;
    document.getElementById('emailNotifyToggle').checked = settings.emailNotify;
    document.getElementById('reminderDays').value = settings.reminder;

    // apply lại UI
    document.documentElement.style.setProperty('--primary', settings.color);

    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    }
}

window.addEventListener('load', loadSettings);

async function saveSettingsToServer() {
    const user = JSON.parse(localStorage.getItem('user'));

    const data = {
        userId: user.id,
        MAU_CHU_DAO: document.getElementById('themeColorPicker').value,
        CHE_DO_TOI: document.getElementById('darkModeToggle').checked ? 1 : 0,
        NGON_NGU: document.getElementById('languageSelect').value,
        NHAN_THONG_BAO_EMAIL: document.getElementById('emailNotifyToggle').checked ? 1 : 0,
        THO_GIAN_NHAC_TRUOC: document.getElementById('reminderDays').value
    };

    await fetch('http://localhost:3000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('open');
}

// Đăng xuất
function toggleProfileMenu(event) {
    event.stopPropagation(); 

    const menu = document.getElementById('profileMenu');
    menu.style.display =
        (menu.style.display === 'block') ? 'none' : 'block';
}

document.addEventListener('click', function (e) {
    const profile = document.querySelector('.profile');
    const menu = document.getElementById('profileMenu');

    if (!profile.contains(e.target)) {
        menu.style.display = 'none';
    }

    // click ngoài avatar → đóng menu
    if (menu && !e.target.closest('.profile-top')) {
        menu.style.display = 'none';
    }

    // đóng profile view
    const profileView = document.getElementById('profile-view');
    if (
        profileView &&
        profileView.classList.contains('open') &&
        !e.target.closest('#profile-view') &&
        !e.target.closest('.profile-top')
    ) {
        profileView.classList.remove('open');
    }

    // đóng settings
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsBtn = document.getElementById('settingsBtn');

    if (
        settingsPanel &&
        settingsBtn &&
        !settingsPanel.contains(e.target) &&
        !settingsBtn.contains(e.target)
    ) {
        settingsPanel.classList.remove('open');
    }
});

// Logout
function logout() {
    // Xóa session
    localStorage.removeItem('user');

    // Chuyển về login
    window.location.href = 'login.html'; // sửa đúng tên file login của bạn
}

// Chi tiết nhiệm vụ
let currentTaskId = null;
let currentLoai = null;

async function openTaskDetail(id) {
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/nhiemvu/${id}`, {
        headers: { Authorization: 'Bearer ' + token }
    });

    const data = await res.json();

    currentTaskId = data.ID;
    currentLoai = data.TEN_LOAI;

    document.getElementById('ctTenNV').value = data.TEN_NHIEM_VU;
    document.getElementById('ctMoTa').value = data.MO_TA;
    document.getElementById('ctTrangThai').value = data.TRANG_THAI;
    document.getElementById('ctGioQD').value = data.GIO_QUY_DOI;
    document.getElementById('ctHocKy').value = data.TEN_HOC_KY + ' - ' + data.NAM_HOC;
    document.getElementById('ctLoaiNV').value = data.TEN_LOAI;

    document.getElementById('taskModal').style.display = 'block';
}

async function loadKanban() {
    const token = localStorage.getItem('token');

    const res = await fetch('/api/nhiemvu', {
        headers: { Authorization: 'Bearer ' + token }
    });

    const data = await res.json();

    // clear cột
    document.querySelector('#todo .task-list').innerHTML = '';
    document.querySelector('#doing .task-list').innerHTML = '';
    document.querySelector('#done').innerHTML = '<h3>HOÀN THÀNH</h3>';

    data.forEach(task => {
        const card = createTaskCard(task);

        if (task.TRANG_THAI === 'Chưa thực hiện') {
            document.querySelector('#todo .task-list').appendChild(card);
        } else if (task.TRANG_THAI === 'Đang thực hiện') {
            document.querySelector('#doing .task-list').appendChild(card);
        } else {
            document.querySelector('#done').appendChild(card);
        }
    });
}

function editTask() {
    closeTaskModal();

    // mapping loại nhiệm vụ → view
    const map = {
        'Giảng dạy': 'schedule',
        'Công tác': 'schedule',
        'Nghiên cứu khoa học': 'nckh',
        'Học tập nâng cao': 'hoctap',
        'Phục vụ cộng đồng': 'phucvucongdong',
        'Các hoạt động khác': 'hoatdongkhac'
    };

    const view = map[currentLoai];

    // chuyển tab
    showView(view);

    // lưu ID để load lên form
    localStorage.setItem('editTaskId', currentTaskId);
}

async function deleteTask() {
    if (!confirm('Bạn có chắc muốn xóa?')) return;

    await fetch(`/api/nhiemvu/${currentTaskId}`, {
        method: 'DELETE'
    });

    closeTaskModal();

    // reload kanban
    loadKanban();
}

function createTaskCard(task) {
    const div = document.createElement('div');
    div.className = 'task-card';

    div.innerHTML = `
        <div class="task-type">${task.TEN_LOAI}</div>
        <div class="task-title">${task.TEN_NHIEM_VU}</div>
        <button onclick="openTaskDetail(${task.ID})">Chi tiết</button>
    `;

    return div;
}

window.onload = function () {
    loadKanban();
};

document.addEventListener('taskUpdated', loadKanban);

// 2. Load danh sách học kỳ
async function loadHocKy() {
    const danhSachHocKy = await DatabaseAPI.getDanhSachHocKy();
    const semesterSelect = document.getElementById('semesterSelect');
    
    if (semesterSelect) {
        semesterSelect.innerHTML = '<option value="">-- Chọn học kỳ - năm học --</option>';
        
        danhSachHocKy.forEach(hk => {
            const option = document.createElement('option');
            option.value = hk.ID;
            option.textContent = `${hk.tenHocKy} - ${hk.namHoc}`;
            semesterSelect.appendChild(option);
        });
        
        // Nghe sự kiện thay đổi học kỳ
        semesterSelect.addEventListener('change', async (e) => {
            currentSemesterId = e.target.value;
            await loadNhiemVu();
            // nếu đang xem kho minh chứng cũng reload
            const minView = document.getElementById('minhchung-view');
            if (minView && minView.style.display === 'block') {
                loadMinhChung();
            }
            // nếu đang xem báo cáo khoa thì reload
            const bcView = document.getElementById('baocao-view');
            if (bcView && bcView.style.display === 'block') {
                loadBaoCaoKhoa();
            }
        });
    }
}

// 3. Load danh sách nhiệm vụ từ database
async function loadNhiemVu() {
    tasks = await DatabaseAPI.getDanhSachNhiemVu(currentSemesterId);
    document.dispatchEvent(new Event('taskUpdated'));
    updateTotalHours();
}

/*
// 4. Hiển thị danh sách nhiệm vụ lên Kanban
function renderTasks() {
    const columns = ['todo', 'doing', 'done'];
    
    // Ánh xạ trạng thái từ database sang cột
    const statusMap = {
        'ChuaThucHien': 'todo',
        'DangThucHien': 'doing',
        'HoanThanh': 'done'
    };
    
    columns.forEach(colId => {
        const list = document.querySelector(`#${colId} .task-list`);
        if (!list) return;
        list.innerHTML = '';
        
        tasks
            .filter(t => statusMap[t.trangThai] === colId)
            .forEach(task => {
                const card = document.createElement('div');
                card.className = 'task-card';
                card.draggable = true;
                card.id = task.id;
                card.ondragstart = (e) => e.dataTransfer.setData("text", e.target.id);
                card.innerHTML = `
                    <span class="tag">${task.loaiNhiemVu}</span>
                    <p style="margin: 10px 0 5px 0; font-weight: 500;">${task.tenNhiemVu}</p>
                    <small style="color: #666;">Giờ chuẩn: ${task.gioQuyDoi || 0}h</small>
                `;
                list.appendChild(card);
            });
    });
}
*/

// 5. Logic Kéo thả - Cập nhật trạng thái trong database
function allowDrop(ev) { ev.preventDefault(); }

async function drop(ev) {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData("text");
    const targetColumn = ev.target.closest('.column');
    
    if (targetColumn) {
        const colId = targetColumn.id;
        const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
        
        if (taskIndex > -1) {
            const statusMap = {
                'todo': 'ChuaThucHien',
                'doing': 'DangThucHien',
                'done': 'HoanThanh'
            };
            
            const task = tasks[taskIndex];
            task.trangThai = statusMap[colId];
            
            // Cập nhật vào database
            const result = await DatabaseAPI.capNhatNhiemVu(task.id, { 
                trangThai: statusMap[colId] 
            });
            
            if (result.success) {
                document.dispatchEvent(new Event('taskUpdated'));
            }
        }
    }
}

// 6. Tính tổng giờ hoàn thành
function updateTotalHours() {
    const totalDone = tasks
        .filter(t => t.trangThai === 'HoanThanh')
        .reduce((sum, t) => sum + (parseFloat(t.gioQuyDoi) || 0), 0);
    
    const displayElement = document.getElementById("totalTimeDisplay");
    if (displayElement) displayElement.innerText = totalDone.toFixed(1) + ' h';
}

// 7. Lưu nhiệm vụ mới vào database
async function saveTask() {
    const title = document.getElementById("taskTitle").value;
    const category = document.getElementById("taskCategory").value;

    if (!title) {
        alert("Vui lòng nhập tên nhiệm vụ");
        return;
    }

    // Gửi lên database
    const result = await DatabaseAPI.taoNhiemVu({
        tenNhiemVu: title,
        loaiNhiemVu: category,
        trangThai: 'ChuaThucHien',
        idHocKy: currentSemesterId,
        moTa: '',
        gioQuyDoi: 0
    });
    
    if (result.success) {
        // Reload danh sách
        await loadNhiemVu();
        closeModal();
        document.getElementById("taskTitle").value = '';
    } else {
        alert("Lỗi tạo nhiệm vụ");
    }
}

// 8. Mở & đóng Modal
function openModal() {
    const modal = document.getElementById("taskModal");
    if (modal) modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("taskModal");
    if (modal) modal.style.display = "none";
}
// ==============================
// Quản lý các view khác nhau
// ==============================
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    const v = document.getElementById(id + '-view');
    if (v) v.style.display = 'block';

    // update menu active state
    document.querySelectorAll('.sidebar .menu-item').forEach(item => item.classList.remove('active'));
    const activeMenu = document.querySelector(`.sidebar .menu-item[onclick*="'${id}'"]`);
    if (activeMenu) activeMenu.classList.add('active');

    // load dữ liệu cho view mới
    if (id === 'khoa') loadKhoa();
    if (id === 'bomon') loadBoMon();
    if (id === 'chucdanh') loadChucDanh();
    if (id === 'giangvien') loadGiangVien();
    if (id === 'nguoidung') loadNguoiDung();
    if (id === 'baocaokhoa') loadBaoCaoKhoa();
    if (id === 'hoctap') loadHocTapAdmin();
    if (id === 'phucvucongdong') loadPhucVuCongDong();
    if (id === 'hoatdongkhac') loadHoatDongKhac();
    if (id === 'minhchung') loadMinhChung();
    if (id === 'schedule') { loadGiangDay(); loadCongTac(); }
    if (id === 'nckh') loadNckh();
}

// ==== LỊCH DẠY & CÔNG TÁC (USER VIEW) ====
async function loadGiangDay() {
    const currentHk = document.getElementById('semesterSelect')?.value || null;
    const ds = await DatabaseAPI.getDanhSachLich(currentHk);
    const tbody = document.querySelector('#giangdayTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="display:none;">${item.ID_NHIEM_VU || ''}</td>
                <td>${item.MA_HOC_PHAN || ''}</td>
                <td>${item.SO_TIET_THUC_DAY || 0}</td>
                <td>${item.SO_SINH_VIEN || 0}</td>
                <td>${item.LOAI_HINH || ''}</td>
                <td>${item.TRINH_DO || ''}</td>
                <td>${item.ID_HOC_KY || ''}</td>
                <td>
                    <button onclick="editGiangDay(${item.ID_NHIEM_VU})"><i class='fas fa-edit'></i></button>
                    <button onclick="deleteGiangDay(${item.ID_NHIEM_VU})"><i class='fas fa-trash'></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function saveGiangDay() {
    const entry = {
        ID_NHIEM_VU: parseInt(document.getElementById('ctIdNhiemVu').value) || null,
        MA_HOC_PHAN: document.getElementById('ctMaHocPhan').value.trim(),
        SO_TIET_THUC_DAY: parseInt(document.getElementById('ctSoTietThucDay').value) || 0,
        SO_SINH_VIEN: parseInt(document.getElementById('ctSoSinhVien').value) || 0,
        LOAI_HINH: document.getElementById('ctLoaiHinh').value.trim(),
        TRINH_DO: document.getElementById('ctTrinhDo').value.trim(),
        ID_HOC_KY: document.getElementById('ctHocKy').value,
    };
    const res = await DatabaseAPI.taoGiangDay(entry);
    if (res.success) {
        // clear form
        ['ctIdNhiemVu','ctMaHocPhan','ctSoTietThucDay','ctSoSinhVien','ctLoaiHinh','ctTrinhDo','ctHocKy'].forEach(id=>document.getElementById(id).value='');
        loadGiangDay();
        document.dispatchEvent(new Event('taskUpdated'));
    }
}

async function editGiangDay(id) {
    const ds = await DatabaseAPI.getDanhSachGiangDay();
    const item = ds.find(x=>x.ID==id);
    if (!item) return;
    const newNv = prompt('ID nhiệm vụ', item.ID_NHIEM_VU);
    if (newNv!==null) {
        await DatabaseAPI.capNhatGiangDay(id, {ID_NHIEM_VU: parseInt(newNv)});
        loadGiangDay();
    }
}

async function deleteGiangDay(id) {
    if (!confirm('Xác nhận xóa lịch này?')) return;
    await DatabaseAPI.xoaGiangDay(id);
    loadGiangDay();
}

async function loadCongTac() {
    const currentHk = document.getElementById('semesterSelect')?.value || null;
    const ds = await DatabaseAPI.getDanhSachCongTac(currentHk);
    const tbody = document.querySelector('#congtacTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="display:none;">${item.ID_NHIEM_VU || ''}</td>
                <td>${item.DIA_DIEM || ''}</td>
                <td>${item.MUC_DICH || ''}</td>
                <td>${item.QUYET_DINH_SO || ''}</td>
                <td>${item.PHUONG_TIEN || ''}</td>
                <td>${item.NGAY_BAT_DAU || ''}</td>
                <td>${item.NGAY_KET_THUC || ''}</td>
                <td>${item.TONG_KINH_PHI || 0}</td>
                <td>
                    <button onclick="editCongTac(${item.ID_NHIEM_VU})"><i class='fas fa-edit'></i></button>
                    <button onclick="deleteCongTac(${item.ID_NHIEM_VU})"><i class='fas fa-trash'></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function saveCongTac() {
    const entry = {
        ID_NHIEM_VU: parseInt(document.getElementById('ctIdNhiemVu').value) || null,
        DIA_DIEM: document.getElementById('ctDiaDiem').value.trim(),
        MUC_DICH: document.getElementById('ctMucDich').value.trim(),
        QUYET_DINH_SO: document.getElementById('ctQuyetDinhSo').value.trim(),
        PHUONG_TIEN: document.getElementById('ctPhuongTien').value.trim(),
        NGAY_BAT_DAU: document.getElementById('ctNgayBatDau').value,
        NGAY_KET_THUC: document.getElementById('ctNgayKetThuc').value,
        TONG_KINH_PHI: parseFloat(document.getElementById('ctKinhPhi').value) || 0
    };
    const res = await DatabaseAPI.taoCongTac(entry);
    if (res.success) {
        // clear form
        ['ctIdNhiemVu','ctDiaDiem','ctMucDich','ctQuyetDinhSo','ctPhuongTien','ctNgayBatDau','ctNgayKetThuc','ctKinhPhi'].forEach(id=>document.getElementById(id).value='');
        loadCongTac();
        document.dispatchEvent(new Event('taskUpdated'));
    }
}

async function editCongTac(id) {
    const ds = await DatabaseAPI.getDanhSachCongTac();
    const item = ds.find(x=>x.ID==id);
    if (!item) return;
    const newNv = prompt('ID nhiệm vụ', item.ID_NHIEM_VU);
    if (newNv!==null) {
        await DatabaseAPI.capNhatCongTac(id, {ID_NHIEM_VU: parseInt(newNv)});
        loadCongTac();
    }
}

async function deleteCongTac(id) {
    if (!confirm('Xác nhận xóa lịch này?')) return;
    await DatabaseAPI.xoaCongTac(id);
    loadCongTac();
}


function switchScheduleTab(tab) {
    // hide all tabs
    document.getElementById('giangday-tab').style.display = 'none';
    document.getElementById('congtac-tab').style.display = 'none';
    document.getElementById('tab-giangday').style.borderBottom = '3px solid transparent';
    document.getElementById('tab-congtac').style.borderBottom = '3px solid transparent';
    
    // show selected tab
    if (tab === 'giangday') {
        document.getElementById('giangday-tab').style.display = 'block';
        document.getElementById('tab-giangday').style.borderBottom = '3px solid var(--primary)';
        document.getElementById('tab-giangday').style.color = 'var(--primary)';
    } else if (tab === 'congtac') {
        document.getElementById('congtac-tab').style.display = 'block';
        document.getElementById('tab-congtac').style.borderBottom = '3px solid var(--primary)';
        document.getElementById('tab-congtac').style.color = 'var(--primary)';
    }
}

// ==== NGHIÊN CỨU KHOA HỌc ====
async function loadNckh() {
    const currentHk = document.getElementById('semesterSelect')?.value || null;
    const ds = await DatabaseAPI.getDanhSachNckh(currentHk);
    const tbody = document.querySelector('#nckTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="display:none;">${item.ID_NHIEM_VU || ''}</td>
                <td>${item.TEN_SAN_PHAM || ''}</td>
                <td>${item.CAP_QUAN_LY || ''}</td>
                <td>${item.VAI_TRO || ''}</td>
                <td>${item.NGAY_BAT_DAU || ''}</td>
                <td>${item.NGAY_HOAN_THANH || ''}</td>
                <td>
                    <button onclick="editNckh(${item.ID_NHIEM_VU})"><i class='fas fa-edit'></i></button>
                    <button onclick="deleteNckh(${item.ID_NHIEM_VU})"><i class='fas fa-trash'></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function saveNckh() {
    const entry = {
        ID_NHIEM_VU: parseInt(document.getElementById('nckIdNhiemVu').value) || null,
        TEN_SAN_PHAM: document.getElementById('nckTenSanPham').value.trim(),
        CAP_QUAN_LY: document.getElementById('nckCapQuanLy').value,
        VAI_TRO: document.getElementById('nckVaiTro').value,
        NGAY_BAT_DAU: document.getElementById('nckNgayBatDau').value,
        NGAY_HOAN_THANH: document.getElementById('nckNgayHoanThanh').value
    };
    const res = await DatabaseAPI.taoNckh(entry);
    if (res.success) {
        // clear form
        ['nckIdNhiemVu','nckTenSanPham','nckNgayBatDau','nckNgayHoanThanh'].forEach(id=>document.getElementById(id).value='');
        document.getElementById('nckCapQuanLy').value = '';
        document.getElementById('nckVaiTro').value = '';
        loadNckh();
        document.dispatchEvent(new Event('taskUpdated'));
    }
}

async function editNckh(id) {
    const ds = await DatabaseAPI.getDanhSachNckh();
    const item = ds.find(x=>x.ID==id);
    if (!item) return;
    const newNv = prompt('ID nhiệm vụ', item.ID_NHIEM_VU);
    if (newNv!==null) {
        await DatabaseAPI.capNhatNckh(id, {ID_NHIEM_VU: parseInt(newNv)});
        loadNckh();
    }
}

async function deleteNckh(id) {
    if (!confirm('Xác nhận xóa nhiệm vụ này?')) return;
    await DatabaseAPI.xoaNckh(id);
    loadNckh();
}


// ==== QUẢN LÝ KHOA ====
async function loadKhoa() {
    const ds = await DatabaseAPI.getDanhSachKhoa();
    const tbody = document.querySelector('#khoaTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(k => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${k.ID}</td>
                <td>${k.TEN_KHOA}</td>
                <td>
                    <button onclick="editKhoa(${k.ID})">Sửa</button>
                    <button onclick="deleteKhoa(${k.ID})">Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    // cập nhật dropdown chọn khoa cho bộ môn
    const sel = document.getElementById('selectKhoaForBoMon');
    if (sel) {
        sel.innerHTML = '<option value="">-- chọn khoa --</option>';
        ds.forEach(k => sel.insertAdjacentHTML('beforeend', `<option value="${k.ID}">${k.TEN_KHOA}</option>`));
    }
}

async function saveKhoa() {
    const name = document.getElementById('khoaName').value.trim();
    if (!name) return alert('Nhập tên khoa');
    const res = await DatabaseAPI.taoKhoa(name);
    if (res.success) {
        document.getElementById('khoaName').value = '';
        loadKhoa();
        document.dispatchEvent(new Event('taskUpdated'));
    } else {
        alert('Lỗi tạo khoa');
    }
}

async function editKhoa(id) {
    const ds = await DatabaseAPI.getDanhSachKhoa();
    const item = ds.find(k=>k.ID==id);
    if (!item) return;
    const newName = prompt('Tên khoa mới', item.TEN_KHOA);
    if (newName && newName.trim()) {
        await DatabaseAPI.capNhatKhoa(id, {TEN_KHOA: newName.trim()});
        loadKhoa();
    }
}

async function deleteKhoa(id) {
    if (!confirm('Xác nhận xóa khoa này?')) return;
    await DatabaseAPI.xoaKhoa(id);
    loadKhoa();
}

// ==== QUẢN LÝ BỘ MÔN ====
async function loadBoMon() {
    const idKhoa = document.getElementById('selectKhoaForBoMon').value;
    const ds = await DatabaseAPI.getDanhSachBoMon(idKhoa || null);
    const tbody = document.querySelector('#bomonTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(bm => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${bm.ID}</td>
                <td>${bm.TEN_BO_MON}</td>
                <td>${bm.ID_KHOA}</td>
                <td>
                    <button onclick="editBoMon(${bm.ID})">Sửa</button>
                    <button onclick="deleteBoMon(${bm.ID})">Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    const sel2 = document.getElementById('bomonKhoa');
    if (sel2) {
        sel2.innerHTML = '<option value="">-- chọn khoa --</option>';
        const khoaDs = await DatabaseAPI.getDanhSachKhoa();
        khoaDs.forEach(k => sel2.insertAdjacentHTML('beforeend', `<option value="${k.ID}">${k.TEN_KHOA}</option>`));
    }
}

async function saveBoMon() {
    const name = document.getElementById('bomonName').value.trim();
    const idKhoa = document.getElementById('bomonKhoa').value;
    if (!name) return alert('Nhập tên bộ môn');
    if (!idKhoa) return alert('Chọn khoa');
    const res = await DatabaseAPI.taoBoMon(name, parseInt(idKhoa));
    if (res.success) {
        document.getElementById('bomonName').value = '';
        document.getElementById('bomonKhoa').value = '';
        loadBoMon();
        document.dispatchEvent(new Event('taskUpdated'));
    } else {
        alert('Lỗi tạo bộ môn');
    }
}

async function editBoMon(id) {
    const ds = await DatabaseAPI.getDanhSachBoMon();
    const item = ds.find(b=>b.ID==id);
    if (!item) return;
    const newName = prompt('Tên bộ môn mới', item.TEN_BO_MON);
    const newKhoa = prompt('ID khoa mới', item.ID_KHOA);
    if (newName && newName.trim() && newKhoa) {
        await DatabaseAPI.capNhatBoMon(id, {TEN_BO_MON:newName.trim(), ID_KHOA:parseInt(newKhoa)});
        loadBoMon();
    }
}

async function deleteBoMon(id) {
    if (!confirm('Xác nhận xóa bộ môn này?')) return;
    await DatabaseAPI.xoaBoMon(id);
    loadBoMon();
}

// ==== QUẢN LÝ CHỨC DANH ====
async function loadChucDanh() {
    const ds = await DatabaseAPI.getDanhSachChucDanh();
    const tbody = document.querySelector('#chucdanhTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(cd => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cd.ID}</td>
                <td>${cd.TEN_CHUC_DANH}</td>
                <td>${cd.TI_LE_GIAM}</td>
                <td>
                    <button onclick="editChucDanh(${cd.ID})">Sửa</button>
                    <button onclick="deleteChucDanh(${cd.ID})">Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    // cập nhật dropdown giảng viên
    const sel = document.getElementById('gvChucDanh');
    if (sel) {
        sel.innerHTML = '<option value="">-- chọn chức danh --</option>';
        ds.forEach(cd => sel.insertAdjacentHTML('beforeend', `<option value="${cd.ID}">${cd.TEN_CHUC_DANH}</option>`));
    }
}

async function saveChucDanh() {
    const ten = document.getElementById('chucdanhName').value.trim();
    const tyle = parseFloat(document.getElementById('chucdanhTyle').value) || 0;
    if (!ten) return alert('Nhập tên chức danh');
    const res = await DatabaseAPI.taoChucDanh(ten, tyle);
    if (res.success) {
        document.getElementById('chucdanhName').value = '';
        document.getElementById('chucdanhTyle').value = '';
        loadChucDanh();
    } else {
        alert('Lỗi tạo chức danh');
    }
}

async function editChucDanh(id) {
    const ds = await DatabaseAPI.getDanhSachChucDanh();
    const item = ds.find(c=>c.ID==id);
    if (!item) return;
    const newName = prompt('Tên chức danh mới', item.TEN_CHUC_DANH);
    const newTyle = prompt('Tỉ lệ giảm mới (%)', item.TI_LE_GIAM);
    if (newName && newName.trim() && newTyle!==null) {
        await DatabaseAPI.capNhatChucDanh(id, {TEN_CHUC_DANH:newName.trim(), TI_LE_GIAM:parseFloat(newTyle) || 0});
        loadChucDanh();
    }
}

async function deleteChucDanh(id) {
    if (!confirm('Xác nhận xóa chức danh này?')) return;
    await DatabaseAPI.xoaChucDanh(id);
    loadChucDanh();
}

// ==== QUẢN LÝ GIẢNG VIÊN ====
async function loadGiangVien() {
    const ds = await DatabaseAPI.getDanhSachGiangVien();
    const tbody = document.querySelector('#giangvienTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(gv => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${gv.ID}</td><td>${gv.HO_TEN}</td><td>${gv.EMAIL || ''}</td><td>${gv.ID_KHOA || ''}</td><td>${gv.ID_BO_MON || ''}</td><td>${gv.ID_CHUC_DANH || ''}</td><td><button onclick="editGiangVien(${gv.ID})">Sửa</button><button onclick="deleteGiangVien(${gv.ID})">Xóa</button></td>`;
            tbody.appendChild(tr);
        });
    }

    // populate selects
    const khoaDs = await DatabaseAPI.getDanhSachKhoa();
    const bomonDs = await DatabaseAPI.getDanhSachBoMon();
    const chucDanhDs = await DatabaseAPI.getDanhSachChucDanh();

    const selK = document.getElementById('gvKhoa');
    const selB = document.getElementById('gvBoMon');
    const selC = document.getElementById('gvChucDanh');

    if (selK) {
        selK.innerHTML = '<option value="">-- chọn khoa --</option>';
        khoaDs.forEach(k => selK.insertAdjacentHTML('beforeend', `<option value="${k.ID}">${k.TEN_KHOA}</option>`));
        selK.onchange = async () => {
            const list = await DatabaseAPI.getDanhSachBoMon(selK.value || null);
            if (selB) {
                selB.innerHTML = '<option value="">-- chọn bộ môn --</option>';
                list.forEach(b => selB.insertAdjacentHTML('beforeend', `<option value="${b.ID}">${b.TEN_BO_MON}</option>`));
            }
        };
    }
    if (selB) {
        selB.innerHTML = '<option value="">-- chọn bộ môn --</option>';
        bomonDs.forEach(b => selB.insertAdjacentHTML('beforeend', `<option value="${b.ID}">${b.TEN_BO_MON}</option>`));
    }
    if (selC) {
        selC.innerHTML = '<option value="">-- chọn chức danh --</option>';
        chucDanhDs.forEach(c => selC.insertAdjacentHTML('beforeend', `<option value="${c.ID}">${c.TEN_CHUC_DANH}</option>`));
    }
}

async function saveGiangVien() {
    const hoTen = document.getElementById('gvHoTen').value.trim();
    const email = document.getElementById('gvEmail').value.trim();
    const dienThoai = document.getElementById('gvDienThoai').value.trim();
    const idKhoa = document.getElementById('gvKhoa').value;
    const idBoMon = document.getElementById('gvBoMon').value;
    const idChucDanh = document.getElementById('gvChucDanh').value;

    if (!hoTen || !idKhoa || !idBoMon || !idChucDanh) return alert('Nhập đầy đủ thông tin giảng viên');

    const res = await DatabaseAPI.taoGiangVien({
        hoTen, email, dienThoai,
        idKhoa: parseInt(idKhoa),
        idBoMon: parseInt(idBoMon),
        idChucDanh: parseInt(idChucDanh)
    });
    if (res.success) {
        document.getElementById('gvHoTen').value = '';
        document.getElementById('gvEmail').value = '';
        document.getElementById('gvDienThoai').value = '';
        loadGiangVien();
    } else {
        alert('Lỗi tạo giảng viên');
    }
}

async function editGiangVien(id) {
    const ds = await DatabaseAPI.getDanhSachGiangVien();
    const item = ds.find(g=>g.ID==id);
    if (!item) return;
    const newName = prompt('Họ tên mới', item.HO_TEN);
    const newEmail = prompt('Email mới', item.EMAIL || '');
    const newPhone = prompt('Điện thoại mới', item.DIEN_THOAI || '');
    if (newName && newName.trim()) {
        await DatabaseAPI.capNhatGiangVien(id, {
            hoTen: newName.trim(),
            email: newEmail,
            dienThoai: newPhone
        });
        loadGiangVien();
    }
}

async function deleteGiangVien(id) {
    if (!confirm('Xác nhận xóa giảng viên này?')) return;
    await DatabaseAPI.xoaGiangVien(id);
    loadGiangVien();
}

// ==== QUẢN LÝ NGƯỜI DÙNG ====
async function loadNguoiDung() {
    const ds = await DatabaseAPI.getDanhSachNguoiDung();
    const tbody = document.querySelector('#nguoidungTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(nd => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${nd.ID}</td>
                <td>${nd.TEN_DANG_NHAP}</td>
                <td>${nd.VAI_TRO}</td>
                <td>${nd.EMAIL || ''}</td>
                <td>
                    <button onclick="editNguoiDung(${nd.ID})">Sửa</button>
                    <button onclick="deleteNguoiDung(${nd.ID})">Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function saveNguoiDung() {
    const username = document.getElementById('ndUsername').value.trim();
    const password = document.getElementById('ndPassword').value;
    const hoTen = document.getElementById('ndHoTen').value.trim();
    const email = document.getElementById('ndEmail').value.trim();
    if (!username || !password) return alert('Nhập tên đăng nhập và mật khẩu');
    const res = await DatabaseAPI.taoNguoiDung({ username, password, hoTen, email });
    if (res.success) {
        document.getElementById('ndUsername').value = '';
        document.getElementById('ndPassword').value = '';
        document.getElementById('ndHoTen').value = '';
        document.getElementById('ndEmail').value = '';
        loadNguoiDung();
    } else {
        alert('Lỗi tạo người dùng');
    }
}

async function editNguoiDung(id) {
    const ds = await DatabaseAPI.getDanhSachNguoiDung();
    const item = ds.find(n=>n.ID==id);
    if (!item) return;
    const newUser = prompt('Tên đăng nhập mới', item.TEN_DANG_NHAP);
    const newRole = prompt('Vai trò mới', item.VAI_TRO);
    const newEmail = prompt('Email mới', item.EMAIL || '');
    if (newUser && newUser.trim()) {
        await DatabaseAPI.capNhatNguoiDung(id, {
            TEN_DANG_NHAP: newUser.trim(),
            VAI_TRO: newRole,
            EMAIL: newEmail
        });
        loadNguoiDung();
    }
}

async function deleteNguoiDung(id) {
    if (!confirm('Xác nhận xóa người dùng này?')) return;
    await DatabaseAPI.xoaNguoiDung(id);
    loadNguoiDung();
}

// ==== QUẢN LÝ HỌC TẬP NÂNG CAO ====
async function loadHocTap() {
    const ds = await DatabaseAPI.getDanhSachHopTap();
    const tbody = document.querySelector('#hoctapTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="display:none;">${item.ID_NHIEM_VU}</td>
                <td>${item.TEN_KHOA_ || ''}</td>
                <td>${item.CO_SO_DAO_TAO || ''}</td>
                <td>${item.CHUNG_CHI || ''}</td>
                <td>${item.MUC_TIEU || ''}</td>
                <td>${item.NGAY_BAT_DAU || ''}</td>
                <td>${item.NGAY_KET_THUC || ''}</td>
                <td>
                    <button onclick="editHocTap(${item.ID_NHIEM_VU})"><i class='fas fa-edit'></i></button>
                    <button onclick="deleteHocTap(${item.ID_NHIEM_VU})"><i class='fas fa-trash'></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function saveHocTap() {
    const idNV = document.getElementById('htIdNhiemVu').value.trim();
    const tenKhoa = document.getElementById('htTenKhoa').value.trim();
    const coSo = document.getElementById('htCoSo').value.trim();
    const chungChi = document.getElementById('htChungChi').value.trim();
    const mucTieu = document.getElementById('htMucTieu').value.trim();
    const ngayBatDau = document.getElementById('htNgayBatDau').value;
    const ngayKetThuc = document.getElementById('htNgayKetThuc').value;
    
    if (!idNV || !tenKhoa) return alert('Vui lòng nhập ID Nhiệm vụ và tên khóa');
    
    const res = await DatabaseAPI.taoHopTap({
        ID_NHIEM_VU: parseInt(idNV),
        TEN_KHOA: tenKhoa,
        CO_SO_DAO_TAO: coSo,
        CHUNG_CHI: chungChi,
        MUC_TIEU: mucTieu,
        NGAY_BAT_DAU: ngayBatDau,
        NGAY_KET_THUC: ngayKetThuc
    });
    
    if (res.success) {
        document.getElementById('htIdNhiemVu').value = '';
        document.getElementById('htTenKhoa').value = '';
        document.getElementById('htCoSo').value = '';
        document.getElementById('htChungChi').value = '';
        document.getElementById('htMucTieu').value = '';
        document.getElementById('htNgayBatDau').value = '';
        document.getElementById('htNgayKetThuc').value = '';
        loadHocTap();
        document.dispatchEvent(new Event('taskUpdated'));
    } else {
        alert('Lỗi tạo khóa học');
    }
}

async function editHocTap(id) {
    const ds = await DatabaseAPI.getDanhSachHocTap();
    const item = ds.find(x=>x.ID==id);
    if (!item) return;
    const newNv = prompt('ID nhiệm vụ', item.ID_NHIEM_VU);
    if (newNv!==null) {
        await DatabaseAPI.capNhatHocTap(id, {ID_NHIEM_VU: parseInt(newNv)});
        loadHocTap();
    }
}

async function deleteHocTap(id) {
    if (!confirm('Xác nhận xóa khóa học này?')) return;
    await DatabaseAPI.xoaHocTap(id);
    loadHocTap();
}


// ==== QUẢN LÝ PHỤC VỤ CỘNG ĐỒNG ====
async function loadPhucVuCongDong() {
    const ds = await DatabaseAPI.getDanhSachPhucVuCongDong();
    const tbody = document.querySelector('#phucvucongdongTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="display:none;">${item.ID_NHIEM_VU}</td>
                <td>${item.TEN_HOAT_DONG || ''}</td>
                <td>${item.DON_VI_PHOI_HOP || ''}</td>
                <td>${item.VAI_TRO || ''}</td>
                <td>${item.THOI_GIAN_HOAT_DONG || ''}</td>
                <td>
                    <button onclick="editPhucVuCongDong(${item.ID_NHIEM_VU})"><i class='fas fa-edit'></i></button>
                    <button onclick="deletePhucVuCongDong(${item.ID_NHIEM_VU})"><i class='fas fa-trash'></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function savePhucVuCongDong() {
    const idNV = document.getElementById('pvIdNhiemVu').value.trim();
    const tenHoatDong = document.getElementById('pvTenHoatDong').value.trim();
    const donViPhoiHop = document.getElementById('pvDonViPhoiHop').value.trim();
    const vaiTro = document.getElementById('pvVaiTro').value;
    const thoiGianHoatDong = document.getElementById('pvThoiGianHoatDong').value;
    
    if (!idNV || !tenHoatDong) return alert('Vui lòng nhập ID Nhiệm vụ và tên hoạt động');
    
    const res = await DatabaseAPI.taoPhucVuCongDong({
        ID_NHIEM_VU: parseInt(idNV),
        TEN_HOAT_DONG: tenHoatDong,
        DON_VI_PHOI_HOP: donViPhoiHop,
        VAI_TRO: vaiTro,
        THOI_GIAN_HOAT_DONG: thoiGianHoatDong
    });
    
    if (res.success) {
        document.getElementById('pvIdNhiemVu').value = '';
        document.getElementById('pvTenHoatDong').value = '';
        document.getElementById('pvDonViPhoiHop').value = '';
        document.getElementById('pvVaiTro').value = '';
        document.getElementById('pvThoiGianHoatDong').value = '';
        loadPhucVuCongDong();
        document.dispatchEvent(new Event('taskUpdated'));
    } else {
        alert('Lỗi tạo hoạt động');
    }
}

async function editPhucVuCongDong(id) {
    const ds = await DatabaseAPI.getDanhSachPhucVuCongDong();
    const item = ds.find(x=>x.ID==id);
    if (!item) return;
    const newNv = prompt('ID nhiệm vụ', item.ID_NHIEM_VU);
    if (newNv!==null) {
        await DatabaseAPI.capNhatPhucVuCongDong(id, {ID_NHIEM_VU: parseInt(newNv)});
        loadPhucVuCongDong();
    }
}

async function deletePhucVuCongDong(id) {
    if (!confirm('Xác nhận xóa hoạt động này?')) return;
    await DatabaseAPI.xoaPhucVuCongDong(id);
    loadPhucVuCongDong();
}


// ==== QUẢN LÝ CÁC HOẠT ĐỘNG KHÁC ====
async function loadHoatDongKhac() {
    const ds = await DatabaseAPI.getDanhSachHoatDongKhac();
    const tbody = document.querySelector('#hoatdongkhacTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="display:none;">${item.ID_NHIEM_VU}</td>
                <td>${item.NOI_DUNG_CONG_VIEC || ''}</td>
                <td>${item.GHI_CHU || ''}</td>
                <td>
                    <button onclick="editHoatDongKhac(${item.ID_NHIEM_VU})"><i class='fas fa-edit'></i></button>
                    <button onclick="deleteHoatDongKhac(${item.ID_NHIEM_VU})"><i class='fas fa-trash'></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function saveHoatDongKhac() {
    const idNV = document.getElementById('hdkIdNhiemVu').value.trim();
    const noiDungCongViec = document.getElementById('hdkNoiDungCongViec').value.trim();
    const ghiChu = document.getElementById('hdkGhiChu').value.trim();
    
    if (!idNV || !noiDungCongViec) return alert('Vui lòng nhập ID Nhiệm vụ và nội dung công việc');
    
    const res = await DatabaseAPI.taoHoatDongKhac({
        ID_NHIEM_VU: parseInt(idNV),
        NOI_DUNG_CONG_VIEC: noiDungCongViec,
        GHI_CHU: ghiChu
    });
    
    if (res.success) {
        document.getElementById('hdkIdNhiemVu').value = '';
        document.getElementById('hdkNoiDungCongViec').value = '';
        document.getElementById('hdkGhiChu').value = '';
        loadHoatDongKhac();
        document.dispatchEvent(new Event('taskUpdated'));
    } else {
        alert('Lỗi tạo hoạt động');
    }
}

async function editHoatDongKhac(id) {
    const ds = await DatabaseAPI.getDanhSachHoatDongKhac();
    const item = ds.find(x=>x.ID==id);
    if (!item) return;
    const newNv = prompt('ID nhiệm vụ', item.ID_NHIEM_VU);
    if (newNv!==null) {
        await DatabaseAPI.capNhatHoatDongKhac(id, {ID_NHIEM_VU: parseInt(newNv)});
        loadHoatDongKhac();
    }
}

async function deleteHoatDongKhac(id) {
    if (!confirm('Xác nhận xóa hoạt động này?')) return;
    await DatabaseAPI.xoaHoatDongKhac(id);
    loadHoatDongKhac();
}

// ==== KHO MINH CHỨNG ==== 
async function loadMinhChung() {
    const ds = await DatabaseAPI.getDanhSachMinhChung(currentSemesterId);
    const tbody = document.querySelector('#minhchungTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="display:none;">${item.ID_NHIEM_VU}</td>
                <td>${item.TEN_NHIEM_VU || ''}</td>
                <td>${item.TEN_MINH_CHUNG||''}</td>
                <td><a href="${item.DUONG_DAN_URL||''}" target="_blank">${item.DUONG_DAN_URL||''}</a></td>
                <td>${item.NGAY_TAI_LEN||''}</td>
                <td>
                    <button onclick="editMinhChung(${item.ID_NHIEM_VU})"><i class='fas fa-edit'></i></button>
                    <button onclick="deleteMinhChung(${item.ID_NHIEM_VU})"><i class='fas fa-trash'></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Populate nhiệm vụ chưa có minh chứng
    const selectNhiemVu = document.getElementById('mcTenNhiemVu');
    if (selectNhiemVu) {
        // Lấy tất cả nhiệm vụ hiện có
        const allTasks = await DatabaseAPI.getDanhSachNhiemVu(currentSemesterId);
        // Lấy danh sách ID nhiệm vụ đã có minh chứng
        const daCoMinhChung = ds.map(m => m.ID_NHIEM_VU);
        // Lọc nhiệm vụ chưa có minh chứng
        const chuaCoMinhChung = allTasks.filter(t => !daCoMinhChung.includes(t.id || t.ID_NHIEM_VU));
        // Xóa các option cũ
        selectNhiemVu.innerHTML = '<option value="">-- Chọn nhiệm vụ chưa có minh chứng --</option>';
        // Thêm option mới
        chuaCoMinhChung.forEach(t => {
            selectNhiemVu.insertAdjacentHTML('beforeend', `<option value="${t.id || t.ID_NHIEM_VU}">${t.tenNhiemVu || t.TEN_NHIEM_VU}</option>`);
        });
    }
}

// ==== BÁO CÁO KHOA ====
async function loadBaoCaoKhoa() {
    // populate hk select
    const hkSelect = document.getElementById('bcHocKy');
    if (hkSelect) {
        hkSelect.innerHTML = '<option value="">-- Chọn học kỳ --</option>';
        const hks = await DatabaseAPI.getDanhSachHocKy();
        hks.forEach(hk=>{
            const opt = document.createElement('option');
            opt.value = hk.ID;
            opt.textContent = `${hk.TEN_HOC_KY} - ${hk.NAM_HOC}`;
            hkSelect.appendChild(opt);
        });
        if (currentSemesterId) hkSelect.value = currentSemesterId;
    }

    const gvId = document.getElementById('bcIdGV').value.trim() || null;
    const ds = await DatabaseAPI.getDanhSachBaoCaoKhoa(currentSemesterId, gvId);
    const tbody = document.querySelector('#baocaokhoaTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        ds.forEach(item=>{
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="display:none;">${item.ID_GV}</td>
                <td>${item.ID_HOC_KY || ''}</td>
                <td>${item.TEN_BAO_CAO||''}</td>
                <td>${item.LOAI_BAO_CAO||''}</td>
                <td>${item.NGAY_KET_XUAT||''}</td>
                <td><a href="${item.DUONG_DAN_FILE||''}" target="_blank">${item.DUONG_DAN_FILE||''}</a></td>
                <td>${item.TRANG_THAI||''}</td>
                <td>
                    <button onclick="editBaoCao(${item.ID_GV})"><i class='fas fa-edit'></i></button>
                    <button onclick="deleteBaoCao(${item.ID_GV})"><i class='fas fa-trash'></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function saveBaoCaoKhoa() {
    const idGV = document.getElementById('bcIdGV').value.trim();
    const hk = document.getElementById('bcHocKy').value;
    const name = document.getElementById('bcTenBaoCao').value.trim();
    const loai = document.getElementById('bcLoaiBaoCao').value.trim();
    const file = document.getElementById('bcDuongDan').value.trim();
    const trangThai = document.getElementById('bcTrangThai').value;
    if (!idGV || !hk || !name) return alert('Vui lòng nhập ID GV, học kỳ và tên báo cáo');
    const entry = {
        ID_GV: parseInt(idGV),
        ID_HOC_KY: parseInt(hk),
        TEN_BAO_CAO: name,
        LOAI_BAO_CAO: loai,
        DUONG_DAN_FILE: file,
        TRANG_THAI: trangThai,
        NGAY_KET_XUAT: new Date().toISOString().slice(0,19).replace('T',' ')
    };
    const res = await DatabaseAPI.taoBaoCaoKhoa(entry);
    if (res.success) {
        document.getElementById('bcIdGV').value = '';
        document.getElementById('bcTenBaoCaoKhoa').value = '';
        document.getElementById('bcLoaiBaoCaoKhoa').value = '';
        document.getElementById('bcDuongDan').value = '';
        loadBaoCaoKhoa();
    } else {
        alert('Lỗi tạo báo cáo');
    }
}

async function deleteBaoCaoKhoa(id) {
    if (confirm('Xác nhận xóa báo cáo?')) {
        const res = await DatabaseAPI.xoaBaoCaoKhoa(id);
        if (res.success) loadBaoCaoKhoa();
        else alert('Lỗi xóa báo cáo');
    }
}

async function saveMinhChung() {
    const selectNhiemVu = document.getElementById('mcTenNhiemVu');
    const idNhiemVu = selectNhiemVu.value;
    const tenNhiemVu = selectNhiemVu.options[selectNhiemVu.selectedIndex]?.text || '';
    const ten = document.getElementById('mcTenMinhChung').value.trim();
    const url = document.getElementById('mcDuongDan').value.trim();
    if (!idNhiemVu || !ten || !url) return alert('Vui lòng nhập đầy đủ thông tin');
    const entry = {
        ID_NHIEM_VU: parseInt(idNhiemVu),
        TEN_NHIEM_VU: tenNhiemVu,
        TEN_MINH_CHUNG: ten,
        DUONG_DAN_URL: url,
        NGAY_TAI_LEN: new Date().toISOString().slice(0,19).replace('T',' ')
    };
    if (currentSemesterId) entry.ID_HOC_KY = currentSemesterId;
    const res = await DatabaseAPI.taoMinhChung(entry);
    if (res.success) {
        document.getElementById('mcTenNhiemVu').value = '';
        document.getElementById('mcTenMinhChung').value = '';
        document.getElementById('mcDuongDan').value = '';
        loadMinhChung();
    } else {
        alert('Lỗi thêm minh chứng');
    }
}

async function deleteMinhChung(id) {
    if (confirm('Xác nhận xóa?')) {
        const res = await DatabaseAPI.xoaMinhChung(id);
        if (res.success) loadMinhChung();
        else alert('Lỗi xóa minh chứng');
    }
}

// ==========================================
// VOICE RECOGNITION & UI CONTROLS
// ==========================================
const searchInput = document.getElementById('searchInput');
const voiceBtn = document.getElementById('voiceBtn');
const settingsPanel = document.getElementById('settingsPanel');
const themeColorPicker = document.getElementById('themeColorPicker');

const helpPanel = document.getElementById('helpPanel');
const helpBtn = document.getElementById('helpBtn');

let recognition = null;
let isListening = false;

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const r = new SpeechRecognition();
    r.lang = 'vi-VN';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev) => {
        const text = ev.results[0][0].transcript;
        if (searchInput) searchInput.value = text;
    };
    r.onerror = (e) => { console.warn('SpeechRecognition error', e); stopListening(); };
    r.onend = () => { stopListening(); };
    return r;
}

function startListening() {
    if (!recognition) recognition = initSpeechRecognition();
    if (recognition) {
        try {
            recognition.start();
            isListening = true;
            voiceBtn.classList.add('recording');
            voiceBtn.title = 'Đang ghi âm... Nhấn để dừng';
        } catch (err) { console.warn(err); }
        return;
    }
    alert('Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Chrome/Edge mới nhất.');
}

function stopListening() {
    if (recognition && isListening) {
        try { recognition.stop(); } catch (e) {}
    }
    isListening = false;
    if (voiceBtn) {
        voiceBtn.classList.remove('recording');
        voiceBtn.title = 'Ghi âm/Chuyển giọng nói';
    }
}

if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
        if (!isListening) startListening(); else stopListening();
    });
}

function toggleHelp() {
    if (!helpPanel) return;
    const showing = helpPanel.classList.toggle('show');
    helpPanel.setAttribute('aria-hidden', (!showing).toString());
}

// Notification button
const notifBtn = document.getElementById('notifBtn');
if (notifBtn) {
    notifBtn.addEventListener('click', async () => {
        notifBtn.classList.toggle('active');
        
        if (notifBtn.classList.contains('active')) {
            // Load thông báo từ database
            const thongBao = await DatabaseAPI.getThongBao();
            console.log('Thông báo:', thongBao);
            
            if (thongBao.length === 0) {
                setTimeout(() => { 
                    alert('Không có thông báo mới'); 
                    notifBtn.classList.remove('active'); 
                }, 200);
            }
        }
    });
}

document.addEventListener('click', function (e) {
    const btn = e.target.closest('.profile-top');

    if (btn) {
        e.stopPropagation();
        toggleProfileMenu(e);
        return;
    }

    const menu = document.getElementById('profileMenu');
    if (menu) menu.style.display = 'none';
});

// ==========================================
// KHỞI TẠO ỨNG DỤNG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    loadUserInfo();
    loadSettings();
});