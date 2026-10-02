/* Dữ liệu mẫu cho ketqua (Kết quả nguyện vọng) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var HP = [
        { ID: 'HPNV01', TEN: 'Giải tích 1', MA: 'MA1011', HOCTRINH: 3, SOSV: 42 },
        { ID: 'HPNV02', TEN: 'Vật lý đại cương 1', MA: 'PH1011', HOCTRINH: 3, SOSV: 27 },
        { ID: 'HPNV03', TEN: 'Tiếng Anh cơ bản 2', MA: 'EN1002', HOCTRINH: 2, SOSV: 15 }
    ];
    var SV = [
        ['SVNV01', 'BIT220263', 'Nguyễn Văn', 'An', 'CNTT K22A', 'Công nghệ thông tin', 'K22', 'Đại học chính quy'],
        ['SVNV02', 'BIT220271', 'Trần Thị', 'Bình', 'CNTT K22A', 'Công nghệ thông tin', 'K22', 'Đại học chính quy'],
        ['SVNV03', 'BBA220561', 'Lê Hoàng', 'Cường', 'QTKD K22B', 'Quản trị kinh doanh', 'K22', 'Đại học chính quy'],
        ['SVNV04', 'BBA220588', 'Phạm Thu', 'Dung', 'QTKD K22B', 'Quản trị kinh doanh', 'K22', 'Đại học chính quy'],
        ['SVNV05', 'BIT230114', 'Vũ Minh', 'Đức', 'CNTT K23A', 'Công nghệ thông tin', 'K23', 'Đại học chính quy']
    ].map(function (a) {
        return { ID: a[0], QLSV_NGUOIHOC_MASO: a[1], QLSV_NGUOIHOC_HODEM: a[2], QLSV_NGUOIHOC_TEN: a[3], DAOTAO_LOPQUANLY_TEN: a[4],
            DAOTAO_CHUONGTRINH_TEN: a[5], DAOTAO_KHOADAOTAO_TEN: a[6], DAOTAO_HEDAOTAO_TEN: a[7], DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT' + a[0] };
    });
    ums.demo.add({
        'DKH_KeHoachDangKyNV/LayDanhSach': [
            { ID: 'KHNV01', MAKEHOACH: 'NV2025-1', TENKEHOACH: 'Nguyện vọng học lại, học cải thiện HK1 2025-2026' },
            { ID: 'KHNV02', MAKEHOACH: 'NV2025-H', TENKEHOACH: 'Nguyện vọng học kỳ phụ hè 2025' }
        ],
        'DKH_KeHoachDangKyNV/LayDSHocPhanTheoKeHoach': HP,
        'PKG_DANGKY_NGUYENVONG.LayDSHocPhanTheoKeHoach': HP,
        'DKH_KeHoachDangKyNV/LayDSKieuHocTheoKeHoach': [
            { ID: 'KHOCLAI', TEN: 'Học lại' }, { ID: 'KHOCCT', TEN: 'Học cải thiện' }
        ],
        'DKH_NguyenVong/LayDSKetQuaDangKy_NguyenVong': SV,
        'DKH_NguyenVong/LayDSHocPhanDaDangKy': function (o) {
            var n = (o.strQLSV_NguoiHoc_Id + o.strDaoTao_HocPhan_Id).length + Number(String(o.strQLSV_NguoiHoc_Id).slice(-1));
            if (n % 3 === 0) return [];
            return [{ KIEUHOC_TEN: n % 2 ? 'Học lại' : 'Học cải thiện', DANHGIA_TEN: n % 2 ? 'Không đạt' : 'Đạt',
                DIEM: n % 2 ? '3.8' : '5.6', DIEMQUYDOI_TEN: n % 2 ? 'F' : 'C', NGAYTAO_DD_MM_YYYY: '0' + (n % 9 + 1) + '/08/2025' }];
        }
    });
})();
