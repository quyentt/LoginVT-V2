/* Dữ liệu mẫu cho _hd_xacnhan.js (xác nhận kê khai đề tài SV / giảng dạy / hướng dẫn sau đại học — ApisNCKH)
   — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten, o) { return Object.assign({ ID: id, MA: ma, TEN: ten }, o || {}); }
    var XNKK = [
        dm('XN0', 'XNKKCHUAKHAI', 'Chưa kê khai'),
        dm('XN1', 'XNKKDAXACNHAN', 'Đã xác nhận', { THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color:#198754' }),
        dm('XN2', 'XNKKYEUCAUSUA', 'Yêu cầu bổ sung', { THONGTIN1: 'fa fa-pencil-square-o', THONGTIN2: 'color:#d97706' }),
        dm('XN3', 'XNKKTUCHOI', 'Không xác nhận', { THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color:#dc2626' })
    ];
    var fx = {};
    fx[DM + 'NCKH.XNKK'] = XNKK;
    fx[DM + 'NCKH.VTHDGD'] = [dm('HDGD1', 'GIANGDAY', 'Giảng dạy'), dm('HDGD2', 'HUONGDAN', 'Hướng dẫn')];
    fx['NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung'] = XNKK;
    fx['NS_HoSoV2/LayDanhSach'] = function (o) {
        var ds = [{ ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001', DV: 'KCNTT' }, { ID: 'CB2', HOTEN: 'Trần Thị Mai', MASO: 'CB002', DV: 'KCNTT' },
            { ID: 'CB3', HOTEN: 'Lê Quang Minh', MASO: 'CB003', DV: 'KKT' }];
        return ds.filter(function (x) { return !o.strDaoTao_CoCauToChuc_Id || x.DV === o.strDaoTao_CoCauToChuc_Id; });
    };

    var XN = { KETQUAXACNHAN_TEN: 'Đã xác nhận', KETQUAXACNHAN_THONGTIN1: 'fa fa-check-circle', KETQUAXACNHAN_THONGTIN2: 'color:#198754', KETQUAXACNHAN_NOIDUNG: 'Đủ minh chứng' };
    var DTSV = [
        Object.assign({ ID: 'DTSV1', TENDETAI: 'Nhận diện khuôn mặt để điểm danh lớp học', NAMTHUCHIEN: '2025', NAMNGHIEMTHU: '2026', DIEMNGHIEMTHU: '9.2',
            XEPLOAI_TEN: 'Xuất sắc', QUYETDINHPHEDUYET: '112/QĐ-ĐHCN', QUYETDINHNGHIEMTHU: '58/QĐ-ĐHCN', MOTA: 'Nhóm Nguyễn Minh Anh, Lê Hoàng Nam' }, XN),
        { ID: 'DTSV2', TENDETAI: 'Ứng dụng IoT theo dõi chất lượng không khí ký túc xá', NAMTHUCHIEN: '2026', XEPLOAI_TEN: 'Tốt', MOTA: 'Trần Thu Hà' },
        { ID: 'DTSV3', TENDETAI: 'Chatbot tư vấn tuyển sinh', NAMTHUCHIEN: '2026', MOTA: 'Phạm Quốc Bảo' }
    ];
    var HDGD = [
        Object.assign({ ID: 'GD1', TENDETAI_GIANGDAY: 'Học máy nâng cao', MOTA: 'Cao học KHMT K32', THOIGIANBATDAU: '02/2026', THOIGIANKETTHUC: '05/2026',
            NAMNGHIEMTHU: '2026', PHANLOAI_ID: 'HDGD1', GIANGVIEN_HD_GD: 'Nguyễn Văn Hùng', NOIDUNG_HD_GD: 'Giảng lý thuyết 30 tiết' }, XN),
        { ID: 'GD2', TENDETAI_GIANGDAY: 'Phương pháp nghiên cứu khoa học', MOTA: 'NCS khoá 2025', THOIGIANBATDAU: '09/2025', THOIGIANKETTHUC: '12/2025',
            NAMNGHIEMTHU: '2025', PHANLOAI_ID: 'HDGD1', GIANGVIEN_HD_GD: 'Trần Thị Mai', NOIDUNG_HD_GD: 'Seminar 15 tiết' },
        Object.assign({ ID: 'HD1', TENDETAI_GIANGDAY: 'Phát hiện gian lận thi trực tuyến bằng học sâu', MOTA: 'Lê Văn Tâm (học viên cao học)', THOIGIANBATDAU: '01/2025',
            THOIGIANKETTHUC: '12/2025', NAMNGHIEMTHU: '2026', PHANLOAI_ID: 'HDGD2', GIANGVIEN_HD_GD: 'Nguyễn Văn Hùng', VAITRO_HD_GD: 'Hướng dẫn chính' }, XN),
        { ID: 'HD2', TENDETAI_GIANGDAY: 'Tối ưu lịch thi bằng giải thuật di truyền', MOTA: 'Phạm Thu Trang (NCS)', THOIGIANBATDAU: '03/2024',
            THOIGIANKETTHUC: '03/2027', PHANLOAI_ID: 'HDGD2', GIANGVIEN_HD_GD: 'Lê Quang Minh', VAITRO_HD_GD: 'Hướng dẫn phụ' }
    ];
    function loc(rows, o, ten) {
        return rows.filter(function (r) {
            return (!o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id) && (!o.strTuKhoa || r[ten].toLowerCase().indexOf(String(o.strTuKhoa).toLowerCase()) >= 0);
        });
    }
    fx['NCKH_SP_QuanLyDeTaiSinhVien/LayDanhSach'] = function (o) { return loc(DTSV, o, 'TENDETAI'); };
    fx['NCKH_SP_HuongDan_GiangDay/LayDanhSach'] = function (o) { return loc(HDGD, o, 'TENDETAI_GIANGDAY'); };

    function nguoi(hd, ten, ma, o) { return Object.assign({ ID: 'R' + ma, HODEM: hd, TEN: ten, MASO: ma, LATHANHVIENCUATRUONG: 1 }, o || {}); }
    fx['NCKH_SP_QLDTSV_GiangVien/LayDanhSach'] = function (o) { return o.strNCKH_SP_SinhVien_DeTai_Id === 'DTSV1' ? [nguoi('Nguyễn Văn', 'Hùng', 'CB001', { SINHVIEN_ID: 'CB1' })] : []; };
    fx['NCKH_SP_QLDTSV_SinhVien/LayDanhSach'] = function (o) {
        return o.strNCKH_SP_SinhVien_DeTai_Id === 'DTSV1' ? [nguoi('Nguyễn Minh', 'Anh', 'SV2201', { VAITRO_TEN: 'Chủ nhiệm' }), nguoi('Lê Hoàng', 'Nam', 'SV2202', { VAITRO_TEN: 'Thành viên' })]
            : o.strNCKH_SP_SinhVien_DeTai_Id === 'DTSV2' ? [nguoi('Trần Thu', 'Hà', 'SV2310', { VAITRO_TEN: 'Chủ nhiệm' })] : [];
    };
    fx['NCKH_SP_NguonKinhPhi/LayDanhSach'] = function (o) { return o.strSanPham_Id === 'DTSV1' ? [{ ID: 'KP1', NGUONKINHPHI_TEN: 'Ngân sách nhà nước', SOTIEN: '15000000', DONVITINH_TEN: 'VNĐ' }] : []; };
    fx['NCKH_SP_HDGD_GiangVien_GD/LayDanhSach'] = function (o) { return o.strNCKH_SP_HD_GD_Id === 'GD1' ? [nguoi('Nguyễn Văn', 'Hùng', 'CB001', { NOIDUNGGIANGDAY: '3 tháng', THOIGIAN: 'Giảng lý thuyết 30 tiết' })] : []; };
    fx['NCKH_SP_HDGD_GiangVien_HD/LayDanhSach'] = function (o) { return o.strNCKH_SP_HD_GD_Id === 'HD1' ? [nguoi('Nguyễn Văn', 'Hùng', 'CB001', { VAITRO_TEN: 'Hướng dẫn chính' })] : []; };
    fx['NCKH_SP_HDGD_SinhVien/LayDanhSach'] = function (o) { return /1$/.test(o.strNCKH_SP_HD_GD_Id) ? [nguoi('Lê Văn', 'Tâm', 'HV2501')] : []; };

    var LS = { DTSV1: [{ TINHTRANG_TEN: 'Đã xác nhận', NOIDUNG: 'Đủ minh chứng', NGUOIXACNHAN_TENDAYDU: 'Trần Thị Mai', NGAYTAO_DD_MM_YYYY: '12/09/2026' }] };
    fx['NCKH_SP_XacNhanKeKhai/LayDanhSach'] = function (o) { return (LS[o.strSanPham_Id] || []).slice(); };
    fx['NCKH_SP_XacNhanKeKhai/ThemMoi'] = function (o) {
        var tt = XNKK.filter(function (x) { return x.ID === o.strTinhTrang_Id; })[0] || {};
        (LS[o.strSanPham_Id] || (LS[o.strSanPham_Id] = [])).push({ TINHTRANG_TEN: tt.TEN, NOIDUNG: o.strNoiDung, NGUOIXACNHAN_TENDAYDU: 'Người đang dùng', NGAYTAO_DD_MM_YYYY: '27/09/2026' });
        DTSV.concat(HDGD).forEach(function (r) {
            if (r.ID === o.strSanPham_Id) { r.KETQUAXACNHAN_TEN = tt.TEN; r.KETQUAXACNHAN_THONGTIN1 = tt.THONGTIN1; r.KETQUAXACNHAN_THONGTIN2 = tt.THONGTIN2; r.KETQUAXACNHAN_NOIDUNG = o.strNoiDung; }
        });
        return [];
    };
    fx['NCKH_Files/LayDanhSach'] = function (o) { return o.strDuLieu_Id === 'DTSV1' || o.strDuLieu_Id === 'GD1' ? [{ ID: 'F1', FILEMINHCHUNG: 'Upload/demo/bien-ban.pdf', TENHIENTHI: 'Biên bản nghiệm thu.pdf' }] : []; };
    ums.demo.add(fx);
})();
