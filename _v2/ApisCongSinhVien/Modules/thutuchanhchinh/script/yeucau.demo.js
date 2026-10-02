/* Dữ liệu mẫu cho yeucau (Hệ thống một cửa — yêu cầu hỗ trợ) — chỉ dùng ở chế độ dựng thử.
   Người học mẫu: SV0001. Tạo mới / gửi / huỷ / khai biểu mẫu đổi ngay trong bộ nhớ. */
(function () {
    var fx = {};

    /* ---------- Chương trình học (2 chương trình → ô chọn ẩn như gốc) ----- */
    fx['pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc'] = [
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ kỹ thuật ô tô - Khóa 16' },
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02', DAOTAO_CHUONGTRINH_TEN: 'Ngành 2: Quản trị kinh doanh - Khóa 16' }
    ];

    /* ---------- Danh sách dịch vụ ---------------------------------------- */
    var DV = [
        { ID: 'YC_XNSV', TEN: 'Xin giấy xác nhận sinh viên', THONGBAOKHIDANGKYTHANHCONG: 'Đã gửi yêu cầu, bạn nhận giấy tại Phòng Công tác sinh viên sau 03 ngày làm việc.' },
        { ID: 'YC_BAOLUU', TEN: 'Đơn xin bảo lưu kết quả học tập', THONGBAOKHIDANGKYTHANHCONG: '' },
        { ID: 'YC_CHUYENLOP', TEN: 'Đơn xin chuyển lớp quản lý', THONGBAOKHIDANGKYTHANHCONG: '' },
        { ID: 'YC_HOCPHI', TEN: 'Đơn xin gia hạn nộp học phí', THONGBAOKHIDANGKYTHANHCONG: '' }
    ];
    fx['pkg_dvmc_chung.LayDSYeuCauTheoPhamVi'] = function (o) { return o.strDaoTao_ChuongTrinh_Id ? DV : []; };

    /* ---------- Mô tả dịch vụ -------------------------------------------- */
    var MOTA = {
        YC_XNSV: { TIEUDE: 'Xin giấy xác nhận sinh viên', DIACHITRAYEUCAU: 'Phòng Công tác sinh viên - Nhà A1, tầng 1',
            DUONGDANMAUDON: 'MotCua/mau-don-xac-nhan.docx', HINHANHMINHHOA: '',
            MOTA: 'Giấy xác nhận sinh viên dùng để làm tạm trú, vay vốn, mua vé tàu xe ưu đãi.\nThời gian trả kết quả: 03 ngày làm việc.\nLệ phí: không thu.' },
        YC_BAOLUU: { TIEUDE: 'Đơn xin bảo lưu kết quả học tập', DIACHITRAYEUCAU: 'Phòng Đào tạo - Nhà A1, tầng 2',
            DUONGDANMAUDON: '', HINHANHMINHHOA: '',
            MOTA: 'Sinh viên nộp đơn kèm minh chứng (giấy khám bệnh, giấy gọi nhập ngũ…).\nThời gian trả kết quả: 07 ngày làm việc.' },
        YC_CHUYENLOP: { TIEUDE: 'Đơn xin chuyển lớp quản lý', DIACHITRAYEUCAU: 'Phòng Đào tạo - Nhà A1, tầng 2',
            DUONGDANMAUDON: '', HINHANHMINHHOA: '', MOTA: 'Chỉ giải quyết trong 02 tuần đầu của học kỳ.' },
        YC_HOCPHI: { TIEUDE: 'Đơn xin gia hạn nộp học phí', DIACHITRAYEUCAU: 'Phòng Tài chính kế toán - Nhà A2, tầng 1',
            DUONGDANMAUDON: '', HINHANHMINHHOA: '', MOTA: 'Kèm theo xác nhận hoàn cảnh của địa phương.' }
    };
    fx['pkg_dvmc_thongtin.LayTTDVMC_YeuCu_MoTa'] = function (o) { return MOTA[o.strYeuCau_Id] ? [MOTA[o.strYeuCau_Id]] : []; };

    fx['SV_Files/LayDanhSach'] = function (o) {
        return o.strDuLieu_Id === 'YC_XNSV'
            ? [{ ID: 'FYC1', FILEMINHCHUNG: 'MotCua/huong-dan-xin-xac-nhan.pdf', TENHIENTHI: 'Hướng dẫn xin xác nhận.pdf' }] : [];
    };

    /* ---------- Cấu trúc biểu mẫu (@id-KIỂU-mã danh mục-bắt buộc-…-…-rộng@) --- */
    var CAUTRUC = {
        YC_XNSV: [
            { NOIDUNG: 'Kính gửi: Phòng Công tác sinh viên - Trường Đại học Lâm nghiệp' },
            { NOIDUNG: 'Tôi làm đơn này đề nghị Nhà trường cấp giấy xác nhận để: @TTYC1-LIST-MOTCUA.MUCDICHXACNHAN-1-0-0-260@' },
            { NOIDUNG: 'Số bản cần cấp: @TTYC2-TEXT--1-0-0-80@ bản' },
            { NOIDUNG: 'Nơi nộp giấy xác nhận: @TTYC3-TEXT--0-0-0-320@' }
        ],
        YC_BAOLUU: [
            { NOIDUNG: 'Kính gửi: Phòng Đào tạo' },
            { NOIDUNG: 'Tôi làm đơn xin bảo lưu kết quả học tập từ học kỳ @TTYC4-TEXT--1-0-0-80@ với lý do: @TTYC5-LIST-MOTCUA.LYDOBAOLUU-1-0-0-260@' }
        ],
        YC_CHUYENLOP: [{ NOIDUNG: 'Tôi xin chuyển sang lớp quản lý: @TTYC6-TEXT--1-0-0-200@' }],
        YC_HOCPHI: [{ NOIDUNG: 'Tôi xin gia hạn nộp học phí đến ngày @TTYC7-TEXT--1-0-0-140@' }]
    };
    fx['pkg_dvmc_chung.LayDSCauTruc_YeuCau'] = function (o) {
        return { rows: { rsCauTrucYeuCau: CAUTRUC[o.strYeuCau_Id] || [] }, pager: 0 };
    };
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#MOTCUA.MUCDICHXACNHAN'] = [
        { ID: 'MD1', TEN: 'Làm thủ tục tạm trú' },
        { ID: 'MD2', TEN: 'Vay vốn ngân hàng chính sách' },
        { ID: 'MD3', TEN: 'Mua vé tàu xe ưu đãi' }
    ];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#MOTCUA.LYDOBAOLUU'] = [
        { ID: 'LD1', TEN: 'Lý do sức khỏe' },
        { ID: 'LD2', TEN: 'Đi nghĩa vụ quân sự' },
        { ID: 'LD3', TEN: 'Hoàn cảnh gia đình' }
    ];

    /* ---------- Giá trị đã khai của từng ô -------------------------------- */
    var GT = {};                                     // '<yêuCầuNhậnId>|<trườngId>' → giá trị
    function khoa(o) { return (o.strDVMC_YeuCau_Nhan_Id || '') + '|' + o.strTruongThongTin_Id; }
    fx['pkg_dvmc_thongtin.LayTTDVMC_CauTruc_YC_DuLieu'] = function (o) {
        var v = GT[khoa(o)];
        return v === undefined ? [] : [{ TRUONGTHONGTIN_GIATRI: v }];
    };
    fx['pkg_dvmc_thongtin.Them_DVMC_CauTruc_YC_DuLieu'] = function (o) {
        GT[khoa(o)] = o.strTruongThongTin_GiaTri;
        return [];
    };

    /* ---------- Yêu cầu đã gửi ------------------------------------------- */
    var seq = 50;
    var YC = [
        { ID: 'N1', MAYEUCAU: 'MC2609001', YEUCAU_ID: 'YC_XNSV', YEUCAU_TEN: 'Xin giấy xác nhận sinh viên',
            NGAYTAO_DD_MM_YYYY_HHMMSS: '05/09/2026 08:12:40', TINHTRANGXULY_THOIGIAN: 'Đã xử lý - 07/09/2026 10:05',
            THOIGIANHOANTHANHDUKIEN: '08/09/2026', SOTIEN: 0, YKIENKHAC: '', LOAI: ['TongSoYeuCauDaGui', 'TongSoYeuCauDaDuocXuLy'] },
        { ID: 'N2', MAYEUCAU: 'MC2609014', YEUCAU_ID: 'YC_HOCPHI', YEUCAU_TEN: 'Đơn xin gia hạn nộp học phí',
            NGAYTAO_DD_MM_YYYY_HHMMSS: '12/09/2026 14:30:02', TINHTRANGXULY_THOIGIAN: 'Đang xử lý - 13/09/2026 09:00',
            THOIGIANHOANTHANHDUKIEN: '20/09/2026', SOTIEN: 0, YKIENKHAC: '', LOAI: ['TongSoYeuCauDaGui', 'TongSoYeuCauDangXuLy'] },
        { ID: 'N3', MAYEUCAU: 'MC2609022', YEUCAU_ID: 'YC_BAOLUU', YEUCAU_TEN: 'Đơn xin bảo lưu kết quả học tập',
            NGAYTAO_DD_MM_YYYY_HHMMSS: '18/09/2026 09:45:11', TINHTRANGXULY_THOIGIAN: 'Cần bổ sung - 19/09/2026 15:20',
            THOIGIANHOANTHANHDUKIEN: '25/09/2026', SOTIEN: 30000, YKIENKHAC: 'Đã nộp thêm giấy khám bệnh',
            LOAI: ['TongSoYeuCauDaGui', 'TongSoYeuCauCanHoanThien'] }
    ];
    fx['pkg_dvmc_yeucau.LayTTTongHopDVMC_YeuCau_Nhan'] = function () {
        function dem(k) { return YC.filter(function (r) { return r.LOAI.indexOf(k) >= 0; }).length; }
        return [{ TONGSOYEUCAUDAGUI: dem('TongSoYeuCauDaGui'), TONGSOYEUCAUDADUOCXULY: dem('TongSoYeuCauDaDuocXuLy'),
            TONGSOYEUCAUDANGXULY: dem('TongSoYeuCauDangXuLy'), TONGSOYEUCAUCANHOANTHIEN: dem('TongSoYeuCauCanHoanThien') }];
    };
    fx['pkg_dvmc_yeucau.LayDSDVMC_YeuCau_Nhan'] = function (o) {
        return YC.filter(function (r) { return r.LOAI.indexOf(o.strPhanLoaiYeuCau) >= 0; });
    };
    fx['pkg_dvmc_yeucau.Them_DVMC_YeuCau_Nhan'] = function (o) {
        if (o.strId) {
            YC.forEach(function (r) {
                if (r.ID !== o.strId) return;
                if (String(o.dHanhDong) === '1' && r.LOAI.indexOf('TongSoYeuCauDaGui') < 0) {
                    r.LOAI = ['TongSoYeuCauDaGui', 'TongSoYeuCauDangXuLy'];
                    r.TINHTRANGXULY_THOIGIAN = 'Đang xử lý - 23/09/2026 10:00';
                }
            });
            return { rows: [], raw: { Id: o.strId } };
        }
        var id = 'N' + (seq++);
        var dv = DV.filter(function (d) { return d.ID === o.strYeuCau_Id; })[0] || {};
        YC.push({ ID: id, MAYEUCAU: 'MC2609' + (100 + seq), YEUCAU_ID: dv.ID, YEUCAU_TEN: dv.TEN,
            NGAYTAO_DD_MM_YYYY_HHMMSS: '23/09/2026 09:00:00', TINHTRANGXULY_THOIGIAN: 'Chưa gửi',
            THOIGIANHOANTHANHDUKIEN: '', SOTIEN: 0, YKIENKHAC: '', LOAI: [] });
        return { rows: [], raw: { Id: id } };
    };
    fx['pkg_dvmc_yeucau.Xoa_DVMC_YeuCau_Nhan'] = function (o) {
        for (var i = YC.length - 1; i >= 0; i--) if (YC[i].ID === o.strId) YC.splice(i, 1);
        return [];
    };
    fx['pkg_dvmc_yeucau.Sua_YKien_DVMC_YeuCau_Nhan'] = function (o) {
        YC.forEach(function (r) { if (r.ID === o.strId) r.YKIENKHAC = o.strYKienKhac; });
        return [];
    };

    /* ---------- Mức độ hài lòng ------------------------------------------ */
    var DG = [{ ID: 'HL1', TEN: 'Rất hài lòng' }, { ID: 'HL2', TEN: 'Hài lòng' },
        { ID: 'HL3', TEN: 'Bình thường' }, { ID: 'HL4', TEN: 'Chưa hài lòng' }];
    var KQDG = { N1: 'HL2' };
    fx['pkg_dvmc_chung.LayDSDanhGiaTheoPhamVi'] = function (o) {
        var v = KQDG[o.strDVMC_YeuCau_Nhan_Id];
        return { rows: { rsDanhMucDanhGia: DG, rsKetQuaDanhGia: v ? [{ DANHGIA_ID: v }] : [] }, pager: 0 };
    };
    fx['pkg_dvmc_thongtin.Them_DVMC_DanhGia_YC_DuLieu'] = function (o) {
        KQDG[o.strDVMC_YeuCau_Nhan_Id] = o.strDanhGia_Id;
        return [];
    };

    ums.demo.add(fx);
})();
