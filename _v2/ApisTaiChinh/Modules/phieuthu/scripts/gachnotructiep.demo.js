/* Dữ liệu mẫu cho gachnotructiep — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var DON = [
        { ID: 'DH1', MADONHANG_GUI_NGANHANG: 'b688bce4082442598594119d8cf27439_5', NGAYTAODONHANG: '02/09/2026 08:15:22', HOVATENSINHVIEN: 'Nguyễn Văn An', MASINHVIEN: 'SV2201001', NGAYSINH: '12/03/2004', LOP: 'CNTT K22A', SOTIENDAXACNHAN: 9800000, SOTIENDATHANHTOAN: 9800000, TINHTRANGGACHNO: 'Chưa gạch nợ' },
        { ID: 'DH2', MADONHANG_GUI_NGANHANG: 'c1f0a7d3e22b4f0c9d51c3b2a8f7e610_2', NGAYTAODONHANG: '05/09/2026 14:02:10', HOVATENSINHVIEN: 'Nguyễn Văn An', MASINHVIEN: 'SV2201001', NGAYSINH: '12/03/2004', LOP: 'CNTT K22A', SOTIENDAXACNHAN: 1200000, SOTIENDATHANHTOAN: 1200000, TINHTRANGGACHNO: 'Đã gạch nợ' },
        { ID: 'DH3', MADONHANG_GUI_NGANHANG: '0e9d1c2b3a4f4e5d8c7b6a5f4e3d2c1b_1', NGAYTAODONHANG: '10/09/2026 09:40:05', HOVATENSINHVIEN: 'Trần Thị Bình', MASINHVIEN: 'SV2201002', NGAYSINH: '28/11/2004', LOP: 'KT K22B', SOTIENDAXACNHAN: 0, SOTIENDATHANHTOAN: 4900000, TINHTRANGGACHNO: 'Chưa gạch nợ' }
    ];
    var CT = {
        DH1: [
            { ID: 'CT11', MADONHANG_GUI_NGANHANG: 'b688bce4082442598594119d8cf27439_5', KHOANTHU: 'Học phí', SOTIEN: 8600000, SOTIENDATHANHTOAN: 8600000, NGAYTAO: '02/09/2026', NOIDUNG: 'Học phí HK1 2026-2027', XACNHANTHANHTOAN: 1 },
            { ID: 'CT12', MADONHANG_GUI_NGANHANG: 'b688bce4082442598594119d8cf27439_5', KHOANTHU: 'Bảo hiểm y tế', SOTIEN: 1200000, SOTIENDATHANHTOAN: 1200000, NGAYTAO: '02/09/2026', NOIDUNG: 'BHYT 12 tháng', XACNHANTHANHTOAN: 0 }
        ],
        DH2: [
            { ID: 'CT21', MADONHANG_GUI_NGANHANG: 'c1f0a7d3e22b4f0c9d51c3b2a8f7e610_2', KHOANTHU: 'Phí ký túc xá', SOTIEN: 1200000, SOTIENDATHANHTOAN: 1200000, NGAYTAO: '05/09/2026', NOIDUNG: 'KTX tháng 9', XACNHANTHANHTOAN: 1 }
        ],
        DH3: [
            { ID: 'CT31', MADONHANG_GUI_NGANHANG: '0e9d1c2b3a4f4e5d8c7b6a5f4e3d2c1b_1', KHOANTHU: 'Học phí', SOTIEN: 4900000, SOTIENDATHANHTOAN: 4900000, NGAYTAO: '10/09/2026', NOIDUNG: 'Học phí HK1 đợt 1', XACNHANTHANHTOAN: 0 }
        ]
    };
    function has(q, r) { q = (q || '').toLowerCase(); return !q || (r.MASINHVIEN + ' ' + r.MADONHANG_GUI_NGANHANG).toLowerCase().indexOf(q) >= 0; }
    ums.demo.add({
        'TC_ThanhToan_GachNo/TimThongTinTheoDonHang': function (o) {
            return (o.strMaDonHang || '').length > 12 ? DON.filter(function (r) { return has(o.strMaDonHang, r); }) : [];
        },
        'TC_ThanhToan_GachNo/TimThongTinTheoMaSinhVien': function (o) {
            var rows = DON.filter(function (r) { return r.MASINHVIEN.toLowerCase() === (o.strSinhVien || '').toLowerCase() || !o.strSinhVien; });
            return { rows: rows, pager: rows.length };
        },
        'TC_ThanhToan_GachNo/LayDSChiTietDonHang': function (o) { return CT[o.strThanhToan_DonHang_Id] || []; },
        'TC_ThanhToan_GachNo/XacNhanThanhToan': [],
        'TC_Custom/ThucHienGachNo': []
    });
})();
