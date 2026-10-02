/* =========================================================================
   Danh mục tên bảng — khai báo BẢNG DANH MỤC (tên, mã, ứng dụng, quan hệ cha…)
   Bản gốc: ApisCMS/Modules/danhmuc/html/danhmuctenbang.html + script/danhmuctenbang.js
   Một cột như gốc: thanh lọc + bảng, biểu mẫu thay chỗ bảng (ums.crud).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn, đều có func → mã hoá iM):
     Danh sách: CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi  pkg_chung_danhmuc.LayDanhSachDanhMuc
                phân trang máy chủ; strNhomDanhMuc_Id = ô ứng dụng; dTrangThai = ô "Trạng thái" (ô CHỮ
                như gốc) hoặc 1 khi để trống
     Chi tiết:  CMS_DanhMuc_MH/DSA4FSkuLyYVKC8FIC8pDDQiFSkkLggl  pkg_chung_danhmuc.LayThongTinDanhMucTheoId
     Thêm:      CMS_DanhMuc_MH/FSkkLAMgLyYFIC8pDDQi  pkg_chung_danhmuc.ThemBangDanhMuc
     Sửa:       CMS_DanhMuc_MH/EjQgAyAvJgUgLykMNCIP  (func GIỮ ThemBangDanhMuc như gốc — chỉ đổi action)
                dThuTu = returnZero(TT hiển thị), dTrangThai 1, strNgayThucHien ""
     Xoá:       CMS_DanhMuc_MH/GS4gBSAvKQw0IgPP  pkg_chung_danhmuc.XoaDanhMuc — MỖI dòng một lời gọi (gốc lặp forEach)
     Ứng dụng:  pkg_chung_quanlynguoidung.LayDanhSachUngDung (ums.cmsDm.ungDung)
     Export:    rootPathReport + /Modules/Common/ExportDataInDanhMuc.aspx?strMaDanhMucs=<mã các dòng đã
                đánh dấu, nối ","> — không đánh dấu dòng nào thì lấy ô từ khoá; cả hai trống thì không làm gì.

   Khác gốc / lỗi gốc:
     · Ô "Quan hệ cha" trong biểu mẫu gốc KHÔNG được nạp danh sách nào (không dòng mã nào đổ vào
       #dropDMTB_Cha) → luôn gửi "" và sửa một bảng là XOÁ MẤT quan hệ cha của nó. Bản mới nạp danh
       sách bảng (cùng LayDanhSachDanhMuc, dTrangThai 1, pageSize 100000) để chọn được và giữ giá trị cũ.
     · Ô "Ứng dụng" mang (*) nay bắt buộc (gốc chỉ kiểm Mã bảng).
     · Chi tiết gốc đọc ứng dụng ở cột UNGDUNG_ID (danh sách hàm import đọc NHOMDANHMUC_ID) → đọc
       UNGDUNG_ID, trống thì NHOMDANHMUC_ID (chỉ đọc, không đổi tham số gửi đi).
     · Gốc đổi ô "Ứng dụng" ở thanh lọc KHÔNG nạp lại (nghe nhầm #dropDMTB_UngDung_Search) — bản mới
       nạp lại như mọi thanh lọc.
     · Bỏ mã chết: getList_DataImport / genTable_Import_View / showBaoCao / showCot (không nút nào gọi).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('danhmuctenbang');
    if (!root) return;
    var D = ums.cmsDm, e = D.e;

    var UNG = { call: {
        action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
        func: 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
        dTrangThai: 1, strTuKhoa: '', pageIndex: 1, pageSize: 10000
    }, id: 'ID', name: 'TENUNGDUNG' };

    var BANG = { call: {
        action: 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi',
        func: 'pkg_chung_danhmuc.LayDanhSachDanhMuc',
        strPhanCapDanhMuc_Id: '', strChung_TenDanhMuc_Cha_Id: '', strNhomDanhMuc_Id: '', strTuKhoa: '',
        pageIndex: 1, pageSize: 100000, dTrangThai: 1, strTieuChiSapXep: ''
    }, id: 'ID', name: function (r) { return e(r.TENDANHMUC) + (r.MADANHMUC ? ' - ' + r.MADANHMUC : ''); } };

    ums.crud({
        root: root,
        title: 'Danh mục tên bảng',
        formTitle: 'bảng danh mục',
        icon: 'fa-list-timeline',
        addText: 'Tạo mới',
        filters: [
            { key: 'ung', type: 'select', label: '-- Chọn ứng dụng--', source: UNG },
            { key: 'tt', type: 'text', label: 'Trạng thái' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        toolbar: [{
            text: 'Export', icon: ui.ICON.excel, mod: 'out-info',
            onClick: function (c) {
                var ma = c.pickedRows().map(function (r) { return e(r.MADANHMUC); }).join(',');
                if (!ma) ma = c.filterValues().q;
                if (!ma) { ui.toast('Đánh dấu các bảng cần export, hoặc nhập mã bảng vào ô từ khoá', 'warn'); return; }
                D.moBaoCao('/Modules/Common/ExportDataInDanhMuc.aspx?strMaDanhMucs=' + ma);
            }
        }],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi',
                    func: 'pkg_chung_danhmuc.LayDanhSachDanhMuc',
                    strPhanCapDanhMuc_Id: '',
                    strChung_TenDanhMuc_Cha_Id: '',
                    strNhomDanhMuc_Id: f.ung,
                    strTuKhoa: f.q,
                    dTrangThai: f.tt ? f.tt : 1,
                    strTieuChiSapXep: ''
                };
            }
        },
        columns: [
            { title: 'Mã', prop: 'MADANHMUC' },
            { title: 'Tên', prop: 'TENDANHMUC' },
            { title: 'Nhóm', prop: 'TENNHOMDANHMUC' }
        ],
        detail: function (row) {
            return {
                action: 'CMS_DanhMuc_MH/DSA4FSkuLyYVKC8FIC8pDDQiFSkkLggl',
                func: 'pkg_chung_danhmuc.LayThongTinDanhMucTheoId',
                strId: row.ID
            };
        },
        formCols: 1,
        fields: [
            { key: 'strTenDanhMuc', col: 'TENDANHMUC', label: 'Tên bảng' },
            { key: 'strMaDanhMuc', col: 'MADANHMUC', label: 'Mã bảng', required: true },
            { key: 'dThuTu', col: 'THUTU', label: 'TT hiển thị', type: 'number' },
            { key: 'strNhomDanhMuc_Id', label: 'Ứng dụng', type: 'select', required: true, source: UNG,
              placeholder: 'Chọn ứng dụng', get: function (r) { return e(r.UNGDUNG_ID) || e(r.NHOMDANHMUC_ID); } },
            { key: 'strChung_TenDanhMuc_Cha_Id', col: 'CHUNG_TENDANHMUC_CHA_ID', label: 'Quan hệ cha', type: 'select',
              source: BANG, placeholder: 'Chọn quan hệ cha' },
            { key: 'strPhanCapDanhMuc_Id', col: 'PHANCAPDANHMUC_ID', label: 'Phân cấp', type: 'select',
              source: { items: [{ ID: '0', TEN: 'Hệ thống' }, { ID: '1', TEN: 'Ứng dụng' }] }, placeholder: '--Chọn phân cấp --' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' }
        ],
        save: function (v, row) {
            var tt = Number(String(v.dThuTu || '').replace(/,/g, ''));
            return {
                action: row ? 'CMS_DanhMuc_MH/EjQgAyAvJgUgLykMNCIP' : 'CMS_DanhMuc_MH/FSkkLAMgLyYFIC8pDDQi',
                func: 'pkg_chung_danhmuc.ThemBangDanhMuc',
                strId: row ? row.ID : '',
                strNguoiThucHien_Id: '',
                strMaDanhMuc: v.strMaDanhMuc,
                strTenDanhMuc: v.strTenDanhMuc,
                strNhomDanhMuc_Id: v.strNhomDanhMuc_Id,
                strMoTa: v.strMoTa,
                dThuTu: isNaN(tt) ? 0 : tt,                       // edu.util.returnZero
                dTrangThai: 1,
                strPhanCapDanhMuc_Id: v.strPhanCapDanhMuc_Id,
                strChung_TenDanhMuc_Cha_Id: v.strChung_TenDanhMuc_Cha_Id,
                strNgayThucHien: ''
            };
        },
        remove: function (ids) {
            return ids.map(function (id) {
                return {
                    action: 'CMS_DanhMuc_MH/GS4gBSAvKQw0IgPP',
                    func: 'pkg_chung_danhmuc.XoaDanhMuc',
                    strId: id,
                    dTrangThai: 1,
                    strNguoiThucHien_Id: ''
                };
            });
        },
        // Thêm/sửa bảng làm đổi danh sách "Quan hệ cha" — nạp lại nguồn
        onSaved: function (c) { delete BANG._p; c.fillSources(); }
    });
})();
