/* =========================================================================
   Kế hoạch chi tiết (Thống kê giờ giảng → Tổng hợp giờ)
   Bản gốc: ApisTKGG/Modules/kehoach/html/kehoachchitiet.html + script/kehoachchitiet.js (1.016 dòng, lớp KeHoachChiTiet)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột: thanh lọc (Thời gian · Kế hoạch · Phân loại · từ khoá) · khung "Quy trình: Tính khối lượng"
   (hàng đợi TINH_KLGD) · "Danh sách kế hoạch" (phân trang máy chủ, ô đánh dấu + nút "Tính khối lượng") → biểu mẫu thêm / sửa THAY CHỖ
   (ums.crud). Nhân sự tham gia của một kế hoạch chi tiết: khung thay chỗ (pat.formTrang) có Thêm (hộp chọn người dùng) / Xoá đã chọn.

   Lời gọi (chép nguyên):
     Danh sách    ums.tkggKH.goiKHCT { strTuKhoa (ô từ khoá), strDaoTao_ThoiGianDaoTao_Id, strKLGD_TongHopKhoiLuong_Id, strPhanLoai_Id, pageIndex, pageSize }
                  = TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet GET (strCheDoApDung_Id · strTuNgay · strDenNgay rỗng như gốc, dHieuLuc -1)
     Ô Thời gian  TKGG_KeHoach/LayDSThoiGianTongHopKL GET → ID / THOIGIAN (cả thanh lọc lẫn biểu mẫu — gốc genCombo_ThoiGian)
     Ô Kế hoạch   TKGG_KeHoach/LayDSKLGD_TongHopKhoiLuong GET  strDaoTao_ThoiGianDaoTao_Id (thanh lọc: theo ô Thời gian) · dHieuLuc -1 · pageSize 100000
     Ô Phân loại  TKGG_KeHoach/LayDSPhanLoai GET → ID / TEN (thanh lọc chọn sẵn mục đầu như gốc)
     Ô Chế độ áp dụng  danh mục KLGD.CHEDO
     Ô Kế hoạch kế thừa  ums.tkggKH.goiKHCT { pageSize 100000 } (gốc getList_CBKeHoachChiTiet)
     Lưu   NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgokCS4gIikCKSgVKCQ1  PKG_KLGV_V2_KEHOACH.Them_KLGD_KeHoachChiTiet | EjQgHgoNBgUeCiQJLiAiKQIpKBUoJDUP …Sua_… (khi có strId)
           strId · strTen · strMoTa · strDaoTao_ThoiGianDaoTao_Id · dHieuLuc 1 · strKLGD_TongHopKhoiLuong_Id · strTuNgay · strDenNgay · strCheDoApDung_Id
           · strPhanLoai_Id · dHienThiCongGianVien · strKLGD_KHChiTiet_KeyThua_Id
     Xoá   TKGG_KeHoach/Xoa_KLGD_KeHoachChiTiet POST  strIds
     Tính khối lượng  TKGG_HangDoi/TaoHangDoi_Tinh_KLGD_TuDong GET  strTuKhoa (ô từ khoá) · strChucNang_Id (hệ tự chèn) · strKLGD_KeHoachChiTiet_Id (các dòng đánh dấu, nối ",")
           → báo "Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!" rồi nạp lại hàng đợi (ums.queue.mount strLoaiNhiemVu TINH_KLGD;
           chạy xong nạp lại danh sách = callback gốc)
     Nhân sự tham gia  ums.tkggKH.goiNhanSuKHCT (TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet_NS)
           Thêm  NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgokCS4gIikCKSgVKCQ1Hg8S  PKG_KLGV_V2_KEHOACH.Them_KLGD_KeHoachChiTiet_NS  strNguoiDung_Id · strKLGD_KeHoachChiTiet_Id (mỗi người một lời gọi)
           Xoá   NS_KLGD_KeHoach_MH/GS4gHgoNBgUeCiQJLiAiKQIpKBUoJDUeDxIP  …Xoa_KLGD_KeHoachChiTiet_NS  strIds = ID dòng (mỗi dòng một lời gọi)
           Hộp chọn người dùng: ums.tlKh.pickNguoiDung (nạp chéo ApisDangKyHoc/Modules/thilai/script/_chung.js — thay edu.extend.genModal_NguoiDung)

   Giữ như gốc:
     · Tính khối lượng không bắt buộc đánh dấu dòng (gốc gửi chuỗi rỗng khi chưa chọn) — chỉ hỏi lại một lần.
     · dHieuLuc luôn 1; ô Chế độ áp dụng / Phân loại / Kế hoạch chung không bắt buộc.
   Khác gốc (lỗi rõ ràng / luật bố cục):
     · Ô từ khoá gốc đọc txtAAAA (không gửi) → gửi strTuKhoa từ ô "Nhập từ khóa tìm kiếm".
     · Ô "Kế hoạch kế thừa" (dropKeHoachKeThua): gốc có cột hiển thị, có nạp danh sách và có gửi strKLGD_KHChiTiet_KeyThua_Id nhưng KHÔNG có ô trên
       biểu mẫu → thêm ô (ý định rõ).
     · Phân công nhân sự: gốc có xử lý btnAdd_PhanCong / btnDelete_PhanCong nhưng hai nút không có trên màn (hộp chỉ xem) → dựng khung thay chỗ có
       Thêm / Xoá đã chọn theo ý định; thêm / xoá chạy ums.ui.batch rồi nạp lại một lần (gốc N lời gọi + thanh tiến độ).
     · Ô Kế hoạch của BIỂU MẪU lấy toàn bộ kế hoạch (gốc dùng chung ô với thanh lọc nên bị lọc theo ô Thời gian đang chọn).
     · Thời gian → Kế hoạch của thanh lọc khoá theo luật cha → con; Tên kế hoạch bắt buộc (gốc không kiểm); nút Xoá gốc ẩn (chân biểu mẫu
       display:none) → hiện trong biểu mẫu sửa; hỏi lại một lần (gốc gắn chồng #btnYes).
   Cố ý bỏ (mã chết): hàng đợi TINHPHI_KLGD "TinhTien" + TaoHangDoi_TinhTien_TuDong (nút #btnTaoHangDoi và bảng #tblTaskBar_TinhTien không có trên màn,
     callback me.endHangDoi không tồn tại); chkSelectAll_KeHoachChiTiet (bảng vẽ lại ô chọn tất cả); ô đánh dấu trong hộp nhân sự gốc (không nút nào đọc);
     ảnh minh hoạ img-plan.svg cạnh biểu mẫu.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg, H = ums.tkggKH;
    var root = document.getElementById('tkgg-kehoachchitiet');
    if (!root) return;
    var e = H.e, esc = H.esc, arr = H.arr;
    var P = H.P, KH = H.KH;

    var PHANLOAI = { call: { action: P + 'LayDSPhanLoai', method: 'GET' } };
    var THOIGIAN = T.thoiGian('plain');
    var queue = null;

    var crud = ums.crud({
        root: root,
        title: 'Kế hoạch chi tiết', listTitle: 'Danh sách kế hoạch', formTitle: 'kế hoạch', icon: 'fa-clipboard-list-check',
        rowDelete: false, multi: false,
        toolbar: [{ text: 'Tính khối lượng', icon: 'fa-calculator', onClick: function () { tinhKhoiLuong(); } }],
        filters: [
            { key: 'tg', type: 'select', label: 'Chọn thời gian', source: THOIGIAN },
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch' },
            { key: 'pl', type: 'select', label: 'Chọn phân loại', source: PHANLOAI, first: true },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: { paged: true, call: function (f) {
            return H.goiKHCT({ strTuKhoa: f.q, strDaoTao_ThoiGianDaoTao_Id: f.tg, strKLGD_TongHopKhoiLuong_Id: f.kh, strPhanLoai_Id: f.pl });
        } },
        columns: [
            { title: 'Tên', prop: 'TEN' },
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN' },
            { title: 'Kế hoạch kế thừa', prop: 'KLGD_KHCHITIET_KEYTHUA_TEN' },
            { title: 'Chế độ áp dụng', prop: 'CHEDOAPDUNG_TEN', cls: 'is-center' },
            { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center is-nowrap' },
            { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
            { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-nowrap' },
            { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
            { title: 'Nhân sự tham gia', cls: 'is-center is-nowrap', render: function (r) {
                return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-a': 'ns', 'data-id': e(r.ID) } });
            } },
            { title: 'Thuộc kế hoạch', prop: 'KLGD_TONGHOPKHOILUONG_TEN' },
            H.cotChon('kct')
        ],
        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên kế hoạch', required: true },
            { key: 'strKLGD_TongHopKhoiLuong_Id', col: 'KLGD_TONGHOPKHOILUONG_ID', label: 'Đưa vào kế hoạch chung', type: 'select', placeholder: 'Chọn kế hoạch',
              source: { call: T.keHoachTongHop('plain', '') } },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian', type: 'select', placeholder: 'Chọn thời gian', source: THOIGIAN },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', placeholder: 'Chọn phân loại', source: PHANLOAI },
            { key: 'strCheDoApDung_Id', col: 'CHEDOAPDUNG_ID', label: 'Chế độ áp dụng', type: 'select', placeholder: 'Chọn chế độ', source: { dm: 'KLGD.CHEDO' } },
            { key: 'strKLGD_KHChiTiet_KeyThua_Id', col: 'KLGD_KHCHITIET_KEYTHUA_ID', label: 'Kế hoạch kế thừa', type: 'select', placeholder: 'Chọn kế hoạch',
              source: { call: H.goiKHCT({ pageSize: 100000 }) } },
            { key: 'dHienThiCongGianVien', col: 'HIENTHICONGGIANVIEN', label: 'Hiển thị ở cổng giảng viên', type: 'select', placeholder: 'Hiển thị', source: { items: H.HIENTHI } },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ],
        save: function (v, row) {
            var c = row ? { action: KH + 'EjQgHgoNBgUeCiQJLiAiKQIpKBUoJDUP', func: 'PKG_KLGV_V2_KEHOACH.Sua_KLGD_KeHoachChiTiet' }
                        : { action: KH + 'FSkkLB4KDQYFHgokCS4gIikCKSgVKCQ1', func: 'PKG_KLGV_V2_KEHOACH.Them_KLGD_KeHoachChiTiet' };
            c.strId = row ? e(row.ID) : ''; c.strTen = v.strTen; c.strMoTa = v.strMoTa; c.strDaoTao_ThoiGianDaoTao_Id = v.strDaoTao_ThoiGianDaoTao_Id; c.dHieuLuc = 1;
            c.strKLGD_TongHopKhoiLuong_Id = v.strKLGD_TongHopKhoiLuong_Id; c.strTuNgay = v.strTuNgay; c.strDenNgay = v.strDenNgay;
            c.strCheDoApDung_Id = v.strCheDoApDung_Id; c.strPhanLoai_Id = v.strPhanLoai_Id;
            c.dHienThiCongGianVien = v.dHienThiCongGianVien === '' ? 1 : v.dHienThiCongGianVien; c.strKLGD_KHChiTiet_KeyThua_Id = v.strKLGD_KHChiTiet_KeyThua_Id;
            return c;
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa_KLGD_KeHoachChiTiet', method: 'POST', strIds: id }; }); }
    });
    H.ganChon(root);

    /* ---------- Thanh lọc: Thời gian → Kế hoạch (cha → con) ---------- */
    function F(k) { return root.querySelector('select[data-scope="filter"][data-k="' + k + '"]'); }
    var fTg = F('tg'), fKh = F('kh');
    function napKH() {
        pat.fill(fKh, []);
        if (!fTg.value) return;
        ums.api.call(T.keHoachTongHop('plain', fTg.value)).then(function (r) { pat.fill(fKh, arr(r.data), { head: 'Chọn kế hoạch' }); })
            .catch(function (err) { ums.api.handle(err, 'kế hoạch tổng hợp'); });
    }
    fTg.addEventListener('change', napKH);
    pat.chain([fTg, fKh]);

    /* ---------- Khung "Quy trình: Tính khối lượng" (gốc tblTaskBar_TinhKhoiLuong, giữa thanh lọc và danh sách) ---------- */
    (function () {
        var list = crud.z('list'), ds = list.querySelector('.ums-panel + .ums-panel') || list.lastElementChild;
        var k = document.createElement('div');
        k.innerHTML = pat.panel({ title: 'Quy trình: Tính khối lượng', icon: 'fa-diagram-next', cls: 'ums-u-mb-4', zone: 'hd' });
        list.insertBefore(k.firstChild, ds);
        queue = ums.queue.mount(list.querySelector('[data-z="hd"]'), { strLoaiNhiemVu: 'TINH_KLGD', onDone: function () { crud.load(); } });
    })();

    function tinhKhoiLuong() {
        var ids = H.daChon(root, 'kct');
        ui.confirm('Bạn có chắc chắn <span class="ums-u-danger">Tính khối lượng</span> không?', { ok: 'Tính khối lượng' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TKGG_HangDoi/TaoHangDoi_Tinh_KLGD_TuDong', method: 'GET', strTuKhoa: crud.filterValues().q || '', strChucNang_Id: '', strKLGD_KeHoachChiTiet_Id: ids.join(',') })
                .then(function () { ui.toast('Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!', 'ok'); if (queue) queue.reload(); })
                .catch(function (err) { ums.api.handle(err, 'tính khối lượng'); });
        });
    }

    /* ---------- Khung Nhân sự tham gia của một kế hoạch chi tiết (gốc myModalCanBo + btnAdd_PhanCong / btnDelete_PhanCong) ---------- */
    function moNhanSu(r) {
        var body = document.createElement('div');
        body.innerHTML = '<div class="ums-tablewrap" data-k="t"></div>';
        pat.formTrang({
            host: root, title: 'Nhân sự tham gia: ' + e(r.TEN), icon: 'fa-users', flush: true, cols: 1, body: body,
            buttons: [{ text: 'Thêm', kind: 'add', keepOpen: true, onClick: function () { them(); return false; } }],
            xoa: { chon: 'input[data-chon="pc"]', text: 'Xóa', onClick: function () {
                var ids = H.daChon(body, 'pc');
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                    if (!yes) return;
                    T.xoaNhieu(ids, function (id) { return { action: KH + 'GS4gHgoNBgUeCiQJLiAiKQIpKBUoJDUeDxIP', func: 'PKG_KLGV_V2_KEHOACH.Xoa_KLGD_KeHoachChiTiet_NS', strIds: id }; }).then(tai);
                });
            } }
        });
        H.ganChon(body);
        var host = body.querySelector('[data-k="t"]');
        function tai() {
            host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            return ums.api.call(H.goiNhanSuKHCT(r.ID)).then(function (x) {
                ui.table({ el: host, rows: arr(x.data), stt: true, empty: 'Chưa phân công nhân sự nào', columns: [
                    { title: 'Mã số', prop: 'NGUOIDUNG_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (d) { return esc(H.hoTen(d.NGUOIDUNG_HODEM, d.NGUOIDUNG_TEN)); } },
                    { title: 'Đơn vị', prop: 'DONVI_TEN' }, H.cotChon('pc')] });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nhân sự tham gia'); });
        }
        function them() {
            if (!ums.tlKh || !ums.tlKh.pickNguoiDung) { ui.toast('Chưa nạp hộp chọn người dùng', 'bad'); return; }
            ums.tlKh.pickNguoiDung(function (ids) {
                ui.batch(ids.map(function (id) {
                    return { action: KH + 'FSkkLB4KDQYFHgokCS4gIikCKSgVKCQ1Hg8S', func: 'PKG_KLGV_V2_KEHOACH.Them_KLGD_KeHoachChiTiet_NS', strNguoiDung_Id: id, strKLGD_KeHoachChiTiet_Id: e(r.ID) };
                }), { title: 'Đang phân công', okText: 'Thực hiện thành công' }).then(tai);
            });
        }
        tai();
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="ns"][data-id]'); if (!b || b.closest('.ums-formtrang')) return;
        var r = crud.rows.filter(function (x) { return e(x.ID) === b.getAttribute('data-id'); })[0];
        if (r) moNhanSu(r);
    });
})();
