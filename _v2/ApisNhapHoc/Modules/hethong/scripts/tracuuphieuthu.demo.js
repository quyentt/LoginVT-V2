/* Dữ liệu mẫu — hethong/tracuuphieuthu (chỉ dùng ở chế độ dựng thử) */
(function () {
    var NS = {
        NHKH01: [{ NGUOIDUNG_ID: 'ND01', NGUOIDUNG_TAIKHOAN: 'phanh' }, { NGUOIDUNG_ID: 'ND02', NGUOIDUNG_TAIKHOAN: 'lienlt' }],
        NHKH02: [{ NGUOIDUNG_ID: 'ND02', NGUOIDUNG_TAIKHOAN: 'lienlt' }, { NGUOIDUNG_ID: 'ND03', NGUOIDUNG_TAIKHOAN: 'tuanna' }],
        NHKH03: [{ NGUOIDUNG_ID: 'ND03', NGUOIDUNG_TAIKHOAN: 'tuanna' }]
    };
    var TK = ['phanh', 'lienlt', 'tuanna'];
    var PHIEU = [];
    for (var i = 0; i < 26; i++) {
        var tt = i % 9 === 4 ? -1 : (i % 7 === 3 ? 2 : 1);
        PHIEU.push({ ID: 'PT' + i, SOPHIEUTHU: 19088 + i, NGUOITAO_TAIKHOAN: TK[i % 3], TINHTRANG: tt,
            NGAYTAO_DD_MM_YYYY: (10 + (i % 18)) + '/08/2026', KH: 'NHKH0' + (1 + i % 3) });
    }
    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc': [
            { ID: 'NHKH01', TENKEHOACH: 'Nhập học đại học chính quy khoá 2026 - đợt 1' },
            { ID: 'NHKH02', TENKEHOACH: 'Nhập học đại học chính quy khoá 2026 - đợt 2' },
            { ID: 'NHKH03', TENKEHOACH: 'Nhập học liên thông 2026' }
        ],
        'NH_KeHoachNhanSu/LayDanhSach': function (o) {
            if (!o.strTAICHINH_KeHoach_Id) return NS.NHKH01.concat(NS.NHKH02, NS.NHKH03);
            return NS[o.strTAICHINH_KeHoach_Id] || [];
        },
        'NH_ThongKe/LayDSPhieuThuTheoKeHoach': function (o) {
            var kh = (o.strTaiChinh_KeHoach_Ids || '').split(',').filter(Boolean);
            var loai = String(o.dLoaiPhieu), q = (o.strTuKhoa || '').toLowerCase();
            var ds = PHIEU.filter(function (p) {
                if (kh.length && kh.indexOf(p.KH) < 0) return false;
                if (loai === '1' && p.TINHTRANG !== 1) return false;
                if (loai === '0' && p.TINHTRANG !== -1) return false;
                if (loai === '2' && p.TINHTRANG !== 2) return false;
                return !q || String(p.SOPHIEUTHU).indexOf(q) >= 0 || p.NGUOITAO_TAIKHOAN.indexOf(q) >= 0;
            });
            var goc = PHIEU.filter(function (p) { return !kh.length || kh.indexOf(p.KH) >= 0; });
            var tong = { TONGSODATHU: goc.length,
                TONGSOHUY: goc.filter(function (p) { return p.TINHTRANG === -1; }).length,
                TONGSOSUA: goc.filter(function (p) { return p.TINHTRANG === 2; }).length };
            return ds.map(function (p) { return Object.assign({}, p, tong); });
        }
    });
})();
