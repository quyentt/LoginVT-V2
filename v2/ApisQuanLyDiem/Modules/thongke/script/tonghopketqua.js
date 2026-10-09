/* =========================================================================
   Tổng hợp kết quả (Quản lý điểm — mục Thống kê)
   Bản gốc: ApisQuanLyDiem/Modules/thongke/html/tonghopketqua.html — html này nạp
   modules/TINHDIEM/script/tonghopketqua.js (KHÔNG phải thongke/script/tonghopketqua.js — tệp đó không được nạp).
   Chuyển theo tệp đang chạy thật (tinhdiem), chỉ phần có phần tử trên html thongke.
   Khung chung: _chung.js (ums.qldTk.thongTin / gan / bc).
   ---------------------------------------------------------------------------
   Bố cục gốc: khung trái "Quy trình 2: Tổng hợp kết quả" (Phạm vi + thời gian, Hệ → Khoá → CT → Lớp, Khoa quản
   lý, Tình trạng SV, nút Xuất báo cáo · Xem danh sách · Tính điểm, hàng đợi ở dưới) · khung phải "Tính chất lọc
   dữ liệu" · một tab "Danh sách Tổng hợp kết quả" (Lần học · Loại điểm trung bình · Tải lại + bảng).
   Lời gọi (chép nguyên):
       Danh mục DIEM.THANGDIEM · DIEM.LOAIDIEMTRUNGBINH              ô Thang điểm · Loại điểm trung bình
       "Tính điểm" (hỏi lại): D_HangDoi/TaoHangDoi_TinhDiem_TuDong  GET → nạp lại hàng đợi
           (dTongHopLaiDiemThanhPhan đọc #dropCachTinh không có → rỗng)
       Hàng đợi: createHangDoi { strLoaiNhiemVu: 'TINHDIEMTUDONG', strName: 'TongHopKetQua' } → ums.queue.mount
           (không có #tblHistory_TongHopKetQua → không vẽ lịch sử); chạy xong → nạp lại danh sách (endHangDoi)
       "Xem danh sách" / "Tải lại": D_TinhDiem/TinhDiem_TuDong_KetQua  GET (pageSize 100000,
           dThuocTinhLanTinh = Lần học, strLoaiDiemTrungBinh_Id)
   Bỏ / đổi so với gốc:
     · Khung phải gốc có 7 ô, nhưng chỉ Thang điểm được đọc; Tính chất lọc, Loại danh sách, Số lượng cần lấy,
       Thành phần điểm, Đơn vị, Học phần không đi vào lời gọi nào (tệp tinhdiem còn không nạp dữ liệu cho chúng)
       → chỉ giữ Thang điểm.
     · Khung phải gốc lặp lại nút Xuất báo cáo · Xem danh sách · Tính điểm (trùng id — chỉ bộ ở khung trái
       có xử lý) → giữ một bộ.
     · Chọn phạm vi gốc còn gọi PKG_DIEM_THONGTIN2.LayDSTongHopKetQua_ThoiGian để vẽ bảng #tblThamSoPhamVi —
       bảng đó không có trên html thongke → bỏ lời gọi.
     · Mẫu báo cáo đọc edu.TongHopKetQua.strPhamViMa (không tồn tại) → TypeError ở bản thongke; bản tinhdiem
       đọc main_doc — nay đọc phạm vi đang chọn.
     · Mã số gốc là liên kết .btnChiTiet không gắn xử lý → hiện chữ thường.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, Q = ums.qldTk;
    var root = document.getElementById('qld-tonghopketqua');
    function arr(d) { return Array.isArray(d) ? d : []; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }

    /* Ba nút gốc nằm cuối khung trái — đặt ở đầu trang (tên khung dài, đầu khung không đủ chỗ) */
    root.innerHTML = pat.page('Tổng hợp kết quả', '<span data-z="bc"></span>' + ui.btn('search', { text: 'Xem danh sách', attr: { 'data-a': 'xem' } }) +
            ui.btn('search', { text: 'Tính điểm', icon: 'fa-calculator', attr: { 'data-a': 'tinh' } })) +
        '<div class="ums-grid ums-grid--2 ums-u-mb-4">' +
        pat.panel({ title: 'Quy trình 2: Tổng hợp kết quả', icon: 'fa-link',
            body: Q.thongTin({ phamVi: true }) + '<div class="ums-u-mt-3" data-z="hd"></div>' }) +
        pat.panel({ title: 'Tính chất lọc dữ liệu', icon: 'fa-filter', body: '<div class="qldtk-form">' + Q.truong('Thang điểm', Q.sel('td', 'Chọn thang điểm')) + '</div>' }) +
        '</div>' +
        pat.panel({ title: 'Danh sách Tổng hợp kết quả', icon: 'fa-list', count: 'n', flush: true,
            tools: ui.btn('reload', { attr: { 'data-a': 'xem' } }),
            body: '<div class="ums-filter qldtk-loc">' +
                '<div class="ums-field"><select class="ums-select" data-f="lan" data-required><option value="1">Lần 1</option><option value="0">Cao nhất</option></select></div>' +
                '<div class="ums-field">' + Q.sel('ldtb', 'Chọn loại điểm trung bình') + '</div></div>' +
                '<div data-z="bang">' + ui.empty('Bấm "Xem danh sách" để tải kết quả', 'fa-table') + '</div>' });
    ui.enhance(root);
    var api = Q.gan(root, { phamVi: true }), v = api.v;
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    ums.api.dm('DIEM.THANGDIEM').then(function (d) { pat.fill(api.f('td'), d); }).catch(function () {});
    ums.api.dm('DIEM.LOAIDIEMTRUNGBINH').then(function (d) { pat.fill(api.f('ldtb'), d, { head: 'Chọn loại điểm trung bình' }); }).catch(function () {});

    /* Tham số chung của "Tính điểm" và danh sách (getList_KetQua / TaoHangDoi_TongHopKetQua_TuDong) */
    function chung() {
        return {
            strTrangThaiNguoiHoc_Id: v('tt'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
            strDaoTao_KhoaQuanLy_Id: v('kql'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_LopQuanLy_Id: v('lop'),
            strPhamViTongHopDiem_Id: v('pv'), strDaoTao_ThoiGianDaoTao_Id: api.thoiGian(), strThangDiem_Id: v('td'),
            strNguoiThucHien_Id: ''
        };
    }

    function xem() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(Object.assign({ action: 'D_TinhDiem/TinhDiem_TuDong_KetQua', method: 'GET', strTuKhoa: '' }, chung(), {
            dThuocTinhLanTinh: v('lan'), strLoaiDiemTrungBinh_Id: v('ldtb'), pageIndex: 1, pageSize: 100000
        })).then(function (r) {
            var rows = arr(r.data);
            z('n').textContent = '(' + (r.pager || rows.length) + ')';
            ui.table({ el: z('bang'), rows: rows, empty: 'Không có dữ liệu', columns: [
                { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (x) { return esc(e(x.HODEM) + ' ' + e(x.TEN)); } },
                { title: 'Ngày sinh', prop: 'NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
                { title: 'Lớp', prop: 'LOP' }, { title: 'Chương trình học', prop: 'NGANH' },
                { title: 'Khóa học', prop: 'KHOADAOTAO' }, { title: 'Khoa quản lý', prop: 'KHOAQUANLY' },
                { title: 'Tình trạng', prop: 'TRANGTHAINGUOIHOC_TEN', cls: 'is-center' },
                { title: 'Số tín chỉ', prop: 'TONGSOTINCHI', cls: 'is-center' },
                { title: 'Điểm TBC', prop: 'DIEMTRUNGBINH', cls: 'is-center' }
            ] });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách tổng hợp kết quả'); });
    }

    var hangDoi = ums.queue.mount(z('hd'), { strLoaiNhiemVu: 'TINHDIEMTUDONG', strName: 'TongHopKetQua', history: false, onDone: xem });

    ums.report.mount(z('bc'), { import: false, collect: function (add) { Q.bc(add, api, api.thoiGian()); } });  // html gốc không có vùng _Import
    root.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-a]');
        if (!a) return;
        var k = a.getAttribute('data-a');
        if (k === 'xem') xem();
        else if (k === 'tinh') ui.confirm('Bạn có chắc chắn Tổng hợp kết quả không?', { ok: 'Tính điểm', title: 'Tổng hợp kết quả' }).then(function (ok) {
            if (!ok) return;
            ums.api.call(Object.assign({ action: 'D_HangDoi/TaoHangDoi_TinhDiem_TuDong', method: 'GET' }, chung(), { dTongHopLaiDiemThanhPhan: '' }))
                .then(function () { ui.toast('Khởi tạo dữ liệu thành công!', 'ok'); hangDoi.reload(); })
                .catch(function (err) { ums.api.handle(err, 'D_HangDoi/TaoHangDoi_TinhDiem_TuDong'); });
        });
    });
})();
