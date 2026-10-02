/* =========================================================================
   Khai báo tham số chung (tham số học tập chung)
   Bản gốc: ApisQuanLyDiem/Modules/thamsochung/html/khaibaothamsochung.html
            + script/khaibaothamsochung.js
   Khung chung: script/_khaibao.js (ums.qldKB) — phần chung ghi ở đầu tệp đó.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     D_ThamSoHocTapChung/LayDanhSach  GET: strTuKhoa, strDaoTao_ThoiGianDaoTao_Id (ô lọc),
                                      strNguoiThucHien_Id "", pageIndex/pageSize
     D_ThamSoHocTapChung/LayChiTiet   GET strId
     D_ThamSoHocTapChung/ThemMoi | CapNhat  POST: strId, dSoLanHocToiDa, dSoLanThiLaiToiDa,
                                      strDaoTao_ThoiGianDaoTao_Id, strNgayApDung
     D_ThamSoHocTapChung/Xoa          POST strIds (nối dấu phẩy)
     KHCT_ThoiGianDaoTao/LayDanhSach  GET — ô Thời gian đào tạo (lọc + biểu mẫu)
   Cột: SOLANHOCTOIDA, SOLANTHILAITOIDA, DAOTAO_THOIGIANDAOTAO_NAM/_KY/_DOT, NGAYAPDUNG.

   Lỗi gốc riêng màn này:
     · Nút "Lưu và Nhập tiếp" CHƯA TỪNG CHẠY: gốc gắn $("#btnReWrite") mà nút
       mang class btnReWrite (không có id) → nay chạy như các màn anh em.
     · Bỏ trình nghe #dropSearch_ThangDiemChuQuyDoi (ô không có trên màn — chép
       từ màn quy đổi thang điểm).
   ========================================================================= */
(function () {
    'use strict';

    var K = ums.qldKB;
    var TG = K.thoiGian();

    K.man(document.getElementById('qld-khaibaothamsochung'), {
        title: 'Khai báo tham số chung',
        listTitle: 'Danh sách tham số học tập chung',
        formTitle: 'thông tin tham số học tập chung',
        ctl: 'D_ThamSoHocTapChung',

        loc: [{ key: 'tg', label: 'Chọn thời gian đào tạo', source: TG }],
        locThamSo: function (f) { return { strDaoTao_ThoiGianDaoTao_Id: f.tg }; },

        columns: [
            { title: 'Số lần học tối đa', prop: 'SOLANHOCTOIDA', cls: 'is-center' },
            { title: 'Số lần thi tối đa', prop: 'SOLANTHILAITOIDA', cls: 'is-center' },
            K.cotThoiGian(),
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],

        fields: [
            { key: 'dSoLanHocToiDa', col: 'SOLANHOCTOIDA', label: 'Số lần học tối đa', type: 'number' },
            { key: 'dSoLanThiLaiToiDa', col: 'SOLANTHILAITOIDA', label: 'Số lần thi tối đa', type: 'number' },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian đào tạo',
                type: 'select', source: TG, placeholder: 'Chọn thời gian đào tạo' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' }
        ],
        tuLoc: { strDaoTao_ThoiGianDaoTao_Id: 'tg' },

        luu: function (v) {
            return {
                dSoLanHocToiDa: v.dSoLanHocToiDa,
                dSoLanThiLaiToiDa: v.dSoLanThiLaiToiDa,
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                strNgayApDung: v.strNgayApDung
            };
        }
    });
})();
