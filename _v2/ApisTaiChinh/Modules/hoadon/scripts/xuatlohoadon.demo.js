/* Dữ liệu mẫu cho xuatlohoadon — chỉ dùng ở chế độ dựng thử.
   Khoản thu, trạng thái người học, nút HĐĐT, hệ/khoá/CT/lớp: xuathoadon.demo.js. */
(function () {
    function k(i, sv, ten, lop, kt, ktMa, tien, extra) {
        var r = {
            ID: 'KL' + i, QLSV_NGUOIHOC_ID: 'Q' + sv, MASONGUOIHOC: 'DTC2252001' + sv, HOTENNGUOIHOC: ten, LOP: lop,
            DAOTAO_THOIGIANDAOTAO: 'HK1 2025-2026', TAICHINH_CACKHOANTHU_TEN: kt, TAICHINH_CACKHOANTHU_MA: ktMa, SOTIEN: tien,
            NGUOITAO_TENDAYDU: 'Hoàng Thu Trang', NGUOITAO_TAIKHOAN: 'trang.ht', NGAYTAO_DD_MM_YYYY: '1' + (i % 9) + '/09/2025',
            CCCD: '0192040' + (10000 + i), NOIDUNG: kt + ' HK1 2025-2026', DIACHICOQUANCONGTAC: 'TP Thái Nguyên',
            HINHTHUCTHU_MA: 'CK', HINHTHUCTHU_TEN: 'Chuyển khoản', LOAITIENTE_MA: 'VND', DONVITINH_TEN: 'Học kỳ',
            SOLUONG: 1, DONGIA: tien, CHIETKHAU: 0, TYLECHIETKHAU: 0, DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01', LAHOCVIEN: 1,
            CHUNGTU_SO: '00001' + (40 + i)
        };
        for (var x in (extra || {})) r[x] = extra[x];
        return r;
    }
    var DS = [
        k(1, '11', 'Nguyễn Văn An', 'CNTT K22A', 'Học phí', 'HP', 8250000),
        k(2, '11', 'Nguyễn Văn An', 'CNTT K22A', 'Bảo hiểm y tế', 'BHYT', 1263600, { DONVITINH_TEN: null, HINHTHUCTHU_TEN: 'Tiền mặt', HINHTHUCTHU_MA: 'TM' }),
        k(3, '12', 'Trần Thị Bình', 'CNTT K22A', 'Học phí', 'HP', 8250000, { CCCD: null }),
        k(4, '13', 'Lê Hoàng Cường', 'KTPM K22B', 'Học phí', 'HP', 7800000, { DIACHICOQUANCONGTAC: '' }),
        k(5, '13', 'Lê Hoàng Cường', 'KTPM K22B', 'Phí ký túc xá', 'KTX', 1500000),
        k(6, '14', 'Phạm Minh Đức', 'KTPM K22B', 'Học phí', 'HP', 7800000, { LAHOCVIEN: 0, CCCD: '', DIACHICOQUANCONGTAC: null })
    ];
    function page(list, o) {
        var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
        return { rows: list.slice((p - 1) * s, p * s), pager: list.length };
    }
    ums.demo.add({
        'TC_HoaDon/LayDSKhoanPhaiNopChuaXuatPTBL': function (o) { return page(DS.slice(0, 4), o); },
        'TC_HoaDon/LayDSKhoanPhaiNopChuaXuatHD': function (o) { return page(DS, o); },
        'TC_HoaDon/LayDSKhoanDaNopChuaXuatHoaDon2': function (o) { return page(DS, o); },
        'TC_HoaDon/LayDSKhoanDaNopDaXuatHoaDon': function (o) { return page(DS.slice(2), o); },
        'TC_HoaDon/LayDSTaiChinh_SoHoaDon': function (o) {
            var l = [1, 2, 3, 4, 5].map(function (i) {
                return { ID: 'SH' + i, TAICHINH_HOADON_NAM: 2025, SOHOADON: '00002' + (10 + i), SOTIEN: 1000000 * i + 263600,
                    NGUOITAO_TENDAYDU: 'Hoàng Thu Trang', NGAYTAO_DD_MM_YYYY_HHMMSS: '1' + i + '/09/2025 08:30:00', NGAYCAPHOADON: '1' + i + '/09/2025' };
            });
            return page(o.dChuaIn === 0 ? l.slice(0, 3) : l.slice(3), o);
        },
        'TC_HoaDon/LayDSLoHoaDon': [
            { ID: 'LO000000000000000000000000000001', TEN: 'LO-2509-01', TONGSOHOADON: 100, TONGSOHOADONDAIN: 100, MAUIN_MASO: 'HOADONDHLUAT' },
            { ID: 'LO000000000000000000000000000002', TEN: 'LO-2509-02', TONGSOHOADON: 64, TONGSOHOADONDAIN: 20, MAUIN_MASO: 'HOADONDHLUAT' },
            { ID: 'LO000000000000000000000000000003', TEN: 'LO-2509-03', TONGSOHOADON: 37, TONGSOHOADONDAIN: 0, MAUIN_MASO: 'HOADONDHLUAT' }
        ],
        'TC_HoaDon/LayDSHoaDonTheoLo': [
            { ID: 'HL1', SOHOADON: '0000301', SOLANDAIN: 1 }, { ID: 'HL2', SOHOADON: '0000302', SOLANDAIN: 0 }, { ID: 'HL3', SOHOADON: '0000303', SOLANDAIN: 0 }
        ],
        'TC_HoaDon/TaoLoHoaDonCanIn': { rows: null, message: '' },
        'HDDT_HoaDon/SinhHoaDonTuDongTheoLo': { rows: null, message: 'Đã gửi 4 hoá đơn sang dịch vụ HĐĐT' },
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [{ ID: 'TG0', DAOTAO_THOIGIANDAOTAO: 'HK2 2024-2025' }, { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'HK1 2025-2026' }],
        'KHCT_NamNhapHoc/LayDanhSach': [{ NAMNHAPHOC: 2022 }, { NAMNHAPHOC: 2023 }, { NAMNHAPHOC: 2024 }],
        'KHCT_KhoaQuanLy/LayDanhSach': [{ ID: 'KQ1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQ2', TEN: 'Khoa Kinh tế' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.HTTHU': [
            { ID: 'HT1', MA: 'TM', TEN: 'Tiền mặt', THONGTIN1: null }, { ID: 'HT2', MA: 'CK', TEN: 'Chuyển khoản', THONGTIN1: 'TM/CK' }
        ],
        'TC_NguoiDungDaThuTien/LayDanhSach': [{ ID: 'U1', TAIKHOAN: 'trang.ht' }, { ID: 'U2', TAIKHOAN: 'nam.dv' }]
    });
})();
