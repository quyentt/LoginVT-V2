/* Dữ liệu mẫu cho phanphuckhao — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DS = [{ ID: 'PK1', QLSV_NGUOIHOC_MASO: 'SV2201', QLSV_NGUOIHOC_HODEM: 'Trần Minh', QLSV_NGUOIHOC_TEN: 'Anh', QLSV_NGUOIHOC_EMAIL: 'anh@st.truongmau.edu.vn', DAOTAO_KHOAQUANLYSV_TEN: 'Khoa CNTT',
        TUI: 'Túi 01', SOPHACH: 'P101', SOBAODANH: '015', CATHI_TEN: 'Ca 2', PHONGTHI_TEN: 'A2-301', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_MA: 'IT3100', HINHTHUCTHI_TEN: 'Tự luận',
        NGAYTHI: '06/01/2027', DIEM: 4, DSNHANSUCHAMTHIPK: '', DAOTAO_KHOAQUANLYHP_TEN: 'Khoa CNTT', NGAYXACNHANHOANTHANHDIEMTHI: '15/01/2027', NGAYDANGKYPHUCKHAO: '17/01/2027',
        NGAYHETHANDANGKYPHUCKHAO: '22/01/2027', NGAYHETHANNOPPHIPHUCKHAO: '25/01/2027', PHIPHUCKHAO: '30.000', TINHTRANGNOPPHI: 'Đã nộp', TINHTRANG_TEN: '', KETQUAPHUCKHAO: '' },
        { ID: 'PK2', QLSV_NGUOIHOC_MASO: 'SV2202', QLSV_NGUOIHOC_HODEM: 'Lê Thu', QLSV_NGUOIHOC_TEN: 'Hà', DAOTAO_KHOAQUANLYSV_TEN: 'Khoa Kinh tế', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô', DAOTAO_HOCPHAN_MA: 'EC1000',
        DIEM: 8.5, DAOTAO_KHOAQUANLYHP_TEN: 'Khoa Kinh tế', TINHTRANG_TEN: 'Đã duyệt', KETQUAPHUCKHAO: 9 }];
    var LS = [], PC = [];
    ums.demo.add({
        'TP_PhucKhao/LayThoiGianTheoDotThi': [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }],
        'TP_PhucKhao/LayHocPhanPhucKhao': function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', TEN: 'IT3100 - Lập trình HĐT' }] : []; },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#THI.PHUCKHAO.TINHTRANG': [{ ID: 'D1', TEN: 'Đã duyệt' }, { ID: 'D2', TEN: 'Không duyệt' }],
        'pkg_thi_phach_phuckhao.LayDSThiPhucKhao': function () { return DS; },
        'pkg_thi_phancong.LayDSNhanSuPhanCongChamThiPK': function () { return PC; },
        'pkg_thi_phancong.Them_Thi_GiaoVien_ChamThiPK': function (o) { PC.push({ ID: 'C' + (PC.length + 1), HODEM: 'Cán bộ', TEN: String(PC.length + 1), MASO: o.strNhanSu_HoSoCanBo_v2_Id, THONGTIN: o.strDuLieuPhanCongChamThi_Id }); return []; },
        'pkg_thi_phancong.Xoa_Thi_GiaoVien_ChamThiPK': function (o) { PC = PC.filter(function (x) { return x.ID !== o.strId; }); return []; },
        'TP_PhucKhao/Them_Thi_PhucKhao_XacNhan': function (o) { LS.unshift({ TINHTRANG_TEN: o.strTinhTrang_Id === 'D1' ? 'Đã duyệt' : 'Không duyệt', NOIDUNG: o.strThongTinXacNhan, NGUOIXACNHAN_TENDAYDU: 'Phòng Khảo thí', NGAYTAO_DD_MM_YYYY: '22/09/2026' }); return []; },
        'TP_PhucKhao/LayDSThi_PhucKhao_XacNhan': function () { return LS; }
    });
})();
