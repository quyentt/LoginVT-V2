/* =========================================================================
   Hệ số quy đổi giờ
   Bản gốc: ApisNhanSu/Modules/heso/html/quydoigio.html + script/quydoigio.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Thời gian · Hoạt động · Phân loại địa điểm · Phạm vi · Từ khoá →
   Danh sách (Hoạt động · Phạm vi áp dụng · Số lượng [Từ | Đến] · Hệ số · Phân loại
   địa điểm · Lý do · Thời gian áp dụng — tiêu đề hai tầng như gốc) → biểu mẫu Thời gian ·
   Hoạt động · Phân loại · Phạm vi · Đơn vị tính · Hệ số · Số lượng từ · Số lượng đến · Lý do.
   Khung chung: ums.nsHeSo.man (../script/_heso.js).

   Lời gọi (chép nguyên):
       NS_HeSo_QuyDoiGioChuan/LayDanhSach GET — strTuKhoa, strPhanLoaiDiaDiem_Id,
           strDaoTao_ThoiGianDaoTao_Id, strHoatDong_Id, strPhamViApDung_Id,
           strNguoiTao_Id '', pageIndex, pageSize
       NS_HeSo_QuyDoiGioChuan/ThemMoi | CapNhat POST — strId, strChucNang_Id,
           strDaoTao_ThoiGianDaoTao_Id, strHoatDong_Id, strDonViTinh_Id, strPhamViApDung_Id,
           strPhanLoaiDiaDiem_Id, dHeSoQuyDoiGioChuan, dSoLuongCanTren (ô "đến"),
           dSoLuongCanDuoi (ô "từ"), strLyDo, strNguoiThucHien_Id
       NS_HeSo_QuyDoiGioChuan/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
       KHCT_ThoiGianDaoTao/LayDanhSach GET — thời gian đào tạo (DAOTAO_THOIGIANDAOTAO)
   Danh mục: KLGD.HOATDONG, KHCT.DDPG (phân loại địa điểm), KHDT.PHANLOAIDOITUONGDAOTAO (phạm vi).
   Thêm mới điền sẵn Thời gian / Hoạt động / Phạm vi / Phân loại từ ô lọc (resetPopup gốc).

   Lỗi gốc đã sửa:
     · Danh mục KHCT.DDPG đổ vào "dropSearch_PhanLoai" (không có) trong khi ô lọc trên màn
       là "dropSearch_DiaDiem" → ô lọc Phân loại địa điểm luôn trống. Nay nạp đúng ô.
     · resetPopup điền "dropDiaDiem" (không có) → nay điền ô Phân loại của biểu mẫu.
   Giữ như gốc (ghi sổ):
     · Ô "Đơn vị tính" gốc không nạp danh mục (ô trống mãi) → giữ ô, khoá; khi SỬA gửi lại
       DONVITINH_ID của dòng (gốc gửi rỗng, xoá mất giá trị cũ).
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo;
    var thoiGian = N.thoiGian(), hoatDong = N.dm('KLGD.HOATDONG'), diaDiem = N.dm('KHCT.DDPG'),
        phamVi = N.dm('KHDT.PHANLOAIDOITUONGDAOTAO');

    N.man('ns-quydoigio', {
        ctl: 'NS_HeSo_QuyDoiGioChuan',
        title: 'Hệ số quy đổi giờ',
        filters: [
            { key: 'tg', type: 'select', label: 'Chọn thời gian', source: thoiGian },
            { key: 'hd', type: 'select', label: 'Chọn hoạt động', source: hoatDong },
            { key: 'dd', type: 'select', label: 'Chọn phân loại địa điểm', source: diaDiem },
            { key: 'pv', type: 'select', label: 'Chọn phạm vi', source: phamVi },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: function (f) {
            return {
                strTuKhoa: f.q, strPhanLoaiDiaDiem_Id: f.dd, strDaoTao_ThoiGianDaoTao_Id: f.tg,
                strHoatDong_Id: f.hd, strPhamViApDung_Id: f.pv, strNguoiTao_Id: ''
            };
        },
        columns: [
            { title: 'Hoạt động', prop: 'HOATDONG_TEN' },
            { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' },
            { title: 'Từ', prop: 'SOLUONGCANDUOI', cls: 'is-center', group: ['Số lượng'] },
            { title: 'Đến', prop: 'SOLUONGCANTREN', cls: 'is-center', group: ['Số lượng'] },
            { title: 'Hệ số', prop: 'HESOQUYDOIGIOCHUAN', cls: 'is-center' },
            { title: 'Phân loại địa điểm', prop: 'PHANLOAIDIADIEM_TEN' },
            { title: 'Lý do', prop: 'LYDO' },
            { title: 'Thời gian áp dụng', cls: 'is-nowrap', render: function (r) { return ums.ui.esc(N.thoiGianCot(r)); } }
        ],
        fields: [
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian', type: 'select', source: thoiGian, placeholder: 'Chọn thời gian', tuLoc: 'tg' },
            { key: 'strHoatDong_Id', col: 'HOATDONG_ID', label: 'Hoạt động', type: 'select', source: hoatDong, placeholder: 'Chọn hoạt động', tuLoc: 'hd' },
            { key: 'strPhanLoaiDiaDiem_Id', col: 'PHANLOAIDIADIEM_ID', label: 'Phân loại', type: 'select', source: diaDiem, placeholder: 'Chọn phân loại địa điểm', tuLoc: 'dd' },
            { key: 'strPhamViApDung_Id', col: 'PHAMVIAPDUNG_ID', label: 'Phạm vi', type: 'select', source: phamVi, placeholder: 'Chọn phạm vi', tuLoc: 'pv' },
            { key: '_donViTinh', label: 'Đơn vị tính', type: 'select', placeholder: 'Chưa có danh mục', hint: 'Bản gốc chưa nạp danh mục cho ô này' },
            { key: 'dHeSoQuyDoiGioChuan', col: 'HESOQUYDOIGIOCHUAN', label: 'Hệ số', type: 'number' },
            { key: 'dSoLuongCanDuoi', col: 'SOLUONGCANDUOI', label: 'Số lượng từ', type: 'number' },
            { key: 'dSoLuongCanTren', col: 'SOLUONGCANTREN', label: 'Số lượng đến', type: 'number' },
            { key: 'strLyDo', col: 'LYDO', label: 'Lý do', span: true }
        ],
        onForm: function (row, c) { N.o(c, 'form', '_donViTinh').disabled = true; },
        save: function (v, row) {
            return {
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id, strHoatDong_Id: v.strHoatDong_Id,
                strDonViTinh_Id: row ? (row.DONVITINH_ID || '') : '', strPhamViApDung_Id: v.strPhamViApDung_Id,
                strPhanLoaiDiaDiem_Id: v.strPhanLoaiDiaDiem_Id, dHeSoQuyDoiGioChuan: v.dHeSoQuyDoiGioChuan,
                dSoLuongCanTren: v.dSoLuongCanTren, dSoLuongCanDuoi: v.dSoLuongCanDuoi, strLyDo: v.strLyDo
            };
        }
    });
})();
