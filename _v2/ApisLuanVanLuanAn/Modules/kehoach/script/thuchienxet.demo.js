/* Dữ liệu mẫu Thực hiện xét (Luận văn, luận án) — chỉ dùng ở chế độ dựng thử. Dùng chung hình dạng dữ liệu người học của
   khung Học bổng (_kh_chung.demo.js); mã sinh viên là mã bịa. */
(function () {
    function boDau(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function trang(rows, o) {
        var p = Number(o.pageIndex) || 1, s = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((p - 1) * s, p * s), pager: rows.length };
    }
    var LOAI = [{ ID: 'LDH1', TEN: 'Danh hiệu sinh viên xuất sắc' }, { ID: 'LDH2', TEN: 'Danh hiệu sinh viên tiêu biểu' }];
    var KH = [
        { ID: 'XLDH01', TEN: 'Xét danh hiệu sinh viên xuất sắc học kỳ 1 năm 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG251',
          DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - Năm học 2025-2026', NGAYBATDAU: '05/02/2026', NGAYKETTHUC: '28/02/2026',
          PHANLOAI_ID: 'LDH1', PHANLOAI_TEN: 'Danh hiệu sinh viên xuất sắc', DIEUKIENXET: 'Điểm TB học kỳ ≥ 3,6; rèn luyện ≥ 90', KETQUACHINHTHUC: 1 },
        { ID: 'XLDH02', TEN: 'Xét danh hiệu sinh viên tiêu biểu năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG252',
          DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - Năm học 2025-2026', NGAYBATDAU: '10/06/2026', NGAYKETTHUC: '30/06/2026',
          PHANLOAI_ID: 'LDH2', PHANLOAI_TEN: 'Danh hiệu sinh viên tiêu biểu', DIEUKIENXET: 'Điểm TB tích luỹ ≥ 3,2', KETQUACHINHTHUC: 0 }
    ];
    var NS = { XLDH01: [['XN1', 'Nguyễn Thị Lan'], ['XN2', 'Trần Quang Minh']], XLDH02: [['XN3', 'Lê Thu Hoà']] };
    var SV = [
        ['NHX1', 'SV24001', 'Nguyễn Văn', 'An', 'K24-CNTT1', 'Công nghệ thông tin', 'Xuất sắc', 'Giỏi'],
        ['NHX2', 'SV24017', 'Trần Thị', 'Bình', 'K24-CNTT1', 'Công nghệ thông tin', 'Giỏi', ''],
        ['NHX3', 'SV23045', 'Lê Hoàng', 'Cường', 'K23-QTKD2', 'Quản trị kinh doanh', 'Giỏi', ''],
        ['NHX4', 'SV23058', 'Phạm Minh', 'Đức', 'K23-QTKD2', 'Quản trị kinh doanh', 'Khá', ''],
        ['NHX5', 'SV22110', 'Vũ Ngọc', 'Hà', 'K22-KT1', 'Kế toán', 'Khá', '']
    ].map(function (x) {
        return { QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: '12/05/2004',
            DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_CHUONGTRINH_TEN: x[5], DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT' + x[0], DAOTAO_KHOADAOTAO_TEN: 'Khóa ' + x[4].slice(1, 3),
            KHOAQUANLY_TEN: 'Khoa ' + x[5], DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học',
            XEPLOAI_TEN: x[6], XEPLOAI_THAYDOI_TEN: x[7], TN_KEHOACH_ID: 'XLDH01', PHANLOAI_ID: 'LDH1' };
    });
    function dong(tien, tu, den) { return SV.slice(tu, den).map(function (s) { var r = { ID: tien + s.QLSV_NGUOIHOC_ID }; Object.keys(s).forEach(function (k) { r[k] = s[k]; }); return r; }); }

    var cu = ums.demo.fixtures['HB_KeHoach_NhanSu/LayDanhSach'];
    ums.demo.add({
        'HB_XepLoaiDanhHieu/LayDSXLDH_NguoiDung_PhanLoai': LOAI,
        'HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach': function (o) {
            return trang(KH.filter(function (x) {
                return (!o.strPhanLoai_Id || x.PHANLOAI_ID === o.strPhanLoai_Id) &&
                    (!o.strDaoTao_ThoiGianDaoTao_Id || x.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id) &&
                    (!o.strTuKhoa || boDau(x.TEN).indexOf(boDau(o.strTuKhoa)) >= 0);
            }), o);
        },
        'HB_KeHoach_NhanSu/LayDanhSach': function (o) {
            if (NS[o.strHB_KeHoach_Id]) return NS[o.strHB_KeHoach_Id].map(function (x) { return { ID: x[0], NGUOICUOI_TENDAYDU: x[1] }; });
            return typeof cu === 'function' ? cu(o) : (cu || []);
        },
        'HB_DanhHieuHangDoi/TaoHangDoi_XLDH_TuDong': { rows: [], raw: {} },
        'HB_KetQua/Them_HB_KetQua_CongNhan': { rows: [], raw: { Id: 'KQCN1' } },
        'HB_KetQua/Xoa': { rows: [], raw: {} },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach_PhamVi': function (o) { return trang(dong('PV', 0, 5), o); },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KetQua': function (o) { return trang(dong('KQ', 0, 3), o); },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KetQua_ChiTiet': function () {
            var d = [];
            dong('KQ', 0, 3).forEach(function (r, i) {
                d.push({ HB_KETQUA_ID: r.ID, ID: 'C1', GIATRI: (3.9 - i * 0.2).toFixed(2) });
                d.push({ HB_KETQUA_ID: r.ID, ID: 'C2', GIATRI: String(95 - i * 3) });
            });
            return { rows: { rsCot: [{ ID: 'C1', TEN: 'Điểm TB học kỳ' }, { ID: 'C2', TEN: 'Điểm rèn luyện' }], rsDuLieu: d } };
        },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KetQua_Loi': function (o) { return trang(dong('KL', 3, 5), o); },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KetQua_Loi_ChiTiet': function () {
            return { rows: { rsCot: [{ ID: 'L1', TEN: 'Lý do không đạt' }], rsDuLieu: dong('KL', 3, 5).map(function (r) {
                return { HB_KETQUA_ID: r.ID, ID: 'L1', GIATRI: 'Điểm rèn luyện chưa đủ' };
            }) } };
        },
        'TN_KetQuaHocPhan/LayDanhSach': [
            { DAOTAO_HOCPHAN_MA: 'KT201', DAOTAO_HOCPHAN_TEN: 'Nguyên lý kế toán', DIEM: '3,5', DANHGIA_TEN: 'Chưa đạt', MOTA: 'Thi lại' }
        ]
    });
})();
