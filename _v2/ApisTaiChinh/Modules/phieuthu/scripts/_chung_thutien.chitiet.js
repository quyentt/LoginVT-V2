/* =========================================================================
   Thu tiền — tab "Tình hình học phí" và "Tình hình tài chính thu hộ"
   (dùng chung cho thutien và viewthutien, nạp sau _chung_thutien.js)
   ---------------------------------------------------------------------------
   Bản gốc (thutien.js):
     genHTML_TongCacKhoanThu              → tongQuat()  11 thẻ tổng
     getList_Khoan* / genDetail_*         → mo(loai)    bảng chi tiết dưới các thẻ
       TC_ThongTinChung/LayDSKhoanPhaiNop · LayDSKhoanMien · LayDSKhoanDaNop ·
       LayDSKhoanDaRut · LayDSKhoanNoRieng · LayDSKhoanNoChung · LayDSKhoanDuRieng ·
       LayDSKhoanDuChung · LayDSPhieuDaThu · LayDSPhieuDaRut · LayDSPhieuHoaDon     (GET)
       TC_ThongTin/LayDSKhoanDaRut_Rieng (GET)
     getList_ChiTietKhoanPhaiNop / Mien → chiTietKhoan()
       TC_KhoanPhaiNop/LayDSDienDaiChiTietPhaiNop · TC_KhoanMien/LayDSDienDaiChiTietMien (GET)
     viewForm_* + save_* + delete_*       → sua()  (chỉ thutien)
       TC_ThongTin/Sua_TaiChinh_PhaiNop     TC_KhoanPhaiNop/Xoa
       TC_ThongTin/Sua_TaiChinh_Mien        TC_KhoanMien/Xoa
       TC_ThongTin/Sua_TaiChinh_DaNop       TC_KhoanDaNop/Xoa
       TC_ThongTin/Sua_TaiChinh_Rut         TC_KhoanRut/Xoa
       TC_ThongTin/Sua_TaiChinh_Rut_Rieng   TC_ThongTin/Xoa_TaiChinh_Rut_Rieng
       TC_ThongTin/Sua_TaiChinh_PhaiNop_Rieng  TC_KhoanPhaiNop/Xoa_TaiChinh_PhaiNop_Rieng
       TC_ThongTin_MH/EjQgHhUgKAIpKC8pHgUgDy4xHhMoJC8m pkg_taichinh_thongtin.Sua_TaiChinh_DaNop_Rieng
                                            TC_KhoanDaNop/Xoa_TaiChinh_DaNop_Rieng
     btnDetail_XemThongTinAll             → xemTatCa()  (chỉ thutien)
     tab 8: getList_DaNopRieng · PhaiNopRieng · HoaDonRieng · PhieuThuRieng · KhoanRutRieng
       TC_ThongTinChung/LayDSKhoanDaNopRieng · LayDSKhoanPhaiNopRieng ·
       LayDSPhieuHoaDonRieng · LayDSPhieuDaThuRieng (GET)
     genTable_TheoDot                     → theoDot()

   Lỗi bản gốc đã sửa (ghi rõ trong báo cáo):
     · genTable_TheoDot cộng arrDot_No[i] (chỉ số đợt) thay vì [j] → tổng
       theo đợt sai; và $("#tab_8").html(row) ghi đè cả tab 8 (mất 5 bảng thu
       hộ). Ở đây cộng đúng từng dòng, hiện trong một mục riêng của tab 8.
     · genTable_ChiTietKhoanPhaiNop gọi insertSumAfterTable(strTableId) với
       biến không tồn tại (ReferenceError, không có dòng tổng) — thêm dòng tổng.
     · Nút xoá trong hộp sửa hiện lỗi "[object Object]: …" — hiện thông báo máy chủ.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var TT = ums.phieuthu.thuTien;
    var M = TT.money;

    var PAGED = { pageIndex: 1, pageSize: 1000000000 };

    /* 11 thẻ tổng: cột trong rsThongTin[0] */
    var THE = [
        { k: 'phaiNop',  lbl: 'Khoản phải nộp',            col: 'TONGKHOANPHAINOP', icon: 'fa-file-invoice-dollar', m: 'green' },
        { k: 'mien',     lbl: 'Khoản được miễn',           col: 'TONGKHOANDUOCMIEN', icon: 'fa-hand-holding-heart', m: 'purple' },
        { k: 'daNop',    lbl: 'Khoản đã nộp',              col: 'TONGKHOANDANOP', icon: 'fa-sack-dollar', m: '' },
        { k: 'daRut',    lbl: 'Khoản đã rút',              col: 'TONGKHOANDARUT', icon: 'fa-money-from-bracket', m: 'amber' },
        { k: 'noRieng',  lbl: 'Tổng nợ riêng các khoản',   col: 'TONGNORIENG', icon: 'fa-hand-holding-dollar', m: 'red' },
        { k: 'noChung',  lbl: 'Tổng nợ chung các khoản',   col: 'TONGNOCHUNG', icon: 'fa-hands-holding-dollar', m: 'red' },
        { k: 'duRieng',  lbl: 'Tổng dư riêng các khoản',   col: 'TONGDURIENG', icon: 'fa-badge-dollar', m: 'green' },
        { k: 'duChung',  lbl: 'Tổng dư chung các khoản',   col: 'TONGDUCHUNG', icon: 'fa-circle-dollar', m: 'green' },
        { k: 'phieuThu', lbl: 'Danh sách phiếu đã thu',    col: 'TONGTIENPHIEUTHU', icon: 'fa-receipt', m: '' },
        { k: 'phieuRut', lbl: 'Danh sách phiếu đã rút',    col: 'TONGTIENPHIEURUT', icon: 'fa-file-export', m: 'amber' },
        { k: 'hoaDon',   lbl: 'Danh sách phiếu hóa đơn',   col: 'TONGTIENHOADON', icon: 'fa-file-invoice', m: 'purple' }
    ];

    /* Bảng chi tiết: lời gọi + loại cột */
    var LOAI = {
        phaiNop:  { t: 'Khoản phải nộp', a: 'TC_ThongTinChung/LayDSKhoanPhaiNop', kieu: 'khoan', ct: 'phaiNop', sua: 'phaiNop', cam: true },
        mien:     { t: 'Khoản được miễn', a: 'TC_ThongTinChung/LayDSKhoanMien', kieu: 'khoan', ct: 'mien', sua: 'mien', cam: true, mien: true, tienLbl: 'Số tiền được miễn' },
        daNop:    { t: 'Khoản đã nộp', a: 'TC_ThongTinChung/LayDSKhoanDaNop', kieu: 'khoan', sua: 'daNop', cam: true, chungTu: true },
        daRut:    { t: 'Khoản đã rút', a: 'TC_ThongTinChung/LayDSKhoanDaRut', kieu: 'khoan', sua: 'daRut', cam: true },
        noRieng:  { t: 'Khoản nợ riêng', a: 'TC_ThongTinChung/LayDSKhoanNoRieng', kieu: 'khoan', paged: true },
        noChung:  { t: 'Khoản nợ chung', a: 'TC_ThongTinChung/LayDSKhoanNoChung', kieu: 'khoan', paged: true, maDD: true },
        duRieng:  { t: 'Khoản dư riêng', a: 'TC_ThongTinChung/LayDSKhoanDuRieng', kieu: 'khoan', paged: true },
        duChung:  { t: 'Dư chung', a: 'TC_ThongTinChung/LayDSKhoanDuChung', kieu: 'khoan', paged: true },
        phieuThu: { t: 'Phiếu đã thu', a: 'TC_ThongTinChung/LayDSPhieuDaThu', kieu: 'phieu', paged: true, xem: 'BIENLAI' },
        phieuRut: { t: 'Phiếu đã rút', a: 'TC_ThongTinChung/LayDSPhieuDaRut', kieu: 'phieuRut', paged: true, xem: 'BIENLAI' },
        hoaDon:   { t: 'Hóa đơn', a: 'TC_ThongTinChung/LayDSPhieuHoaDon', kieu: 'hoaDon', paged: true, xem: 'HOADON' },
        rutRieng: { t: 'Khoản đã rút', a: 'TC_ThongTin/LayDSKhoanDaRut_Rieng', kieu: 'khoan', sua: 'rutRieng' }
    };

    /* Hộp sửa: trường nào có, lời gọi lưu / xoá */
    var F_DAY_DU = ['kt', 'tg', 'httt', 'soTien', 'ngayTao', 'noiDung', 'kht'];
    var F_PHAI_NOP = ['kt', 'tg', 'soTien', 'noiDung', 'kht'];
    var SUA = {
        phaiNop:      { t: 'Khoản phải nộp', f: F_PHAI_NOP, luu: { action: 'TC_ThongTin/Sua_TaiChinh_PhaiNop' }, xoa: 'TC_KhoanPhaiNop/Xoa', nap: 'phaiNop' },
        mien:         { t: 'Khoản miễn', f: F_DAY_DU, luu: { action: 'TC_ThongTin/Sua_TaiChinh_Mien', type: 'POST', dCoCapNhatChoChungTu: 1 }, xoa: 'TC_KhoanMien/Xoa', nap: 'mien' },
        daNop:        { t: 'Khoản đã nộp', f: F_DAY_DU, luu: { action: 'TC_ThongTin/Sua_TaiChinh_DaNop', dCoCapNhatChoChungTu: 1 }, xoa: 'TC_KhoanDaNop/Xoa', nap: 'daNop' },
        daRut:        { t: 'Khoản đã rút', f: F_DAY_DU, luu: { action: 'TC_ThongTin/Sua_TaiChinh_Rut', dCoCapNhatChoChungTu: 1 }, xoa: 'TC_KhoanRut/Xoa', nap: 'daRut' },
        rutRieng:     { t: 'Khoản đã rút', f: F_DAY_DU, luu: { action: 'TC_ThongTin/Sua_TaiChinh_Rut_Rieng', dCoCapNhatChoChungTu: 1 }, xoa: 'TC_ThongTin/Xoa_TaiChinh_Rut_Rieng', nap: 'rutRieng' },
        phaiNopRieng: { t: 'Khoản phải nộp', f: F_PHAI_NOP, luu: { action: 'TC_ThongTin/Sua_TaiChinh_PhaiNop_Rieng' }, xoa: 'TC_KhoanPhaiNop/Xoa_TaiChinh_PhaiNop_Rieng', nap: 'tab8' },
        daNopRieng:   { t: 'Khoản đã nộp', f: F_DAY_DU, luu: { action: 'TC_ThongTin_MH/EjQgHhUgKAIpKC8pHgUgDy4xHhMoJC8m', func: 'pkg_taichinh_thongtin.Sua_TaiChinh_DaNop_Rieng', dCoCapNhatChoChungTu: 1 }, xoa: 'TC_KhoanDaNop/Xoa_TaiChinh_DaNop_Rieng', nap: 'tab8' }
    };

    function tong(rows, col) { return M.tong(rows.map(function (r) { return M.fmt(r[col]); })); }

    TT.chiTiet = function (c) {
        var cfg = c.cfg;
        var pane = c.el.pane_tt;
        var dang = '';               // loại đang mở ở tab 1
        var cache = {};              // dữ liệu từng loại (dtKhoanPhaiNop, dtKhoanMien…)

        /* Chi tiết từng loại (bấm thẻ số liệu hoặc nút "Chi tiết" cạnh tổng nợ ở các tab) mở trong HỘP THOẠI — trước đây
           đổ bảng xuống dưới tab Tình hình học phí và nhảy tab, người đang ở tab khác mất chỗ (người dùng 2026-09-26). */
        pane.innerHTML = '<div class="thutien-cards" data-c="the"></div>';
        var q = function (s) { return pane.querySelector('[data-c="' + s + '"]'); };
        var dlgCT = null;
        function ctHost() { return dlgCT && !dlgCT.closed ? dlgCT.body.querySelector('[data-c="ctBang"]') : null; }

        function the() {
            var t = c.thongTin || {};
            var h = THE.map(function (x) {
                var v = t[x.col];
                // floatValid → formatCurrency, không thì 0 (TONGDUCHUNG luôn formatCurrency — như bản gốc)
                var s = M.floatValid(v) || x.col === 'TONGDUCHUNG' ? M.fmt(v) : '0';
                return '<div class="ums-stat' + (x.m ? ' ums-stat--' + x.m : '') + '" data-mo="' + x.k + '" role="button" tabindex="0">' +
                    '<div class="ums-stat__icon"><i class="fa-light ' + x.icon + '"></i></div>' +
                    '<div><div class="ums-stat__value">' + esc(s) + '</div><div class="ums-stat__label">' + esc(x.lbl) + '</div></div></div>';
            }).join('');
            if (cfg.xemTatCa) {
                h += '<div class="ums-stat" data-mo="tatCa" role="button" tabindex="0"><div class="ums-stat__icon"><i class="fa-light fa-memo-circle-info"></i></div>' +
                    '<div><div class="ums-stat__value">Xem thông tin</div><div class="ums-stat__label">Tất cả các khoản</div></div></div>';
            }
            q('the').innerHTML = h;
        }

        /* ---------- cột chung ---------------------------------------------- */
        function cotKhoan(L, suaKey) {
            var cols = [
                { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-nowrap' },
                { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
                { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Nội dung', cls: 'thutien-nd', render: function (r) {
                    return '<span title="' + esc(r.NOIDUNG) + '">' + esc(M.noiDungNgan(r.NOIDUNG, r.SOTIEN)) + '</span>';
                } }
            ];
            if (L.mien && cfg.cotMien) cols.push({ title: 'Chính sách', prop: 'CHEDOCHINHSACH_TEN', cls: 'is-nowrap' });
            cols.push({ title: L.tienLbl || 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return esc(M.fmt(r.SOTIEN)); },
                sum: function (rows) { return '<b>' + esc(tong(rows, 'SOTIEN')) + '</b>'; } });
            if (L.mien && cfg.cotMien) cols.push({ title: 'Phần trăm miễn', prop: 'PHANTRAMMIEN', cls: 'is-center' });
            if (L.chungTu) cols.push({ title: 'Số chứng từ', prop: 'CHUNGTU_SO', cls: 'is-center' });
            cols.push({ title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                { title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU' });
            if (L.maDD && cfg.qr) cols.push({ title: 'Mã thanh toán định danh', prop: 'MATHANHTOANDINHDANH' });
            if (cfg.suaXoa && (L.ct || suaKey)) {
                cols.push({ title: '', cls: 'is-actions is-nowrap', render: function (r, i) {
                    return (L.ct ? '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-ctk="' + i + '"><i class="fa-light fa-eye"></i><span>Chi tiết</span></button>' : '') +
                        (suaKey ? ui.iconBtn('edit').replace('data-act="edit"', 'data-sua="' + i + '"') : '');
                } });
            }
            return cols;
        }
        function cotPhieu(L) {
            var nt = function (r) { return esc((cfg.nguoiThuNTT && c.ntt) || M.e(r.TAIKHOAN_NGUOITHU)); };
            var tien = { title: 'Tổng tiền', cls: 'is-right is-nowrap', render: function (r) { return esc(M.fmt(r.TONGTIEN)); },
                sum: function (rows) { return '<b>' + esc(tong(rows, 'TONGTIEN')) + '</b>'; } };
            var xem = { title: 'Chi tiết', cls: 'is-center', render: function (r) {
                return '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-xem="' + esc(r.ID) + '" data-loai="' + L.xem + '"><i class="fa-light fa-eye"></i><span>Chi tiết</span></button>';
            } };
            if (L.kieu === 'phieuRut') {
                return [
                    { title: 'Số phiếu', prop: 'SOPHIEUTHU', cls: 'is-center' },
                    { title: 'Seri', prop: 'KYHIEU', cls: 'is-center' },
                    { title: 'Loại khoản', prop: 'KHOANTHU' },
                    { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-nowrap' },
                    { title: 'Đợt học', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
                    { title: 'Nội dung', prop: 'NOIDUNG' },
                    tien,
                    { title: 'Ngày thu', prop: 'NGAYTHU_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Người thu', prop: 'TAIKHOAN_NGUOIRUT' },
                    xem
                ];
            }
            return [
                { title: 'Số phiếu', prop: L.kieu === 'hoaDon' ? 'SOHOADON' : 'SOPHIEUTHU', cls: 'is-center' },
                tien,
                { title: 'Ngày thu', prop: 'NGAYTHU_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                { title: 'Người thu', render: nt },
                xem
            ];
        }

        function veBang(host, L, rows, suaKey) {
            var cols = L.kieu === 'khoan' ? cotKhoan(L, suaKey) : cotPhieu(L);
            ui.table({ el: host, columns: cols, rows: rows, tableCls: 'ums-table--lined thutien-t' });
            if (L.cam && cfg.suaXoa) {
                host.querySelectorAll('tbody tr').forEach(function (tr, i) {
                    if (rows[i] && rows[i].KHONGHACHTOAN == 1) tr.classList.add('is-khonght');   // eslint-disable-line eqeqeq
                });
            }
            host.setAttribute('data-sua-key', suaKey || '');
            host._rows = rows;
        }

        function napLoai(k) {
            var L = LOAI[k];
            var o = { action: L.a, method: 'GET', versionAPI: 'v1.0', strQLSV_NguoiHoc_Id: c.hsId, strNguoiThucHien_Id: '' };
            if (L.paged) { o.pageIndex = PAGED.pageIndex; o.pageSize = PAGED.pageSize; }
            var hs = c.hsId;
            return c.call(o).then(function (r) {
                if (hs !== c.hsId) return null;
                cache[k] = r.data || [];
                return cache[k];
            });
        }

        /* ---------- mở bảng chi tiết dưới các thẻ -------------------------- */
        function mo(k) {
            if (k === 'tatCa') return xemTatCa();
            var L = LOAI[k];
            if (!L) return;
            dang = k;
            var tieuDe = 'Chi tiết ' + L.t.toLowerCase();
            if (!dlgCT || dlgCT.closed) {
                dlgCT = ui.dialog({ title: tieuDe, icon: 'fa-list-ul', size: 'xl', body: '<div data-c="ctBang"></div>',
                    onClose: function () { dang = ''; } });
                dlgCT.body.addEventListener('click', nutBang);   // Chi tiết khoản / Sửa / Xem phiếu trong bảng
            } else {
                var tt = dlgCT.el.querySelector('.ums-dialog__title');
                if (tt) tt.innerHTML = '<i class="fa-light fa-list-ul"></i> ' + esc(tieuDe);
            }
            var host = ctHost();
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            napLoai(k).then(function (rows) {
                var h = ctHost();
                if (!rows || dang !== k || !h) return;
                veBang(h, L, rows, cfg.suaXoa ? L.sua : '');
            }).catch(function (err) { var h = ctHost(); if (h) h.innerHTML = ''; ums.api.handle(err, L.t); });
        }

        pane.addEventListener('click', function (ev) {
            var t = ev.target;
            var m = t.closest('[data-mo]');
            if (m) { mo(m.getAttribute('data-mo')); return; }
        });
        pane.addEventListener('keydown', function (ev) {
            var m = ev.target.closest('[data-mo]');
            if (m && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); mo(m.getAttribute('data-mo')); }
        });

        /* nút trong mọi bảng chi tiết (hộp thoại chi tiết và tab 8) */
        c.el.tabBody.addEventListener('click', nutBang);
        function nutBang(ev) {
            var t = ev.target;
            var x = t.closest('[data-xem]');
            if (x) { TT.phieu.xem(c, x.getAttribute('data-xem'), x.getAttribute('data-loai')); return; }
            var host = t.closest('[data-sua-key]');
            if (!host) return;
            var rows = host._rows || [];
            var s = t.closest('[data-sua]');
            if (s) {
                // bảng nằm trong hộp "Chi tiết …" hay ở tab 8 trong trang — biểu mẫu sửa cần biết để đóng / mở lại hộp
                var tuHop = !!(dlgCT && !dlgCT.closed && dlgCT.body.contains(host));
                sua(host.getAttribute('data-sua-key'), rows[Number(s.getAttribute('data-sua'))], tuHop);
                return;
            }
            var ct = t.closest('[data-ctk]');
            if (ct) chiTietKhoan(dang, rows[Number(ct.getAttribute('data-ctk'))]);
        }

        /* ---------- chi tiết diễn giải khoản phải nộp / miễn ----------------- */
        function chiTietKhoan(k, r) {
            if (!r) return;
            var o = k === 'mien'
                ? { action: 'TC_KhoanMien/LayDSDienDaiChiTietMien', type: 'GET', strTaiChinh_Mien_Id: r.ID }
                : { action: 'TC_KhoanPhaiNop/LayDSDienDaiChiTietPhaiNop', type: 'GET', strTaiChinh_PhaiNop_Id: r.ID };
            o.method = 'GET'; o.versionAPI = 'v1.0'; o.strNguoiThucHien_Id = '';
            var dlg = ui.dialog({ title: 'Chi tiết khoản thu', icon: 'fa-list', size: 'xl', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') });
            c.call(o).then(function (res) {
                if (dlg.closed) return;
                ui.table({
                    el: dlg.body, rows: res.data || [], tableCls: 'ums-table--lined thutien-t',
                    columns: [
                        { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA' },
                        { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                        { title: 'Số tiền', cls: 'is-right', render: function (x) { return esc(M.fmt(x.SOTIEN)); },
                          sum: function (rows) { return '<b>' + esc(tong(rows, 'SOTIEN')) + '</b>'; } },
                        { title: 'Số tín chỉ', prop: 'SOTINCHI', cls: 'is-center' },
                        { title: 'Kiểu học', prop: 'KIEUHOC_TEN' },
                        { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                        { title: 'Lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                        { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' }
                    ]
                });
            }).catch(function (err) { dlg.close(); ums.api.handle(err, 'chi tiết khoản thu'); });
        }

        /* ---------- biểu mẫu sửa / xoá (viewForm_* + save_* + delete_*) ---------
           BO-CUC luật 1: sửa một bản ghi = biểu mẫu NGAY TRONG TRANG, thay chỗ cả màn thu tiền (c.root), không bật hộp thoại.
           Bảng có nút Sửa nằm ở hai nơi:
             · trong HỘP "Chi tiết …" (việc phụ, giữ hộp): đóng hộp → mở biểu mẫu → đóng biểu mẫu (Đóng / Lưu / Xóa xong) thì
               mở lại đúng hộp đó, dữ liệu nạp lại từ máy chủ;
             · tab 8 "thu hộ" trong trang: chỉ mở biểu mẫu, đóng thì về tab như cũ.
           KHÔNG đổi lời gọi / tham số nào của luu / xoa. */
        var vuaMoLai = '';           // loại vừa được mở lại lúc đóng biểu mẫu — để napLai khỏi nạp hộp đó lần hai
        var dmCache = null;
        function danhMucSua() {
            if (dmCache) return dmCache;
            dmCache = ums.api.dm('QLTC.HTTHU').catch(function () { return []; });
            return dmCache;
        }

        function sua(key, r, tuHop) {
            var S = SUA[key];
            if (!S || !r) return;
            vuaMoLai = '';
            var moLai = tuHop ? dang : '';
            if (tuHop && dlgCT && !dlgCT.closed) dlgCT.close();
            var f = {};
            S.f.forEach(function (x) { f[x] = true; });
            var kht = '<select class="ums-select" data-s="kht"><option value="0">Có sử dụng</option><option value="1">Không sử dụng</option></select>';
            var body =
                '<div class="ums-grid ums-grid--2">' +
                ui.field('Khoản thu', '<select class="ums-select" data-s="kt"></select>') +
                ui.field('Thời gian', '<select class="ums-select" data-s="tg"></select>') +
                (f.httt ? ui.field('Hình thức thu', '<select class="ums-select" data-s="httt"><option value="">Đang tải…</option></select>') : '') +
                ui.field('Số tiền', '<input class="ums-input" data-s="soTien">') +
                (f.ngayTao ? ui.field('Ngày tạo', '<input class="ums-input" data-s="ngayTao" placeholder="dd/mm/yyyy">') : '') +
                ui.field('Không hạch toán', kht) +
                '</div>' +
                ui.field('Nội dung', '<textarea class="ums-textarea" rows="5" data-s="noiDung"></textarea>');

            var dlg = ums.pat.formTrang({
                host: c.root, title: 'Chỉnh sửa — ' + S.t, icon: 'fa-pen-to-square', body: body, cols: 1,      // thân đã tự bọc lưới 2 cột
                buttons: [
                    { text: 'Xóa', kind: 'close', mod: 'danger', onClick: function (d) { xoa(S, r, d); return false; } },
                    { text: 'Lưu', kind: 'save', onClick: function (d) { luu(S, r, d); return false; } }
                ],
                onClose: function () { if (moLai) { vuaMoLai = moLai; mo(moLai); } }
            });
            /* Ô chọn được bọc select2 ngay lúc dựng biểu mẫu (khi còn rỗng) → đặt giá trị xong phải báo select2 vẽ lại.
               Chỉ vẽ lại phần hiện — 'change.select2' không bắn change thật, giá trị gửi đi vẫn đọc từ ô gốc như trước. */
            var veLai = function (el) { if (el && window.jQuery) jQuery(el).trigger('change.select2'); };
            var g = function (s) { return dlg.body.querySelector('[data-s="' + s + '"]'); };
            g('kt').innerHTML = '<option value="">Chọn khoản thu</option>' + c.khoanThu.map(function (x) {
                return '<option value="' + esc(x.ID) + '">' + esc(x.TEN) + '</option>';
            }).join('');
            g('tg').innerHTML = '<option value="">Tất cả đợt</option>' + c.thoiGian.map(function (x) {
                return '<option value="' + esc(x.ID) + '">' + esc(x.DAOTAO_THOIGIANDAOTAO) + '</option>';
            }).join('');
            // edu.util.viewValById
            M.setSelect(g('kt'), r.TAICHINH_CACKHOANTHU_ID);
            M.setSelect(g('tg'), r.DAOTAO_THOIGIANDAOTAO_ID);
            g('soTien').value = M.e(r.SOTIEN);
            g('noiDung').value = M.e(r.NOIDUNG);
            M.setSelect(g('kht'), r.KHONGHACHTOAN);
            ['kt', 'tg', 'kht'].forEach(function (k) { veLai(g(k)); });
            if (g('ngayTao')) { g('ngayTao').value = M.e(r.NGAYTAO_DD_MM_YYYY); ui.datepicker(g('ngayTao')); }
            if (g('httt')) {
                danhMucSua().then(function (rows) {
                    var cb = M.combo(rows, {});
                    g('httt').innerHTML = cb.html;
                    M.setSelect(g('httt'), r.HINHTHUCTHU_ID);
                    veLai(g('httt'));
                });
            }
        }

        function giaTri(d, s) {
            var el = d.body.querySelector('[data-s="' + s + '"]');
            if (!el) return undefined;
            var v = el.tagName === 'SELECT' && el.selectedIndex < 0 ? null : el.value;
            return typeof v === 'string' ? v.trim() : v;   // getValById trim
        }

        function luu(S, r, d) {
            var o = {};
            Object.keys(S.luu).forEach(function (k) { o[k] = S.luu[k]; });
            o.strId = r.ID;
            o.strChucNang_Id = '';
            o.dSoTien = giaTri(d, 'soTien');
            o.strNoiDung = giaTri(d, 'noiDung');
            o.strDaoTao_ThoiGianDaoTao_Id = giaTri(d, 'tg');
            o.strDaoTao_CacKhoanThu_Id = giaTri(d, 'kt');
            o.dKhongHachToan = giaTri(d, 'kht');
            if (S.f.indexOf('ngayTao') >= 0) o.strNgayTao = giaTri(d, 'ngayTao');
            if (S.f.indexOf('httt') >= 0) o.strHinhThucThu_Id = giaTri(d, 'httt');
            o.strNguoiThucHien_Id = '';
            c.call(o).then(function () {
                ui.toast('Cập nhật thành công!', 'ok');
                d.close();
                napLai(S.nap);
            }).catch(function (err) { ui.toast(o.action + ' (er): ' + err.message, 'bad'); });
        }

        function xoa(S, r, d) {
            ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu này?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                if (!yes) return;
                c.call({ action: S.xoa, strId: r.ID, strChucNang_Id: '', strNguoiThucHien_Id: '' }).then(function () {
                    ui.toast('Xóa dữ liệu thành công!', 'ok');
                    d.close();
                    napLai(S.nap);
                }).catch(function (err) { ui.toast(err.message, 'bad'); });
            });
        }

        /* lưu/xoá xong: nạp lại đúng danh sách như bản gốc (me.getList_…) */
        function napLai(k) {
            if (k !== 'tab8' && dang === k && vuaMoLai !== k) mo(k);     // hộp vừa mở lại lúc đóng biểu mẫu thì đã nạp mới rồi
            vuaMoLai = '';
            if (k === 'tab8' || c.el.pane_thuHoTT.getAttribute('data-nap') === c.hsId) thuHo(c.el.pane_thuHoTT, true);
        }

        /* ---------- Xem thông tin tất cả (myModalXemThongTinAll) ------------- */
        function xemTatCa() {
            var MUC = [
                { k: 'phaiNop', t: 'Phải nộp', cls: '' },
                { k: 'noChung', t: 'Phải nộp chung', cls: 'ums-u-danger' },
                { k: 'noRieng', t: 'Phải nộp riêng', cls: 'ums-u-danger' },
                { k: 'daNop', t: 'Đã nộp', cls: '' },
                { k: 'mien', t: 'Được miễn', cls: '' },
                { k: 'daRut', t: 'Đã rút', cls: '' },
                { k: 'duChung', t: 'Thừa chung', cls: '' },
                { k: 'duRieng', t: 'Thừa riêng', cls: '' }
            ];
            var dlg = ui.dialog({
                title: 'Xem thông tin', icon: 'fa-memo-circle-info', size: 'xl',
                body: MUC.map(function (m) {
                    return '<details class="thutien-xem" open><summary class="' + m.cls + '">' + esc(m.t) + '</summary><div data-x="' + m.k + '">' +
                        ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div></details>';
                }).join('')
            });
            MUC.forEach(function (m) {
                napLoai(m.k).then(function (rows) {
                    if (!rows || dlg.closed) return;
                    var host = dlg.body.querySelector('[data-x="' + m.k + '"]');
                    // cột rút gọn của genChiTiet*_XemThongTinAll
                    var cols = [
                        { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-nowrap' },
                        { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
                        { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' }
                    ];
                    if (m.k !== 'phaiNop' && m.k !== 'daNop') cols.push({ title: 'Nội dung', render: function (r) { return '<span title="' + esc(r.NOIDUNG) + '">' + esc(M.noiDungNgan(r.NOIDUNG, r.SOTIEN)) + '</span>'; } });
                    cols.push({ title: m.k === 'mien' ? 'Số tiền được miễn' : 'Số tiền', cls: 'is-right', render: function (r) { return esc(M.fmt(r.SOTIEN)); },
                        sum: function (rs) { return '<b>' + esc(tong(rs, 'SOTIEN')) + '</b>'; } });
                    if (m.k === 'daNop') cols.push({ title: 'Số chứng từ', prop: 'CHUNGTU_SO', cls: 'is-center' });
                    if (m.k === 'phaiNop' || m.k === 'daNop') cols.push({ title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' });
                    if (m.k === 'daNop') cols.push({ title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU' });
                    ui.table({ el: host, columns: cols, rows: rows, tableCls: 'ums-table--lined thutien-t' });
                }).catch(function (err) { ums.api.handle(err, m.t); });
            });
        }

        /* ---------- Tab 8: Tình hình tài chính thu hộ ---------------------- */
        var TAB8 = [
            { k: 'daNopRieng', t: '1. Các khoản đã nộp', a: 'TC_ThongTinChung/LayDSKhoanDaNopRieng', L: { kieu: 'khoan', cam: true }, sua: 'daNopRieng' },
            { k: 'phaiNopRieng', t: '2. Các khoản phải nộp', a: 'TC_ThongTinChung/LayDSKhoanPhaiNopRieng', L: { kieu: 'khoan', cam: true }, sua: 'phaiNopRieng' },
            { k: 'hoaDonRieng', t: '3. Danh sách đã xuất hóa đơn', a: 'TC_ThongTinChung/LayDSPhieuHoaDonRieng', L: { kieu: 'hoaDon', xem: 'HOADON' } },
            { k: 'phieuThuRieng', t: '4. Danh sách đã xuất biên lai - phiếu thu', a: 'TC_ThongTinChung/LayDSPhieuDaThuRieng', L: { kieu: 'phieu', xem: 'BIENLAI' } }
        ];
        if (cfg.rutRieng) TAB8.push({ k: 'rutRieng', t: '5. Khoản đã rút', a: 'TC_ThongTin/LayDSKhoanDaRut_Rieng', L: { kieu: 'khoan' }, sua: 'rutRieng' });

        function thuHo(p8, ep) {
            if (!ep && p8.getAttribute('data-nap') === c.hsId) return;
            p8.setAttribute('data-nap', c.hsId);
            var dangTab = p8.getAttribute('data-tab8') || TAB8[0].k;
            p8.innerHTML =
                '<nav class="ums-tabs ums-u-mb-4" style="padding:0">' + TAB8.map(function (x) {
                    return '<a class="ums-tabs__item' + (x.k === dangTab ? ' is-active' : '') + '" href="javascript:void(0)" data-t8="' + x.k + '">' + esc(x.t) + '</a>';
                }).join('') + '</nav>' +
                TAB8.map(function (x) { return '<div data-b8="' + x.k + '"' + (x.k === dangTab ? '' : ' hidden') + '>' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'; }).join('') +
                '<div data-c8="dot"></div>';
            p8.onclick = function (ev) {
                var a = ev.target.closest('[data-t8]');
                if (!a) return;
                var k = a.getAttribute('data-t8');
                p8.setAttribute('data-tab8', k);
                p8.querySelectorAll('[data-t8]').forEach(function (n) { n.classList.toggle('is-active', n === a); });
                p8.querySelectorAll('[data-b8]').forEach(function (n) { n.hidden = n.getAttribute('data-b8') !== k; });
            };
            var hs = c.hsId;
            TAB8.forEach(function (x) {
                c.call({ action: x.a, method: 'GET', versionAPI: 'v1.0', strQLSV_NguoiHoc_Id: hs, strNguoiThucHien_Id: '' })
                    .then(function (r) {
                        if (hs !== c.hsId) return;
                        var host = p8.querySelector('[data-b8="' + x.k + '"]');
                        if (host) veBang(host, x.L, r.data || [], cfg.suaXoa ? x.sua : '');
                    }).catch(function (err) { ums.api.handle(err, x.t); });
            });
            theoDot(p8.querySelector('[data-c8="dot"]'));
        }

        /* genTable_TheoDot — đã sửa chỉ số cộng dồn và không ghi đè tab */
        function theoDot(host) {
            var d = c.theoDot || { dot: [], no: [], du: [] };
            if (!d.dot.length) { host.innerHTML = ''; return; }
            var cols = [
                { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO_HOCKY' },
                { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
                { title: 'Khoản nợ', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Nội dung', prop: 'NOIDUNG' },
                { title: 'Số tiền', cls: 'is-right', render: function (r) { return esc(M.fmt(r.SOTIEN)); },
                  sum: function (rows) {
                      var t = 0;
                      rows.forEach(function (r) { t += parseFloat(r.SOTIEN); });
                      return '<b>' + esc(M.fmt(t)) + '</b>';
                  } }
            ];
            host.innerHTML = '<h3 class="ums-panel__title ums-u-mt-6 ums-u-mb-2"><i class="fa-light fa-calendar-lines"></i> Công nợ theo đợt</h3>' +
                d.dot.map(function (dot, i) {
                    return '<details class="thutien-xem thutien-sec" open><summary>Đợt ' + esc(dot.TENDOT) + '</summary>' +
                        '<div class="thutien-sec__t is-red">Nợ theo đợt</div><div data-no="' + i + '"></div>' +
                        '<div class="thutien-sec__t is-green ums-u-mt-4">Dư theo đợt</div><div data-du="' + i + '"></div></details>';
                }).join('');
            d.dot.forEach(function (dot, i) {
                var no = d.no.filter(function (r) { return r.TAICHINH_DOTCONGNO_ID === dot.ID; });
                var du = d.du.filter(function (r) { return r.TAICHINH_DOTCONGNO_ID === dot.ID; });
                ui.table({ el: host.querySelector('[data-no="' + i + '"]'), columns: cols, rows: no, tableCls: 'ums-table--lined thutien-t' });
                ui.table({ el: host.querySelector('[data-du="' + i + '"]'), columns: cols, rows: du, tableCls: 'ums-table--lined thutien-t' });
            });
        }

        return {
            reset: function () {
                dang = '';
                cache = {};
                if (dlgCT && !dlgCT.closed) dlgCT.close();
                q('the').innerHTML = '';
                c.el.pane_thuHoTT.removeAttribute('data-nap');
                c.el.pane_thuHoTT.innerHTML = '';
            },
            tongQuat: function () {
                the();
                if (dang) mo(dang);
                if (c.tab === 'thuHoTT') thuHo(c.el.pane_thuHoTT, true);
                else c.el.pane_thuHoTT.removeAttribute('data-nap');
            },
            mo: mo,
            thuHo: function (p8) { thuHo(p8, false); }
        };
    };
})();
