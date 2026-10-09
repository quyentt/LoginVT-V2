/* =========================================================================
   Khai báo tiêu chí xếp loại rèn luyện (tiêu chuẩn xếp loại chung)
   Bản gốc: ApisRenLuyen/Modules/tieuchixeploai/script/tieuchixeploai.js (lớp TieuChiXepLoai)
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên từ bản gốc, kiểu cũ — không func, không iM):
     RL_TieuChuanXepLoai/LayDanhSach (GET)  strTuKhoa, strXepLoai_Id, strDoiTuongApDung_Id,
                                             strDRL_TieuChiDanhGia_Id, strNguoiTao_Id, pageIndex, pageSize
     RL_TieuChuanXepLoai/ThemMoi | CapNhat  strId, strMucKyLuatCaoNhat_Id, dDiemCanTren, dDiemCanDuoi,
                                             strXepLoai_Id, strDoiTuongApDung_Id, dDiemQuyDoi,
                                             strDRL_TieuChiDanhGia_Id, strGhiChu
     RL_TieuChuanXepLoai/Xoa                strIds (MỘT lời gọi cho mỗi dòng đã chọn, như gốc)
     RL_TieuChiDanhGia/LayDanhSach (GET)    nguồn ô "Tiêu chí" (lọc + biểu mẫu), pageIndex 1, pageSize 10000
     Danh mục: DRL.DOITUONGAPDUNG, QLSV.HINHTHUCKYLUAT, DRL.XEPLOAI.
   strChucNang_Id / strNguoiThucHien_Id do ums.api tự chèn như bản gốc.

   Bố cục giữ như gốc: một cột — khung "Tìm kiếm" (Đối tượng, Tiêu chí, từ khoá)
   rồi khung "Danh sách" (số dòng, Thêm mới, Xóa đã chọn, bảng phân trang máy chủ).
   Hộp thoại "Tiêu chuẩn xếp loại chung" → biểu mẫu thay chỗ danh sách (ums.crud).

   Ghi chú / khác bản gốc:
     · Nguồn "Tiêu chí" gốc gửi strDRL_TieuChiDanhGia_Cha_id = giá trị ô lọc
       ĐỐI TƯỢNG (nhầm ô), nhưng chỉ gọi MỘT lần lúc mở màn khi ô đó còn trống →
       giá trị thật gửi đi là chuỗi rỗng; bản mới gửi rỗng. Ô Tiêu chí KHÔNG phụ
       thuộc ô Đối tượng (gốc không nạp lại) → không khoá cha → con.
     · Nút "Xóa" trong hộp thoại gốc để display:none, không nơi nào bật → bỏ;
       xoá chỉ qua "Xóa đã chọn" ở danh sách (gốc cũng không có xoá từng dòng).
     · viewForm gốc ghi DIEMQUYDOI vào #txtMucDiem (ô không tồn tại) — vô hại, bỏ.
     · Đổi ô chọn lọc thì nạp lại ngay (ums.crud); gốc chỉ nạp khi bấm Tìm kiếm / Enter.
     · Ô dropAAAA không tồn tại → strXepLoai_Id, strNguoiTao_Id gửi chuỗi rỗng.
   Cùng kiểu với ApisXuLyHocVu/dieukienxuly/khaibaodieukien (danh sách + biểu mẫu
   + xoá nhiều) nhưng khác controller / tham số — chỉ chung khuôn ums.crud.
   ========================================================================= */
(function () {
    'use strict';

    var DOITUONG = { dm: 'DRL.DOITUONGAPDUNG' };
    // Một đối tượng nguồn cho cả ô lọc và ô biểu mẫu → chỉ gọi một lần (như gốc)
    var TIEUCHI = {
        call: {
            action: 'RL_TieuChiDanhGia/LayDanhSach',
            method: 'GET',
            strTuKhoa: '',
            'strDRL_TieuChiDanhGia_Cha_id': '',
            strNguoiTao_Id: '',
            strNhomTieuChi_Id: '',
            strDoiTuongApDung_Id: '',
            pageIndex: 1,
            pageSize: 10000
        },
        id: 'ID', name: 'TEN'
    };

    ums.crud({
        root: document.getElementById('tieuchixeploai'),
        title: 'Khai báo tiêu chí xếp loại',
        formTitle: 'tiêu chuẩn xếp loại chung',
        icon: 'fa-ranking-star',

        filters: [
            { key: 'doiTuong', type: 'select', label: 'Chọn đối tượng', source: DOITUONG },
            { key: 'tieuChi', type: 'select', label: 'Chọn tiêu chí', source: TIEUCHI },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'RL_TieuChuanXepLoai/LayDanhSach',
                    method: 'GET',
                    strTuKhoa: f.q,
                    strXepLoai_Id: '',
                    strDoiTuongApDung_Id: f.doiTuong,
                    strDRL_TieuChiDanhGia_Id: f.tieuChi,
                    strNguoiTao_Id: ''
                };
            }
        },

        columns: [
            { title: 'Mức thấp nhất', prop: 'DIEMCANDUOI', cls: 'is-center' },
            { title: 'Mức cao nhất', prop: 'DIEMCANTREN', cls: 'is-center' },
            { title: 'Hình thức kỷ luật cao nhất được phép', prop: 'MUCKYLUATCAONHAT_TEN' },
            { title: 'Xếp loại', prop: 'XEPLOAI_TEN' },
            { title: 'Quy đổi điểm', prop: 'DIEMQUYDOI', cls: 'is-center' }
        ],

        fields: [
            { key: 'strDoiTuongApDung_Id', col: 'DOITUONGAPDUNG_ID', label: 'Đối tượng', type: 'select', source: DOITUONG },
            { key: 'strDRL_TieuChiDanhGia_Id', col: 'DRL_TIEUCHIDANHGIA_ID', label: 'Tiêu chí', type: 'select', source: TIEUCHI },
            { key: 'dDiemCanDuoi', col: 'DIEMCANDUOI', label: 'Mức thấp nhất', type: 'number' },
            { key: 'dDiemCanTren', col: 'DIEMCANTREN', label: 'Mức cao nhất', type: 'number' },
            { key: 'strMucKyLuatCaoNhat_Id', col: 'MUCKYLUATCAONHAT_ID', label: 'Kỷ luật cao nhất', type: 'select', source: { dm: 'QLSV.HINHTHUCKYLUAT' } },
            { key: 'strXepLoai_Id', col: 'XEPLOAI_ID', label: 'Xếp loại', type: 'select', source: { dm: 'DRL.XEPLOAI' } },
            { key: 'dDiemQuyDoi', col: 'DIEMQUYDOI', label: 'Điểm quy đổi', type: 'number' },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', type: 'textarea', span: true }
        ],

        rowDelete: false,
        formDelete: false,

        save: function (v, row) {
            return {
                action: row ? 'RL_TieuChuanXepLoai/CapNhat' : 'RL_TieuChuanXepLoai/ThemMoi',
                strId: row ? row.ID : '',
                strMucKyLuatCaoNhat_Id: v.strMucKyLuatCaoNhat_Id,
                dDiemCanTren: v.dDiemCanTren,
                dDiemCanDuoi: v.dDiemCanDuoi,
                strXepLoai_Id: v.strXepLoai_Id,
                strDoiTuongApDung_Id: v.strDoiTuongApDung_Id,
                dDiemQuyDoi: v.dDiemQuyDoi,
                strDRL_TieuChiDanhGia_Id: v.strDRL_TieuChiDanhGia_Id,
                strGhiChu: v.strGhiChu
            };
        },

        remove: function (ids) {
            return ids.map(function (id) { return { action: 'RL_TieuChuanXepLoai/Xoa', strIds: id }; });
        }
    });
})();
