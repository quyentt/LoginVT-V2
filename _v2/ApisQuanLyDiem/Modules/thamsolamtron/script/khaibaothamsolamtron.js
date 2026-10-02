/* =========================================================================
   Khai báo tham số làm tròn
   Bản gốc: ApisQuanLyDiem/Modules/thamsolamtron/html/khaibaothamsolamtron.html
            + script/khaibaothamsolamtron.js
   Khung chung: ../../thamsochung/script/_khaibao.js (ums.qldKB).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     D_ThamSoLamTron/LayDanhSach  GET: strTuKhoa, strDaoTao_ThoiGianDaoTao_Id, strLoaiDiemTrungBinh_Id
                                  (hai ô lọc), strNguoiThucHien_Id "", pageIndex/pageSize
     D_ThamSoLamTron/LayChiTiet   GET strId
     D_ThamSoLamTron/ThemMoi | CapNhat  POST: strId, strLoaiDiemTrungBinh_Id, dCoLamTron,
                                  strDaoTao_ThoiGianDaoTao_Id, dSoLeSauDauPhay, strMoTa, strNgayApDung
     D_ThamSoLamTron/Xoa          POST strIds
     KHCT_ThoiGianDaoTao/LayDanhSach GET — ô Thời gian đào tạo
   Danh mục: DIEM.LOAIDIEMTRUNGBINH (lọc + biểu mẫu).
   Cột: LOAIDIEMTRUNGBINH_TEN, thời gian (NAM - KY - DOT), SOLESAUDAUPHAY, NGAYAPDUNG.
   Biểu mẫu đọc: LOAIDIEMTRUNGBINH_ID, DAOTAO_THOIGIANDAOTAO_ID, NGAYAPDUNG, COLAMTRON,
     SOLESAUDAUPHAY, MOTA.
   ========================================================================= */
(function () {
    'use strict';

    var K = ums.qldKB;
    var TG = K.thoiGian();
    var LOAI = { dm: 'DIEM.LOAIDIEMTRUNGBINH' };

    K.man(document.getElementById('qld-khaibaothamsolamtron'), {
        title: 'Khai báo tham số làm tròn',
        listTitle: 'Danh sách tham số làm tròn',
        formTitle: 'thông tin tham số làm tròn',
        ctl: 'D_ThamSoLamTron',

        loc: [
            { key: 'tg', label: 'Chọn thời gian đào tạo', source: TG },
            { key: 'loai', label: 'Chọn loại điểm trung bình', source: LOAI }
        ],
        locThamSo: function (f) {
            return { strDaoTao_ThoiGianDaoTao_Id: f.tg, strLoaiDiemTrungBinh_Id: f.loai };
        },

        columns: [
            { title: 'Loại điểm trung bình', prop: 'LOAIDIEMTRUNGBINH_TEN' },
            K.cotThoiGian(),
            { title: 'Số lẻ sau dấu phẩy', prop: 'SOLESAUDAUPHAY', cls: 'is-center' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],

        fields: [
            { key: 'strLoaiDiemTrungBinh_Id', col: 'LOAIDIEMTRUNGBINH_ID', label: 'Loại điểm trung bình',
                type: 'select', source: LOAI, placeholder: 'Chọn loại điểm trung bình' },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian đào tạo',
                type: 'select', source: TG, placeholder: 'Chọn thời gian đào tạo' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' },
            { key: 'dCoLamTron', col: 'COLAMTRON', label: 'Làm tròn', type: 'select',
                source: K.coKhong(), placeholder: 'Có làm tròn hay không' },
            { key: 'dSoLeSauDauPhay', col: 'SOLESAUDAUPHAY', label: 'Số lẻ sau dấu phẩy', type: 'number' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ],
        tuLoc: { strDaoTao_ThoiGianDaoTao_Id: 'tg', strLoaiDiemTrungBinh_Id: 'loai' },

        luu: function (v) {
            return {
                strLoaiDiemTrungBinh_Id: v.strLoaiDiemTrungBinh_Id,
                dCoLamTron: v.dCoLamTron,
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                dSoLeSauDauPhay: v.dSoLeSauDauPhay,
                strMoTa: v.strMoTa,
                strNgayApDung: v.strNgayApDung
            };
        }
    });
})();
