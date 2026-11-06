/* =========================================================================
   Quy trình 2: Tính học phí
   Bản gốc: ApisTaiChinh/Modules/dulieuhocphi/scripts/tinhhocphi.js
   ---------------------------------------------------------------------------
   Nguồn ô chọn (xem _chung.js):
       pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao / LayDSKS_DaoTao_KhoaDaoTao /
       LayDSKS_DaoTao_LopQuanLy                   (ums.ref, tham số như gốc)
       CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao    GET
       DKH_KeHoachDangKy/LayDSKeHoachTheoThoiGian      GET, khi đổi thời gian
       TC_TinhTien/LayDSKhoanPhiTheoNghiepVu           GET, khi đổi nghiệp vụ
       danh mục QLTC.NVAP                              nghiệp vụ áp dụng
       CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI     trạng thái sinh viên
       TC_NguoiHoc_HoSo/LayDanhSach                    sinh viên của lớp (chọn từng SV)
   Tác vụ:
       TC_HangDoi/PTaoHangDoi_TinhPhi_TuDong           POST, tạo hàng đợi "Tính phí"
       ums.queue (TINHPHITUDONG)                       chạy tiến trình + lịch sử
       TC_KetQuaDaTinhPhi/LayDanhSach                  GET, kết quả theo tín chỉ
       TC_KetQuaDaTinhPhi_NC/LayDanhSach               GET, theo niên chế — VÀ chi tiết
                                                        một SV (bản gốc dùng chung, giữ nguyên)
       TC_KetQuaDaTinhPhi/Xoa                          POST, "Xóa kết quả"
       ums.report (getList_MauImport)                  báo cáo
   Tab "Danh sách không tính phí":
       PKG_TAICHINH_THUCHI2.LayDSTC_NghiepVu_Chot_Phi  danh sách
       PKG_TAICHINH_THUCHI2.Them_TC_NghiepVu_Chot_Phi  thêm (dPhanTram = 100), từ hộp chọn SV
       PKG_TAICHINH_THUCHI2.Sua_TC_NghiepVu_Chot_Phi   lưu % đã sửa trong ô
       PKG_TAICHINH_THUCHI2.Xoa_TC_NghiepVu_Chot_Phi   xoá từng dòng
       ums.report.importChung IMPORTWITHPROC_NVCHOTPHI "Import chốt phí"

   Khác bản gốc, có chủ đích:
     · Nút "Import chốt phí" của bản gốc KHÔNG chạy được (sự kiện gắn vào
       #zonebtnBaoCao_THP_Import — không tồn tại). Ở đây nối vào
       ums.report.importChung đúng mã IMPORTWITHPROC_NVCHOTPHI.
     · Dòng tổng bảng niên chế: bản gốc cộng cột [8,10,11] — chép từ màn có
       4 cột tiền nên ở đây rơi vào "miễn cố định" và bỏ sót "số phải nộp".
       Ở đây cộng đủ mọi cột tiền, không cộng cột %.
     · Bảng chi tiết: bản gốc có 9 tiêu đề nhưng 8 cột (thiếu "Số tiền miễn",
       số phải nộp nằm dưới tiêu đề "Số tiền miễn"). Ở đây hiện đủ; số phải
       nộp vẫn = parseInt(SOTIEN) − parseInt(SOTIENMIEN).
     · Tab "không tính phí" chỉ nạp khi mở tab / bấm Tải lại (bản gốc chỉ nạp
       khi bấm Tải lại).
   Kéo gốc lần 12–13 (7/11) — form tiến trình chung (gốc Corei/processrun.js edu.process → ums.process):
     · "Tính phí" vẫn hỏi lại rồi tạo hàng đợi (1 lời gọi, như gốc); nút "Bắt đầu" của hàng đợi nay chạy từng
       nhiệm vụ TRONG form tiến trình (ums.queue.mount { process }) — giờ bắt đầu / kết thúc, kết quả, xuất Excel.
     · "Xóa kết quả" → ums.process.runJob (Bước 1 hiện phạm vi thay hộp hỏi lại).
     · Không tính phí: Thêm (mỗi SV một bản ghi, miễn 100%), Lưu % đã sửa (cột % cũ / % mới), Xóa đã chọn
       → ums.process.run với cột Mã số / Họ tên / … thay ui.batch.
     · Nút "Xuất Excel" cạnh ba bảng kết quả (gốc edu.exporter.attachTable → ums.ui.xuatBang) kèm dòng điều kiện.
   Bỏ: loadProgressBar, proSeq…, genHTML_HangDoi (mã chết — hàng đợi do
   ums.queue lo), fakedb, ô txtTuKhoa_Search / dropSearch_ChuongTrinh_PT
   không tồn tại (gửi chuỗi rỗng như bản gốc).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, H = ums.hocphi, esc = ui.esc;
    var root = document.getElementById('tinhhocphi');

    /* ---------- Khung ------------------------------------------------------ */
    root.innerHTML =
        '<div class="ums-page__head">' +
            '<h1 class="ums-page__title ums-u-mb-0">Tính học phí</h1>' +
            '<div class="ums-page__actions"><span data-z="report"></span></div>' +
        '</div>' +
        '<div data-z="main">' +
            '<div class="ums-grid ums-grid--2 ums-u-mb-4">' +
                '<div><div class="ums-panel">' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-calculator"></i> Quy trình 2: Tính học phí</div></div>' +
                    '<div class="ums-panel__body ums-filter hp-cond">' +
                        H.selField('thpHe', 'Hệ đào tạo', { head: '-- Chọn hệ đào tạo --' }) +
                        H.selField('thpKhoa', 'Khóa đào tạo', { head: '-- Chọn khóa đào tạo --' }) +
                        H.selField('thpLop', 'Lớp đào tạo', { multiple: true }) +
                        ui.field('Sinh viên',
                            '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-a="svtoggle"><i class="fa-light fa-users"></i><span>Chọn theo từng sinh viên</span></button>' +
                            '<div data-z="sv" hidden class="ums-u-mt-2 hp-svbox"></div>', { inline: true, labelWidth: '170px' }) +
                        H.selField('thpThoiGian', 'Thời gian đào tạo', { multiple: true }) +
                        H.selField('thpKeHoach', 'Kế hoạch đăng ký', { multiple: true }) +
                        H.selField('thpNghiepVu', 'Nghiệp vụ áp dụng', { head: '-- Chọn nghiệp vụ --' }) +
                        H.selField('thpKhoanThu', 'Khoản thu', { head: '-- Chọn khoản thu --' }) +
                        '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div>' +
                        '<div data-z="tt"></div>' +
                    '</div>' +
                    '<div class="ums-panel__foot ums-row--end">' +
                        '<button type="button" class="ums-btn ums-btn--danger" data-a="xoaketqua"><i class="fa-light fa-trash-can"></i><span>Xóa kết quả</span></button>' +
                        '<button type="button" class="ums-btn ums-btn--out-primary" data-a="xem"><i class="fa-light fa-list"></i><span>Xem danh sách</span></button>' +
                        '<button type="button" class="ums-btn ums-btn--primary" data-a="tinhphi"><i class="fa-light fa-calculator"></i><span>Tính phí</span></button>' +
                    '</div>' +
                '</div></div>' +
                '<div><div class="ums-panel">' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-clock-rotate-left"></i> Tiến trình · Lịch sử tính học phí</div></div>' +
                    '<div class="ums-panel__body" data-z="queue"></div>' +
                '</div></div>' +
            '</div>' +
            '<div class="ums-panel">' +
                '<nav class="ums-tabs" data-z="tabs"></nav>' +
                '<div data-tabp="tc">' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-ol"></i> Kết quả theo tín chỉ</div>' +
                        '<div class="ums-panel__tools">' + ui.btn('excel', { cls: 'ums-btn--sm', attr: { 'data-a': 'xuattc' } }) + '<button type="button" class="ums-iconbtn" data-a="reloadtc" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button></div></div>' +
                    '<div class="ums-panel__body ums-panel__body--flush" data-z="tc"></div>' +
                '</div>' +
                '<div data-tabp="nc" hidden>' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-ol"></i> Kết quả theo niên chế</div>' +
                        '<div class="ums-panel__tools">' + ui.btn('excel', { cls: 'ums-btn--sm', attr: { 'data-a': 'xuatnc' } }) + '<button type="button" class="ums-iconbtn" data-a="reloadnc" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button></div></div>' +
                    '<div class="ums-panel__body ums-panel__body--flush" data-z="nc"></div>' +
                '</div>' +
                '<div data-tabp="ktp" hidden>' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-user-slash"></i> Danh sách không tính phí</div>' +
                        '<div class="ums-panel__tools">' +
                            '<button type="button" class="ums-iconbtn" data-a="reloadktp" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>' +
                            ui.btn('excel', { cls: 'ums-btn--sm', attr: { 'data-a': 'xuatktp' } }) +
                            '<button type="button" class="ums-btn ums-btn--out-info ums-btn--sm" data-a="importktp"><i class="fa-light fa-cloud-arrow-up"></i><span>Import chốt phí</span></button>' +
                            '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-a="xoaktp"><i class="fa-light fa-trash-can"></i><span>Xóa</span></button>' +
                            '<button type="button" class="ums-btn ums-btn--save ums-btn--sm" data-a="luuktp"><i class="fa-light fa-floppy-disk"></i><span>Lưu</span></button>' +
                            ui.btn('add', { attr: { 'data-a': 'themktp' } }) +
                        '</div></div>' +
                    '<div class="ums-panel__body ums-panel__body--flush" data-z="ktp"></div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div data-z="detail" hidden>' +
            '<div class="ums-panel">' +
                '<div class="ums-panel__head">' +
                    '<div class="ums-panel__title"><i class="fa-light fa-receipt"></i> Chi tiết học phí <span class="ums-u-faint ums-u-fz13" data-z="detailwho"></span></div>' +
                    '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-a': 'back' } }) + '</div>' +
                '</div>' +
                '<div class="ums-panel__body ums-panel__body--flush" data-z="detailtbl"></div>' +
            '</div>' +
        '</div>';

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function $id(id) { return document.getElementById(id); }
    function v(id) { return H.val($id(id)); }
    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    H.s2(root);
    var tt = H.trangThai(z('tt'));
    var svPick = H.pickTable(z('sv'), [], svCols());
    function svCols() {
        return [
            { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', render: function (r) { return esc(H.e(r.HODEM) + ' ' + H.e(r.TEN)); } }
        ];
    }
    function svIds() { return svPick.ids().join(','); }   // arrChecked_Id.toString()

    /* ---------- Ô chọn ------------------------------------------------------ */
    function loadKhoa(he) {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
            .then(function (r) { H.fill('thpKhoa', r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }).catch(fail('khóa đào tạo'));
    }
    function loadLop(khoa, ct) {
        return H.lopQuanLy(khoa, ct).then(function (r) { H.fill('thpLop', r, { name: 'TEN' }); }).catch(fail('lớp quản lý'));
    }
    function loadSinhVien() {
        z('sv').hidden = false;
        z('sv').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        H.sinhVienTheoLop({
            strKhoaDaoTao_Id: v('thpKhoa'), strHeDaoTao_Id: v('thpHe'), strLopHoc_Id: v('thpLop'),
            strTrangThaiNguoiHoc_Id: tt.ids().join(',')
        }).then(function (rows) { svPick = H.pickTable(z('sv'), rows, svCols()); })
          .catch(function (err) { z('sv').innerHTML = ''; ums.api.handle(err, 'sinh viên'); });
    }

    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (r) { H.fill('thpHe', r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); }).catch(fail('hệ đào tạo'));
    loadKhoa('');
    H.thoiGianDaoTao().then(function (r) { H.fill('thpThoiGian', r, { name: 'DAOTAO_THOIGIANDAOTAO' }); }).catch(fail('thời gian đào tạo'));
    ums.api.dm('QLTC.NVAP').then(function (r) { H.fill('thpNghiepVu', r, { head: 'Chọn nghiệp vụ áp dụng' }); }).catch(fail('nghiệp vụ'));

    // H.on đã nghe cả lúc xoá → chỉ cần xoá trắng tầng dưới, không phát lại
    ums.pat.chain([$id('thpHe'), $id('thpKhoa'), $id('thpLop')], { phatLai: false });
    H.on('thpHe', function () { loadKhoa(v('thpHe')); loadLop('', ''); });
    H.on('thpKhoa', function () { loadLop(v('thpKhoa'), ''); });
    jQuery($id('thpLop')).on('select2:select', loadSinhVien);
    // gốc 2/10: bỏ chọn Lớp thì nạp lại danh sách sinh viên nếu vùng đang mở
    var henBoLop = 0;   // select2 bắn cả unselect lẫn clear khi xoá ô → gộp thành một lần nạp
    jQuery($id('thpLop')).on('select2:unselect select2:clear', function () {
        clearTimeout(henBoLop);
        henBoLop = setTimeout(function () { if (!z('sv').hidden) loadSinhVien(); }, 0);
    });
    H.on('thpThoiGian', function () {
        H.keHoachDangKy(v('thpThoiGian')).then(function (r) { H.fill('thpKeHoach', r, { name: 'TEN' }); }).catch(fail('kế hoạch đăng ký'));
    });
    H.on('thpNghiepVu', function () {
        H.khoanTheoNghiepVu(v('thpNghiepVu')).then(function (r) { H.fill('thpKhoanThu', r, { name: 'TEN', head: 'Chọn khoản thu' }); }).catch(fail('khoản thu'));
    });

    /* ---------- Hàng đợi + báo cáo ------------------------------------------ */
    function dieuKien() {
        return [['Hệ đào tạo', 'thpHe'], ['Khóa đào tạo', 'thpKhoa'], ['Lớp quản lý', 'thpLop'], ['Thời gian đào tạo', 'thpThoiGian'],
            ['Nghiệp vụ áp dụng', 'thpNghiepVu'], ['Khoản thu', 'thpKhoanThu'], ['Kế hoạch đăng ký', 'thpKeHoach']];
    }
    function dieuKienKTP() { return [['Nghiệp vụ áp dụng', 'thpNghiepVu'], ['Thời gian đào tạo', 'thpThoiGian'], ['Khoản thu', 'thpKhoanThu']]; }
    function phuLines(dk) { var l = H.trangThaiLines(tt), t = ums.process.dieuKien(dk); if (t) l.push(t); return l; }
    var queue = ums.queue.mount(z('queue'), {
        strLoaiNhiemVu: 'TINHPHITUDONG',
        strName: 'TinhHocPhi',
        onDone: function () { loadTinChi(); loadNienChe(); },       // objHangDoi.callback = endHangDoi
        process: { title: 'Tính học phí', fileName: 'KetQuaTinhHocPhi', subTitles: function () { return phuLines(dieuKien()); } }   // objHangDoi.process (gốc 4/11)
    });

    ums.report.mount(z('report'), {
        collect: function (add) {
            add('strHeDaoTao', v('thpHe'));
            add('strKhoaDaoTao', v('thpKhoa'));
            add('strLopQuanLy', v('thpLop'));
            add('strThoiGianDaoTao', v('thpThoiGian'));
            add('strKhoanThu', v('thpKhoanThu'));
            add('strNghiepVu', v('thpNghiepVu'));
            add('strDangKy_KeHoachDangKy_Id', v('thpKeHoach'));
        }
    });

    /* ---------- Tab ---------------------------------------------------------- */
    var tabs = H.tabs(z('tabs'), [
        { key: 'tc', text: '1) Theo tín chỉ', count: true },
        { key: 'nc', text: '2) Theo niên chế', count: true },
        { key: 'ktp', text: '3) Danh sách không tính phí' }
    ], function (key) {
        Array.prototype.forEach.call(root.querySelectorAll('[data-tabp]'), function (p) { p.hidden = p.getAttribute('data-tabp') !== key; });
        if (key === 'ktp') loadKhongTinhPhi();
    });

    /* ---------- Kết quả ------------------------------------------------------ */
    function loadTinChi() {
        var host = z('tc');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_KetQuaDaTinhPhi/LayDanhSach',
            method: 'GET',
            versionAPI: 'v1.0',
            strDaoTao_ThoiGianDaoTao_Id: v('thpThoiGian'),
            strDangKy_KeHoachDangKy_Id: v('thpKeHoach'),
            strHeDaoTao_Id: v('thpHe'),
            strKhoaDaoTao_Id: v('thpKhoa'),
            strDaoTao_LopQuanLy_Id: v('thpLop'),
            strNghiepVuApDung_Id: v('thpNghiepVu'),
            strTaiChinh_CacKhoanThu_Id: v('thpKhoanThu'),
            strNguoiThucHien_Id: '',
            strQLSV_NguoiHoc_Id: svIds()
        }).then(function (r) {
            var rows = Array.isArray(r.data) ? r.data : [];
            tabs.count('tc', r.pager);
            ui.table({ el: host, rows: rows, columns: H.colsTinChi('data-detail'), tableCls: 'ums-table--lined ums-table--tight' });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả theo tín chỉ'); });
    }

    function loadNienChe() {
        var host = z('nc');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_KetQuaDaTinhPhi_NC/LayDanhSach',
            method: 'GET',
            versionAPI: 'v1.0',
            strDaoTao_ThoiGianDaoTao_Id: v('thpThoiGian'),
            strHeDaoTao_Id: v('thpHe'),
            strKhoaDaoTao_Id: v('thpKhoa'),
            strLopQuanLy_Id: v('thpLop'),
            strNghiepVuApDung_Id: v('thpNghiepVu'),
            strTaiChinh_CacKhoanThu_Id: v('thpKhoanThu'),
            strNguoiThucHien_Id: '',
            strQLSV_NguoiHoc_Id: svIds()
        }).then(function (r) {
            var rows = Array.isArray(r.data) ? r.data : [];
            tabs.count('nc', r.pager);
            ui.table({ el: host, rows: rows, columns: H.colsNienChe(true), tableCls: 'ums-table--lined ums-table--tight' });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả theo niên chế'); });
    }

    function openDetail(strQLSV_NguoiHoc_Id, label) {
        z('detailwho').textContent = label ? '— ' + label : '';
        z('detailtbl').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ui.swap(z('main'), z('detail'));
        ums.api.call({
            action: 'TC_KetQuaDaTinhPhi_NC/LayDanhSach',
            method: 'GET',
            versionAPI: 'v1.0',
            strDaoTao_ThoiGianDaoTao_Id: v('thpThoiGian'),
            strTaiChinh_CacKhoanThu_Id: v('thpKhoanThu'),
            strNguoiThucHien_Id: '',
            strNghiepVuApDung_Id: v('thpNghiepVu'),
            strChuongTrinh_Id: '',
            strQLSV_NguoiHoc_Id: strQLSV_NguoiHoc_Id
        }).then(function (r) {
            ui.table({ el: z('detailtbl'), rows: Array.isArray(r.data) ? r.data : [], columns: H.colsChiTiet() });
        }).catch(function (err) { z('detailtbl').innerHTML = ui.fail(err.message); ums.api.handle(err, 'chi tiết học phí'); });
    }

    /* ---------- Tab "Danh sách không tính phí" ------------------------------- */
    var ktpRows = [];
    function loadKhongTinhPhi() {
        var host = z('ktp');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_ThuChi2_MH/DSA4BRIVAh4PJikoJDEXNB4CKS41HhEpKAPP',
            func: 'PKG_TAICHINH_THUCHI2.LayDSTC_NghiepVu_Chot_Phi',
            strDaoTao_ThoiGianDaoTao_Id: v('thpThoiGian'),
            strNghiepVuApDung_Id: v('thpNghiepVu'),
            strTaiChinh_CacKhoanThu_Id: v('thpKhoanThu'),
            strNguoiThucHien_Id: '',
            strId: ''
        }).then(function (r) {
            ktpRows = Array.isArray(r.data) ? r.data : [];
            ui.table({
                el: host, rows: ktpRows, tableCls: 'ums-table--lined ums-table--tight',
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (x) { return esc(H.e(x.QLSV_NGUOIHOC_HODEM) + ' ' + H.e(x.QLSV_NGUOIHOC_TEN)); } },
                    { title: 'Chương trình', render: function (x) { return esc(H.e(x.DAOTAO_CHUONGTRINH_TEN) + ' (' + H.e(x.DAOTAO_CHUONGTRINH_MA) + ')'); } },
                    { title: 'Nghiệp vụ', prop: 'NGHIEPVUAPDUNG_TEN' },
                    { title: 'Khoản', prop: 'TAICHINH_CACKHOANTHU_TEN', cls: 'is-center' },
                    { title: 'Thời gian', prop: 'THOIGIAN' },
                    { title: 'Phần trăm không tính', width: '130px', render: function (x, i) {
                        return '<input class="ums-input ums-input--sm" data-pt="' + i + '" value="' + esc(H.e(x.PHANTRAM)) + '" inputmode="decimal">';
                    } },
                    { head: '<input type="checkbox" data-kx="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (x, i) { return '<input type="checkbox" data-kx="' + i + '">'; } }
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách không tính phí'); });
    }
    z('ktp').addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.matches && t.matches('input[data-kx="all"]')) {
            Array.prototype.forEach.call(z('ktp').querySelectorAll('input[data-kx]'), function (x) { x.checked = t.checked; });
        }
    });

    function ktpChecked() {
        return Array.prototype.filter.call(z('ktp').querySelectorAll('input[data-kx]'), function (x) {
            return x.checked && x.getAttribute('data-kx') !== 'all';
        }).map(function (x) { return ktpRows[Number(x.getAttribute('data-kx'))]; });
    }

    function themKhongTinhPhi() {
        if (!v('thpNghiepVu')) return ui.toast('Bạn hãy chọn nghiệp vụ', 'warn');
        if (!v('thpThoiGian')) return ui.toast('Bạn hãy chọn thời gian', 'warn');
        if (!v('thpKhoanThu')) return ui.toast('Bạn hãy chọn khoản thu', 'warn');
        H.pickSinhVien({
            onPick: function (list) {
                // mỗi sinh viên chọn một bản ghi của form tiến trình, miễn 100% học phí (gốc edu.process.pickSinhVien)
                ums.process.run({
                    title: 'Thêm sinh viên vào danh sách không tính phí', unit: 'sinh viên', fileName: 'KetQuaThemKhongTinhPhi', dieuKien: dieuKienKTP(), items: list,
                    columns: [
                        { header: 'Mã số', render: function (r) { return H.e(r.QLSV_NGUOIHOC_MASO || r.MASO); } },
                        { header: 'Họ tên', render: function (r) { return (H.e(r.QLSV_NGUOIHOC_HODEM || r.HODEM) + ' ' + H.e(r.QLSV_NGUOIHOC_TEN || r.TEN)).trim(); } },
                        { header: 'Lớp quản lý', render: function (r) { return H.e(r.DAOTAO_LOPQUANLY_TEN); } }
                    ],
                    request: function (sv) {
                        if (!sv || !sv.QLSV_NGUOIHOC_ID) throw new Error('Không tìm thấy dữ liệu của sinh viên.');
                        return {
                            action: 'TC_ThuChi2_MH/FSkkLB4VAh4PJikoJDEXNB4CKS41HhEpKAPP',
                            func: 'PKG_TAICHINH_THUCHI2.Them_TC_NghiepVu_Chot_Phi',
                            strDaoTao_ThoiGianDaoTao_Id: v('thpThoiGian'),
                            strNghiepVuApDung_Id: v('thpNghiepVu'),
                            strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID,
                            strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID,
                            strTaiChinh_CacKhoanThu_Id: v('thpKhoanThu'),
                            dPhanTram: 100,
                            strNguoiThucHien_Id: ''
                        };
                    },
                    refresh: loadKhongTinhPhi
                });
            }
        });
    }

    function luuKhongTinhPhi() {
        var changed = [];
        Array.prototype.forEach.call(z('ktp').querySelectorAll('input[data-pt]'), function (el) {
            var r = ktpRows[Number(el.getAttribute('data-pt'))];
            if (String(H.e(r.PHANTRAM)) !== el.value) changed.push({ row: r, val: el.value });
        });
        if (!changed.length) return ui.toast('Không có thay đổi lưu', 'warn');
        ums.process.run({
            title: 'Lưu phần trăm không tính phí', unit: 'sinh viên', fileName: 'KetQuaLuuKhongTinhPhi', dieuKien: dieuKienKTP(), items: changed,
            columns: [
                { header: 'Mã số', render: function (c) { return H.e(c.row.QLSV_NGUOIHOC_MASO); } },
                { header: 'Họ tên', render: function (c) { return (H.e(c.row.QLSV_NGUOIHOC_HODEM) + ' ' + H.e(c.row.QLSV_NGUOIHOC_TEN)).trim(); } },
                { header: 'Phần trăm cũ', render: function (c) { return H.e(c.row.PHANTRAM); } },
                { header: 'Phần trăm mới', render: function (c) { return c.val; } }
            ],
            request: function (c) {
                return {
                    action: 'TC_ThuChi2_MH/EjQgHhUCHg8mKSgkMRc0HgIpLjUeESko',
                    func: 'PKG_TAICHINH_THUCHI2.Sua_TC_NghiepVu_Chot_Phi',
                    strId: c.row.ID,
                    dPhanTram: c.val,
                    strNguoiThucHien_Id: ''
                };
            },
            refresh: loadKhongTinhPhi
        });
    }

    function xoaKhongTinhPhi() {
        var rows = ktpChecked();
        if (!rows.length) return ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn');
        ums.process.run({
            title: 'Xóa sinh viên khỏi danh sách không tính phí', unit: 'sinh viên', fileName: 'KetQuaXoaKhongTinhPhi', dieuKien: dieuKienKTP(),
            notes: ['Thao tác xóa dữ liệu các sinh viên trong danh sách.'], items: rows,
            columns: [
                { header: 'Mã số', render: function (r) { return H.e(r.QLSV_NGUOIHOC_MASO); } },
                { header: 'Họ tên', render: function (r) { return (H.e(r.QLSV_NGUOIHOC_HODEM) + ' ' + H.e(r.QLSV_NGUOIHOC_TEN)).trim(); } },
                { header: 'Chương trình', render: function (r) { return H.e(r.DAOTAO_CHUONGTRINH_TEN); } },
                { header: 'Phần trăm', render: function (r) { return H.e(r.PHANTRAM); } }
            ],
            request: function (r) {
                return {
                    action: 'TC_ThuChi2_MH/GS4gHhUCHg8mKSgkMRc0HgIpLjUeESko',
                    func: 'PKG_TAICHINH_THUCHI2.Xoa_TC_NghiepVu_Chot_Phi',
                    strId: r.ID,
                    strNguoiThucHien_Id: ''
                };
            },
            refresh: loadKhongTinhPhi
        });
    }

    /* ---------- Tác vụ chính -------------------------------------------------- */
    function tinhPhi() {
        ui.confirm('Bạn có chắc chắn Tính học phí không?', { title: 'Tính học phí', ok: 'Tính phí' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({
                action: 'TC_HangDoi/PTaoHangDoi_TinhPhi_TuDong',
                versionAPI: 'v1.0',
                strTaiChinh_CacKhoanThu_Id: v('thpKhoanThu'),
                strDaoTao_ThoiGianDaoTao_Id: v('thpThoiGian'),
                strDaoTao_HeDaoTao_Id: v('thpHe'),
                strDaoTao_KhoaDaoTao_Id: v('thpKhoa'),
                strDaoTao_LopQuanLy_Id: v('thpLop'),
                strNghiepVuApDung_Id: v('thpNghiepVu'),
                strQLSV_NguoiHoc_Id: svIds(),
                strTrangThaiNguoiHoc_Id: tt.ids().join(','),
                strDangKy_KeHoachDangKy_Id: v('thpKeHoach'),
                strNguoiThucHien_Id: ''
            }).then(function () {
                ui.toast('Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!', 'ok');
                queue.reload();
            }).catch(fail('tạo hàng đợi tính phí'));
        });
    }

    function xoaKetQua() {
        var nChon = svPick ? svPick.ids().length : 0;
        ums.process.runJob({
            title: 'Xóa kết quả đã tính phí', what: 'Xóa kết quả đã tính phí' + (nChon > 0 ? ' của ' + nChon + ' sinh viên đã chọn' : ' theo phạm vi đang chọn'),
            fileName: 'KetQuaXoaKetQuaDaTinhPhi', notes: ['Thao tác xóa dữ liệu kết quả đã tính phí trong phạm vi đang chọn.'],
            subTitles: H.trangThaiLines(tt), dieuKien: dieuKien(), okMessage: 'Xóa thành công!',
            request: function () {
                return {
                    action: 'TC_KetQuaDaTinhPhi/Xoa',
                    strDaoTao_ThoiGianDaoTao_Id: v('thpThoiGian'),
                    strDangKy_KeHoachDangKy_Id: v('thpKeHoach'),
                    strHeDaoTao_Id: v('thpHe'),
                    strKhoaDaoTao_Id: v('thpKhoa'),
                    strLopQuanLy_Id: v('thpLop'),
                    strNghiepVuApDung_Id: v('thpNghiepVu'),
                    strTaiChinh_CacKhoanThu_Id: v('thpKhoanThu'),
                    strNguoiThucHien_Id: '',
                    strQLSV_NguoiHoc_Id: svIds()
                };
            },
            refresh: function () { loadTinChi(); loadNienChe(); }
        });
    }

    /* ---------- Sự kiện — gắn trên root ------------------------------------- */
    root.addEventListener('click', function (ev) {
        var d = ev.target.closest('[data-detail]');
        if (d && root.contains(d)) { ev.preventDefault(); return openDetail(d.getAttribute('data-detail'), d.textContent); }
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        switch (b.getAttribute('data-a')) {
            case 'svtoggle': z('sv').hidden = !z('sv').hidden; break;
            case 'tinhphi': tinhPhi(); break;
            case 'xoaketqua': xoaKetQua(); break;
            case 'xem': loadNienChe(); loadTinChi(); break;
            case 'reloadtc': loadTinChi(); break;
            case 'xuattc': ui.xuatBang(z('tc'), { ten: 'KetQuaTinhHocPhiTinChi', tieuDe: 'KẾT QUẢ TÍNH HỌC PHÍ - HỌC CHẾ TÍN CHỈ', phu: phuLines(dieuKien()) }); break;
            case 'xuatnc': ui.xuatBang(z('nc'), { ten: 'KetQuaTinhHocPhiNienChe', tieuDe: 'KẾT QUẢ TÍNH HỌC PHÍ - HỌC CHẾ NIÊN CHẾ', phu: phuLines(dieuKien()) }); break;
            case 'xuatktp': ui.xuatBang(z('ktp'), { ten: 'DanhSachKhongTinhPhi', tieuDe: 'DANH SÁCH SINH VIÊN KHÔNG TÍNH PHÍ', phu: [ums.process.dieuKien(dieuKienKTP())].filter(Boolean) }); break;
            case 'reloadnc': loadNienChe(); break;
            case 'reloadktp': loadKhongTinhPhi(); break;
            case 'themktp': themKhongTinhPhi(); break;
            case 'luuktp': luuKhongTinhPhi(); break;
            case 'xoaktp': xoaKhongTinhPhi(); break;
            case 'importktp': ums.report.importChung('Chốt phí', 'IMPORTWITHPROC_NVCHOTPHI', { onDone: loadKhongTinhPhi }); break;
            case 'back': ui.swap(z('detail'), z('main')); break;
        }
    });

    ui.table({ el: z('tc'), rows: [], columns: H.colsTinChi(), empty: 'Chọn điều kiện rồi bấm "Xem danh sách"' });
    ui.table({ el: z('nc'), rows: [], columns: H.colsNienChe(true), empty: 'Chọn điều kiện rồi bấm "Xem danh sách"' });
})();
