/* =========================================================================
   Khai báo tài khoản Nợ / tài khoản Có theo khoản thu × hình thức × đối tác
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/taikhoanno.js
   ---------------------------------------------------------------------------
   Kiểu procedure, có mã hoá (ums.api tự thêm iM khi có func):
       pkg_taichinh_ketoan.LayDSAPI_KeToan_Khoan_HT    danh sách
       pkg_taichinh_ketoan.Them_API_KeToan_Khoan_HT    thêm
       pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT     sửa (có strId)
       pkg_taichinh_ketoan.Xoa_API_KeToan_Khoan_HT     xoá từng dòng
   Nguồn ô chọn:
       pkg_taichinh_thuchi.LayDSCacKhoanThu            khoản thu
       pkg_taichinh_ketoan.LayDMucAPI_DoiTac           đối tác (TENDOITAC)
       danh mục QLTC.HTTHU                             hình thức thu
   ========================================================================= */
(function () {
    'use strict';

    var KHOANTHU = {
        call: {
            action: 'TC_ThuChi_MH/DSA4BRICICIKKS4gLxUpNAPP',
            func: 'pkg_taichinh_thuchi.LayDSCacKhoanThu',
            strTuKhoa: '',
            strNhomCacKhoanThu_Id: '',
            strcanboquanly_id: '',
            pageIndex: 1,
            pageSize: 10000
        },
        name: function (r) { return (r.TEN || '') + (r.MA ? ' - ' + r.MA : ''); }
    };

    var DOITAC = {
        call: {
            action: 'TC_KeToan_MH/DSA4BQw0IgARCB4FLigVICIP',
            func: 'pkg_taichinh_ketoan.LayDMucAPI_DoiTac'
        },
        name: 'TENDOITAC'
    };

    var HINHTHUC = { dm: 'QLTC.HTTHU' };

    function pair(ten, ma) { return ums.ui.esc((ten || '') + (ma ? ' - ' + ma : '')); }

    var main = ums.crud({
        root: document.getElementById('taikhoanno'),
        title: 'Khai báo tài khoản Nợ, tài khoản Có',
        formTitle: 'tài khoản Nợ / tài khoản Có',
        icon: 'fa-scale-balanced',

        filters: [
            { key: 'khoanThu', type: 'select', label: 'Chọn khoản thu', source: KHOANTHU },
            { key: 'doiTac', type: 'select', label: 'Chọn đối tác', source: DOITAC },
            { key: 'hinhThuc', type: 'select', label: 'Chọn hình thức thu', source: HINHTHUC },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            call: function (f) {
                return {
                    action: 'TC_KeToan_MH/DSA4BRIAEQgeCiQVLiAvHgopLiAvHgkV',
                    func: 'pkg_taichinh_ketoan.LayDSAPI_KeToan_Khoan_HT',
                    strTaiChinh_CacKhoanThu_Id: f.khoanThu,
                    strAPI_DoiTac_Id: f.doiTac,
                    strHinhThucThu_Id: f.hinhThuc
                };
            },
            /* Ô "Nhập từ khóa tìm kiếm" CÓ trong bản gốc và bấm Tìm là gọi lại
               getList_TaiKhoanNo, nhưng lời gọi đó không có tham số từ khoá nào
               → gõ gì cũng ra y nguyên. Giữ ô như bản gốc, lọc trên danh sách
               đã tải (ums.pat.loc) thay vì đổi chữ ký procedure. */
            rows: function (d) {
                var rows = Array.isArray(d) ? d : (d && d.rs) || [];
                var q = main ? (main.filterValues().q || '') : '';
                return ums.pat.loc(rows, q, ['TAICHINH_CACKHOANTHU_TEN', 'TAICHINH_CACKHOANTHU_MA',
                    'HINHTHUCTHU_TEN', 'HINHTHUCTHU_MA', 'API_DOITAC_TEN',
                    'KETOAN_TAIKHOANNO', 'KETOAN_TAIKHOANCO']);
            }
        },

        columns: [
            { title: 'Khoản thu', render: function (r) { return pair(r.TAICHINH_CACKHOANTHU_TEN, r.TAICHINH_CACKHOANTHU_MA); } },
            { title: 'Hình thức', render: function (r) { return pair(r.HINHTHUCTHU_TEN, r.HINHTHUCTHU_MA); } },
            { title: 'Đối tác', prop: 'API_DOITAC_TEN' },
            { title: 'TK Nợ', prop: 'KETOAN_TAIKHOANNO', cls: 'is-center is-nowrap' },
            { title: 'TK Có', prop: 'KETOAN_TAIKHOANCO', cls: 'is-center is-nowrap' }
        ],

        fields: [
            { key: 'strTaiChinh_CacKhoanThu_Id', col: 'TAICHINH_CACKHOANTHU_ID', label: 'Khoản thu', type: 'select', source: KHOANTHU, required: true, span: true },
            { key: 'strHinhThucThu_Id', col: 'HINHTHUCTHU_ID', label: 'Hình thức thu', type: 'select', source: HINHTHUC },
            { key: 'strAPI_DoiTac_Id', col: 'API_DOITAC_ID', label: 'Đối tác', type: 'select', source: DOITAC },
            { key: 'strKeToan_TKNo', col: 'KETOAN_TAIKHOANNO', label: 'Tài khoản Nợ' },
            { key: 'strKeToan_TKCo', col: 'KETOAN_TAIKHOANCO', label: 'Tài khoản Có' }
        ],

        save: function (v, row) {
            v.action = 'TC_KeToan_MH/FSkkLB4AEQgeCiQVLiAvHgopLiAvHgkV';
            v.func = 'pkg_taichinh_ketoan.Them_API_KeToan_Khoan_HT';
            v.strId = row ? row.ID : '';
            /* Sửa đổi sang Sua_… như gốc (save_TaiKhoanNo) — gửi Them_ kèm strId thì máy chủ
               trả thành công mà không đổi gì (kiểm trên host 2026-09-25). */
            if (v.strId) {
                v.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
                v.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT';
            }
            return v;
        },

        remove: function (ids) {
            return ids.map(function (id) {
                return {
                    action: 'TC_KeToan_MH/GS4gHgARCB4KJBUuIC8eCikuIC8eCRUP',
                    func: 'pkg_taichinh_ketoan.Xoa_API_KeToan_Khoan_HT',
                    strId: id
                };
            });
        }
    });
})();
