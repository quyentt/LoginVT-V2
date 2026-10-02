/* =========================================================================
   Khai báo hệ thống biên lai
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/hethongbienlai.js
   ---------------------------------------------------------------------------
   Lời gọi giữ nguyên bản gốc (API kiểu cũ, không mã hoá):
       TC_BienLai/LayDanhSach   GET   phân trang ở máy chủ
       TC_BienLai/ThemMoi       POST
       TC_BienLai/CapNhat       POST  khi có strId
       TC_BienLai/Xoa           POST  strId
   Bản gốc gửi strGhiChu lấy từ ô 'txtAAAA' không tồn tại, tức luôn rỗng —
   giữ nguyên là chuỗi rỗng.
   ========================================================================= */
(function () {
    'use strict';

    var MAUIN = { dm: 'TAICHINH.MAUIN' };

    ums.crud({
        root: document.getElementById('hethongbienlai'),
        title: 'Khai báo hệ thống biên lai',
        formTitle: 'hệ thống biên lai',
        icon: 'fa-receipt',

        /* HAI CỘT như bản gốc (col-sm-3 danh sách | col-sm-9 Thông tin chung +
           biểu mẫu). Mục bên trái đúng hai dòng bản gốc vẽ: Mẫu số, Năm áp dụng. */
        master: {
            title: 'Danh sách biên lai', icon: 'fa-file-invoice',
            item: function (r) {
                return '<b>Mẫu số: ' + ums.ui.esc(r.MAUSO || '') + '</b>' +
                    '<span class="ums-master__item__sub">Năm áp dụng: ' + ums.ui.esc(r.NAM || '') + '</span>';
            }
        },

        filters: [
            { key: 'q', type: 'text', label: 'Nhập mẫu số, ký hiệu quyển…' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'TC_BienLai/LayDanhSach',
                    method: 'GET',
                    versionAPI: 'v1.0',
                    strTuKhoa: f.q,
                    strNguoiThucHien_Id: ''
                };
            }
        },

        columns: [
            { title: 'Mẫu số', prop: 'MAUSO', cls: 'is-nowrap' },
            { title: 'Ký hiệu quyển', prop: 'KYHIEUQUYEN', cls: 'is-nowrap' },
            { title: 'Năm', prop: 'NAM', cls: 'is-center' },
            { title: 'Loại mẫu', prop: 'MAUIN_ID', lookup: MAUIN },
            { title: 'Số phiếu/quyển', prop: 'SOBIENLAITRONGQUYEN', cls: 'is-right' },
            { title: 'Độ dài quyển', prop: 'DODAIQUYEN', cls: 'is-right' },
            { title: 'Độ dài biên lai', prop: 'DODAIBIENLAI', cls: 'is-right' },
            { title: 'Số khởi tạo', prop: 'SOKHOITAOBANDAU', cls: 'is-right' }
        ],

        fields: [
            { key: 'strMauSo', col: 'MAUSO', label: 'Mẫu số', required: true },
            { key: 'strKyHieuQuyen', col: 'KYHIEUQUYEN', label: 'Ký hiệu' },
            { key: 'strMauIn_Id', col: 'MAUIN_ID', label: 'Loại mẫu biên lai', type: 'select', source: MAUIN },
            { key: 'strNam', col: 'NAM', label: 'Năm', type: 'number' },
            { key: 'dSoBienLaiTrongQuyen', col: 'SOBIENLAITRONGQUYEN', label: 'Số phiếu/quyển', type: 'number' },
            { key: 'dDoDaiQuyen', col: 'DODAIQUYEN', label: 'Độ dài quyển', type: 'number' },
            { key: 'dDoDaiBienLai', col: 'DODAIBIENLAI', label: 'Độ dài biên lai', type: 'number' },
            { key: 'dSoKhoiTaoBanDau', col: 'SOKHOITAOBANDAU', label: 'Số khởi tạo', type: 'number' },
            { key: 'strSoDienThoai', col: 'SODIENTHOAI', label: 'Số điện thoại' },
            { key: 'strDiaChi', col: 'DIACHI', label: 'Địa chỉ' }
        ],

        save: function (v, row) {
            v.action = row ? 'TC_BienLai/CapNhat' : 'TC_BienLai/ThemMoi';
            v.versionAPI = 'v1.0';
            v.strId = row ? row.ID : '';
            v.strGhiChu = '';
            return v;
        },

        remove: function (ids) {
            return ids.map(function (id) {
                return { action: 'TC_BienLai/Xoa', versionAPI: 'v1.0', strId: id };
            });
        }
    });
})();
