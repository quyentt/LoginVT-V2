/* Dữ liệu mẫu cho phuckhao (Đăng ký xin phúc khảo) — chỉ dùng ở chế độ dựng thử.
   Giữ đúng tên cột máy chủ trả. Đăng ký / hủy đăng ký đổi luôn dữ liệu trong bộ nhớ
   để bảng và lịch sử phản ánh thay đổi. Người học mẫu: SV0001. */
(function () {
    'use strict';
    var P = 'pkg_thi_phach_phuckhao.';
    var fx = {};
    var HD = 'https://example.com/huong-dan/dang-ky-phuc-khao';

    fx[P + 'LayThoiGian'] = [
        { ID: 'TG1', THOIGIAN: 'Học kỳ 1 - Năm học 2026-2027' },
        { ID: 'TG2', THOIGIAN: 'Học kỳ 2 - Năm học 2025-2026' }
    ];

    function dong(o) {
        return Object.assign({
            HUONGDANSUDUNG: HD,
            QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy',
            NGAYXACNHANHOANTHANHDIEMTHI: '10/09/2026',
            NGAYHETHANDANGKYPHUCKHAO: '25/09/2026', NGAYHETHANNOPPHIPHUCKHAO: '28/09/2026',
            PHIPHUCKHAO: '50,000', TINHTRANGNOPPHI: '', NGAYDANGKYPHUCKHAO: '',
            TINHTRANG_TEN: '', KETQUAPHUCKHAO: '', KETQUAPHUCKHAO1: ''
        }, o);
    }

    var THI = [
        dong({ ID: 'DT1', TG: 'TG1', SOBAODANH: '0125', DAOTAO_HOCPHAN_MA: 'IT3010', DAOTAO_HOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật',
            DIEM_THANHPHANDIEM_TEN: 'Điểm thi kết thúc học phần', HINHTHUCTHI_TEN: 'Tự luận',
            NGAYTHI: '05/09/2026', CATHI_TEN: 'Ca 1 (07:00)', PHONGTHI_TEN: 'A2-301', DIEM: 5.5 }),
        dong({ ID: 'DT2', TG: 'TG1', SOBAODANH: '0126', DAOTAO_HOCPHAN_MA: 'MA1010', DAOTAO_HOCPHAN_TEN: 'Giải tích 1',
            DIEM_THANHPHANDIEM_TEN: 'Điểm thi kết thúc học phần', HINHTHUCTHI_TEN: 'Trắc nghiệm',
            NGAYTHI: '07/09/2026', CATHI_TEN: 'Ca 2 (09:30)', PHONGTHI_TEN: 'B1-105', DIEM: 4,
            NGAYDANGKYPHUCKHAO: '12/09/2026', TINHTRANGNOPPHI: 'Đã nộp', TINHTRANG_TEN: 'Chờ duyệt' }),
        dong({ ID: 'DT3', TG: 'TG1', SOBAODANH: '0127', DAOTAO_HOCPHAN_MA: 'PH1010', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương',
            DIEM_THANHPHANDIEM_TEN: 'Điểm thi kết thúc học phần', HINHTHUCTHI_TEN: 'Trắc nghiệm',
            NGAYTHI: '09/09/2026', CATHI_TEN: 'Ca 3 (13:30)', PHONGTHI_TEN: 'B1-202', DIEM: 6,
            NGAYDANGKYPHUCKHAO: '11/09/2026', TINHTRANGNOPPHI: 'Đã nộp', TINHTRANG_TEN: 'Đã duyệt',
            KETQUAPHUCKHAO: 7, KETQUAPHUCKHAO1: 'Tăng 1.0' }),
        dong({ ID: 'DT4', TG: 'TG2', SOBAODANH: '0098', DAOTAO_HOCPHAN_MA: 'EN1020', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 2',
            DIEM_THANHPHANDIEM_TEN: 'Điểm thi kết thúc học phần', HINHTHUCTHI_TEN: 'Vấn đáp',
            NGAYTHI: '18/05/2026', CATHI_TEN: 'Ca 1 (07:00)', PHONGTHI_TEN: 'C3-401', DIEM: 5,
            NGAYXACNHANHOANTHANHDIEMTHI: '20/05/2026', NGAYHETHANDANGKYPHUCKHAO: '05/06/2026', NGAYHETHANNOPPHIPHUCKHAO: '08/06/2026' })
    ];
    function tim(id) { return THI.filter(function (x) { return x.ID === id; })[0]; }

    var LS = {
        DT2: [{ NGAYTHUCHIEN_DD_MM_YYYY: '12/09/2026', HANHDONG: 'Đăng ký', DAOTAO_HOCPHAN_MA: 'MA1010', DAOTAO_HOCPHAN_TEN: 'Giải tích 1',
            DIEM_THANHPHANDIEM_TEN: 'Điểm thi kết thúc học phần', HINHTHUCTHI_TEN: 'Trắc nghiệm', NGAYTHI: '07/09/2026', CATHI_TEN: 'Ca 2 (09:30)', PHONGTHI_TEN: 'B1-105' }],
        DT3: [
            { NGAYTHUCHIEN_DD_MM_YYYY: '10/09/2026', HANHDONG: 'Đăng ký', DAOTAO_HOCPHAN_MA: 'PH1010', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương',
              DIEM_THANHPHANDIEM_TEN: 'Điểm thi kết thúc học phần', HINHTHUCTHI_TEN: 'Trắc nghiệm', NGAYTHI: '09/09/2026', CATHI_TEN: 'Ca 3 (13:30)', PHONGTHI_TEN: 'B1-202' },
            { NGAYTHUCHIEN_DD_MM_YYYY: '10/09/2026', HANHDONG: 'Hủy', DAOTAO_HOCPHAN_MA: 'PH1010', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương',
              DIEM_THANHPHANDIEM_TEN: 'Điểm thi kết thúc học phần', HINHTHUCTHI_TEN: 'Trắc nghiệm', NGAYTHI: '09/09/2026', CATHI_TEN: 'Ca 3 (13:30)', PHONGTHI_TEN: 'B1-202' },
            { NGAYTHUCHIEN_DD_MM_YYYY: '11/09/2026', HANHDONG: 'Đăng ký', DAOTAO_HOCPHAN_MA: 'PH1010', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương',
              DIEM_THANHPHANDIEM_TEN: 'Điểm thi kết thúc học phần', HINHTHUCTHI_TEN: 'Trắc nghiệm', NGAYTHI: '09/09/2026', CATHI_TEN: 'Ca 3 (13:30)', PHONGTHI_TEN: 'B1-202' }
        ]
    };
    function ghiLS(r, hanhDong) {
        (LS[r.ID] = LS[r.ID] || []).push({
            NGAYTHUCHIEN_DD_MM_YYYY: '23/09/2026', HANHDONG: hanhDong,
            DAOTAO_HOCPHAN_MA: r.DAOTAO_HOCPHAN_MA, DAOTAO_HOCPHAN_TEN: r.DAOTAO_HOCPHAN_TEN,
            DIEM_THANHPHANDIEM_TEN: r.DIEM_THANHPHANDIEM_TEN, HINHTHUCTHI_TEN: r.HINHTHUCTHI_TEN,
            NGAYTHI: r.NGAYTHI, CATHI_TEN: r.CATHI_TEN, PHONGTHI_TEN: r.PHONGTHI_TEN
        });
    }

    fx[P + 'LayDSThiPhucKhaoCaNhan'] = function (o) {
        return THI.filter(function (x) { return !o.strDaoTao_ThoiGianDaoTao_Id || x.TG === o.strDaoTao_ThoiGianDaoTao_Id; });
    };
    fx[P + 'LayDSLichSuPhucKhao'] = function (o) {
        return { rsKetQuaDangKy: LS[o.strThi_DanhSachThi_TuiBai_Id] || [] };
    };
    fx[P + 'DangKyPhucKhao'] = function (o) {
        var r = tim(o.strThi_DanhSachThi_TuiBai_Id);
        if (r) { r.NGAYDANGKYPHUCKHAO = '23/09/2026'; r.TINHTRANG_TEN = 'Chờ duyệt'; r.TINHTRANGNOPPHI = 'Chưa nộp'; ghiLS(r, 'Đăng ký'); }
        return [];
    };
    fx[P + 'HuyDangKyPhucKhao'] = function (o) {
        var r = tim(o.strThi_DanhSachThi_TuiBai_Id);
        if (r) { r.NGAYDANGKYPHUCKHAO = ''; r.TINHTRANG_TEN = ''; r.TINHTRANGNOPPHI = ''; ghiLS(r, 'Hủy'); }
        return [];
    };

    ums.demo.add(fx);
})();
