/* =========================================================================
   Nghỉ chế độ — số ngày nghỉ/năm theo loại đối tượng
   Bản gốc: ApisNhanSu/Modules/chamcongphep/html/nghichedo.html + script/nghichedo.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái "Lịch âm - dương" + "Các ngày nghỉ lễ trong năm" (năm
   dòng viết cứng trong html gốc — chép nguyên), phải danh sách + biểu mẫu.

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QuyDinhNghiCheDo/LayDanhSach  GET  strTuKhoa '', strLoaiDoiTuong_Id '', strNguoiThucHien_Id ''
       NS_QuyDinhNghiCheDo/ThemMoi | CapNhat  strId, strLoaiDoiTuong_Id, dSoNgayDuocNghi, strNamApDung
       NS_QuyDinhNghiCheDo/Xoa          strIds
   Danh mục loại đối tượng: NS.LTNS. Năm áp dụng: dateYearToCombo("1993", một ô)
   → năm nay + 5 lùi về 1994.

   Khác gốc: phân trang máy chủ (gốc gửi trang 1/10 mà không vẽ phân trang);
   lưu xong về danh sách; bỏ "Viết lại" (trùng id với "Tải lại", chưa từng chạy).
   Nhãn nhóm "Nhóm thời gian theo mùa" giữ đúng chữ gốc.
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, C = 'NS_QuyDinhNghiCheDo';
    var root = document.getElementById('nghichedo');
    var LE = ['Tết nguyên đán', 'Giỗ tổ hùng vương', 'Nghỉ lễ 30-4 và mùng 1-5', 'Quốc khánh', 'Tết dương lịch'];

    S.khung(root, {
        title: 'Nghỉ chế độ',
        trai: [
            { title: 'Lịch âm - dương', icon: 'fa-calendar', ve: function (h) { h.classList.add('nscham-pad'); S.amLich(h); } },
            { title: 'Các ngày nghỉ lễ trong năm', icon: 'fa-gift', ve: function (h) {
                h.innerHTML = '<ul class="nscham-dsn">' + LE.map(function (t) {
                    return '<li><i class="fa-light fa-angle-right"></i><span>' + S.esc(t) + '</span></li>';
                }).join('') + '</ul>';
            } }
        ],
        crud: {
            title: 'Quy định nghỉ chế độ',
            formTitle: 'nghỉ chế độ',
            icon: 'fa-file-lines',
            addText: 'Thêm',
            list: {
                paged: true,
                call: function () {
                    return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: '', strLoaiDoiTuong_Id: '', strNguoiThucHien_Id: '' };
                }
            },
            columns: [
                { title: 'Đối tượng', prop: 'LOAIDOITUONG_TEN' },
                { title: 'Số ngày nghỉ/năm', prop: 'SONGAYDUOCNGHI', cls: 'is-center' },
                { title: 'Năm áp dụng', prop: 'NAMAPDUNG', cls: 'is-center' }
            ],
            fields: [
                { type: 'legend', label: 'Nhóm thời gian theo mùa' },
                { key: 'strLoaiDoiTuong_Id', col: 'LOAIDOITUONG_ID', label: 'Loại đối tượng', type: 'select', source: { dm: 'NS.LTNS' } },
                { key: 'dSoNgayDuocNghi', col: 'SONGAYDUOCNGHI', label: 'Số ngày nghỉ' },
                { key: 'strNamApDung', col: 'NAMAPDUNG', label: 'Năm áp dụng', type: 'select', source: { items: S.nam(1993, true) }, placeholder: 'Chọn năm áp dụng' }
            ],
            save: function (v, row) {
                return {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strLoaiDoiTuong_Id: v.strLoaiDoiTuong_Id,
                    dSoNgayDuocNghi: v.dSoNgayDuocNghi,
                    strNamApDung: v.strNamApDung,
                    strNguoiThucHien_Id: S.uid()
                };
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: S.uid() }; });
            }
        }
    });
})();
