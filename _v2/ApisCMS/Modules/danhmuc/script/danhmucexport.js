/* =========================================================================
   Danh mục export — khai báo HÀM EXPORT (theo procedure) và tham số của nó
   Bản gốc: ApisCMS/Modules/danhmuc/html/danhmucexport.html + script/danhmucexport.js
            (+ script/cutsouresql.js — tách tham số từ mã nguồn procedure)
   Khung dựng ở script/_dm.js (ums.cmsDm.hamMan) — dùng chung với danhmucimport
   (tệp gốc chép từ danhmucimport.js, lệch ở những chỗ khai dưới đây).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
     Hàm = bảng danh mục mang dTrangThai 985:
       CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi  pkg_chung_danhmuc.LayDanhSachDanhMuc   pageSize 1000000
       CMS_DanhMuc_MH/FSkkLAMgLyYFIC8pDDQi      pkg_chung_danhmuc.ThemBangDanhMuc      dThuTu "",
                                                strMoTa = mã nguồn; id mới ở data.Message (khác import: data.Id)
       CMS_DanhMuc_MH/GS4gBSAvKQw0IgPP          pkg_chung_danhmuc.XoaDanhMuc
     Tham số (dTrangThai 985):
       CMS_DanhMucDuLieu/LayDanhSach   GET  strTieuChiSapXep "" , pageSize 100000
       CMS_DanhMucExport/ThemMoiThamSo       — CẢ thêm lẫn sửa (gốc không đổi action khi có strId)
                                             HESO1 = ô "Key(1), Validate(10)" (khác import), THONGTIN4/5 rỗng
       CMS_DanhMucDuLieu/Xoa           strId một id
     Nút mục trái: tải → rootPathReport/Modules/Common/ExportDataInFunction.aspx?Ma=<MADANHMUC>

   Tạo hàm: mã nguồn KHÔNG đổi chữ hoa/thường (kiểm "procedure" phân biệt hoa thường như gốc);
   tách tham số → mỗi tham số một lời gọi ThemMoiThamSo (dHeSo1 rỗng, strMoTa = tên hàm), xong
   thì mở ExportDataInFunction.aspx?Ma=<mã hàm> như gốc.

   Khác gốc / lỗi gốc:
     · "Tạo mới tham số" ở gốc KHÔNG BAO GIỜ lưu được: resetPopup xoá strFunc_Id nên save_Param luôn
       báo "Hãy chọn hàm bên tay trái" → bản mới giữ hàm đang chọn.
     · Sửa hàm: gốc vẫn gửi strId "" (tạo hàm TRÙNG, không tham số) mà báo "Cập nhật thành công!"
       → bản mới gửi strId + action cập nhật CMS_DanhMuc_MH/EjQgAyAvJgUgLykMNCIP (như danhmuctenbang).
       Đường GHI mới — thử trên host.
     · Ô lọc cột trái không gắn xử lý ở gốc → nay chạy (như danhmucimport).
     · Xoá hàm / tham số: gốc không hỏi lại → nay hỏi.
     · Tham số không nhận ra kiểu (getTypeSup "") gốc gửi mã cột excel undefined → bỏ qua dòng đó.
     · Hai ô có (*) (Mã cột excel, Mã DataBase) nay bắt buộc (gốc kiểm ô không tồn tại).
     · Nhãn "Kiểu số(0), Kiểu chữ(1)" trong biểu mẫu ngược với tiêu đề cột "Kiểu chữ(0), Kiểu số(1)"
       — giữ cả hai như gốc (nghi ngờ, không sửa).
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('danhmucexport');
    if (!root) return;
    var D = ums.cmsDm, e = D.e;

    function kiemSQL(sql) {
        var s = String(sql || '');
        return !((s !== '' && s.indexOf('create or replace package') === -1) || s.indexOf('procedure') === -1);
    }

    D.hamMan(root, {
        tieuDe: 'Danh mục export',
        loai: 'export',
        dTrangThai: 985,
        thuTu: '',
        tieuDeHam: 'Tạo hàm Export',
        iconDs: 'fa-file-export',
        macDinh: null,
        kiemSQL: kiemSQL,
        idMoi: function (r) { return r.message || ''; },
        nhan: function (r) { return e(r.TENDANHMUC); },
        act: ['sua', 'tai', 'xoa'],
        sauTuDong: function (f) { D.moBaoCao('/Modules/Common/ExportDataInFunction.aspx?Ma=' + f.ma); },
        thamSo: {
            sapXep: '',
            columns: [
                { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
                { title: 'Tham số dưới db', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Dữ liệu mặc định', prop: 'THONGTIN2' },
                { title: 'Kiểu chữ(0), Kiểu số(1)', prop: 'HESO2', cls: 'is-center' },
                { title: 'In(0), Out(1), InOut(10)', prop: 'HESO3', cls: 'is-center' }
            ],
            fields: [
                { key: 'strTen', col: 'TEN', label: 'Tên tham số' },
                { key: 'strThongTin1', col: 'THONGTIN1', label: 'Mã Cột file excel', required: true },
                { key: 'strMa', col: 'MA', label: 'Mã DataBase', required: true },
                { key: 'strThongTin2', col: 'THONGTIN2', label: 'Dữ liệu mặc định' },
                { key: 'dHeSo1', col: 'HESO1', label: 'Key(1), Validate(10)' },
                { key: 'dHeSo2', col: 'HESO2', label: 'Kiểu số(0), Kiểu chữ(1)' },
                { key: 'dHeSo3', col: 'HESO3', label: 'In(0), Out(1), InOut(10)' },
                { key: 'strThongTin3', col: 'THONGTIN3', label: 'Tên gói' }
            ],
            luu: function (v, row, funcId) {
                return {
                    action: 'CMS_DanhMucExport/ThemMoiThamSo',
                    strMa: v.strMa,
                    strTen: v.strTen,
                    strQuanHeCha_Id: '',
                    strChung_TenDanhMuc_Id: funcId,
                    dHeSo1: v.dHeSo1,
                    dHeSo2: v.dHeSo2,
                    dHeSo3: v.dHeSo3,
                    strThongTin1: v.strThongTin1,
                    strThongTin2: v.strThongTin2,
                    strThongTin3: v.strThongTin3,
                    strThongTin4: '',
                    strThongTin5: '',
                    strThongTin6: '',
                    strThongTin7: '',
                    strThongTin8: '',
                    strMoTa: '',
                    strId: row ? row.ID : '',
                    dTrangThai: 985,
                    strNguoiThucHien_Id: ''
                };
            },
            tuDong: function (a, i, pkgHam, funcId, f) {
                return {
                    action: 'CMS_DanhMucExport/ThemMoiThamSo',
                    strMa: e(a[0]),
                    strTen: '',
                    strQuanHeCha_Id: '',
                    strChung_TenDanhMuc_Id: funcId,
                    dHeSo1: '',
                    dHeSo2: e(a[3]),
                    dHeSo3: e(a[4]),
                    strThongTin1: e(a[1]),
                    strThongTin2: e(a[2]),
                    strThongTin3: pkgHam,
                    strThongTin4: '',
                    strThongTin5: '',
                    strThongTin6: '',
                    strThongTin7: '',
                    strThongTin8: '',
                    strMoTa: f.ten,
                    strId: '',
                    dTrangThai: 985,
                    strNguoiThucHien_Id: ''
                };
            }
        }
    });
})();
