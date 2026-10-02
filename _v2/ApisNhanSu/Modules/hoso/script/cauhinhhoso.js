/* =========================================================================
   Cấu hình hồ sơ — mẫu hồ sơ và các trường thông tin mở rộng của từng mẫu
   Bản gốc: ApisNhanSu/Modules/hoso/script/cauhinhhoso.js + html/cauhinhhoso.html
   ---------------------------------------------------------------------------
   Khung chung ums.nsCauHinh (_cauhinh.js — đọc chú thích ở đó). Lời gọi (kiểu cũ):
       NS_MauHoSo/LayDanhSach   GET  strTuKhoa, strNguoiThucHien_Id, pageIndex, pageSize
       NS_MauHoSo/ThemMoi | CapNhat   strId, strChucNang_Id, strTen, strMa, strMoTa '',
                                      dHieuLuc, strNgayApDung, strNguoiThucHien_Id
       NS_MauHoSo/Xoa           strIds, strChucNang_Id (xoá đã chọn — từng dòng một lời gọi)
       NS_HoSoMoRong/LayDanhSach GET strNhanSu_MauHoSo_Id, strTruongThongTin_Id '', pageSize 200000
       NS_HoSoMoRong/ThemMoi | CapNhat  strId, strMoTa, strNhanSu_MauHoSo_Id, strTruongThongTin_Id,
                                      iThuTu, dDoRong, dBatBuoc, strChucNang_Id
   Danh mục trường thông tin: NHANSU.HOSO.TRUONGTHONGTIN.

   Lỗi gốc (không chép): xoá một trường thông tin đã lưu gọi NCKH_ThongTin/Xoa (chép
   từ màn NCKH — xoá nhầm bảng thông tin đề tài). Ở đây gọi NS_HoSoMoRong/Xoa, đúng
   controller của chính bảng này.
   ========================================================================= */
(function () {
    'use strict';

    var HIEULUC = { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] };

    ums.nsCauHinh.man(document.getElementById('nscauhinhhoso'), {
        tieuDe: 'Cấu hình hồ sơ',
        formTitle: 'cấu hình hồ sơ',
        ctl: 'NS_MauHoSo', ctlTT: 'NS_HoSoMoRong', xoaTT: 'NS_HoSoMoRong/Xoa',
        thamSoCha: 'strNhanSu_MauHoSo_Id', dmTT: 'NHANSU.HOSO.TRUONGTHONGTIN',
        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'TEN' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return r.HIEULUC && String(r.HIEULUC) !== '0' ? 'Hiệu lực' : ''; } }
        ],
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã', span: true },
            { key: 'strTen', col: 'TEN', label: 'Tên', span: true },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date', span: true },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', source: HIEULUC, value: '1', required: true, span: true }
        ]
    });
})();
