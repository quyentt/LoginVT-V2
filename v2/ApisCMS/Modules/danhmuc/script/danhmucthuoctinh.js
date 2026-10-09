/* =========================================================================
   Danh mục thuộc tính — khai báo TRƯỜNG DỮ LIỆU của từng bảng danh mục
   Bản gốc: ApisCMS/Modules/danhmuc/html/danhmucthuoctinh.html + script/danhmucthuoctinh.js
   Hai cột như gốc: trái = cây bảng danh mục (ums.cmsDm.cay, script/_dm.js),
   phải = thuộc tính của bảng đang chọn (ums.crud nhúng, biểu mẫu thay chỗ bảng).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn, đều có func → mã hoá iM):
     Cây bảng:  CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi  pkg_chung_danhmuc.LayDanhSachDanhMuc
                versionAPI 'v1.0' (chỉ bản thuộc tính gửi), dTrangThai 1
     Ứng dụng:  pkg_chung_quanlynguoidung.LayDanhSachUngDung (edu.extend.getList_UngDung)
     Danh sách: CMS_DanhMuc_MH/DSA4BSAvKRIgIikVKTQuIhUoLykFIC8pDDQi  pkg_chung_danhmuc.LayDanhSachThuocTinhDanhMuc
                strCHUNG_TENDANHMUC_Id, pageIndex 1, pageSize 1000, dTrangThai 1
     Chi tiết:  CMS_DanhMuc_MH/DSA4FSkuLyYVKC8FIC8pDDQiFSkkLggl  pkg_chung_danhmuc.LayThongTinDanhMucTheoId
     Thêm:      CMS_DanhMuc_MH/FSkkLBUpNC4iFSgvKQUgLykMNCIP  pkg_chung_danhmuc.ThemThuocTinhDanhMuc
     Sửa:       CMS_DanhMuc_MH/EjQgFSk0LiIVKC8pBSAvKQw0IgPP  (func GIỮ ThemThuocTinhDanhMuc như gốc — chỉ đổi action)
                strTenTruongDuLieu, strChung_TenDanhMuc_Id, strMoTa, dThuTu 0, dTrangThai 1, strNgayThucHien ""
     Xoá:       CMS_DanhMuc_MH/GS4gFSk0LiIVKC8pBSAvKQw0IgPP  pkg_chung_danhmuc.XoaThuocTinhDanhMuc  strId "id1,id2," (một lời gọi)

   Nghi ngờ (giữ + ghi chú): "Chi tiết" gốc gọi LayThongTinDanhMucTheoId — procedure lấy THÔNG TIN BẢNG
   danh mục, không phải thuộc tính. Bản mới vẫn gọi, nhưng chỉ đổ vào biểu mẫu khi kết quả có cột
   TENTRUONGDULIEU; không có thì giữ giá trị của dòng trong bảng (tránh đổ nhầm Mô tả của bảng).

   Khác gốc:
     · "Tên trường" mang (*) nay bắt buộc (gốc kiểm với mã "1" không phải mã kiểm nào → không kiểm).
     · Chưa chọn bảng thì không có nút Tạo mới (gốc cho mở biểu mẫu, lưu với bảng rỗng).
     · Lọc ứng dụng: chọn HOẶC xoá ô đều nạp lại cây (gốc chỉ bắt select2:select).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('danhmucthuoctinh');
    if (!root) return;
    var D = ums.cmsDm, e = D.e;

    var TRUONG = ['Ten', 'Ma', 'HeSo1', 'HeSo2', 'HeSo3', 'ThongTin1', 'ThongTin2', 'ThongTin3',
        'ThongTin4', 'ThongTin5', 'ThongTin6', 'ThongTin7', 'ThongTin8'].map(function (x) { return { ID: x, TEN: x }; });

    var m = ums.pat.master({
        el: root,
        title: 'Danh mục thuộc tính',
        side: { title: 'Danh sách danh mục', kieu: 'danhmuc', search: false, filter: D.locHtml('Tìm kiếm danh mục') },
        main: { title: false }
    });

    function nhac(msg) {
        m.mainBody.innerHTML = '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title">' +
            '<i class="fa-light fa-folder-tree"></i> Thuộc tính danh mục</div></div>' +
            '<div class="ums-panel__body">' + ui.empty(msg, 'fa-hand-pointer') + '</div></div>';
    }
    nhac('Vui lòng chọn tên bảng để hiển thị thuộc tính!');

    D.cay(m, { them: { versionAPI: 'v1.0' }, onPick: build });

    function build(bang) {
        var bangId = bang.ID;
        m.mainBody.innerHTML = '';
        var crud = ums.crud({
            root: m.mainBody,
            embedded: true,
            title: 'Thuộc tính danh mục — ' + e(bang.TENDANHMUC),
            formTitle: 'trường dữ liệu bảng danh mục',
            icon: 'fa-folder-tree',
            addText: 'Tạo mới',
            empty: 'Không có dữ liệu',
            list: {
                call: function () {
                    return {
                        action: 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikVKTQuIhUoLykFIC8pDDQi',
                        func: 'pkg_chung_danhmuc.LayDanhSachThuocTinhDanhMuc',
                        strTuKhoa: '',
                        strCHUNG_TENDANHMUC_Id: bangId,
                        pageIndex: 1,
                        pageSize: 1000,
                        dTrangThai: 1,
                        strTieuChiSapXep: ''
                    };
                }
            },
            columns: [
                { title: 'Tên trường dữ liệu', prop: 'TENTRUONGDULIEU' },
                { title: 'Mô tả tên trường', prop: 'MOTA' }
            ],
            fields: [
                { key: 'strTenTruongDuLieu', col: 'TENTRUONGDULIEU', label: 'Tên trường', type: 'select', required: true,
                  source: { items: TRUONG }, placeholder: '-- Chọn tên trường dữ liệu --' },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' }
            ],
            formCols: 1,
            // Biểu mẫu mở bằng dữ liệu dòng; chi tiết gọi đúng như gốc rồi mới đổ (xem đầu tệp)
            onForm: function (row, c) {
                if (!row) return;
                ums.api.call({
                    action: 'CMS_DanhMuc_MH/DSA4FSkuLyYVKC8FIC8pDDQiFSkkLggl',
                    func: 'pkg_chung_danhmuc.LayThongTinDanhMucTheoId',
                    strId: row.ID,
                    strTieuChiSapXep: ''
                }).then(function (r) {
                    var d = D.rows(r)[0];
                    if (!d || d.TENTRUONGDULIEU === undefined || !c.editing || c.editing.ID !== row.ID) return;
                    c.formEls().forEach(function (el) {
                        var k = el.getAttribute('data-k');
                        if (k === 'strTenTruongDuLieu') { el.value = e(d.TENTRUONGDULIEU); if (window.jQuery) jQuery(el).trigger('change.select2'); }
                        if (k === 'strMoTa') el.value = e(d.MOTA);
                    });
                }).catch(function (err) { ums.api.handle(err, 'chi tiết thuộc tính'); });
            },
            save: function (v, row) {
                return {
                    action: row ? 'CMS_DanhMuc_MH/EjQgFSk0LiIVKC8pBSAvKQw0IgPP' : 'CMS_DanhMuc_MH/FSkkLBUpNC4iFSgvKQUgLykMNCIP',
                    func: 'pkg_chung_danhmuc.ThemThuocTinhDanhMuc',
                    strId: row ? row.ID : '',
                    strNguoiThucHien_Id: '',
                    strTenTruongDuLieu: v.strTenTruongDuLieu,
                    strChung_TenDanhMuc_Id: bangId,
                    strMoTa: v.strMoTa,
                    dThuTu: 0,
                    dTrangThai: 1,
                    strNgayThucHien: ''
                };
            },
            remove: function (ids) {
                return {
                    action: 'CMS_DanhMuc_MH/GS4gFSk0LiIVKC8pBSAvKQw0IgPP',
                    func: 'pkg_chung_danhmuc.XoaThuocTinhDanhMuc',
                    strId: ids.join(',') + ',',
                    strNguoiThucHien_Id: ''
                };
            }
        });
        return crud;
    }
})();
