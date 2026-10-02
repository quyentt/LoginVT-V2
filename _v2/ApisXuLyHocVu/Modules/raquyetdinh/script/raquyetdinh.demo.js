/* Dữ liệu mẫu riêng của Ra quyết định — chỉ dùng ở chế độ dựng thử (phần chung: pheduyetketqua/script/_xlhv.demo.js). */
(function () {
    var QD = [{ ID: 'QD01', SOQUYETDINH: '215/QĐ-ĐHCN' }, { ID: 'QD02', SOQUYETDINH: '318/QĐ-ĐHCN' }];
    ums.demo.add({
        'pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh': function () { return QD.slice(); },
        'pkg_hosohocvien_quyetdinh.LayDSLoaiQuyetDinh': [{ ID: 'LQD1', TEN: 'Cảnh báo học vụ' }, { ID: 'LQD2', TEN: 'Buộc thôi học' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.CQD': [{ ID: 'CQ1', MA: 'TRUONG', TEN: 'Cấp trường' }, { ID: 'CQ2', MA: 'KHOA', TEN: 'Cấp khoa' }],
        'pkg_hosohocvien_quyetdinh.Them_QLSV_QuyetDinh': function (o) {
            QD.push({ ID: 'QD0' + (QD.length + 1), SOQUYETDINH: o.strSoQuyetDinh || '(chưa có số)' });
            return [];
        },
        'pkg_hosohocvien_quyetdinh.Them_QLSV_QuyetDinh_NguoiHoc': [],
        /* tra TRACK_ID theo lớp: mọi người học mẫu XL01…XL12 đều có trong lớp được hỏi */
        'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc': function () {
            var r = [];
            for (var i = 1; i <= 12; i++) r.push({ QLSV_NGUOIHOC_ID: 'NHXL' + (i < 10 ? '0' : '') + i, DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', TRACK_ID: 'TR' + i });
            return r;
        }
    });
})();
