/* =========================================================================
   Tham số quy đổi thang điểm
   Bản gốc: ApisQuanLyDiem/Modules/thamsoquydoithangdiem/html/thamsoquydoithangdiem.html
            + script/thamsoquydoithangdiem.js
   Khung chung: ../../thamsochung/script/_khaibao.js (ums.qldKB).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     D_QuyDoiThangDiem/LayDanhSach  GET: strTuKhoa, strThangDiemGoc_Id, strThangDiemQuyDoi_Id,
                                    strDiemChu_DiemQuyDoi_Id (ba ô lọc), strNguoiThucHien_Id "",
                                    pageIndex/pageSize
     D_QuyDoiThangDiem/LayChiTiet   GET strId
     D_QuyDoiThangDiem/ThemMoi | CapNhat  POST: strId, strThangDiemGoc_Id, strThangDiemQuyDoi_Id,
                                    dDiemCanDuoi_DiemGoc, dDiemCanTren_DiemGoc, dDiemSo_DiemQuyDoi,
                                    strDiemChu_DiemQuyDoi_Id, iThuTu = ''
     D_QuyDoiThangDiem/Xoa          POST strIds
   Danh mục: DIEM.THANGDIEM (thang gốc + thang quy đổi), DIEM.DIEMCHU (điểm chữ).
   Cột: THANGDIEMGOC_TEN, THANGDIEMQUYDOI_TEN, DIEMCANDUOI_THANGDIEMGOC, DIEMCANTREN_THANGDIEMGOC,
     DIEMSO_THANGDIEMQUYDOI, DIEMCHU_THANGDIEMQUYDOI_TEN.

   Lỗi gốc riêng màn này:
     · "Lưu và Nhập tiếp" khi đang SỬA gọi me.ThamSoQuyDoiThangDiem() — hàm không
       tồn tại → TypeError, không lưu. Nay gọi CapNhat như nút Lưu.
     · Không phải cặp cha → con: thang gốc / thang quy đổi / điểm chữ là ba ô lọc
       độc lập (cùng nạp một lần như gốc).
   ========================================================================= */
(function () {
    'use strict';

    var K = ums.qldKB;
    var THANGDIEM = { dm: 'DIEM.THANGDIEM' };
    var DIEMCHU = { dm: 'DIEM.DIEMCHU' };

    K.man(document.getElementById('qld-thamsoquydoithangdiem'), {
        title: 'Tham số quy đổi thang điểm',
        listTitle: 'Danh sách tham số quy đổi thang điểm',
        formTitle: 'thông tin tham số quy đổi thang điểm',
        icon: 'fa-list',
        ctl: 'D_QuyDoiThangDiem',

        loc: [
            { key: 'goc', label: 'Chọn thang điểm gốc', source: THANGDIEM },
            { key: 'quyDoi', label: 'Chọn thang điểm quy đổi', source: THANGDIEM },
            { key: 'chu', label: 'Chọn điểm chữ quy đổi', source: DIEMCHU }
        ],
        locThamSo: function (f) {
            return { strThangDiemGoc_Id: f.goc, strThangDiemQuyDoi_Id: f.quyDoi, strDiemChu_DiemQuyDoi_Id: f.chu };
        },

        columns: [
            { title: 'Thang điểm gốc', prop: 'THANGDIEMGOC_TEN', cls: 'is-center' },
            { title: 'Thang điểm quy đổi', prop: 'THANGDIEMQUYDOI_TEN', cls: 'is-center' },
            { title: 'Mức điểm cận dưới của điểm gốc', prop: 'DIEMCANDUOI_THANGDIEMGOC', cls: 'is-center' },
            { title: 'Mức điểm cận trên của điểm gốc', prop: 'DIEMCANTREN_THANGDIEMGOC', cls: 'is-center' },
            { title: 'Điểm số quy đổi', prop: 'DIEMSO_THANGDIEMQUYDOI', cls: 'is-center' },
            { title: 'Điểm chữ quy đổi', prop: 'DIEMCHU_THANGDIEMQUYDOI_TEN', cls: 'is-center' }
        ],

        fields: [
            { key: 'strThangDiemGoc_Id', col: 'THANGDIEMGOC_ID', label: 'Thang điểm gốc', type: 'select',
                source: THANGDIEM, placeholder: 'Chọn thang điểm gốc' },
            { key: 'strThangDiemQuyDoi_Id', col: 'THANGDIEMQUYDOI_ID', label: 'Thang điểm quy đổi', type: 'select',
                source: THANGDIEM, placeholder: 'Chọn thang điểm quy đổi' },
            { key: 'dDiemCanDuoi_DiemGoc', col: 'DIEMCANDUOI_THANGDIEMGOC', label: 'Mức điểm cận dưới của điểm gốc', type: 'number' },
            { key: 'dDiemCanTren_DiemGoc', col: 'DIEMCANTREN_THANGDIEMGOC', label: 'Mức điểm cận trên của điểm gốc', type: 'number' },
            { key: 'dDiemSo_DiemQuyDoi', col: 'DIEMSO_THANGDIEMQUYDOI', label: 'Điểm số quy đổi', type: 'number' },
            { key: 'strDiemChu_DiemQuyDoi_Id', col: 'DIEMCHU_THANGDIEMQUYDOI_ID', label: 'Điểm chữ quy đổi', type: 'select',
                source: DIEMCHU, placeholder: 'Chọn điểm chữ quy đổi' }
        ],
        tuLoc: { strThangDiemGoc_Id: 'goc', strThangDiemQuyDoi_Id: 'quyDoi', strDiemChu_DiemQuyDoi_Id: 'chu' },

        luu: function (v) {
            return {
                strThangDiemGoc_Id: v.strThangDiemGoc_Id,
                strThangDiemQuyDoi_Id: v.strThangDiemQuyDoi_Id,
                dDiemCanDuoi_DiemGoc: v.dDiemCanDuoi_DiemGoc,
                dDiemCanTren_DiemGoc: v.dDiemCanTren_DiemGoc,
                dDiemSo_DiemQuyDoi: v.dDiemSo_DiemQuyDoi,
                strDiemChu_DiemQuyDoi_Id: v.strDiemChu_DiemQuyDoi_Id,
                iThuTu: ''
            };
        }
    });
})();
