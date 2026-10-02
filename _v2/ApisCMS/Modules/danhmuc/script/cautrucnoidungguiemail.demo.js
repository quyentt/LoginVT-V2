/* Dữ liệu mẫu cho danhmuc/cautrucnoidungguiemail — chỉ dùng ở chế độ dựng thử. */
(function () {
    var T = 'CMS_TienIch/', fx = {};
    var DS = [
        { ID: 'E1A0C3D2B4F54E6A9B7C8D9E0F1A2B31', MA: 'THONGBAO_HOCPHI', TENEMAILHIENTHI: 'Phòng Kế hoạch - Tài chính',
          TIEUDE: 'Thông báo nộp học phí học kỳ 1 năm học 2026-2027',
          NOIDUNG: '<p>Kính gửi <b>[HOTEN]</b> (mã sinh viên [MASO]),</p><p>Nhà trường thông báo số học phí phải nộp học kỳ 1 là <b>[SOTIEN]</b> đồng, hạn nộp trước ngày <b>30/10/2026</b>.</p><p>Trân trọng.</p>',
          DANHSACHNHANEMAIL: '', GHICHU: 'Dùng cho màn Sinh viên nợ tiền' },
        { ID: 'E1A0C3D2B4F54E6A9B7C8D9E0F1A2B32', MA: 'KETQUA_HOCTAP', TENEMAILHIENTHI: 'Phòng Đào tạo',
          TIEUDE: 'Kết quả học tập học kỳ 2 năm học 2025-2026',
          NOIDUNG: '<p>Chào [HOTEN],</p><p>Điểm trung bình học kỳ của em là <b>[DIEMTB]</b>. Chi tiết xem tại cổng sinh viên.</p>',
          DANHSACHNHANEMAIL: 'daotao@truong.edu.vn', GHICHU: 'In bảng điểm' },
        { ID: 'E1A0C3D2B4F54E6A9B7C8D9E0F1A2B33', MA: 'TAIKHOAN_MOI', TENEMAILHIENTHI: 'Trung tâm Công nghệ thông tin',
          TIEUDE: 'Cấp tài khoản hệ thống quản lý đào tạo',
          NOIDUNG: '<p>Tài khoản của bạn: <b>[TAIKHOAN]</b></p><p>Vui lòng đổi mật khẩu ở lần đăng nhập đầu tiên.</p>',
          DANHSACHNHANEMAIL: '', GHICHU: '' }
    ];
    var seq = 4;
    fx[T + 'LayDS_CauTrucNoiDungGuiEmail'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        var r = DS.filter(function (x) { return !q || (x.MA + ' ' + x.TIEUDE + ' ' + x.TENEMAILHIENTHI).toLowerCase().indexOf(q) >= 0; });
        return { rows: r, pager: r.length };
    };
    fx[T + 'Them_CauTrucNoiDungGuiEmail'] = function (o) {
        var id = 'E1A0C3D2B4F54E6A9B7C8D9E0F1A2B' + (30 + seq++);
        DS.push({ ID: id, MA: o.strMa, TENEMAILHIENTHI: o.strTenEmailHienThi, TIEUDE: o.strTieuDe, NOIDUNG: o.strNoiDung,
                  DANHSACHNHANEMAIL: o.strDanhSachNhanEmail, GHICHU: o.strGhiChu });
        return { rows: [], raw: { Id: id } };
    };
    fx[T + 'Sua_CauTrucNoiDungGuiEmail'] = function (o) {
        DS.forEach(function (x) {
            if (x.ID !== o.strId) return;
            x.MA = o.strMa; x.TENEMAILHIENTHI = o.strTenEmailHienThi; x.TIEUDE = o.strTieuDe;
            x.NOIDUNG = o.strNoiDung; x.DANHSACHNHANEMAIL = o.strDanhSachNhanEmail; x.GHICHU = o.strGhiChu;
        });
        return [];
    };
    fx[T + 'Xoa_CauTrucNoiDungGuiEmail'] = function (o) {
        DS = DS.filter(function (x) { return x.ID !== o.strId; });
        return [];
    };
    ums.demo.add(fx);
})();
