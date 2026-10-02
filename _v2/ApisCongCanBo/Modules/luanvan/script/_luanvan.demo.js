/* Dữ liệu mẫu chung cho module luanvan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var KH = 'LVLA_BV_KeHoach/', CH = 'LVLA_BV_Chung/', DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var KEHOACH = [{ ID: 'KH1', TEN: 'Bảo vệ luận văn thạc sĩ — đợt 1/2026', PHANLOAI_ID: 'PL1' }];
    function sv(id, ma, ho, ten, o) {
        return Object.assign({ ID: id, QLSV_NGUOIHOC_ID: 'NH' + id, QLSV_NGUOIHOC_MASO: ma, QLSV_NGUOIHOC_HODEM: ho, QLSV_NGUOIHOC_TEN: ten,
            DAOTAO_LOPQUANLY_TEN: 'CH-CNTT-K30', DAOTAO_CHUONGTRINH_TEN: 'Thạc sĩ Khoa học máy tính', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Thạc sĩ Khoa học máy tính',
            DAOTAO_KHOADAOTAO_TEN: 'K30', DAOTAO_HEDAOTAO_TEN: 'Thạc sĩ', BV_KEHOACH_ID: 'KH1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', PHANLOAI_ID: 'PL1',
            BV_KEHOACH_DETAI_ID: 'DT' + id, BV_KEHOACH_DETAI_TEN: '', BV_KEHOACH_DETAI_TENTA: '', QLSV_QUYETDINH_SOQD: '', QLSV_QUYETDINH_NGAYQD: '',
            QLSV_QUYETDINH_LYDO: '', LYDODIEUCHINH: '', BV_XACNHAN_HD_TEN: '', BV_XACNHAN_GIAODETAI_TEN: '', THONGTINDETAI: '', GVHD: '' }, o || {});
    }
    var SV = [
        sv('GD1', 'CH30001', 'Nguyễn Minh', 'Anh', { BV_KEHOACH_DETAI_TEN: 'Phát hiện gian lận thi trực tuyến bằng học sâu', BV_KEHOACH_DETAI_TENTA: 'Deep learning for online exam fraud detection',
            QLSV_QUYETDINH_SOQD: '125/QĐ-ĐHCN', QLSV_QUYETDINH_NGAYQD: '15/03/2026', QLSV_QUYETDINH_LYDO: 'Giao đề tài đợt 1', BV_XACNHAN_HD_TEN: 'Đồng ý', BV_XACNHAN_GIAODETAI_TEN: 'Đã duyệt',
            THONGTINDETAI: 'Phát hiện gian lận thi trực tuyến', GVHD: 'TS. Nguyễn Văn Hùng' }),
        sv('GD2', 'CH30002', 'Trần Thu', 'Hà', { BV_KEHOACH_DETAI_TEN: 'Tối ưu lịch thi bằng giải thuật di truyền', LYDODIEUCHINH: 'Đổi hướng nghiên cứu' }),
        sv('GD3', 'CH30003', 'Lê Quang', 'Huy')
    ];
    var CANBO = [{ ID: 'CB1', MASO: 'CB001', HODEM: 'Nguyễn Văn', TEN: 'Hùng' }, { ID: 'CB2', MASO: 'CB015', HODEM: 'Trần Thị', TEN: 'Mai' },
        { ID: 'CB3', MASO: 'CB022', HODEM: 'Phạm Đức', TEN: 'Long' }];
    var VAITRO = [{ ID: 'VT1', TEN: 'Hướng dẫn chính' }, { ID: 'VT2', TEN: 'Hướng dẫn phụ' }, { ID: 'VT3', TEN: 'Phản biện 1' }, { ID: 'VT4', TEN: 'Phản biện 2' }];
    function nguoi(id, cb, vt) {
        var c = CANBO.filter(function (x) { return x.ID === cb; })[0], v = VAITRO.filter(function (x) { return x.ID === vt; })[0];
        return { ID: id, NGUOIDUNG_ID: cb, NGUOIDUNG_HODEM: c.HODEM, NGUOIDUNG_TEN: c.TEN, VAITRO_ID: vt, VAITRO_TEN: v.TEN };
    }
    var GHI = { rows: null, message: '', raw: { Id: 'MOI1' } };
    var TT = [{ ID: 'TT1', TEN: 'Đồng ý' }, { ID: 'TT2', TEN: 'Không đồng ý' }, { ID: 'TT3', TEN: 'Yêu cầu bổ sung' }];
    var fx = {};
    fx[KH + 'LayDSKeHoachTheoNguoiDung'] = KEHOACH;
    fx[KH + 'LayDSBV_KeHoach'] = KEHOACH;
    fx[KH + 'LayDSBV_KH_NG_GiaoDeTai_Duyet'] = SV;
    fx[KH + 'LayDSBV_Kehoach_NguoiHoc'] = { rows: SV, pager: SV.length };
    fx[KH + 'LayDSBV_KH_NG_GiaoDeTai'] = function (o) {
        var s = SV.filter(function (x) { return x.QLSV_NGUOIHOC_ID === o.strQLSV_NguoiHoc_Id; })[0] || SV[0];
        return [Object.assign({}, s, { ID: 'DG' + s.ID, BV_KEHOACH_DETAI_MADETAI: 'DT-26-01', BV_KEHOACH_DETAI_TEN: s.BV_KEHOACH_DETAI_TEN || 'Đề tài chưa đặt tên',
            THONGTINNGUOIHUONGDAN: 'TS. Nguyễn Văn Hùng (HD chính)' })];
    };
    fx[KH + 'LayDSBV_KH_NG_GiaoDeTai_HD'] = [nguoi('N1', 'CB1', 'VT1'), nguoi('N2', 'CB2', 'VT2')];
    fx[KH + 'LayDSBV_KH_NG_GiaoDeTai_PB'] = [{ ID: 'P1', NGUOIDUNG_ID: 'CB3', VAITRO_ID: 'VT3' }];
    fx[KH + 'LayDSBV_KeHoach_NH_GiaoDT_TD'] = [{ ID: 'TD1', NOIDUNG: 'Hoàn thành chương 1 — tổng quan', TUNGAY: '01/04/2026', DENNGAY: '30/04/2026',
        NGAYTAO_DD_MM_YYYY_HHMMSS: '02/05/2026 09:12:30', NGUOITAO_TENDAYDU: 'Nguyễn Văn Hùng' }];
    fx[KH + 'LayDSBV_KeHoach_DeTai'] = [{ ID: 'K1', MADETAI: 'DT-26-01', TENDETAITIENGVIET: 'Phát hiện gian lận thi trực tuyến bằng học sâu', TENDETAITIENGANH: 'Deep learning for online exam fraud detection',
        NGUOICUOI_TAIKHOAN: 'hungnv', NGAYTAO_DD_MM_YYYY: '01/03/2026', DASUDUNG: 1 },
        { ID: 'K2', MADETAI: 'DT-26-02', TENDETAITIENGVIET: 'Hệ khuyến nghị học phần', TENDETAITIENGANH: 'Course recommender system', NGUOICUOI_TAIKHOAN: 'maitt', NGAYTAO_DD_MM_YYYY: '03/03/2026', DASUDUNG: 0 }];
    fx['pkg_bv_kehoach.LayDSBV_KeHoach_DeTai_ChuaGiao'] = [{ ID: 'K2', MADETAI: 'DT-26-02', TENDETAITIENGVIET: 'Hệ khuyến nghị học phần' }];
    fx[KH + 'LayDSBV_HoiDong'] = [{ ID: 'HDG1', TENHOIDONG: 'Hội đồng bảo vệ số 1' }];
    fx[KH + 'LayDSBV_KeHoach_NH_GiaoDT_BV'] = function (o) {
        return o.strBV_HoiDong_Id ? [
            Object.assign(nguoi('TV1', 'CB1', 'VT1'), { LOAIHOIDONG_TEN: 'Hội đồng chấm', DANHGIA_ID: 'DG1', NHANXET: 'Đạt yêu cầu', DIEM: '8.5' }),
            Object.assign(nguoi('TV2', 'CB3', 'VT3'), { LOAIHOIDONG_TEN: 'Hội đồng chấm', DANHGIA_ID: '', NHANXET: '', DIEM: '' })] : [];
    };
    fx[KH + 'LayDSBV_BaoVe_Lich'] = function (o) { return o.strBV_HoiDong_Id ? [{ ID: 'L1', NGAY: '20/06/2026', GIO: '08:00', DIADIEM: 'Phòng họp A3', MOTA: 'Mời đại diện doanh nghiệp' }] : []; };
    fx[CH + 'LayDSBV_NguoiDung_LoaiHoiDong'] = [{ ID: 'LH1', TEN: 'Hội đồng chấm' }, { ID: 'LH2', TEN: 'Hội đồng đánh giá' }];
    fx[CH + 'LayDSBV_VaiTro_PhanLoai'] = VAITRO;
    fx['pkg_bv_chung.LayDSBV_VaiTro_PhanLoai'] = VAITRO;
    ['HD', 'PB', 'PhanBienQ', 'GiaoDeTai'].forEach(function (k) {
        fx[CH + 'LayDSBV_XacNhan_' + k] = [{ TINHTRANG_TEN: 'Yêu cầu bổ sung', NGUOIXACNHAN_TENDAYDU: 'Trần Thị Mai', NGAYTAO_DD_MM_YYYY: '10/05/2026' }];
        fx[CH + 'Them_BV_XacNhan_' + k] = GHI;
    });
    fx['NS_HoSoV2/LayDanhSach'] = CANBO;
    fx['NS_CoCauToChuc/LayDanhSach'] = [{ ID: 'DV1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'DV2', TEN: 'Khoa Điện tử' }];
    fx['LVLA_Files/LayDanhSach'] = [];
    ['BV.TINHTRANG.XACNHANPHANBIENQUYEN', 'PB.TINHTRANG.XACNHAN.TRUOCKHILAPHOIDONG', 'HD.TINHTRANG.XACNHANHUONGDAN', 'BV.TINHTRANG.XACNHANGIAODETAI',
        'BV.TINHTRANG.XACNHANBAOVE'].forEach(function (c) { fx[DM + c] = TT; });
    fx[DM + 'BV.DANHGIA'] = [{ ID: 'DG1', TEN: 'Đạt' }, { ID: 'DG2', TEN: 'Không đạt' }];
    ['Them_BV_KeHoach_NH_GiaoDT_PB', 'Sua_BV_KeHoach_NH_GiaoDT_PB', 'Xoa_BV_KeHoach_NH_GiaoDT_PB', 'Them_BV_KeHoach_NH_GiaoDT_HD', 'Sua_BV_KeHoach_NH_GiaoDT_HD',
        'Xoa_BV_KeHoach_NH_GiaoDT_HD', 'Them_BV_KeHoach_NH_GiaoDT_TD', 'Sua_BV_KeHoach_NH_GiaoDT_TD', 'Xoa_BV_KeHoach_NH_GiaoDT_TD', 'Them_BV_KH_NG_GiaoDeTai',
        'Sua_BV_KH_NG_GiaoDeTai', 'Xoa_BV_KH_NG_GiaoDeTai', 'Them_BV_KeHoach_DeTai', 'Sua_BV_KeHoach_DeTai', 'Xoa_BV_KeHoach_DeTai', 'Them_BV_HoiDong', 'Xoa_BV_HoiDong',
        'Them_BV_KeHoach_NH_GiaoDT_BV', 'Sua_BV_KeHoach_NH_GiaoDT_BV', 'Xoa_BV_KeHoach_NH_GiaoDT_BV', 'Them_BV_BaoVe_Lich', 'Sua_BV_BaoVe_Lich', 'Xoa_BV_BaoVe_Lich']
        .forEach(function (k) { fx[KH + k] = GHI; });
    ums.demo.add(fx);
})();
