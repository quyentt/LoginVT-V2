/* =========================================================================
   Quy trình 2: Chuyển kế toán
   Bản gốc: ApisTaiChinh/Modules/dulieuhocphi/scripts/chuyendulieuketoan.js
   ---------------------------------------------------------------------------
   Nguồn ô chọn (xem _chung.js):
       pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao / LayDSKS_DaoTao_KhoaDaoTao /
       LayDSKS_DaoTao_LopQuanLy                   (ums.ref)
       CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao    GET (chọn nhiều)
       DKH_KeHoachDangKy/LayDSKeHoachTheoThoiGian      GET, khi đổi thời gian
       TC_TinhTien/LayDSKhoanPhiTheoNghiepVu           GET, lúc mở (nghiệp vụ rỗng) và khi đổi nghiệp vụ
       danh mục QLTC.NVAP, CM_DanhMucDuLieu#QLSV.TRANGTHAI
       TC_NguoiHoc_HoSo/LayDanhSach                    sinh viên của lớp (chọn từng SV)
   Tác vụ:
       TC_HangDoi/PTaoHangDoi_ChuyenKeToan_TuDong      POST, tạo hàng đợi
       ums.queue CHUYENKETOANTUDONG                    hàng đợi + lịch sử
       TC_KetQuaDaTinhPhi_ChuaKiemTra/LayDanhSach      GET, theo tín chỉ
       TC_KetQuaDaTinhPhi_NC_ChuaKiemTra/LayDanhSach   GET, theo niên chế
       TC_KetQuaDaTinhPhi_NC/LayDanhSach               GET, chi tiết một SV
       ums.report (getList_MauImport)                  báo cáo

   Khác bản gốc, có chủ đích:
     · Nút "Xem danh sách" của bản gốc KHÔNG chạy (delegate trên
       #tblTaskBar_ChuyenDuLieu nhưng nút nằm ngoài bảng). Ở đây nạp hai bảng.
     · Loại nhiệm vụ hàng đợi luôn là "CHUYENKETOANTUDONG" — bản gốc ghép giá
       trị ô nghiệp vụ lúc khởi tạo (khi đó còn rỗng). Giữ nguyên.
     · Hộp xác nhận ghi "Chuyển kế toán" (bản gốc chép nhầm "Tính học phí").
   Bỏ: sự kiện trên #dropThoiGianDaoTao_TP (không tồn tại ở màn này — bản gốc
   gắn thêm đúng sự kiện đó cho #dropThoiGianDaoTao_CDL), loadProgressBar,
   proSeq…, genHTML_HangDoi, fakedb.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, H = ums.hocphi, esc = ui.esc;
    var root = document.getElementById('chuyendulieuketoan');

    root.innerHTML =
        '<div class="ums-page__head">' +
            '<h1 class="ums-page__title ums-u-mb-0">Chuyển dữ liệu kế toán</h1>' +
            '<div class="ums-page__actions"><span data-z="report"></span></div>' +
        '</div>' +
        '<div data-z="main">' +
            '<div class="ums-grid ums-grid--2 ums-u-mb-4">' +
                '<div><div class="ums-panel">' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-right-left"></i> Quy trình 2: Chuyển kế toán</div></div>' +
                    '<div class="ums-panel__body">' +
                        H.selField('cdlHe', 'Hệ đào tạo', { head: '-- Chọn hệ đào tạo --' }) +
                        H.selField('cdlKhoa', 'Khóa đào tạo', { head: '-- Chọn khóa đào tạo --' }) +
                        H.selField('cdlLop', 'Lớp đào tạo', { multiple: true }) +
                        ui.field('Sinh viên',
                            '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-a="svtoggle"><i class="fa-light fa-users"></i><span>Chọn theo từng sinh viên</span></button>' +
                            '<div data-z="sv" hidden class="ums-u-mt-2 hp-svbox"></div>', { inline: true, labelWidth: '170px' }) +
                        H.selField('cdlThoiGian', 'Thời gian đào tạo', { multiple: true }) +
                        H.selField('cdlKeHoach', 'Kế hoạch đăng ký', { multiple: true }) +
                        H.selField('cdlNghiepVu', 'Nghiệp vụ áp dụng', { head: '-- Chọn nghiệp vụ --' }) +
                        H.selField('cdlKhoanThu', 'Khoản thu', { head: '-- Chọn khoản thu --' }) +
                        '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div>' +
                        '<div data-z="tt"></div>' +
                    '</div>' +
                    '<div class="ums-panel__foot ums-row--end">' +
                        '<button type="button" class="ums-btn ums-btn--out-primary" data-a="xem"><i class="fa-light fa-list"></i><span>Xem danh sách</span></button>' +
                        '<button type="button" class="ums-btn ums-btn--primary" data-a="chuyen"><i class="fa-light fa-right-left"></i><span>Chuyển kế toán</span></button>' +
                    '</div>' +
                '</div></div>' +
                '<div><div class="ums-panel">' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-clock-rotate-left"></i> Tiến trình · Lịch sử chuyển kế toán</div></div>' +
                    '<div class="ums-panel__body" data-z="queue"></div>' +
                '</div></div>' +
            '</div>' +
            '<div data-z="kq"></div>' +
        '</div>' +
        '<div data-z="detail" hidden></div>';

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function v(id) { return H.val(document.getElementById(id)); }
    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    H.s2(root);
    var tt = H.trangThai(z('tt'));
    function svCols() {
        return [
            { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', render: function (r) { return esc(H.e(r.HODEM) + ' ' + H.e(r.TEN)); } }
        ];
    }
    var svPick = H.pickTable(z('sv'), [], svCols());

    /* ---------- Ô chọn ------------------------------------------------------ */
    function loadKhoa(he) {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
            .then(function (r) { H.fill('cdlKhoa', r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }).catch(fail('khóa đào tạo'));
    }
    function loadKhoan() {
        return H.khoanTheoNghiepVu(v('cdlNghiepVu')).then(function (r) { H.fill('cdlKhoanThu', r, { name: 'TEN', head: 'Chọn khoản thu' }); }).catch(fail('khoản thu'));
    }
    function loadSinhVien() {
        z('sv').hidden = false;
        z('sv').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        H.sinhVienTheoLop({
            strKhoaDaoTao_Id: v('cdlKhoa'), strHeDaoTao_Id: v('cdlHe'), strLopHoc_Id: v('cdlLop'),
            strTrangThaiNguoiHoc_Id: tt.ids().join(',')
        }).then(function (rows) { svPick = H.pickTable(z('sv'), rows, svCols()); })
          .catch(function (err) { z('sv').innerHTML = ''; ums.api.handle(err, 'sinh viên'); });
    }

    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (r) { H.fill('cdlHe', r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); }).catch(fail('hệ đào tạo'));
    loadKhoa('');
    H.thoiGianDaoTao().then(function (r) { H.fill('cdlThoiGian', r, { name: 'DAOTAO_THOIGIANDAOTAO' }); }).catch(fail('thời gian đào tạo'));
    loadKhoan();
    ums.api.dm('QLTC.NVAP').then(function (r) { H.fill('cdlNghiepVu', r, { head: 'Chọn nghiệp vụ áp dụng' }); }).catch(fail('nghiệp vụ'));

    // H.on đã nghe cả lúc xoá → chỉ cần xoá trắng tầng dưới, không phát lại
    ums.pat.chain([document.getElementById('cdlHe'), document.getElementById('cdlKhoa'), document.getElementById('cdlLop')], { phatLai: false });
    H.on('cdlHe', function () { loadKhoa(v('cdlHe')); });
    H.on('cdlKhoa', function () {
        H.lopQuanLy(v('cdlKhoa'), '').then(function (r) { H.fill('cdlLop', r, { name: 'TEN' }); }).catch(fail('lớp quản lý'));
    });
    jQuery(document.getElementById('cdlLop')).on('select2:select', loadSinhVien);
    H.on('cdlThoiGian', function () {
        H.keHoachDangKy(v('cdlThoiGian')).then(function (r) { H.fill('cdlKeHoach', r, { name: 'TEN' }); }).catch(fail('kế hoạch đăng ký'));
    });
    H.on('cdlNghiepVu', loadKhoan);

    /* ---------- Kết quả ------------------------------------------------------ */
    function withAction(action, o) {
        var c = { action: action, method: 'GET', versionAPI: 'v1.0' };
        Object.keys(o).forEach(function (key) { c[key] = o[key]; });
        return c;
    }
    function dk() {
        return {
            strDaoTao_ThoiGianDaoTao_Id: v('cdlThoiGian'),
            strHeDaoTao_Id: v('cdlHe'),
            strKhoaDaoTao_Id: v('cdlKhoa'),
            strNghiepVuApDung_Id: v('cdlNghiepVu'),
            strTaiChinh_CacKhoanThu_Id: v('cdlKhoanThu'),
            strNguoiThucHien_Id: ''
        };
    }
    var kq = H.mountKetQua({
        host: z('kq'), main: z('main'), detail: z('detail'),
        tinChi: function () { return withAction('TC_KetQuaDaTinhPhi_ChuaKiemTra/LayDanhSach', dk()); },
        nienChe: function () { return withAction('TC_KetQuaDaTinhPhi_NC_ChuaKiemTra/LayDanhSach', dk()); },
        chiTiet: function (id) {
            return withAction('TC_KetQuaDaTinhPhi_NC/LayDanhSach', {
                strDaoTao_ThoiGianDaoTao_Id: v('cdlThoiGian'),
                strTaiChinh_CacKhoanThu_Id: v('cdlKhoanThu'),
                strNguoiThucHien_Id: '',
                strNghiepVuApDung_Id: v('cdlNghiepVu'),
                strChuongTrinh_Id: '',
                strQLSV_NguoiHoc_Id: id
            });
        }
    });

    /* ---------- Hàng đợi + báo cáo ------------------------------------------ */
    var queue = ums.queue.mount(z('queue'), {
        strLoaiNhiemVu: 'CHUYENKETOANTUDONG',
        strName: 'ChuyenDuLieu',
        onDone: function () { kq.loadTinChi(); kq.loadNienChe(); }     // endHangDoi
    });

    ums.report.mount(z('report'), {
        collect: function (add) {
            add('strHeDaoTao', v('cdlHe'));
            add('strKhoaDaoTao', v('cdlKhoa'));
            add('strThoiGianDaoTao', v('cdlThoiGian'));
            add('strKhoanThu', v('cdlKhoanThu'));
            add('strNghiepVu', v('cdlNghiepVu'));
        }
    });

    /* ---------- Chuyển kế toán ----------------------------------------------- */
    function chuyen() {
        ui.confirm('Bạn có chắc chắn Chuyển kế toán không?', { title: 'Chuyển kế toán', ok: 'Chuyển kế toán' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({
                action: 'TC_HangDoi/PTaoHangDoi_ChuyenKeToan_TuDong',
                versionAPI: 'v1.0',
                strTaiChinh_CacKhoanThu_Id: v('cdlKhoanThu'),
                strDaoTao_ThoiGianDaoTao_Id: v('cdlThoiGian'),
                strDaoTao_HeDaoTao_Id: v('cdlHe'),
                strDaoTao_KhoaDaoTao_Id: v('cdlKhoa'),
                strNghiepVuApDung_Id: v('cdlNghiepVu'),
                strDangKy_KeHoachDangKy_Id: v('cdlKeHoach'),
                strTrangThaiNguoiHoc_Id: tt.ids().join(','),
                strNguoiThucHien_Id: '',
                strQLSV_NguoiHoc_Id: svPick.ids().join(','),
                strDaoTao_LopQuanLy_Id: v('cdlLop')
            }).then(function () {
                ui.toast('Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!', 'ok');
                queue.reload();
            }).catch(fail('tạo hàng đợi chuyển kế toán'));
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'chuyen') chuyen();
        else if (a === 'xem') { kq.loadNienChe(); kq.loadTinChi(); }
        else if (a === 'svtoggle') z('sv').hidden = !z('sv').hidden;
    });
})();
