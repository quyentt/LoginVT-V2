/* =========================================================================
   Các môn học đã giảng dạy — hồ sơ cá nhân
   Bản gốc: ApisCongCanBo/Modules/quatrinhcongtac/script/cacmonhocdagiangday.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QT_MonHoc/LayDanhSach  GET  strNhanSu_HoSoCanBo_Id
       NS_QT_MonHoc/LayChiTiet   GET  strId
       NS_QT_MonHoc/ThemMoi | CapNhat, Xoa (strIds)
   Danh mục: KHCT.BACDAOTAO (bậc), NS.DMNN (ngôn ngữ), cơ cấu tổ chức
   (đơn vị giảng dạy). Không có tệp đính kèm; lời gọi
   ThietLapQuaTrinhCuoiCung đã bị chú thích bỏ ở bản gốc — không gọi.
   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/quatrinhcongtac/cacmonhocdagiangday (cán bộ nhân sự chọn
   một người): ums.ccbHS.cacmonhocdagiangday(P) trả cấu hình ums.crud. P = { hs() → id hồ sơ
   cán bộ, nth() → id người thực hiện, ns: true ở bản Nhân sự }; mặc định
   (Cổng cán bộ) cả hai là người đăng nhập.
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'NS_QT_MonHoc';
    var CCTC = { call: {
        action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
        dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: ''
    }, name: 'TEN' };

    function cauHinh(P) {
    return {
        title: 'Các môn học đã giảng dạy',
        listTitle: 'Các môn học đã giảng dạy',
        formTitle: 'môn học đã giảng dạy',
        icon: 'fa-chalkboard-user',
        saveAgain: 'Lưu và nhập tiếp',

        list: { call: function () { return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() }; } },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        columns: [
            { title: 'Môn học', prop: 'TENMON' },
            { title: 'Bậc học', prop: 'BACDAOTAO_TEN' },
            { title: 'Đơn vị giảng dạy', prop: 'DONVIGIANGDAY_TEN' },
            { title: 'Năm bắt đầu giảng dạy', prop: 'THOIGIANBATDAU', cls: 'is-center' }
        ],

        fields: [
            { key: '_ttc', type: 'legend', label: 'Thông tin chung' },
            { key: 'strTenMon', col: 'TENMON', label: 'Tên môn học', required: true },
            { key: 'strMaMon', col: 'MAMON', label: 'Mã môn học', required: true },
            { key: 'strBacDaoTao_Id', col: 'BACDAOTAO_ID', label: 'Bậc đào tạo', type: 'select', source: { dm: 'KHCT.BACDAOTAO' } },
            { key: 'dSoTC', col: 'SOTC', label: 'Số tín chỉ/Số tiết' },
            { key: 'strDonViGiangDay_Id', col: 'DONVIGIANGDAY_ID', label: 'Đơn vị giảng dạy', type: 'select', source: CCTC },
            { key: 'strDonViGiangDay_Khac', col: 'DONVIGIANGDAY_KHAC', label: 'Đơn vị khác' },
            { key: 'strThoiGianBatDau', col: 'THOIGIANBATDAU', label: 'Năm bắt đầu giảng dạy' },
            { key: 'strNgonNgu_Id', col: 'NGONNGU_ID', label: 'Ngôn ngữ giảng dạy', type: 'select', source: { dm: 'NS.DMNN' } }
        ],

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strTenMon: v.strTenMon,
                strMaMon: v.strMaMon,
                dSoTC: v.dSoTC,
                strBacDaoTao_Id: v.strBacDaoTao_Id,
                strDonViGiangDay_Id: v.strDonViGiangDay_Id,
                strDonViGiangDay_Khac: v.strDonViGiangDay_Khac,
                strThoiGianBatDau: v.strThoiGianBatDau,
                strNgonNgu_Id: v.strNgonNgu_Id,
                strNguoiThucHien_Id: P.nth()
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; }); }
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).cacmonhocdagiangday = cauHinh;
    var root = document.getElementById('cacmonhocdagiangday');
    if (root) ums.crud(Object.assign({ root: root }, cauHinh({ hs: uid, nth: uid })));
})();
