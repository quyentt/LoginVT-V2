/* =========================================================================
   Nghỉ thai sản — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem/sửa
   Bản gốc: ApisNhanSu/Modules/nghithaisan/script/nghithaisan.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man), phải:
     · "Danh sách dự kiến sắp hết nghỉ thai sản" (zone_list_HetHanNghiThaiSan)
         NS_QT_ThaiSan/LocDSNhanSu_QT_THSA_DenHan  GET  strNguoiThucHien_Id = người
         đăng nhập, dSoNgayQuyDinh 10 → cột Họ và tên (HO + TEN) · Mã cán bộ
         (MACANBO) · Ngày bắt đầu (THOIGIANBATDAUNGHI) · Ngày kết thúc (NGAYKETTHUC)
     · bấm một cán bộ → khung "Nghỉ thai sản" của người đó — lời gọi TRÙNG bản
       Cổng cán bộ (NS_QT_ThaiSan/LayDanhSach · LayChiTiet · ThemMoi | CapNhat ·
       Xoa, tệp NS_Files) → ums.ccbHS.nghithaisan(P); cờ P.ns bật hai ô bắt
       buộc Ngày hiệu lực / Ngày hết hiệu lực và kiểm hiệu lực ≤ hết hiệu lực.

   Khác bản gốc (lỗi rõ ràng):
     · Danh sách dự kiến CHƯA TỪNG HIỆN: page_load gọi toggle_notify() →
       toggle_overide sang vùng "zone_notify_HetHanNghiThaiSan" không có trên
       màn, nên mọi vùng zone-bus (kể cả danh sách dự kiến) bị ẩn; hai nút mở
       lại nó (#btnViewNghiThaiSan_DuBao, #btnViewChucVu_DuBao) cũng không có.
       Ở đây danh sách dự kiến hiện ở cột phải khi CHƯA chọn cán bộ (đúng chỗ
       html gốc đặt nó); nút "Đóng" của khung đó bỏ (đóng xong cột phải trống).
     · Nút "Xuất excel" (#btnPrint_DuKien) không có xử lý ở bản gốc → giữ nút, khoá.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    function duKien(host) {
        host.innerHTML = pat.panel({
            title: 'Danh sách dự kiến sắp hết nghỉ thai sản', icon: 'fa-file-lines', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('excel', { text: 'Xuất excel', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý cho nút này' } })
        });
        var bang = host.querySelector('[data-z="bang"]');
        bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'NS_QT_ThaiSan/LocDSNhanSu_QT_THSA_DenHan', method: 'GET',
            strNguoiThucHien_Id: ums.nsQT.uid(), dSoNgayQuyDinh: 10 }).then(function (r) {
            var rows = Array.isArray(r.data) ? r.data : [];
            host.querySelector('[data-z="n"]').textContent = '(' + rows.length + ')';
            ui.table({
                el: bang, rows: rows,
                columns: [
                    { title: 'Họ và tên', render: function (x) { return ui.esc(e(x.HO) + ' ' + e(x.TEN)); } },
                    { title: 'Mã cán bộ', prop: 'MACANBO', cls: 'is-center' },
                    { title: 'Ngày bắt đầu', prop: 'THOIGIANBATDAUNGHI', cls: 'is-center is-nowrap' },
                    { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' }
                ],
                empty: 'Không có cán bộ sắp hết nghỉ thai sản'
            });
        }).catch(function (err) {
            bang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách dự kiến sắp hết nghỉ thai sản');
        });
    }

    ums.nsQT.man({
        el: document.getElementById('ns_nghithaisan'),
        title: 'Nghỉ thai sản',
        trong: duKien,
        mo: function (host, cb, P) { ums.nsQT.crud(host, ums.ccbHS.nghithaisan(P)); }
    });
})();
