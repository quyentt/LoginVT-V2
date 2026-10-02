/* Dữ liệu mẫu cho File báo cáo — chỉ dùng ở chế độ dựng thử.
   Report_GetAllFile trả mảng đường dẫn vật lý; Pager = phần gốc cần cắt. */
(function () {
    var GOC = 'C:\\inetpub\\wwwroot\\ums\\';
    var TEP = {
        '/ApisTaiChinh/Upload': ['BC_ThuTienTheoNgay.xls', 'BC_CongNoSinhVien.xlsx', 'HoaDonGTGT_Mau01.doc', 'BC_TongHopMienGiam.xls'],
        '/ApisDaoTao/Upload': ['DanhSachLopHocPhan.xlsx', 'BangDiemHocPhan.xls', 'KeHoachDaoTao.docx'],
        '/ApisNhanSu/Upload': ['SoYeuLyLich_2C.doc', 'BC_DanhSachCanBo.xls']
    };
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CMS.UDBC': [
            { ID: 'UDBC1', MA: 'ApisTaiChinh', TEN: 'Tài chính', CHUNG_TENDANHMUC_TEN: 'Ứng dụng báo cáo' },
            { ID: 'UDBC2', MA: 'ApisDaoTao', TEN: 'Đào tạo', CHUNG_TENDANHMUC_TEN: 'Ứng dụng báo cáo' },
            { ID: 'UDBC3', MA: 'ApisNhanSu', TEN: 'Nhân sự', CHUNG_TENDANHMUC_TEN: 'Ứng dụng báo cáo' }
        ],
        'SYS_Report/Report_GetAllFile': function (o) {
            var thuMuc = String(o.strUngDung || '').replace(/\//g, '\\').replace(/^\\/, '');
            return { rows: (TEP[o.strUngDung] || []).map(function (t) { return GOC + thuMuc + '\\MauBaoCao\\' + t; }), pager: GOC };
        },
        'CMS_UpCode/UpFileBaoCao': []
    });
})();
