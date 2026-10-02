/* =========================================================================
   xacnhan — Xác nhận tình trạng vắng thi / vi phạm quy chế thi
   Bản gốc: ApisThiPhach/Modules/kehoach/html/xacnhan.html + script/xacnhan.js (vỏ indexi)
   (màn KHÔNG có trên menu host; tên menu mẫu "Xác nhận (xacnhan)")
   ---------------------------------------------------------------------------
   Nguồn gốc mã: tệp gốc là bản chép từ màn xác nhận của Tốt nghiệp / Học bổng rồi sửa dở sang nghiệp vụ thi:
   danh sách và lời GHI đã đổi sang TP_XacNhanSauThi (thi), nhưng NÚT tình trạng vẫn lấy từ TN_XacNhan (Tốt nghiệp)
   và còn nguyên khối mã kế hoạch tốt nghiệp (TN_KeHoach/*) không có lối vào. Chuyển theo đúng mã đang chạy.
   Khung Học bổng (ums.hbKh) KHÔNG dùng lại được: bộ lọc (Hệ/Khoá/CT/Lớp/Quỹ), danh sách và lời gọi đều khác.

   Bố cục giữ như gốc (một cột): thanh lọc (Thời gian · Đợt thi · Môn thi · Danh sách thi · Trạng thái · từ khoá ·
   Tìm kiếm) → khung "Danh sách" (nút "Xác nhận tình trạng") → chân khung nút "Hủy xác nhận tình trạng".

   Lời gọi (kiểu cũ, chép nguyên):
     danh mục THI.TINHTRANGVANGTHI_VIPHAMQUYCHETHI → ô Trạng thái
     TP_Chung/LayThoiGian GET → ô Thời gian (THOIGIAN)
     TP_Chung/LayDotThi GET (strHinhThucThi_Id '', strDiem_ThanhPhanDiem_Id '', strDaoTao_ThoiGianDaoTao_Id '') → ô Đợt thi (TEN)
     TP_Chung/LayHocPhan GET (strDotThi_Id '', strHinhThucThi_Id '', strDiem_ThanhPhanDiem_Id '', strDaoTao_ThoiGianDaoTao_Id '')
         → ô Môn thi "TEN - MA"
     TP_Chung/LayDSThiTheoDotThi GET (strThi_DotThi_Id '', strTuKhoa '', strDaoTao_HocPhan_Id '') → ô Danh sách thi (cột THOIGIAN — như gốc)
     Danh sách: TP_XacNhanSauThi/LayDSVangThiViPhamQuyChe GET (strTuKhoa, strTinhTrangVangThiViPham_Id, strDaoTao_HocPhan_Id,
         strThi_DotThi_Id, strThi_DanhSachThi_Id, pageIndex, pageSize) — phân trang máy chủ
     Nút tình trạng: TN_XacNhan/LayDSTinhTrangXacNhan GET (strNguoiDung_Id, strPhanLoai_Id '' — gốc đọc dropSearch_PhanLoai không có)
     Xác nhận: POST TP_XacNhanSauThi/ThemMoi mỗi dòng đánh dấu một lời gọi — strSanPham_Id = ID dòng, strNguoiXacnhan_Id,
         strNoiDung, strTinhTrang_Id (KHÔNG có strId — như gốc)

   Các ô lọc KHÔNG có quan hệ cha → con: gốc nạp cả bốn ô một lần lúc mở màn với tham số RỖNG, không ô nào nạp lại theo ô
   khác, ô Thời gian không gửi đi đâu → không khoá (ghi báo cáo).

   Không chép (lỗi rõ của bản gốc):
     · Bảng 10 tiêu đề / 10 cột nhưng lệch: tiêu đề "Lớp học" không có dữ liệu, còn "Trạng thái" + ô đánh dấu là HAI cột dưới
       MỘT tiêu đề → từ cột 4 trở đi dữ liệu lệch một cột. Bỏ tiêu đề "Lớp học", tách cột ô đánh dấu.
     · "Hủy xác nhận tình trạng": vòng lặp của gốc đã chú thích bỏ lời gọi (và delete_XacNhan gọi TN_KeHoach/Xoa — xoá KẾ HOẠCH
       tốt nghiệp) → nút không làm gì. Giữ nút, KHOÁ.
     · Mã chết: save_XacNhan (TN_KeHoach/ThemMoi, CapNhat), delete_XacNhan, viewEdit_XacNhan, .btnAdd / .btnEdit / #btnSave_XacNhan
       (không có trong html), getList_XacNhanTN (biến chưa khai báo) — bỏ.
   Khác gốc (tự chốt, ghi báo cáo):
     · Ô từ khoá: gốc gửi strTuKhoa = txtAAAA (ô không tồn tại) nên gõ không có tác dụng → nay gửi ô "Nhập từ khóa tìm kiếm".
     · "Lịch sử xác nhận": gốc có bảng nhưng không nơi nào nạp → nay nạp TP_XacNhanSauThi/LayDanhSach (strsanpham_Id = ID dòng —
       cùng controller với lời ghi, tham số như màn khaothicapnhat) khi đánh dấu ĐÚNG MỘT dòng. Lời ĐỌC mới, cần kiểm trên host.
     · Xác nhận xong nạp lại trang đang xem (như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tpKt;
    var root = document.getElementById('tp-xacnhan');
    if (!root) return;
    var e = T.e, arr = T.arr, esc = ui.esc, uid = T.uid;

    root.innerHTML =
        pat.page('Xác nhận', '') +
        pat.filterBar([
            { key: 'tg', type: 'select', label: 'Chọn thời gian' },
            { key: 'dot', type: 'select', label: 'Chọn đợt thi' },
            { key: 'mon', type: 'select', label: 'Chọn môn thi' },
            { key: 'ds', type: 'select', label: 'Chọn danh sách thi' },
            { key: 'tt', type: 'select', label: 'Chọn trạng thái' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('confirm', { text: 'Xác nhận tình trạng', mod: 'primary', attr: { 'data-a': 'xacnhan' } }),
            foot: ui.btn('del', { text: 'Hủy xác nhận tình trạng', mod: 'ghost', icon: 'fa-ban', attr: { 'data-a': 'huy', disabled: 'disabled',
                title: 'Bản gốc không gọi máy chủ khi bấm nút này — chờ thủ tục hủy xác nhận' } }) });
    ui.enhance(root);
    T.ganChon(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? String(f(k).value || '').trim() : ''; }

    function napO(k, p, o, ten) {
        p.then(function (d) { pat.fill(f(k), arr(d.data !== undefined ? d.data : d), o); }).catch(function (err) { ums.api.handle(err, ten); });
    }
    napO('tt', ums.api.dm('THI.TINHTRANGVANGTHI_VIPHAMQUYCHETHI'), { head: 'Chọn trạng thái' }, 'trạng thái');
    napO('tg', T.get('TP_Chung/LayThoiGian'), { name: 'THOIGIAN', head: 'Chọn thời gian' }, 'thời gian');
    napO('dot', T.get('TP_Chung/LayDotThi', { strHinhThucThi_Id: '', strDiem_ThanhPhanDiem_Id: '', strDaoTao_ThoiGianDaoTao_Id: '' }), { head: 'Chọn đợt thi' }, 'đợt thi');
    napO('mon', T.get('TP_Chung/LayHocPhan', { strDotThi_Id: '', strHinhThucThi_Id: '', strDiem_ThanhPhanDiem_Id: '', strDaoTao_ThoiGianDaoTao_Id: '' }),
        { name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); }, head: 'Chọn môn thi' }, 'môn thi');
    napO('ds', T.get('TP_Chung/LayDSThiTheoDotThi', { strThi_DotThi_Id: '', strTuKhoa: '', strDaoTao_HocPhan_Id: '' }), { name: 'THOIGIAN', head: 'Chọn danh sách thi' }, 'danh sách thi');

    /* ---------- Danh sách ---------------------------------------------------- */
    var page = 1, size = 10, total = 0, ds = [];
    function tai(p) {
        if (typeof p === 'number') page = p;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return T.get('TP_XacNhanSauThi/LayDSVangThiViPhamQuyChe', { strTuKhoa: v('q'), strTinhTrangVangThiViPham_Id: v('tt'), strDaoTao_HocPhan_Id: v('mon'),
            strThi_DotThi_Id: v('dot'), strThi_DanhSachThi_Id: v('ds'), pageIndex: page, pageSize: size }).then(function (r) {
            ds = arr(r.data);
            total = Number(r.pager) || ds.length;
            z('n').textContent = '(' + ui.so(total) + ')';
            ui.table({ el: z('bang'), rows: ds, empty: 'Không có dữ liệu',
                page: { index: page, size: size, total: total,
                    onChange: function (n) { if (n >= 1 && n <= Math.ceil(total / size)) tai(n); },
                    onSize: function (s) { size = s === 'all' ? ui.PAGE_ALL : Number(s); tai(1); } },
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)); } },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Thành phần điểm', prop: 'DIEM_THANHPHANDIEM_TEN' },
                    { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                    { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' }, { title: 'Trạng thái', prop: 'TRANGTHAI_TEN', cls: 'is-center' },
                    T.cotChon()] });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách vắng thi, vi phạm quy chế'); });
    }

    function xacNhan() {
        var chon = T.daChon(z('bang'), ds);
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        T.xacNhan({ tieuDe: 'Xác nhận', soChon: chon.length,
            chuDe: chon.length === 1 ? e(chon[0].QLSV_NGUOIHOC_MASO) + ' ' + e(chon[0].QLSV_NGUOIHOC_HODEM) + ' ' + e(chon[0].QLSV_NGUOIHOC_TEN) : '',
            nut: function () {
                return ums.api.call({ action: 'TN_XacNhan/LayDSTinhTrangXacNhan', method: 'GET', strNguoiDung_Id: uid(), strPhanLoai_Id: '' })
                    .then(function (r) { return arr(r.data); });
            },
            lichSu: chon.length === 1 ? function () {
                return T.get('TP_XacNhanSauThi/LayDanhSach', { strTuKhoa: '', strsanpham_Id: chon[0].ID, strTinhTrang_Id: '', strNguoiThucHien_Id: '',
                    pageIndex: 1, pageSize: 100000 }).then(function (r) { return arr(r.data); });
            } : null,
            luu: function (tt, noiDung) {
                return chon.map(function (x) {
                    return { action: 'TP_XacNhanSauThi/ThemMoi', method: 'POST', strSanPham_Id: x.ID, strNguoiXacnhan_Id: uid(), strNoiDung: noiDung, strTinhTrang_Id: tt };
                });
            },
            onDone: function () { tai(); } });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]'); if (!b || !root.contains(b) || b.disabled) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai(1);
        else if (a === 'xacnhan') xacNhan();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });

    tai(1);   // gốc nạp danh sách ngay khi mở màn
})();
