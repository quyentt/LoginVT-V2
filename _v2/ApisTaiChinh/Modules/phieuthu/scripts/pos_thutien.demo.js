/* Dữ liệu mẫu cho pos_thutien — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    var POS = [
        { ID: 'POS01', STUDENTID: 'SV01', HOTEN: 'Lê Minh Quân', MASV: 'BIT220263', DAOTAO_LOPQUANLY_N1_TEN: 'K66-CNTT1', SOTIEN: 9150000, STATUS: 1 },
        { ID: 'POS02', STUDENTID: 'SV02', HOTEN: 'Đỗ Thu Trang', MASV: 'BBA220561', DAOTAO_LOPQUANLY_N1_TEN: 'K66-QTKD2', SOTIEN: 4600000, STATUS: 1 },
        { ID: 'POS03', STUDENTID: 'SV03', HOTEN: 'Phạm Quốc Huy', MASV: 'BIT220301', DAOTAO_LOPQUANLY_N1_TEN: 'K66-CNTT2', SOTIEN: 780000, STATUS: 'RESERVE' }
    ];

    function khoan(id, ktId, kt, nd, tien) {
        return { ID: id, DAOTAO_THOIGIANDAOTAO_ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 2026-2027', DAOTAO_THOIGIANDAOTAO_DOT: '1',
            TAICHINH_CACKHOANTHU_ID: ktId, TAICHINH_CACKHOANTHU_TEN: kt, NOIDUNG: nd, SOTIEN: tien, HETHONGCHUNGTU_MA: 'TAICHINH_HETHONGBIENLAI',
            NGAYTAO_DD_MM_YYYY: '05/09/2026', NGUOITAO_TENDAYDU: 'Phạm Thu Hà' };
    }

    function tinhTrang(o) {
        var p = POS.filter(function (x) { return x.ID === o.strNguonDuLieu_Id; })[0] || POS[0];
        return { rows: {
            rsKhoanThuQuaPos: [
                khoan('Q1', 'KT1', 'Học phí', 'Học phí học kỳ 1 (22 tín chỉ)', p.SOTIEN - 884520 - 350000),
                khoan('Q2', 'KT5', 'Bảo hiểm y tế', 'BHYT 12 tháng', 884520),
                khoan('Q3', 'KT2', 'Lệ phí thi', 'Lệ phí thi lại', 350000),
                khoan('Q4', 'KT3', 'Giáo trình', 'Chưa phát sinh', 0)
            ],
            rsThongTin: [{ HODEM: p.HOTEN.split(' ').slice(0, -1).join(' '), TEN: p.HOTEN.split(' ').slice(-1)[0], MASO: p.MASV, NGAYSINH: '12/05/2004',
                DAOTAO_LOPQUANLY_N1_TEN: p.DAOTAO_LOPQUANLY_N1_TEN, NGANHHOC_N1_TEN: 'Công nghệ thông tin', KHOAHOC_N1_TEN: 'K66',
                NOCO: -p.SOTIEN, TONGKHOANPHAINOP: 18300000, TONGKHOANDUOCMIEN: 0, TONGKHOANDANOP: 18300000 - p.SOTIEN, TONGKHOANDARUT: 0,
                TONGNORIENG: p.SOTIEN, TONGNOCHUNG: p.SOTIEN, TONGDURIENG: 0, TONGDUCHUNG: 0, TONGTIENPHIEUTHU: 18300000 - p.SOTIEN, TONGTIENPHIEURUT: 0 }]
        } };
    }

    var PHIEU = {
        rs: [
            { CHUNGTU_ID: 'CT8101', NOIDUNG: 'Học phí học kỳ 1 (22 tín chỉ)', SOTIENDATHU: 7915480, SOPHIEUTHU: '0001301', QUYENSO: 'Q13', MAUSO: 'C45-BB',
              NGAYIN_NGAY: '19', NGAYIN_THANG: '09', NGAYIN_NAM: '2026', DAOTAO_COCAUTOCHUC_TEN: 'TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI', MA_QHNS: '1054321' },
            { CHUNGTU_ID: 'CT8101', NOIDUNG: 'BHYT 12 tháng', SOTIENDATHU: 884520 },
            { CHUNGTU_ID: 'CT8101', NOIDUNG: 'Lệ phí thi lại', SOTIENDATHU: 350000 }
        ],
        rsThongTinDoiTuong: [{ HODEM: 'Lê Minh', TEN: 'Quân', MASO: 'BIT220263', DAOTAO_LOPQUANLY_N1_TEN: 'K66-CNTT1', MAUIN_MASO: '', TINHTRANG: 1 }]
    };

    ums.demo.add({
        'TC_ThongTinChung/LayDSCacKhoanThuQuaPos': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return POS.filter(function (r) { return !q || (r.HOTEN + ' ' + r.MASV).toLowerCase().indexOf(q) >= 0; });
        },
        'TC_ThongTinChung/LayDanhSach': tinhTrang,
        'TC_ThongTinChung/LayDSPhieuDaThu': [
            { ID: 'P1', SOPHIEUTHU: '0001188', TONGTIEN: 9150000, NGAYTHU_DD_MM_YYYY_HHMMSS: '02/09/2026 10:05:12', TAIKHOAN_NGUOITHU: 'hapt' }
        ],
        'TC_ThongTinChung/LayDSKhoanNoChung': function () { return tinhTrang({}).rows.rsKhoanThuQuaPos; },
        'TC_PhieuThu/LayTTPhieuThu_Rut': function () { return { rows: PHIEU }; },
        'TC_HoaDon/LayTTHoaDonThu_Rut': function () {
            return { rows: { rs: PHIEU.rs.map(function (x) { var c = {}; Object.keys(x).forEach(function (k) { c[k] = x[k]; }); c.TAICHINH_CACKHOANTHU_TEN = x.NOIDUNG; c.SOLUONG = 1; c.DONGIA = x.SOTIENDATHU; return c; }),
                rsThongTinDoiTuong: [{ HODEM: 'Lê Minh', TEN: 'Quân', MASO: 'BIT220263', MAUIN_MASO: 'HOADONDHLUAT', TINHTRANG: 1 }] } };
        }
    });
})();
