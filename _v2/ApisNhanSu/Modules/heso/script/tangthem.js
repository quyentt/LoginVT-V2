/* =========================================================================
   Hệ số tăng thêm
   Bản gốc: ApisNhanSu/Modules/heso/html/tangthem.html + script/tangthem.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Thời gian · Hoạt động · Phân loại địa điểm · Phạm vi · Mô hình học ·
   Từ khoá → Danh sách (Hoạt động · Phạm vi áp dụng · Hệ số · Mô hình học · Phân loại địa
   điểm · Thời gian áp dụng) → biểu mẫu Thời gian · Hoạt động · Phân loại · Phạm vi ·
   Đơn vị tính · Mô hình học · Hệ số. Khung chung: ums.nsHeSo.man (../script/_heso.js).
   (Gốc chép từ quydoigio.js.)

   Lời gọi (chép nguyên):
       NS_HeSo_TangThem/LayDanhSach GET — strTuKhoa, strPhanLoaiDiaDiem_Id,
           strDaoTao_ThoiGianDaoTao_Id, strHoatDong_Id, strPhamViApDung_Id, strMoHinhHoc_Id,
           strNguoiTao_Id '', pageIndex, pageSize
       NS_HeSo_TangThem/ThemMoi | CapNhat POST — strId, strChucNang_Id,
           strDaoTao_ThoiGianDaoTao_Id, strHoatDong_Id, strDonViTinh_Id, strPhamViApDung_Id,
           strPhanLoaiDiaDiem_Id, dHeSoQuyDoiTangThem, strMoHinhHoc_Id, strNguoiThucHien_Id
       NS_HeSo_TangThem/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
       KHCT_ThoiGianDaoTao/LayDanhSach GET — thời gian đào tạo
   Danh mục: KHCT.LOAICHUONGTRINH (mô hình học), KLGD.HOATDONG, KHCT.DDPG, KHDT.PHANLOAIDOITUONGDAOTAO.

   Lỗi gốc đã sửa:
     · Ô lọc Phân loại địa điểm ("dropSearch_DiaDiem") không bao giờ được nạp (gốc đổ vào
       "dropSearch_PhanLoai" — không có) → nay nạp KHCT.DDPG.
     · Cột cuối tiêu đề gốc ghi "Lý do" nhưng ô hiện Năm - Kỳ - Đợt của thời gian đào tạo
       (bản chép từ quydoigio) → tiêu đề nay là "Thời gian áp dụng".
     · resetPopup điền "dropDiaDiem" (không có) → nay điền ô Phân loại.
   Giữ như gốc (ghi sổ): Ô "Đơn vị tính" gốc không nạp danh mục → giữ ô, khoá; khi SỬA gửi
   lại DONVITINH_ID của dòng.
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo;
    var thoiGian = N.thoiGian(), hoatDong = N.dm('KLGD.HOATDONG'), diaDiem = N.dm('KHCT.DDPG'),
        phamVi = N.dm('KHDT.PHANLOAIDOITUONGDAOTAO'), moHinh = N.dm('KHCT.LOAICHUONGTRINH');

    N.man('ns-tangthem', {
        ctl: 'NS_HeSo_TangThem',
        title: 'Hệ số tăng thêm',
        filters: [
            { key: 'tg', type: 'select', label: 'Chọn thời gian', source: thoiGian },
            { key: 'hd', type: 'select', label: 'Chọn hoạt động', source: hoatDong },
            { key: 'dd', type: 'select', label: 'Chọn phân loại địa điểm', source: diaDiem },
            { key: 'pv', type: 'select', label: 'Chọn phạm vi', source: phamVi },
            { key: 'mh', type: 'select', label: 'Chọn mô hình học', source: moHinh },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: function (f) {
            return {
                strTuKhoa: f.q, strPhanLoaiDiaDiem_Id: f.dd, strDaoTao_ThoiGianDaoTao_Id: f.tg,
                strHoatDong_Id: f.hd, strPhamViApDung_Id: f.pv, strMoHinhHoc_Id: f.mh, strNguoiTao_Id: ''
            };
        },
        columns: [
            { title: 'Hoạt động', prop: 'HOATDONG_TEN' },
            { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' },
            { title: 'Hệ số', prop: 'HESOQUYDOITANGTHEM', cls: 'is-center' },
            { title: 'Mô hình học', prop: 'MOHINHHOC_TEN' },
            { title: 'Phân loại địa điểm', prop: 'PHANLOAIDIADIEM_TEN' },
            { title: 'Thời gian áp dụng', cls: 'is-nowrap', render: function (r) { return ums.ui.esc(N.thoiGianCot(r)); } }
        ],
        fields: [
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian', type: 'select', source: thoiGian, placeholder: 'Chọn thời gian', tuLoc: 'tg' },
            { key: 'strHoatDong_Id', col: 'HOATDONG_ID', label: 'Hoạt động', type: 'select', source: hoatDong, placeholder: 'Chọn hoạt động', tuLoc: 'hd' },
            { key: 'strPhanLoaiDiaDiem_Id', col: 'PHANLOAIDIADIEM_ID', label: 'Phân loại', type: 'select', source: diaDiem, placeholder: 'Chọn phân loại địa điểm', tuLoc: 'dd' },
            { key: 'strPhamViApDung_Id', col: 'PHAMVIAPDUNG_ID', label: 'Phạm vi', type: 'select', source: phamVi, placeholder: 'Chọn phạm vi', tuLoc: 'pv' },
            { key: '_donViTinh', label: 'Đơn vị tính', type: 'select', placeholder: 'Chưa có danh mục', hint: 'Bản gốc chưa nạp danh mục cho ô này' },
            { key: 'strMoHinhHoc_Id', col: 'MOHINHHOC_ID', label: 'Mô hình học', type: 'select', source: moHinh, placeholder: 'Chọn mô hình học', tuLoc: 'mh' },
            { key: 'dHeSoQuyDoiTangThem', col: 'HESOQUYDOITANGTHEM', label: 'Hệ số', type: 'number' }
        ],
        onForm: function (row, c) { N.o(c, 'form', '_donViTinh').disabled = true; },
        save: function (v, row) {
            return {
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id, strHoatDong_Id: v.strHoatDong_Id,
                strDonViTinh_Id: row ? (row.DONVITINH_ID || '') : '', strPhamViApDung_Id: v.strPhamViApDung_Id,
                strPhanLoaiDiaDiem_Id: v.strPhanLoaiDiaDiem_Id, dHeSoQuyDoiTangThem: v.dHeSoQuyDoiTangThem,
                strMoHinhHoc_Id: v.strMoHinhHoc_Id
            };
        }
    });
})();
