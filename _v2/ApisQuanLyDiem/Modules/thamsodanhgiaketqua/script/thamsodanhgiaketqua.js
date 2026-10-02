/* =========================================================================
   Tham số đánh giá kết quả
   Bản gốc: ApisQuanLyDiem/Modules/thamsodanhgiaketqua/html/thamsodanhgiaketqua.html
            + script/thamsodanhgiaketqua.js
   Khung chung: ../../thamsochung/script/_khaibao.js (ums.qldKB).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     D_ThamSoDanhGiaKetQua/LayDanhSach  GET: strTuKhoa, strDanhGia_Id (ô lọc), strNguoiThucHien_Id "",
                                        pageIndex/pageSize
     D_ThamSoDanhGiaKetQua/LayChiTiet   GET strId
     D_ThamSoDanhGiaKetQua/ThemMoi | CapNhat  POST: strId, strDanhGia_Id, strXauDieuKien, strMoTa, iThuTu = ''
     D_ThamSoDanhGiaKetQua/Xoa          POST strIds
   Danh mục: DIEM.DANHGIA (lọc + biểu mẫu).
   Cột: DANHGIA_TEN, XAUDIEUKIEN, MOTA.

   Ghi chú: gốc đổ THUTUUUTIEN vào #txtThuTuUuTien — ô không có trên màn, lưu
   luôn gửi iThuTu ''. Giữ như gốc (không hiện ô thứ tự).
   ========================================================================= */
(function () {
    'use strict';

    var K = ums.qldKB;
    var DANHGIA = { dm: 'DIEM.DANHGIA' };

    K.man(document.getElementById('qld-thamsodanhgiaketqua'), {
        title: 'Tham số đánh giá kết quả',
        listTitle: 'Danh sách tham số đánh giá kết quả',
        formTitle: 'thông tin tham số đánh giá kết quả',
        icon: 'fa-list',
        ctl: 'D_ThamSoDanhGiaKetQua',

        loc: [{ key: 'danhGia', label: 'Chọn đánh giá', source: DANHGIA }],
        locThamSo: function (f) { return { strDanhGia_Id: f.danhGia }; },

        columns: [
            { title: 'Kết quả đánh giá', prop: 'DANHGIA_TEN' },
            { title: 'Xâu điều kiện', prop: 'XAUDIEUKIEN' },
            { title: 'Mô tả', prop: 'MOTA' }
        ],

        fields: [
            { key: 'strDanhGia_Id', col: 'DANHGIA_ID', label: 'Kết quả đánh giá', type: 'select',
                source: DANHGIA, placeholder: 'Chọn đánh giá' },
            { key: 'strXauDieuKien', col: 'XAUDIEUKIEN', label: 'Xâu điều kiện', span: true },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ],
        tuLoc: { strDanhGia_Id: 'danhGia' },

        luu: function (v) {
            return {
                strDanhGia_Id: v.strDanhGia_Id,
                strXauDieuKien: v.strXauDieuKien,
                strMoTa: v.strMoTa,
                iThuTu: ''
            };
        }
    });
})();
