/* =========================================================================
   Kế hoạch thi lại — ba danh sách phụ: "Chưa đăng ký" (hộp thoại, chỉ xem),
   "Lớp học phần sử dụng", "Lớp quản lý sử dụng" (MÀN CON trong trang: danh sách +
   Xoá + Thêm — BO-CUC luật 1, rà hộp thoại 2026-09-30; bản gốc và bản trước là hộp
   thoại lồng hộp thoại). T.hopLopHocPhan(kh, vungGoc) / T.hopLopQuanLy(kh, vungGoc):
   khung danh sách thay chỗ vungGoc (pat.formTrang tầng một), biểu mẫu "Thêm" thay chỗ
   bảng bên trong khung (tầng hai).
   Bản gốc: kehoach.html #modalChuaDangKy, #modalLopHocPhanSuDung + #myModalAddLHPSD,
            #modalLopQuanLySuDung + #myModalAddLQLSD; kehoach.js getList_ChuaDangKy,
            *_LopHocPhanSuDung, *_LopQuanLySuDung, getList_KeHoachDangKy,
            getList_HocPhan, getList_LopHocPhan, getList_ThanhPhanDiem,
            edu.extend.genBoLoc_HeKhoa("_TL")
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
     Chưa đăng ký  DKH_DangKyThi_MonThi_Chung_MH/… PKG pkg_dangkythi_monthi_chung.
                   LayDSDKTrongPhamViNhungChuaDK  strTuKhoa "", strDangKy_Thi_HP_KeHoach_Id
                   cột MASO, HODEM, TEN, CHUONGTRINH, KHOAHOC, KHOAQUANLY, TENHOCPHAN, MAHOCPHAN,
                       SOTINCHI, LOPDANGKY, DIEM, DANHGIA_TEN, DIEMQUYDOI, DIEMCHU, THOIGIAN
     Lớp học phần sử dụng  DKH_DangKyThi_MonThi_ThongTin/
                   LayDSDangKy_Thi_LopHocPhan  GET  strTuKhoa "", 1/100000
                   Them_DangKy_Thi_LopHocPhan  strDaoTao_HocPhan_Id, strDaoTao_LopHocPhan_Id, strKieuHoc_Id,
                                               strDangKy_KeHoachDangKy_Id, strDiem_ThanhPhanDiem_Id
                   Xoa_DangKy_Thi_LopHocPhan   strId
         ô của hộp "Thêm":
                   DKH_KeHoachDangKy/LayDanhSach           GET  (TENKEHOACH)  strTuKhoa/strDaoTao_ThoiGianDaoTao_Id "", 1/100000
                   DKH_ThongTin/LayDSHocPhanTheoKeHoach     GET  strDangKy_KeHoachDangKy_Id  (TEN - MA)
                   DKH_ThongTin/LayDSLopHocPhanTheoKeHoach  GET  + strDaoTao_HocPhan_Id      (TENLOP - MALOP)
                   danh mục KHDT.DIEM.KIEUHOC
                   D_ThongTin_MH/… pkg_diem_thongtin.LayDSDiem_ThanhPhanDiem  dLaThanhPhanDiemCuoi -1, 1/100000
     Lớp quản lý sử dụng   DKH_DangKyThi_MonThi_ThongTin/
                   LayDSDangKy_Thi_LopQuanLy   GET  strTuKhoa "", 1/100000
                   Them_DangKy_Thi_LopQuanLy   strDaoTao_ChuongTrinh_Id, _LopQuanLy_Id, _KhoaDaoTao_Id, _HeDaoTao_Id
                   Xoa_DangKy_Thi_LopQuanLy    strId
         ô của hộp "Thêm": genBoLoc_HeKhoa = bản LỌC QUYỀN → ums.ref.cascadeQuyen

   Cặp cha → con: Kế hoạch đăng ký → Học phần → Lớp học phần (khoá tới khi chọn
   tầng trên; gốc nạp sẵn học phần với kế hoạch rỗng); Hệ → Khoá → CT → Lớp (cascadeQuyen).
   Lỗi gốc:
     · Hai nút Xóa / Thêm ở chân hộp "Chưa đăng ký" TRÙNG id với hai nút của hộp
       "Lớp quản lý sử dụng" — jQuery chỉ gắn xử lý cho phần tử đầu tiên, nên hai nút
       của hộp "Chưa đăng ký" chưa bao giờ chạy → giữ nút, đặt disabled; bỏ cột ô
       đánh dấu vô dụng của hộp này.
     · Lưu lớp học phần / lớp quản lý thành công gốc để hộp "Thêm" mở (bấm Lưu lần
       nữa là thêm trùng) — ở đây đóng biểu mẫu và nạp lại danh sách.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, esc = ui.esc, T = ums.tlKh;
    var e = T.e;

    function sel(k, ph, multi) {
        return '<select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' + (multi ? ' multiple' : '') + '>' +
            (multi ? '' : '<option value="">' + esc(ph) + '</option>') + '</select>';
    }
    function ma(x) { return e(x.TEN) + ' - ' + e(x.MA); }
    /* Biểu mẫu TẦNG HAI (pat.formTrang lồng trong thân một pat.formTrang khác): trình xử lý click của khung NGOÀI
       cũng bắt nút [data-ft] của khung TRONG (tra closest('[data-ft]') mà không kiểm nút thuộc khung nào) → bấm
       Đóng / Lưu ở trong là khung ngoài đóng theo / chạy nút cùng số. Chặn nổi bọt của riêng các nút đó.
       Bỏ được khi pat.formTrang tự kiểm `b.closest('.ums-formtrang') === f`. */
    function tangHai(o) {
        var ft = pat.formTrang(o);
        ft.el.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-ft]');
            if (b && b.getAttribute('data-ft') !== 'body') ev.stopPropagation();
        });
        return ft;
    }

    /* ---------- Chưa đăng ký ----------------------------------------------- */
    T.hopChuaDangKy = function (kh) {
        var dlg = ui.dialog({ title: 'Danh sách Chưa đăng ký — ' + e(kh.TENKEHOACH), icon: 'fa-users-between-lines', size: 'xl',
            body: '<div data-f="tbl"></div>' });
        dlg.el.querySelector('.ums-dialog__foot').insertAdjacentHTML('afterbegin',
            '<button type="button" class="ums-btn ums-btn--danger" disabled title="Bản gốc chưa có xử lý cho nút này">' +
                '<i class="fa-light fa-trash-can"></i><span>Xóa</span></button>' +
            '<button type="button" class="ums-btn ums-btn--add" disabled title="Bản gốc chưa có xử lý cho nút này">' +
                '<i class="fa-light fa-plus"></i><span>Thêm</span></button>');
        var tbl = dlg.body.querySelector('[data-f="tbl"]');
        T.dang(tbl);
        ums.api.call({ action: 'DKH_DangKyThi_MonThi_Chung_MH/DSA4BRIFChUzLi8mESkgLBcoDyk0LyYCKTQgBQoP',
            func: 'pkg_dangkythi_monthi_chung.LayDSDKTrongPhamViNhungChuaDK',
            strTuKhoa: '', strDangKy_Thi_HP_KeHoach_Id: kh.ID, strNguoiThucHien_Id: '' })
            .then(function (r) {
                ui.table({ el: tbl, rows: T.ds(r), empty: 'Không có dữ liệu', columns: [
                    { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', cls: 'is-nowrap', render: function (x) { return esc(e(x.HODEM) + ' ' + e(x.TEN)); } },
                    { title: 'Chương trình', prop: 'CHUONGTRINH' },
                    { title: 'Khóa học', prop: 'KHOAHOC', cls: 'is-nowrap' },
                    { title: 'Khoa quản lý', prop: 'KHOAQUANLY' },
                    { title: 'Tên học phần', prop: 'TENHOCPHAN' },
                    { title: 'Mã học phần', prop: 'MAHOCPHAN', cls: 'is-nowrap' },
                    { title: 'Số tín chỉ', prop: 'SOTINCHI', cls: 'is-center' },
                    { title: 'Lớp đăng ký', prop: 'LOPDANGKY' },
                    { title: 'Điểm', prop: 'DIEM', cls: 'is-center' },
                    { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' },
                    { title: 'Điểm quy đổi', prop: 'DIEMQUYDOI', cls: 'is-center' },
                    { title: 'Điểm chữ', prop: 'DIEMCHU', cls: 'is-center' },
                    { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center is-nowrap' }
                ] });
            }).catch(function (err) { T.loi(tbl, err, 'danh sách chưa đăng ký'); });
    };

    /* ---------- Khung chung: bảng + Xoá + Thêm (màn con thay chỗ vùng gốc) ---- */
    function hopDs(kh, o, goc) {
        var dlg = pat.formTrang({
            host: goc,
            title: o.title + ' — ' + e(kh.TENKEHOACH), icon: 'fa-list-dropdown', cols: 1,
            body: '<div data-f="tbl"></div>',
            xoa: { chon: 'input[data-' + o.k + ']', onClick: function (d) {
                var ids = T.daChon(d.body, o.k);
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
                T.xoa(ids.map(function (id) {
                    return { action: T.TT + o.xoa, strId: id, strNguoiThucHien_Id: '' };
                }), nap);
            } },
            buttons: [{ text: 'Thêm', kind: 'add', onClick: function () { moThem(); return false; } }]
        });
        var tbl = dlg.body.querySelector('[data-f="tbl"]');
        /* Biểu mẫu "Thêm" là tầng hai: thay chỗ bảng trong thân khung; lúc đó nút Xoá / Thêm của khung
           danh sách ẩn đi (nút Đóng của khung ngoài do tầng chung tự ẩn — BO-CUC luật 18). */
        function moThem() {
            var nut = Array.prototype.filter.call(dlg.el.querySelectorAll('.ums-panel__tools [data-ft="xoa"], .ums-panel__tools [data-ft="0"]'),
                function (b) { return dlg.el.querySelector('.ums-panel__tools') === b.parentNode && !b.hidden; });
            nut.forEach(function (b) { b.hidden = true; });
            o.them(nap, dlg.body, function () { nut.forEach(function (b) { b.hidden = false; }); });
        }
        T.ganChon(dlg.body);
        function nap() {
            T.dang(tbl);
            ums.api.call({ action: T.TT + o.lay, method: 'GET', strTuKhoa: '', strDangKy_Thi_HP_KeHoach_Id: kh.ID,
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (r) { ui.table({ el: tbl, rows: T.ds(r), empty: 'Không có dữ liệu', columns: o.cot.concat([T.cotChon(o.k)]) }); })
                .catch(function (err) { T.loi(tbl, err, o.title); });
        }
        nap();
    }

    /* ---------- Lớp học phần sử dụng ---------------------------------------- */
    function themLHP(kh, xong, goc, khiDong) {
        var dlg = tangHai({
            host: goc, onClose: khiDong,
            title: 'Thêm', icon: 'fa-plus',
            body: ui.field('Kế hoạch đăng ký học', sel('kh', 'Chọn kế hoạch đăng ký')) +
                ui.field('Học phần', sel('hp', 'Chọn học phần')) +
                ui.field('Lớp học phần', sel('lhp', 'Chọn lớp học phần')) +
                ui.field('Kiểu học', sel('kieu', 'Chọn kiểu học')) +
                ui.field('Thành phần điểm', sel('tpd', 'Chọn thành phần điểm')),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                ums.api.call({
                    action: T.TT + 'Them_DangKy_Thi_LopHocPhan',
                    strDangKy_Thi_HP_KeHoach_Id: kh.ID,
                    strDaoTao_HocPhan_Id: f('hp').value,
                    strDaoTao_LopHocPhan_Id: f('lhp').value,
                    strKieuHoc_Id: f('kieu').value,
                    strDangKy_KeHoachDangKy_Id: f('kh').value,
                    strDiem_ThanhPhanDiem_Id: f('tpd').value,
                    strNguoiThucHien_Id: ''
                }).then(function () { ui.toast('Thực hiện thành công', 'ok'); d.close(); xong(); })
                  .catch(function (err) { ums.api.handle(err, 'thêm lớp học phần sử dụng'); });
                return false;
            } }]
        });
        function f(k) { return dlg.body.querySelector('[data-f="' + k + '"]'); }
        function fail(noi) { return function (err) { ums.api.handle(err, noi); }; }

        ums.api.call({ action: 'DKH_KeHoachDangKy/LayDanhSach', method: 'GET', silent: true, strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(f('kh'), T.ds(r), { name: 'TENKEHOACH' }); }).catch(fail('kế hoạch đăng ký'));
        ums.api.dm('KHDT.DIEM.KIEUHOC').then(function (r) { pat.fill(f('kieu'), r); }).catch(fail('kiểu học'));
        ums.api.call({ action: 'D_ThongTin_MH/DSA4BRIFKCQsHhUpIC8pESkgLwUoJCwP', func: 'pkg_diem_thongtin.LayDSDiem_ThanhPhanDiem', silent: true,
            strTuKhoa: '', strThangDiem_Id: '', dLaThanhPhanDiemCuoi: -1, strQuyTacLamTron_Id: '', strChucNang_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(f('tpd'), T.ds(r)); }).catch(fail('thành phần điểm'));

        function napHP() {
            if (!f('kh').value) { pat.fill(f('hp'), []); return; }
            ums.api.call({ action: 'DKH_ThongTin/LayDSHocPhanTheoKeHoach', method: 'GET', silent: true, strDangKy_KeHoachDangKy_Id: f('kh').value })
                .then(function (r) { pat.fill(f('hp'), T.ds(r), { name: ma }); }).catch(fail('học phần'));
        }
        function napLHP() {
            if (!f('hp').value) { pat.fill(f('lhp'), []); return; }
            ums.api.call({ action: 'DKH_ThongTin/LayDSLopHocPhanTheoKeHoach', method: 'GET', silent: true,
                strDangKy_KeHoachDangKy_Id: f('kh').value, strDaoTao_HocPhan_Id: f('hp').value })
                .then(function (r) { pat.fill(f('lhp'), T.ds(r), { name: function (x) { return e(x.TENLOP) + ' - ' + e(x.MALOP); } }); })
                .catch(fail('lớp học phần'));
        }
        if (window.jQuery) {
            jQuery(f('kh')).on('select2:select', function () { napHP(); napLHP(); });
            jQuery(f('hp')).on('select2:select', napLHP);
        }
        pat.chain([f('kh'), f('hp'), f('lhp')]);
    }

    T.hopLopHocPhan = function (kh, goc) {
        hopDs(kh, {
            title: 'Lớp học phần sử dụng', k: 'lhp',
            lay: 'LayDSDangKy_Thi_LopHocPhan', xoa: 'Xoa_DangKy_Thi_LopHocPhan',
            cot: [
                { title: 'Kế hoạch đăng ký', prop: 'DANGKY_KEHOACHDANGKY_TEN' },
                { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } },
                { title: 'Lớp học phần', prop: 'DAOTAO_LOPHOCPHAN_TEN' },
                { title: 'Kiểu học', prop: 'KIEUHOC_TEN' },
                { title: 'Thành phần điểm', prop: 'DIEM_THANHPHANDIEM_TEN' }
            ],
            them: function (nap, host, khiDong) { themLHP(kh, nap, host, khiDong); }
        }, goc);
    };

    /* ---------- Lớp quản lý sử dụng ----------------------------------------- */
    function themLQL(kh, xong, goc, khiDong) {
        var dlg = tangHai({
            host: goc, onClose: khiDong,
            title: 'Thêm', icon: 'fa-pen-field',
            body: ui.field('Hệ đào tạo', sel('he', 'Chọn hệ đào tạo')) +
                ui.field('Khóa đào tạo', sel('khoa', 'Chọn khóa đào tạo')) +
                ui.field('Chương trình', sel('ct', 'Chọn chương trình đào tạo')) +
                ui.field('Lớp quản lý', sel('lop', 'Chọn lớp')),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                ums.api.call({
                    action: T.TT + 'Them_DangKy_Thi_LopQuanLy',
                    strDangKy_Thi_HP_KeHoach_Id: kh.ID,
                    strDaoTao_ChuongTrinh_Id: f('ct').value,
                    strDaoTao_LopQuanLy_Id: f('lop').value,
                    strDaoTao_KhoaDaoTao_Id: f('khoa').value,
                    strDaoTao_HeDaoTao_Id: f('he').value,
                    strNguoiThucHien_Id: ''
                }).then(function () { ui.toast('Thực hiện thành công', 'ok'); d.close(); xong(); })
                  .catch(function (err) { ums.api.handle(err, 'thêm lớp quản lý sử dụng'); xong(); });
                return false;
            } }]
        });
        function f(k) { return dlg.body.querySelector('[data-f="' + k + '"]'); }
        ums.ref.cascadeQuyen({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop') });
    }

    T.hopLopQuanLy = function (kh, goc) {
        hopDs(kh, {
            title: 'Lớp quản lý sử dụng', k: 'lql',
            lay: 'LayDSDangKy_Thi_LopQuanLy', xoa: 'Xoa_DangKy_Thi_LopQuanLy',
            cot: [
                { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' },
                { title: 'Khóa đào tạo', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' }
            ],
            them: function (nap, host, khiDong) { themLQL(kh, nap, host, khiDong); }
        }, goc);
    };
})();
