/* =========================================================================
   nhapdiemrenluyen — Nhập điểm rèn luyện theo tiêu chí: lưới sinh viên × tiêu chí con
   của một tiêu chí cha, cộng cột tổng điểm / xếp loại tiêu chí cha.
   Bản gốc: nhapdiem/script/nhapdiemrenluyen.js (bản cũ của ApisRenLuyen/Modules/nhapdiemrenluyen).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       Hệ → Khoá → CT → Lớp: ums.ref.cascade (edu.system.getList_HeDaoTao / KhoaDaoTao / ChuongTrinhDaoTao / LopQuanLy — bản KHÔNG lọc quyền, như gốc)
       Năm học CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc (GET) → Thời gian ums.ref.thoiGianDaoTao (strNam_Id)
       Đối tượng: danh mục DRL.DOITUONGAPDUNG · Trạng thái: CM_DanhMucDuLieu/LayDanhSach (QLSV.TRANGTHAI)
       Tiêu chí cha RL_TieuChiDanhGia/LayDanhSach (strDRL_TieuChiDanhGia_Cha_id '' — chữ id thường như gốc)
         → Tiêu chí RL_ThongTinChung/LayDSTieuChiRenLuyenTheoKhoa
       Danh sách RL_ThongTinChung/LayDSDRLTheoLop → rsSV, rsTieuChi, rsDuLieuDrl_TieuChiCon, rsDuLieuDrl_TieuChiCha
       Lưu RL_XuLy/Them_DRL_TongHopKetQua_TieuChi · Xoá (ô xoá trắng hoặc "x") RL_XuLy/Xoa_DRL_TongHopKetQua_TieuChi (+ strDiem)
       Tổng hợp RL_XuLy/TongHopDRLTheoCacTieuChi · Báo cáo ums.report.mount (không thêm khoá — như gốc)
       Thời gian gửi đi = Thời gian đào tạo, trống thì Năm học (như gốc).
   Không chép (lỗi rõ của bản gốc — theo bản mới ApisRenLuyen khi có):
     · Lưu gửi LẠI MỌI ô có điểm và "xoá" MỌI ô trống (so thay đổi bị chú thích) → chỉ ô đã sửa: có điểm → Lưu, xoá trắng/"x" → Xoá.
     · Tổng hợp gửi id KHOÁ vào cả chương trình lẫn lớp, đối tượng đọc ô không tồn tại → gửi đúng CT / Lớp / Đối tượng (như bản ApisRenLuyen).
     · Tiêu chí con đọc ô thời gian không tồn tại (không bao giờ lọc theo thời gian) → đọc đúng ô.
     · Đối tượng không nạp lại tiêu chí cha (bản ApisRenLuyen đã thêm) → có.
     · Ô từ khoá không được đọc → lọc ngay trên danh sách (mã số, họ tên).
     · Lỗi mạng khi lưu làm thanh tiến trình treo; thiếu recordset là lỗi JS.
   Chờ nghiệp vụ:
     · strId gửi ĐIỂM CŨ của ô (gốc gán name = DIEM rồi gửi làm strId) — giữ nguyên, cần hỏi procedure đọc strId thế nào.
     · Thời gian đào tạo liệt kê cả năm lẫn kỳ (bản ApisRenLuyen dùng …_Ky chỉ lấy kỳ) — giữ như bản này.
     · Tổng hợp gốc không hỏi lại, có thể tổng hợp cả trường — ở đây hỏi lại.
     · Dòng Tổng cộng cả cột "Tổng điểm - tiêu chí cha" (như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, nd = ums.nd;
    var root = document.getElementById('nd-nhapdiemrenluyen');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }

    root.innerHTML = pat.page('Nhập điểm rèn luyện', '<span data-z="bc"></span>' +
            ui.btn('save', { text: 'Thực hiện tổng hợp các tiêu chí', icon: 'fa-book-open-reader', mod: 'out-success', attr: { 'data-a': 'tonghop' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } })) +
        pat.filterBar([{ key: 'he', type: 'select', label: 'Chọn hệ đào tạo' }, { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Chọn chương trình đào tạo' }, { key: 'lop', type: 'select', label: 'Chọn lớp quản lý' },
            { key: 'nam', type: 'select', label: 'Chọn năm học' }, { key: 'tg', type: 'select', label: 'Chọn thời gian đào tạo' },
            { key: 'dt', type: 'select', label: 'Chọn đối tượng' }, { key: 'tt', type: 'select', label: 'Chọn trạng thái' },
            { key: 'tcc', type: 'select', label: 'Chọn tiêu chí cha' }, { key: 'tc', type: 'select', label: 'Chọn tiêu chí' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' }]) +
        pat.panel({ title: 'Danh sách', icon: 'fa-book-open-reader', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value.trim() : ''; }
    function thoiGian() { return v('tg') || v('nam'); }
    z('bang').innerHTML = ui.empty('Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-hand-pointer');
    nd.phim(z('bang'));

    /* ---------- Bộ lọc -------------------------------------------------- */
    ums.ref.cascade({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
        labels: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình đào tạo', lop: 'Chọn lớp quản lý' } });
    var cNam = pat.chain([f('nam'), f('tg')], { phatLai: false }), cTC = pat.chain([f('dt'), f('tcc'), f('tc')], { phatLai: false });
    get('CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc', { strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
        .then(function (r) { pat.fill(f('nam'), arr(r.data), { name: 'NAMHOC', head: 'Chọn năm' }); cNam.sync(); }).catch(function (err) { ums.api.handle(err, 'năm học'); });
    function napTG() {
        if (!v('nam')) { pat.fill(f('tg'), []); cNam.sync(); return; }
        ums.ref.thoiGianDaoTao({ strNam_Id: v('nam'), pageIndex: 1, pageSize: 100000 })
            .then(function (d) { pat.fill(f('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' }); cNam.sync(); }).catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); });
    }
    ums.api.dm('DRL.DOITUONGAPDUNG').then(function (d) { pat.fill(f('dt'), d, { head: 'Chọn đối tượng' }); cTC.sync(); }).catch(function () {});
    get('CM_DanhMucDuLieu/LayDanhSach', { strMaBangDanhMuc: 'QLSV.TRANGTHAI' }).then(function (r) { pat.fill(f('tt'), arr(r.data), { head: 'Chọn trạng thái' }); }).catch(function () {});
    function napTCC() {
        if (!v('dt')) { pat.fill(f('tcc'), []); pat.fill(f('tc'), []); cTC.sync(); return; }
        get('RL_TieuChiDanhGia/LayDanhSach', { strTuKhoa: '', strChucNang_Id: cn(), strDRL_TieuChiDanhGia_Cha_id: '', strNguoiTao_Id: '', strNhomTieuChi_Id: '', strDoiTuongApDung_Id: v('dt'), pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(f('tcc'), arr(r.data), { head: 'Chọn danh mục tiêu chí' }); cTC.sync(); }).catch(function (err) { ums.api.handle(err, 'tiêu chí'); });
    }
    function napTC() {
        if (!v('tcc')) { pat.fill(f('tc'), []); cTC.sync(); return; }
        get('RL_ThongTinChung/LayDSTieuChiRenLuyenTheoKhoa', { strDRL_TieuChiDanhGia_Cha_Id: v('tcc'), strChucNang_Id: cn(), strDaoTao_ThoiGianDaoTao_Id: thoiGian(),
            strDoiTuongApDung_Id: v('dt'), strDaoTao_KhoaDaoTao_Id: v('khoa') })
            .then(function (r) { pat.fill(f('tc'), arr(r.data), { head: 'Chọn tiêu chí nhập điểm' }); cTC.sync(); }).catch(function (err) { ums.api.handle(err, 'tiêu chí nhập điểm'); });
    }
    if (window.jQuery) {
        jQuery(f('nam')).on('select2:select select2:clear', napTG);
        jQuery(f('dt')).on('select2:select select2:clear', napTCC);
        jQuery(f('tcc')).on('select2:select select2:clear', napTC);
    }

    /* ---------- Lưới -------------------------------------------------- */
    var D = null, SV = [], TC = [];
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return get('RL_ThongTinChung/LayDSDRLTheoLop', { strQLSV_TrangThaiNguoiHoc_Id: v('tt'), strDRL_TieuChiDanhGia_Cha_Id: v('tcc'), strDRL_TieuChiDanhGia_Id: v('tc'),
            strChucNang_Id: cn(), strDaoTao_ThoiGianDaoTao_Id: thoiGian(), strDoiTuongApDung_Id: v('dt'), strDaoTao_LopQuanLy_Id: v('lop') })
            .then(function (r) { D = r.data || {}; ve(); }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'điểm rèn luyện'); });
    }
    function ve() {
        var q = v('q').toLowerCase(), con = {}, cha = {};
        TC = arr(D.rsTieuChi);
        arr(D.rsDuLieuDrl_TieuChiCon).forEach(function (x) { con[x.QLSV_NGUOIHOC_ID + '_' + x.DRL_TIEUCHIDANHGIA_ID] = x.DIEM; });
        arr(D.rsDuLieuDrl_TieuChiCha).forEach(function (x) { cha[x.QLSV_NGUOIHOC_ID] = x; });
        SV = arr(D.rsSV).filter(function (x) { return !q || (e(x.MASO) + ' ' + e(x.HODEM) + ' ' + e(x.TEN)).toLowerCase().indexOf(q) >= 0; });
        z('n').textContent = '(' + SV.length + ')';
        function so(v2) { var n = Number(String(e(v2)).replace(',', '.')); return isNaN(n) ? 0 : n; }
        function tong(fn) { return function (rows) { var t = rows.reduce(function (a, x) { return a + so(fn(x)); }, 0); return t ? '<b>' + esc(String(Math.round(t * 100) / 100)) + '</b>' : ''; }; }
        var cot = [{ title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' }, { title: 'Họ tên', render: function (x) { return esc(e(x.HODEM) + ' ' + e(x.TEN)); } },
            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' }];
        TC.forEach(function (t, ci) {
            cot.push({ title: e(t.TEN) + ' (' + e(t.MUCDIEMQUYDINH) + ')', cls: 'is-center', sum: tong(function (x) { return con[x.ID + '_' + t.ID]; }), render: function (x, ri) {
                var g = esc(e(con[x.ID + '_' + t.ID]));
                return '<input class="ums-input ums-input--sm nd-o" id="input' + esc(x.ID) + '_' + esc(t.ID) + '" data-r="' + ri + '" data-c="' + ci + '" data-goc="' + g + '" value="' + g + '" autocomplete="off">';
            } });
        });
        cot.push({ title: 'Tổng điểm - tiêu chí cha', cls: 'is-center', sum: tong(function (x) { return (cha[x.ID] || {}).DIEM; }), render: function (x) { return esc(e((cha[x.ID] || {}).DIEM)); } },
            { title: 'Xếp loại tiêu chí cha', cls: 'is-center', render: function (x) { return esc(e((cha[x.ID] || {}).XEPLOAI_TEN)); } });
        ui.table({ el: z('bang'), rows: SV, columns: cot, empty: 'Không có sinh viên' });
        var t = z('bang').querySelector('table'); if (t) t.classList.add('nd-luoi');
    }
    function luu() {
        var doi = nd.oDoi(z('bang')), luuDS = [], xoaDS = [];
        doi.forEach(function (i) { var val = i.value.trim(); if (val === '' || val.toLowerCase() === 'x') { if (i.getAttribute('data-goc') !== '') xoaDS.push(i); } else luuDS.push(i); });
        if (!luuDS.length && !xoaDS.length) { ui.toast('Không có dữ liệu mới cần lưu', 'info'); return; }
        ui.confirm('Bạn có chắc chắn muốn lưu ' + luuDS.length + ' và xóa ' + xoaDS.length + ' dữ liệu?', { title: 'Lưu điểm rèn luyện' }).then(function (yes) {
            if (!yes) return;
            function goi(i, xoa) {
                var p = i.id.split('_'), svId = p[0].substring(5), tcId = p.slice(1).join('_');
                var x = arr(D.rsSV).filter(function (s) { return String(s.ID) === svId; })[0] || {};
                var o = { action: xoa ? 'RL_XuLy/Xoa_DRL_TongHopKetQua_TieuChi' : 'RL_XuLy/Them_DRL_TongHopKetQua_TieuChi', method: 'POST', strId: i.getAttribute('data-goc'), strChucNang_Id: cn(),
                    strQLSV_NguoiHoc_Id: svId, strDaoTao_ChuongTrinh_Id: e(x.CHUONGTRINH_ID), dDiemQuyDoi: '', dDiem: i.value.trim(), strXepLoai_Id: '', strDRL_TieuChiDanhGia_Id: tcId,
                    strDaoTao_ThoiGianDaoTao_Id: thoiGian(), strDaoTao_LopQuanLy_Id: e(x.LOP_ID), strQLSV_TrangThaiNguoiHoc_Id: e(x.QLSV_NGUOIHOC_TRANGTHAI_ID), strNguoiThucHien_Id: uid(),
                    strDoiTuongApDung_Id: v('dt') };
                if (xoa) o.strDiem = i.value.trim();
                return o;
            }
            ui.batch(luuDS.map(function (i) { return goi(i, false); }).concat(xoaDS.map(function (i) { return goi(i, true); })),
                { title: 'Đang lưu', okText: 'Thực hiện thành công', concurrency: 5, show: true }).then(tai);
        });
    }
    function tongHop() {
        ui.confirm('Thực hiện tổng hợp điểm rèn luyện theo các tiêu chí cho phạm vi đang lọc?', { title: 'Tổng hợp các tiêu chí', tone: 'warn' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'RL_XuLy/TongHopDRLTheoCacTieuChi', method: 'POST', strChucNang_Id: cn(), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_ChuongTrinh_Id: v('ct'),
                strDaoTao_LopQuanLy_Id: v('lop'), strDoiTuongApDung_Id: v('dt'), strDaoTao_ThoiGianDaoTao_Id: thoiGian(), strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Tổng hợp thành công', 'ok'); tai(); }).catch(function (err) { ums.api.handle(err, 'tổng hợp'); });
        });
    }
    ums.report.mount(z('bc'), { reportText: 'Báo cáo', collect: function () {} });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]'); if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai(); else if (a === 'luu') luu(); else if (a === 'tonghop') tongHop();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); if (D) ve(); else tai(); } });
})();
