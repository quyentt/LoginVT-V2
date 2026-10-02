/* Dữ liệu mẫu cho màn "Minh chứng hồ sơ" — chỉ dùng ở chế độ dựng thử.
   Tệp đính kèm (SV_Files) đi qua ums.files: ở chế độ dựng thử tệp chọn lên
   không gửi đi đâu, danh sách tệp đã lưu lấy từ SV_Files/LayDanhSach dưới đây. */
(function () {
    'use strict';
    var TEP = {
        MC02: [{ ID: 'FI1', FILEMINHCHUNG: 'ApisCongSinhVien/SV_Files/MC02_hocba.pdf', TENHIENTHI: 'Học bạ THPT.pdf' }],
        MC04: [{ ID: 'FI2', FILEMINHCHUNG: 'ApisCongSinhVien/SV_Files/MC04_giaykhaisinh.jpg', TENHIENTHI: 'Giấy khai sinh.jpg' }]
    };
    ums.demo.add({
        'pkg_nhaphoc_thongtin.LayDSCacHoSoNhapHoc': [
            { ID: 'MC01', LOAIHOSO_ID: 'LH01', LOAIHOSO_TEN: 'Giấy báo trúng tuyển (bản chính)', TEN: 'Nộp bản chính' },
            { ID: 'MC02', LOAIHOSO_ID: 'LH02', LOAIHOSO_TEN: 'Học bạ THPT (bản sao công chứng)', TEN: '01 bản' },
            { ID: 'MC03', LOAIHOSO_ID: 'LH03', LOAIHOSO_TEN: 'Bằng tốt nghiệp THPT hoặc giấy chứng nhận tốt nghiệp tạm thời', TEN: '01 bản' },
            { ID: 'MC04', LOAIHOSO_ID: 'LH04', LOAIHOSO_TEN: 'Giấy khai sinh (bản sao)', TEN: '01 bản' },
            { ID: 'MC05', LOAIHOSO_ID: 'LH05', LOAIHOSO_TEN: 'Giấy tờ ưu tiên (nếu có)', TEN: 'Khi thuộc diện ưu tiên' }
        ],
        'pkg_nhaphoc_thongtin.NhapHoc_ThuHoSo': function (o) { return { rows: [], message: o.strLoaiHoSo_Ids }; },
        'SV_Files/LayDanhSach': function (o) { return TEP[o.strDuLieu_Id] || []; },
        'SV_Files/ThemMoi': { rows: [], message: 'OK' },
        'SV_Files/Xoa': { rows: [], message: 'OK' }
    });
})();
