/* =========================================================================
   Kế hoạch đăng ký — các HỘP THOẠI phụ
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky (html #myModal, #myModal_khongdangky,
            #myModalPCNhomKiemSoat, #myModalPCChuongTrinh, #myModalPCKhoaHoc;
            script: getList_QuanSoTheoLop, getList_KhongDangKy, exportExcel_KhongDangKy,
            save_PhanCong / save_PhanCongKH / save_PhanCongCT, save_ChuyenDuLieu,
            getList_HeDaoTao, getList_KhoaDaoTao, getList_ChuongTrinh)
   ---------------------------------------------------------------------------
   ums.khdk.dsDangKy(keHoachId)        Danh sách đăng ký
       DKH_KeHoachDangKy/LayDSNguoiHocDangKy_KeHoach  GET  strTuKhoa '' (gốc đọc #txtAAAA — không có) ·
                                                           pageIndex 1 · pageSize 100000
   ums.khdk.dsKhongDangKy(keHoachId)   Danh sách không đăng ký + Xuất Excel
       DKH_BaoCao/LayDSKhongDangKy                    GET
   ums.khdk.phanCong(kieu, keHoachId)  kieu = 'nks' | 'kh' | 'ct'
       hệ:  edu.system.getList_HeDaoTao (ums.ref.heDaoTao, KHÔNG lọc quyền — như gốc)
       khoá: PKG_DANGKYHOC_THONGTIN2.LayDSKhoaDaoTao      (strDaoTao_HeDaoTao_Id, strDangKy_KeHoachDangKy_Id)
       CT:   PKG_DANGKYHOC_THONGTIN2.LayDSChuongTrinh     (+ strDaoTao_KhoaDaoTao_Id)
       lưu mỗi dòng đánh dấu một lời gọi (strViApDung_Id = ID dòng):
         nks → pkg_dangkyhoc_thongtin.PhanCongTheoNhomKiemSoat
         kh  → pkg_dangkyhoc_thongtin.PhanCongTuDongTheoKhoaDaoTao
         ct  → pkg_dangkyhoc_thongtin.PhanCongTuDongTheoChuongTrinh
   ums.khdk.chuyenDuLieu(keHoachId)    DKH_KeHoachDangKy/ChuyenDuLieuTKBSangDKH  POST

   Khoá `type: 'GET' | 'POST'` nằm TRONG obj gửi đi của gốc (LayDSKhongDangKy,
   ChuyenDuLieuTKBSangDKH) nên máy chủ nhận thêm tham số `type` — giữ nguyên.
   strChucNang_Id / strNguoiThucHien_Id của gốc = giá trị hệ thống → để trống,
   ums.api.call tự điền đúng như gốc.

   Khác gốc:
     · Xuất Excel DS không đăng ký: gốc tải thư viện xlsx-js-style từ ba CDN rồi ghi
       .xlsx có tô màu; ở đây ums.ui.xuatXls (không phụ thuộc CDN), cùng 9 cột, cùng
       tên tệp DSKhongDangKy_<yyyyMMdd_HHmm>. Phím tắt Ctrl+G gốc gắn lên document —
       ở đây gắn trên chính hộp thoại (luật: không gắn sự kiện lên document).
     · Phân công: gốc bắn N lời gọi cùng lúc, mỗi lời gọi một thông báo; ở đây
       ums.ui.batch có tiến độ, báo gộp một lần.
     · Hệ → Khoá (mức chương trình): chưa chọn Hệ thì khoá Khoá; xoá Hệ / Khoá thì
       bảng về lời nhắc (luật cha → con). Gốc dùng CHUNG một lời gọi khoá để đổ cùng
       lúc vào ba nơi (bảng NKS, bảng khoá học, ô khoá của hộp CT) — ở đây hộp nào
       nạp riêng hộp ấy.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var K = ums.khdk = ums.khdk || {};
    function e(v) { return v === undefined || v === null ? '' : v; }
    function qa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    function rs(r) { return Array.isArray(r.data) ? r.data : []; }

    /* ---------- Danh sách đăng ký --------------------------------------------- */
    K.dsDangKy = function (id) {
        var dlg = ui.dialog({ title: 'Danh sách đăng ký', icon: 'fa-user-pen', size: 'xl', body: '<div data-z="t">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var host = dlg.body.querySelector('[data-z="t"]');
        ums.api.call({
            action: 'DKH_KeHoachDangKy/LayDSNguoiHocDangKy_KeHoach', method: 'GET',
            strTuKhoa: '', strDangKy_KeHoachDangKy_Id: id, strNguoiThucHien_Id: '',
            pageIndex: 1, pageSize: 100000
        }).then(function (r) {
            ui.table({
                el: host, rows: rs(r), empty: 'Chưa có người học đăng ký',
                columns: [
                    { title: 'Mã số sinh viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' },
                    { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-nowrap' },
                    { title: 'Mã lớp', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên lớp', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                    { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Kiểu học', prop: 'KIEUHOC_TEN' },
                    { title: 'Số tín chỉ', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center' }
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách đăng ký'); });
    };

    /* ---------- Danh sách không đăng ký --------------------------------------- */
    K.dsKhongDangKy = function (id) {
        var ds = [];
        function xuat() {
            if (!ds.length) { ui.toast('Không có dữ liệu để xuất.', 'warn'); return; }
            var d = new Date();
            function p(n) { return n < 10 ? '0' + n : n; }
            var stamp = d.getFullYear() + '' + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes());
            ui.xuatXls('DSKhongDangKy_' + stamp + '.xls', {
                tieuDe: 'Danh sách không đăng ký',
                dong: ds,
                cot: [
                    { title: 'STT', get: function (r, i) { return i + 1; } },
                    { title: 'Mã số sinh viên', prop: 'QLSV_NGUOIHOC_MASO' },
                    { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' },
                    { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                    { title: 'Trạng thái', prop: 'QLSV_TRANGTHAI_TEN' },
                    { title: 'Nợ phí', get: function (r) { return Number(r.TONGNOPHI) || 0; } },
                    { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                    { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' }
                ]
            });
        }
        var dlg = ui.dialog({
            title: 'Danh sách không đăng ký', icon: 'fa-user-pen', size: 'xl',
            body: '<div data-z="t">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'Xuất Excel (Ctrl+G)', kind: 'excel', keepOpen: true, onClick: function () { xuat(); return false; } }]
        });
        dlg.el.addEventListener('keydown', function (ev) {
            if (/^(input|textarea|select)$/i.test((ev.target && ev.target.tagName) || '')) return;
            if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'g' || ev.key === 'G')) { ev.preventDefault(); xuat(); }
        });
        var host = dlg.body.querySelector('[data-z="t"]');
        ums.api.call({
            action: 'DKH_BaoCao/LayDSKhongDangKy', method: 'GET', type: 'GET',
            strDangKy_KeHoachDangKy_Id: id, strNguoiThucHien_Id: ''
        }).then(function (r) {
            ds = rs(r);
            ui.table({
                el: host, rows: ds, empty: 'Không có sinh viên không đăng ký',
                columns: [
                    { title: 'Mã số sinh viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' },
                    { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                    { title: 'Trạng thái', prop: 'QLSV_TRANGTHAI_TEN' },
                    { title: 'Nợ phí', cls: 'is-right is-nowrap', render: function (x) { return esc(ui.money(x.TONGNOPHI)); } },
                    { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                    { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' }
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách không đăng ký'); });
    };

    /* ---------- Phân công theo nhóm kiểm soát (3 mức) ------------------------ */
    var PC = {
        nks: { title: 'Phân công theo nhóm kiểm soát', icon: 'fa-users-rectangle',
               action: 'DKH_ThongTin_MH/ESkgLwIuLyYVKSQuDykuLAooJCwSLiA1', func: 'pkg_dangkyhoc_thongtin.PhanCongTheoNhomKiemSoat' },
        kh:  { title: 'Phân công theo nhóm kiểm soát(mức khóa học)', icon: 'fa-user-chart',
               action: 'DKH_ThongTin_MH/ESkgLwIuLyYVNAUuLyYVKSQuCikuIAUgLhUgLgPP', func: 'pkg_dangkyhoc_thongtin.PhanCongTuDongTheoKhoaDaoTao' },
        ct:  { title: 'Phân công theo nhóm kiểm soát(mức chương trình)', icon: 'fa-poll-people',
               action: 'DKH_ThongTin_MH/ESkgLwIuLyYVNAUuLyYVKSQuAik0Li8mFTMoLykP', func: 'pkg_dangkyhoc_thongtin.PhanCongTuDongTheoChuongTrinh' }
    };

    K.phanCong = function (kieu, id) {
        var cfg = PC[kieu];
        var laCT = kieu === 'ct';
        var rows = [];
        var dlg = ui.dialog({
            title: cfg.title, icon: cfg.icon, size: laCT ? 'lg' : 'md',
            body:
                '<div class="ums-filter">' +
                    '<div class="ums-field"><select class="ums-select" data-f="he" data-ph="Chọn hệ đào tạo"><option value="">Chọn hệ đào tạo</option></select></div>' +
                    (laCT ? '<div class="ums-field"><select class="ums-select" data-f="khoa" data-ph="Chọn khóa đào tạo"><option value="">Chọn khóa đào tạo</option></select></div>' : '') +
                '</div>' +
                '<div class="ums-u-mt-4" data-z="t"></div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) { return luu(d); } }]
        });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-f="' + k + '"]'); }
        var host = B.querySelector('[data-z="t"]');
        ui.enhance(B);

        function nhac() {
            host.innerHTML = ui.empty(laCT ? 'Chọn hệ đào tạo và khóa đào tạo để xem danh sách chương trình' : 'Chọn hệ đào tạo để xem danh sách khóa', 'fa-hand-pointer');
            rows = [];
        }
        function ve() {
            ui.table({
                el: host, rows: rows, empty: 'Không có dữ liệu',
                columns: [
                    { title: laCT ? 'Mã chương trình' : 'Mã khóa', prop: laCT ? 'MACHUONGTRINH' : 'MAKHOA', cls: 'is-nowrap' },
                    { title: laCT ? 'Tên chương trình' : 'Tên khóa', prop: laCT ? 'TENCHUONGTRINH' : 'TENKHOA' },
                    { head: '<input type="checkbox" data-pc="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r, i) { return '<input type="checkbox" data-pc="' + i + '">'; } }
                ]
            });
        }
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches || !t.matches('input[data-pc]')) return;
            if (t.getAttribute('data-pc') === 'all') qa(host, 'tbody input[data-pc]').forEach(function (x) { x.checked = t.checked; });
            else { var a = host.querySelector('input[data-pc="all"]'); if (a) a.checked = qa(host, 'tbody input[data-pc]').every(function (x) { return x.checked; }); }
            qa(host, 'tbody input[data-pc]').forEach(function (x) { var tr = x.closest('tr'); if (tr) tr.classList.toggle('is-selected', x.checked); });
        });

        function napKhoa() {
            return ums.api.call({
                action: 'DKH_ThongTin2_MH/DSA4BRIKKS4gBSAuFSAu', func: 'PKG_DANGKYHOC_THONGTIN2.LayDSKhoaDaoTao',
                strChucNang_Id: '', strDaoTao_HeDaoTao_Id: f('he').value, strDangKy_KeHoachDangKy_Id: id, strNguoiThucHien_Id: ''
            }).then(rs);
        }
        function napCT() {
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({
                action: 'DKH_ThongTin2_MH/DSA4BRICKTQuLyYVMygvKQPP', func: 'PKG_DANGKYHOC_THONGTIN2.LayDSChuongTrinh',
                strChucNang_Id: '', strDaoTao_HeDaoTao_Id: f('he').value || undefined,
                strDaoTao_KhoaDaoTao_Id: f('khoa').value || undefined,
                strDangKy_KeHoachDangKy_Id: id, strNguoiThucHien_Id: ''
            }).then(function (r) { rows = rs(r); ve(); })
              .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'chương trình'); });
        }

        jQuery(f('he')).on('select2:select', function () {
            if (laCT) {
                nhac();
                ums.pat.fill(f('khoa'), [], { head: 'Chọn khóa đào tạo' });
                if (!f('he').value) return;
                napKhoa().then(function (ds) { ums.pat.fill(f('khoa'), ds, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); })
                    .catch(function (err) { ums.api.handle(err, 'khóa đào tạo'); });
                return;
            }
            if (!f('he').value) { nhac(); return; }
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            napKhoa().then(function (ds) { rows = ds; ve(); })
                .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'khóa đào tạo'); });
        });
        if (laCT) {
            jQuery(f('khoa')).on('select2:select', function () { if (f('khoa').value) napCT(); else nhac(); });
            jQuery(f('khoa')).on('select2:clear', nhac);
            ums.pat.chain([f('he'), f('khoa')]);
        } else {
            jQuery(f('he')).on('select2:clear', nhac);
        }
        nhac();

        ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (ds) { ums.pat.fill(f('he'), ds, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); })
            .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });

        function luu(d) {
            var ids = [];
            qa(host, 'tbody input[data-pc]').forEach(function (x) {
                if (x.checked) { var r = rows[Number(x.getAttribute('data-pc'))]; if (r) ids.push(r.ID); }
            });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
            d.close();
            ui.batch(ids.map(function (vid) {
                return {
                    action: cfg.action, func: cfg.func,
                    strChucNang_Id: '', strDangKy_KeHoachDangKy_Id: id, strViApDung_Id: vid, strNguoiThucHien_Id: ''
                };
            }), { title: 'Đang phân công', okText: 'Thực hiện thành công', show: true });
        }
    };

    /* ---------- Chuyển dữ liệu từ TKB sang ĐKH -------------------------------- */
    K.chuyenDuLieu = function (id) {
        ui.confirm('Bạn có chắc chắn muốn chuyển dữ liệu không?', { title: 'Chuyển dữ liệu từ TKB sang ĐKH', ok: 'Chuyển' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({
                action: 'DKH_KeHoachDangKy/ChuyenDuLieuTKBSangDKH', method: 'POST', type: 'POST',
                strChucNang_Id: '', strDangKy_KeHoachDangKy_Id: id, strNguoiThucHien_Id: ''
            }).then(function () { ui.toast('Thực hiện thành công!', 'ok'); })
              .catch(function (err) { ums.api.handle(err, 'chuyển dữ liệu TKB sang ĐKH'); });
        });
    };

})();
