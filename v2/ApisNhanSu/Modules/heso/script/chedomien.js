/* =========================================================================
   Chế độ miễn GD_NCKH
   Bản gốc: ApisNhanSu/Modules/heso/html/chedomien.html + script/chedomien.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Chức vụ · Loại định mức · Đơn vị · Ngày áp dụng · Từ khoá →
   Danh sách (Loại định mức · Ngày áp dụng · Đơn vị · Loại giảng viên · Chức vụ · Mức miễn · Đơn vị tính) → biểu mẫu Loại định mức · Ngày áp dụng · Đơn vị ·
   Loại giảng viên · Chức vụ · Phần trăm miễn · Đơn vị tính.
   Khung chung: ums.nsHeSo.man (../script/_heso.js). Gốc chedomien.js và
   chedomienrieng.js chép nhau (bản "riêng" thay Loại giảng viên bằng Phạm vi áp dụng).

   Lời gọi (chép nguyên):
       KHCT_KhungMienGiam_V2/LayDanhSach GET — strTuKhoa, strNgayApDung, strChucVu_Id,
           strLoaiDinhMuc_Id, strDaoTao_CoCauToChuc_Id, strLoaiGiangVien_Id '' (gốc đọc
           dropSearch_LoaiGiangVien — ô không có trên màn), strNguoiTao_Id '', pageIndex, pageSize
       KHCT_KhungMienGiam_V2/ThemMoi | CapNhat POST — strId, strChucNang_Id, strNgayApDung,
           strChucVu_Id, strDonViTinh_Id, strLoaiDinhMuc_Id, strLyDo '' (gốc đọc txtAAAA),
           dKhungDinhMucMienGiam, strLoaiGiangVien_Id, strDaoTao_CoCauToChuc_Id, strNguoiThucHien_Id
       KHCT_KhungMienGiam_V2/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
   Danh mục: KLGD.LOAIDINHMUC, NS.DMCV, KLGD.DINHMUCMIEN.DONVITINH, NS.LGV0; Đơn vị =
   edu.system.getList_CoCauToChuc (ums.ref.coCauToChuc — cả khoa lẫn bộ môn, một ô).
   Thêm mới điền sẵn Loại định mức / Ngày áp dụng / Chức vụ từ ô lọc (resetPopup gốc).

   Lỗi gốc đã sửa:
     · resetPopup điền Chức vụ từ ô "dropSearch_Vu" (gõ sai, không tồn tại) nên chức vụ
       đang lọc không bao giờ được điền sẵn → nay lấy ô lọc Chức vụ.
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo;
    var loaiDM = N.dm('KLGD.LOAIDINHMUC'), chucVu = N.dm('NS.DMCV'), dvt = N.dm('KLGD.DINHMUCMIEN.DONVITINH'),
        rieng = N.dm('NS.LGV0'), donVi = N.donVi();

    N.man('ns-chedomien', {
        ctl: 'KHCT_KhungMienGiam_V2',
        title: 'Chế độ miễn GD_NCKH',
        filters: [
            { key: 'cv', type: 'select', label: 'Chọn chức vụ', source: chucVu },
            { key: 'ldm', type: 'select', label: 'Chọn loại định mức', source: loaiDM },
            { key: 'dv', type: 'select', label: 'Chọn đơn vị', source: donVi },
            { key: 'ngay', label: 'Ngày áp dụng', date: true },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: function (f) {
            return {
                strTuKhoa: f.q, strNgayApDung: f.ngay, strChucVu_Id: f.cv, strLoaiDinhMuc_Id: f.ldm,
                strDaoTao_CoCauToChuc_Id: f.dv, strLoaiGiangVien_Id: '', strNguoiTao_Id: ''
            };
        },
        columns: [
            { title: 'Loại định mức', prop: 'LOAIDINHMUC_TEN' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' },
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
            { title: 'Loại giảng viên', prop: 'LOAIGIANGVIEN_TEN' },
            { title: 'Chức vụ', prop: 'CHUCVU_TEN' },
            { title: 'Mức miễn', prop: 'KHUNGDINHMUCMIENGIAM', cls: 'is-center' },
            { title: 'Đơn vị tính', prop: 'DONVITINH_TEN' }
        ],
        fields: [
            { key: 'strLoaiDinhMuc_Id', col: 'LOAIDINHMUC_ID', label: 'Loại định mức', type: 'select', source: loaiDM, placeholder: 'Chọn loại định mức', tuLoc: 'ldm' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date', tuLoc: 'ngay' },
            { key: 'strDaoTao_CoCauToChuc_Id', col: 'DAOTAO_COCAUTOCHUC_ID', label: 'Đơn vị', type: 'select', source: donVi, placeholder: 'Chọn đơn vị' },
            { key: 'strLoaiGiangVien_Id', col: 'LOAIGIANGVIEN_ID', label: 'Loại giảng viên', type: 'select', source: rieng, placeholder: 'Chọn loại giảng viên' },
            { key: 'strChucVu_Id', col: 'CHUCVU_ID', label: 'Chức vụ', type: 'select', source: chucVu, placeholder: 'Chọn chức vụ', tuLoc: 'cv' },
            { key: 'dKhungDinhMucMienGiam', col: 'KHUNGDINHMUCMIENGIAM', label: 'Phần trăm miễn', type: 'number' },
            { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị tính', type: 'select', source: dvt, placeholder: 'Chọn đơn vị tính' }
        ],
        save: function (v) {
            return {
                strNgayApDung: v.strNgayApDung, strChucVu_Id: v.strChucVu_Id, strDonViTinh_Id: v.strDonViTinh_Id,
                strLoaiDinhMuc_Id: v.strLoaiDinhMuc_Id, strLyDo: '', dKhungDinhMucMienGiam: v.dKhungDinhMucMienGiam,
                strLoaiGiangVien_Id: v.strLoaiGiangVien_Id, strDaoTao_CoCauToChuc_Id: v.strDaoTao_CoCauToChuc_Id
            };
        }
    });
})();
