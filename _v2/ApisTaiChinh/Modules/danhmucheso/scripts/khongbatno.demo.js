/* Dữ liệu mẫu cho khongbatno — chỉ dùng ở chế độ dựng thử. */
(function () {
    var B = ums.dmhsB;
    B.demoChung();
    var G = 'pkg_taichinh_kehoachthu_giahan.';
    var fx = {};
    fx[G + 'LayDSThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2025_2026_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    fx[G + 'LayDSKeHoachDangKyHoc'] = [
        { ID: 'KHD1', MAKEHOACH: 'DK20251', TENKEHOACH: 'Đăng ký học kỳ 1 năm 2025–2026', KIEMTRATAICHINH: 1, HIENTHIDONGIAHOCPHI: 1, TINHPHITUDONG: 1, QUYDINHKIEMTRAHOCPHI_ID: 'QD1', SOHOCPHINOTOIDACHOPHEP: 2000000, NGAYBATDAU: '01/08/2025', NGAYKETTHUC: '20/08/2025' },
        { ID: 'KHD2', MAKEHOACH: 'DKHL20251', TENKEHOACH: 'Đăng ký học lại, cải thiện HK1', KIEMTRATAICHINH: '', HIENTHIDONGIAHOCPHI: 1, TINHPHITUDONG: '', QUYDINHKIEMTRAHOCPHI_ID: '', SOHOCPHINOTOIDACHOPHEP: '', NGAYBATDAU: '25/08/2025', NGAYKETTHUC: '05/09/2025' }
    ];
    fx[G + 'LayDSDangKy_TaiChinh_ThoiGian'] = [
        { ID: 'KBN1', DANGKY_KEHOACHDANGKY_MA: 'DK20251', DANGKY_KEHOACHDANGKY_TEN: 'Đăng ký học kỳ 1 năm 2025–2026', THOIGIAN: '2025_2026_1', PHAMVIAPDUNG_TEN: 'Khóa 69 (2024–2028)' },
        { ID: 'KBN2', DANGKY_KEHOACHDANGKY_MA: 'DK20251', DANGKY_KEHOACHDANGKY_TEN: 'Đăng ký học kỳ 1 năm 2025–2026', THOIGIAN: '2025_2026_1', PHAMVIAPDUNG_TEN: 'BIT220101 - Nguyễn Văn An' }
    ];
    fx[G + 'LayDSDangKy_Khoan_KiemTraNo'] = [
        { ID: 'BN1', DANGKY_KEHOACHDANGKY_MA: 'DK20251', DANGKY_KEHOACHDANGKY_TEN: 'Đăng ký học kỳ 1 năm 2025–2026', TAICHINH_CACKHOANTHU_TEN: 'Học phí', PHAMVIAPDUNG_TEN: 'Đại học chính quy' },
        { ID: 'BN2', DANGKY_KEHOACHDANGKY_MA: 'DK20251', DANGKY_KEHOACHDANGKY_TEN: 'Đăng ký học kỳ 1 năm 2025–2026', TAICHINH_CACKHOANTHU_TEN: 'Bảo hiểm y tế', PHAMVIAPDUNG_TEN: 'Đại học chính quy' }
    ];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.QUYDINHKIEMTRAHOCPHI'] = [
        { ID: 'QD1', MA: 'NOKY', TEN: 'Không được nợ học phí kỳ trước' }, { ID: 'QD2', MA: 'NOTOIDA', TEN: 'Cho nợ tới mức tối đa' }
    ];
    fx['pkg_hosohocvien.LayDanhSachHoSoNhieuNganh'] = function (o) {
        var all = B.demo.sv.map(function (x) {
            return { ID: x.ID, QLSV_NGUOIHOC_ID: x.QLSV_NGUOIHOC_ID, DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT0000000000000000000000000000001', QLSV_NGUOIHOC_MASO: x.MASO,
                QLSV_NGUOIHOC_HODEM: x.HODEM, QLSV_NGUOIHOC_TEN: x.TEN, QLSV_NGUOIHOC_NGAYSINH: x.NGAYSINH_NGAY + '/' + x.NGAYSINH_THANG + '/' + x.NGAYSINH_NAM,
                DAOTAO_LOPQUANLY_TEN: x.DAOTAO_LOPQUANLY_TEN, DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' };
        });
        return { rows: all, pager: all.length };
    };
    ums.demo.add(fx);
})();
