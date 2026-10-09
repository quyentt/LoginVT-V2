/* =========================================================================
   Cấu trúc bảng lương năm — cây thành phần của bảng lương CẢ NĂM
   Bản gốc: ApisNhanSu/Modules/luong/script/cautrucbangluongnam.js
   Khung chung: ums.luongA.cauTruc (script/_luongA.js) — cùng họ cautrucbangluong.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên):
     L_BangQuyDinhLuong/LayDanhSach         GET  — chỉ để lấy ID khi có ĐÚNG MỘT quy định
     L_LuongNam_CauTruc/LayDanhSach         GET  strNhanSu_QuyDinhLuong_Id, strNguoiThucHien_Id "", strLoaiBangLuong_Id
     L_LuongNam_CauTruc/ThemMoi | CapNhat   POST · Xoa strIds
     L_LuongNam_TuKhoa/LayDanhSach          GET
     Danh mục thành phần: CMS_DanhMucDuLieu/ThemMoi; xoá = L_LuongNam_TuKhoa_ThamSo/Xoa (như gốc)
   LỖI GỐC, làm theo Ý ĐỊNH: html gốc đặt khối cấu trúc (ô Loại bảng lương, xem trước,
   danh sách thành phần) NGAY ở vùng đầu thay cho bảng "Chọn bảng quy định lương" và
   chép THÊM một bản trùng id ở vùng chi tiết. Không có bảng quy định nên
   strQuyDinhLuong_Id chỉ có giá trị khi máy chủ trả đúng một quy định — khi đó gốc
   chuyển sang vùng chi tiết trong khi jQuery đổ dữ liệu vào bản đầu (đang ẩn) → màn
   trống. Bản mới: hiện thẳng khối cấu trúc (không bước chọn); quy định = ID khi có
   đúng một dòng, không thì rỗng (đúng giá trị gốc gửi).
   Giữ như gốc: xoá danh mục thành phần gọi L_LuongNam_TuKhoa_ThamSo/Xoa trong khi thêm
   gọi CMS_DanhMucDuLieu/ThemMoi (nghi lệch). Biểu mẫu KHÔNG có Đơn vị tính / Thành phần
   cuối / Làm tròn / Phần nguyên (bản năm không gửi).
   ========================================================================= */
(function () {
    'use strict';
    var A = ums.luongA;

    A.cauTruc({
        root: document.getElementById('cautrucbangluongnam'),
        tieuDe: 'Cấu trúc bảng lương năm',
        khung: 'Chọn bảng quy định lương',
        khoi1: 'Bảng cấu trúc lương',
        khoi2: 'Thành phần bảng cấu trúc lương',
        formTitle: 'thành phần cấu trúc',
        loai: true,
        chon: null,
        chonRieng: { action: 'L_BangQuyDinhLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 },
        tpKey: 'strThanhPhan_Id',
        dmThanhPhan: 'NHANSU.THANHPHANLUONG',
        /* Gốc (dòng 700) gọi 'L_LuongNam_TuKhoa_ThamSo/Xoa' cho nút xoá DANH MỤC thành phần — chép nhầm từ khối tham số từ khoá: kiểm host
           2026-09-30 máy chủ báo thành công mà dòng danh mục vẫn còn. Dùng lời gọi xoá danh mục như hai màn anh em (đã thử trên host: xoá đúng). */
        dmXoa: 'CMS_DanhMucDuLieu/Xoa',
        tuKhoa: 'L_LuongNam_TuKhoa/LayDanhSach',
        list: function (ctx) {
            return { action: 'L_LuongNam_CauTruc/LayDanhSach', method: 'GET',
                strNhanSu_QuyDinhLuong_Id: ctx.id, strNguoiThucHien_Id: '', strLoaiBangLuong_Id: ctx.loai };
        },
        columns: [
            { title: 'Thành phần', prop: 'THANHPHAN_TEN' },
            { title: 'Thành phần cha', prop: 'THANHPHAN_CHA_TEN' },
            { title: 'Xâu công thức', prop: 'XAUCONGTHUCTINH' },
            { title: 'Ký hiệu', prop: 'KYHIEU', cls: 'is-center' },
            { title: 'Tính thuế', cls: 'is-center', render: function (r) {
                return String(r.THUNHAPTINHTHUE) === '1' ? 'Tính thuế' : String(r.THUNHAPTINHTHUE) === '0' ? 'Không tính thuế' : ''; } }
        ],
        fields: [
            { key: 'strThanhPhan_Id', col: 'THANHPHAN_ID', label: 'Thành phần', type: 'select', required: true, source: { items: [] }, placeholder: 'Chọn thành phần' },
            { key: 'strThanhPhan_Cha_Id', col: 'THANHPHAN_CHA_ID', label: 'Thành phần cha', type: 'select', source: { items: [] }, placeholder: 'Chọn thành phần cha' },
            { key: '_trong', type: 'gap' },
            { key: 'iThuTu', col: 'THUTU1', label: 'Thứ tự hiển thị', required: true },
            { key: 'strKyHieu', col: 'KYHIEU', label: 'Ký hiệu' },
            { key: 'dThuNhapTinhThue', col: 'THUNHAPTINHTHUE', label: 'Tính thuế', type: 'select', required: true, value: '1',
              source: { items: [{ ID: '1', TEN: 'Tính thuế' }, { ID: '0', TEN: 'Không tính thuế' }] } },
            { key: 'strXauCongThucTinh', col: 'XAUCONGTHUCTINH', label: 'Công thức', type: 'textarea', span: true }
        ],
        save: function (v, row, ctx) {
            return {
                action: row ? 'L_LuongNam_CauTruc/CapNhat' : 'L_LuongNam_CauTruc/ThemMoi',
                strId: row ? row.ID : '',
                dThuNhapTinhThue: v.dThuNhapTinhThue,
                strLoaiBangLuong_Id: ctx.loai,
                strNhanSu_BangQuyDinh_Id: ctx.id,
                strThanhPhan_Id: v.strThanhPhan_Id,
                strThanhPhan_Cha_Id: v.strThanhPhan_Cha_Id,
                iThuTu: v.iThuTu,
                strXauCongThucTinh: v.strXauCongThucTinh,
                strKyHieu: v.strKyHieu,
                strNguoiThucHien_Id: A.uid()
            };
        },
        del: function (id) { return { action: 'L_LuongNam_CauTruc/Xoa', strIds: id, strNguoiThucHien_Id: A.uid() }; }
    });
})();
