/* Dữ liệu mẫu cho xinxacnhan (Hệ thống một cửa của sinh viên) — chỉ dùng ở chế độ dựng thử.
   Người học mẫu: SV0001. Gửi yêu cầu / xoá / trao đổi / chấm sao đổi ngay trong bộ nhớ. */
(function () {
    var fx = {};

    /* ---------- Phân loại dịch vụ ---------------------------------------- */
    fx['pkg_hanhchinhmotcua_chung.LayDSMotCua_DanhMuc_PhanLoai'] = [
        { ID: 'PL1', MA: 'XACNHAN', TEN: 'Giấy xác nhận' },
        { ID: 'PL2', MA: 'CAPLAI', TEN: 'Cấp lại giấy tờ' }
    ];

    /* ---------- Danh mục dịch vụ (giấy tờ) ------------------------------- */
    var DM = [
        { ID: 'DM1', PHANLOAI_ID: 'PL1', MA: 'XNSV', TEN: 'Giấy xác nhận là sinh viên', MOTCUA_DANHMUC_TENANH: '',
            DUONGDANFILE: 'MotCua/xacnhansinhvien.html', HIENTHICHONHAPNHANXET: 1 },
        { ID: 'DM2', PHANLOAI_ID: 'PL1', MA: 'XNVAY', TEN: 'Giấy xác nhận vay vốn ngân hàng chính sách', MOTCUA_DANHMUC_TENANH: '',
            DUONGDANFILE: 'MotCua/xacnhanvayvon.html', HIENTHICHONHAPNHANXET: 1 },
        { ID: 'DM3', PHANLOAI_ID: 'PL1', MA: 'XNHB', TEN: 'Xác nhận điểm rèn luyện - học bổng', MOTCUA_DANHMUC_TENANH: '',
            DUONGDANFILE: '', HIENTHICHONHAPNHANXET: 0 },
        { ID: 'DM4', PHANLOAI_ID: 'PL2', MA: 'CLTHE', TEN: 'Cấp lại thẻ sinh viên', MOTCUA_DANHMUC_TENANH: '',
            DUONGDANFILE: '', HIENTHICHONHAPNHANXET: 1 },
        { ID: 'DM5', PHANLOAI_ID: 'PL2', MA: 'CLBD', TEN: 'Cấp lại bảng điểm học tập', MOTCUA_DANHMUC_TENANH: '',
            DUONGDANFILE: '', HIENTHICHONHAPNHANXET: 0 }
    ];
    fx['pkg_hanhchinhmotcua_thongtin.LayDSMotCua_DanhMuc'] = function (o) {
        return DM.filter(function (r) { return !o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id; });
    };

    /* ---------- Ô tự nhập của từng dịch vụ ------------------------------- */
    var MORONG = {
        DM1: [{ ID: 'TT01', TEN: 'Nơi nộp giấy xác nhận', TENANH: 'fa fa-building', TRUONGTHONGTIN_GIATRI: '' },
              { ID: 'TT02', TEN: 'Số bản cần cấp', TENANH: '', TRUONGTHONGTIN_GIATRI: '2' }],
        DM2: [{ ID: 'TT03', TEN: 'Tên ngân hàng', TENANH: 'fa fa-university', TRUONGTHONGTIN_GIATRI: '' },
              { ID: 'TT04', TEN: 'Họ tên người vay', TENANH: '', TRUONGTHONGTIN_GIATRI: '' },
              { ID: 'TT05', TEN: 'Số CCCD người vay', TENANH: '', TRUONGTHONGTIN_GIATRI: '' }],
        DM4: [{ ID: 'TT06', TEN: 'Lý do cấp lại', TENANH: '', TRUONGTHONGTIN_GIATRI: '' }],
        DM5: [{ ID: 'TT07', TEN: 'Số bản cần cấp', TENANH: '', TRUONGTHONGTIN_GIATRI: '1' }]
    };
    fx['pkg_hanhchinhmotcua_chung.LayDSDanhMucMoRong'] = function (o) {
        // raw.Id = tệp kết quả máy chủ sinh ra; chế độ dựng thử không có tệp thật nên để rỗng
        return { rows: MORONG[o.strMotCua_DanhMuc_Id] || [], raw: { Id: '' } };
    };
    fx['pkg_hanhchinhmotcua_thongtin.Them_MotCua_DanhMuc_DuLieu'] = function (o) {
        (MORONG[o.strMotCua_DanhMuc_Id] || []).forEach(function (r) {
            if (r.ID === o.strTruongThongTin_Id) r.TRUONGTHONGTIN_GIATRI = o.strTruongThongTin_GiaTri;
        });
        return [];
    };

    /* ---------- Tình trạng xử lý (tab) ----------------------------------- */
    fx['pkg_dvmc_chung.LayDSTinhTrangXuLy'] = [
        { ID: 'TT_DXL', TEN: 'Đang xử lý', TENANH: 'fa fa-spinner' },
        { ID: 'TT_HT', TEN: 'Đã hoàn thành', TENANH: 'fa fa-check-circle' },
        { ID: 'TT_TC', TEN: 'Từ chối', TENANH: 'fa fa-times-circle' }
    ];

    /* ---------- Yêu cầu của người học ------------------------------------ */
    var seq = 100;
    var YC = [
        { ID: 'YC1', MOTCUA_DANHMUC_ID: 'DM1', MOTCUA_DANHMUC_TEN: 'Giấy xác nhận là sinh viên', PHANLOAI_ID: 'PL1',
            SOTIEN: 0, NGAYTAO_DD_MM_YYYY: '15/09/2026', NHANXET: 'Xin xác nhận để nộp cho phường làm tạm trú', TINHTRANG: '' },
        { ID: 'YC2', MOTCUA_DANHMUC_ID: 'DM4', MOTCUA_DANHMUC_TEN: 'Cấp lại thẻ sinh viên', PHANLOAI_ID: 'PL2',
            SOTIEN: 50000, NGAYTAO_DD_MM_YYYY: '18/09/2026', NHANXET: 'Mất thẻ khi đi thực tập', TINHTRANG: '' },
        { ID: 'YC3', MOTCUA_DANHMUC_ID: 'DM2', MOTCUA_DANHMUC_TEN: 'Giấy xác nhận vay vốn ngân hàng chính sách', PHANLOAI_ID: 'PL1',
            SOTIEN: 0, NGAYTAO_DD_MM_YYYY: '02/09/2026', NGAYXULY_DD_MM_YYYY_HHMMSS: '04/09/2026 09:15:22',
            NHANXET: 'Vay vốn học kỳ 1 năm học 2026-2027', TINHTRANG: 'TT_DXL', MOTCUA_NGUOIHOC_YEUCAU_ID: 'YC3', DANHGIACHATLUONG_MA: '' },
        { ID: 'YC4', MOTCUA_DANHMUC_ID: 'DM5', MOTCUA_DANHMUC_TEN: 'Cấp lại bảng điểm học tập', PHANLOAI_ID: 'PL2',
            SOTIEN: 30000, NGAYTAO_DD_MM_YYYY: '20/08/2026', NGAYXULY_DD_MM_YYYY_HHMMSS: '22/08/2026 14:02:07',
            NHANXET: 'Cần bảng điểm nộp hồ sơ xin việc', TINHTRANG: 'TT_HT', MOTCUA_NGUOIHOC_YEUCAU_ID: 'YC4', DANHGIACHATLUONG_MA: '5' },
        { ID: 'YC5', MOTCUA_DANHMUC_ID: 'DM3', MOTCUA_DANHMUC_TEN: 'Xác nhận điểm rèn luyện - học bổng', PHANLOAI_ID: 'PL1',
            SOTIEN: 0, NGAYTAO_DD_MM_YYYY: '10/08/2026', NGAYXULY_DD_MM_YYYY_HHMMSS: '11/08/2026 08:30:00',
            NHANXET: 'Hồ sơ thiếu minh chứng hoạt động', TINHTRANG: 'TT_TC', MOTCUA_NGUOIHOC_YEUCAU_ID: 'YC5', DANHGIACHATLUONG_MA: '3' }
    ];
    function loc(rows, o) {
        return rows.filter(function (r) { return !o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id; });
    }
    fx['pkg_hanhchinhmotcua_thongtin.LayDSYeuCauChuaXuLy'] = function (o) {
        return loc(YC.filter(function (r) { return !r.TINHTRANG; }), o);
    };
    fx['pkg_hanhchinhmotcua_thongtin.LayDSYeuCauTheoTinhTrangXuLy'] = function (o) {
        return loc(YC.filter(function (r) { return r.TINHTRANG === o.strTinhTrangXuLy_Id; }), o);
    };
    fx['pkg_hanhchinhmotcua_thongtin.Them_MotCua_NguoiHoc_YeuCau'] = function (o) {
        var dm = DM.filter(function (d) { return d.ID === o.strMotCua_DanhMuc_Id; })[0] || {};
        if (o.strId) {
            YC.forEach(function (r) { if (r.ID === o.strId) r.NHANXET = o.strNhanXet; });
            return { rows: [], raw: { Id: o.strId } };
        }
        var id = 'YC' + (seq++);
        YC.push({ ID: id, MOTCUA_DANHMUC_ID: dm.ID, MOTCUA_DANHMUC_TEN: dm.TEN, PHANLOAI_ID: dm.PHANLOAI_ID,
            SOTIEN: 0, NGAYTAO_DD_MM_YYYY: '23/09/2026', NHANXET: o.strNhanXet, TINHTRANG: '' });
        return { rows: [], raw: { Id: id } };
    };
    fx['pkg_hanhchinhmotcua_thongtin.Xoa_MotCua_NguoiHoc_YeuCau'] = function (o) {
        var ids = String(o.strIds || '').split(',');
        for (var i = YC.length - 1; i >= 0; i--) if (ids.indexOf(YC[i].ID) >= 0) YC.splice(i, 1);
        return [];
    };
    fx['pkg_hanhchinhmotcua_thongtin.DanhGia_MotCua_NguoiHoc_YeuCau'] = function () { return []; };

    /* ---------- Danh mục mức đánh giá (1..5 sao) ------------------------- */
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#MOTCUA_DANHGIA_CHATLUONG'] = [
        { ID: 'DG1', MA: '1', TEN: 'Rất không hài lòng' },
        { ID: 'DG2', MA: '2', TEN: 'Không hài lòng' },
        { ID: 'DG3', MA: '3', TEN: 'Bình thường' },
        { ID: 'DG4', MA: '4', TEN: 'Hài lòng' },
        { ID: 'DG5', MA: '5', TEN: 'Rất hài lòng' }
    ];

    /* ---------- Khối trao đổi -------------------------------------------- */
    var TN = {
        YC3: [{ ID: 'TN1', NGUOITAO_ID: 'SV0001', NGUOITAO_TAIKHOAN: '25001029', NGUOITAO_TENDAYDU: 'Lăng Văn Huy',
                NOIDUNG: 'Em cần lấy giấy trước ngày 10/09 ạ.', NGAYTAO_DD_MM_YYYY: '02/09/2026', ANHDAIDIEN: '' },
              { ID: 'TN2', NGUOITAO_ID: 'CB01', NGUOITAO_TAIKHOAN: 'ctsv.hoa', NGUOITAO_TENDAYDU: 'Phòng Công tác sinh viên',
                NOIDUNG: 'Em bổ sung số CCCD của người vay giúp phòng nhé.', NGAYTAO_DD_MM_YYYY: '03/09/2026', ANHDAIDIEN: '' }],
        YC5: [{ ID: 'TN3', NGUOITAO_ID: 'CB01', NGUOITAO_TAIKHOAN: 'ctsv.hoa', NGUOITAO_TENDAYDU: 'Phòng Công tác sinh viên',
                NOIDUNG: 'Hồ sơ chưa có minh chứng hoạt động, em nộp lại nhé.', NGAYTAO_DD_MM_YYYY: '11/08/2026', ANHDAIDIEN: '' }]
    };
    var tnSeq = 10;
    fx['pkg_hanhchinhmotcua_thongtin.LayDSMotCua_NH_YC_XL_PhanHoi'] = function (o) { return TN[o.strMotCua_NH_YC_XuLy_Id] || []; };
    fx['pkg_hanhchinhmotcua_thongtin.Them_MotCua_NH_YC_XL_PhanHoi'] = function (o) {
        var l = TN[o.strMotCua_NH_YC_XuLy_Id] || (TN[o.strMotCua_NH_YC_XuLy_Id] = []);
        l.push({ ID: 'TN' + (tnSeq++), NGUOITAO_ID: 'SV0001', NGUOITAO_TAIKHOAN: '25001029', NGUOITAO_TENDAYDU: 'Lăng Văn Huy',
            NOIDUNG: o.strNoiDung, NGAYTAO_DD_MM_YYYY: '23/09/2026', ANHDAIDIEN: '' });
        return [];
    };
    fx['pkg_hanhchinhmotcua_thongtin.Xoa_MotCua_NH_YC_XL_PhanHoi'] = function (o) {
        Object.keys(TN).forEach(function (k) { TN[k] = TN[k].filter(function (r) { return r.ID !== o.strId; }); });
        return [];
    };

    ums.demo.add(fx);
})();
