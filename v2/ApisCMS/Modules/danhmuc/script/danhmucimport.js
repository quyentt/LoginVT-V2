/* =========================================================================
   Danh mục import — khai báo HÀM IMPORT (theo procedure) và tham số của nó
   Bản gốc: ApisCMS/Modules/danhmuc/html/danhmucimport.html + script/danhmucimport.js
            (+ script/CutSoureSQL.js — tách tham số từ mã nguồn procedure)
   Khung dựng ở script/_dm.js (ums.cmsDm.hamMan) — dùng chung với danhmucexport.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
     Hàm = bảng danh mục mang dTrangThai 995:
       CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi  pkg_chung_danhmuc.LayDanhSachDanhMuc   pageSize 1000000
       CMS_DanhMuc_MH/FSkkLAMgLyYFIC8pDDQi      pkg_chung_danhmuc.ThemBangDanhMuc      strId "", dThuTu 1,
                                                strMoTa = mã nguồn procedure; id mới ở data.Id
       CMS_DanhMuc_MH/GS4gBSAvKQw0IgPP          pkg_chung_danhmuc.XoaDanhMuc
     Tham số = dữ liệu danh mục của hàm (dTrangThai 995):
       CMS_DanhMucDuLieu/LayDanhSach   GET  strTieuChiSapXep "HESO1", pageSize 100000 (gửi cả 'type': 'GET' như gốc)
       CMS_DanhMucDuLieu/ThemMoi | CapNhat   HESO1 thứ tự, HESO2 kiểu chữ/số, HESO3 In/Out,
                                             THONGTIN1 mã cột excel, THONGTIN2 mặc định, THONGTIN3 tên gói,
                                             THONGTIN4 key(1)/validate(10), THONGTIN5 GetData, MA tham số DB
       CMS_DanhMucDuLieu/Xoa           strId một id
     Nút mục trái: tải mẫu  → rootPathReport/Modules/Common/MauImport.aspx?Ma=<MADANHMUC>
                   tải dữ liệu → rootPathReport/Modules/Common/ExportDataInDanhMuc.aspx?strMaDanhMucs=<MADANHMUC>
     "Import dữ liệu" → edu.system.showImportChung("") = ums.report.importChung('', '').

   Tạo hàm: có mã nguồn thì tách tham số (SeaGate_BackEnd — ums.cmsDm.tachSQL; PACKAGE/PROCEDURE
   viết hoa đổi về chữ thường trước), mỗi tham số một lời gọi ThemMoi; tham số tên UngDung_Id /
   ChucNang_Id / NguoiThucHien_Id / Id thì bỏ mã cột excel. Kiểm mã nguồn giữ đúng biểu thức gốc
   (chữ thường hoá): thiếu "procedure" (kể cả để trống) → "Bạn nhập thiếu!" và xoá ô.

   Khác gốc / lỗi gốc:
     · Ô "Chọn ứng dụng" và ô từ khoá cột trái KHÔNG gắn xử lý nào ở gốc (gốc nghe
       #dropDMIP_UngDung_Search, #btnSearch, #txtSearch_TuKhoa_DMIP — không tồn tại) và lời gọi đọc
       strTuKhoa từ ô không tồn tại → bản mới cho hai ô lọc chạy: chọn ứng dụng / Enter / kính lúp nạp lại.
     · Xoá hàm, xoá tham số: gốc xoá ngay không hỏi → nay hỏi lại.
     · Tạo hàm xong gốc KHÔNG nạp lại danh sách trái → nay nạp lại và chọn sẵn hàm mới.
     · Tham số không nhận ra kiểu (getTypeSup trả "") làm gốc lỗi JS (.trim của undefined) → bỏ qua dòng đó.
     · Cột "Stt" của gốc thật ra hiện HESO1 (bHiddenOrder) → cột riêng "Thứ tự".
     · Nút sửa hàm (.btnEdit_Func) có xử lý nhưng không mục nào vẽ ra → không có (như gốc).
     · Kiểm hợp lệ gốc trỏ ô không tồn tại (txtDMIP_Ma/Ten) → không kiểm; hai ô có (*) (Mã cột
       excel, Mã DataBase) nay bắt buộc.
     · Bỏ: popup_import / import_DMIP (SYS_Import/Import) — mã chết, không nút nào gọi.
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('danhmucimport');
    if (!root) return;
    var D = ums.cmsDm, e = D.e;
    var BO_EXCEL = ['UngDung_Id', 'ChucNang_Id', 'NguoiThucHien_Id', 'Id'];

    function kiemSQL(sql) {
        var s = String(sql || '').toLowerCase();
        return !((s !== '' && s.indexOf('create or replace package') === -1) || s.indexOf('procedure') === -1);
    }

    D.hamMan(root, {
        tieuDe: 'Danh mục import',
        loai: 'import',
        dTrangThai: 995,
        thuTu: 1,
        tieuDeHam: 'Tạo hàm import',
        iconDs: 'fa-list-timeline',
        macDinh: { ten: 'IMPORTWITHPROC_', ma: 'IMPORTWITHPROC_', sql: 'create or replace package XXXXXXX is\n procedure ' },
        kiemSQL: kiemSQL,
        tachTruoc: function (sql) { return sql.replace(/PACKAGE/g, 'package').replace(/PROCEDURE/g, 'procedure'); },
        idMoi: function (r) { return (r.raw && r.raw.Id) || ''; },
        nhan: function (r) { return e(r.MADANHMUC).replace(/IMPORTWITHPROC_/g, '') + '_' + e(r.TENDANHMUC); },
        act: ['mau', 'xoa', 'dulieu'],
        toolbar: [{
            text: 'Import dữ liệu', icon: ums.ui.ICON.importer, mod: 'out-info',
            onClick: function () { ums.report.importChung('', ''); }
        }],
        thamSo: {
            sapXep: 'HESO1',
            columns: [
                { title: 'Thứ tự', prop: 'HESO1', cls: 'is-center' },
                { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
                { title: 'Mã file excel', prop: 'THONGTIN1', cls: 'is-nowrap' },
                { title: 'Tham số dưới db', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Dữ liệu mặc định', prop: 'THONGTIN2' },
                { title: 'Key chính(1)', prop: 'THONGTIN4', cls: 'is-center' },
                { title: 'Kiểu chữ(0), Kiểu số(1)', prop: 'HESO2', cls: 'is-center' },
                { title: 'In(0), Out(1), InOut(10)', prop: 'HESO3', cls: 'is-center' },
                { title: 'Get Data', prop: 'THONGTIN5' }
            ],
            fields: [
                { key: 'strTen', col: 'TEN', label: 'Tên tham số' },
                { key: 'strThongTin1', col: 'THONGTIN1', label: 'Mã Cột file excel', required: true },
                { key: 'strMa', col: 'MA', label: 'Mã DataBase', required: true },
                { key: 'strThongTin2', col: 'THONGTIN2', label: 'Dữ liệu mặc định' },
                { key: 'strThongTin4', col: 'THONGTIN4', label: 'Key(1), Validate(10)' },
                { key: 'dHeSo2', col: 'HESO2', label: 'Kiểu chữ(0), Kiểu số(1)' },
                { key: 'dHeSo3', col: 'HESO3', label: 'In(0), Out(1), InOut(10)' },
                { key: 'strThongTin3', col: 'THONGTIN3', label: 'Tên gói' },
                { key: 'dHeSo1', col: 'HESO1', label: 'Thứ tự' },
                { key: 'strThongTin5', col: 'THONGTIN5', label: 'GetData' }
            ],
            luu: function (v, row, funcId) {
                return {
                    action: row ? 'CMS_DanhMucDuLieu/CapNhat' : 'CMS_DanhMucDuLieu/ThemMoi',
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
                    strThongTin4: v.strThongTin4,
                    strThongTin5: v.strThongTin5,
                    strThongTin6: '',
                    strThongTin7: '',
                    strThongTin8: '',
                    strMoTa: '',
                    strId: row ? row.ID : '',
                    dTrangThai: 995,
                    strNguoiThucHien_Id: ''
                };
            },
            tuDong: function (a, i, pkgHam, funcId) {
                var key = e(a[1]).trim();
                if (BO_EXCEL.indexOf(key) >= 0) key = '';
                return {
                    action: 'CMS_DanhMucDuLieu/ThemMoi',
                    strMa: e(a[0]),
                    strTen: '',
                    strQuanHeCha_Id: '',
                    strChung_TenDanhMuc_Id: funcId,
                    dHeSo1: i,
                    dHeSo2: e(a[3]),
                    dHeSo3: e(a[4]),
                    strThongTin1: key,
                    strThongTin2: e(a[2]),
                    strThongTin3: pkgHam,
                    strThongTin4: '',
                    strThongTin5: '',
                    strThongTin6: '',
                    strThongTin7: '',
                    strThongTin8: '',
                    strMoTa: '',              // gốc đọc #txtTenHamExport — không có ở màn import
                    strId: '',
                    dTrangThai: 995,
                    strNguoiThucHien_Id: ''
                };
            }
        }
    });
})();
