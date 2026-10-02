/* Dữ liệu mẫu cho Quá hạn — chỉ dùng ở chế độ dựng thử. */
(function () {
    var SV = [
        ['NH01', 'BIT200101', 'Nguyễn Văn', 'An', 'K64-KTPM1', '120/QĐ-ĐHTL', '05/09/2020'],
        ['NH02', 'BIT200145', 'Đỗ Thị', 'Hương', 'K64-KTPM2', '120/QĐ-ĐHTL', '05/09/2020'],
        ['NH03', 'BBA190212', 'Vũ Minh', 'Khoa', 'K63-QTKD1', '98/QĐ-ĐHTL', '06/09/2019'],
        ['NH04', 'BIT180077', 'Trịnh Quang', 'Long', 'K62-HTTT1', '87/QĐ-ĐHTL', '04/09/2018']
    ];
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TD.PHANLOAI': [
            { ID: 'PL1', MA: 'CHUAN', TEN: 'Thời gian chuẩn' }, { ID: 'PL2', MA: 'TOIDA', TEN: 'Thời gian tối đa' }],
        'pkg_td_thongtin.LayDanhSachHoSoNhieuNganh': function () {
            var rows = SV.map(function (x) {
                return { ID: 'R' + x[0], QLSV_NGUOIHOC_ID: x[0], DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM',
                    QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], DAOTAO_LOPQUANLY_TEN: x[4],
                    DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa ' + x[4].substr(1, 2),
                    DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy',
                    SOQDNHAPTRUONG: x[5], NGAYQDNHAPTRUONG: x[6] };
            });
            return { rows: rows, pager: rows.length };
        },
        'pkg_td_tinhtoan.LayKQTienDoTheoPhanLoai': function (o) {
            var n = Number(String(o.strQLSV_NguoiHoc_Id).slice(-1));
            if (o.strPhanLoai_Id === 'PL1') return [{ KETQUA: n > 2 ? 'Quá hạn ' + (n - 2) + ' học kỳ' : 'Trong hạn' }];
            return [{ KETQUA: n > 3 ? 'Quá hạn' : 'Trong hạn' }];
        }
    });
})();
