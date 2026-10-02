/* Dữ liệu mẫu cho tracuusohoadon — chỉ dùng ở chế độ dựng thử.
   Chi tiết một hoá đơn (TC_HoaDon/LayTTHoaDonThu_Rut) dùng chung xuathoadon.demo.js. */
(function () {
    function hd(i, so, tien, tt, extra) {
        var r = { ID: 'SHD' + i, SOHOADON: so, TONGTIEN: tien, TINHTRANG: tt, NGUOITAO_TAIKHOAN: i % 2 ? 'trang.ht' : 'nam.dv',
            NGAYTAO_DD_MM_YYYY_HHMMSS: (10 + i) + '/09/2025 0' + (i % 9) + ':15:20', MASONGUOIMUAHANG: 'DTC2252001' + (10 + i),
            HOTENNGUOIMUAHANG: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Vũ Thu Hà', 'Đặng Quốc Khánh'][i % 6],
            TONGTIENDAXUATHOADON: 62817600, LAHOADONDIENTU: 0, DUONGDANFILEHOADON: null, DUONGDANFILETONGHOP: null,
            TRACSECTION_ID: null, EMAIL: '', TAICHINH_HOADON_NAM: 2025 };
        for (var k in (extra || {})) r[k] = extra[k];
        return r;
    }
    var ALL = [
        hd(1, '0000131', 9513600, 1, { EMAIL: 'an.nv@ictu.edu.vn' }),
        hd(2, '0000132', 8250000, 1, { LAHOADONDIENTU: 1, DUONGDANFILEHOADON: 'HDDTFILE/0000132.pdf', DUONGDANFILETONGHOP: 'HDDTFILE/0000132.xml', EMAIL: 'binh.tt@ictu.edu.vn' }),
        hd(3, '0000133', 1500000, -1),
        hd(4, '0000134', 1263600, 2),
        hd(5, '0000135', 12500000, 1, { LAHOADONDIENTU: 1, TRACSECTION_ID: 'TX-8812', EMAIL: 'sai-email' }),
        hd(6, '0000136', 90000, 1)
    ];
    ums.demo.add({
        'TC_HoaDon/LayDanhSach': [
            { ID: 'M1', KYHIEU: 'C25TAA', MAUSO: '2/001', SODADUNG: 136, SODAHUY: 4 },
            { ID: 'M2', KYHIEU: 'C25TBB', MAUSO: '2/002', SODADUNG: 58, SODAHUY: 2 }
        ],
        'TC_NguoiDungDaThuTien/LayDanhSach': [{ ID: 'U1', TAIKHOAN: 'trang.ht' }, { ID: 'U2', TAIKHOAN: 'nam.dv' }],
        'TC_HoaDon/LayDSTaiChinh_SoHoaDon': function (o) {
            var t = String(o.dTinhTrang);
            var l = ALL.filter(function (r) { return t === '-1' || t === 'undefined' || String(r.TINHTRANG) === (t === '0' ? '-1' : t); });
            var q = String(o.strTuKhoa || '').toLowerCase();
            if (q) l = l.filter(function (r) { return (r.SOHOADON + r.HOTENNGUOIMUAHANG + r.MASONGUOIMUAHANG).toLowerCase().indexOf(q) >= 0; });
            return { rows: l, pager: l.length };
        },
        'HDDT_HoaDon/GetServerPath': { rows: 'D:/HDDT/Files', message: '' },
        'HDDT_HoaDon/GetFiles': { rows: ['HDDTFILE/0000135.pdf', 'HDDTFILE/0000135.xml', '0000135'], message: '' },
        'TC_HoaDon/InNhieuHoaDon': { rows: null, message: '' },
        'CMS_NguoiDung/SendEmail': { rows: null, message: '' }
    });
})();
