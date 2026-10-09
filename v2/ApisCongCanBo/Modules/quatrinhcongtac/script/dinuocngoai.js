/* =========================================================================
   Đi nước ngoài — hồ sơ cá nhân
   Bản gốc: ApisCongCanBo/Modules/quatrinhcongtac/script/dinuocngoai.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QT_CongTacNuocNgoai/LayDanhSach  GET  strNhanSu_HoSoCanBo_Id
       NS_QT_CongTacNuocNgoai/ThemMoi | CapNhat, Xoa (strIds)
       (không có LayChiTiet — bản gốc lấy dòng từ danh sách để sửa)
   Lưới "Quyết định" trong biểu mẫu: NS_ThongTinQuyetDinh
       LayDanhSach (strNguonDuLieu_Id = id chuyến đi, strThanhVien_Id = userId),
       ThemMoi | CapNhat, Xoa; tệp của từng dòng vào NS_Files.
       Chỉ lưu dòng có Số QĐ. Thêm mới vẽ 4 dòng trống, sửa vẽ tối thiểu 3.
   Danh mục loại quyết định của lưới: NS.QUDI.
   Bản gốc không có tệp đính kèm cho chính chuyến đi, không gọi
   ThietLapQuaTrinhCuoiCung.

   Giữ như bản gốc: bản gốc có nạp NS.DINUOCNGOAI.LOAIQUYETDINH vào ô
   drop_QD_Loai không có trên màn — bỏ lời gọi nạp.

   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/quatrinhcongtac/dinuocngoai:
   ums.ccbHS.dinuocngoai(P) trả cấu hình ums.crud. P = { hs() → id hồ sơ cán
   bộ, nth() → id người thực hiện, ns: true ở bản Nhân sự }; mặc định (Cổng
   cán bộ) cả hai là người đăng nhập. Bản Nhân sự sửa thì lấy LayChiTiet
   (P.ns — bản gốc Nhân sự có getDetail_DiNuocNgoai).
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'NS_QT_CongTacNuocNgoai', QD = 'NS_ThongTinQuyetDinh';

    function cauHinh(P) {
    var luoi = null;
    function veLuoi(extra, row) {
        luoi = ums.pat.rows(extra, {
            title: 'Quyết định', icon: 'fa-file-signature', minRows: 3, minRowsNew: 4,
            columns: [
                { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', title: 'Loại quyết định', type: 'select',
                  source: { dm: 'NS.QUDI' }, placeholder: '--- Chọn loại quyết định--' },
                { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', title: 'Số QĐ' },
                { key: 'strNgayQuyetDinh', col: 'NGAYQUYETDINH', title: 'Ngày QĐ', type: 'date', width: '130px' },
                { key: 'strNgayApDung', col: 'NGAYAPDUNG', title: 'Ngày áp dụng', type: 'date', width: '130px' },
                { key: 'strNgayHieuLuc', col: 'NGAYHIEULUC', title: 'Ngày hiệu lực', type: 'date', width: '130px' },
                { key: 'strNgayHetHieuLuc', col: 'NGAYHETHIEULUC', title: 'Ngày hết hiệu lực', type: 'date', width: '130px' },
                { key: 'strThongTinQuyetDinh', col: 'THONGTINQUYETDINH', title: 'Nội dung QĐ' },
                { key: '_tep', title: 'File đính kèm', type: 'files', api: 'NS_Files' }
            ],
            list: function (id) {
                return { action: QD + '/LayDanhSach', method: 'GET', strNguonDuLieu_Id: id, strTuKhoa: '', iTrangThai: 1,
                    strNgayHieuLuc_Tu: '', strNgayHieuLuc_Den: '', strLoaiQuyetDinh_Id: '', strThanhVien_Id: P.hs(), pageIndex: 1, pageSize: 10000000 };
            },
            filled: function (v) { return !!v.strSoQuyetDinh; },
            save: function (v, rec, id) {
                return {
                    action: QD + (rec ? '/CapNhat' : '/ThemMoi'),
                    strId: rec ? rec.ID : '',
                    strNguonDuLieu_Id: id,
                    strNhanSu_HoSoCanBo_Id: P.hs(),
                    strSoQuyetDinh: v.strSoQuyetDinh,
                    strNgayApDung: v.strNgayApDung,
                    strNgayQuyetDinh: v.strNgayQuyetDinh,
                    strNguoiKyQuyetDinh: '',
                    strNgayHieuLuc: v.strNgayHieuLuc,
                    strThongTinQuyetDinh: v.strThongTinQuyetDinh,
                    strThongTinDinhKem: '',
                    strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                    strNgayHetHieuLuc: v.strNgayHetHieuLuc,
                    iTrangThai: 1,
                    iThuTu: '',
                    strNguoiThucHien_Id: P.nth()
                };
            },
            remove: function (rec) { return { action: QD + '/Xoa', strIds: rec.ID, strNguoiThucHien_Id: P.nth() }; }
        });
        luoi.load(row ? row.ID : '');
    }

    return {
        title: 'Đi nước ngoài',
        listTitle: 'Đi nước ngoài',
        formTitle: 'quá trình đi nước ngoài',
        icon: 'fa-plane-departure',
        saveAgain: 'Lưu và nhập tiếp',

        list: { call: function () { return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() }; } },
        detail: P.ns ? function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; } : undefined,

        columns: [
            { title: 'Từ ngày', prop: 'TUNAM', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNAM', cls: 'is-center is-nowrap' },
            { title: 'Đi nước', prop: 'TENNUOC' },
            { title: 'Mục đích', prop: 'MUCDICH' },
            { title: 'Tên tổ chức/cá nhân', prop: 'TENTOCHUCSANGLAMVIEC' },
            { title: 'Sản phẩm', prop: 'KETQUADATDUOC' }
        ],

        fields: [
            { key: 'strTuNam', col: 'TUNAM', label: 'Từ ngày', type: 'date', required: true },
            { key: 'strDenNam', col: 'DENNAM', label: 'Đến ngày', type: 'date' },
            { key: 'strTenNuoc', col: 'TENNUOC', label: 'Quốc gia' },
            { key: '_g', type: 'gap' },
            { key: 'strMucDich', col: 'MUCDICH', label: 'Mục đích', required: true, span: true },
            { key: 'strTenToChucSangLamViec', col: 'TENTOCHUCSANGLAMVIEC', label: 'Tên tổ chức sang làm việc', span: true },
            { key: 'strKetQuaDatDuoc', col: 'KETQUADATDUOC', label: 'Sản phẩm', span: true }
        ],
        onForm: function (row, crud, extra) { veLuoi(extra, row); },

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strTuNam: v.strTuNam,
                strDenNam: v.strDenNam,
                strTenNuoc: v.strTenNuoc,
                strMucDich: v.strMucDich,
                strThongTinDinhKem: '',
                strTenToChucSangLamViec: v.strTenToChucSangLamViec,
                strKetQuaDatDuoc: v.strKetQuaDatDuoc,
                iTrangThai: 1,
                iThuTu: '',
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strNguoiThucHien_Id: P.nth()
            };
        },
        onSaved: function (crud, result, isEdit) {
            var id = isEdit ? (crud.editing && crud.editing.ID) : (result.raw && result.raw.Id);
            if (luoi) luoi.save(id || '');
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; }); }
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).dinuocngoai = cauHinh;
    var root = document.getElementById('dinuocngoai');
    if (root) ums.crud(Object.assign({ root: root }, cauHinh({ hs: uid, nth: uid })));
})();
