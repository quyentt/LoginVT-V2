/* =========================================================================
   Thống kê lịch giảng theo ngày (Thống kê giờ giảng → Tổng hợp giờ)
   Bản gốc: ApisTKGG/Modules/kehoach/html/giangduong.html + script/giangduong.js (336 dòng)
   ---------------------------------------------------------------------------
   Một cột như gốc: thanh lọc (Đơn vị → Thành viên · Thời gian (chọn nhiều) · Loại giảng viên (chọn nhiều) · Hệ đào tạo · Từ ngày · Đến ngày
   · từ khoá · Tìm kiếm · nút báo cáo) + bảng tổng hợp theo giảng viên; nút Xem mở hộp "Quá trình" (các buổi của giảng viên — việc xem → ui.dialog).

   Lời gọi (chép nguyên):
       edu.system.getList_CoCauToChuc → ums.ref.coCauToChuc({ iTrangThai: 1 })        ô Đơn vị (TEN)
       NS_HoSoV2/LayDanhSach  GET  strTuKhoa '', pageIndex 1, pageSize 100000, strDaoTao_CoCauToChuc_Id, strNguoiThucHien_Id '', dLaCanBoNgoaiTruong 0
                                   ô Thành viên — "HOTEN - MASO" (nạp lại khi đổi Đơn vị)
       edu.system.getList_ThoiGianDaoTao → ums.ref.thoiGianDaoTao            ô Thời gian (DAOTAO_THOIGIANDAOTAO)
       Danh mục NS.LGV0                                                       ô Loại giảng viên
       edu.system.getList_HeDaoTao → ums.ref.heDaoTao                         ô Hệ đào tạo (TENHEDAOTAO)
       TKGG_GiangDuongTrucTuyen/LayDSLichGiangTheoGiaiDoan  GET  strDaoTao_HeDaoTao_Id, strLoaiGiangVien_Id, strDaoTao_ThoiGianDaoTao_Id, strDaoTao_CoCauToChuc_Id,
                                   strGiangVien_Id, strTuNgay, strDenNgay → Data { rsTongHop: [giảng viên], rs: [buổi] }
       edu.system.getList_MauImport → ums.report.mount (nút báo cáo, các cặp addKeyValue như gốc)
   Giữ như gốc: ô chọn nhiều gửi giá trị nối phẩy; bảng không phân trang (pageSize gốc đặt 10 nhưng loadToTable không phân trang máy chủ).
   Khác gốc (lỗi rõ ràng):
     · Ô từ khoá gốc không gửi đi đâu → lọc tại chỗ theo mã số / họ tên / đơn vị.
     · Nút "Xem" gốc dựng bằng icon sửa (fa-edit) → biểu tượng xem (fa-eye).
     · Cột ô đánh dấu + "chọn tất cả" của gốc không nối với nút nào → bỏ.
   Cố ý bỏ: nút "Tổng hợp" đã bị gốc ghi chú; ô dropSearch_CapNhat_BoMon / dropSearch_KhoiTao_CCTC (JS đọc, HTML không có).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg;
    var root = document.getElementById('tkgg-giangduong');
    if (!root) return;
    function e(v) { return T.e(v); }
    function sel(k, ph, multi) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + ui.esc(ph) + '"' + (multi ? ' multiple' : '') + '>' + (multi ? '' : '<option value="">' + ui.esc(ph) + '</option>') + '</select></div>'; }
    root.innerHTML = pat.page('Thống kê lịch giảng theo ngày', '') +
        pat.panel({ title: 'Tìm kiếm', icon: 'fa-magnifying-glass', cls: 'ums-u-mb-4', body:
            '<div class="ums-grid ums-grid--4">' + sel('dv', 'Chọn đơn vị') + sel('tv', 'Chọn thành viên') + sel('tg', 'Chọn thời gian', true) + sel('lgv', 'Chọn loại giảng viên', true) +
            sel('he', 'Chọn hệ đào tạo') +
            '<div class="ums-field"><input class="ums-input" data-f="tu" placeholder="Từ ngày" autocomplete="off"></div>' +
            '<div class="ums-field"><input class="ums-input" data-f="den" placeholder="Đến ngày" autocomplete="off"></div>' +
            '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' +
            '<div class="ums-u-mt-2">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + ' <span data-z="bc"></span></div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list', tools: '<span class="ums-badge ums-badge--info" data-z="tong">0</span>', body: '<div data-z="bang"></div>' });
    var f = function (k) { return root.querySelector('[data-f="' + k + '"]'); };
    var el = { dv: f('dv'), tv: f('tv'), tg: f('tg'), lgv: f('lgv'), he: f('he') };
    Object.keys(el).forEach(function (k) { ui.select2(el[k], { placeholder: el[k].getAttribute('data-ph'), allowClear: true }); });
    ui.datepicker(f('tu')); ui.datepicker(f('den'));
    function v(k) { return pat.val(f(k)); }
    var dt = { rsTongHop: [], rs: [] };

    ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (d) { pat.fill(el.dv, T.arr(d), { head: 'Chọn đơn vị' }); });
    function napTV() {
        ums.api.call({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 100000, strDaoTao_CoCauToChuc_Id: v('dv'), strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0 })
            .then(function (r) { pat.fill(el.tv, T.arr(r.data), { name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO || x.MA); }, head: 'Chọn thành viên' }); })
            .catch(function (err) { ums.api.handle(err, 'danh sách thành viên'); });
    }
    napTV();
    el.dv.addEventListener('change', napTV);
    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }).then(function (d) { pat.fill(el.tg, T.arr(d), { name: 'DAOTAO_THOIGIANDAOTAO' }); });
    ums.api.dm('NS.LGV0').then(function (d) { pat.fill(el.lgv, d); });
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(el.he, T.arr(d), { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); });

    ums.report.mount(root.querySelector('[data-z="bc"]'), { collect: function (add) {
        add('strLoaiGiangVien_Id', v('lgv')); add('strDaoTao_ThoiGianDaoTao_Id', v('tg')); add('strDaoTao_CoCauToChuc_Id', v('dv')); add('strGiangVien_Id', v('tv'));
        add('strTuNgay', f('tu').value); add('strDenNgay', f('den').value); add('strDaoTao_HeDaoTao_Id', v('he'));
    } });

    function ve() {
        var q = f('q').value.trim().toLowerCase();
        var rows = dt.rsTongHop.filter(function (r) { return !q || [r.GIANGVIEN_MASO, r.GIANGVIEN_HOTEN, r.DAOTAO_COCAUTOCHUC_TEN].some(function (x) { return e(x).toLowerCase().indexOf(q) >= 0; }); });
        root.querySelector('[data-z="tong"]').textContent = rows.length;
        ui.table({ el: root.querySelector('[data-z="bang"]'), rows: rows, stt: true, empty: 'Chưa có dữ liệu — chọn điều kiện rồi bấm Tìm kiếm',
            columns: [
                { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' }, { title: 'Mã số', prop: 'GIANGVIEN_MASO', cls: 'is-center is-nowrap' },
                { title: 'Họ tên', prop: 'GIANGVIEN_HOTEN' }, { title: 'Tổng số tiết giảng', prop: 'TONGSOTIET', cls: 'is-center' },
                { title: 'Xem', cls: 'is-center is-actions', render: function (r) { return ui.iconBtn('view', e(r.GIANGVIEN_ID)); } }
            ] });
    }
    function tai() {
        ums.api.call({ action: 'TKGG_GiangDuongTrucTuyen/LayDSLichGiangTheoGiaiDoan', method: 'GET', strDaoTao_HeDaoTao_Id: v('he'), strLoaiGiangVien_Id: v('lgv'),
            strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_CoCauToChuc_Id: v('dv'), strGiangVien_Id: v('tv'), strTuNgay: f('tu').value, strDenNgay: f('den').value })
            .then(function (r) { var d = r.data || {}; dt = { rsTongHop: T.arr(d.rsTongHop), rs: T.arr(d.rs) }; ve(); })
            .catch(function (err) { ums.api.handle(err, 'thống kê lịch giảng'); });
    }
    function xem(id) {
        var gv = dt.rsTongHop.filter(function (x) { return e(x.GIANGVIEN_ID) === id; })[0]; if (!gv) return;
        var dlg = ui.dialog({ title: 'Quá trình - ' + e(gv.GIANGVIEN_HOTEN) + ' - ' + e(gv.GIANGVIEN_MASO), icon: 'fa-calendar-days', size: 'lg', body: '<div data-z="qt"></div>' });
        ui.table({ el: dlg.body.querySelector('[data-z="qt"]'), rows: dt.rs.filter(function (x) { return e(x.GIANGVIEN_ID) === id; }), stt: true,
            columns: [
                { title: 'Ngày', prop: 'NGAYHOC', cls: 'is-center is-nowrap' }, { title: 'Tiết bắt đầu', prop: 'TIETBATDAU', cls: 'is-center' },
                { title: 'Tiết kết thúc', prop: 'TIETKETTHUC', cls: 'is-center' }, { title: 'Số tiết', prop: 'SOTIET', cls: 'is-center' },
                { title: 'Lớp học phần', prop: 'DAOTAO_LOPHOCPHAN_TEN' }, { title: 'Giảng đường', prop: 'GIANGDUONG_TEN' }
            ] });
    }
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="tim"], [data-act="view"]'); if (!b) return;
        if (b.getAttribute('data-a') === 'tim') tai(); else xem(b.getAttribute('data-id'));
    });
    f('q').addEventListener('input', ve);
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
    ve();
})();
