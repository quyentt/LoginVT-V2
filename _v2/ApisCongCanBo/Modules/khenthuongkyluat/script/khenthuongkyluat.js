/* =========================================================================
   Khen thưởng - Kỷ luật — hồ sơ cá nhân của cán bộ đang đăng nhập
   Bản gốc: ApisCongCanBo/Modules/khenthuongkyluat/script/khenthuongkyluat.js
   ---------------------------------------------------------------------------
   Một tab, hai khung — controller kiểu cũ (không mã hoá):
       Quá trình khen thưởng   NS_QT_KhenThuong   (thêm xong: ThietLapQuaTrinhCuoiCung NHANSU_QT_KHTT)
       Quá trình kỷ luật       NS_QT_KyLuat       (thêm xong: NHANSU_QT_KYLU)
   LayDanhSach (GET), LayChiTiet (GET), ThemMoi | CapNhat, Xoa (strIds).
   Tệp đính kèm: NS_Files. Danh mục: NS.QUDI, NS.HINHTHUCKHENTHUONG,
   NCKH.LKT (cấp khen thưởng), NS.HINHTHUCKYLUAT.

   Khác bản gốc (lỗi rõ ràng, không chép):
     · Nút "Thêm mới" khen thưởng: resetPopup_KhenThuong chạy
       `me.me.strQuyetDinh_Id = ""` → ném lỗi TRƯỚC khi mở biểu mẫu, nên trên
       hệ cũ không thêm được khen thưởng, chỉ sửa được dòng có sẵn. Ở đây
       thêm được.
     · Kỷ luật: bản gốc đọc/ghi ô txtKL_NgayKyQuyetDinh không có trên màn →
       "Ngày quyết định" luôn gửi rỗng, không hiện lại. Nối đúng ô "Ngày
       quyết định". (Ô bắt buộc trỏ vào ô không tồn tại thì emptyValidForm
       bỏ qua — nên bản gốc vẫn lưu được, chỉ mất ngày.)
     · Hộp "Thêm quyết định" (zone QuyetDinh): nút mở nó (#btnAddQuyetDinh)
       không có trên màn và hàm save_QuyetDinh không tồn tại — không chuyển.
   Giữ như bản gốc (chờ nghiệp vụ):
     · Khen thưởng: "Ngày hết hiệu lực" bị chú thích bỏ khỏi lời gọi (ô
       cũng không có trên màn). strNhanSu_ThongTinQD_Id lấy từ chi tiết khi
       sửa (ô ẩn), rỗng khi thêm.
     · Kỷ luật: "Loại quyết định", "Ngày áp dụng", "Ngày hiệu lực", "Ngày hết
       hiệu lực" hiện trên màn nhưng bản gốc gửi rỗng cả bốn.

   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/khenthuongkyluat (cán bộ nhân
   sự chọn một người): ums.ccbHS.khenthuongkyluat(P) trả { title, tabs } cho
   ums.pat.sections. P = { hs() → id hồ sơ cán bộ, nth() → id người thực hiện,
   ns: true ở bản Nhân sự }; mặc định (Cổng cán bộ) cả hai là người đăng nhập.
   Bản Nhân sự (P.ns) theo html/arrValid gốc của nó: biểu mẫu khen thưởng chia
   nhóm "Thông tin khen thưởng" / "Thông tin quyết định"; Ngày quyết định KHÔNG
   bắt buộc (arrValid gốc trỏ ô txtKT_NgayKyQD không có). Phần "Danh sách kèm
   theo" (thêm cho nhiều cán bộ) do màn Nhân sự tự gắn thêm.
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cuoi(ma) { return function (crud, result, isEdit) { if (!isEdit) ums.ref.quaTrinhCuoiCung(ma); }; }
    var QUDI = { dm: 'NS.QUDI' };

    function cauHinh(P) {
    function ds(c) { return function () { return { action: c + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() }; }; }
    function ct(c) { return function (row) { return { action: c + '/LayChiTiet', method: 'GET', strId: row.ID }; }; }
    function xoa(c) { return function (ids) { return ids.map(function (id) { return { action: c + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; }); }; }

    var KT = 'NS_QT_KhenThuong';
    var khenThuong = {
        title: 'Quá trình khen thưởng', formTitle: 'khen thưởng', icon: 'fa-trophy', saveAgain: 'Lưu và nhập tiếp',
        list: { call: ds(KT) },
        detail: ct(KT),
        columns: [
            { title: 'Cơ quan khen thưởng', prop: 'COQUANKHENTHUONG' },
            { title: 'Cấp khen thưởng', prop: 'CAPKHENTHUONG_TEN' },
            { title: 'Hình thức khen thưởng', prop: 'HINHTHUCKHENTHUONG_TEN' },
            { title: 'Số quyết định', prop: 'NHANSU_TTQUYETDINH_SOQD', cls: 'is-center' },
            { title: 'Ngày ký quyết định', prop: 'NHANSU_TTQUYETDINH_NGAYQD', cls: 'is-center is-nowrap' }
        ],
        fields: (P.ns ? [{ key: '_ttkt', type: 'legend', label: 'Thông tin khen thưởng' }] : []).concat([
            { key: 'strCoQuanKhenThuong', col: 'COQUANKHENTHUONG', label: 'Cơ quan khen thưởng', required: true, span: true },
            { key: 'strThanhTichKhenThuong_Khac', col: 'THANHTICHKHENTHUONG_KHAC', label: 'Thành tích', required: true, span: true },
            { key: 'strHinhThucKhenThuong_Id', col: 'HINHTHUCKHENTHUONG_ID', label: 'Hình thức khen thưởng', type: 'select',
              source: { dm: 'NS.HINHTHUCKHENTHUONG' }, required: true, span: true },
            { key: 'strHinhThucKhenThuong', col: 'HINHTHUCKHENTHUONG', label: 'Hình thức khen thưởng khác' },
            { key: 'strCapKhenThuong_Id', col: 'CAPKHENTHUONG_ID', label: 'Cấp khen thưởng', type: 'select',
              source: { dm: 'NCKH.LKT' }, required: true }
        ], P.ns ? [{ key: '_ttqd', type: 'legend', label: 'Thông tin quyết định' }] : [], [
            { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', label: 'Loại quyết định', type: 'select', source: QUDI },
            { key: 'strSoQuyetDinh', col: 'NHANSU_TTQUYETDINH_SOQD', label: 'Số quyết định', required: true },
            { key: 'strNgayQuyetDinh', col: 'NHANSU_TTQUYETDINH_NGAYQD', label: 'Ngày quyết định', type: 'date', required: !P.ns },
            { key: 'strNgayApDung', col: 'NHANSU_TTQUYETDINH_NGAYAD', label: 'Ngày áp dụng', type: 'date' },
            { key: 'strNgayHieuLuc', col: 'NHANSU_TTQUYETDINH_NGAYHL', label: 'Ngày hiệu lực', type: 'date' },
            { key: '_g', type: 'gap' },
            { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' },
            { key: 'strNhanSu_ThongTinQD_Id', col: 'NHANSU_THONGTINQUYETDINH_ID', type: 'hidden' }
        ]),
        save: function (v, row) {
            return {
                action: KT + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strSoQuyetDinh: v.strSoQuyetDinh,
                strNgayQuyetDinh: v.strNgayQuyetDinh,
                strNguoiKyQuyetDinh: '',
                strNgayHieuLuc: v.strNgayHieuLuc,
                strThongTinQuyetDinh: '',
                strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                iTrangThai: 1,
                strHinhThucKhenThuong_Id: v.strHinhThucKhenThuong_Id,
                strCapKhenThuong_Id: v.strCapKhenThuong_Id,
                strThanhTichKhenThuong_Khac: v.strThanhTichKhenThuong_Khac,
                strNgayApDung: v.strNgayApDung,
                strHinhThucKhenThuong: v.strHinhThucKhenThuong,
                strCoQuanKhenThuong: v.strCoQuanKhenThuong,
                strThongTinDinhKem: '',
                strNhanSu_ThongTinQD_Id: row ? v.strNhanSu_ThongTinQD_Id : '',
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strNguoiThucHien_Id: P.nth(),
                iThuTu: ''
            };
        },
        onSaved: cuoi('NHANSU_QT_KHTT'),
        remove: xoa(KT),
        onRemoved: ums.ref.xoaQuyetDinhKem   // dọn quyết định máy chủ sinh kèm dòng vừa xoá (2026-09-30)
    };

    var KL = 'NS_QT_KyLuat';
    var kyLuat = {
        title: 'Quá trình kỷ luật', formTitle: 'kỷ luật', icon: 'fa-gavel', saveAgain: 'Lưu và nhập tiếp',
        list: { call: ds(KL) },
        detail: ct(KL),
        columns: [
            { title: 'Cơ quan kỷ luật', prop: 'COQUANKYLUAT' },
            { title: 'Hình thức kỷ luật', prop: 'HINHTHUCKYLUAT_TEN' },
            { title: 'Số quyết định', prop: 'NHANSU_TTQUYETDINH_SOQD', cls: 'is-center' },
            { title: 'Ngày ký quyết định', prop: 'NHANSU_TTQUYETDINH_NGAYQD', cls: 'is-center is-nowrap' }
        ],
        fields: [
            { key: 'strCoQuanKyLuat', col: 'COQUANKYLUAT', label: 'Cơ quan kỷ luật', required: true, span: true },
            { key: 'strLyDo', col: 'LYDO', label: 'Lý do kỷ luật', required: true, span: true },
            { key: 'strHinhThucKyLuat_Id', col: 'HINHTHUCKYLUAT_ID', label: 'Hình thức kỷ luật', type: 'select',
              source: { dm: 'NS.HINHTHUCKYLUAT' }, required: true },
            { key: 'strHinhThucKyLuat', col: 'HINHTHUCKYLUAT', label: 'Hình thức kỷ luật khác' },
            { key: '_loaiQD', label: 'Loại quyết định', type: 'select', source: QUDI },
            { key: 'strSoQuyetDinh', col: 'NHANSU_TTQUYETDINH_SOQD', label: 'Số quyết định', required: true },
            { key: 'strNgayQuyetDinh', col: 'NHANSU_TTQUYETDINH_NGAYQD', label: 'Ngày quyết định', type: 'date' },
            { key: '_ngayApDung', label: 'Ngày áp dụng', type: 'date' },
            { key: '_ngayHieuLuc', label: 'Ngày hiệu lực', type: 'date' },
            { key: '_ngayHetHieuLuc', label: 'Ngày hết hiệu lực', type: 'date' },
            { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' }
        ],
        save: function (v, row) {
            return {
                action: KL + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strNgayQuyetDinh: v.strNgayQuyetDinh,
                strSoQuyetDinh: v.strSoQuyetDinh,
                strNguoiKyQuyetDinh: '',
                strNgayHieuLuc: '',
                strThongTinQuyetDinh: '',
                strLoaiQuyetDinh_Id: '',
                strNgayHetHieuLuc: '',
                strLyDo: v.strLyDo,
                strHinhThucKyLuat_Id: v.strHinhThucKyLuat_Id,
                strHinhThucKyLuat: v.strHinhThucKyLuat,
                strNamKyLuat: '',
                strCoQuanKyLuat: v.strCoQuanKyLuat,
                strThongTinDinhKem: '',
                strNhanSu_ThongTinQD_Id: '',
                iTrangThai: 1,
                iThuTu: 0,
                strNguoiThucHien_Id: P.nth()
            };
        },
        onSaved: cuoi('NHANSU_QT_KYLU'),
        remove: xoa(KL),
        onRemoved: ums.ref.xoaQuyetDinhKem   // dọn quyết định máy chủ sinh kèm dòng vừa xoá (2026-09-30)
    };

    return {
        title: 'Khen thưởng - Kỷ luật',
        tabs: [{ key: 'ktkl', text: 'Khen thưởng - Kỷ luật', sections: [khenThuong, kyLuat] }]
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).khenthuongkyluat = cauHinh;
    var root = document.getElementById('khenthuongkyluat');
    if (root) ums.pat.sections(Object.assign({ el: root }, cauHinh({ hs: uid, nth: uid })));
})();
