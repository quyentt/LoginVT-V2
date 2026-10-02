/* Dữ liệu mẫu cho Tạo mới hồ sơ (bản cũ) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var SV = [
        ['HS01', 'BIT250101', 'Nguyễn Minh', 'Anh', '', '', '', 'H1', 'K67'],
        ['HS02', 'BIT250102', 'Trần Thu', 'Hà', 'CTKTPM', '', '', 'H1', 'K67'],
        ['HS03', 'BBA250103', 'Lê Quốc', 'Bảo', 'CTQTKD', 'L2', '', 'H1', 'K67'],
        ['HS04', 'BIT250104', 'Phạm Ngọc', 'Diệp', '', '', '', '', ''],
        ['HS05', 'BBA250105', 'Hoàng Văn', 'Đức', 'CTQTKD', 'L2', '', 'H1', 'K67']
    ];
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    ums.demo.add({
        'SV_HoSoChuaHoanThanh/LayDanhSach': function (o) {
            var rows = SV.map(function (x, i) {
                return { ID: x[0], MASO: x[1], HODEM: x[2], TEN: x[3], ANH: '',
                    DAOTAO_CHUONGTRINH_ID: x[4], LOP_ID: x[5], QLSV_NGUOIHOC_TRANGTHAI_ID: x[6],
                    DAOTAO_HEDAOTAO_ID: x[7], DAOTAO_KHOADAOTAO_ID: x[8],
                    NGAYSINH_NGAY: String(10 + i), NGAYSINH_THANG: '0' + (i + 1), NGAYSINH_NAM: '2007',
                    BIDANH: '', QUOCTICH_ID: 'VN', GIOITINH_ID: i % 2 ? 'NU' : 'NAM', DANTOC_ID: 'KINH', TONGIAO_ID: 'KHONG',
                    TTLL_EMAILCANHAN: x[1].toLowerCase() + '@sv.edu.vn', TTLL_DIENTHOAICANHAN: '09123456' + (10 + i),
                    TTLL_DIENTHOAIGIADINH: '', TTLL_DIENTHOAICOQUAN: '', CMTND_SO: '0012070' + (10000 + i), HO: '',
                    NOISINH_TINHTHANH_TEN: 'Hà Nội', NOISINH_QUANHUYEN_TEN: 'Cầu Giấy', NOISINH_PHUONGXAKHOIXOM: 'Dịch Vọng',
                    QUEQUAN_TINHTHANH_TEN: 'Nam Định', QUEQUAN_QUANHUYEN_TEN: 'Hải Hậu', QUEQUAN_PHUONGXAKHOIXOM: 'Hải Minh',
                    HOKHAU_TINHTHANH_TEN: 'Hà Nội', HOKHAU_QUANHUYEN_TEN: 'Cầu Giấy', HOKHAU_PHUONGXAKHOIXOM: 'Dịch Vọng',
                    NOIOHIENNAY: 'Số 12 ngõ 45 Trần Thái Tông, Cầu Giấy, Hà Nội',
                    TTLL_KHICANBAOTINCHOAI_ODAU: 'Bố, cùng địa chỉ' };
            });
            var q = String(o.strTuKhoa || '').toLowerCase();
            if (q) rows = rows.filter(function (r) { return (r.MASO + ' ' + r.HODEM + ' ' + r.TEN).toLowerCase().indexOf(q) >= 0; });
            return { rows: rows, pager: rows.length };
        },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CHUN.CHLU': [dm('VN', 'VN', 'Việt Nam'), dm('LA', 'LA', 'Lào')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.GITI': [dm('NAM', 'NAM', 'Nam'), dm('NU', 'NU', 'Nữ')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.DATO': [dm('KINH', 'KINH', 'Kinh'), dm('TAY', 'TAY', 'Tày')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.TOGI': [dm('KHONG', 'KHONG', 'Không'), dm('PG', 'PG', 'Phật giáo')]
    });
})();
