/* Dữ liệu mẫu cho chamtui — chỉ dùng ở chế độ dựng thử. */
(function () {
    var TG = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    var HP = [{ ID: 'HP1', TEN: 'Lập trình HĐT', MA: 'IT3100' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu', MA: 'IT3200' }];
    var GV = [{ ID: 'GV1', GIANGVIEN: 'Nguyễn Văn Hùng - CB001' }, { ID: 'GV2', GIANGVIEN: 'Trần Thị Mai - CB015' }];
    var DS = [{ ID: 'R1', DAOTAO_KHOADAOTAO_TEN: 'K67', THI_DOTPHACH_TEN: 'Đợt phách 1', THI_TUIBAI_TEN: 'Túi 01', THI_DANHSACHTHI_TEN: 'DST-IT3100-01', DAOTAO_HOCPHAN_MA: 'IT3100',
        DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', THI_HINHTHUCTHI_TEN: 'Tự luận', NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 2', TKB_PHONGHOC_TEN: 'A2-301', SOSV: 40,
        GIANGVIENCOITHI_HODEM: 'Nguyễn Văn', GIANGVIENCOITHI_TEN: 'Hùng', GIANGVIENCOITHI_MA: 'CB001', GIANGVIENPHANCOITHI_HODEM: 'Lê', GIANGVIENPHANCOITHI_TEN: 'Nam', GIANGVIENPHANCOITHI_MA: 'CB002', THI_DOTTHI_TEN: 'Đợt 1 HK1' }];
    ums.demo.add({
        'PKG_THI_PHANCONG_SOTHEODOI.LayDSSoTheoDoiChamThiTui': DS,
        'PKG_THI_PHANCONG_SOTHEODOI.LayDSThoiGianChamThiTui': TG,
        'PKG_THI_PHANCONG_SOTHEODOI.LayDSDotThiChamThiTui': [{ ID: 'dotThi1', TEN: 'dotThi', TENDOTTHI: 'Đợt 1 HK1', TENHINHTHUCTHI: 'Tự luận', TENPHONGHOC: 'A2-301', NGAYTHI: '06/01/2027' }],
        'PKG_THI_PHANCONG_SOTHEODOI.LayDSHocPhanChamThiTui': HP,
        'PKG_THI_PHANCONG_SOTHEODOI.LayDSDotPhachChamThiTui': [{ ID: 'dotPhach1', TEN: 'dotPhach', TENDOTTHI: 'Đợt 1 HK1', TENHINHTHUCTHI: 'Tự luận', TENPHONGHOC: 'A2-301', NGAYTHI: '06/01/2027' }],
        'PKG_THI_PHANCONG_SOTHEODOI.LayDSGiangVienChamThiTui': GV,
        'PKG_THI_PHANCONG_SOTHEODOI.LayDSNguoiPhanChamThiTui': GV,
        'PKG_THI_PHANCONG_SOTHEODOI.LayDSHinhThucThiChamThiTui': [{ ID: 'hinhThuc1', TEN: 'hinhThuc', TENDOTTHI: 'Đợt 1 HK1', TENHINHTHUCTHI: 'Tự luận', TENPHONGHOC: 'A2-301', NGAYTHI: '06/01/2027' }],
        'PKG_THI_PHANCONG_SOTHEODOI.LayDSPhongThiChamThiTui': [{ ID: 'phongThi1', TEN: 'phongThi', TENDOTTHI: 'Đợt 1 HK1', TENHINHTHUCTHI: 'Tự luận', TENPHONGHOC: 'A2-301', NGAYTHI: '06/01/2027' }],
        'PKG_THI_PHANCONG_SOTHEODOI.LayDSNgayThiChamThiTui': [{ ID: 'ngayThi1', TEN: 'ngayThi', TENDOTTHI: 'Đợt 1 HK1', TENHINHTHUCTHI: 'Tự luận', TENPHONGHOC: 'A2-301', NGAYTHI: '06/01/2027' }]
    });
})();
