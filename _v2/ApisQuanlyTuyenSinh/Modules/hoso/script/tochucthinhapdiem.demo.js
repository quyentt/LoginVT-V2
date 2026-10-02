/* Dữ liệu mẫu — Tổ chức thi tuyển sinh. */
(function () {
    'use strict';
    var TS = [
        ['TSD1', 'HS01', 'TS26001', 'Nguyễn Văn', 'An'], ['TSD2', 'HS02', 'TS26002', 'Trần Thị', 'Bình'],
        ['TSD3', 'HS03', 'TS26003', 'Lê Minh', 'Châu'], ['TSD4', 'HS04', 'TS26004', 'Phạm Quốc', 'Dũng']
    ].map(function (x) {
        return { ID: x[0], TS_HOSODUTUYEN_ID: x[1], MAHOSO: x[2], TS_HOSODUTUYEN_HODEM: x[3], TS_HOSODUTUYEN_TEN: x[4],
            QLSV_NGUOIHOC_NGAYSINH: '12/03/2008', TS_HOSODUTUYEN_CMT_SO: '001208012345', DOITUONGDUTUYEN_TEN: 'Xét kết quả thi THPT',
            DOTTUYENSINH_TEN: 'Đợt 1 (tháng 7)', DSNGUYENVONGTHEOKEHOACH: 'NV1: Kỹ thuật phần mềm' };
    });
    ums.demo.add({
        'TS_ThongTin_Chung/LayLoaiDanhSachThi': [{ ID: 'LDS1', TEN: 'Danh sách thi viết' }, { ID: 'LDS2', TEN: 'Danh sách thi năng khiếu' }],
        'TS_TuyenSinhChung/LayDSMonThiTuyen': [{ ID: 'MT1', TEN: 'Toán' }, { ID: 'MT2', TEN: 'Ngữ văn' }, { ID: 'MT4', TEN: 'Tiếng Anh' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'HK1-2026', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2026-2027' }, { ID: 'HK2-2026', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2026-2027' }
        ],
        'D_Hoc/LayDanhSach': [
            { ID: 'DS1', TEN: 'Phòng thi 01 - Toán', DAOTAO_HOCPHAN_TEN: 'Toán', SOLUONG: 24, DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2026-2027' },
            { ID: 'DS2', TEN: 'Phòng thi 02 - Toán', DAOTAO_HOCPHAN_TEN: 'Toán', SOLUONG: 23, DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2026-2027' },
            { ID: 'DS3', TEN: 'Phòng thi 01 - Ngữ văn', DAOTAO_HOCPHAN_TEN: 'Ngữ văn', SOLUONG: 25, DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2026-2027' }
        ],
        'TS_ThongTin_Chung/LayDSTS_ThiSinh_Dot_DoiTuong': TS,
        'D_Hoc/LayDSNguoiHocTheoDanhSach': TS.slice(0, 2).map(function (x, i) {
            return { ID: 'NT' + i, SOBAODANH: 'SBD00' + (i + 1), MASONGUOIHOC: x.MAHOSO, HODEMNGUOIHOC: x.TS_HOSODUTUYEN_HODEM,
                TENNGUOIHOC: x.TS_HOSODUTUYEN_TEN, NGAYSINH: x.QLSV_NGUOIHOC_NGAYSINH, CMTND_SO: x.TS_HOSODUTUYEN_CMT_SO,
                DOITUONGDUTUYEN_TEN: x.DOITUONGDUTUYEN_TEN, DOTTUYENSINH_TEN: x.DOTTUYENSINH_TEN, NGUYENVONG: 'Kỹ thuật phần mềm' };
        })
    });
})();
