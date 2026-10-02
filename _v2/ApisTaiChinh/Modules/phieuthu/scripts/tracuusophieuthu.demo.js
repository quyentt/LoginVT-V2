/* Dữ liệu mẫu cho tracuusophieuthu — chỉ dùng ở chế độ dựng thử.
   TC_PhieuThu/LayTTPhieuThu_Rut (xem phiếu) dùng chung với tracuusobienlai. */
(function () {
    'use strict';
    var T = ums.tcTraCuu;
    var NGUOI = ['thuquy01', 'thuquy02', 'ketoan03'];
    var SO = [];
    for (var i = 1; i <= 30; i++) {
        SO.push({
            ID: 'SPT' + i, SOPHIEUTHU: String(1200 + i).padStart(7, '0'), HETHONGPHIEUTHU_NAM: '2026',
            TAICHINH_HETHONGPT_ID: i % 3 ? 'HPT1' : 'HPT2',
            NGUOITAO_TAIKHOAN: NGUOI[i % 3], NGAYTAO_DD_MM_YYYY_HHMMSS: String(1 + (i % 17)).padStart(2, '0') + '/09/2026 0' + (8 + i % 2) + ':1' + (i % 6) + ':00',
            TINHTRANG: i % 11 === 0 ? -1 : (i % 7 === 0 ? 2 : 1), TONGTIEN: [9800000, 1200000, 4900000, 563000][i % 4],
            NGUOICUOI_TENDAYDU: 'Nguyễn Thị Lan', NGAYCUOI_DD_MM_YYYY_HHMMSS: '17/09/2026 16:20:00'
        });
    }
    ums.demo.add({
        'TC_HeThongPhieuThu/LayDanhSach': [
            { ID: 'HPT1', MAUSO: 'C40-BB (quyển PT26)', SODADUNG: 312, SODAHUY: 6 },
            { ID: 'HPT2', MAUSO: 'C45-BB (quyển PT26B)', SODADUNG: 88, SODAHUY: 2 }
        ],
        'TC_SoPhieuThu/LayDanhSach': function (o) {
            var rows = SO.filter(function (r) {
                if (o.strtaichinh_hethongPT_id && r.TAICHINH_HETHONGPT_ID !== o.strtaichinh_hethongPT_id) return false;
                var t = String(o.iTinhTrang);
                if (t === '1' && r.TINHTRANG !== 1) return false;
                if (t === '2' && r.TINHTRANG !== 2) return false;
                if (t === '0' && r.TINHTRANG !== -1) return false;
                return true;
            });
            return T.demoPage(T.demoLike(rows, o.strTuKhoa, ['SOPHIEUTHU', 'NGUOITAO_TAIKHOAN']), o);
        },
        'TC_PhieuThu/LayTTPhieuThu_Rut': function (o) {
            var huy = /11$|22$/.test(o.strPhieuThu_Rut_Id || '');
            return {
                rows: {
                    rs: [
                        { CHUNGTU_ID: o.strPhieuThu_Rut_Id, NOIDUNG: 'Học phí HK1 2026-2027', SOTIENDATHU: 8600000, SOPHIEUTHU: '0001211', QUYENSO: 'PT26', MAUSO: 'C40-BB', KYHIEU: 'PT26', TENPHIEU: 'PHIẾU THU', NGAYIN_NGAY: '17', NGAYIN_THANG: '09', NGAYIN_NAM: '2026', NGUOITAO_TENDAYDU: 'Nguyễn Thị Lan', DAOTAO_COCAUTOCHUC_TEN: 'TRƯỜNG ĐẠI HỌC MẪU', MA_QHNS: '1054321', DIACHI: 'Số 1 Đại Cồ Việt, Hà Nội', SODIENTHOAI: '024 3869 1234' },
                        { CHUNGTU_ID: o.strPhieuThu_Rut_Id, NOIDUNG: 'Bảo hiểm y tế 12 tháng', SOTIENDATHU: 1200000 }
                    ],
                    rsThongTinDoiTuong: [
                        { HODEM: 'Nguyễn Văn', TEN: 'An', MASO: 'SV2201001', NGAYSINH: '12/03/2004', DAOTAO_LOPQUANLY_N1_TEN: 'CNTT K22A', NGANHHOC_N1_TEN: 'Công nghệ thông tin', KHOAHOC_N1_TEN: 'K22', MAUIN_MASO: 'DHTL_PHIEUTHU_NHAPHOC_2018', TINHTRANG: huy ? -1 : 1 }
                    ]
                }
            };
        },
        'TC_PhieuThu/HuyPhieuNhapHoc': []
    });
})();
