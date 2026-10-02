/* Dữ liệu mẫu — taichinh/checkinnhaphoc (chỉ dùng ở chế độ dựng thử) */
(function () {
    var HO = ['Nguyễn Văn', 'Trần Thị', 'Lê Hoàng', 'Phạm Minh', 'Hoàng Thu', 'Vũ Đức', 'Đặng Bảo', 'Bùi Ngọc'];
    var TEN = ['An', 'Bình', 'Cường', 'Dung', 'Giang', 'Hải', 'Khánh', 'Linh', 'Minh', 'Nam', 'Oanh', 'Phúc'];
    var NGANH = ['Công nghệ thông tin', 'Quản trị kinh doanh', 'Ngôn ngữ Anh', 'Kế toán'];
    var DS = [];
    for (var i = 0; i < 27; i++) {
        var da = i % 3 !== 2 ? 1 : 0;
        DS.push({
            ID: 'TS' + (1000 + i), KH: i % 4 === 3 ? 'NHKH02' : 'NHKH01',
            HODEM: HO[i % HO.length], TEN: TEN[i % TEN.length], SOBAODANH: 'SBD26' + (4100 + i),
            MASO: da ? 'BIT26' + (1200 + i) : '', ANH: '', DANHAPHOC: da,
            NGAYSINH_NGAY: 1 + (i % 28), NGAYSINH_THANG: 1 + (i % 12), NGAYSINH_NAM: 2008,
            SODIENTHOAICANHAN: '09' + (12345670 + i), HOKHAU_PHUONGXAKHOIXOM: 'Xã Yên Sở', HOKHAU_QUANHUYEN_TEN: 'Hoàng Mai',
            HOKHAU_TINHTHANH_TEN: 'Hà Nội', DAOTAO_NGANHNHAPHOC: NGANH[i % 4], NGANHHOC_TEN: NGANH[i % 4],
            DAOTAO_LOPQUANLY_TEN: da ? 'K26-' + ['CNTT', 'QTKD', 'NNA', 'KT'][i % 4] + '0' + (1 + i % 2) : '', MALOPDUKIEN: 'DK' + (i % 4),
            CMTND_SO: '0012080' + (10000 + i), DIEMTS_TONGDIEM: 21.5 + (i % 7) * 0.75, DOITUONGDUTHI_TEN: i % 5 ? '' : 'Đối tượng 06',
            PHANTRAMMIENGIAM: i % 6 ? 0 : 50, KHUVUC_TEN: ['KV1', 'KV2', 'KV2-NT', 'KV3'][i % 4], SODATHUTIEN: da ? 12500000 : 0
        });
    }
    var dem = 0;
    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc': [
            { ID: 'NHKH01', TENKEHOACH: 'Nhập học đại học chính quy khoá 2026 - đợt 1' },
            { ID: 'NHKH02', TENKEHOACH: 'Nhập học đại học chính quy khoá 2026 - đợt 2' },
            { ID: 'NHKH03', TENKEHOACH: 'Nhập học liên thông 2026' }
        ],
        'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS': function (o) {
            var dk = String(o.dDaNhapHoc), q = (o.strTuKhoa || '').toLowerCase();
            var ds = DS.filter(function (r) {
                if (r.KH !== o.strTaiChinh_KeHoach_Id) return false;
                if (dk === '1' && r.DANHAPHOC !== 1) return false;
                if (dk === '0' && r.DANHAPHOC !== 0) return false;
                return !q || (r.HODEM + ' ' + r.TEN + ' ' + r.SOBAODANH).toLowerCase().indexOf(q) >= 0;
            });
            var size = Number(o.pageSize) || 10, idx = Number(o.pageIndex) || 1;
            return { rows: ds.slice((idx - 1) * size, idx * size), pager: ds.length };
        },
        'NH_QuayNhapHoc/ThucHienTiepNhanNhapHoc': function (o) {
            var r = DS.filter(function (x) { return x.ID === o.strQLSV_NguoiHoc_TTTS_Id; })[0] || {};
            r.DANHAPHOC = 1;
            if (!r.MASO) r.MASO = 'BIT26' + (1500 + (++dem));
            return { rows: {
                rsTiepNhan: [{ MATIEPNHAN: 'TN' + (100 + (++dem)), NGAYTAO_DD_MM_YYYY: '27/09/2026', TONGSOTENDANOP: 12500000,
                    TINHTRANGTHANHTOAN: 'Chưa thanh toán' }],
                rsSinhVien: [{ HOVATEN: (r.HODEM || '') + ' ' + (r.TEN || ''), MASINHVIEN: r.MASO }],
                rs: [{ MADINHDANHTONG: '96247CMC' + (r.MASO || ''), SOTIENPHAINOP: 12500000 }]
            } };
        }
    });
})();
