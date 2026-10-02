/* Dữ liệu mẫu cho Quy định hồ sơ — chỉ dùng ở chế độ dựng thử. */
(function () {
    var KH1 = 'Thu học phí sinh viên nhập học 2025-2026', KH2 = 'Nhập học bổ sung đợt 2 năm 2025';
    var DS = [
        { ID: 'QD1', THUTU: 1, NHAPHOC_KEHOACHNHAPHOC_ID: 'NHKH1', NHAPHOC_KEHOACHNHAPHOC_TEN: KH1,
          LOAIHOSO_ID: 'HS1', LOAIHOSO_TEN: 'Học bạ THPT (bản sao)', TINHCHATHOSO_ID: 'TC1', TINHCHATHOSO_TEN: 'Bắt buộc', SOLUONG: 1,
          NHOMHOSO_ID: 'NM2', NHOMHOSO_TEN: 'Hồ sơ học tập', KIEUDULIEU_ID: 'KD1', KIEUDULIEU_TEN: 'Bản giấy', MOTA: 'Có công chứng trong 6 tháng' },
        { ID: 'QD2', THUTU: 2, NHAPHOC_KEHOACHNHAPHOC_ID: 'NHKH1', NHAPHOC_KEHOACHNHAPHOC_TEN: KH1,
          LOAIHOSO_ID: 'HS2', LOAIHOSO_TEN: 'Giấy khai sinh', TINHCHATHOSO_ID: 'TC1', TINHCHATHOSO_TEN: 'Bắt buộc', SOLUONG: 1,
          NHOMHOSO_ID: 'NM1', NHOMHOSO_TEN: 'Hồ sơ cá nhân', KIEUDULIEU_ID: 'KD1', KIEUDULIEU_TEN: 'Bản giấy', MOTA: '' },
        { ID: 'QD3', THUTU: 3, NHAPHOC_KEHOACHNHAPHOC_ID: 'NHKH1', NHAPHOC_KEHOACHNHAPHOC_TEN: KH1,
          LOAIHOSO_ID: 'HS3', LOAIHOSO_TEN: 'Ảnh 3x4', TINHCHATHOSO_ID: 'TC2', TINHCHATHOSO_TEN: 'Không bắt buộc', SOLUONG: 4,
          NHOMHOSO_ID: 'NM1', NHOMHOSO_TEN: 'Hồ sơ cá nhân', KIEUDULIEU_ID: 'KD2', KIEUDULIEU_TEN: 'Tệp điện tử', MOTA: 'Nền trắng, chụp trong 6 tháng' },
        { ID: 'QD4', THUTU: 1, NHAPHOC_KEHOACHNHAPHOC_ID: 'NHKH2', NHAPHOC_KEHOACHNHAPHOC_TEN: KH2,
          LOAIHOSO_ID: 'HS4', LOAIHOSO_TEN: 'Căn cước công dân (bản sao)', TINHCHATHOSO_ID: 'TC1', TINHCHATHOSO_TEN: 'Bắt buộc', SOLUONG: 2,
          NHOMHOSO_ID: 'NM1', NHOMHOSO_TEN: 'Hồ sơ cá nhân', KIEUDULIEU_ID: 'KD1', KIEUDULIEU_TEN: 'Bản giấy', MOTA: '' }
    ];
    var QUYEN = [
        { ID: 'Q1', LOAIHOSO_ID: 'HS1', LOAIHOSO_TEN: 'Học bạ THPT (bản sao)', NGUOIDUNG_TENDAYDU: 'Nguyễn Thị Yết', NGUOIDUNG_TAIKHOAN: 'yetnt' },
        { ID: 'Q2', LOAIHOSO_ID: 'HS1', LOAIHOSO_TEN: 'Học bạ THPT (bản sao)', NGUOIDUNG_TENDAYDU: 'Hà Mạnh Quân', NGUOIDUNG_TAIKHOAN: 'quanhm' },
        { ID: 'Q3', LOAIHOSO_ID: 'HS2', LOAIHOSO_TEN: 'Giấy khai sinh', NGUOIDUNG_TENDAYDU: 'Nguyễn Thị Yết', NGUOIDUNG_TAIKHOAN: 'yetnt' }
    ];
    var OK = { rows: [], message: '' };
    ums.demo.add({
        'NH_QuyDinhHoSo/LayDanhSach': function (o) {
            var k = o.strNHAPHOC_KeHoach_Id, q = (o.strTuKhoa || '').toLowerCase();
            var r = DS.filter(function (x) {
                return (!k || k.indexOf('NHKH') !== 0 || x.NHAPHOC_KEHOACHNHAPHOC_ID === k) && (!q || x.LOAIHOSO_TEN.toLowerCase().indexOf(q) >= 0);
            });
            return { rows: r, pager: r.length };
        },
        'NH_QuyDinhHoSo/LayChiTiet': function (o) { return DS.filter(function (x) { return x.ID === o.strId; }); },
        'NH_QuyDinhHoSo/ThemMoi': OK,
        'NH_QuyDinhHoSo/CapNhat': OK,
        'NH_QuyDinhHoSo/Xoa': OK,
        'NH_ThongTin/LayDSNhapHoc_KeHoachNhanSu': [
            { NGUOIDUNG_ID: 'ND1', NGUOIDUNG_TAIKHOAN: 'yetnt', NGUOIDUNG_TENDAYDU: 'Nguyễn Thị Yết' },
            { NGUOIDUNG_ID: 'ND2', NGUOIDUNG_TAIKHOAN: 'quanhm', NGUOIDUNG_TENDAYDU: 'Hà Mạnh Quân' },
            { NGUOIDUNG_ID: 'ND3', NGUOIDUNG_TAIKHOAN: 'haitm', NGUOIDUNG_TENDAYDU: '', QLSV_NGUOIHOC_HODEM: 'Trương Mạnh', QLSV_NGUOIHOC_TEN: 'Hải' }
        ],
        'NH_ThamSo/LayDSNhapHoc_QuyDinhHoSo_Quyen': function (o) { return QUYEN.filter(function (x) { return x.LOAIHOSO_ID === o.strLoaiHoSo_Id; }); },
        'NH_ThamSo/Them_NhapHoc_QuyDinhHoSo_Quyen': OK,
        'NH_ThamSo/Xoa_NhapHoc_QuyDinhHoSo_Quyen': OK
    });
})();
