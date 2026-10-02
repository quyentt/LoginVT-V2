/* Dữ liệu mẫu cho hoatdong/duyet1cua — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var DS = [
        { ID: 'YC1', YEUCAU_TEN: 'Giấy xác nhận sinh viên', MAYEUCAU: 'XNSV-0001', NGAYTAO_DD_MM_YYYY_HHMMSS: '22/09/2026 08:12:03', NGUOIXULY_TENDAYDU: '', NGUOIXULY_TAIKHOAN: '',
          TINHTRANGXULY_TEN: 'Chờ xử lý', NGAYXULY_DD_MM_YYYY_HHMMSS: '', PHI: 0, QLSV_NGUOIHOC_ID: 'NH01', QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An',
          GHICHU: '', DANHGIA_TEN: '', YKIENKHAC: '', DAOTAO_CHUONGTRINH_ID: 'CTKTPM', PL: 'ChoXuLy' },
        { ID: 'YC2', YEUCAU_TEN: 'Bảng điểm học tập', MAYEUCAU: 'BD-0042', NGAYTAO_DD_MM_YYYY_HHMMSS: '21/09/2026 15:40:11', NGUOIXULY_TENDAYDU: 'Trần Thị Mai', NGUOIXULY_TAIKHOAN: 'mai.tt',
          TINHTRANGXULY_TEN: 'Đã hoàn thành', NGAYXULY_DD_MM_YYYY_HHMMSS: '22/09/2026 09:01:00', PHI: 20000, QLSV_NGUOIHOC_ID: 'NH02', QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình',
          GHICHU: 'Lấy bản giấy', DANHGIA_TEN: 'Rất hài lòng', YKIENKHAC: '', DAOTAO_CHUONGTRINH_ID: 'CTKTPM', PL: 'DaHoanThanh' }
    ];
    fx['pkg_dvmc_tiepnhan_xuly.LayDSLoaiYeuCau'] = [{ ID: 'L1', TEN: 'Giấy xác nhận sinh viên' }, { ID: 'L2', TEN: 'Bảng điểm học tập' }];
    fx['pkg_dvmc_tiepnhan_xuly.LayDSDVMC_YeuCau_Nhan_XuLy'] = function (o) { return DS.filter(function (x) { return !o.strPhanLoai || x.PL === o.strPhanLoai; }); };
    fx['pkg_dvmc_chung.LayDSCauTruc_YeuCau'] = { rsCauTrucYeuCau: [
        { NOIDUNG: 'Kính gửi: Phòng Công tác sinh viên' },
        { NOIDUNG: 'Em tên là @T1-TEXT--1---220@, mã sinh viên @T2-TEXT--1---140@' },
        { NOIDUNG: 'Mục đích xin giấy: @T3-LIST-DVMC.MUCDICH-1---260@' }
    ] };
    fx['pkg_dvmc_thongtin.LayTTDVMC_CauTruc_YC_DuLieu'] = function (o) {
        return [{ TRUONGTHONGTIN_GIATRI: { T1: 'Nguyễn Văn An', T2: 'BIT220101', T3: 'MD2' }[o.strTruongThongTin_Id] || '' }];
    };
    fx[D + 'DVMC.MUCDICH'] = [{ ID: 'MD1', MA: 'VAY', TEN: 'Vay vốn ngân hàng' }, { ID: 'MD2', MA: 'NVQS', TEN: 'Tạm hoãn nghĩa vụ quân sự' }];
    fx['pkg_dvmc_chung.LayDSTinhTrangXuLy'] = [{ ID: 'TT1', TEN: 'Đã tiếp nhận' }, { ID: 'TT2', TEN: 'Hoàn thành' }, { ID: 'TT3', TEN: 'Trả lại' }];
    fx['pkg_dvmc_chung.LayDSNguoiDungPhanCongYC'] = function (o) { return o.strTinhTrangXuLy_Id ? [{ ID: 'NS2', TEN: 'Trần Thị Mai' }] : []; };
    fx['pkg_dvmc_tiepnhan_xuly.Them_DVMC_YeuCau_TiepNhan_XuLy'] = function (o) {
        DS.forEach(function (x) { if (x.ID === o.strDVMC_YeuCau_Nhan_Id) { x.TINHTRANGXULY_TEN = 'Đã tiếp nhận'; x.NGUOIXULY_TENDAYDU = 'admin'; } });
        return [];
    };
    ums.demo.add(fx);
})();
