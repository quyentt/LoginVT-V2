/* Dữ liệu mẫu cho theodoicongno — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    var SV = [
        { ID: 'SV1', HOVATEN: 'Nguyễn Văn An', NGAYSINH: '12/03/2004', LOP: 'K66-CNTT1', TONGNO: 8450000 },
        { ID: 'SV2', HOVATEN: 'Trần Thị Bích', NGAYSINH: '05/11/2004', LOP: 'K66-KT2', TONGNO: 4200000 },
        { ID: 'SV3', HOVATEN: 'Lê Hoàng Cường', NGAYSINH: '21/07/2003', LOP: 'K65-QTKD1', TONGNO: 12600000 },
        { ID: 'SV4', HOVATEN: 'Phạm Minh Đức', NGAYSINH: '30/01/2004', LOP: 'K66-NNA1', TONGNO: 1900000 },
        { ID: 'SV5', HOVATEN: 'Hoàng Thu Hà', NGAYSINH: '14/09/2005', LOP: 'K67-CNTT2', TONGNO: 6750000 }
    ];
    var TG = [{ NGAYTONGHOPCUOICUNG: '15/09/2026', NGAYTHAYDOIDULIEUCUOICUNG: '17/09/2026' }];

    function pack(n, lk) {
        return function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var rows = SV.slice(0, n).filter(function (r) { return !q || r.HOVATEN.toLowerCase().indexOf(q) >= 0; });
            return { rows: { rsThoiGian: TG, rsThongTinTongHop: lk, rsThongTinSinhVien: rows }, pager: rows.length };
        };
    }

    ums.demo.add({
        'TC_ThongKe/LayDSCongNo_NoChung': pack(5, [
            { TEN: 'Học phí', TONGNO: 28400000 }, { TEN: 'Bảo hiểm y tế', TONGNO: 3150000 }, { TEN: 'Phí ký túc xá', TONGNO: 2350000 }
        ]),
        'TC_ThongKe/LayDSCongNo_NoRieng': pack(3, [{ TEN: 'Học phí học lại', TONGNO: 5400000 }]),
        'TC_ThongKe/LayDSCongNo_DuChung': pack(2, [{ TEN: 'Học phí', TONGDU: 1800000 }]),
        'TC_ThongKe/LayDSCongNo_DuRieng': pack(1, [{ TEN: 'Lệ phí tốt nghiệp', TONGDU: 350000 }]),
        'TC_ThongKe/LayDSCongNoChiTiet_NoChung': function (o) { return SV.filter(function (r) { return r.ID === o.strQLSV_NguoiHoc_Id; }); },
        'TC_ThongKe/LayDSCongNoChiTiet_DuChung': function (o) { return SV.filter(function (r) { return r.ID === o.strQLSV_NguoiHoc_Id; }); },
        'CM_HeDaoTao/LayDanhSach': [{ ID: 'H1', MAHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', MAHEDAOTAO: 'Liên thông' }],
        'CM_KhoaDaoTao/LayDanhSach': [{ ID: 'K1', MAKHOA: 'K65' }, { ID: 'K2', MAKHOA: 'K66' }, { ID: 'K3', MAKHOA: 'K67' }],
        'CM_ChuongTrinhDaoTao/LayDanhSach': [{ ID: 'C1', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'C2', TENCHUONGTRINH: 'Kế toán' }]
    });
})();
