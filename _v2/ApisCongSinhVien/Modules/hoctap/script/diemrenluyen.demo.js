/* Dữ liệu mẫu cho hoctap/diemrenluyen — chỉ dùng ở chế độ dựng thử.
   Người học mẫu của vai trò thủ vai: SV0001 — Lăng Văn Huy (25001029), DCOT.16.2. */
(function () {
    'use strict';
    var T = 'pkg_diemrenluyen_tinhtoan.';
    var KH = 'KH2425HK2';
    var fx = {};

    fx[T + 'LayDSKeHoach'] = [
        { ID: KH, TEN: 'Đánh giá rèn luyện học kỳ 2 năm học 2024-2025' },
        { ID: 'KH2425HK1', TEN: 'Đánh giá rèn luyện học kỳ 1 năm học 2024-2025' }
    ];

    /* Cấu trúc phiếu: mục cha (I…V) + các tiêu chí con; chỉ tiêu chí con cho nhập */
    function tp(id, cha, ten, nhap, khId) {
        return {
            THANHPHAN_ID: id, THANHPHAN_CHA_ID: cha, THANHPHAN_TEN: ten,
            NHAPTRUCTIEP: nhap ? 1 : 0, DRL_KEHOACH_ID: khId || KH
        };
    }
    var cauTruc = {};
    cauTruc[KH] = [
        tp('I', null, 'I. Ý thức học tập (tối đa 20 điểm)', false),
        tp('I1', 'I', 'Ý thức và thái độ trong học tập', true),
        tp('I2', 'I', 'Kết quả học tập trong học kỳ', true),
        tp('I3', 'I', 'Tham gia nghiên cứu khoa học, thi olympic, câu lạc bộ học thuật', true),
        tp('II', null, 'II. Ý thức chấp hành nội quy, quy chế (tối đa 25 điểm)', false),
        tp('II1', 'II', 'Chấp hành nội quy, quy chế của Nhà trường', true),
        tp('II2', 'II', 'Chấp hành pháp luật của Nhà nước', true),
        tp('III', null, 'III. Ý thức tham gia hoạt động chính trị - xã hội, văn hóa, thể thao (tối đa 20 điểm)', false),
        tp('III1', 'III', 'Tham gia hoạt động của lớp, khoa, trường', true),
        tp('III2', 'III', 'Tham gia hoạt động tình nguyện, công tác xã hội', true),
        tp('IV', null, 'IV. Ý thức công dân trong quan hệ cộng đồng (tối đa 25 điểm)', false),
        tp('IV1', 'IV', 'Chấp hành chủ trương của Đảng, chính sách của Nhà nước tại nơi cư trú', true),
        tp('IV2', 'IV', 'Quan hệ với bạn bè, thầy cô, cộng đồng', true),
        tp('V', null, 'V. Ý thức, kết quả tham gia công tác phụ trách lớp, đoàn thể (tối đa 10 điểm)', false),
        tp('V1', 'V', 'Giữ chức vụ trong lớp, chi đoàn, câu lạc bộ', true),
        tp('V2', 'V', 'Được khen thưởng trong học kỳ', true)
    ];
    cauTruc.KH2425HK1 = cauTruc[KH].map(function (x) {
        return tp(x.THANHPHAN_ID, x.THANHPHAN_CHA_ID, x.THANHPHAN_TEN, x.NHAPTRUCTIEP, 'KH2425HK1');
    });
    fx[T + 'LayDSDRL_CauTrucHienThi'] = function (o) { return cauTruc[o.strDRL_KeHoach_Id] || []; };

    /* Điểm đã lưu — bộ nhớ tạm để bấm "Cập nhật" xong mở lại thấy giá trị mới */
    var daLuu = {};
    daLuu[KH] = { I1: 18, I2: 15, II1: 23, II2: 25, III1: 16, IV1: 24, V1: 8 };
    daLuu.KH2425HK1 = { I1: 17, I2: 14, II1: 22, III1: 15, IV1: 23, V1: 6 };

    fx[T + 'LayDSKetQua'] = function (o) {
        var kh = o.strDRL_KeHoach_Id, d = daLuu[kh] || {};
        return { rows: {
            rsThongTin: [{
                HODEM: 'Lăng Văn', TEN: 'Huy', MASO: '25001029', QLSV_NGUOIHOC_NGAYSINH: '14/03/2006',
                DAOTAO_LOPQUANLY_TEN: 'DCOT.16.2', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin',
                DAOTAO_KHOADAOTAO_TEN: 'K16', DAOTAO_THOIGIANDAOTAO_KY: kh === KH ? '2' : '1',
                DAOTAO_THOIGIANDAOTAO_NAM: '2024-2025'
            }],
            rs: Object.keys(d).map(function (k) { return { THANHPHAN_ID: k, THANHPHAN_GIATRI: d[k] }; })
        } };
    };

    fx[T + 'Them_DRL_CauTrucHienThi_KetQua'] = function (o) {
        var kh = o.strDRL_KeHoach_Id;
        if (!daLuu[kh]) daLuu[kh] = {};
        daLuu[kh][o.strThanhPhan_Id] = o.strThanhPhan_GiaTri;
        return { rows: [], message: o.strThanhPhan_Id };
    };

    /* Tệp minh chứng (ums.files → SV_Files/LayDanhSach theo strDuLieu_Id) */
    fx['SV_Files/LayDanhSach'] = function (o) {
        return String(o.strDuLieu_Id || '').indexOf('III1') > 0
            ? [{ ID: 'F1', FILEMINHCHUNG: 'ApisCongSinhVien/RenLuyen/giay-chung-nhan-tinh-nguyen.pdf', TENHIENTHI: 'giay-chung-nhan-tinh-nguyen.pdf' }]
            : [];
    };

    ums.demo.add(fx);
})();
