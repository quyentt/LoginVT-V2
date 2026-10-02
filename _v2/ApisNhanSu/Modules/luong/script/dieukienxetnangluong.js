/* =========================================================================
   Điều kiện xét nâng lương — cây thành phần điều kiện của một kế hoạch xét nâng lương
   Bản gốc: ApisNhanSu/Modules/luong/script/dieukienxetnangluong.js
   Khung chung: ums.luongA.cauTruc (script/_luongA.js) — cùng họ cautrucbangluong.
   ---------------------------------------------------------------------------
   Ba bước như gốc: (1) "Chọn kế hoạch xét nâng lương"; (2) "Thiết lập điều kiện xét
   nâng lương" (xem trước tiêu đề + danh sách thành phần); (3) biểu mẫu + danh mục
   thành phần công thức + từ khoá.
   Lời gọi (kiểu cũ, chép nguyên):
     L_KeHoachXetLuong/LayDanhSach   GET  strTuKhoa "", strLoaiXetLuong_Id "", strNguoiTao_Id "", 1/100000
     L_XetLuong_CauTruc/LayDanhSach  GET  strNhanSu_KeHoachXetLuong_Id, strNguoiThucHien_Id ""
     L_XetLuong_CauTruc/ThemMoi | CapNhat  POST (strNhanSu_BangQuyDinh_Id "" như gốc) · Xoa strIds
     L_XetLuong_TuKhoa/LayDanhSach   GET
     Danh mục NHANSU.THANHPHANLUONG: CMS_DanhMucDuLieu/ThemMoi, CMS_DanhMucDuLieu/Xoa
   LỖI GỐC, làm theo Ý ĐỊNH:
     · Ô công thức trong html mang id txtBL_CongThuc nhưng mã đọc/ghi txtNL_CongThuc →
       gốc luôn gửi strXauCongThucTinh rỗng và sửa không hiện công thức. Bản mới đọc/ghi đúng ô.
     · genTable_KeHoachXetNangLuong đặt `me = DieuKienXetNangLuong` (hàm tạo, không phải đối
       tượng) → khi chỉ có MỘT kế hoạch gốc gọi me.toggle_detail không tồn tại (lỗi JS). Bản
       mới tự chọn như hai màn anh em.
     · Cột "Ghi chú" gốc đọc GHICHUGHICHU (gõ nhầm) → đọc GHICHU (cột kehoachxetnangluong đổ
       vào biểu mẫu), vẫn dự phòng GHICHUGHICHU.
   Bỏ: ô Loại bảng lương (html gốc chú thích; lời gọi danh sách không gửi) và nạp danh mục
   LUONG.LOAIXETNANGLUONG vào ô không tồn tại.
   ========================================================================= */
(function () {
    'use strict';
    var A = ums.luongA, ui = ums.ui;

    A.cauTruc({
        root: document.getElementById('dieukienxetnangluong'),
        tieuDe: 'Điều kiện xét nâng lương',
        khung: 'Thiết lập điều kiện xét nâng lương',
        khoi1: 'Bảng kế hoạch xét nâng lương',
        khoi2: 'Thành phần kế hoạch xét nâng lương',
        formTitle: 'thành phần kế hoạch xét nâng lương',
        loai: false,
        chon: {
            title: 'Chọn kế hoạch xét nâng lương',
            call: { action: 'L_KeHoachXetLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strLoaiXetLuong_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 },
            columns: [
                { title: 'Loại xét lương', prop: 'LOAIXETLUONG_TEN' },
                { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center' },
                { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center' },
                { title: 'Ghi chú', render: function (r) { return ui.esc(A.e(r.GHICHU !== undefined ? r.GHICHU : r.GHICHUGHICHU)); } }
            ]
        },
        tpKey: 'strThanhPhan_Id',
        dmThanhPhan: 'NHANSU.THANHPHANLUONG',
        dmXoa: 'CMS_DanhMucDuLieu/Xoa',
        tuKhoa: 'L_XetLuong_TuKhoa/LayDanhSach',
        list: function (ctx) {
            return { action: 'L_XetLuong_CauTruc/LayDanhSach', method: 'GET', strNhanSu_KeHoachXetLuong_Id: ctx.id, strNguoiThucHien_Id: '' };
        },
        columns: [
            { title: 'Thành phần', prop: 'THANHPHAN_TEN' },
            { title: 'Thành phần cha', prop: 'THANHPHAN_CHA_TEN' },
            { title: 'Xâu công thức', prop: 'XAUCONGTHUCTINH' },
            { title: 'Ký hiệu', prop: 'KYHIEU', cls: 'is-center' }
        ],
        fields: [
            { key: 'strThanhPhan_Id', col: 'THANHPHAN_ID', label: 'Thành phần', type: 'select', required: true, source: { items: [] }, placeholder: 'Chọn thành phần' },
            { key: 'strThanhPhan_Cha_Id', col: 'THANHPHAN_CHA_ID', label: 'Thành phần cha', type: 'select', source: { items: [] }, placeholder: 'Chọn thành phần cha' },
            { key: '_trong', type: 'gap' },
            { key: 'iThuTu', col: 'THUTU1', label: 'Thứ tự hiển thị', required: true },
            { key: 'strKyHieu', col: 'KYHIEU', label: 'Ký hiệu' },
            { key: '_trong2', type: 'gap' },
            { key: 'strXauCongThucTinh', col: 'XAUCONGTHUCTINH', label: 'Công thức', type: 'textarea', span: true }
        ],
        save: function (v, row, ctx) {
            return {
                action: row ? 'L_XetLuong_CauTruc/CapNhat' : 'L_XetLuong_CauTruc/ThemMoi',
                strId: row ? row.ID : '',
                strNhanSu_KeHoachXetLuong_Id: ctx.id,
                strNhanSu_BangQuyDinh_Id: '',
                strThanhPhan_Id: v.strThanhPhan_Id,
                strThanhPhan_Cha_Id: v.strThanhPhan_Cha_Id,
                iThuTu: v.iThuTu,
                strXauCongThucTinh: v.strXauCongThucTinh,
                strKyHieu: v.strKyHieu,
                strNguoiThucHien_Id: A.uid()
            };
        },
        del: function (id) { return { action: 'L_XetLuong_CauTruc/Xoa', strIds: id, strNguoiThucHien_Id: A.uid() }; }
    });
})();
