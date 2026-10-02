/* Dữ liệu mẫu dùng chung module Hồ sơ (tuyển sinh) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var KH = [
        { ID: 'TSKH2026A', TEN: 'Tuyển sinh đại học chính quy năm 2026', NAM: '2026' },
        { ID: 'TSKH2026B', TEN: 'Tuyển sinh thạc sĩ đợt 1 năm 2026', NAM: '2026' },
        { ID: 'TSKH2025A', TEN: 'Tuyển sinh đại học chính quy năm 2025', NAM: '2025' }
    ];
    var DOT = [{ DOTTUYENSINH_ID: 'DOT1', DOTTUYENSINH_TEN: 'Đợt 1 (tháng 7)' }, { DOTTUYENSINH_ID: 'DOT2', DOTTUYENSINH_TEN: 'Đợt 2 (tháng 9)' }];
    var DT = [{ DOITUONGDUTUYEN_ID: 'PT1', DOITUONGDUTUYEN_TEN: 'Xét kết quả thi THPT' }, { DOITUONGDUTUYEN_ID: 'PT2', DOITUONGDUTUYEN_TEN: 'Xét học bạ' }];
    var HS = [
        ['HS01', 'TS26001', 'Nguyễn Văn', 'An', '12/03/2008'], ['HS02', 'TS26002', 'Trần Thị', 'Bình', '05/11/2008'],
        ['HS03', 'TS26003', 'Lê Minh', 'Châu', '21/01/2008'], ['HS04', 'TS26004', 'Phạm Quốc', 'Dũng', '30/06/2008'],
        ['HS05', 'TS26005', 'Hoàng Thu', 'Hà', '14/09/2008'], ['HS06', 'TS26006', 'Vũ Đức', 'Khánh', '02/02/2008']
    ].map(function (x, i) {
        return { ID: x[0], MASO: x[1], HODEM: x[2], TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: x[4],
            DAOTAO_LOPQUANLY_TEN: i < 3 ? 'K68-KTPM1' : '', NGANHNGHE_TEN: i < 3 ? 'Kỹ thuật phần mềm' : '',
            DAOTAO_KHOADAOTAO_TEN: i < 3 ? 'Khóa 68' : '', DAOTAO_HEDAOTAO_TEN: i < 3 ? 'Đại học chính quy' : '',
            NGUOITAO_TENDAYDU: 'Nguyễn Thị Lan', NGAYTAO_DD_MM_YYYY: '1' + i + '/07/2026',
            DSNGUYENVONGTHEOKEHOACH: 'NV1: Kỹ thuật phần mềm; NV2: Quản trị kinh doanh',
            TONGTIENPHAINOP: 50000, TONGTIENDANOP: i % 2 ? 0 : 50000, TONGTIENDANOP1: i % 2 ? 'Chưa duyệt' : 'Đã duyệt' };
    });
    ums.demo.add({
        'TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach': [{ NAM: '2026' }, { NAM: '2025' }],
        'TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung': function (o) {
            return KH.filter(function (r) { return !o.strNam || r.NAM === String(o.strNam); });
        },
        'TS_HeDaoTao/LayDanhSach': [{ ID: 'HEDH', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'HETS', TENHEDAOTAO: 'Thạc sĩ' }],
        'TS_KhoaDaoTao/LayDanhSach': function (o) {
            return o.strDaoTao_HeDaoTao_Id === 'HETS' ? [{ ID: 'KTS26', TENKHOA: 'Cao học K26' }]
                : [{ ID: 'K68', TENKHOA: 'Khóa 68' }, { ID: 'K67', TENKHOA: 'Khóa 67' }];
        },
        'TS_Dot_DoiTuong/LayDanhSach': function () {
            var r = [];
            DOT.forEach(function (d) { DT.forEach(function (t) { r.push(Object.assign({ ID: d.DOTTUYENSINH_ID + t.DOITUONGDUTUYEN_ID }, d, t)); }); });
            return r;
        },
        'TS_Dot_DoiTuong/LayDSTS_Dot': DOT,
        'TS_Dot_DoiTuong/LayDSTS_DoiTuong': DT,
        'TS_ThongTin_Chung/LayDSTS_HoSoDuTuyen': HS,
        'TS_ThiSinh_NguyenVong/LayDanhSach': [
            { ID: 'NV1', NGANHNGHE_MA: '7480103', NGANHNGHE_TEN: 'Kỹ thuật phần mềm', TS_TOHOP_TEN: 'A00', DSMONTHITHEOTOHOPNGANH_ID: 'MT1,MT2,MT3', TS_XACNHANDUYETTT_TEN: 'Đã duyệt' },
            { ID: 'NV2', NGANHNGHE_MA: '7340101', NGANHNGHE_TEN: 'Quản trị kinh doanh', TS_TOHOP_TEN: 'D01', DSMONTHITHEOTOHOPNGANH_ID: 'MT1,MT4', TS_XACNHANDUYETTT_TEN: 'Chờ duyệt' }
        ],
        'SV_Files/LayDanhSach': [{ ID: 'F1', FILEMINHCHUNG: 'Upload/TuyenSinh/hocba_2026.pdf', TENHIENTHI: 'Học bạ THPT.pdf' }],
        'TS_TaiKhoan/XoaDuLieuTuyenSinh': [],
        'CMS_Files/GopFile': { rows: 'Temp/hoso_tuyensinh.zip' }
    });
})();
