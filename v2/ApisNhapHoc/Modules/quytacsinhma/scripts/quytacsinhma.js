/* =========================================================================
   Quy tắc sinh mã
   Bản gốc: ApisNhapHoc/Modules/quytacsinhma/html/quytacsinhma.html + scripts/quytacsinhma.js
   ---------------------------------------------------------------------------
   Bố cục gốc: thanh tìm (Kế hoạch + từ khoá + nút) · bảng "Danh sách" (Xóa, Tải lại, Tạo mới)
   · biểu mẫu thay chỗ danh sách (một cột nhãn + ảnh trang trí bên phải) → ums.crud một cột;
   ảnh minh hoạ bỏ.

   Lời gọi (chép nguyên):
     Danh sách  NH_QuyTacSinhMa/LayDanhSach  GET  strKeHoachNhapHoc_Id (kế hoạch đang lọc, không chọn
                thì ID người dùng), strNguoiThucHien_Id "", strTuKhoa, pageIndex/pageSize
     Chi tiết   NH_QuyTacSinhMa/LayChiTiet  GET  strId
     Lưu        NH_QuyTacSinhMa/ThemMoi | CapNhat  POST  strTen, strThanhPhanCauTrucMa_Id, dThuTu,
                strKeHoachNhapHoc_Id, strGiaTriMacDinh, strMucApDung_Id, dDoDai, strId
     Xoá        NH_QuyTacSinhMa/Xoa  POST  strIds (nối dấu phẩy)
     Danh mục   QLSV.CAUTRUCMA (thành phần cấu trúc mã), QLSV.MUCAPDUNG (mức áp dụng)
     Kế hoạch   ums.nhKH.theoNguoiDung() (PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc)

   Lỗi gốc đã sửa (làm theo ý định):
     · Ô thứ hai của biểu mẫu chép nhầm nhãn + id "Thứ tự" (txtThuTu_QTSM hai lần) trong khi mã đọc
       txtDoDai_QTSM (không tồn tại) → dDoDai luôn rỗng. Nay là ô "Độ dài" gửi dDoDai.
     · Bảng không có cột "Sửa" và strId đọc từ getValById("") nên CapNhat không bao giờ chạy;
       viewForm_QTSM đổ các ô của định mức chung (chép nhầm). Nay sửa được: bấm Sửa → LayChiTiet →
       CapNhat. Cột đổ vào biểu mẫu lấy theo cột danh sách (TEN, THUTU, GIATRIMACDINH, DODAI) và
       mã tương ứng THANHPHANCAUTRUCMA_ID / MUCAPDUNG_ID; kế hoạch đọc TAICHINH_KEHOACHNHAPHOC_ID
       (cột duy nhất gốc đọc) — thiếu thì giữ kế hoạch đang lọc.
     · Mở màn gốc gửi strKeHoachNhapHoc_Id RỖNG, các lần tìm sau gửi ID người dùng khi chưa chọn
       kế hoạch → nay mọi lần đều theo luật sau (như định mức chung / riêng).
     · Ô "Kế hoạch nhập học" bắt buộc (gốc lưu được với kế hoạch rỗng); ô chọn có ô gõ tìm thay ô
       chữ chỉ đọc + hộp "Tìm kiếm kế hoạch".
     · Lưu xong quay về danh sách (gốc ở lại biểu mẫu).
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('quytacsinhma');
    if (!root) return;
    var ums = window.ums, N = ums.nhKH, e = N.e;
    var KH = N.capNguon(N.theoNguoiDung);

    ums.crud({
        root: root,
        title: 'Quy tắc sinh mã',
        formTitle: 'quy tắc sinh mã',
        icon: 'fa-barcode',
        addText: 'Tạo mới',
        filters: [
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch nhập học', source: KH.loc },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'NH_QuyTacSinhMa/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                    strKeHoachNhapHoc_Id: N.timKiem(f.kh),
                    strNguoiThucHien_Id: '',
                    strTuKhoa: f.q
                };
            }
        },
        columns: [
            { title: 'Thứ tự', prop: 'THUTU', cls: 'is-center', width: '90px' },
            { title: 'Tên', prop: 'TEN' },
            { title: 'Thành phần cấu trúc', prop: 'THANHPHANCAUTRUCMA_TEN' },
            { title: 'Giá trị mặc định', prop: 'GIATRIMACDINH' },
            { title: 'Độ dài', prop: 'DODAI', cls: 'is-center' },
            { title: 'Mức áp dụng', prop: 'MUCAPDUNG_TEN' }
        ],
        formCols: 2,
        fields: [
            { key: 'strKeHoachNhapHoc_Id', label: 'Kế hoạch nhập học', type: 'select', placeholder: 'Chọn kế hoạch nhập học',
              source: KH.form, required: true, caDong: true, get: function (r) { return r.TAICHINH_KEHOACHNHAPHOC_ID; } },
            { key: 'strTen', col: 'TEN', label: 'Tên quy tắc' },
            { key: 'strThanhPhanCauTrucMa_Id', col: 'THANHPHANCAUTRUCMA_ID', label: 'Cấu trúc mã', type: 'select',
              placeholder: 'Chọn thành phần cấu trúc mã', source: { dm: 'QLSV.CAUTRUCMA' } },
            { key: 'strGiaTriMacDinh', col: 'GIATRIMACDINH', label: 'Giá trị mặc định' },
            { key: 'strMucApDung_Id', col: 'MUCAPDUNG_ID', label: 'Mức áp dụng', type: 'select',
              placeholder: 'Chọn mức áp dụng', source: { dm: 'QLSV.MUCAPDUNG' } },
            { key: 'dThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number' },
            { key: 'dDoDai', col: 'DODAI', label: 'Độ dài', type: 'number' }
        ],
        detail: function (row) {
            return { action: 'NH_QuyTacSinhMa/LayChiTiet', method: 'GET', versionAPI: 'v1.0', strId: row.ID };
        },
        save: function (v, row) {
            return {
                action: row ? 'NH_QuyTacSinhMa/CapNhat' : 'NH_QuyTacSinhMa/ThemMoi',
                versionAPI: 'v1.0',
                strTen: v.strTen,
                strThanhPhanCauTrucMa_Id: v.strThanhPhanCauTrucMa_Id,
                dThuTu: v.dThuTu,
                strKeHoachNhapHoc_Id: v.strKeHoachNhapHoc_Id,
                strGiaTriMacDinh: v.strGiaTriMacDinh,
                strMucApDung_Id: v.strMucApDung_Id,
                dDoDai: v.dDoDai,
                strId: row ? row.ID : ''
            };
        },
        rowDelete: false,
        formDelete: false,
        remove: function (ids) {
            return { action: 'NH_QuyTacSinhMa/Xoa', versionAPI: 'v1.0', strIds: ids.join(',') };
        },
        removeConfirm: function () { return 'Bạn có chắc chắn muốn xóa dữ liệu hệ thống?'; },
        onForm: function (row, c) {
            if (!row) return;                    // rewrite gốc: thêm mới để trống kế hoạch
            var el = N.o(c, 'strKeHoachNhapHoc_Id');
            var id = e(row.TAICHINH_KEHOACHNHAPHOC_ID) || c.filterValues().kh;
            N.dat(el, id, e(row.TAICHINH_KEHOACHNHAPHOC_TEN));
        }
    });
})();
