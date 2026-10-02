/* Dữ liệu mẫu chung cho module sanphamkhoahoc — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: ten }; }
    var fx = {};
    var MUC = {
        'NCKH.LVNC': ['Khoa học máy tính', 'Kinh tế', 'Kỹ thuật điện'], 'NCKH.LBAO': ['Bài báo khoa học', 'Bài tổng quan'],
        'NCKH.LKT': ['Cấp Bộ', 'Cấp Trường'], 'NCKH.LKY': ['Kỷ yếu quốc tế', 'Kỷ yếu trong nước'], 'NCKH.PHLS': ['Giáo trình', 'Chuyên khảo', 'Tham khảo'],
        'NCKH.TTS.LANXUATBAN': ['Lần 1', 'Tái bản'], 'NCKH.PVHT': ['Quốc tế', 'Quốc gia'], 'NCKH.DTHT': ['Cán bộ', 'Sinh viên'], 'NCKH.XLDT': ['Xuất sắc', 'Tốt', 'Đạt'],
        'NCKH.SPUD': ['Phần mềm', 'Quy trình', 'Mô hình'], 'NCKH.NGKP': ['Ngân sách nhà nước', 'Doanh nghiệp'], 'CHUN.DVTT': ['VNĐ', 'USD'],
        'CHUN.CHLU': ['Việt Nam', 'Nhật Bản', 'Hàn Quốc'], 'NCKH.TTDT': ['Đang thực hiện', 'Đã nghiệm thu'], 'NCKH.DETAI.XEPLOAI': ['Xuất sắc', 'Khá', 'Đạt'],
        'NCKH.VTDT': ['Chủ nhiệm', 'Thư ký', 'Thành viên'], 'NCKH.VTQT': ['Tác giả chính', 'Đồng tác giả'], 'NCKH.VTQG': ['Tác giả chính', 'Đồng tác giả'],
        'NCKH.VTHT': ['Tác giả chính', 'Đồng tác giả'], 'NCKH.VTVS': ['Chủ biên', 'Tham gia'], 'NCKH.VTSV': ['Hướng dẫn chính', 'Hướng dẫn phụ'],
        'NCKH.VHSV': ['Chủ nhiệm', 'Thành viên']
    };
    Object.keys(MUC).forEach(function (k) { fx[DM + k] = MUC[k].map(function (t, i) { return dm(k.replace(/\W/g, '') + i, 'M' + i, t); }); });
    fx[DM + 'NCKH.PLDT'] = [dm('PL1', 'CS', 'Cơ sở'), dm('PL2', 'UD', 'Ứng dụng'), dm('PLK', 'ZLOAIKHAC', 'Loại khác')];
    fx[DM + 'NCKH.CAPQUANLY'] = [dm('CQ1', 'NN', 'Nhà nước'), dm('CQ2', 'BO', 'Bộ'), dm('CQ3', 'TR', 'Trường'), dm('CQK', 'ZLOAIKHAC', 'Khác')];
    fx[DM + 'NCKH.VTHDGD'] = [dm('HDGD1', 'GIANGDAY', 'Giảng dạy'), dm('HDGD2', 'HUONGDAN', 'Hướng dẫn')];
    fx['NCKH_TinhDiem_KeHoach/LayDanhSach'] = [{ ID: 'NAM2026', MOTA: 'Đánh giá năm học 2025-2026' }, { ID: 'NAM2025', MOTA: 'Đánh giá năm học 2024-2025' }];
    fx['NS_HoSo_V2_MH/DSA4FRUeDykgLxI0HgkuEi4eN3MP'] = [{ ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001' }];

    /* Thành viên / tệp: giữ theo id sản phẩm */
    var TV = { DT1: [{ ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MACANBO: 'CB001', VAITRO_ID: 'NCKHVTDT0', LATHANHVIENCUATRUONG: 0 }],
        TQ1: [{ ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MACANBO: 'CB001', VAITRO_ID: 'NCKHVTQT0', LATHANHVIENCUATRUONG: 0 },
            { ID: 'NG1', HOTEN: 'Kenji Sato', MACANBO: '', VAITRO_ID: 'NCKHVTQT1', LATHANHVIENCUATRUONG: 1 }] };
    fx['NCKH_ThanhVien/LayDanhSach'] = function (o) { return (TV[o.strSanPham_Id] || []).slice(); };
    fx['NCKH_ThanhVien/ThemMoi'] = function (o) {
        var l = TV[o.strSanPham_Id] || (TV[o.strSanPham_Id] = []);
        if (!l.some(function (x) { return x.ID === o.strThanhVien_Id; })) l.push({ ID: o.strThanhVien_Id, HOTEN: o.strThanhVien_Id, VAITRO_ID: o.strVaiTro_Id, LATHANHVIENCUATRUONG: 0 });
        return [];
    };
    fx['NCKH_ThanhVien/Xoa'] = function (o) { TV[o.strSanPham_Id] = (TV[o.strSanPham_Id] || []).filter(function (x) { return x.ID !== o.strThanhVien_Id; }); return []; };
    var TEP = {};
    fx['NCKH_Files/LayDanhSach'] = function (o) { return TEP[o.strDuLieu_Id] || []; };
    fx['NCKH_Files/ThemMoi'] = function (o) {
        var l = TEP[o.strDuLieu_Id] || (TEP[o.strDuLieu_Id] = []);
        l.push({ ID: 'F' + Date.now() + l.length, FILEMINHCHUNG: o.strFileMinhChung, TENHIENTHI: o.strTenHienThi });
        return [];
    };
    fx['NCKH_Files/Xoa'] = function (o) { Object.keys(TEP).forEach(function (k) { TEP[k] = TEP[k].filter(function (f) { return f.ID !== o.strIds; }); }); return []; };
    ums.demo.add(fx);

    var XN = { KETQUAXACNHAN_TEN: 'Đã xác nhận', KETQUAXACNHAN_THONGTIN2: 'color:#198754', HOANTHANHNHAPDULIEU: 1 };
    var CHUA = { HOANTHANHNHAPDULIEU: 0, HOANTHANHNHAPDULIEU_LYDO: 'Thiếu tệp minh chứng' };
    function g(o) { return Object.assign({}, o); }
    function map(o) { var r = {}; Object.keys(o).forEach(function (k) { if (/^(str|d|i)[A-Z]/.test(k)) r[k.replace(/^(str|d|i)/, '').replace(/_n$/, '_N').toUpperCase()] = o[k]; }); return r; }

    ums.demo.crudStore('NCKH_DeTai', [
        g(Object.assign({ ID: 'DT1', MADETAI: 'DT-2026-01', TENDETAITIENGVIET: 'Ứng dụng học sâu phát hiện gian lận thi trực tuyến', TENDETAITIENGANH: 'Deep learning for exam fraud',
            DONVITOCHUCCODETAI: 'Trường Đại học Công nghệ', DONVITHUCHIENDETAI: 'Khoa CNTT', LINHVUCNGHIENCUU_ID: 'NCKHLVNC0', LINHVUCNGHIENCUU_TEN: 'Khoa học máy tính',
            SOTACGIA_N: 3, PHANLOAIDETAI_ID: 'PL2', CAPQUANLY_ID: 'CQ3', THOIGIANBATDAU: '01/2026', THOIGIANKETTHUC: '12/2026', DSTHANHVIEN_VAITRO: 'Nguyễn Văn Hùng (Chủ nhiệm)' }, XN)),
        g(Object.assign({ ID: 'DT2', TENDETAITIENGVIET: 'Mô hình dự báo nhu cầu tuyển sinh', DONVITOCHUCCODETAI: 'Bộ Giáo dục', SOTACGIA_N: 2, PHANLOAIDETAI_ID: 'PLK',
            PHANLOAIDETAI_KHAC: 'Đề tài đặt hàng', CAPQUANLY_ID: 'CQ2' }, CHUA))
    ], { map: map });
    ums.demo.add({
        'NCKH_DanhMucDeTai/LayDanhSach': [{ ID: 'DMDT1', TENDETAI: 'Chuyển đổi số trong quản lý đào tạo', MADETAI: 'DM-01', TENDETAITIENGANH: 'Digital transformation', PHANLOAIDETAI_ID: 'PL2' }],
        'NCKH_DeTai_SanPham/LayDanhSach': function (o) { return o.strNCKH_QuanLyDeTai_Id === 'DT1' ? [{ ID: 'TQ1', TENSANPHAM: 'Fraud detection in online exams (bài báo quốc tế)', LOAI: 'NCKH_TAPCHIQUOCTE' },
            { ID: 'SV1', TENSANPHAM: 'Đề tài sinh viên: Nhận diện khuôn mặt', LOAI: 'NCKH_SP_QUANLYDETAISINHVIEN' }] : []; },
        'NCKH_DeTai_SanPham/LayDSSanPhamChuaThuocDeTai': [{ ID: 'TQ9', TENSANPHAM: 'Bài báo: Hệ khuyến nghị học phần', LOAI: 'NCKH_TAPCHIQUOCGIA' }],
        'NCKH_DeTai_SanPham/CapNhat': [], 'NCKH_DeTai_SanPham/Xoa': [], 'NCKH_SP_QuanLyDeTaiSinhVien/ThemMoi': { rows: [], raw: { Id: 'SVMOI' } },
        'NCKH_SP_DeTai/LayDanhSach': function (o) { return o.strNCKH_QuanLyDeTai_Id === 'DT1' ? [{ ID: 'UD1', LOAISANPHAM_ID: 'NCKHSPUD0', TENSANPHAM: 'Phần mềm giám sát thi', MOTA: 'Bản thử nghiệm' }] : []; },
        'NCKH_SP_DeTai/ThemMoi': { rows: [], raw: { Id: 'UDMOI' } }, 'NCKH_SP_DeTai/Xoa': [],
        'NCKH_SP_NguonKinhPhi/LayDanhSach': function (o) { return o.strSanPham_Id === 'DT1' ? [{ ID: 'KP1', NGUONKINHPHI_ID: 'NCKHNGKP0', SOTIEN: '150,000,000', DONVITINH_ID: 'CHUNDVTT0' }] : []; },
        'NCKH_SP_NguonKinhPhi/ThemMoi': { rows: [], raw: { Id: 'KPMOI' } }, 'NCKH_SP_NguonKinhPhi/Xoa': [],
        'NCKH_DeTai_DoiTac/LayDanhSach': function (o) { return o.strNCKH_QuanLyDeTai_Id === 'DT1' ? [{ ID: 'DV1', DOITAC: 'Đại học Tokyo', QUOCTICH_ID: 'CHUNCHLU1' }] : []; },
        'NCKH_DeTai_DoiTac/ThemMoi': { rows: [], raw: { Id: 'DVMOI' } }, 'NCKH_DeTai_DoiTac/Xoa': [],
        'NCKH_DeTai_TienDo/LayDanhSach': function (o) { return o.strNCKH_QuanLyDeTai_Id === 'DT1' ? [{ ID: 'TD1', THOIGIAN: '06/2026', SOTIENTHANHTOAN: '50,000,000', SOTIENCONLAI: '100,000,000' }] : []; },
        'NCKH_DeTai_TienDo/ThemMoi': { rows: [], raw: { Id: 'TDMOI' } }, 'NCKH_DeTai_TienDo/Xoa': [],
        'NCKH_DeTai_KetQua/LayDanhSach': function (o) { return o.strNCKH_QuanLyDeTai_Id === 'DT1' ? [{ ID: 'KQ1', SOQUYETDINH: '45/QĐ-ĐHCN', NGAY: '15', THANG: '01', NAM: '2026',
            TINHTRANG_ID: 'NCKHTTDT0', XEPLOAI_ID: '', TONGTHOIGIANQUYDINH: '12', TONGTHOIGIANDATHUCHIEN: '8', MOTA: 'Phê duyệt thực hiện' }] : []; },
        'NCKH_DeTai_KetQua/ThemMoi': { rows: [], raw: { Id: 'KQMOI' } }, 'NCKH_DeTai_KetQua/CapNhat': { rows: [], raw: { Id: 'KQ1' } }, 'NCKH_DeTai_KetQua/Xoa': [],
        'NCKH_HoiDongXetChucDanh/LayDanhSach': [Object.assign({ ID: 'HD1', DOITUONGDEXUAT_TEN: 'Nguyễn Văn Hùng', CHUCDANHDEXUAT_TEN: 'Phó giáo sư', CHUYENNGANH_TEN: 'Khoa học máy tính',
            KETQUAHOIDONGCOSO_TEN: 'Đạt', KETQUAHOIDONGNGANH_TEN: 'Đạt', KETQUAHOIDONGNHANUOC_TEN: '', NGUOITHUCHIEN_TENDAYDU: 'Trần Thị Mai' }, XN)]
    });

    ums.demo.crudStore('NCKH_TapChiQuocTe', [g(Object.assign({ ID: 'TQ1', TENBAIBAO: 'Fraud detection in online exams with deep learning', TENTAPCHI: 'IEEE Access', CHISO_ISSN: '2169-3536',
        THUOCLINHVUCNAO: 'Khoa học máy tính', SOTACGIA_N: 2, NAMCONGBO: '2026', THANGCONGBO: '03', DSTHANHVIEN_VAITRO: 'Nguyễn Văn Hùng' }, XN))], { map: map });
    ums.demo.crudStore('NCKH_TapChiQuocGia', [g(Object.assign({ ID: 'TG1', TENBAIBAO: 'Hệ khuyến nghị học phần cho sinh viên', TENTAPCHI: 'Tạp chí Khoa học', SOTACGIA_N: 2 }, CHUA))], { map: map });
    ums.demo.crudStore('NCKH_KyYeu', [g({ ID: 'KY1', TENBAIBAO: 'Tối ưu lịch thi bằng giải thuật di truyền', SOTACGIA_N: 1 })], { map: map });
    ums.demo.crudStore('NCKH_Sach', [g(Object.assign({ ID: 'SA1', TENSACH: 'Giáo trình Cấu trúc dữ liệu', SOTACGIA_N: 2 }, XN))], { map: map });
    ums.demo.crudStore('NCKH_GiaiThuong', [g({ ID: 'GT1', NOIDUNGGIAITHUONG: 'Giải Nhì Sinh viên nghiên cứu khoa học', SOQUYETDINH: '12/QĐ', HINHTHUC: 'Bằng khen' })], { map: map });
    ums.demo.crudStore('NCKH_VanBangSangChe', [g({ ID: 'VB1', TENVANBANG: 'Thiết bị giám sát phòng thi', MASANPHAM: 'VN-2026-01' })], { map: map });
    ums.demo.crudStore('NCKH_HoiNghiHoiThao', [g({ ID: 'HN1', TENHOINGHI: 'Hội thảo Chuyển đổi số trong giáo dục', TENHOITHAO: 'Hội thảo Chuyển đổi số trong giáo dục' })], { map: map });
    ums.demo.crudStore('NCKH_SP_QuanLyDeTaiSinhVien', [g({ ID: 'SV1', TENDETAI: 'Nhận diện khuôn mặt điểm danh', MOTA: 'Nguyễn Minh Anh' })], { map: map });
    ums.demo.crudStore('NCKH_SP_HuongDan_GiangDay', [g({ ID: 'GD1', TENHOCPHAN: 'Học máy nâng cao', NOIDUNG: 'Học máy nâng cao', PHANLOAI_ID: 'HDGD1' }),
        g({ ID: 'HG1', TENDETAI: 'Luận văn: Phát hiện gian lận', NOIDUNG: 'Luận văn: Phát hiện gian lận', PHANLOAI_ID: 'HDGD2' })],
        { map: map, list: function (rows, o) { return rows.filter(function (r) { return !o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id; }); } });
    ums.demo.add({
        'NCKH_SP_HDGD_GiangVien_GD/LayDanhSach': [], 'NCKH_SP_HDGD_GiangVien_GD/ThemMoi': [], 'NCKH_SP_HDGD_GiangVien_GD/Xoa': [],
        'NCKH_SP_HDGD_GiangVien_HD/LayDanhSach': [], 'NCKH_SP_HDGD_GiangVien_HD/ThemMoi': [], 'NCKH_SP_HDGD_GiangVien_HD/Xoa': [],
        'NCKH_SP_HDGD_SinhVien/LayDanhSach': [], 'NCKH_SP_HDGD_SinhVien/ThemMoi': [], 'NCKH_SP_HDGD_SinhVien/Xoa_SinhVien': [],
        'NCKH_SP_QLDTSV_SinhVien/LayDanhSach': [], 'NCKH_SP_QLDTSV_SinhVien/ThemMoi': [], 'NCKH_SP_QLDTSV_SinhVien/Xoa': []
    });
})();
