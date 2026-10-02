/* =========================================================================
   Khai báo hệ thống phiếu thu
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/hethongphieuthu.js
   ---------------------------------------------------------------------------
   Lời gọi giữ nguyên bản gốc (API kiểu cũ, không mã hoá):
       TC_PhieuThu/LayDanhSach   GET   phân trang ở máy chủ
       TC_PhieuThu/ThemMoi       POST
       TC_PhieuThu/CapNhat       POST  khi có strId
       TC_PhieuThu/Xoa           POST  strId
   Bản gốc gửi strGhiChu lấy từ ô 'txtAAAA' không tồn tại, tức luôn rỗng —
   giữ nguyên là chuỗi rỗng.
   ========================================================================= */
(function () {
    'use strict';

    var MAUIN = { dm: 'TAICHINH.MAUIN' };

    ums.crud({
        root: document.getElementById('hethongphieuthu'),
        title: 'Khai báo hệ thống phiếu thu',
        formTitle: 'hệ thống phiếu thu',
        icon: 'fa-file-lines',

        /* HAI CỘT như bản gốc (col-sm-3 danh sách | col-sm-9 Thông tin chung +
           biểu mẫu). Mục bên trái đúng hai dòng bản gốc vẽ: Mẫu số, Năm áp dụng. */
        master: {
            title: 'Danh sách phiếu thu', icon: 'fa-receipt',
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
                    action: 'TC_PhieuThu/LayDanhSach',
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
            { title: 'Số phiếu/quyển', prop: 'SOPHIEUTHUTRONGQUYEN', cls: 'is-right' },
            { title: 'Độ dài quyển', prop: 'DODAIQUYEN', cls: 'is-right' },
            { title: 'Độ dài phiếu thu', prop: 'DODAIPHIEUTHU', cls: 'is-right' },
            { title: 'Số khởi tạo', prop: 'SOKHOITAOBANDAU', cls: 'is-right' }
        ],

        fields: [
            { key: 'strMauSo', col: 'MAUSO', label: 'Mẫu số', required: true },
            { key: 'strKyHieuQuyen', col: 'KYHIEUQUYEN', label: 'Ký hiệu' },
            { key: 'strMauIn_Id', col: 'MAUIN_ID', label: 'Loại mẫu phiếu thu', type: 'select', source: MAUIN },
            { key: 'strNam', col: 'NAM', label: 'Năm', type: 'number' },
            { key: 'dSoPhieuThuTrongQuyen', col: 'SOPHIEUTHUTRONGQUYEN', label: 'Số phiếu/quyển', type: 'number' },
            { key: 'dDoDaiQuyen', col: 'DODAIQUYEN', label: 'Độ dài quyển', type: 'number' },
            { key: 'dDoDaiPhieuThu', col: 'DODAIPHIEUTHU', label: 'Độ dài phiếu thu', type: 'number' },
            { key: 'dSoKhoiTaoBanDau', col: 'SOKHOITAOBANDAU', label: 'Số khởi tạo', type: 'number' },
            { key: 'strSoDienThoai', col: 'SODIENTHOAI', label: 'Số điện thoại' },
            { key: 'strDiaChi', col: 'DIACHI', label: 'Địa chỉ' }
        ],

        save: function (v, row) {
            v.action = row ? 'TC_PhieuThu/CapNhat' : 'TC_PhieuThu/ThemMoi';
            v.versionAPI = 'v1.0';
            v.strId = row ? row.ID : '';
            v.strGhiChu = '';
            return v;
        },

        remove: function (ids) {
            return ids.map(function (id) {
                return { action: 'TC_PhieuThu/Xoa', versionAPI: 'v1.0', strId: id };
            });
        }
    });
})();
