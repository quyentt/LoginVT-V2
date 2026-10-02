/* =========================================================================
   Khai báo ký hiệu chương trình (ký hiệu theo khoá × chương trình)
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/kyhieuchuongtrinh.js
   ---------------------------------------------------------------------------
   Kiểu procedure, có mã hoá:
       pkg_taichinh_ketoan.LayDSTC_BC_KyHieu_Khoa_Nganh   danh sách
       pkg_taichinh_ketoan.Them_TC_BC_KyHieu_Khoa_Nganh   thêm
       pkg_taichinh_ketoan.Sua_TC_BC_KyHieu_Khoa_Nganh    sửa (khi có strId)
       pkg_taichinh_ketoan.Xoa_TC_BC_KyHieu_Khoa_Nganh    xoá từng dòng
   Ô Hệ / Khoá / Chương trình (lọc và biểu mẫu):
       Bản gốc gọi edu.extend.genBoLoc_HeKhoa("_SR") và ("_Add")
       (Core/systemextend.js:6713) — hàm này CÓ nạp dữ liệu, bằng các
       procedure lọc theo quyền (…HeDaoTaoQuyen, …KhoaDaoTaoQuyen,
       …ToChucCTQuyen). Ở đây dùng ums.dmhsB.cascadeQuyen chép đúng các
       lời gọi đó; ums.ref.cascade gọi bản không lọc quyền nên không dùng.

   Giữ như bản gốc (nghi ngờ, ghi chú lại):
     · Chọn Hệ/Khoá/CT ở ô lọc thì ô tương ứng trong biểu mẫu đi theo.
     · Khi SỬA, Khoá/CT chỉ hiện dạng chữ; nhưng lời gọi Sua_… vẫn gửi
       strDaoTao_KhoaDaoTao_Id / strDaoTao_ChuongTrinh_Id lấy từ ô chọn
       (đang ẩn) của biểu mẫu — tức giá trị đang lọc. Bản gốc cũng vậy.
   Cố ý bỏ:
     · Ô "Nhập từ khoá": bản gốc có ô nhưng KHÔNG gửi strTuKhoa trong lời
       gọi danh sách — ô không có tác dụng.
     · getList_ThoiGianDaoTao: mã chết (không được gọi).
   ========================================================================= */
(function () {
    'use strict';

    var B = ums.dmhsB;
    var root = document.getElementById('kyhieuchuongtrinh');
    var cas = null;          // nối tầng của ô lọc
    var casForm = null;      // nối tầng của biểu mẫu

    function ctTen(r) { return B.e(r.DAOTAO_CHUONGTRINH_TEN) + ' - ' + B.e(r.DAOTAO_CHUONGTRINH_MA); }

    var main = ums.crud({
        root: root,
        title: 'Khai báo ký hiệu chương trình',
        formTitle: 'ký hiệu chương trình',
        icon: 'fa-hashtag',

        filters: [
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Chọn chương trình đào tạo' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            call: function (f) {
                // Tham số chép nguyên bản gốc — procedure KHÔNG nhận từ khoá
                return {
                    action: 'TC_KeToan_MH/DSA4BRIVAh4DAh4KOAkoJDQeCikuIB4PJiAvKQPP',
                    func: 'pkg_taichinh_ketoan.LayDSTC_BC_KyHieu_Khoa_Nganh',
                    strDaoTao_KhoaDaoTao_Id: f.khoa,
                    strDaoTao_ChuongTrinh_Id: f.ct,
                    strNguoiThucHien_Id: ''
                };
            },
            /* Ô "Nhập từ khóa tìm kiếm" CÓ trong bản gốc (txtSearch_TuKhoa) và
               bấm Tìm là gọi lại danh sách — nhưng getList_KyHieuChuongTrinh
               không gửi từ khoá lên, nên gõ gì cũng ra y nguyên. Ở đây giữ ô
               như bản gốc và lọc trên danh sách đã tải (ums.pat.loc): không
               đụng chữ ký procedure mà ô vẫn có tác dụng. */
            rows: function (d) {
                var rows = Array.isArray(d) ? d : (d && d.rs) || [];
                var q = main ? (main.filterValues().q || '') : '';
                return ums.pat.loc(rows, q, ['DAOTAO_KHOADAOTAO_MAKHOA', 'DAOTAO_CHUONGTRINH_TEN',
                    'DAOTAO_CHUONGTRINH_MA', 'KYHIEU']);
            }
        },

        columns: [
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_MAKHOA', cls: 'is-center is-nowrap', width: '140px' },
            { title: 'Chương trình', render: function (r) { return ums.ui.esc(ctTen(r)); } },
            { title: 'Ký hiệu', prop: 'KYHIEU', cls: 'is-center is-nowrap', width: '160px' }
        ],

        formCols: 1,
        fields: [
            { key: '_he', label: 'Hệ đào tạo', type: 'select' },
            { key: 'strDaoTao_KhoaDaoTao_Id', label: 'Khóa đào tạo', type: 'select' },
            { key: 'strDaoTao_ChuongTrinh_Id', label: 'Chương trình', type: 'select' },
            { key: '_khoaTxt', label: 'Khóa đào tạo', type: 'static', get: function (r) { return B.e(r.DAOTAO_KHOADAOTAO_MAKHOA); } },
            { key: '_ctTxt', label: 'Chương trình', type: 'static', get: ctTen },
            { key: 'strKyHieu', col: 'KYHIEU', label: 'Ký hiệu' }
        ],

        onForm: function (row) {
            // Thêm: hiện ô chọn, ẩn chữ; Sửa: ngược lại (zoneOpenNew / btnOpenDelete)
            ['_he', 'strDaoTao_KhoaDaoTao_Id', 'strDaoTao_ChuongTrinh_Id'].forEach(function (k) { wrap(k).hidden = !!row; });
            ['_khoaTxt', '_ctTxt'].forEach(function (k) { wrap(k).hidden = !row; });
            // Biểu mẫu đi theo ô lọc (bản gốc: select2:select trên _SR đặt giá trị _Add)
            if (casForm && cas) casForm.set(cas.values());
        },

        save: function (v, row) {
            var o = {
                action: 'TC_KeToan_MH/FSkkLB4VAh4DAh4KOAkoJDQeCikuIB4PJiAvKQPP',
                func: 'pkg_taichinh_ketoan.Them_TC_BC_KyHieu_Khoa_Nganh',
                strId: row ? row.ID : '',
                strDaoTao_KhoaDaoTao_Id: v.strDaoTao_KhoaDaoTao_Id,
                strDaoTao_ChuongTrinh_Id: v.strDaoTao_ChuongTrinh_Id,
                strKyHieu: v.strKyHieu,
                strNguoiThucHien_Id: ''
            };
            if (o.strId) {
                o.action = 'TC_KeToan_MH/EjQgHhUCHgMCHgo4CSgkNB4KKS4gHg8mIC8p';
                o.func = 'pkg_taichinh_ketoan.Sua_TC_BC_KyHieu_Khoa_Nganh';
            }
            return o;
        },

        remove: function (ids) {
            return ids.map(function (id) {
                return {
                    action: 'TC_KeToan_MH/GS4gHhUCHgMCHgo4CSgkNB4KKS4gHg8mIC8p',
                    func: 'pkg_taichinh_ketoan.Xoa_TC_BC_KyHieu_Khoa_Nganh',
                    strId: id,
                    strNguoiThucHien_Id: ''
                };
            });
        }
    });

    function el(scope, k) { return root.querySelector('[data-cf="' + main.uid + '"][data-scope="' + scope + '"][data-k="' + k + '"]'); }
    function wrap(k) { var x = el('form', k); return x.closest('.ums-field').parentNode; }

    var started = false;     // lần nạp Hệ đầu tiên không cần tải lại danh sách
    cas = B.cascadeQuyen({
        he: el('filter', 'he'), khoa: el('filter', 'khoa'), ct: el('filter', 'ct'),
        onChange: function () { if (started) main.load(1); started = true; }
    });
    casForm = B.cascadeQuyen({
        he: el('form', '_he'), khoa: el('form', 'strDaoTao_KhoaDaoTao_Id'), ct: el('form', 'strDaoTao_ChuongTrinh_Id')
    });
})();
