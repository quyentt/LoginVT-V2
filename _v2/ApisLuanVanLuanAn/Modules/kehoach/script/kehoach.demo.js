/* Dữ liệu mẫu Kế hoạch (Luận văn, luận án) — chỉ dùng ở chế độ dựng thử. Mã người học / cán bộ là mã bịa. */
(function () {
    var KH = 'LVLA_BV_KeHoach/', CH = 'LVLA_BV_Chung/';
    function boDau(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function trang(rows, o) {
        var p = Number(o.pageIndex) || 1, s = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((p - 1) * s, p * s), pager: rows.length };
    }
    var LOAI = [{ ID: 'PL1', TEN: 'Bảo vệ luận văn thạc sĩ' }, { ID: 'PL2', TEN: 'Bảo vệ luận án tiến sĩ' }];
    var TG = [{ ID: 'TG251', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - Năm học 2025-2026' }, { ID: 'TG252', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - Năm học 2025-2026' }];
    var DSKH = [
        { ID: 'LK1', TEN: 'Bảo vệ luận văn thạc sĩ — đợt 1/2026', THOIGIAN: 'Học kỳ 1 - Năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG251', PHANLOAI_ID: 'PL1',
          PHANLOAI_TEN: 'Bảo vệ luận văn thạc sĩ', TUNGAY: '01/03/2026', DENNGAY: '30/06/2026', MOTA: 'Đợt bảo vệ đầu năm', HIEULUC: 1 },
        { ID: 'LK2', TEN: 'Bảo vệ luận án tiến sĩ — đợt 2/2026', THOIGIAN: 'Học kỳ 2 - Năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG252', PHANLOAI_ID: 'PL2',
          PHANLOAI_TEN: 'Bảo vệ luận án tiến sĩ', TUNGAY: '01/09/2026', DENNGAY: '30/12/2026', MOTA: '', HIEULUC: 1 }
    ];
    function cb(id, ma, ho, ten, dv) { return { ID: id, MASO: ma, HODEM: ho, TEN: ten, DONVI: dv, DIENTHOAI: '0901000' + id.slice(-3), EMAIL: ten.toLowerCase() + '@truong.edu.vn' }; }
    var HP = [
        { ID: 'LKHP1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_MA: 'LV501', DAOTAO_HOCPHAN_TEN: 'Luận văn thạc sĩ', DAOTAO_HOCPHAN_HOCTRINH: '12', DONVI: 'Khoa Công nghệ thông tin' },
        { ID: 'LKHP2', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_MA: 'CD502', DAOTAO_HOCPHAN_TEN: 'Chuyên đề nghiên cứu', DAOTAO_HOCPHAN_HOCTRINH: '3', DONVI: 'Khoa Công nghệ thông tin' }
    ];
    var DT = [
        { ID: 'DTX1', MADETAI: 'DT-26-01', TENDETAITIENGVIET: 'Phát hiện gian lận thi trực tuyến bằng học sâu', TENDETAITIENGANH: 'Deep learning for online exam fraud detection',
          NGUOICUOI_TAIKHOAN: 'hungnv', NGAYTAO_DD_MM_YYYY: '01/03/2026', DASUDUNG: 1 },
        { ID: 'DTX2', MADETAI: 'DT-26-02', TENDETAITIENGVIET: 'Hệ khuyến nghị học phần', TENDETAITIENGANH: 'Course recommender system',
          NGUOICUOI_TAIKHOAN: 'maitt', NGAYTAO_DD_MM_YYYY: '03/03/2026', DASUDUNG: 0 }
    ];
    var SVR = [
        ['NHK1', 'CH30001', 'Nguyễn Minh', 'Anh'], ['NHK2', 'CH30002', 'Trần Thu', 'Hà'], ['NHK3', 'CH30003', 'Lê Quang', 'Huy'],
        ['NHK4', 'CH30004', 'Phạm Hồng', 'Nhung'], ['NHK5', 'CH30005', 'Đỗ Văn', 'Tùng']
    ].map(function (x) {
        return { ID: 'NG' + x[0], QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: '10/04/1998',
            DAOTAO_LOPQUANLY_TEN: 'CH-CNTT-K30', DAOTAO_CHUONGTRINH_TEN: 'Thạc sĩ Khoa học máy tính', DAOTAO_KHOADAOTAO_TEN: 'K30', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1',
            DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Luận văn thạc sĩ', DAOTAO_HOCPHAN_MA: 'LV501', THOIGIAN: 'Học kỳ 1 - Năm học 2025-2026', ANH: '' };
    });
    var GHI = { rows: [], raw: { Id: 'LKNEW1' } };
    var fx = {};
    fx[CH + 'LayDSThoiGian'] = TG;
    fx[CH + 'LayDSBV_NguoiDung_PhanLoai'] = LOAI;
    fx['KHCT_ThoiGianDaoTao/LayDanhSach'] = TG;
    fx[KH + 'LayDSBV_KeHoach'] = function (o) {
        return trang(DSKH.filter(function (x) {
            return (!o.strPhanLoai_Id || x.PHANLOAI_ID === o.strPhanLoai_Id) && (!o.strDaoTao_ThoiGianDaoTao_Id || x.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id) &&
                (!o.strTuKhoa || boDau(x.TEN).indexOf(boDau(o.strTuKhoa)) >= 0);
        }), o);
    };
    fx[KH + 'LayDSBV_KeHoach_DonVi'] = [cb('DV001', 'CB001', 'Nguyễn Văn', 'Hùng', 'Khoa Công nghệ thông tin')];
    fx[KH + 'LayDSBV_KeHoach_NhanSu'] = [cb('NS001', 'CB015', 'Trần Thị', 'Mai', 'Phòng Đào tạo sau đại học'), cb('NS002', 'CB022', 'Phạm Đức', 'Long', 'Phòng Đào tạo sau đại học')];
    fx[KH + 'LayDSBV_KeHoach_DeTai'] = [DT[0]];
    fx[KH + 'LayDSBV_DeTai'] = DT;
    fx[KH + 'LayDSBV_Kehoach_HocPhan'] = HP;
    fx[KH + 'LayDSBV_Kehoach_NguoiHoc'] = function (o) { return trang(SVR.slice(0, 3), o); };
    fx[KH + 'LayDSBV_NguoiHoc'] = function (o) {
        return SVR.filter(function (x) { return !o.strTuKhoa || boDau(x.QLSV_NGUOIHOC_MASO + ' ' + x.QLSV_NGUOIHOC_HODEM + ' ' + x.QLSV_NGUOIHOC_TEN).indexOf(boDau(o.strTuKhoa)) >= 0; });
    };
    ['Them_BV_KeHoach', 'Sua_BV_KeHoach', 'Xoa_BV_KeHoach', 'Them_BV_KeHoach_DonVi', 'Xoa_BV_KeHoach_DonVi', 'Them_BV_KeHoach_NhanSu', 'Xoa_BV_KeHoach_NhanSu',
        'Them_BV_KeHoach_DeTai', 'Xoa_BV_KeHoach_DeTai', 'Them_BV_Kehoach_HocPhan', 'Xoa_BV_Kehoach_HocPhan', 'Them_BV_Kehoach_NguoiHoc'].forEach(function (k) { fx[KH + k] = GHI; });
    fx['HB_XepLoaiDanhHieu/Xoa_XLDH_KeHoach_PhamVi'] = GHI;
    ums.demo.add(fx);
})();
