/* =========================================================================
   Quá trình công tác trước tuyển dụng — hồ sơ cá nhân
   Bản gốc: ApisCongCanBo/Modules/quatrinhcongtac/script/quatrinhcongtac.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QT_TieuSuBanThan_TruocTD/LayDanhSach  GET  strNhanSu_HoSoCanBo_Id
       NS_QT_TieuSuBanThan_TruocTD/LayChiTiet   GET  strId
       NS_QT_TieuSuBanThan_TruocTD/ThemMoi | CapNhat, Xoa (strIds)
   Thêm xong: ThietLapQuaTrinhCuoiCung "NHANSU_QT_TSTT". Tệp: NS_Files.
   Danh mục: NS.CDNN (chức danh), NS.LGV0 (loại giảng viên), NS.DMCV (chức
   vụ), cơ cấu tổ chức (đơn vị trong trường).
   "Đơn vị công tác ngoài trường" là ô chữ, gửi vào strMoTa (cột MOTA).

   Khác bản gốc:
     · Loại giảng viên: bản gốc KHÔNG đổ lại ô này khi sửa, nên lưu một dòng
       đã có loại giảng viên là xoá mất giá trị. Ở đây đổ lại từ
       LOAIGIANGVIEN_ID (cột có TEN đi kèm trong danh sách).
   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/quatrinhcongtac/quatrinhcongtac (cán bộ nhân sự chọn
   một người): ums.ccbHS.quatrinhcongtac(P) trả cấu hình ums.crud. P = { hs() → id hồ sơ
   cán bộ, nth() → id người thực hiện, ns: true ở bản Nhân sự }; mặc định
   (Cổng cán bộ) cả hai là người đăng nhập.
   Bản Nhân sự (P.ns) theo html gốc của nó: nhãn "Ngày bắt đầu" / "Ngày kết
   thúc" (ô txtTSBT_NgayBatDau / _NgayKetThuc), KHÔNG có ô tệp đính kèm.
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'NS_QT_TieuSuBanThan_TruocTD';
    var CCTC = { call: {
        action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
        dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: ''
    }, name: 'TEN' };

    function cauHinh(P) {
    return {
        title: 'Quá trình công tác trước tuyển dụng',
        listTitle: 'Tóm tắt quá trình công tác trước tuyển dụng',
        formTitle: 'quá trình công tác trước tuyển dụng',
        icon: 'fa-briefcase',
        saveAgain: 'Lưu và nhập tiếp',

        list: { call: function () { return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() }; } },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        columns: [
            { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đơn vị công tác trong trường', prop: 'DONVICONGTAC_TEN' },
            { title: 'Đơn vị công tác ngoài trường', prop: 'MOTA' },
            { title: 'Loại giảng viên', prop: 'LOAIGIANGVIEN_TEN' },
            { title: 'Chức danh', prop: 'CHUCDANHNGHENGHIEP_TEN' },
            { title: 'Chức vụ', prop: 'CHUCVU_TEN' }
        ],

        fields: [
            { key: 'strTuNgay', col: 'TUNGAY', label: P.ns ? 'Ngày bắt đầu' : 'Từ ngày', type: 'date', required: true, span: true },
            { key: 'strDenNgay', col: 'DENNGAY', label: P.ns ? 'Ngày kết thúc' : 'Đến ngày', type: 'date', span: true },
            { key: 'strChucDanhNgheNghiep_Id', col: 'LOAICHUCDANHNGHENGHIEP_ID', label: 'Chức danh', type: 'select', source: { dm: 'NS.CDNN' } },
            { key: 'strLoaiGiangVien_Id', col: 'LOAIGIANGVIEN_ID', label: 'Loại giảng viên', type: 'select', source: { dm: 'NS.LGV0' } },
            { key: 'strChucVu_Id', col: 'CHUCVU_ID', label: 'Chức vụ', type: 'select', source: { dm: 'NS.DMCV' }, span: true },
            { key: 'strDonViCongTac_Id', col: 'DONVICONGTAC_ID', label: 'Đơn vị công tác trong trường', type: 'select', source: CCTC, span: true },
            { key: 'strMoTa', col: 'MOTA', label: 'Đơn vị công tác ngoài trường', type: 'textarea', span: true },
            { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' }
        ].filter(function (f) { return !(P.ns && f.key === '_tep'); }),

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strMoTa: v.strMoTa,
                strTuNgay: v.strTuNgay,
                strDenNgay: v.strDenNgay,
                strDonViCongTac_Id: v.strDonViCongTac_Id,
                strChucDanhNgheNghiep_Id: v.strChucDanhNgheNghiep_Id,
                strChucVu_Id: v.strChucVu_Id,
                strLoaiGiangVien_Id: v.strLoaiGiangVien_Id,
                iTrangThai: 1,
                iThuTu: 1,
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strNguoiThucHien_Id: P.nth()
            };
        },
        onSaved: function (crud, result, isEdit) { if (!isEdit) ums.ref.quaTrinhCuoiCung('NHANSU_QT_TSTT'); },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; }); }
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).quatrinhcongtac = cauHinh;
    var root = document.getElementById('quatrinhcongtac');
    if (root) ums.crud(Object.assign({ root: root }, cauHinh({ hs: uid, nth: uid })));
})();
