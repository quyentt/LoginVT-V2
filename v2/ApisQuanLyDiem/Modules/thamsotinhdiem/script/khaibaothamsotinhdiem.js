/* =========================================================================
   Khai báo tham số tính điểm (tham số tổng hợp)
   Bản gốc: ApisQuanLyDiem/Modules/thamsotinhdiem/html/khaibaothamsotinhdiem.html
            + script/khaibaothamsotinhdiem.js
   Khung chung: ../../thamsochung/script/_khaibao.js (ums.qldKB).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên; controller D_ThamSoTongHop):
     D_ThamSoTongHop/LayDanhSach  GET: strTuKhoa, strDaoTao_ThoiGianDaoTao_Id, strQuyCheApDung_Id
                                  (hai ô lọc), strNguoiThucHien_Id "", pageIndex/pageSize
     D_ThamSoTongHop/LayChiTiet   GET strId
     D_ThamSoTongHop/ThemMoi | CapNhat  POST: strId, strQuyCheApDung_Id, strQuyTacLayDiemCaoNhat_Id,
                                  strQuyTacLayDuLieuCT_Id, strQuyTacXacDinhDiem_Id,
                                  strQuyTacVeDieuKienDiem_Id, strQuyTacLayDiemLan1_Id, strMoTa,
                                  strDaoTao_ThoiGianDaoTao_Id, strNgayApDung
     D_ThamSoTongHop/Xoa          POST strIds
     KHCT_ThoiGianDaoTao/LayDanhSach GET — ô Thời gian đào tạo
   Danh mục: DIEM.QUYCHEDIEM (lọc + biểu mẫu), DIEM.QUYTACLAYDIEMCAONHAT, DIEM.QUYTACLAYDULIEU,
     DIEM.QUYTACXACDINHDIEM, DIEM.QUYTACDIEUKIENVEDIEM, DIEM.QUYTACLAYDIEMLAN1.
   Cột: QUYCHEAPDUNG_TEN, thời gian (NAM - KY - DOT), NGAYAPDUNG.

   Lỗi gốc riêng màn này:
     · rewrite() đặt me.strId = "" thay cho me.strThamSoTinhDiem_Id → sau khi mở
       sửa một dòng, bấm "Thêm mới" rồi Lưu là GHI ĐÈ (CapNhat) dòng vừa sửa.
       Nay "Thêm mới" luôn gọi ThemMoi.
   ========================================================================= */
(function () {
    'use strict';

    var K = ums.qldKB;
    var TG = K.thoiGian();
    var QUYCHE = { dm: 'DIEM.QUYCHEDIEM' };

    K.man(document.getElementById('qld-khaibaothamsotinhdiem'), {
        title: 'Khai báo tham số tính điểm',
        listTitle: 'Danh sách tham số tính điểm',
        formTitle: 'thông tin tham số tính điểm',
        ctl: 'D_ThamSoTongHop',

        loc: [
            { key: 'tg', label: 'Chọn thời gian đào tạo', source: TG },
            { key: 'quyChe', label: 'Chọn quy chế áp dụng', source: QUYCHE }
        ],
        locThamSo: function (f) {
            return { strDaoTao_ThoiGianDaoTao_Id: f.tg, strQuyCheApDung_Id: f.quyChe };
        },

        columns: [
            { title: 'Quy chế áp dụng', prop: 'QUYCHEAPDUNG_TEN' },
            K.cotThoiGian(),
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],

        fields: [
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian đào tạo',
                type: 'select', source: TG, placeholder: 'Chọn thời gian đào tạo' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' },
            { key: 'strQuyCheApDung_Id', col: 'QUYCHEAPDUNG_ID', label: 'Quy chế áp dụng',
                type: 'select', source: QUYCHE, placeholder: 'Chọn quy chế áp dụng' },
            { key: 'strQuyTacLayDiemCaoNhat_Id', col: 'QUYTACLAYDIEMCAONHAT_ID', label: 'Quy tắc lấy điểm cao nhất',
                type: 'select', source: { dm: 'DIEM.QUYTACLAYDIEMCAONHAT' }, placeholder: 'Chọn quy tắc lấy điểm cao nhất' },
            { key: 'strQuyTacLayDuLieuCT_Id', col: 'QUYTACLAYDULIEUCT_ID', label: 'Quy tắc lấy dữ liệu CT',
                type: 'select', source: { dm: 'DIEM.QUYTACLAYDULIEU' }, placeholder: 'Chọn quy tắc lấy dữ liệu chương trình' },
            { key: 'strQuyTacXacDinhDiem_Id', col: 'QUYTACXACDINHDIEM_ID', label: 'Quy tắc xác định điểm',
                type: 'select', source: { dm: 'DIEM.QUYTACXACDINHDIEM' }, placeholder: 'Chọn quy tắc xác định điểm' },
            { key: 'strQuyTacVeDieuKienDiem_Id', col: 'QUYTACVEDIEUKIENDIEM_ID', label: 'Quy tắc về điều kiện điểm',
                type: 'select', source: { dm: 'DIEM.QUYTACDIEUKIENVEDIEM' }, placeholder: 'Chọn quy tắc về điều kiện điểm' },
            { key: 'strQuyTacLayDiemLan1_Id', col: 'QUYTACLAYDIEMLAN1_ID', label: 'Quy tắc lấy điểm lần 1',
                type: 'select', source: { dm: 'DIEM.QUYTACLAYDIEMLAN1' }, placeholder: 'Chọn quy tắc lấy điểm lần 1' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ],
        tuLoc: { strDaoTao_ThoiGianDaoTao_Id: 'tg', strQuyCheApDung_Id: 'quyChe' },

        luu: function (v) {
            return {
                strQuyCheApDung_Id: v.strQuyCheApDung_Id,
                strQuyTacLayDiemCaoNhat_Id: v.strQuyTacLayDiemCaoNhat_Id,
                strQuyTacLayDuLieuCT_Id: v.strQuyTacLayDuLieuCT_Id,
                strQuyTacXacDinhDiem_Id: v.strQuyTacXacDinhDiem_Id,
                strQuyTacVeDieuKienDiem_Id: v.strQuyTacVeDieuKienDiem_Id,
                strQuyTacLayDiemLan1_Id: v.strQuyTacLayDiemLan1_Id,
                strMoTa: v.strMoTa,
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                strNgayApDung: v.strNgayApDung
            };
        }
    });
})();
