/* =========================================================================
   Cấu trúc bảng lương — cây thành phần của bảng lương theo quy định lương
   Bản gốc: ApisNhanSu/Modules/luong/script/cautrucbangluong.js
   Khung chung: ums.luongA.cauTruc (script/_luongA.js) — dùng chung với
   cautrucbangluongnam, dieukienxetnangluong (ba tệp gốc chép nhau).
   ---------------------------------------------------------------------------
   Ba bước như gốc: (1) "Chọn bảng quy định lương" — bảng + nút Chọn, một dòng
   thì tự chọn; (2) "Khởi tạo cấu trúc bảng lương" — ô Loại bảng lương, xem trước
   tiêu đề theo cây, danh sách thành phần; (3) biểu mẫu thành phần + "Danh mục
   thành phần công thức" + "Từ khóa cho công thức".
   Lời gọi (kiểu cũ, chép nguyên):
     L_BangQuyDinhLuong/LayDanhSach        GET  strTuKhoa "", strNguoiTao_Id "", 1/100000
     L_CauTrucBangLuong/LayDanhSach        GET  strNhanSu_QuyDinhLuong_Id, strNguoiThucHien_Id "", strLoaiBangLuong_Id
     L_CauTrucBangLuong/ThemMoi | CapNhat  POST (tham số dưới) · Xoa strIds
     L_CauTrucBangLuong_TuKhoa/LayDanhSach GET
     Danh mục NHANSU.THANHPHANLUONG: CMS_DanhMucDuLieu/ThemMoi (sửa cũng ThemMoi kèm strId — như gốc),
       CMS_DanhMucDuLieu/Xoa (strId)
   Khác gốc: ô "Thành phần" / "Thứ tự hiển thị" mang (*) nay bắt buộc thật (gốc không kiểm);
   xoá thành phần báo "Đã xoá" chung (gốc hiện Message máy chủ nếu có).
   ========================================================================= */
(function () {
    'use strict';
    var A = ums.luongA;

    A.cauTruc({
        root: document.getElementById('cautrucbangluong'),
        tieuDe: 'Cấu trúc bảng lương',
        khung: 'Khởi tạo cấu trúc bảng lương',
        khoi1: 'Bảng cấu trúc lương',
        khoi2: 'Thành phần bảng cấu trúc lương',
        formTitle: 'thành phần cấu trúc',
        loai: true,
        chon: {
            title: 'Chọn bảng quy định lương',
            call: { action: 'L_BangQuyDinhLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 },
            columns: [
                { title: 'Lương cơ bản', prop: 'MUCLUONGCOBAN', cls: 'is-right' },
                { title: 'Bậc tối đa', prop: 'SOBACLUONGTOIDA', cls: 'is-center' },
                { title: 'Tối thiểu vùng', prop: 'LUONGTOITHIEUVUNG', cls: 'is-right' },
                { title: 'Ngày bắt đầu', prop: 'NGAYBATDAUAPDUNG', cls: 'is-center' },
                { title: 'Ngày kết thúc', prop: 'NGAYKETTHUCAPDUNG', cls: 'is-center' }
            ]
        },
        tpKey: 'strThanhPhan_Id',
        dmThanhPhan: 'NHANSU.THANHPHANLUONG',
        dmXoa: 'CMS_DanhMucDuLieu/Xoa',
        tuKhoa: 'L_CauTrucBangLuong_TuKhoa/LayDanhSach',
        list: function (ctx) {
            return { action: 'L_CauTrucBangLuong/LayDanhSach', method: 'GET',
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
            { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị tính', type: 'select', source: { dm: 'NHANSU.LUONG.DONVITINH' } },
            { key: 'iThuTu', col: 'THUTU1', label: 'Thứ tự hiển thị', required: true },
            { key: 'strKyHieu', col: 'KYHIEU', label: 'Ký hiệu' },
            { key: 'dThuNhapTinhThue', col: 'THUNHAPTINHTHUE', label: 'Tính thuế', type: 'select', required: true, value: '1',
              source: { items: [{ ID: '1', TEN: 'Tính thuế' }, { ID: '0', TEN: 'Không tính thuế' }] } },
            { key: 'dLaThanhPhanCuoi', col: 'LATHANHPHANCUOI', label: 'Thành phần cuối', type: 'select', required: true, value: '0',
              source: { items: [{ ID: '0', TEN: 'Không phải' }, { ID: '1', TEN: 'Phải' }] } },
            { key: 'dSoChuSoLamTron', col: 'SOCHUSOLAMTRON', label: 'Làm tròn', type: 'select', required: true, value: '-1',
              source: { items: [{ ID: '-1', TEN: 'Không làm tròn' }, { ID: '0', TEN: '0 chữ số sau dấu .' }, { ID: '1', TEN: '1 chữ số sau dấu .' }, { ID: '2', TEN: '2 chữ số sau dấu .' }] } },
            { key: 'dChiLayPhanSoNguyen', col: 'CHILAYPHANSONGUYEN', label: 'Phần nguyên', type: 'select', required: true, value: '0',
              source: { items: [{ ID: '0', TEN: 'Lấy tất cả' }, { ID: '1', TEN: 'Chỉ lấy phần nguyên' }] } },
            { key: 'strXauCongThucTinh', col: 'XAUCONGTHUCTINH', label: 'Công thức', type: 'textarea', span: true }
        ],
        save: function (v, row, ctx) {
            return {
                action: row ? 'L_CauTrucBangLuong/CapNhat' : 'L_CauTrucBangLuong/ThemMoi',
                strId: row ? row.ID : '',
                strNhanSu_BangQuyDinh_Id: ctx.id,
                strThanhPhan_Id: v.strThanhPhan_Id,
                strThanhPhan_Cha_Id: v.strThanhPhan_Cha_Id,
                iThuTu: v.iThuTu,
                strXauCongThucTinh: v.strXauCongThucTinh,
                strKyHieu: v.strKyHieu,
                strNguoiThucHien_Id: A.uid(),
                strLoaiBangLuong_Id: ctx.loai,
                dThuNhapTinhThue: v.dThuNhapTinhThue,
                dSoChuSoLamTron: v.dSoChuSoLamTron,
                dChiLayPhanSoNguyen: v.dChiLayPhanSoNguyen,
                strDonViTinh_Id: v.strDonViTinh_Id,
                dLaThanhPhanCuoi: v.dLaThanhPhanCuoi
            };
        },
        del: function (id) { return { action: 'L_CauTrucBangLuong/Xoa', strIds: id, strNguoiThucHien_Id: A.uid() }; }
    });
})();
