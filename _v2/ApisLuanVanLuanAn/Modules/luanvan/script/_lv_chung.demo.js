/* Dữ liệu mẫu dùng chung cho luanvan (kế hoạch, học viên, hộp chọn LLKH, danh mục) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten, t1, t2) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: t1 || '', THONGTIN2: t2 || '' }; }
    var fx = {};
    var KH = [
        { ID: 'KH1', TEN: 'Đề cương luận văn đợt 1 năm 2025', MOTA: '', NGAYBATDAU: '01/09/2025', NGAYKETTHUC: '30/12/2025' },
        { ID: 'KH2', TEN: 'Đề cương luận văn đợt 2 năm 2026', MOTA: 'Đợt bổ sung', NGAYBATDAU: '01/03/2026', NGAYKETTHUC: '30/06/2026' }
    ];
    if (!ums.demo.fixtures['LVLA_KeHoach_DeCuong/LayDanhSach']) {
        ums.demo.crudStore('LVLA_KeHoach_DeCuong', KH, { map: function (o) { return { TEN: o.strTen, MOTA: o.strMoTa, NGAYBATDAU: o.strNgayBatDau, NGAYKETTHUC: o.strNgayKetThuc }; } });
    }
    fx['SV_HoSo/LayDanhSach'] = [
        { ID: 'NH01', MASO: 'BIT220101', HODEM: 'Nguyễn Văn', TEN: 'An' }, { ID: 'NH02', MASO: 'BIT220102', HODEM: 'Trần Thị', TEN: 'Bình' },
        { ID: 'NH03', MASO: 'BBA220561', HODEM: 'Lê Minh', TEN: 'Châu' }
    ];
    var LLKH = [
        { ID: 'GV1', MASO: 'GV001', HOVATEN: 'Nguyễn Văn Hùng', MACHUCDANH: 'PGS', MAHOCVI: 'TS', NAMSINH: '1975', TENGIOITINH: 'Nam', COQUANCONGTAC: 'Khoa CNTT' },
        { ID: 'GV2', MASO: 'GV015', HOVATEN: 'Trần Thị Mai', MACHUCDANH: '', MAHOCVI: 'ThS', NAMSINH: '1988', TENGIOITINH: 'Nữ', COQUANCONGTAC: 'Khoa Kinh tế' },
        { ID: 'GV3', MASO: 'GV102', HOVATEN: 'Lê Quang Minh', MACHUCDANH: '', MAHOCVI: 'TS', NAMSINH: '1983', TENGIOITINH: 'Nam', COQUANCONGTAC: 'Khoa CNTT' }
    ];
    fx['pkg_llkh_hoso.LayDanhSachLLKH'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var rows = LLKH.filter(function (r) { return !q || (r.MASO + ' ' + r.HOVATEN).toLowerCase().indexOf(q) >= 0; });
        return { rows: rows, pager: rows.length };
    };
    fx[DM + 'LVLA.VTHD'] = [dm('VT1', 'HDC', 'Hướng dẫn chính'), dm('VT2', 'HDP', 'Hướng dẫn phụ')];
    fx[DM + 'LVLA.VTHDONG'] = [dm('HD1', 'CT', 'Chủ tịch'), dm('HD2', 'TK', 'Thư ký'), dm('HD3', 'UV', 'Uỷ viên')];
    fx[DM + 'XLHV.XNKK'] = [dm('XN1', 'DUYET', 'Đạt', 'fa fa-check-circle', 'color:#2e7d32'), dm('XN2', 'KDUYET', 'Không đạt', 'fa fa-times-circle', 'color:#c62828')];
    ums.demo.add(fx);
    ums.demo.crudStore('LVLA_NhanXet_DanhGia', [], {
        map: function (o) { return { TINHTRANG_TEN: o.strTinhTrang_Id === 'XN1' ? 'Đạt' : 'Không đạt', NOIDUNG: o.strNoiDung, NGUOIXACNHAN_TENDAYDU: 'Người dùng thử', NGAYTAO_DD_MM_YYYY: '12/10/2026', SANPHAM: o.strSanPham_Id }; },
        list: function (rows, o) { return rows.filter(function (r) { return r.SANPHAM === o.strsanpham_Id; }); }
    });

    /* Dòng đề cương mẫu: dùng chung để đăng ký / chính thức / hội đồng cùng thấy dữ liệu */
    ums.demo.lvDeCuong = function (id, n) {
        var sv = [['NH01', 'BIT220101', 'Nguyễn Văn An'], ['NH02', 'BIT220102', 'Trần Thị Bình'], ['NH03', 'BBA220561', 'Lê Minh Châu']][n];
        return { ID: id, LVLA_KEHOACH_DECUONG_ID: 'KH1', QLSV_NGUOIHOC_ID: sv[0], QLSV_NGUOIHOC_MASO: sv[1], QLSV_NGUOIHOC_HOTEN: sv[2],
            DAOTAO_HEDAOTAO_ID: 'H1', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_CHUONGTRINH_ID: 'CTKTPM', DAOTAO_LOPQUANLY_ID: 'L1',
            DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67',
            TENTIENGVIET: 'Ứng dụng học máy trong dự báo ' + (n + 1), TENTIENGANH: 'Machine learning for forecasting ' + (n + 1),
            MOTA: 'Đề cương mẫu ' + (n + 1), NGAYDANGKY: '15/09/2025', SOQUYETDINH: '12' + n + '/QĐ-ĐHX', NGAYQUYETDINH: '01/10/2025',
            LVLA_DECUONG_DANGKY_ID: id, KETQUADANHGIA: n === 0 ? 'Đạt' : '' };
    };
})();
