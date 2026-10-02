/* Dữ liệu mẫu cho 9 màn báo cáo NCKH (ApisNCKH/baocao) — chỉ dùng ở chế độ dựng thử. Nhân sự / cơ cấu dùng mẫu chung của demo-data.js. */
(function () {
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ten) { return { ID: id, MA: id, TEN: ten }; }
    var fx = {};
    var MUC = {
        'NCKH.TCQT': ['Scopus', 'ISI/WoS', 'Quốc tế khác'], 'NCKH.TCQG': ['Tạp chí HĐGSNN', 'Tạp chí khác'],
        'NCKH.LVNC': ['Khoa học máy tính', 'Kinh tế', 'Kỹ thuật điện'], 'NCKH.PHLS': ['Giáo trình', 'Chuyên khảo', 'Tham khảo'],
        'NCKH.VTVS': ['Chủ biên', 'Tham gia'], 'NS.DMHV': ['Tiến sĩ', 'Thạc sĩ', 'Cử nhân'], 'NS.LOCD': ['Giáo sư', 'Phó giáo sư', 'Giảng viên chính'],
        'NCKH.PLDT': ['Cơ sở', 'Ứng dụng'], 'NCKH.PVHT': ['Quốc tế', 'Quốc gia', 'Cấp trường'], 'NCKH.VTHDGD': ['Giảng dạy', 'Hướng dẫn'],
        'NCKH.HDCS': ['Đạt', 'Không đạt'], 'NCKH.HDNG': ['Đạt', 'Không đạt'], 'NCKH.HDNN': ['Đạt', 'Không đạt']
    };
    Object.keys(MUC).forEach(function (k) {
        fx[DM + k] = MUC[k].map(function (t, i) { return dm(k.replace(/\W/g, '') + i, t); });
    });
    fx['NCKH_DMTapChiQuocTe/LayDanhSach'] = [{ ID: 'DMQT1', MA: 'IEEE', TENTAPCHIDANG_TEN: 'IEEE Access' }, { ID: 'DMQT2', MA: 'ELS', TENTAPCHIDANG_TEN: 'Expert Systems with Applications' }];
    fx['NCKH_DMTapChiQuocGia/LayDanhSach'] = [{ ID: 'DMQG1', MA: 'KHCN', TENTAPCHIDANG_TEN: 'Tạp chí Khoa học và Công nghệ' }, { ID: 'DMQG2', MA: 'KTPT', TENTAPCHIDANG_TEN: 'Tạp chí Kinh tế và Phát triển' }];

    /* Danh sách: lọc từ khoá tại chỗ, phân trang theo pageIndex/pageSize như máy chủ */
    function ds(rows, tkKey, cot) {
        return function (o) {
            var q = String(o[tkKey] || '').toLowerCase();
            var l = rows.filter(function (r) { return !q || String(r[cot] || '').toLowerCase().indexOf(q) >= 0; });
            var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
            return { rows: l.slice((p - 1) * s, p * s), pager: l.length };
        };
    }
    function nhieu(n, f) { var a = []; for (var i = 1; i <= n; i++) a.push(f(i)); return a; }

    var TAPCHI = nhieu(14, function (i) {
        return { ID: 'TC' + i, SOTAPCHI: 'Số ' + (i % 6 + 1), NAMCONGBO: String(2020 + i % 6), TENBAIBAO: ['Học sâu phát hiện gian lận thi trực tuyến',
            'Mô hình dự báo nhu cầu tuyển sinh', 'Tối ưu lịch giảng bằng thuật toán di truyền', 'Đánh giá chất lượng đào tạo qua khảo sát'][i % 4] + ' (' + i + ')',
            NCKH_DETAI_THANHVIEN_TEN: ['Nguyễn Văn Hùng', 'Trần Thị Mai', 'Lê Minh Tuấn'][i % 3], SOTACGIA_N: 1 + i % 4,
            THUOCLINHVUCNAO: ['Khoa học máy tính', 'Kinh tế', 'Kỹ thuật điện'][i % 3], THONGTINMINHCHUNG: i % 2 ? 'DOI: 10.1109/ACCESS.2026.' + i : '' };
    });
    fx['NCKH_TapChiQuocTe/LayDanhSach'] = ds(TAPCHI, 'strTuKhoa', 'TENBAIBAO');
    fx['NCKH_TapChiQuocGia/LayDanhSach'] = ds(TAPCHI.slice(0, 6), 'strTuKhoa', 'TENBAIBAO');
    fx['NCKH_Sach/LayDanhSach'] = ds(nhieu(5, function (i) {
        return { ID: 'S' + i, PHANLOAISACH: ['Giáo trình', 'Chuyên khảo', 'Tham khảo'][i % 3], THUOCLINHVUCNAO: 'Khoa học máy tính',
            TENSACH: ['Cấu trúc dữ liệu và giải thuật', 'Kinh tế lượng ứng dụng', 'Mạng máy tính', 'Hệ quản trị cơ sở dữ liệu', 'Học máy cơ bản'][i - 1],
            NAMXUATBAN: String(2018 + i), SOTRANGSACH_N: 180 + i * 37 };
    }), 'strTuKhoa', 'TENSACH');
    fx['NCKH_DeTai/LayDanhSach'] = ds(nhieu(4, function (i) {
        return { ID: 'DT' + i, TENDETAITIENGVIET: ['Ứng dụng học sâu phát hiện gian lận thi trực tuyến', 'Mô hình dự báo nhu cầu tuyển sinh',
            'Chuyển đổi số trong quản lý đào tạo', 'Hệ khuyến nghị học phần cho sinh viên'][i - 1] };
    }), 'strTuKhoaText', 'TENDETAITIENGVIET');
    fx['NCKH_GiaiThuong/LayDanhSach'] = ds([
        { ID: 'GT1', CANBONHAP_TENDAYDU: 'Nguyễn Văn Hùng', HINHTHUC: 'Giải nhất', NOIDUNGGIAITHUONG: 'Giải thưởng Sáng tạo kỹ thuật toàn quốc', NAMTANGTHUONG: '2025', SONGUOITHAMGIAVAOCONGTRINH_N: 3 },
        { ID: 'GT2', CANBONHAP_TENDAYDU: 'Trần Thị Mai', HINHTHUC: 'Bằng khen', NOIDUNGGIAITHUONG: 'Công trình nghiên cứu xuất sắc cấp Bộ', NAMTANGTHUONG: '2024', SONGUOITHAMGIAVAOCONGTRINH_N: 1 }
    ], 'strTuKhoa', 'NOIDUNGGIAITHUONG');
    fx['NCKH_VanBangSangChe/LayDanhSach'] = ds([
        { ID: 'VB1', TENVANBANG: 'Bằng độc quyền giải pháp hữu ích số 3012', NOIDUNGVANBANG: 'Thiết bị đo độ ẩm đất tự động', NAMCAPVANBANG: '2025', NCKH_DETAI_THANHVIEN_TEN: 'Lê Minh Tuấn', THONGTINMINHCHUNG: 'Cục SHTT' },
        { ID: 'VB2', TENVANBANG: 'Bằng độc quyền sáng chế số 41877', NOIDUNGVANBANG: 'Quy trình xử lý nước thải sinh hoạt', NAMCAPVANBANG: '2023', NCKH_DETAI_THANHVIEN_TEN: 'Nguyễn Văn Hùng', THONGTINMINHCHUNG: '' }
    ], 'strTuKhoa', 'TENVANBANG');
    fx['NCKH_HoiNghiHoiThao/LayDanhSach'] = ds([
        { ID: 'HN1', TENHOINGHIHOITHAO: 'Hội thảo quốc tế về Trí tuệ nhân tạo ICAI 2026', THOIGIANTOCHUC: '12/03/2026', THUOCLINHVUCNAO_MA: 'KHMT', SOTACGIA_N: 120, PHAMVIHOINGHIHOITHAO_TEN: 'Quốc tế', DONVITOCHUC_TEN: 'Khoa Công nghệ thông tin' },
        { ID: 'HN2', TENHOINGHIHOITHAO: 'Hội nghị khoa học sinh viên cấp trường', THOIGIANTOCHUC: '20/11/2025', THUOCLINHVUCNAO_MA: 'KT', SOTACGIA_N: 45, PHAMVIHOINGHIHOITHAO_TEN: 'Cấp trường', DONVITOCHUC_TEN: 'Phòng Khoa học công nghệ' }
    ], 'strTuKhoa', 'TENHOINGHIHOITHAO');
    fx['NCKH_SP_HuongDan_GiangDay/LayDanhSach'] = ds([
        { ID: 'HD1', TENDETAI_GIANGDAY: 'Nhận diện khuôn mặt điểm danh lớp học', PHANLOAI_TEN: 'Hướng dẫn', NAMNGHIEMTHU: '2025' },
        { ID: 'HD2', TENDETAI_GIANGDAY: 'Ứng dụng di động tra cứu điểm', PHANLOAI_TEN: 'Giảng dạy', NAMNGHIEMTHU: '2024' }
    ], 'strTuKhoa', 'TENDETAI_GIANGDAY');
    fx['NCKH_HoiDongXetChucDanh/LayDanhSach'] = ds([
        { ID: 'HDX1', DOITUONGDEXUAT_TEN: 'Giảng viên cơ hữu', CHUYENNGANH_TEN: 'Khoa học máy tính', CHUCDANHDEXUAT_TEN: 'Phó giáo sư',
            KETQUAHOIDONGCOSO_TEN: 'Đạt', KETQUAHOIDONGNGANH_TEN: 'Đạt', KETQUAHOIDONGNHANUOC_TEN: '' }
    ], 'strTuKhoa', 'CHUYENNGANH_TEN');
    ums.demo.add(fx);
})();
