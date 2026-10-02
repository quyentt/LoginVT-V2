/* Dữ liệu mẫu cho ums.nhDs (_dsnh.js) — kế hoạch nhập học + người học trúng tuyển. Chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function nh(id, ho, ten, sbd, cccd, da, nganh, lop) {
        return { ID: id, QLSV_NGUOIHOC_ID: id, HODEM: ho, TEN: ten, SOBAODANH: sbd, CMTND_SO: cccd, DANHAPHOC: da,
            MASO: da ? 'DTC25' + sbd.slice(-4) : '', ANH: '', NGAYSINH_NGAY: '12', NGAYSINH_THANG: '05', NGAYSINH_NAM: '2007',
            SODIENTHOAICANHAN: '0912 345 ' + sbd.slice(-3), HOKHAU_PHUONGXAKHOIXOM: 'Xã Quyết Thắng', HOKHAU_QUANHUYEN_TEN: 'TP Thái Nguyên',
            HOKHAU_TINHTHANH_TEN: 'Thái Nguyên', HOKHAU_PHUONGXA_TEN: 'Xã Quyết Thắng', KHUVUC_TEN: 'KV1', DOITUONGDUTHI_TEN: 'Không ưu tiên',
            PHANTRAMMIENGIAM: 0, NGANHHOC_TEN: nganh, DAOTAO_NGANHNHAPHOC: nganh, DAOTAO_LOPQUANLY_TEN: da ? lop : '', MALOPDUKIEN: lop,
            DAOTAO_KHOADAOTAO_TEN: 'K25' };
    }
    var DS = [
        nh('NH01', 'Nguyễn Thị', 'Lan', 'TNU0012031', '019307001234', 1, 'Công nghệ thông tin', 'K25-CNTT1'),
        nh('NH02', 'Trần Văn', 'Hùng', 'TNU0012055', '019207004567', 1, 'Kỹ thuật phần mềm', 'K25-KTPM1'),
        nh('NH03', 'Lê Minh', 'Quân', 'TNU0012078', '019207008912', 0, 'Công nghệ thông tin', 'K25-CNTT2'),
        nh('NH04', 'Phạm Thu', 'Trang', 'TNU0012102', '019307002345', 1, 'Hệ thống thông tin', 'K25-HTTT1'),
        nh('NH05', 'Đỗ Quốc', 'Huy', 'TNU0012133', '', 0, 'Khoa học máy tính', 'K25-KHMT1'),
        nh('NH06', 'Vũ Hải', 'Yến', 'TNU0012150', '019307006789', 1, 'Công nghệ thông tin', 'K25-CNTT1')
    ];
    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc': [
            { ID: 'KH2025', TENKEHOACH: 'Nhập học đại học chính quy 2025' },
            { ID: 'KH2025B', TENKEHOACH: 'Nhập học bổ sung đợt 2 - 2025' }
        ],
        'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var r = DS.filter(function (x) {
                if (String(o.dDaNhapHoc) !== '-1' && String(x.DANHAPHOC) !== String(o.dDaNhapHoc)) return false;
                return !q || (x.HODEM + ' ' + x.TEN + ' ' + x.SOBAODANH).toLowerCase().indexOf(q) >= 0;
            });
            var s = (o.pageIndex - 1) * o.pageSize;
            return { rows: r.slice(s, s + o.pageSize), pager: r.length };
        }
    });
})();
