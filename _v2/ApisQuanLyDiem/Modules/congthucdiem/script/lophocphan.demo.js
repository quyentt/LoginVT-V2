/* Dữ liệu mẫu cho lophocphan — Công thức theo lớp học phần (Quản lý điểm) — chỉ dùng ở chế độ dựng thử.
   Hệ, Khoa QL, trạng thái SV dùng dữ liệu mẫu chung của demo-data.js. */
(function () {
    var LOP = [
        ['L1', 'INT1001-01', 'Nhập môn lập trình - Nhóm 1', 'Công nghệ thông tin', 'CNTT', 'Khóa 67', 'Thứ 2 (1-3)<br>Phòng A2-201', 58, 60, 1, 0, '[CC]*0.1+[GK]*0.3+[CK]*0.6'],
        ['L2', 'INT1001-02', 'Nhập môn lập trình - Nhóm 2', 'Công nghệ thông tin', 'CNTT', 'Khóa 67', 'Thứ 3 (4-6)<br>Phòng A2-203', 61, 60, 1, 1, '[CC]*0.1+[GK]*0.3+[CK]*0.6'],
        ['L3', 'INT2003-01', 'Cơ sở dữ liệu - Nhóm 1', 'Kỹ thuật phần mềm', 'KTPM', 'Khóa 66', 'Thứ 4 (1-3)<br>Phòng B1-105', 45, 50, 0, 0, ''],
        ['L4', 'ECO1001-01', 'Kinh tế vi mô - Nhóm 1', 'Quản trị kinh doanh', 'QTKD', 'Khóa 68', 'Thứ 5 (7-9)<br>Phòng C3-302', 0, 70, 0, 0, ''],
        ['L5', 'MAT1001-03', 'Giải tích 1 - Nhóm 3', 'Công nghệ thông tin', 'CNTT', 'Khóa 68', 'Thứ 6 (1-4)<br>Phòng A1-101', 72, 75, 1, 0, '[GK]*0.4+[CK]*0.6']
    ].map(function (x) {
        return { ID: x[0], MALOP: x[1], TENLOP: x[2], DAOTAO_CHUONGTRINH_TEN: x[3], DAOTAO_CHUONGTRINH_MA: x[4], DAOTAO_KHOADAOTAO_TEN: x[5],
            THOIGIANCHITIET: x[6], SOSVDADANGKY: x[7], SOLUONGDUKIENHOC: x[8], CONGTHUCAPDUNGTHEOLOPHP: x[9], DACODIEMTKHP: x[10],
            XAUCONGTHUCDIEM: x[11], DAOTAO_THOIGIANDAOTAO_ID: 'TG1' };
    });
    var MK = { L1: [{ ID: 'M1', PHAMVIAPDUNG_TEN: 'INT1001-01', NGAY_DD_MM_YYYY_HHMMSS: '12/09/2026 08:30:12', NGUOITAO_TAIKHOAN: 'admin', LYDOMOCHANSUA: 'Sửa trọng số giữa kỳ' }] };
    ums.demo.add({
        'DKH_Chung/LayThoiGianDangKyHoc': [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }],
        'DKH_PhanCong_LopHP/LayDSKhoaToChuc': [{ ID: 'K66', TENKHOA: 'Khóa 66' }, { ID: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', TENKHOA: 'Khóa 68' }],
        'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc': [{ ID: 'CT01', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'CT02', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }],
        'DKH_PhanCong_LopHP/LayDSHocPhan': [{ ID: 'HP01', TEN: 'Nhập môn lập trình', MA: 'INT1001' }, { ID: 'HP03', TEN: 'Cơ sở dữ liệu', MA: 'INT2003' }],
        'KHCT_HeDaoTao/LayDanhSach': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'pkg_dangkyhoc_chung.LayDSHinhThucHoc': [{ ID: 'HTH1', TENHINHTHUCHOC: 'Lý thuyết', MAHINHTHUCHOC: 'LT' }, { ID: 'HTH2', TENHINHTHUCHOC: 'Thực hành', MAHINHTHUCHOC: 'TH' }],
        'D_ThanhPhanDiem/LayDSThanhPhanTKHP': [{ ID: 'TP1', TEN: 'Điểm tổng kết học phần' }, { ID: 'TP2', TEN: 'Điểm quá trình' }],
        'pkg_dangkyhoc_thongtin.LayDSLopHocPhan': function (o) {
            var size = Number(o.pageSize) || 10, i = Number(o.pageIndex) || 1;
            return { rows: LOP.slice((i - 1) * size, i * size), pager: LOP.length };
        },
        'D_CongThucDiem_ApDung/ThemMoi': function (o) {
            LOP.forEach(function (l) { if (l.ID === o.strPhamViApDung_Id) { l.XAUCONGTHUCDIEM = o.strXauCongThuc; l.CONGTHUCAPDUNGTHEOLOPHP = o.strXauCongThuc ? 1 : 0; } });
            return [];
        },
        'D_ThongTin/KeThucCongThucDiemTheoLopHP': [],
        'pkg_diem_thongtin2.LayDSDiem_CTD_MoChanSua': function (o) { return MK[o.strPhamViApDung_Id] || []; },
        'pkg_diem_thongtin2.Them_Diem_CTD_MoChanSua': function (o) {
            (MK[o.strPhamViApDung_Id] = MK[o.strPhamViApDung_Id] || []).push({ ID: 'M' + Date.now(), PHAMVIAPDUNG_TEN: o.strPhamViApDung_Id,
                NGAY_DD_MM_YYYY_HHMMSS: '25/09/2026 10:00:00', NGUOITAO_TAIKHOAN: 'admin', LYDOMOCHANSUA: o.strLyDo });
            return [];
        },
        'DKH_PhanCong_LopHP/LayDanhSach': [{ ID: 'PV1', PHAMVIAPDUNG_TEN: 'K67 - Công nghệ thông tin', PHANCAPAPDUNG_TEN: 'Chương trình' }],
        'DKH_PhanCong_LopHP/LayDSDangKyHoc': [
            { ID: 'D1', QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', QLSV_NGUOIHOC_NGAYSINH: '12/03/2004',
                QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'K67-CNTT1', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin',
                DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' },
            { ID: 'D2', QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình', QLSV_NGUOIHOC_NGAYSINH: '05/07/2004',
                QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'K67-CNTT1', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin',
                DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' }
        ]
    });
})();
