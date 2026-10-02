/* =========================================================================
   Khung định mức GD_NCKH
   Bản gốc: ApisNhanSu/Modules/heso/html/khungdinhmuc.html + script/khungdinhmuc.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Chức danh · Học hàm · Loại định mức · Đơn vị · Ngày áp dụng ·
   Từ khoá → Danh sách (Loại định mức · Ngày áp dụng · Đơn vị · Loại giảng viên · Chức danh nghề nghiệp · Học hàm · Định mức chuẩn · Định mức tối đa · Đơn vị tính) → biểu mẫu Loại định mức · Ngày áp dụng · Đơn vị ·
   Loại giảng viên · Chức danh nghề nghiệp · Học hàm · Định mức chuẩn · Định mức chuẩn tối đa ·
   Đơn vị tính. Khung chung: ums.nsHeSo.man (../script/_heso.js). Gốc khungdinhmuc.js và
   khungdinhmucrieng.js chép nhau (bản "riêng" thay Loại giảng viên bằng Phạm vi áp dụng).

   Lời gọi (chép nguyên):
       KHCT_KhungDinhMuc_V2/LayDanhSach GET — strTuKhoa, strNgayApDung, strLoaiDinhMuc_Id,
           strHocHam_Id, strChucDanh_Id, strDaoTao_CoCauToChuc_Id, strLoaiGiangVien_Id ''
           (gốc đọc dropSearch_LoaiGiangVien — ô không có), strNguoiTao_Id '', pageIndex, pageSize
       KHCT_KhungDinhMuc_V2/ThemMoi | CapNhat POST — strId, strChucNang_Id, strLoaiGiangVien_Id,
           strDaoTao_CoCauToChuc_Id, strDonViTinh_Id, strNgayApDung, strHocHam_Id,
           strTrinhDoChuyenMon_Id (= ô Chức danh, như gốc), strChucDanh_Id, strLoaiDinhMuc_Id,
           strPhamViApDung_Id '' (gốc đọc dropAAAA), dKhungDinhMucChuan, dKhungDinhMucChuan_ToiDa, strNguoiThucHien_Id
       KHCT_KhungDinhMuc_V2/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
   Danh mục: KLGD.LOAIDINHMUC, NS.CDNN, NS.LOCD, KLGD.DINHMUCMIEN.DONVITINH, NS.LGV0; Đơn vị =
   edu.system.getList_CoCauToChuc (ums.ref.coCauToChuc).
   Thêm mới điền sẵn Loại định mức / Học hàm / Chức danh / Ngày áp dụng / Đơn vị từ ô lọc
   (resetPopup gốc).
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo;
    var loaiDM = N.dm('KLGD.LOAIDINHMUC'), chucDanh = N.dm('NS.CDNN'), hocHam = N.dm('NS.LOCD'),
        dvt = N.dm('KLGD.DINHMUCMIEN.DONVITINH'), rieng = N.dm('NS.LGV0'), donVi = N.donVi();

    N.man('ns-khungdinhmuc', {
        ctl: 'KHCT_KhungDinhMuc_V2',
        title: 'Khung định mức GD_NCKH',
        filters: [
            { key: 'cd', type: 'select', label: 'Chọn chức danh', source: chucDanh },
            { key: 'hh', type: 'select', label: 'Chọn học hàm', source: hocHam },
            { key: 'ldm', type: 'select', label: 'Chọn loại định mức', source: loaiDM },
            { key: 'dv', type: 'select', label: 'Chọn đơn vị', source: donVi },
            { key: 'ngay', label: 'Ngày áp dụng', date: true },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: function (f) {
            return {
                strTuKhoa: f.q, strNgayApDung: f.ngay, strLoaiDinhMuc_Id: f.ldm, strHocHam_Id: f.hh,
                strChucDanh_Id: f.cd, strDaoTao_CoCauToChuc_Id: f.dv, strLoaiGiangVien_Id: '', strNguoiTao_Id: ''
            };
        },
        columns: [
            { title: 'Loại định mức', prop: 'LOAIDINHMUC_TEN' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' },
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
            { title: 'Loại giảng viên', prop: 'LOAIGIANGVIEN_TEN' },
            { title: 'Chức danh nghề nghiệp', prop: 'CHUCDANH_TEN' },
            { title: 'Học hàm', prop: 'HOCHAM_TEN' },
            { title: 'Định mức chuẩn', prop: 'KHUNGDINHMUCCHUAN', cls: 'is-center' },
            { title: 'Định mức tối đa', prop: 'KHUNGDINHMUCCHUAN_TOIDA', cls: 'is-center' },
            { title: 'Đơn vị tính', prop: 'DONVITINH_TEN' }
        ],
        fields: [
            { key: 'strLoaiDinhMuc_Id', col: 'LOAIDINHMUC_ID', label: 'Loại định mức', type: 'select', source: loaiDM, placeholder: 'Chọn loại định mức', tuLoc: 'ldm' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date', tuLoc: 'ngay' },
            { key: 'strDaoTao_CoCauToChuc_Id', col: 'DAOTAO_COCAUTOCHUC_ID', label: 'Đơn vị', type: 'select', source: donVi, placeholder: 'Chọn đơn vị', tuLoc: 'dv' },
            { key: 'strLoaiGiangVien_Id', col: 'LOAIGIANGVIEN_ID', label: 'Loại giảng viên', type: 'select', source: rieng, placeholder: 'Chọn loại giảng viên' },
            { key: 'strChucDanh_Id', col: 'CHUCDANH_ID', label: 'Chức danh nghề nghiệp', type: 'select', source: chucDanh, placeholder: 'Chọn chức danh', tuLoc: 'cd' },
            { key: 'strHocHam_Id', col: 'HOCHAM_ID', label: 'Học hàm', type: 'select', source: hocHam, placeholder: 'Chọn học hàm', tuLoc: 'hh' },
            { key: 'dKhungDinhMucChuan', col: 'KHUNGDINHMUCCHUAN', label: 'Định mức chuẩn', type: 'number' },
            { key: 'dKhungDinhMucChuan_ToiDa', col: 'KHUNGDINHMUCCHUAN_TOIDA', label: 'Định mức chuẩn tối đa', type: 'number' },
            { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị tính', type: 'select', source: dvt, placeholder: 'Chọn đơn vị tính' }
        ],
        save: function (v) {
            return {
                strLoaiGiangVien_Id: v.strLoaiGiangVien_Id,
                strDaoTao_CoCauToChuc_Id: v.strDaoTao_CoCauToChuc_Id, strDonViTinh_Id: v.strDonViTinh_Id,
                strNgayApDung: v.strNgayApDung, strHocHam_Id: v.strHocHam_Id,
                strTrinhDoChuyenMon_Id: v.strChucDanh_Id, strChucDanh_Id: v.strChucDanh_Id,
                strLoaiDinhMuc_Id: v.strLoaiDinhMuc_Id, strPhamViApDung_Id: '',
                dKhungDinhMucChuan: v.dKhungDinhMucChuan, dKhungDinhMucChuan_ToiDa: v.dKhungDinhMucChuan_ToiDa
            };
        }
    });
})();
