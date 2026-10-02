/* =========================================================================
   Khai báo hệ thống hoá đơn
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/hethonghoadon.js
   ---------------------------------------------------------------------------
   Lời gọi giữ nguyên bản gốc (API kiểu cũ, không mã hoá):
       TC_HoaDon/LayDanhSach   GET   phân trang ở máy chủ
       TC_HoaDon/ThemMoi       POST
       TC_HoaDon/CapNhat       POST  khi có strId
       TC_HoaDon/Xoa           POST  strId
   Lưu ý tên tham số `strMauso` viết thường chữ "s" — đúng như bản gốc.
   ========================================================================= */
(function () {
    'use strict';

    var MAUIN = { dm: 'TAICHINH.MAUIN' };

    ums.crud({
        root: document.getElementById('hethonghoadon'),
        title: 'Khai báo hệ thống hoá đơn',
        formTitle: 'hệ thống hoá đơn',
        icon: 'fa-file-invoice',

        /* HAI CỘT như bản gốc (col-sm-3 danh sách | col-sm-9 Thông tin chung +
           biểu mẫu). Mục bên trái đúng hai dòng bản gốc vẽ: Mẫu số, Năm áp dụng. */
        master: {
            title: 'Danh sách hóa đơn', icon: 'fa-file-invoice-dollar',
            item: function (r) {
                return '<b>Mẫu số: ' + ums.ui.esc(r.MAUSO || '') + '</b>' +
                    '<span class="ums-master__item__sub">Năm áp dụng: ' + ums.ui.esc(r.NAMAPDUNG || '') + '</span>';
            }
        },

        filters: [
            { key: 'q', type: 'text', label: 'Nhập mẫu số, ký hiệu…' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'TC_HoaDon/LayDanhSach',
                    method: 'GET',
                    versionAPI: 'v1.0',
                    strTuKhoa: f.q,
                    strLoaiHoaDon_Id: '',
                    strNguoiThucHien_Id: ''
                };
            }
        },

        columns: [
            { title: 'Mẫu số', prop: 'MAUSO', cls: 'is-nowrap' },
            { title: 'Ký hiệu', prop: 'KYHIEU', cls: 'is-nowrap' },
            { title: 'Năm áp dụng', prop: 'NAMAPDUNG', cls: 'is-center' },
            { title: 'Loại mẫu', prop: 'MAUIN_ID', lookup: MAUIN },
            { title: 'Mã số thuế', prop: 'SUPPLIERTAXCODE', cls: 'is-nowrap' },
            { title: 'Độ dài', prop: 'DODAIHOADON', cls: 'is-right' },
            { title: 'Số khởi tạo', prop: 'SOKHOITAOBANDAU', cls: 'is-right' }
        ],

        fields: [
            { key: 'strMauso', col: 'MAUSO', label: 'Mẫu số', required: true },
            { key: 'strKyHieu', col: 'KYHIEU', label: 'Ký hiệu' },
            { key: 'strSupplierTaxCode', col: 'SUPPLIERTAXCODE', label: 'Mã số thuế đơn vị' },
            { key: 'strMauIn_Id', col: 'MAUIN_ID', label: 'Loại mẫu hoá đơn', type: 'select', source: MAUIN },
            { key: 'dDoDaiHoaDon', col: 'DODAIHOADON', label: 'Độ dài hoá đơn', type: 'number' },
            { key: 'strNamApDung', col: 'NAMAPDUNG', label: 'Năm', type: 'number' },
            { key: 'dSoKhoiTaoBanDau', col: 'SOKHOITAOBANDAU', label: 'Số khởi tạo', type: 'number' },
            { key: 'strSoDienThoai', col: 'SODIENTHOAI', label: 'Số điện thoại' },
            { key: 'strDiaChi', col: 'DIACHI', label: 'Địa chỉ', span: true }
        ],

        save: function (v, row) {
            v.action = row ? 'TC_HoaDon/CapNhat' : 'TC_HoaDon/ThemMoi';
            v.versionAPI = 'v1.0';
            v.strId = row ? row.ID : '';
            return v;
        },

        remove: function (ids) {
            return ids.map(function (id) {
                return { action: 'TC_HoaDon/Xoa', versionAPI: 'v1.0', strId: id };
            });
        }
    });
})();
