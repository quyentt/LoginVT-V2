/* Dữ liệu mẫu dùng chung của module Học trực tuyến (thời gian + khung "Danh sách sinh viên") — chỉ dùng ở chế độ dựng thử. */
(function () {
    var BUOI = [
        { ID: 'LICH01', THU: 2, NGAY: '07/09/2026', GIO: 7, PHUT: '00' },
        { ID: 'LICH02', THU: 4, NGAY: '09/09/2026', GIO: 7, PHUT: '00' },
        { ID: 'LICH03', THU: 2, NGAY: '14/09/2026', GIO: 7, PHUT: '00' }
    ];
    var SV = [
        { QLSV_NGUOIHOC_ID: 'SV01', QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy' },
        { QLSV_NGUOIHOC_ID: 'SV02', QLSV_NGUOIHOC_MASO: '25001030', QLSV_NGUOIHOC_HODEM: 'Nguyễn Thị', QLSV_NGUOIHOC_TEN: 'Hà' },
        { QLSV_NGUOIHOC_ID: 'SV03', QLSV_NGUOIHOC_MASO: '25001031', QLSV_NGUOIHOC_HODEM: 'Trần Minh', QLSV_NGUOIHOC_TEN: 'Khoa' }
    ];
    ums.demo.add({
        'SV_HoTro_Chung/LayDSThoiGian': [{ ID: 'TG2026K1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2026-2027' }],
        'SV_LopHoc_Chung/LayDSNgayHocTheoLop': BUOI,
        'SV_LopHoc_Chung/LayDSSVTheoLop': SV,
        'SV_LopHoc_Chung/LayKQVaoHocCuaNguoiHoc': function (o) {
            var i = BUOI.map(function (b) { return b.ID; }).indexOf(o.strHoTroHoc_LopHoc_Lich_Id);
            return SV.filter(function (s, k) { return (k + i) % 3 !== 2; }).map(function (s, k) {
                return { QLSV_NGUOIHOC_ID: s.QLSV_NGUOIHOC_ID, NGAYVAO: BUOI[i < 0 ? 0 : i].NGAY, GIOVAO: '06', PHUTVAO: String(50 + k * 4), GIAYVAO: '12' };
            });
        }
    });
})();
