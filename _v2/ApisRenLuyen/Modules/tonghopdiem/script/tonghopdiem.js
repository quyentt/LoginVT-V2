/* =========================================================================
   tonghopdiem — Tổng hợp điểm rèn luyện: kết quả rèn luyện theo lớp + thống kê số lượng theo xếp loại,
   xếp loại kỳ / năm / toàn khoá, thống kê sinh viên còn thiếu điểm rèn luyện, báo cáo, import.
   Bản gốc: ApisRenLuyen/Modules/tonghopdiem/script/tonghopdiem.js
   ---------------------------------------------------------------------------
   Bố cục như gốc (một cột): thanh lọc → khung "Danh sách kết quả rèn luyện" (hai nút ở đầu khung)
   → khung "Danh sách còn thiếu điểm rèn luyện" (ẩn tới khi bấm Thống kê) → khung "Thống kê số lượng".
   Lời gọi (chép nguyên):
       Hệ (chọn nhiều) edu.system.getList_HeDaoTao → ums.ref.heDaoTao · Khoá (nhiều) ums.ref.khoaDaoTao (strHeDaoTao_Id = các hệ)
         → CT (nhiều) ums.ref.chuongTrinh (strKhoaDaoTao_Id — gốc KHÔNG gửi hệ) → Lớp (nhiều) LayDSKS_DaoTao_LopQuanLy bản Corei
         (thêm strDaoTao_KhoaQuanLy_Id rỗng; strNganh_Id đọc ô "dropKhoaQuanLy" không có trên màn → rỗng). Không lọc quyền — như gốc.
       Năm học CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc (GET) → Thời gian pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao_Ky (CHỈ KỲ)
       Đối tượng: danh mục DRL.DOITUONGAPDUNG · Trạng thái: CM_DanhMucDuLieu/LayDanhSach (QLSV.TRANGTHAI, GET)
       Danh sách: XLHV_RL_ThongTin_MH/… pkg_diemrenluyen_thongtin.LayDSTongHopDRLTheoLop (POST) → rsChiTiet, rsThongKe
       Xếp loại: RL_XuLy/TongHopDRLTheoKyNamToanKhoa (POST, hỏi lại như gốc)
       Thiếu điểm RL: XLHV_RL_ThongTin_MH/… pkg_diemrenluyen_thongtin.LayDSTongHopThieuDRL (POST, chờ tối đa 60 giây)
         — như gốc: bắt chọn Năm học hoặc Thời gian, và ít nhất một trong Hệ / Khoá / CT / Lớp; phân trang ở máy khách.
       Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_TongHopDiem") — khoá gửi kèm đúng thứ tự gốc.
       Import: nút cố định IMPORTWITHPROC_RLTK "Điểm rèn luyện" (html gốc viết cứng) → ums.report.importChung.
       Thời gian gửi đi = Thời gian đào tạo, trống thì Năm học (như gốc).
   Khác gốc:
     · Import gốc là bản chép riêng showImportChungV2 chỉ để thêm thanh tiến trình giả 0→90% — ums.report.importChung
       đã có thanh chờ của tầng chung nên dùng thẳng. Mẫu import của chức năng (nếu có) KHÔNG hiện ở nút báo cáo
       (gốc: vùng #zonebtnBaoCao_TongHopDiem_Import không có trên màn) → mount({ import: false }).
     · Ô từ khoá gốc không được gửi đi (Enter chỉ tải lại) → lọc ngay trên danh sách (mã số, họ tên), Enter vẫn tải lại khi chưa có dữ liệu.
     · Ô "Phạm vi tổng hợp" (DIEM.PHAMVITONGHOPDIEM) gốc bị ẩn và không được đọc → bỏ.
     · Hệ → Khoá → CT → Lớp, Năm học → Thời gian: khoá con khi chưa chọn cha, đổi/xoá cha thì xoá trắng con (luật chung).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('rl-tonghopdiem');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }

    root.innerHTML = pat.page('Tổng hợp điểm rèn luyện', '') +
        pat.filterBar([{ key: 'he', type: 'select', label: 'Chọn hệ đào tạo', multiple: true }, { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo', multiple: true },
            { key: 'ct', type: 'select', label: 'Chọn chương trình đào tạo', multiple: true }, { key: 'lop', type: 'select', label: 'Chọn lớp quản lý', multiple: true },
            { key: 'nam', type: 'select', label: 'Chọn năm học' }, { key: 'tg', type: 'select', label: 'Chọn thời gian đào tạo' },
            { key: 'dt', type: 'select', label: 'Chọn đối tượng' }, { key: 'tt', type: 'select', label: 'Chọn trạng thái' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }],
            { extra: '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('importer', { text: 'Import điểm rèn luyện', attr: { 'data-a': 'import' } }) + '</div>' }) +
        pat.panel({ title: 'Danh sách kết quả rèn luyện', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('save', { text: 'Thực hiện xếp loại kỳ, năm, toàn khóa', icon: 'fa-paper-plane', mod: 'primary', attr: { 'data-a': 'xeploai' } }) +
                ui.btn('report', { text: 'Thống kê danh sách còn thiếu điểm RL', icon: 'fa-chart-column', mod: 'out-primary', attr: { 'data-a': 'thieu' } }) }) +
        '<div data-z="khungThieu" hidden>' +
        pat.panel({ title: 'Danh sách còn thiếu điểm rèn luyện', icon: 'fa-list-ul', count: 'nThieu', flush: true, zone: 'thieu' }) + '</div>' +
        pat.panel({ title: 'Thống kê số lượng', icon: 'fa-list-ul', flush: true, zone: 'tk' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    function thoiGian() { return v('tg') || v('nam'); }
    z('bang').innerHTML = ui.empty('Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-hand-pointer');
    z('tk').innerHTML = ui.empty('Chưa có dữ liệu thống kê', 'fa-chart-column');

    /* ---------- Bộ lọc -------------------------------------------------- */
    var P = { pageIndex: 1, pageSize: 10000 };
    function napKhoa() {
        return ums.ref.khoaDaoTao(Object.assign({ strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '' }, P))
            .then(function (d) { pat.fill(f('khoa'), d, { name: 'TENKHOA' }); }).catch(loi('khóa đào tạo'));
    }
    function napCT() {
        return ums.ref.chuongTrinh(Object.assign({ strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '',
            strNguoiThucHien_Id: '', strTuKhoa: '' }, P))
            .then(function (d) { pat.fill(f('ct'), d, { name: 'TENCHUONGTRINH' }); }).catch(loi('chương trình đào tạo'));
    }
    /* edu.system.getList_LopQuanLy của Corei — gửi thêm strDaoTao_KhoaQuanLy_Id rỗng (ums.ref.lopQuanLy theo Core không có) */
    function napLop() {
        return ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy', silent: true,
            strDaoTao_CoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_KhoaQuanLy_Id: '', strDaoTao_Nganh_Id: '',
            strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: v('ct'), strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(f('lop'), arr(r.data), { name: 'TEN' }); }).catch(loi('lớp quản lý'));
    }
    function napTG() {
        if (!v('nam')) { pat.fill(f('tg'), []); return; }
        ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P', func: 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao_Ky',
            strDAOTAO_Nam_Id: v('nam'), strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' }); })
            .catch(loi('thời gian đào tạo'));
    }
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO' }); }).catch(loi('hệ đào tạo'));
    ums.api.call({ action: 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc', method: 'GET', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
        .then(function (r) { pat.fill(f('nam'), arr(r.data), { name: 'NAMHOC', head: 'Chọn năm' }); }).catch(loi('năm học'));
    ums.api.dm('DRL.DOITUONGAPDUNG').then(function (d) { pat.fill(f('dt'), d, { head: 'Chọn đối tượng' }); }).catch(function () {});
    ums.api.call({ action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', silent: true, strMaBangDanhMuc: 'QLSV.TRANGTHAI' })
        .then(function (r) { pat.fill(f('tt'), arr(r.data), { head: 'Chọn trạng thái' }); }).catch(function () {});

    /* Luật cha → con: gắn TRƯỚC trình xử lý nạp để lúc đọc giá trị các tầng dưới đã được xoá trắng */
    pat.chain([f('he'), f('khoa'), f('ct'), f('lop')], { phatLai: false });
    pat.chain([f('nam'), f('tg')], { phatLai: false });
    var NAP = { he: napKhoa, khoa: napCT, ct: napLop, nam: napTG };
    if (window.jQuery) {
        Object.keys(NAP).forEach(function (k) { jQuery(f(k)).on('select2:select select2:unselect select2:clear', function () { NAP[k](); }); });
    }

    /* ---------- Danh sách + thống kê ------------------------------------ */
    var DS = null;
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'XLHV_RL_ThongTin_MH/DSA4BRIVLi8mCS4xBRMNFSkkLg0uMQPP', func: 'pkg_diemrenluyen_thongtin.LayDSTongHopDRLTheoLop',
            strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_ChuongTrinh_Id: v('ct'), strChucNang_Id: cn(),
            strDaoTao_ThoiGianDaoTao_Id: thoiGian(), strQLSV_TrangThaiNguoiHoc_Id: v('tt'), strDoiTuongApDung_Id: v('dt'), strDaoTao_LopQuanLy_Id: v('lop'),
            strNguoiThucHien_Id: uid() })
            .then(function (r) { DS = r.data || {}; ve(); veTK(); })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tổng hợp điểm rèn luyện'); });
    }
    function hoTen(x) { return esc(e(x.HODEM) + ' ' + e(x.TEN)); }
    function ve() {
        var q = v('q').toLowerCase();
        var rows = arr(DS.rsChiTiet).filter(function (x) { return !q || (e(x.MASO) + ' ' + e(x.HODEM) + ' ' + e(x.TEN)).toLowerCase().indexOf(q) >= 0; });
        z('n').textContent = '(' + rows.length + ')';
        ui.table({ el: z('bang'), rows: rows, empty: 'Không có dữ liệu', columns: [
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' }, { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' }, { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
            { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', render: hoTen, cls: 'is-nowrap' }, { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
            { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' }, { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center' },
            { title: 'Điểm rèn luyện', prop: 'DIEM', cls: 'is-center' }, { title: 'Điểm RL quy đổi', prop: 'DIEMQUYDOI', cls: 'is-center' },
            { title: 'Ghi chú', prop: 'GHICHU' }] });
    }
    function veTK() {
        ui.table({ el: z('tk'), rows: arr(DS.rsThongKe), empty: 'Không có dữ liệu', columns: [
            { title: 'Xếp loại', prop: 'TEN' }, { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center', sum: true }] });
    }

    /* ---------- Xếp loại kỳ, năm, toàn khoá ------------------------------ */
    function xepLoai() {
        ui.confirm('Bạn có chắc chắn muốn thực hiện không?', { title: 'Thực hiện xếp loại kỳ, năm, toàn khóa', tone: 'warn' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'RL_XuLy/TongHopDRLTheoKyNamToanKhoa', method: 'POST', strId: '', strChucNang_Id: cn(), strDaoTao_ThoiGianDaoTao_Id: thoiGian(),
                strDoiTuongApDung_Id: v('dt'), strDaoTao_LopQuanLy_Id: v('lop'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_ChuongTrinh_Id: v('ct'),
                strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Thực hiện thành công', 'ok'); }).catch(loi('xếp loại'));
        });
    }

    /* ---------- Thống kê còn thiếu điểm rèn luyện ------------------------ */
    var THIEU = [], trang = { index: 1, size: 10 }, dangTai = false;
    function thieu() {
        if (dangTai) return;
        if (!v('nam') && !v('tg')) { ui.toast('Vui lòng chọn năm học hoặc thời gian đào tạo', 'warn'); return; }
        if (!v('he') && !v('khoa') && !v('ct') && !v('lop')) {
            ui.toast('Vui lòng chọn ít nhất 1 điều kiện lọc (Hệ đào tạo/Khóa đào tạo/Chương trình/Lớp quản lý)', 'warn'); return;
        }
        var nut = root.querySelector('[data-a="thieu"]');
        dangTai = true; nut.disabled = true;
        ums.api.call({ action: 'XLHV_RL_ThongTin_MH/DSA4BRIVLi8mCS4xFSkoJDQFEw0P', func: 'pkg_diemrenluyen_thongtin.LayDSTongHopThieuDRL', timeout: 60000,
            strQLSV_TrangThaiNguoiHoc_Id: v('tt'), strDaoTao_ThoiGianDaoTao_Id: thoiGian(), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
            strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_LopQuanLy_Id: v('lop'), strDoiTuongApDung_Id: v('dt'), strNguoiThucHien_Id: uid() })
            .then(function (r) {
                var d = r.data;
                THIEU = arr(d && d.rsChiTiet ? d.rsChiTiet : d);
                trang.index = 1;
                z('khungThieu').hidden = false;
                veThieu();
            }, function (err) {
                if (err.status === 0 && /thời gian chờ/i.test(err.message || '')) {
                    ui.toast('Timeout khi thống kê (60s). Vui lòng chọn thêm điều kiện lọc (ưu tiên Lớp quản lý) rồi thử lại.', 'warn');
                } else ums.api.handle(err, 'thống kê còn thiếu điểm rèn luyện');
            })
            .then(function () { dangTai = false; nut.disabled = false; });
    }
    function veThieu() {
        var size = trang.size >= ui.PAGE_ALL ? THIEU.length || 1 : trang.size;
        var dau = (trang.index - 1) * size;
        z('nThieu').textContent = '(' + THIEU.length + ')';
        ui.table({ el: z('thieu'), rows: THIEU.slice(dau, dau + size), stt: false, empty: 'Không có sinh viên còn thiếu điểm rèn luyện', columns: [
            { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' }, { title: 'Họ tên', render: hoTen, cls: 'is-nowrap' },
            { title: 'Trạng thái', prop: 'TRANGTHAI_TEN' }, { title: 'Lớp', prop: 'TENLOP' },
            { title: 'Chương trình', render: function (x) { return esc(e(x.TENCHUONGTRINH) + ' - ' + e(x.MACHUONGTRINH)); } },
            { title: 'Khóa học', prop: 'TENKHOA' }, { title: 'Khoa quản lý', prop: 'TENKHOAQUANLY' }, { title: 'Hệ đào tạo', prop: 'TENHEDAOTAO' }],
            page: { index: trang.index, size: trang.size, total: THIEU.length,
                onChange: function (p) { trang.index = p; veThieu(); },
                onSize: function (n) { trang.size = n; trang.index = 1; veThieu(); } } });
    }

    /* ---------- Báo cáo / import ------------------------------------------ */
    ums.report.mount(z('bc'), { import: false, collect: function (add) {
        add('strChucNang_Id', cn());
        add('strDaoTao_ThoiGianDaoTao_Id', thoiGian());
        add('strDaoTao_NamApDung', v('nam'));
        add('strDoiTuongApDung_Id', v('dt'));
        add('strDaoTao_LopQuanLy_Id', v('lop'));
        add('strDaoTao_ChuongTrinh_Id', v('ct'));
        add('strQLSV_TrangThaiNguoiHoc_Id', v('tt'));
        add('strDaoTao_KhoaDaoTao_Id', v('khoa'));
        add('strDaoTao_HeDaoTao_Id', v('he'));
    } });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]'); if (!b || b.disabled) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai();
        else if (a === 'xeploai') xepLoai();
        else if (a === 'thieu') thieu();
        else if (a === 'import') ums.report.importChung('Điểm rèn luyện', 'IMPORTWITHPROC_RLTK');
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); if (DS) ve(); else tai(); } });
})();
