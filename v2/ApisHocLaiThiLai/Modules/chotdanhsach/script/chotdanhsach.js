/* =========================================================================
   Chốt danh sách học lại thi lại
   Bản gốc: ApisHocLaiThiLai/Modules/chotdanhsach/html/chotdanhsach.html + script/chotdanhsach.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp / Học kỳ · Khoa QL ·
   Đánh giá · Trạng thái đăng ký / từ khoá · Tìm kiếm / Học phần · "Xem học phần" /
   trạng thái sinh viên) → khung "Danh sách" (ẩn tới khi Tìm kiếm, nút × để đóng):
   bảng sinh viên có cột "Thu tiền" (TINHTRANGTAICHINH) và cột ô đánh dấu.
   Thanh lọc dùng chung: ums.hltl.boLoc (lapdanhsach/script/_hltl.js).

   Lời gọi (chép nguyên, đều GET):
       HLTL_ThongTinChung/LayDSHocPhanHocLaiThiLai   nút "Xem học phần" → ô Học phần ("MA - TEN");
            strTuKhoa = '' (gốc đọc txtAAAA).
       HLTL_ThongTinChung/LayDSNguoiHocHocLaiThiLai  Tìm kiếm, phân trang MÁY CHỦ → Data.rs;
            strDaoTao_HocPhan_Id = '' và strTinhTrangXacNhan_Id = '' — gốc đọc dropAAAA cho CẢ HAI,
            tức ô Học phần và ô Trạng thái đăng ký có trên màn nhưng KHÔNG gửi đi. Giữ như gốc,
            ghi can-quyet.

   Giữ như gốc: cột ô đánh dấu + ô "chọn tất cả" — bản gốc KHÔNG có nút nào dùng các dòng đã
   chọn (chưa làm xong phần "chốt"). Giữ cột để khớp bố cục, ghi can-quyet.

   Cố ý bỏ (mã chết — không nút / ô nào dùng tới):
     · LayKQNguoiHocHocLaiThiLai (getList_KetQua không nơi nào gọi), TC_DoiTuong_MienGiam/ThemMoi
       · /Xoa (chép từ màn Tài chính, không có nút), D_HangDoi/TaoHangDoi_LapDSHLTL_TuDong
       (không có nút "Thực hiện xử lý" ở màn này).
     · Chung ba màn: xem đầu tệp _hltl.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, H = ums.hltl, esc = ui.esc;
    var root = document.getElementById('hltl-chotdanhsach');
    if (!root) return;

    root.innerHTML = pat.page('Chốt danh sách học lại thi lại', '') +
        '<div data-z="loc"></div>' + H.khungDS({ icon: 'fa-list-timeline' });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = H.boLoc(z('loc'), {
        khoaQL: 'khct', trangThaiDK: true,
        hocPhan: {
            nut: 'Xem học phần',
            ten: function (r) { return H.e(r.MA) + ' - ' + H.e(r.TEN); },
            call: function (p) {
                return Object.assign({ action: H.AC + 'LayDSHocPhanHocLaiThiLai', method: 'GET' }, p,
                    { strTuKhoa: '', strNguoiThucHien_Id: H.uid() });
            }
        }
    });

    var st = { p: null, index: 1, size: 10 };

    var COT = H.cotSV().concat([
        { title: 'Thu tiền', prop: 'TINHTRANGTAICHINH' },
        { head: '<input type="checkbox" data-hlall title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r) { return '<input type="checkbox" data-hl value="' + esc(r.ID) + '">'; } }
    ]);

    function nap(index) {
        st.index = index || 1;
        z('kq').hidden = false;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(Object.assign({ action: H.AC + 'LayDSNguoiHocHocLaiThiLai', method: 'GET' }, st.p, {
            strDaoTao_HocPhan_Id: '', strTinhTrangXacNhan_Id: '', strNguoiThucHien_Id: H.uid(),
            pageIndex: st.index, pageSize: st.size }))
            .then(function (r) {
                var rows = H.arr((r.data || {}).rs);
                var tong = r.pager || rows.length;
                z('n').textContent = '(' + tong + ')';
                ui.table({ el: z('bang'), rows: rows, columns: COT, empty: 'Không có dữ liệu',
                    page: { index: st.index, size: st.size, total: tong,
                        onChange: nap, onSize: function (v) { st.size = v; nap(1); } } });
            })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách chốt'); });
    }
    function tim() { st.p = loc.thamSo(); nap(1); }

    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.hasAttribute && t.hasAttribute('data-hlall')) {
            z('bang').querySelectorAll('tbody input[data-hl]').forEach(function (x) { x.checked = t.checked; });
        }
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'dong') z('kq').hidden = true;
    });
    loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
