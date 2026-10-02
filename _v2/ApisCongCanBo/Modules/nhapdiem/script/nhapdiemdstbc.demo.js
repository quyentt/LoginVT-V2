/* Dữ liệu mẫu cho nhapdiemdst / nhapdiemdstbc — chỉ dùng ở chế độ dựng thử. */
(function () {
    var T = 'TP_Chung/', fx = {};
    fx[T + 'LayThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    fx[T + 'LayLoaiDiem'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi cuối kỳ' }] : []; };
    fx[T + 'LayHinhThucThi'] = function (o) { return o.strDiem_ThanhPhanDiem_Id ? [{ ID: 'HT1', TEN: 'Tự luận' }, { ID: 'HT2', TEN: 'Vấn đáp' }] : []; };
    fx[T + 'LayDotThi'] = function (o) { return o.strHinhThucThi_Id ? [{ ID: 'DOT1', TEN: 'Đợt 1 HK1' }] : []; };
    fx[T + 'LayHocPhan'] = function (o) { return o.strDotThi_Id ? [{ ID: 'HP1', TEN: 'Lập trình HĐT', MA: 'IT3100' }] : []; };
    var DST = [{ ID: 'DST1', MADANHSACHTHI: 'DST-IT3100-01', THONGTINLOPHOCPHAN: 'IT3100.01 - Lập trình HĐT (Nhóm 1); IT3100.02 - Lập trình HĐT (Nhóm 2); IT3100.03 - Lập trình HĐT (Nhóm 3)',
        NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 2', TKB_PHONGTHI_TEN: 'A2-301', XACNHANHOANTHANHDIEMTHI: 0 },
        { ID: 'DST2', MADANHSACHTHI: 'DST-IT3100-02', THONGTINLOPHOCPHAN: 'IT3100.04 - Lập trình HĐT', NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 3', TKB_PHONGTHI_TEN: 'A2-302', XACNHANHOANTHANHDIEMTHI: 1 }];
    fx[T + 'LayDSThiTheoDotThi'] = function (o) { return o.strThi_DotThi_Id ? DST : []; };
    var NH = [['SV1', 'SV2201', 'Trần Minh', 'Anh', 7], ['SV2', 'SV2202', 'Lê Thu', 'Hà', ''], ['SV3', 'SV2203', 'Phạm Quốc', 'Bảo', '']].map(function (x, i) {
        return { ID: 'TS' + i, QLSV_NGUOIHOC_ID: x[0], IDDANHSACHTHI: 'DST1', QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], DAOTAO_LOPQUANLY_TEN: 'KTPM01',
            DIEM_THANHPHANDIEM_TEN: 'Cuối kỳ', LANHOC: 1, LANTHI: 1, SOBAODANH: '0' + (i + 1), DIEMBANDAU: x[4], THANGDIEM: 10, CAMTHI_DUYETDKTHI: i === 2 ? '1' : '0',
            CAMTHI_VIPHAMQUYCHE: '0', DIEM_DANHSACHHOC_TEN: 'IT3100.01', TRANGTHAI: i === 2 ? 'Cấm thi' : '' };
    });
    fx[T + 'LayDSNguoiHocTheoDST'] = function (o) { return o.strDanhSachThi_Id === 'DST1' ? NH : []; };
    fx['TP_XuLy/CapNhat_DiemPhachTheoDST'] = function (o) { NH.forEach(function (n) { if (n.ID === o.strThi_DanhSachSinhVien_Id) n.DIEMBANDAU = o.strDiem; }); return []; };
    fx[T + 'LayTrangThaiSauThi'] = [{ ID: 'VP1', TEN: 'Vi phạm quy chế' }];
    fx['TP_XacNhanSauThi/ThemMoi'] = [];
    fx['D_HanhDongXacNhan/LayDanhSach'] = [{ ID: 'HDX1', TEN: 'Hoàn thành' }];
    fx['D_XacNhan/LayDSDiem_XacNhan'] = [];
    fx['D_XacNhan/Them_Diem_XacNhan'] = function (o) { DST.forEach(function (x) { if (x.ID === o.strDuLieuXacNhan) x.XACNHANHOANTHANHDIEMTHI = 1; }); return []; };
    ums.demo.add(fx);
})();
