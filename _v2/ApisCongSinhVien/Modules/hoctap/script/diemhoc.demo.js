/* Dữ liệu mẫu cho hoctap/diemhoc — chỉ dùng ở chế độ dựng thử.
   Người học mẫu của vai trò thủ vai: SV0001 — Lăng Văn Huy (25001029), DCOT.16.2. */
(function () {
    'use strict';
    var T = 'pkg_congthongtin_hssv_thongtin.';
    var fx = {};

    fx[T + 'LayThongTinChuongTrinhHoc'] = [
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin - K16' },
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02', DAOTAO_CHUONGTRINH_TEN: 'Ngôn ngữ Anh (ngành 2) - K16' }
    ];

    /* Điểm trung bình: dòng toàn khoá (DAOTAO_THOIGIANDAOTAO_ID = null) và dòng từng học kỳ */
    function tb(tgId, nam, ky, loai, thang, tc, d) {
        return {
            DAOTAO_THOIGIANDAOTAO_ID: tgId, NAMHOC: nam, DAOTAO_THOIGIANDAOTAO_KY: ky,
            THUOCTINHLANTINH: 0, DOTHOC: null, PHAMVITONGHOPDIEM_TEN: tgId ? 'HOCKY' : '',
            LOAIDIEMTRUNGBINH_MA: loai, THANGDIEM_MA: thang, TONGSOTINCHI: tc, DIEMTRUNGBINH: d,
            TONGSOTINCHICTDT: 150      // tổng tín chỉ của chương trình (kéo gốc 30/9)
        };
    }
    function hp(id, nam, ky, ma, ten, tin, lh, lt, diem, qd, chu, dg, ghi) {
        return {
            ID: id, NAMHOC: nam, HOCKY: ky, DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten,
            DAOTAO_HOCPHAN_HOCTRINH: tin, LANHOC: lh, LANTHI: lt, DIEM: diem, DIEMQUYDOI: qd,
            DIEMQUYDOI_TEN: chu, DANHGIA_TEN: dg, GHICHU: ghi || ''
        };
    }
    fx[T + 'KetQuaHocTapCaNhan'] = { rows: {
        rsThongTinNguoiHoc: [{
            QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', QLSV_NGUOIHOC_MASO: '25001029',
            QLSV_NGUOIHOC_NGAYSINH: '14/03/2006', QLSV_NGUOIHOC_GIOITINH: 'Nam',
            QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'DCOT.16.2'
        }],
        rsDiemMoiNhat: [
            { ID: 'M1', DAOTAO_HOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật', DAOTAO_HOCPHAN_MA: 'IT2110', DIEM: 8.7, LANHOC: 1, LANTHI: 1 },
            { ID: 'M2', DAOTAO_HOCPHAN_TEN: 'Toán rời rạc', DAOTAO_HOCPHAN_MA: 'MI1140', DIEM: 7.2, LANHOC: 1, LANTHI: 1 },
            { ID: 'M3', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương', DAOTAO_HOCPHAN_MA: 'PH1110', DIEM: 4.5, LANHOC: 1, LANTHI: 2 }
        ],
        rsDiemTrungBinhChung: [
            tb(null, null, null, 'TRUNGBINHCHUNG', '10', 42, 7.64),
            tb(null, null, null, 'TRUNGBINHCHUNG', '4', 42, 3.05),
            tb(null, null, null, 'TRUNGBINHTICHLUY', '10', 39, 7.81),
            tb(null, null, null, 'TRUNGBINHTICHLUY', '4', 39, 3.18),
            tb('TG1', '2024-2025', '1', 'TRUNGBINHCHUNG', '10', 21, 7.45),
            tb('TG1', '2024-2025', '1', 'TRUNGBINHCHUNG', '4', 21, 2.95),
            tb('TG1', '2024-2025', '1', 'TRUNGBINHTICHLUY', '10', 18, 7.60),
            tb('TG1', '2024-2025', '1', 'TRUNGBINHTICHLUY', '4', 18, 3.02),
            tb('TG2', '2024-2025', '2', 'TRUNGBINHCHUNG', '10', 21, 7.83),
            tb('TG2', '2024-2025', '2', 'TRUNGBINHCHUNG', '4', 21, 3.15),
            tb('TG2', '2024-2025', '2', 'TRUNGBINHTICHLUY', '10', 21, 7.81),
            tb('TG2', '2024-2025', '2', 'TRUNGBINHTICHLUY', '4', 21, 3.18)
        ],
        rsDiemKetThucHocPhan: [
            hp('KT1', '2024-2025', '1', 'IT1110', 'Nhập môn lập trình', 3, 1, 1, 8.0, 3.5, 'B+', 'Đạt'),
            hp('KT2', '2024-2025', '1', 'MI1140', 'Toán rời rạc', 3, 1, 1, 7.2, 3, 'B', 'Đạt'),
            hp('KT3', '2024-2025', '1', 'PH1110', 'Vật lý đại cương', 3, 1, 2, 4.5, 1, 'D', 'Đạt', 'Thi lại lần 2'),
            hp('KT4', '2024-2025', '2', 'IT2110', 'Cấu trúc dữ liệu và giải thuật', 3, 1, 1, 8.7, 4, 'A', 'Đạt'),
            hp('KT5', '2024-2025', '2', 'IT2130', 'Cơ sở dữ liệu', 3, 1, 1, 7.8, 3.5, 'B+', 'Đạt'),
            hp('KT6', '2024-2025', '2', 'EN1020', 'Tiếng Anh cơ bản 2', 3, 1, 1, 6.5, 2.5, 'C+', 'Đạt')
        ],
        rsHocPhanChuaHoanThanh: [
            { DAOTAO_HOCPHAN_MA: 'MI1110', DAOTAO_HOCPHAN_TEN: 'Giải tích 1', DAOTAO_HOCPHAN_HOCTRINH: 4, DIEM: 3.2,
              DANHGIA_TEN: 'Không đạt', LANHOC: 1, LANTHI: 2, THOIGIAN: '2024-2025 - Học kỳ 1', DIEM_DANHSACHHOC_TEN: 'MI1110.03' },
            { DAOTAO_HOCPHAN_MA: 'IT2020', DAOTAO_HOCPHAN_TEN: 'Kiến trúc máy tính', DAOTAO_HOCPHAN_HOCTRINH: 3, DIEM: null,
              DANHGIA_TEN: 'Chưa có điểm', LANHOC: 1, LANTHI: 1, THOIGIAN: '2024-2025 - Học kỳ 2', DIEM_DANHSACHHOC_TEN: 'IT2020.01' }
        ]
    } };

    fx[T + 'LayKetQuaTichLuyTheoKhoi'] = { rows: {
        rsTongHop: [
            { MAKHOI: 'DC', TENKHOI: 'Kiến thức đại cương', TONGSOTINCHICUAKHOI: 40, SOBATBUOC: 34, SODATICHLUY: 18 },
            { MAKHOI: 'CN', TENKHOI: 'Kiến thức chuyên ngành', TONGSOTINCHICUAKHOI: 62, SOBATBUOC: 50, SODATICHLUY: 21 }
        ],
        rsChiTiet: [
            { MAKHOI: 'DC', TENKHOI: 'Kiến thức đại cương', DAOTAO_HOCPHAN_MA: 'MI1140', DAOTAO_HOCPHAN_TEN: 'Toán rời rạc', DAOTAO_HOCPHAN_HOCTRINH: 3, DIEM: 7.2, DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 3, DIEMQUYDOI_TEN: 'B', KETQUA: 1 },
            { MAKHOI: 'DC', TENKHOI: 'Kiến thức đại cương', DAOTAO_HOCPHAN_MA: 'PH1110', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương', DAOTAO_HOCPHAN_HOCTRINH: 3, DIEM: 4.5, DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 1, DIEMQUYDOI_TEN: 'D', KETQUA: 1 },
            { MAKHOI: 'DC', TENKHOI: 'Kiến thức đại cương', DAOTAO_HOCPHAN_MA: 'MI1110', DAOTAO_HOCPHAN_TEN: 'Giải tích 1', DAOTAO_HOCPHAN_HOCTRINH: 4, DIEM: 3.2, DANHGIA_TEN: 'Không đạt', DIEMQUYDOI: 0, DIEMQUYDOI_TEN: 'F', KETQUA: 0 },
            { MAKHOI: 'CN', TENKHOI: 'Kiến thức chuyên ngành', DAOTAO_HOCPHAN_MA: 'IT2110', DAOTAO_HOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật', DAOTAO_HOCPHAN_HOCTRINH: 3, DIEM: 8.7, DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 4, DIEMQUYDOI_TEN: 'A', KETQUA: 1 },
            { MAKHOI: 'CN', TENKHOI: 'Kiến thức chuyên ngành', DAOTAO_HOCPHAN_MA: 'IT2130', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_HOCTRINH: 3, DIEM: 7.8, DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 3.5, DIEMQUYDOI_TEN: 'B+', KETQUA: 1, HOCPHANTHUA: 1, HOCPHANTHUA_LOAIXULY: 'tự chọn' }
        ]
    } };

    fx[T + 'LayDSKetQuaXuLyHocVu'] = [
        { THOIGIAN_HIENTHI: '2024-2025 - Học kỳ 1', MUCXULY_TEN: 'Cảnh báo mức 1',
          DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin - K16', DAOTAO_LOPQUANLY_TEN: 'DCOT.16.2',
          GHICHU: 'Điểm trung bình học kỳ dưới 1.0 (hệ 4)' }
    ];

    fx[T + 'LayKQRenLuyenCaNhan'] = { rows: {
        rsKy: [
            { QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_MA: 'CNTT', DIEM: 82, XEPLOAI_TEN: 'Tốt', THOIGIAN: '2024-2025 - Học kỳ 1' },
            { QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_MA: 'CNTT', DIEM: 88, XEPLOAI_TEN: 'Tốt', THOIGIAN: '2024-2025 - Học kỳ 2' }
        ],
        rsNam: [
            { QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_MA: 'CNTT', DIEM: 85, XEPLOAI_TEN: 'Tốt', THOIGIAN: '2024-2025' }
        ],
        rsToanKhoa: [
            { QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_MA: 'CNTT', DIEM: 85, XEPLOAI_TEN: 'Tốt' }
        ]
    } };

    fx[T + 'LayDSThoiGianLichHoc'] = [
        { ID: 'TG2', THOIGIAN: '2024-2025 - Học kỳ 2' },
        { ID: 'TG1', THOIGIAN: '2024-2025 - Học kỳ 1' }
    ];

    fx[T + 'LayKetQuaDangKyHocCaNhan'] = function (o) {
        var ds = [
            { TG: 'TG1', DANGKY_LOPHOCPHAN_ID: 'LHP1', DANGKY_LOPHOCPHAN_MA: 'MI1140.02', DANGKY_LOPHOCPHAN_TEN: 'Toán rời rạc - 02', DAOTAO_HOCPHAN_HOCTRINH: 3, THONGTINGIANGVIEN: 'TS. Nguyễn Thị Lan', KIEUHOC_TEN: 'Học mới', NGAYTAO_DD_MM_YYYY_HHMMSS: '12/08/2024 08:15:20', NGUOITAO_TAIKHOAN: '25001029', THOIGIAN: '2024-2025 - Học kỳ 1', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin - K16' },
            { TG: 'TG1', DANGKY_LOPHOCPHAN_ID: 'LHP2', DANGKY_LOPHOCPHAN_MA: 'PH1110.05', DANGKY_LOPHOCPHAN_TEN: 'Vật lý đại cương - 05', DAOTAO_HOCPHAN_HOCTRINH: 3, THONGTINGIANGVIEN: 'ThS. Trần Văn Bình', KIEUHOC_TEN: 'Học mới', NGAYTAO_DD_MM_YYYY_HHMMSS: '12/08/2024 08:16:02', NGUOITAO_TAIKHOAN: '25001029', THOIGIAN: '2024-2025 - Học kỳ 1', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin - K16' },
            { TG: 'TG2', DANGKY_LOPHOCPHAN_ID: 'LHP3', DANGKY_LOPHOCPHAN_MA: 'IT2110.01', DANGKY_LOPHOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật - 01', DAOTAO_HOCPHAN_HOCTRINH: 3, THONGTINGIANGVIEN: 'TS. Phạm Minh Đức', KIEUHOC_TEN: 'Học mới', NGAYTAO_DD_MM_YYYY_HHMMSS: '06/01/2025 09:02:41', NGUOITAO_TAIKHOAN: '25001029', THOIGIAN: '2024-2025 - Học kỳ 2', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin - K16' },
            { TG: 'TG2', DANGKY_LOPHOCPHAN_ID: 'LHP4', DANGKY_LOPHOCPHAN_MA: 'MI1110.07', DANGKY_LOPHOCPHAN_TEN: 'Giải tích 1 - 07', DAOTAO_HOCPHAN_HOCTRINH: 4, THONGTINGIANGVIEN: 'ThS. Lê Thu Hà', KIEUHOC_TEN: 'Học lại', NGAYTAO_DD_MM_YYYY_HHMMSS: '06/01/2025 09:03:12', NGUOITAO_TAIKHOAN: '25001029', THOIGIAN: '2024-2025 - Học kỳ 2', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin - K16' }
        ];
        var tg = o.strDaoTao_ThoiGianDaoTao_Id;
        return { rows: {
            rsKetQuaDangKy: ds.filter(function (x) { return !tg || x.TG === tg; }),
            rsLichSuDangKy: [
                { NGUOITHUCHIEN_TAIKHOAN: '25001029', HANHDONG: 'Đăng ký', KETQUA: 'Thành công', THOIGIANTHUCHIEN: '06/01/2025 09:02:41', MAHOCPHAN: 'IT2110', TENHOCPHAN: 'Cấu trúc dữ liệu và giải thuật', DSLOPHOCPHAN: 'IT2110.01', DAOTAO_CHUONGTRINH_MA: 'CNTT16', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin - K16' },
                { NGUOITHUCHIEN_TAIKHOAN: '25001029', HANHDONG: 'Hủy đăng ký', KETQUA: 'Thành công', THOIGIANTHUCHIEN: '06/01/2025 09:05:18', MAHOCPHAN: 'EN1030', TENHOCPHAN: 'Tiếng Anh cơ bản 3', DSLOPHOCPHAN: 'EN1030.04', DAOTAO_CHUONGTRINH_MA: 'CNTT16', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin - K16' }
            ]
        } };
    };

    fx[T + 'LayDSQDCaNhan'] = [
        { SOQUYETDINH: '412/QĐ-ĐHLN', NGAYQUYETDINH: '05/09/2024', NGAYHIEULUC: '05/09/2024', NOIDUNG: 'Công nhận sinh viên trúng tuyển nhập học năm 2024', LOAIQUYETDINH_TEN: 'Nhập học' },
        { SOQUYETDINH: '128/QĐ-ĐHLN', NGAYQUYETDINH: '18/03/2025', NGAYHIEULUC: '18/03/2025', NOIDUNG: 'Cảnh báo học vụ học kỳ 1 năm học 2024-2025', LOAIQUYETDINH_TEN: 'Xử lý học vụ' }
    ];

    fx[T + 'LayDSTN_KetQua_CongNhan_VB'] = [
        { PHANLOAI_TEN: 'Chứng chỉ Giáo dục quốc phòng', CHUONGTRINH_TEN: 'Công nghệ thông tin - K16', XEPLOAI_TEN: 'Khá', SOHIEUBANG: 'GDQP-2024-0192', SOVAOSOCAPBANG: '0192' }
    ];

    fx[T + 'LayDSDiemThanhPhanTheoTKHP'] = [
        { LANHOC: 1, LANTHI: 1, DIEM_THANHPHANDIEM_TEN: 'Chuyên cần', DIEM: 9 },
        { LANHOC: 1, LANTHI: 1, DIEM_THANHPHANDIEM_TEN: 'Giữa kỳ', DIEM: 7.5 },
        { LANHOC: 1, LANTHI: 1, DIEM_THANHPHANDIEM_TEN: 'Cuối kỳ', DIEM: 8.0 },
        { LANHOC: 1, LANTHI: 2, DIEM_THANHPHANDIEM_TEN: 'Chuyên cần', DIEM: 9 },
        { LANHOC: 1, LANTHI: 2, DIEM_THANHPHANDIEM_TEN: 'Cuối kỳ', DIEM: 6.5 }
    ];

    fx[T + 'LatKetQuaDiemQuaTrinh'] = [
        { DIEM_THANHPHANDIEM_TEN: 'Chuyên cần', DIEM: 9 },
        { DIEM_THANHPHANDIEM_TEN: 'Bài tập lớn', DIEM: 8.5 },
        { DIEM_THANHPHANDIEM_TEN: 'Kiểm tra giữa kỳ', DIEM: 7.5 }
    ];

    ums.demo.add(fx);
})();
