/* =========================================================================
   Nghỉ thai sản — hồ sơ cá nhân của cán bộ đang đăng nhập
   Bản gốc: ApisCongCanBo/Modules/nghithaisan/script/nghithaisan.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QT_ThaiSan/LayDanhSach  GET   strNhanSu_HoSoCanBo_Id = userId
       NS_QT_ThaiSan/LayChiTiet   GET   strId
       NS_QT_ThaiSan/ThemMoi | CapNhat
       NS_QT_ThaiSan/Xoa                strIds
   Tệp đính kèm: NS_Files. Bản gốc KHÔNG gọi ThietLapQuaTrinhCuoiCung.

   Giữ như bản gốc:
     · Ô bắt buộc: bản gốc khai năm ô, ba ô không có trên màn (txtNgayKy,
       txtNgayKetThuc, txtNgayBatDau) nên thực tế chỉ bắt Loại QĐ + Số QĐ.
       Nhãn cũ còn đánh dấu * ở Ngày quyết định và Ngày hiệu lực nhưng không
       bắt — ở đây cũng không bắt (chờ nghiệp vụ nếu muốn bắt).
     · Ngày quyết định gửi vào cả strNgayQuyetDinh lẫn strNgayKyQuyetDinh;
       Ngày hiệu lực gửi vào cả strNgayHieuLuc lẫn strThoiGianBatDauNghi;
       Ngày hết hiệu lực gửi vào strNgayKetThuc.
   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/nghithaisan (cán bộ nhân sự chọn
   một người): ums.ccbHS.nghithaisan(P) trả cấu hình ums.crud. P = { hs() → id hồ sơ
   cán bộ, nth() → id người thực hiện, ns: true ở bản Nhân sự }; mặc định
   (Cổng cán bộ) cả hai là người đăng nhập.
   Bản Nhân sự (P.ns) theo bản gốc của nó: bắt buộc thêm Ngày hiệu lực + Ngày
   hết hiệu lực (arrValid_NghiThaiSan) và chặn "Ngày hiệu lực không được lớn
   hơn ngày hết hiệu lực!" (dateCompare trước khi lưu).
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'NS_QT_ThaiSan';

    function cauHinh(P) {
    return {
        title: 'Nghỉ thai sản',
        listTitle: 'Nghỉ thai sản',
        formTitle: 'nghỉ thai sản',
        icon: 'fa-baby',
        saveAgain: 'Lưu và Nhập tiếp',

        list: { call: function () { return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() }; } },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        columns: [
            { title: 'Số quyết định', prop: 'SOQUYETDINH', cls: 'is-center' },
            { title: 'Ngày quyết định', prop: 'NGAYKYQUYETDINH', cls: 'is-center is-nowrap' },
            { title: 'Ngày hiệu lực', prop: 'THOIGIANBATDAUNGHI', cls: 'is-center is-nowrap' },
            { title: 'Ngày hết hiệu lực', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' }
        ],

        fields: [
            { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', label: 'Loại quyết định', type: 'select', source: { dm: 'NS.QUDI' }, required: true },
            { key: 'strSoQuyetDinh', col: 'NHANSU_TTQUYETDINH_SOQD', label: 'Số quyết định', required: true },
            { key: 'strNgayQuyetDinh', col: 'NHANSU_TTQUYETDINH_NGAYQD', label: 'Ngày quyết định', type: 'date' },
            { key: 'strNgayApDung', col: 'NHANSU_TTQUYETDINH_NGAYAD', label: 'Ngày áp dụng', type: 'date' },
            { key: 'strNgayHieuLuc', col: 'NHANSU_TTQUYETDINH_NGAYHL', label: 'Ngày hiệu lực', type: 'date', required: !!P.ns },
            { key: 'strNgayKetThuc', col: 'NHANSU_TTQUYETDINH_NGAYHHL', label: 'Ngày hết hiệu lực', type: 'date', required: !!P.ns },
            { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' },
            { key: 'strNhanSu_ThongTinQD_Id', col: 'NHANSU_THONGTINQUYETDINH_ID', type: 'hidden' }
        ],

        save: function (v, row) {
            if (P.ns && ums.nsQT && ums.nsQT.soNgay(v.strNgayHieuLuc) > ums.nsQT.soNgay(v.strNgayKetThuc)) {
                ums.ui.toast('Ngày hiệu lực không được lớn hơn ngày hết hiệu lực!', 'warn');
                return null;
            }
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                strSoQuyetDinh: v.strSoQuyetDinh,
                strNgayQuyetDinh: v.strNgayQuyetDinh,
                strNgayKetThuc: v.strNgayKetThuc,
                strNgayHieuLuc: v.strNgayHieuLuc,
                strNgayApDung: v.strNgayApDung,
                strNgayKyQuyetDinh: v.strNgayQuyetDinh,
                strThoiGianBatDauNghi: v.strNgayHieuLuc,
                strThongTinDinhKem: '',
                strNhanSu_ThongTinQD_Id: v.strNhanSu_ThongTinQD_Id,
                strNhanSu_HoSoCanBo_Id: P.hs(),
                iTrangThai: 1,
                iThuTu: 0,
                strNguoiThucHien_Id: P.nth()
            };
        },

        remove: function (ids) {
            return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; });
        }
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).nghithaisan = cauHinh;
    var root = document.getElementById('nghithaisan');
    if (root) ums.crud(Object.assign({ root: root }, cauHinh({ hs: uid, nth: uid })));
})();
