/* =========================================================================
   Thống kê (Quản lý điểm) — khung chung của ba màn "tổng hợp theo phạm vi" (ums.qldTk)
   Dùng ở: thongke/diemhocphan, diemtrungbinh, tonghopketqua.
   Ba html gốc chép nhau: khung trái "Thông tin" (Phạm vi tổng hợp + ô thời gian theo phạm vi, Hệ → Khoá →
   Chương trình → Lớp, Khoa quản lý, Tình trạng sinh viên) và khung phải "Tính chất lọc dữ liệu" (col-lg-6 ×2),
   dưới là một tab bảng kết quả.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên từ các getList_* của ba tệp gốc):
       Danh mục DIEM.PHAMVITONGHOPDIEM   ô Phạm vi tổng hợp (option id = MA → hiện ô thời gian "zone_<MA>")
       ums.ref.thoiGianDaoTao  (pageSize 100000)            ô Nhiều kỳ (chọn nhiều) / Học kỳ / Đợt học
       KHCT_ThongTin_MH/DSA4BRIPICwPKSAxCS4i  func pkg_kehoach_thongtin.LayDSNamNhapHoc      ô Năm học (NAMNHAPHOC)
       ums.ref.heDaoTao (pageSize 1000) · khoaDaoTao (10000) · chuongTrinh (10000) · lopQuanLy (100000) — bản KHÔNG lọc
           quyền, đúng như gốc gọi edu.system.getList_* (không phải genBoLoc_HeKhoa)
       ums.ref.khoaQuanLy                                     ô Khoa quản lý (TEN)
       Danh mục QLSV.TRANGTHAI                                ô Tình trạng sinh viên (chọn nhiều, chọn sẵn tất cả)
   Nối tầng: Hệ → Khoá (chọn nhiều) → Chương trình → Lớp (ums.pat.chain — chưa chọn cha thì khoá con).
   Khoa quản lý là lọc thêm cho Chương trình / Lớp (nạp lại khi đổi, không khoá) — như gốc.
   Tham số lớp chép nguyên chỗ lạ của gốc: strNganh_Id = ô Khoa quản lý; strKhoaQuanLy_Id gốc truyền dưới tên
   không được getList_LopQuanLy đọc → không gửi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var PV = [['NHIEUKY', 'Nhiều kỳ', true], ['NAMHOC', 'Năm học'], ['HOCKY', 'Học kỳ'], ['DOTHOC', 'Đợt học']];
    var PH = { NHIEUKY: 'Chọn kỳ', NAMHOC: 'Chọn năm học', HOCKY: 'Chọn học kỳ', DOTHOC: 'Chọn đợt học' };

    function sel(key, ph, multi) {
        return '<select class="ums-select" data-f="' + key + '" data-ph="' + esc(ph) + '"' + (multi ? ' multiple' : '') + '>' +
            (multi ? '' : '<option value="">' + esc(ph) + '</option>') + '</select>';
    }
    function inp(key, ph) { return '<input class="ums-input" data-f="' + key + '" placeholder="' + esc(ph || '') + '" autocomplete="off">'; }
    function truong(nhan, ctl) { return ui.field(nhan, ctl, { inline: true, labelWidth: '190px' }); }

    var Q = ums.qldTk = { sel: sel, inp: inp, truong: truong };

    /** Các ô của khung "Thông tin". o.phamVi: có ô Phạm vi tổng hợp (không có thì chỉ hiện ô Nhiều kỳ, như html
        diemhocphan — ô phạm vi bị chú thích bỏ). */
    Q.thongTin = function (o) {
        o = o || {};
        return '<div class="qldtk-form">' +
            (o.phamVi ? truong('Phạm vi tổng hợp', sel('pv', 'Chọn phạm vi tổng hợp')) : '') +
            PV.map(function (p) {
                var hien = !o.phamVi && p[0] === 'NHIEUKY';
                return '<div data-pv="' + p[0] + '"' + (hien ? '' : ' hidden') + '>' + truong(p[1], sel('tg_' + p[0], PH[p[0]], p[2])) + '</div>';
            }).join('') +
            truong('Hệ đào tạo', sel('he', 'Chọn hệ đào tạo')) +
            truong('Khóa đào tạo', sel('khoa', 'Chọn khóa đào tạo', true)) +
            truong('Khoa quản lý', sel('kql', 'Chọn khoa quản lý')) +
            truong('Chương trình đào tạo', sel('ct', 'Chọn chương trình đào tạo')) +
            truong('Lớp quản lý', sel('lop', 'Chọn lớp quản lý')) +
            truong('Tình trạng sinh viên', sel('tt', 'Chọn tình trạng sinh viên', true)) +
            '</div>';
    };

    /** Gắn nạp dữ liệu + nối tầng cho khung "Thông tin" đã vẽ trong root. */
    Q.gan = function (root, o) {
        o = o || {};
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return pat.val(f(k)); }
        var ma = '';
        function loi(noi) { return function (err) { ums.api.handle(err, noi); }; }

        /* Phạm vi tổng hợp — option mang MA (bản gốc: id của <option>) */
        if (o.phamVi) {
            ums.api.dm('DIEM.PHAMVITONGHOPDIEM').then(function (d) {
                f('pv').innerHTML = '<option value="">Chọn phạm vi</option>' + arr(d).map(function (r) {
                    return '<option value="' + esc(r.ID) + '" data-ma="' + esc(r.MA) + '">' + esc(r.TEN) + '</option>';
                }).join('');
                if (window.jQuery) jQuery(f('pv')).trigger('change.select2');
            }).catch(loi('phạm vi tổng hợp'));
            if (window.jQuery) jQuery(f('pv')).on('select2:select select2:clear', function () {
                var op = f('pv').selectedOptions[0];
                ma = op && op.value ? op.getAttribute('data-ma') || '' : '';
                /* edu.util.toggle_overide("zonePhamVi", "zone_" + MA): ẩn mọi ô thời gian, hiện ô của phạm vi */
                Array.prototype.forEach.call(root.querySelectorAll('[data-pv]'), function (z) { z.hidden = z.getAttribute('data-pv') !== ma; });
                if (o.onPhamVi) o.onPhamVi(ma);
            });
        }
        ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }).then(function (d) {
            ['HOCKY', 'NHIEUKY', 'DOTHOC'].forEach(function (k) { pat.fill(f('tg_' + k), d, { name: 'DAOTAO_THOIGIANDAOTAO' }); });
        }).catch(loi('thời gian đào tạo'));
        ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIPICwPKSAxCS4i', func: 'pkg_kehoach_thongtin.LayDSNamNhapHoc', silent: true })
            .then(function (r) { pat.fill(f('tg_NAMHOC'), arr(r.data), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC' }); }).catch(loi('năm nhập học'));

        /* Hệ → Khoá → Chương trình → Lớp; Khoa quản lý lọc thêm */
        ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
            .then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO' }); }).catch(loi('hệ đào tạo'));
        ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { name: 'TEN' }); }).catch(loi('khoa quản lý'));
        function napKhoa() {
            return ums.ref.khoaDaoTao({ strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
                .then(function (d) { pat.fill(f('khoa'), d, { name: 'TENKHOA' }); }).catch(loi('khóa đào tạo'));
        }
        function napCT() {
            return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: v('kql'), strToChucCT_Cha_Id: '',
                strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
                .then(function (d) { pat.fill(f('ct'), d, { name: 'TENCHUONGTRINH' }); }).catch(loi('chương trình đào tạo'));
        }
        function napLop() {
            return ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strNganh_Id: v('kql'),
                strLoaiLop_Id: '', strToChucCT_Id: v('ct'), strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
                .then(function (d) { pat.fill(f('lop'), d, { name: 'TEN' }); }).catch(loi('lớp quản lý'));
        }
        if (window.jQuery) {
            jQuery(f('he')).on('select2:select select2:clear', function () { if (v('he')) { napKhoa(); napCT(); napLop(); } });
            jQuery(f('khoa')).on('select2:select select2:unselect select2:clear', function () { if (v('khoa')) { napCT(); napLop(); } });
            jQuery(f('ct')).on('select2:select select2:clear', function () { if (v('ct')) napLop(); });
            jQuery(f('kql')).on('select2:select select2:clear', function () { if (v('khoa')) napCT(); if (v('ct')) napLop(); });
        }
        pat.chain([f('he'), f('khoa'), f('ct'), f('lop')], { phatLai: false });

        /* Tình trạng sinh viên: chọn sẵn tất cả ($('#dropTinhTrangSinhVien option').prop('selected', true)) */
        ums.api.dm('QLSV.TRANGTHAI').then(function (d) {
            pat.fill(f('tt'), d, { name: 'TEN' });
            if (window.jQuery) jQuery(f('tt')).val(arr(d).map(function (r) { return String(r.ID); })).trigger('change.select2').trigger('ums:refresh');
        }).catch(loi('tình trạng sinh viên'));

        return {
            f: f, v: v,
            ma: function () { return ma; },
            /** edu.util.getValCombo('dropPhanViTongHop_' + strPhamViMa) — ô thời gian của phạm vi đang chọn */
            thoiGian: function () { return ma ? v('tg_' + ma) : ''; }
        };
    };

    /** Hỏi lại rồi gọi; xong thì toast. */
    Q.chay = function (call, okText) {
        return ums.api.call(call).then(function () { ui.toast(okText || 'Thực hiện thành công!', 'ok'); return true; })
            .catch(function (err) { ums.api.handle(err, call.action); return false; });
    };
    /* =====================================================================
       Màn "thống kê ra BẢNG DỮ LIỆU" — diemhocphan, diemtrungbinh (hai tệp gốc chép nhau).
       Khung trái "Thông tin" (+ Xuất báo cáo) · khung phải "Tính chất lọc dữ liệu" (+ Thực hiện)
       · khung "Danh sách Tổng hợp kết quả": ô tên bảng dữ liệu + Xóa bảng / Xem bảng.
       cfg = { root, tieuDe, phamVi, phai: html các ô khung phải, ganPhai(root, api),
               luu(api, g) → tham số lời gọi "Thực hiện", ds, xoa (action), bc(add, api) }
       Lời gọi danh sách / xoá (GET / POST, kiểu cũ, chép nguyên):
           <ds>  { strBangDuLieu, strNguoiThucHien_Id }    <xoa>  { strBangDuLieu, strNguoiThucHien_Id }
       ===================================================================== */
    Q.manBang = function (cfg) {
        var root = cfg.root;
        root.innerHTML = pat.page(cfg.tieuDe, '') +
            '<div class="ums-grid ums-grid--2 ums-u-mb-4">' +
            pat.panel({ title: 'Thông tin', icon: 'fa-link', body: Q.thongTin({ phamVi: cfg.phamVi }), tools: '<span data-z="bc"></span>' }) +
            pat.panel({ title: 'Tính chất lọc dữ liệu', icon: 'fa-filter', body: '<div class="qldtk-form">' + cfg.phai + '</div>',
                tools: ui.btn('search', { text: 'Thực hiện', icon: 'fa-calculator', attr: { 'data-a': 'thuchien' } }) }) +
            '</div>' +
            pat.panel({ title: 'Danh sách Tổng hợp kết quả', icon: 'fa-list', count: 'n', flush: true,
                tools: ui.btn('del', { text: 'Xóa bảng', attr: { 'data-a': 'xoa' } }) + ui.btn('search', { text: 'Xem bảng', attr: { 'data-a': 'xem' } }),
                body: '<div class="ums-filter qldtk-loc">' + '<div class="ums-field">' + inp('bang', 'LIST BẢNG DỮ LIỆU') + '</div></div>' +
                    '<div data-z="bang">' + ui.empty('Nhập tên bảng dữ liệu rồi bấm Xem bảng', 'fa-table') + '</div>' });
        ui.enhance(root);
        var api = Q.gan(root, { phamVi: cfg.phamVi });
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function g(k) { return api.v(k); }
        if (cfg.ganPhai) cfg.ganPhai(root, api);

        function xem() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: cfg.ds, method: 'GET', strBangDuLieu: g('bang'), strNguoiThucHien_Id: '' }).then(function (r) {
                z('n').textContent = '(' + (r.pager || arr(r.data).length) + ')';
                ui.table({ el: z('bang'), rows: arr(r.data), empty: 'Không có dữ liệu', columns: [
                    { title: 'Mã sinh viên', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (x) { return esc((x.QLSV_NGUOIHOC_HODEM || '') + ' ' + (x.QLSV_NGUOIHOC_TEN || '')); } }
                ] });
            }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách tổng hợp kết quả'); });
        }
        ums.report.mount(z('bc'), { import: false, collect: function (add) { cfg.bc(add, api); } });  // html gốc không có vùng _Import
        root.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-a]');
            if (!a) return;
            var k = a.getAttribute('data-a');
            if (k === 'xem') xem();
            else if (k === 'thuchien') Q.chay(Object.assign({ method: 'POST' }, cfg.luu(api, g)));
            else if (k === 'xoa') ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (ok) {
                if (!ok) return;
                Q.chay({ action: cfg.xoa, method: 'POST', strBangDuLieu: g('bang'), strNguoiThucHien_Id: '' }, 'Xóa dữ liệu thành công!')
                    .then(function (xong) { if (xong) z('bang').innerHTML = ui.empty('Đã xóa bảng dữ liệu', 'fa-table'); });
            });
        });
        root.querySelector('[data-f="bang"]').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); xem(); } });
        return api;
    };

    /** Mẫu báo cáo chung của ba màn (getList_MauImport gốc) — strDaoTao_ThoiGianDaoTao_Id truyền vào. */
    Q.bc = function (add, api, thoiGian) {
        var v = api.v;
        add('strTrangThaiNguoiHoc_Id', v('tt')); add('strDaoTao_HeDaoTao_Id', v('he')); add('strDaoTao_KhoaDaoTao_Id', v('khoa'));
        add('strDaoTao_KhoaQuanLy_Id', v('kql')); add('strDaoTao_ChuongTrinh_Id', v('ct')); add('strDaoTao_LopQuanLy_Id', v('lop'));
        add('strPhamViTongHopDiem_Id', v('pv')); add('strDaoTao_ThoiGianDaoTao_Id', thoiGian); add('strThangDiem_Id', v('td'));
        add('dTongHopLaiDiemThanhPhan', ''); add('strNguoiDangNhap_Id', (ums.session && ums.session.userId) || '');
    };
})();
