/* =========================================================================
   Giờ làm việc — thời gian làm việc buổi sáng / buổi chiều theo nhóm thời gian
   Bản gốc: ApisNhanSu/Modules/chamcongphep/html/giolamviec.html + script/giolamviec.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái "Nhóm giờ làm việc trong năm" (bảng danh mục NS.TGLV) +
   "Thời gian" (đồng hồ kim + đồng hồ số — edu.util.roundClock / digitalClock);
   phải danh sách (tiêu đề hai tầng Buổi sáng / Buổi chiều) + biểu mẫu.

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM  strMaBangDanhMuc NS.TGLV (getList_DanhMucDulieu)
       NS_QuyDinhGioLamViec/LayDanhSach  GET  strTuKhoa '', strNhomThoiGian_Id '', strNguoiThucHien_Id ''
       NS_QuyDinhGioLamViec/ThemMoi | CapNhat  strId, strNhomThoiGian_Id, strNgayApDung,
            dGioBatDauBuoiSang, dPhutBatDauBuoiSang, dGioKetThucBuoiSang, dPhutKetThucBuoiSang,
            dGioBatDauBuoiChieu, dPhutBatDauBuoiChieu, dGioKetThucBuoiChieu, dPhutKetThucBuoiChieu
       NS_QuyDinhGioLamViec/Xoa          strIds
   Ô giờ trong bảng: "giờ:phút" như gốc (returnEmpty(…, "NUM") → rỗng thành 0).

   Khác gốc: phân trang máy chủ (gốc gửi trang 1/10 mà không vẽ phân trang);
   lưu xong về danh sách; bỏ "Viết lại" (trùng id với "Tải lại", chưa từng chạy).
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, ui = ums.ui, C = 'NS_QuyDinhGioLamViec';
    var root = document.getElementById('giolamviec');
    var K = ['BatDauBuoiSang', 'KetThucBuoiSang', 'BatDauBuoiChieu', 'KetThucBuoiChieu'];

    function so(v) { return v === null || v === undefined || v === '' ? 0 : v; }
    function gio(sau) { return function (r) { return '<i>' + S.esc(so(r['GIO' + sau]) + ':' + so(r['PHUT' + sau])) + '</i>'; }; }
    function cap(nhom, x) {
        return [
            { type: 'legend', label: nhom },
            { key: 'dGio' + x, col: 'GIO' + x.toUpperCase(), label: 'Giờ', type: 'number' },
            { key: 'dPhut' + x, col: 'PHUT' + x.toUpperCase(), label: 'Phút', type: 'number' }
        ];
    }

    S.khung(root, {
        title: 'Giờ làm việc',
        trai: [
            { title: 'Nhóm giờ làm việc trong năm', icon: 'fa-calendar-check', ve: function (h) {
                h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                ums.api.dm('NS.TGLV').then(function (rows) {
                    ui.table({ el: h, rows: rows, columns: [{ title: 'Nhóm giờ', prop: 'TEN' }], empty: 'Chưa khai nhóm giờ làm việc' });
                }, function (err) { h.innerHTML = ui.fail(err.message); });
            } },
            { title: 'Thời gian', icon: 'fa-clock', ve: function (h) {
                h.innerHTML = '<div class="nscham-dhwrap" data-kim></div>';
                var head = h.parentNode.querySelector('.ums-panel__title');
                var dem = document.createElement('span');
                dem.className = 'nscham-dhso';
                head.appendChild(document.createTextNode(' '));
                head.appendChild(dem);
                S.dongHo(h.querySelector('[data-kim]'), dem);
            } }
        ],
        crud: {
            title: 'Thời gian làm việc',
            formTitle: 'thời gian làm việc',
            icon: 'fa-file-lines',
            addText: 'Thêm',
            list: {
                paged: true,
                call: function () {
                    return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: '', strNhomThoiGian_Id: '', strNguoiThucHien_Id: '' };
                }
            },
            columns: [
                { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-nowrap' },
                { title: 'Nhóm thời gian', prop: 'NHOMTHOIGIAN_TEN' },
                { title: 'Bắt đầu', cls: 'is-center', group: ['Buổi sáng'], render: gio('BATDAUBUOISANG') },
                { title: 'Kết thúc', cls: 'is-center', group: ['Buổi sáng'], render: gio('KETTHUCBUOISANG') },
                { title: 'Bắt đầu', cls: 'is-center', group: ['Buổi chiều'], render: gio('BATDAUBUOICHIEU') },
                { title: 'Kết thúc', cls: 'is-center', group: ['Buổi chiều'], render: gio('KETTHUCBUOICHIEU') }
            ],
            fields: [
                { type: 'legend', label: 'Nhóm thời gian theo mùa' },
                { key: 'strNhomThoiGian_Id', col: 'NHOMTHOIGIAN_ID', label: 'Nhóm thời gian', type: 'select', source: { dm: 'NS.TGLV' } },
                { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' }
            ].concat(
                cap('Thời gian bắt đầu buổi sáng', K[0]),
                cap('Thời gian kết thúc buổi sáng', K[1]),
                cap('Thời gian bắt đầu buổi chiều', K[2]),
                cap('Thời gian kết thúc buổi chiều', K[3])
            ),
            save: function (v, row) {
                var o = {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strNhomThoiGian_Id: v.strNhomThoiGian_Id,
                    strNgayApDung: v.strNgayApDung
                };
                K.forEach(function (x) { o['dGio' + x] = v['dGio' + x]; o['dPhut' + x] = v['dPhut' + x]; });
                o.strNguoiThucHien_Id = S.uid();
                return o;
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: S.uid() }; });
            }
        }
    });
})();
