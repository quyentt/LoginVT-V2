/* Dữ liệu mẫu cho thongtindayhoc — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'SV_HoTro_Chung/LayDSGiangVien': [
        { ID: 'GV01', HOTEN: 'TS. Nguyễn Văn An' },
        { ID: 'GV02', HOTEN: 'ThS. Trần Thị Bình' }
    ],
    'SV_HoTro_Chung/LayDSHocPhan': function (o) {
        var ds = [
            { ID: 'HP01', MA: 'INT1306', TEN: 'Cấu trúc dữ liệu và giải thuật', GV: 'GV01' },
            { ID: 'HP02', MA: 'INT1313', TEN: 'Cơ sở dữ liệu', GV: 'GV01' },
            { ID: 'HP03', MA: 'BAS1226', TEN: 'Xác suất thống kê', GV: 'GV02' }
        ];
        return ds.filter(function (x) { return !o.strGiangVien_Id || x.GV === o.strGiangVien_Id; });
    },
    'SV_LopHoc_Lich_GV/LayDanhSach': [
        { ID: 'L1', THU: 2, NGAY: '07/09/2026', GIO: 7, PHUT: '00', GIANGVIEN_MA: 'GV0012', GIANGVIEN_HOTEN: 'TS. Nguyễn Văn An', DAOTAO_HOCPHAN_MA: 'INT1306',
          DAOTAO_HOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật', DANGKY_LOPHOCPHAN_ID: 'LHP01', DANGKY_LOPHOCPHAN_TEN: 'INT1306-01',
          THONGTINVAOHETHONGHOC_KETHUA: 'https://meet.google.com/abc-defg-hij', TRANGTHAIGHINHAN_TEN: 'Vào đúng giờ', SODUNGGIO: 38, SOVAOTRUOCGIO: 5, SOVAOMUONGIO: 2, SOVANGMAT: 1 },
        { ID: 'L2', THU: 4, NGAY: '09/09/2026', GIO: 13, PHUT: '30', GIANGVIEN_MA: 'GV0012', GIANGVIEN_HOTEN: 'TS. Nguyễn Văn An', DAOTAO_HOCPHAN_MA: 'INT1313',
          DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DANGKY_LOPHOCPHAN_ID: 'LHP02', DANGKY_LOPHOCPHAN_TEN: 'INT1313-02',
          THONGTINVAOHETHONGHOC_KETHUA: 'Phòng Teams: CSDL-02, mã 7788', TRANGTHAIGHINHAN_TEN: 'Vào muộn', SODUNGGIO: 30, SOVAOTRUOCGIO: 1, SOVAOMUONGIO: 8, SOVANGMAT: 3 },
        { ID: 'L3', THU: 5, NGAY: '10/09/2026', GIO: 9, PHUT: '30', GIANGVIEN_MA: 'GV0031', GIANGVIEN_HOTEN: 'ThS. Trần Thị Bình', DAOTAO_HOCPHAN_MA: 'BAS1226',
          DAOTAO_HOCPHAN_TEN: 'Xác suất thống kê', DANGKY_LOPHOCPHAN_ID: 'LHP03', DANGKY_LOPHOCPHAN_TEN: 'BAS1226-05',
          THONGTINVAOHETHONGHOC_KETHUA: 'https://zoom.us/j/9988776655', TRANGTHAIGHINHAN_TEN: 'Chưa vào lớp', SODUNGGIO: 0, SOVAOTRUOCGIO: 0, SOVAOMUONGIO: 0, SOVANGMAT: 45 }
    ]
});
