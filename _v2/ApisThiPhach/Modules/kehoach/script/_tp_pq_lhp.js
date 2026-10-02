/* =========================================================================
   Thi phách — phân quyền nhập điểm theo LỚP HỌC PHẦN: thanh lọc + hộp "Danh sách sinh viên"
   ums.tpPq.locLhp() → hàm dựng bộ lọc cho cfg.loc của ums.tpPq.man · ums.tpPq.hopSinhVien(idLớp)
   Bản gốc: kehoach/html/phanquyennhapdiemlhp.html (khối .inputSearch, #myModal) + script/phanquyenlophocphan.js
            (init, getList_*, cbGenCombo_*, getList_QuanSoTheoLop) — bản chép rút gọn của màn Lớp học phần (Đăng ký học).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên bản gốc — kiểu cũ, GET):
       DKH_Chung/LayThoiGianDangKyHoc                 Thời gian (chọn nhiều) → DAOTAO_THOIGIANDAOTAO
       ums.ref.heDaoTao({ strHinhThucDaoTao_Id '', strBacDaoTao_Id '', strTuKhoa '', pageIndex 1, pageSize 1000000 })
                                                      = edu.system.getList_HeDaoTao (KHÔNG lọc quyền, như gốc)
       DKH_PhanCong_LopHP/LayDSKhoaToChuc             Khoá (strDaoTao_HeDaoTao_Id, strDaoTao_ThoiGianDaoTao_Id)
       DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc      CT (Thời gian, Khoá, Hệ, Khoa QL)
       ums.ref.khoaQuanLy()                           = edu.system.getList_KhoaQuanLy
       DKH_PhanCong_LopHP/LayDSHocPhan                Học phần (Thời gian, Khoá, Hệ, CT, Khoa QL) — nhãn "TEN - MA"
       DKH_ThongTin/LayDSDangKy_KeHoachDangKy         Kế hoạch (strTuKhoa '', Thời gian, pageIndex 1, pageSize 10000)
       Danh mục QLSV.TRANGTHAI                        khối "Chọn trạng thái sinh viên" (đánh dấu sẵn hết; chỉ dùng cho báo cáo)
       DKH_PhanCong_LopHP/LayDSDangKyHoc              hộp sinh viên (strTuKhoa '', strDaoTao_LopHocPhan_Id, pageIndex 1, pageSize 1000000)
   Khung ums.lhp.boLoc của Đăng ký học KHÔNG dùng lại được: nó viết cứng 17 ô + 5 nút "Xem …" (màn này chỉ có 10 ô,
   một nút Tìm kiếm) — đã ghi nợ tầng chung. Cách nối tầng chép theo đúng khung đó.
   Ô chọn CHA → CON:
     · Thời gian → Kế hoạch: một cha, chỉ nạp khi có Thời gian → KHOÁ Kế hoạch khi chưa chọn Thời gian (ums.pat.chain).
     · Hệ / Khoá / Chương trình / Học phần: nhãn "Tất cả …", nhiều cha → lọc TUỲ CHỌN, không khoá; đổi HOẶC XOÁ ô cha thì
       nạp lại ô con (gốc chỉ bắt select2:select).
   Bỏ (mã chết của gốc): #dropSearch_Lop, #dropSearch_NguoiThu, #dropSearch_NamNhapHoc, #dropLopCuoi (không có trong html
     hoặc không lối vào), getList_LopQuanLy / getList_NamNhapHoc (không được gọi), resetCombobox, genList_TrangThaiSV bản thứ nhất
     (ghi vào main_doc.TinhTrangQuanSo không tồn tại — bị bản sau đè).
   Hộp sinh viên: nút "Xóa" (#btnDelete_LopHocPhan) của gốc không có xử lý → không vẽ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, ref = ums.ref, P = ums.tpPq;
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }

    P.locLhp = function () {
        return function (host, m) {
            host.innerHTML = pat.panel({ title: false, cls: 'ums-u-mb-4', body:
                '<div class="ums-filter tppq-loc">' +
                    P.sel('tg', 'Chọn học kỳ', { nhieu: true }) + P.sel('he', 'Tất cả hệ đào tạo', { nhieu: true }) +
                    P.sel('khoa', 'Tất cả khóa đào tạo', { nhieu: true }) + P.sel('kql', 'Tất cả khoa quản lý', { nhieu: true }) +
                    P.sel('ct', 'Tất cả chương trình đào tạo', { nhieu: true }) + P.sel('hp', 'Chọn học phần', { nhieu: true }) +
                    P.sel('kh', 'Chọn kế hoạch') +
                    '<div class="ums-field tppq-loc__chk"><label class="ums-check"><input type="checkbox" data-f="cpc"> Chỉ hiện các lớp chưa phân công</label></div>' +
                    P.inp('tu', 'Số đã đăng ký(từ số)', true) + P.inp('den', 'Số đã đăng ký(đến số)', true) + P.nutTim() +
                '</div>' +
                '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div><div data-z="tt"></div>' });
            ui.enhance(host);
            function f(k) { return host.querySelector('[data-f="' + k + '"]'); }
            function v(k) { return f(k) ? pat.val(f(k)) : ''; }
            function goi(a, o) { return P.get(a, o).then(function (r) { return P.arr(r.data); }); }
            /* Hệ cũ đặt ô về trống khi danh sách không đúng MỘT mục (cbGenCombo_*: if (data.length != 1) val("")) */
            function fill(k, rows, opt) {
                pat.fill(f(k), rows, opt);
                if (rows.length !== 1 && window.jQuery) { jQuery(f(k)).val(f(k).multiple ? [] : ''); jQuery(f(k)).trigger('change.select2').trigger('ums:refresh'); }
            }
            function napTG() {
                return goi('DKH_Chung/LayThoiGianDangKyHoc', {}).then(function (d) { pat.fill(f('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO' }); }).catch(loi('thời gian đào tạo'));
            }
            function napHe() {
                return ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                    .then(function (d) { fill('he', d, { name: 'TENHEDAOTAO' }); }).catch(loi('hệ đào tạo'));
            }
            function napKhoa() {
                return ums.api.call({ action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc', method: 'GET', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg') })
                    .then(function (r) { fill('khoa', P.arr(r.data), { name: 'TENKHOA' }); }).catch(loi('khóa đào tạo'));
            }
            function napCT() {
                return ums.api.call({ action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                    strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql') })
                    .then(function (r) { fill('ct', P.arr(r.data), { name: 'TENCHUONGTRINH' }); }).catch(loi('chương trình đào tạo'));
            }
            function napKQL() { return ref.khoaQuanLy().then(function (d) { fill('kql', d, { name: 'TEN' }); }).catch(loi('khoa quản lý')); }
            function napHP() {
                return ums.api.call({ action: 'DKH_PhanCong_LopHP/LayDSHocPhan', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                    strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql') })
                    .then(function (r) { pat.fill(f('hp'), P.arr(r.data), { name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); } }); }).catch(loi('học phần'));
            }
            function napKH() {
                if (!v('tg')) { pat.fill(f('kh'), []); chuoi.sync(); return Promise.resolve(); }
                return goi('DKH_ThongTin/LayDSDangKy_KeHoachDangKy', { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), pageIndex: 1, pageSize: 10000 })
                    .then(function (d) { pat.fill(f('kh'), d, { name: 'TENKEHOACH', head: 'Chọn kế hoạch' }); chuoi.sync(); }).catch(loi('kế hoạch đăng ký'));
            }
            var chuoi = pat.chain([f('tg'), f('kh')], { phatLai: false });
            /* Khởi tạo — đúng thứ tự init() của gốc (Học phần, Kế hoạch gốc KHÔNG nạp lúc mở màn) */
            var xong = Promise.all([napHe(), napKhoa(), napCT(), napKQL(), napTG()]);
            var tt = pat.checks(host.querySelector('[data-z="tt"]'), ums.api.dm('QLSV.TRANGTHAI'), { cols: 3 });
            chuoi.sync();

            function nghe(k, fn) { if (window.jQuery) jQuery(f(k)).on('select2:select select2:unselect select2:clear', fn); }
            nghe('tg', function () { Promise.all([napHe(), napKhoa(), napCT(), napHP(), napKH()]).then(function () { m.onDoi('tg'); }); });
            nghe('he', function () { napKhoa(); napCT(); napHP(); });
            nghe('khoa', function () { napCT(); napHP(); });
            nghe('ct', function () { napHP(); });
            nghe('kql', function () { napCT(); napHP(); });
            nghe('hp', function () { m.onDoi('hp'); });

            function so(k) { var n = parseInt(v(k), 10); return v(k) && !isNaN(n) ? n : -1; }
            return { f: f, v: v, xong: xong, tt: tt, so: so, co: function (k) { return f(k) && f(k).checked ? 1 : 0; } };
        };
    };

    /* ---------- Hộp "Danh sách sinh viên" của một lớp học phần (#myModal) ---------- */
    P.hopSinhVien = function (idLop) {
        var d = ui.dialog({ title: 'Danh sách sinh viên', icon: 'fa-users-between-lines', size: 'xl', body: '<div data-z="b">' + P.dang() + '</div>' });
        var z = d.body.querySelector('[data-z="b"]');
        P.get('DKH_PhanCong_LopHP/LayDSDangKyHoc', { strTuKhoa: '', strDaoTao_LopHocPhan_Id: idLop, pageIndex: 1, pageSize: 1000000 }).then(function (r) {
            ui.table({ el: z, rows: P.arr(r.data), empty: 'Lớp chưa có sinh viên đăng ký', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', cls: 'is-nowrap', render: function (x) { return esc((e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)).trim()); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }, { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' }, { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN' }, { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' }] });
        }).catch(function (err) { z.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên của lớp'); });
        return d;
    };
})();
