/* Dữ liệu mẫu cho thamsoquydoithangdiemapdung — chỉ dùng ở chế độ dựng thử (kho nhớ: thamsochung/script/_apdung.demo.js). */
(function () {
    ums.demo.add({
        'D_QuyDoiThangDiem/LayDanhSach': [
            { ID: 'QD1', DIEM_QUYDOITHANGDIEM_TEN: 'Thang 10 → thang 4' },
            { ID: 'QD2', DIEM_QUYDOITHANGDIEM_TEN: 'Thang 10 → điểm chữ' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.DIEMCHU': [
            { ID: 'A', MA: 'A', TEN: 'A' }, { ID: 'B+', MA: 'B+', TEN: 'B+' }, { ID: 'B', MA: 'B', TEN: 'B' },
            { ID: 'C', MA: 'C', TEN: 'C' }, { ID: 'D', MA: 'D', TEN: 'D' }, { ID: 'F', MA: 'F', TEN: 'F' }
        ]
    });
    function mau(pv) {
        if (pv.length > 12) return [{ DIEM_QUYDOITHANGDIEM_ID: 'QD1', DAOTAO_THOIGIANDAOTAO_ID: 'TG11', NGAYAPDUNG: '01/09/2024',
            DIEMCANDUOI_THANGDIEMGOC: '8.5', DIEMCANTREN_THANGDIEMGOC: '10', DIEMSO_THANGDIEMQUYDOI: '4', DIEMCHU_THANGDIEMQUYDOI_ID: 'A' }];
        return [
            { DIEM_QUYDOITHANGDIEM_ID: 'QD1', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023',
              DIEMCANDUOI_THANGDIEMGOC: '8.5', DIEMCANTREN_THANGDIEMGOC: '10', DIEMSO_THANGDIEMQUYDOI: '4', DIEMCHU_THANGDIEMQUYDOI_ID: 'A' },
            { DIEM_QUYDOITHANGDIEM_ID: 'QD1', DAOTAO_THOIGIANDAOTAO_ID: 'TG01', NGAYAPDUNG: '05/09/2023',
              DIEMCANDUOI_THANGDIEMGOC: '8.0', DIEMCANTREN_THANGDIEMGOC: '8.4', DIEMSO_THANGDIEMQUYDOI: '3.5', DIEMCHU_THANGDIEMQUYDOI_ID: 'B+' }
        ];
    }
    mau.map = function (o) {
        return { DIEM_QUYDOITHANGDIEM_ID: o.strDiem_QuyDoiThangDiem_Id, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id,
            NGAYAPDUNG: o.strNgayApDung, DIEMCANDUOI_THANGDIEMGOC: o.dDiemCanDuoi_DiemGoc, DIEMCANTREN_THANGDIEMGOC: o.dDiemCanTren_DiemGoc,
            DIEMSO_THANGDIEMQUYDOI: o.dDiemSo_DiemQuyDoi, DIEMCHU_THANGDIEMQUYDOI_ID: o.strDiemChu_DiemQuyDoi_Id };
    };
    ums.qldADDemo('D_QuyDoiThangDiem_ApDung', mau);
})();
