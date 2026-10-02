/* Dữ liệu mẫu cho thamsotinhdiemapdung — chỉ dùng ở chế độ dựng thử (kho nhớ: thamsochung/script/_apdung.demo.js). */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function ds(ma, ten) { return ten.map(function (t, i) { return { ID: ma + (i + 1), MA: ma + (i + 1), TEN: t }; }); }
    var fx = {};
    fx[D + 'DIEM.QUYCHEDIEM'] = ds('QC', ['Quy chế tín chỉ 2021', 'Quy chế niên chế', 'Quy chế đào tạo từ xa']);
    fx[D + 'DIEM.QUYTACLAYDIEMCAONHAT'] = ds('CN', ['Lấy điểm cao nhất các lần học', 'Lấy điểm lần học cuối']);
    fx[D + 'DIEM.QUYTACLAYDIEMLAN1'] = ds('L1', ['Lấy điểm lần 1', 'Lấy điểm lần thi cao nhất']);
    fx[D + 'DIEM.QUYTACLAYDULIEU'] = ds('DL', ['Theo chương trình', 'Theo toàn khóa']);
    fx[D + 'DIEM.QUYTACXACDINHDIEM'] = ds('XD', ['Xác định theo thang 10', 'Xác định theo thang 4']);
    fx[D + 'DIEM.QUYTACDIEUKIENVEDIEM'] = ds('DK', ['Không điểm thành phần dưới 0', 'Điểm thi từ 1 trở lên']);
    ums.demo.add(fx);
    function mau(pv) {
        if (pv.length > 6) return [{ QUYCHEAPDUNG_ID: 'QC1', DAOTAO_THOIGIANDAOTAO_ID: 'TG11', NGAYAPDUNG: '01/09/2024', QUYTACLAYDIEMCAONHAT_ID: 'CN2',
            QUYTACLAYDIEMLAN1_ID: 'L11', QUYTACLAYDULIEUCT_ID: 'DL1', QUYTACXACDINHDIEM_ID: 'XD1', QUYTACVEDIEUKIENDIEM_ID: 'DK1' }];
        return [
            { QUYCHEAPDUNG_ID: 'QC1', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', QUYTACLAYDIEMCAONHAT_ID: 'CN1',
              QUYTACLAYDIEMLAN1_ID: 'L11', QUYTACLAYDULIEUCT_ID: 'DL1', QUYTACXACDINHDIEM_ID: 'XD1', QUYTACVEDIEUKIENDIEM_ID: 'DK2' },
            { QUYCHEAPDUNG_ID: 'QC2', DAOTAO_THOIGIANDAOTAO_ID: 'TG11', NGAYAPDUNG: '02/09/2024', QUYTACLAYDIEMCAONHAT_ID: 'CN2',
              QUYTACLAYDIEMLAN1_ID: 'L12', QUYTACLAYDULIEUCT_ID: 'DL2', QUYTACXACDINHDIEM_ID: 'XD2', QUYTACVEDIEUKIENDIEM_ID: 'DK1' }
        ];
    }
    mau.map = function (o) {
        return { QUYCHEAPDUNG_ID: o.strQuyCheApDung_Id, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id, NGAYAPDUNG: o.strNgayApDung,
            QUYTACLAYDIEMCAONHAT_ID: o.strQuyTacLayDiemCaoNhat_Id, QUYTACLAYDIEMLAN1_ID: o.strQuyTacLayDiemLan1_Id,
            QUYTACLAYDULIEUCT_ID: o.strQuyTacLayDuLieuCT_Id, QUYTACXACDINHDIEM_ID: o.strQuyTacXacDinhDiem_Id,
            QUYTACVEDIEUKIENDIEM_ID: o.strQuyTacVeDieuKienDiem_Id };
    };
    ums.qldADDemo('D_ThamSoTongHop_ApDung', mau);
})();
