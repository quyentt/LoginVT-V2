/* Dữ liệu mẫu cho quyettoan — chỉ dùng ở chế độ dựng thử.
   Người học mẫu: SV0001 — Lăng Văn Huy (25001029), DCOT.16.2. */
(function () {
    'use strict';
    var F = 'pkg_congthongtin_hssv_thongtin.';

    var SV = {
        QLSV_NGUOIHOC_HOTEN: 'Lăng Văn Huy', QLSV_NGUOIHOC_MASO: '25001029',
        QLSV_NGUOIHOC_NGAYSINH: '12/04/2007', DAOTAO_LOPQUANLY_TEN: 'DCOT.16.2',
        GHICHU: 'Kỹ thuật phần mềm', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin'
    };
    function d(ten, giaTri, dv, laTien) {
        var r = { THANHPHAN_TEN: ten, THANHPHAN_GIATRI: giaTri, DONVITINH_TEN: dv, DONVITINH_LATIEN: laTien ? 1 : 0 };
        for (var k in SV) r[k] = SV[k];
        return r;
    }

    var kq = {
        DQT1: [
            d('Tổng số tín chỉ đã tích lũy', 78, 'Tín chỉ'),
            d('Tổng số tín chỉ phải đóng học phí', 74, 'Tín chỉ'),
            d('Đơn giá học phí bình quân', 485000, 'đồng', true),
            d('Tổng học phí phải nộp', 35890000, 'đồng', true),
            d('Tổng học phí được miễn giảm', 1650000, 'đồng', true),
            d('Tổng học phí đã nộp', 34240000, 'đồng', true),
            d('Còn phải nộp', 0, 'đồng', true)
        ],
        DQT2: [
            d('Tổng số tín chỉ đã tích lũy', 45, 'Tín chỉ'),
            d('Tổng học phí phải nộp', 21500000, 'đồng', true),
            d('Tổng học phí đã nộp', 21500000, 'đồng', true),
            d('Còn phải nộp', 0, 'đồng', true)
        ]
    };

    var fx = {};
    fx[F + 'LayDSDotQuyetToan'] = [
        { ID: 'DQT1', TEN: 'Quyết toán học phí đợt 2 - năm học 2024-2025',
          MOTA: 'Học phí tạm quyết toán đến hết học kỳ 2 năm học 2024-2025; nếu số tín chỉ đào tạo hoặc mức học phí thay đổi, nhà trường điều chỉnh quyết toán vào cuối khóa.' },
        { ID: 'DQT2', TEN: 'Quyết toán học phí đợt 1 - năm học 2023-2024', MOTA: '' }
    ];
    fx[F + 'LayKetQuaQuyetToanCaNhan'] = function (o) {
        return kq[o.strTaiChinh_DotQuyetToan_Id] || [];
    };

    ums.demo.add(fx);
})();
