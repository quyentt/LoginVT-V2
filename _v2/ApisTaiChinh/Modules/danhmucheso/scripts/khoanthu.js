/* =========================================================================
   Khai báo các khoản thu
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/khoanthu.js
   ---------------------------------------------------------------------------
   Khoản thu — trộn hai kiểu API như bản gốc:
       TC_KhoanThu/LayDanhSach                       GET, phân trang máy chủ
       TC_KhoanThu/LayChiTiet                        GET, trước khi sửa
       pkg_taichinh_thuchi.Them_TaiChinh_CacKhoanThu thêm
       pkg_taichinh_thuchi.Sua_TaiChinh_CacKhoanThu  sửa
       TC_KhoanThu/Xoa                               POST, strIds "id1,id2," (một lời gọi)

   Kế hoạch xuất hoá đơn của một khoản thu:
       pkg_taichinh_kehoach.LayDSTC_KhoanThu_QDXuatHD
       pkg_taichinh_kehoach.Them_TC_KhoanThu_QDXuatHD
       pkg_taichinh_ketoan.Sua_TC_KhoanThu_QDXuatHD   ← khác gói, đúng như bản gốc
       pkg_taichinh_kehoach.Xoa_TC_KhoanThu_QDXuatHD

   VAT (thêm theo bản gốc 2026-09-22): ô dVAT, cột VAT.

   Ô đánh dấu: đánh dấu gửi 1, bỏ trống gửi chuỗi rỗng — bản gốc gửi
   `undefined`, jQuery mã hoá thành chuỗi rỗng, kết quả như nhau.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var NHOM = { dm: 'QLTC.LOKT' };
    var DVT = { dm: 'TAICHINH.DVT' };

    var elMain = document.getElementById('khoanthu');
    var elHD = document.getElementById('khoanthuHD');

    var main = ums.crud({
        root: elMain,
        title: 'Khai báo các khoản thu',
        formTitle: 'khoản thu',
        icon: 'fa-coins',

        filters: [
            { key: 'nhom', type: 'select', label: 'Chọn nhóm khoản thu', source: NHOM },
            { key: 'q', type: 'text', label: 'Nhập mã hoặc tên khoản thu' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'TC_KhoanThu/LayDanhSach',
                    method: 'GET',
                    versionAPI: 'v1.0',
                    strTuKhoa: f.q,
                    iTinhTrang: -1,
                    strNhomCacKhoanThu_Id: f.nhom,
                    strNguoiThucHien_Id: '',
                    strcanboquanly_id: ''
                };
            }
        },

        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên khoản', render: function (r) { return ui.cell(r.TEN, r.MOTA); } },
            { title: 'Nhóm khoản', prop: 'NHOMCACKHOANTHU_TEN' },
            { title: 'VAT', prop: 'VAT', cls: 'is-center' },
            { title: 'Thứ tự', prop: 'THUTU', cls: 'is-center' },
            { title: 'Ưu tiên gạch nợ', prop: 'THUTUUUTIENGACHNO', cls: 'is-center' },
            { title: 'Ngày tạo', cls: 'is-nowrap', render: function (r) { return ui.cell(r.NGAYTAO_DD_MM_YYYY_HHMMSS, r.TAIKHOAN_TENDAYDU); } }
        ],

        rowActions: [
            { icon: 'fa-file-invoice', title: 'Kế hoạch xuất hoá đơn', onClick: function (row) { openHD(row); } }
        ],

        detail: function (row) {
            return { action: 'TC_KhoanThu/LayChiTiet', method: 'GET', versionAPI: 'v1.0', strId: row.ID };
        },

        fields: [
            { type: 'legend', label: 'Thông tin chung' },
            { key: 'strMa', col: 'MA', label: 'Mã khoản thu', required: true },
            { key: 'strTen', col: 'TEN', label: 'Tên khoản thu', required: true },
            { key: 'strNhomCacKhoanThu_Id', col: 'NHOMCACKHOANTHU_ID', label: 'Nhóm khoản thu', type: 'select', source: NHOM },
            { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị tính', type: 'select', source: DVT },
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự hiển thị', type: 'number' },
            { key: 'dThutuUuTienGachNo', col: 'THUTUUUTIENGACHNO', label: 'Thứ tự ưu tiên gạch nợ', type: 'number' },
            { key: 'strMaThanhToanDinhDanh', col: 'MATHANHTOANDINHDANH', label: 'Mã định danh dùng cho thanh toán định danh', span: true },
            { key: 'dVAT', col: 'VAT', label: 'VAT', type: 'number' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true },
            { type: 'legend', label: 'Quy tắc' },
            {
                type: 'checks', span: true,
                items: [
                    { key: 'dKhoanThuRieng', col: 'KHOANTHURIENG', label: 'Là khoản riêng' },
                    { key: 'dTinhPhiTuDong', col: 'TINHPHITUDONG', label: 'Tính phí tự động' },
                    { key: 'dTinhPhiTuDongLopRieng', col: 'TINHPHITUDONGLOPRIENG', label: 'Khoản tính tự động lớp riêng' },
                    { key: 'dKhoanNopTruoc', col: 'KHOANNOPTRUOC', label: 'Cho phép nộp trước ở cổng thanh toán' },
                    { key: 'dXuatHoaDonTuDong', col: 'XUATHOADONTUDONG', label: 'Khoản xuất hoá đơn tự động' },
                    { key: 'dKhongXuatHoaDon', col: 'KHONGXUATHOADON', label: 'Khoản không xuất hoá đơn' },
                    { key: 'dKiemTraNoKhiXetHB', col: 'KIEMTRANOKHIXETHOCBONG', label: 'Kiểm tra nợ khi xét học bổng' },
                    { key: 'dKiemTraNoKhiXetHV', col: 'KIEMTRANOKHIXETHOCVU', label: 'Kiểm tra nợ khi xét học vụ' },
                    { key: 'dKiemTraNoKhiXetTN', col: 'KIEMTRANOKHIXETTOTNGHIEP', label: 'Kiểm tra nợ khi xét tốt nghiệp' },
                    { key: 'dKiemTraNoKhiDangKyHoc', col: 'KIEMTRANOKHIDANGKYHOC', label: 'Kiểm tra nợ khi đăng ký học' }
                ]
            }
        ],

        save: function (v, row) {
            v.strId = row ? row.ID : '';
            if (row) {
                v.action = 'TC_ThuChi_MH/EjQgHhUgKAIpKC8pHgIgIgopLiAvFSk0';
                v.func = 'pkg_taichinh_thuchi.Sua_TaiChinh_CacKhoanThu';
            } else {
                v.action = 'TC_ThuChi_MH/FSkkLB4VICgCKSgvKR4CICIKKS4gLxUpNAPP';
                v.func = 'pkg_taichinh_thuchi.Them_TaiChinh_CacKhoanThu';
            }
            return v;
        },

        // Bản gốc xoá nhiều dòng trong MỘT lời gọi, danh sách id nối bằng dấu
        // phẩy và có dấu phẩy thừa ở cuối (edu.util.findCheckedIds).
        remove: function (ids) {
            return {
                action: 'TC_KhoanThu/Xoa',
                versionAPI: 'v1.0',
                strIds: ids.join(',') + ',',
                strNguoiTao_Id: (ums.session && ums.session.userId) || ''
            };
        }
    });

    /* ---------- Kế hoạch xuất hoá đơn của một khoản thu ----------------- */
    function openHD(khoan) {
        elHD.innerHTML = '';
        ui.swap(elMain, elHD);

        ums.crud({
            root: elHD,
            embedded: true,
            title: 'Kế hoạch xuất hoá đơn — ' + (khoan.TEN || '') + (khoan.MA ? ' (' + khoan.MA + ')' : ''),
            formTitle: 'kế hoạch xuất hoá đơn',
            icon: 'fa-file-invoice',
            back: function () { ui.swap(elHD, elMain); main.load(); },

            list: {
                call: function () {
                    return {
                        action: 'TC_KeHoach_MH/DSA4BRIVAh4KKS4gLxUpNB4QBRk0IDUJBQPP',
                        func: 'pkg_taichinh_kehoach.LayDSTC_KhoanThu_QDXuatHD',
                        strTaiChinh_CacKhoanThu_Id: khoan.ID
                    };
                }
            },

            columns: [
                { title: 'Năm', prop: 'NAM', cls: 'is-center', width: '120px' },
                { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center' },
                { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center' }
            ],

            formCols: 3,
            fields: [
                { key: 'dNam', col: 'NAM', label: 'Năm', type: 'number', required: true },
                { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Ngày bắt đầu', type: 'date', required: true },
                { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Ngày kết thúc', type: 'date', required: true }
            ],

            save: function (v, row) {
                v.strId = row ? row.ID : '';
                v.strTaiChinh_CacKhoanThu_Id = khoan.ID;
                if (row) {
                    v.action = 'TC_KeToan_MH/EjQgHhUCHgopLiAvFSk0HhAFGTQgNQkF';
                    v.func = 'pkg_taichinh_ketoan.Sua_TC_KhoanThu_QDXuatHD';
                } else {
                    v.action = 'TC_KeHoach_MH/FSkkLB4VAh4KKS4gLxUpNB4QBRk0IDUJBQPP';
                    v.func = 'pkg_taichinh_kehoach.Them_TC_KhoanThu_QDXuatHD';
                }
                return v;
            },

            remove: function (ids) {
                return ids.map(function (id) {
                    return {
                        action: 'TC_KeHoach_MH/GS4gHhUCHgopLiAvFSk0HhAFGTQgNQkF',
                        func: 'pkg_taichinh_kehoach.Xoa_TC_KhoanThu_QDXuatHD',
                        strId: id
                    };
                });
            }
        });
    }
})();
