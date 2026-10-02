/* Dữ liệu mẫu cho tracuusobienlai — chỉ dùng ở chế độ dựng thử.
   Ghi đè TC_BienLai/LayDanhSach của demo-data.js bằng bản có thêm
   SODADUNG / SODAHUY (giữ nguyên các cột cũ). */
(function () {
    'use strict';
    var T = ums.tcTraCuu;
    var SO = [];
    for (var i = 1; i <= 14; i++) {
        SO.push({
            ID: 'SBL' + i, SOBIENLAI: String(500 + i).padStart(7, '0'), HETHONGBIENLAI_NAM: '2026', TAICHINH_HETHONGBL_ID: i % 2 ? 'BL1' : 'BL2',
            TONGTIEN: [250000, 1200000, 563000][i % 3], NGUOITAO_TAIKHOAN: i % 2 ? 'thuquy01' : 'thuquy02',
            NGAYTAO_DD_MM_YYYY_HHMMSS: String(i).padStart(2, '0') + '/09/2026 10:0' + (i % 10) + ':00',
            TINHTRANG: i === 6 ? -1 : 1, NGUOICUOI_TENDAYDU: 'Trần Văn Hùng', NGAYCUOI_DD_MM_YYYY_HHMMSS: '16/09/2026 11:00:00'
        });
    }
    ums.demo.add({
        'TC_BienLai/LayDanhSach': [
            { ID: 'BL1', MAUSO: '01BLP', KYHIEUQUYEN: 'AA/26', NAM: '2026', MAUIN_ID: 'MI3', SOBIENLAITRONGQUYEN: 50, DODAIQUYEN: 4, DODAIBIENLAI: 7, SOKHOITAOBANDAU: 1, SODADUNG: 41, SODAHUY: 1 },
            { ID: 'BL2', MAUSO: '01BLP', KYHIEUQUYEN: 'AB/26', NAM: '2026', MAUIN_ID: 'MI3', SOBIENLAITRONGQUYEN: 100, DODAIQUYEN: 4, DODAIBIENLAI: 7, SOKHOITAOBANDAU: 1, SODADUNG: 12, SODAHUY: 0 }
        ],
        'TC_SoBienLai/LayDanhSach': function (o) {
            var rows = SO.filter(function (r) {
                if (o.strtaichinh_hethongBL_id && r.TAICHINH_HETHONGBL_ID !== o.strtaichinh_hethongBL_id) return false;
                var t = String(o.iTinhTrang);
                if (t === '1' && r.TINHTRANG !== 1) return false;
                if (t === '0' && r.TINHTRANG !== -1) return false;
                if (t === '2') return false;
                return true;
            });
            return T.demoPage(T.demoLike(rows, o.strTuKhoa, ['SOBIENLAI', 'NGUOITAO_TAIKHOAN']), o);
        },
        'TC_PhieuThu/LayTTPhieuThu_Rut': function (o) {
            return {
                rows: {
                    rs: [
                        { CHUNGTU_ID: o.strPhieuThu_Rut_Id, NOIDUNG: 'Lệ phí thi lại học phần', SOTIENDATHU: 250000, SOPHIEUTHU: '0000506', QUYENSO: 'AA/26', MAUSO: '01BLP', KYHIEU: 'AA/26', TENPHIEU: 'BIÊN LAI THU TIỀN', NGAYIN_NGAY: '06', NGAYIN_THANG: '09', NGAYIN_NAM: '2026', NGUOITAO_TENDAYDU: 'Trần Văn Hùng', DAOTAO_COCAUTOCHUC_TEN: 'TRƯỜNG ĐẠI HỌC MẪU' }
                    ],
                    rsThongTinDoiTuong: [
                        { HODEM: 'Vũ Thị Thu', TEN: 'Hà', MASO: 'SV2304118', NGAYSINH: '05/07/2005', DAOTAO_LOPQUANLY_N1_TEN: 'QTKD K23', MAUIN_MASO: 'DHGTVT_PHIEUTHU_2018', TINHTRANG: /SBL6$/.test(o.strPhieuThu_Rut_Id) ? -1 : 1 }
                    ]
                }
            };
        },
        'TC_SoBienLai/HuyBienLai': []
    });
})();
