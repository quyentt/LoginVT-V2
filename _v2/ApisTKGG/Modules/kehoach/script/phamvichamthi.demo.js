/* Dữ liệu mẫu cho phamvichamthi — chỉ dùng ở chế độ dựng thử. Khoá = tên func; hình dạng đúng máy chủ trả. */
(function () {
    var dong = [
        { ID: 'ST1', DAOTAO_KHOADAOTAO_TEN: 'K19', THI_DOTPHACH_TEN: 'Đợt phách 1', THI_TUIBAI_TEN: 'Túi 01', THI_DANHSACHTHI_TEN: 'Toán cao cấp A1 - P.301 - Ca 1',
            DAOTAO_HOCPHAN_MA: 'MAT101', DAOTAO_HOCPHAN_TEN: 'Toán cao cấp A1', THI_HINHTHUCTHI_TEN: 'Tự luận', NGAYTHI: '12/06/2026', THI_CATHI_TEN: 'Ca 1',
            TKB_PHONGHOC_TEN: 'P.301', SOSV: 42, GIANGVIENCOITHI_HODEM: 'Nguyễn Văn', GIANGVIENCOITHI_TEN: 'An', GIANGVIENCOITHI_MA: 'GV001',
            GIANGVIENPHANCOITHI_HODEM: 'Lê Văn', GIANGVIENPHANCOITHI_TEN: 'Cường', GIANGVIENPHANCOITHI_MA: 'NS002', THI_DOTTHI_TEN: 'Đợt 1 - Kết thúc học phần' },
        { ID: 'ST2', DAOTAO_KHOADAOTAO_TEN: 'K19', THI_DOTPHACH_TEN: 'Đợt phách 1', THI_TUIBAI_TEN: 'Túi 02', THI_DANHSACHTHI_TEN: 'Vật lý đại cương - P.302 - Ca 2',
            DAOTAO_HOCPHAN_MA: 'PHY101', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương', THI_HINHTHUCTHI_TEN: 'Tự luận', NGAYTHI: '12/06/2026', THI_CATHI_TEN: 'Ca 2',
            TKB_PHONGHOC_TEN: 'P.302', SOSV: 38, GIANGVIENCOITHI_HODEM: 'Trần Thị', GIANGVIENCOITHI_TEN: 'Bình', GIANGVIENCOITHI_MA: 'GV014',
            GIANGVIENPHANCOITHI_HODEM: 'Lê Văn', GIANGVIENPHANCOITHI_TEN: 'Cường', GIANGVIENPHANCOITHI_MA: 'NS002', THI_DOTTHI_TEN: 'Đợt 1 - Kết thúc học phần' }];
    var fx = {
        'PKG_KLGV_V2_KEHOACH.LayDSThoiGianTongHopKL': [
            { ID: 'TG1', THOIGIAN: 'Năm học 2025 - 2026' }, { ID: 'TG2', THOIGIAN: 'Năm học 2024 - 2025' }],
        'PKG_KLGV_V2_KEHOACH.LayDSKLGD_TongHopKhoiLuong': function (o) {
            return o.strDaoTao_ThoiGianDaoTao_Id === 'TG2' ? [{ ID: 'TH3', TEN: 'Tổng hợp giờ giảng 2024 - 2025' }] :
                [{ ID: 'TH1', TEN: 'Tổng hợp giờ giảng HK1 2025 - 2026' }, { ID: 'TH2', TEN: 'Tổng hợp giờ giảng HK2 2025 - 2026' }];
        },
        'PKG_KLGV_V2_KEHOACH.LayDSKLGD_KeHoachChiTiet': function (o) {
            return o.strKLGD_TongHopKhoiLuong_Id ? [{ ID: 'CT1', TEN: 'Chấm thi kết thúc học phần' }, { ID: 'CT2', TEN: 'Chấm thi giữa kỳ' }] : [];
        },
        'PKG_KLGV_V2_KEHOACH.LayDSKLGD_DuLieu_ChamThi': function () {
            return { pager: 2, rows: {
                rs: [
                    { ID: 'DL1', LOAIDULIEU_TEN: 'Túi bài', DULIEUXACNHAN_MA: 'TUI.001', DULIEUXACNHAN_TEN: 'Túi 01 - Toán cao cấp A1', MOTA: '', THOIGIAN: '15/06/2026', KHOADULIEU: 'K19' },
                    { ID: 'DL2', LOAIDULIEU_TEN: 'Danh sách thi', DULIEUXACNHAN_MA: 'DST.002', DULIEUXACNHAN_TEN: 'Vật lý đại cương - P.302 - Ca 2', MOTA: 'Chấm chung', THOIGIAN: '16/06/2026', KHOADULIEU: 'K19' }],
                rsSoNguoiCham: [
                    { STT: 1, TIEUDETENNGUOICHAM: 'Người chấm thi', TIEUDESOLUONG: 'Số bài' },
                    { STT: 2, TIEUDETENNGUOICHAM: 'Người chấm thi', TIEUDESOLUONG: 'Số bài' }]
            } };
        },
        'PKG_KLGV_V2_THONGTIN.LayTTNguoiChamThiTheo': function (o) {
            var n = Number(o.dNguoiThuMay);
            return [{ MASO: n === 1 ? 'GV001' : 'GV014', HODEM: n === 1 ? 'Nguyễn Văn' : 'Trần Thị', TEN: n === 1 ? 'An' : 'Bình', SOLUONG: n === 1 ? 20 : 22 }];
        },
        'PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_ChamThi_Tui': { rows: [], raw: { Id: 'DLMOI1' } },
        'PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_ChamThi_DST': { rows: [], raw: { Id: 'DLMOI2' } }
    };
    ['ChamThiTui', 'ChamThi'].forEach(function (duoi) {
        var P = 'PKG_THI_PHANCONG_SOTHEODOI.';
        fx[P + 'LayDSThoiGian' + duoi] = [{ ID: 'TGD1', THOIGIAN: 'Học kỳ 2 - 2025 - 2026' }, { ID: 'TGD2', THOIGIAN: 'Học kỳ 1 - 2025 - 2026' }];
        fx[P + 'LayDSDotThi' + duoi] = [{ ID: 'DT1', TENDOTTHI: 'Đợt 1 - Kết thúc học phần' }, { ID: 'DT2', TENDOTTHI: 'Đợt 2 - Thi lại' }];
        fx[P + 'LayDSHocPhan' + duoi] = [{ ID: 'HP1', TEN: 'Toán cao cấp A1', MA: 'MAT101' }, { ID: 'HP2', TEN: 'Vật lý đại cương', MA: 'PHY101' }];
        fx[P + 'LayDSGiangVien' + duoi] = [{ ID: 'GV1', GIANGVIEN: 'GV001 - Nguyễn Văn An' }, { ID: 'GV2', GIANGVIEN: 'GV014 - Trần Thị Bình' }];
        fx[P + 'LayDSHinhThucThi' + duoi] = [{ ID: 'HT1', TENHINHTHUCTHI: 'Tự luận' }, { ID: 'HT2', TENHINHTHUCTHI: 'Trắc nghiệm' }];
        fx[P + 'LayDSPhongThi' + duoi] = [{ ID: 'PH1', TENPHONGHOC: 'P.301' }, { ID: 'PH2', TENPHONGHOC: 'P.302' }];
        fx[P + 'LayDSNgayThi' + duoi] = [{ ID: '12/06/2026', NGAYTHI: '12/06/2026' }, { ID: '13/06/2026', NGAYTHI: '13/06/2026' }];
        fx[P + 'LayDSSoTheoDoi' + duoi] = dong;
    });
    fx['PKG_THI_PHANCONG_SOTHEODOI.LayDSDotPhachChamThiTui'] = [{ ID: 'DP1', TEN: 'Đợt phách 1' }, { ID: 'DP2', TEN: 'Đợt phách 2' }];
    fx['PKG_THI_PHANCONG_SOTHEODOI.LayDSNguoiPhanChamThiTui'] = [{ ID: 'NS1', GIANGVIEN: 'NS002 - Lê Văn Cường' }];
    fx['PKG_THI_PHANCONG_SOTHEODOI.LayDSNguoiThucHienPhanChamThi'] = [{ ID: 'NS1', GIANGVIEN: 'NS002 - Lê Văn Cường' }];
    ums.demo.add(fx);
})();
