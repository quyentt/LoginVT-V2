/* Dữ liệu mẫu cho khaibaothanhphandiemapdung — chỉ dùng ở chế độ dựng thử (kho nhớ: thamsochung/script/_apdung.demo.js). */
(function () {
    ums.demo.add({
        'D_ThanhPhanDiem/LayDanhSach': [
            { ID: 'TP1', TEN: 'Điểm chuyên cần' }, { ID: 'TP2', TEN: 'Điểm giữa kỳ' },
            { ID: 'TP3', TEN: 'Điểm thi kết thúc' }, { ID: 'TP4', TEN: 'Điểm tổng kết học phần' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.QUYTACLAMTRON': [
            { ID: 'QT1', MA: 'LEN', TEN: 'Làm tròn lên' }, { ID: 'QT2', MA: 'XUONG', TEN: 'Làm tròn xuống' },
            { ID: 'QT3', MA: 'GAN', TEN: 'Làm tròn gần nhất (0,5)' }
        ]
    });
    function mau(pv) {
        if (pv.length > 12) return [{ DIEM_THANHPHANDIEM_ID: 'TP3', DAOTAO_THOIGIANDAOTAO_ID: 'TG11', NGAYAPDUNG: '01/09/2024', SOLESAUDAUPHAY: '1', COLAMTRON: '1', QUYTACLAMTRON_ID: 'QT3', GIATRIMACDINHKHICHUACODIEM: '0' }];
        return [
            { DIEM_THANHPHANDIEM_ID: 'TP1', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', SOLESAUDAUPHAY: '1', COLAMTRON: '1', QUYTACLAMTRON_ID: 'QT3', GIATRIMACDINHKHICHUACODIEM: '0' },
            { DIEM_THANHPHANDIEM_ID: 'TP2', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', SOLESAUDAUPHAY: '1', COLAMTRON: '1', QUYTACLAMTRON_ID: 'QT3', GIATRIMACDINHKHICHUACODIEM: '0' },
            { DIEM_THANHPHANDIEM_ID: 'TP3', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023', SOLESAUDAUPHAY: '1', COLAMTRON: '0', QUYTACLAMTRON_ID: '', GIATRIMACDINHKHICHUACODIEM: '' }
        ];
    }
    mau.map = function (o) {
        return { DIEM_THANHPHANDIEM_ID: o.strDiem_ThanhPhanDiem_Id, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id,
            NGAYAPDUNG: o.strNgayApDung, SOLESAUDAUPHAY: o.dSoLeSauDauPhay, COLAMTRON: o.dCoLamTron,
            QUYTACLAMTRON_ID: o.strQuyTacLamTron_Id, GIATRIMACDINHKHICHUACODIEM: o.strGiaTriMacDinhChuaCoDiem };
    };
    ums.qldADDemo('D_ThanhPhanDiem_ApDung', mau);
})();
