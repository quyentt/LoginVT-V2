/* =========================================================================
   Cấu hình hợp đồng — cấu hình theo HOẠT ĐỘNG nhân sự và các trường thông tin mở rộng
   Bản gốc: ApisNhanSu/Modules/hoso/script/cauhinhhopdong.js + html/cauhinhhopdong.html
   ---------------------------------------------------------------------------
   Khung chung ums.nsCauHinh (_cauhinh.js — đọc chú thích ở đó). Lời gọi (kiểu cũ):
       NS_DanhMucHoatDong/LayDanhSach   GET  strTuKhoa, strNguoiThucHien_Id, pageIndex, pageSize
       NS_DanhMucHoatDong/ThemMoi | CapNhat  strId, strChucNang_Id, strTen '', strMa '', strMoTa '',
                                      dHieuLuc, strNgayApDung, strNguoiThucHien_Id,
                                      strPhamViApDung_Id, strHoatDongNhanSu_Id
       NS_DanhMucHoatDong/Xoa           strIds, strChucNang_Id
       NS_HoatDong_MoRong/LayDanhSach   GET  strHoatDongNhanSu_Id (= id dòng cấu hình), pageSize 200000
       NS_HoatDong_MoRong/ThemMoi | CapNhat | Xoa
   Danh mục: NHANSU.HOATDONG (Hoạt động), NHANSU.PHAMVI.HOATDONG (Phạm vi),
   NHANSU.TRUONGTHONGTIN (trường thông tin).

   Giữ như gốc: biểu mẫu KHÔNG có ô Mã / Tên (gốc gửi txtMa / txtTen không có trên
   màn → rỗng) — cột Mã / Tên của bảng đọc HOATDONGNHANSU_MA / _TEN do máy chủ trả.
   ========================================================================= */
(function () {
    'use strict';

    var HIEULUC = { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] };

    ums.nsCauHinh.man(document.getElementById('nscauhinhhopdong'), {
        tieuDe: 'Cấu hình hợp đồng',
        formTitle: 'cấu hình hợp đồng',
        ctl: 'NS_DanhMucHoatDong', ctlTT: 'NS_HoatDong_MoRong', xoaTT: 'NS_HoatDong_MoRong/Xoa',
        thamSoCha: 'strHoatDongNhanSu_Id', dmTT: 'NHANSU.TRUONGTHONGTIN',
        columns: [
            { title: 'Mã', prop: 'HOATDONGNHANSU_MA', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'HOATDONGNHANSU_TEN' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return r.HIEULUC && String(r.HIEULUC) !== '0' ? 'Hiệu lực' : ''; } },
            { title: 'Phạm vi', prop: 'PHAMVIAPDUNG_TEN' }
        ],
        fields: [
            { key: 'strHoatDongNhanSu_Id', col: 'HOATDONGNHANSU_ID', label: 'Hoạt động', type: 'select', source: { dm: 'NHANSU.HOATDONG' }, span: true },
            { key: 'strPhamViApDung_Id', col: 'PHAMVIAPDUNG_ID', label: 'Phạm vi', type: 'select', source: { dm: 'NHANSU.PHAMVI.HOATDONG' }, span: true },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date', span: true },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', source: HIEULUC, value: '1', required: true, span: true }
        ],
        them: function (v) { return { strPhamViApDung_Id: v.strPhamViApDung_Id, strHoatDongNhanSu_Id: v.strHoatDongNhanSu_Id }; }
    });
})();
