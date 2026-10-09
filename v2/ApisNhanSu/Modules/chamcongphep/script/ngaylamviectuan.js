/* =========================================================================
   Ngày làm việc trong tuần — quy định làm việc theo thứ trong tuần
   Bản gốc: ApisNhanSu/Modules/chamcongphep/html/ngaylamviectuan.html + script/ngaylamviectuan.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái "Lịch âm - dương", phải danh sách + biểu mẫu (ums.crud nhúng).

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QuyDinhNgayLamViec/LayDanhSach  GET  strTuKhoa '', strQuyDinh_Id '', strNguoiThucHien_Id ''
       NS_QuyDinhNgayLamViec/ThemMoi      strId '', strThu, strQuyDinh_Id, strNgayApDung, strNguoiThucHien_Id
       NS_QuyDinhNgayLamViec/CapNhat      như trên — gốc KHÔNG gửi strNguoiThucHien_Id (api.js tự điền
                                          người đang đăng nhập khi tham số vắng, như mọi lời gọi)
       NS_QuyDinhNgayLamViec/Xoa          strIds
   Danh mục "Quy định": NS.LVTT (constant CATOR.NS.LVTT). Ô "Thứ": 2…8 → T2…T7, CN
   (daysOfWeekToCombo); cột Thứ: convertNumToDay.

   Khác gốc: gốc gửi trang mặc định (1, 10) mà không vẽ phân trang → quá 10 dòng
   là mất; bản mới phân trang máy chủ. Lưu xong về danh sách (gốc ở lại biểu mẫu
   với id cũ). Bỏ nút "Viết lại" (trùng id với "Tải lại" nên chưa từng chạy).
   Nhãn nhóm "Nhóm thời gian theo mùa" giữ đúng chữ gốc.
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, C = 'NS_QuyDinhNgayLamViec';
    var root = document.getElementById('ngaylamviectuan');

    S.khung(root, {
        title: 'Ngày làm việc trong tuần',
        trai: [{ title: 'Lịch âm - dương', icon: 'fa-calendar', ve: function (h) { h.classList.add('nscham-pad'); S.amLich(h); } }],
        crud: {
            title: 'Quy định làm việc trong tuần',
            formTitle: 'ngày làm việc tuần',
            icon: 'fa-file-lines',
            addText: 'Thêm',
            list: {
                paged: true,
                call: function () {
                    return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: '', strQuyDinh_Id: '', strNguoiThucHien_Id: '' };
                }
            },
            columns: [
                { title: 'Thứ', cls: 'is-center', render: function (r) { return S.esc(S.tenThu(r.THU)); } },
                { title: 'Quy định', prop: 'QUYDINH_TEN' },
                { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
            ],
            fields: [
                { type: 'legend', label: 'Nhóm thời gian theo mùa' },
                { key: 'strThu', col: 'THU', label: 'Thứ', type: 'select', source: { items: S.thu() }, placeholder: 'Chọn thứ trong tuần' },
                { key: 'strQuyDinh_Id', col: 'QUYDINH_ID', label: 'Quy định', type: 'select', source: { dm: 'NS.LVTT' } },
                { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' }
            ],
            save: function (v, row) {
                var o = {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strThu: v.strThu,
                    strQuyDinh_Id: v.strQuyDinh_Id,
                    strNgayApDung: v.strNgayApDung
                };
                if (!row) o.strNguoiThucHien_Id = S.uid();
                return o;
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: S.uid() }; });
            }
        }
    });
})();
