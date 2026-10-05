/* Dữ liệu mẫu cho guithongbaoappsinhvien — chỉ dùng ở chế độ dựng thử. */
(function () {
    var tin = [
        { ID: 'TN1', TIEUDE: 'Lịch thi kết thúc học phần học kỳ 2', NOIDUNG: 'Sinh viên xem lịch thi trên cổng thông tin, có mặt trước giờ thi 15 phút và mang theo thẻ sinh viên.', NGUOITAO: 'Nguyễn Văn Quyền', NGAYTAO: '28/09/2026' },
        { ID: 'TN2', TIEUDE: 'Nhắc nộp học phí đợt 1', NOIDUNG: 'Hạn nộp học phí đợt 1 năm học 2026-2027 là ngày 15/10/2026. Sinh viên chưa nộp vui lòng hoàn thành trước hạn.', NGUOITAO: 'Nguyễn Văn Quyền', NGAYTAO: '30/09/2026' },
        { ID: 'TN3', TIEUDE: 'Khảo sát chất lượng giảng dạy', NOIDUNG: 'Mời sinh viên tham gia khảo sát chất lượng giảng dạy học kỳ 1 trên ứng dụng từ 01/10 đến 10/10/2026.', NGUOITAO: 'Trần Thị Mai', NGAYTAO: '01/10/2026' },
        { ID: 'TN4', TIEUDE: 'Lễ khai giảng năm học 2026-2027', NOIDUNG: 'Lễ khai giảng tổ chức 7h30 ngày 05/10/2026 tại hội trường A. Sinh viên khóa mới có mặt đầy đủ.', NGUOITAO: 'Nguyễn Văn Quyền', NGAYTAO: '02/10/2026' }
    ];
    var sv = [
        { QLSV_NGUOIHOC_ID: 'SV0001', QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn Huy', QLSV_NGUOIHOC_NGAYSINH: '12/03/2007', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin' },
        { QLSV_NGUOIHOC_ID: 'SV0002', QLSV_NGUOIHOC_MASO: '25001030', QLSV_NGUOIHOC_HODEM: 'Nguyễn Thị Lan', QLSV_NGUOIHOC_NGAYSINH: '25/08/2007', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin' },
        { QLSV_NGUOIHOC_ID: 'SV0003', QLSV_NGUOIHOC_MASO: '24002118', QLSV_NGUOIHOC_HODEM: 'Trần Minh Đức', QLSV_NGUOIHOC_NGAYSINH: '03/11/2006', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'K67-QTKD2', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế' },
        { QLSV_NGUOIHOC_ID: 'SV0004', QLSV_NGUOIHOC_MASO: '23003305', QLSV_NGUOIHOC_HODEM: 'Phạm Thu Hà', QLSV_NGUOIHOC_NGAYSINH: '17/01/2005', QLSV_TRANGTHAINGUOIHOC_TEN: 'Bảo lưu', DAOTAO_LOPQUANLY_TEN: 'K68-HTTT1', DAOTAO_CHUONGTRINH_TEN: 'Hệ thống thông tin', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin' },
        { QLSV_NGUOIHOC_ID: 'SV0005', QLSV_NGUOIHOC_MASO: '23003306', QLSV_NGUOIHOC_HODEM: 'Hoàng Anh Tuấn', QLSV_NGUOIHOC_NGAYSINH: '09/06/2005', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'K68-HTTT1', DAOTAO_CHUONGTRINH_TEN: 'Hệ thống thông tin', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin' },
        { QLSV_NGUOIHOC_ID: 'SV0006', QLSV_NGUOIHOC_MASO: '22004410', QLSV_NGUOIHOC_HODEM: 'Vũ Thị Hồng', QLSV_NGUOIHOC_NGAYSINH: '30/12/2004', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'K67-QTKD2', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_HEDAOTAO_TEN: 'Liên thông', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế' }
    ];
    var dot = [
        { ID: 'DG1', THONGBAO_TINNHAN_ID: 'TN1', NGAYTAO: '28/09/2026 09:15' },
        { ID: 'DG2', THONGBAO_TINNHAN_ID: 'TN1', NGAYTAO: '29/09/2026 14:40' },
        { ID: 'DG3', THONGBAO_TINNHAN_ID: 'TN2', NGAYTAO: '30/09/2026 08:05' }
    ];
    var daGui = {
        DG1: [sv[0], sv[1], sv[2]].map(function (r, i) { return Object.assign({ TRANGTHAIGUI: i === 2 ? 'Chưa nhận' : 'Đã nhận' }, r); }),
        DG2: [sv[0], sv[3]].map(function (r) { return Object.assign({ TRANGTHAIGUI: 'Đã nhận' }, r); }),
        DG3: [sv[4], sv[5]].map(function (r, i) { return Object.assign({ TRANGTHAIGUI: i ? 'Chưa nhận' : 'Đã nhận' }, r); })
    };
    var seq = 10;
    function loc(rows, q, cols) {
        q = String(q || '').trim().toLowerCase();
        if (!q) return rows;
        return rows.filter(function (r) { return cols.some(function (c) { return String(r[c] || '').toLowerCase().indexOf(q) >= 0; }); });
    }
    function trang(rows, o) {
        var n = Number(o.iItemPerPage) || 10, i = Number(o.iPageNumber) || 1;
        return { rows: rows.slice((i - 1) * n, (i - 1) * n + n), pager: rows.length };
    }

    ums.demo.add({
        'TT_ThongBao/LayDS_ThongBaoTinNhan': function (o) { return trang(loc(tin, o.strTuKhoa, ['TIEUDE', 'NOIDUNG']), o); },
        'TT_ThongBao/ThemMoi_ThongBao_TinNhan': function (o) {
            var id = 'TN' + (seq++);
            tin.unshift({ ID: id, TIEUDE: o.strTieuDe, NOIDUNG: o.strNoiDung, NGUOITAO: 'Nguyễn Văn Quyền', NGAYTAO: '05/10/2026' });
            return { rows: [], raw: { ID: id } };
        },
        'TT_ThongBao/Sua_ThongBao_TinNhan': function (o) {
            tin.forEach(function (r) { if (r.ID === o.strId) { r.TIEUDE = o.strTieuDe; r.NOIDUNG = o.strNoiDung; } });
            return { rows: [], raw: { ID: o.strId } };
        },
        'D_BaoCao/LayDanhSachHoSoNhieuNganh': function (o) { return loc(sv, o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HODEM']); },
        'TT_ThongBao/THEMOI_THONGBAO_TINNHAN_DOTGUI': function (o) {
            var id = 'DG' + (seq++);
            dot.push({ ID: id, THONGBAO_TINNHAN_ID: o.strTHONGBAO_TINNHAN_ID, NGAYTAO: '05/10/2026 10:30' });
            daGui[id] = [];
            return { rows: id };
        },
        'TT_ThongBao/TM_THONGBAO_TINNHAN_NGUOIHOC': function (o) {
            var r = sv.filter(function (x) { return x.QLSV_NGUOIHOC_ID === o.strQLSV_NGUOIHOC_ID; })[0];
            if (r && daGui[o.strTHONGBAO_TINNHAN_DOTGUI_ID]) daGui[o.strTHONGBAO_TINNHAN_DOTGUI_ID].push(Object.assign({ TRANGTHAIGUI: 'Đã nhận' }, r));
            return [];
        },
        'TT_ThongBao/LayDS_TinNhan_DotGui': function (o) { return dot.filter(function (d) { return d.THONGBAO_TINNHAN_ID === o.strThongBao_TinNhan_Id; }); },
        'TT_ThongBao/LayDS_TinNhanNguoiHoc_DotGui': function (o) {
            return trang(loc(daGui[o.strTinNhan_DotGui_Id] || [], o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HODEM']), o);
        },
        'TT_ThongBao/GuiTinNhanNhungTruongHopChuaNhan': function (o) {
            (daGui[o.strTinNhan_DotGui_Id] || []).forEach(function (r) { r.TRANGTHAIGUI = 'Đã nhận'; });
            return [];
        },
        'TT_ThongBao/Import_GuiTinNhanToiSinhVien': { rows: [sv[2], sv[5]], message: '2 dòng' },
        'KHCT_NamNhapHoc/LayDanhSach': [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }, { NAMNHAPHOC: '2024' }, { NAMNHAPHOC: '2025' }]
    });
})();
