/* Dữ liệu mẫu cho quatrinhsuckhoe — chỉ dùng ở chế độ dựng thử. */
ums.demo.crudStore('NS_QT_KhamSucKhoe', [
    { ID: 'SK1', NHOMMAU_KHAC: 'O', CHIEUCAO: '168', CANNANG: '62', DIACHI: 'Bệnh viện Bạch Mai', NGAYKIEMTRA: '12/03/2025', MOTA: 'Sức khỏe loại I' },
    { ID: 'SK2', NHOMMAU_KHAC: 'O', CHIEUCAO: '168', CANNANG: '64', DIACHI: 'Trạm y tế trường', NGAYKIEMTRA: '10/03/2026', MOTA: 'Sức khỏe loại I' }
], { map: function (o) {
    return { NHOMMAU_KHAC: o.strNhomMau_Khac, CHIEUCAO: o.strChieuCao, CANNANG: o.strCanNang,
             DIACHI: o.strDiaChi, NGAYKIEMTRA: o.strNgayKiemTra, MOTA: o.strMoTa };
} });
