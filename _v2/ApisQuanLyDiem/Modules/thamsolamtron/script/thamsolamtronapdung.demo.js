/* Dữ liệu mẫu cho thamsolamtronapdung — chỉ dùng ở chế độ dựng thử (kho nhớ: thamsochung/script/_apdung.demo.js). */
(function () {
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.LOAIDIEMTRUNGBINH': [
            { ID: 'TB1', MA: 'TBHK', TEN: 'Điểm trung bình học kỳ' },
            { ID: 'TB2', MA: 'TBTL', TEN: 'Điểm trung bình tích lũy' },
            { ID: 'TB3', MA: 'TBHP', TEN: 'Điểm tổng kết học phần' }
        ]
    });
    function mau(pv) {
        if (pv.length > 12) return [{ LOAIDIEMTRUNGBINH_ID: 'TB3', DAOTAO_THOIGIANDAOTAO_ID: 'TG11', NGAYAPDUNG: '01/09/2024', COLAMTRON: '1', SOLESAUDAUPHAY: '1' }];
        return [
            { LOAIDIEMTRUNGBINH_ID: 'TB1', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', COLAMTRON: '1', SOLESAUDAUPHAY: '2' },
            { LOAIDIEMTRUNGBINH_ID: 'TB2', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', COLAMTRON: '0', SOLESAUDAUPHAY: '2' }
        ];
    }
    mau.map = function (o) {
        return { LOAIDIEMTRUNGBINH_ID: o.strLoaiDiemTrungBinh_Id, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id,
            NGAYAPDUNG: o.strNgayApDung, COLAMTRON: o.dCoLamTron, SOLESAUDAUPHAY: o.dSoLeSauDauPhay };
    };
    ums.qldADDemo('D_ThamSoLamTron_ApDung', mau);
})();
