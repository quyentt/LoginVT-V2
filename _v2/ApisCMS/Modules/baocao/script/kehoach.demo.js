/* Dữ liệu mẫu cho baocao/kehoach — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var KH = [
        { ID: 'KH1', MA: 'BC-2026-HK1', TEN: 'Báo cáo thống kê học kỳ 1 năm học 2026-2027', TUNGAY: '01/09/2026', DENNGAY: '31/01/2027', TRANGTHAI_ID: 'TT1', TRANGTHAI_TEN: 'Đang thực hiện' },
        { ID: 'KH2', MA: 'BC-2026-3CK', TEN: 'Báo cáo ba công khai năm 2026', TUNGAY: '15/06/2026', DENNGAY: '30/09/2026', TRANGTHAI_ID: 'TT1', TRANGTHAI_TEN: 'Đang thực hiện' },
        { ID: 'KH3', MA: 'BC-2025-NAM', TEN: 'Báo cáo tổng kết năm học 2025-2026', TUNGAY: '01/07/2026', DENNGAY: '15/08/2026', TRANGTHAI_ID: 'TT2', TRANGTHAI_TEN: 'Đã khoá' },
        { ID: 'KH4', MA: 'BC-2026-TS', TEN: 'Báo cáo tuyển sinh 2026', TUNGAY: '01/08/2026', DENNGAY: '30/10/2026', TRANGTHAI_ID: 'TT3', TRANGTHAI_TEN: 'Chưa mở' }
    ];
    var COSO = [
        { ID: 'CS1', TEN: 'Cơ sở chính — Hà Nội', DAOTAO_COSODAOTAO_CHA_TEN: 'Trường Đại học Kinh tế Kỹ thuật' },
        { ID: 'CS2', TEN: 'Phân hiệu Thanh Hoá', DAOTAO_COSODAOTAO_CHA_TEN: 'Trường Đại học Kinh tế Kỹ thuật' },
        { ID: 'CS3', TEN: 'Cơ sở Hưng Yên', DAOTAO_COSODAOTAO_CHA_TEN: 'Trường Đại học Kinh tế Kỹ thuật' }
    ];
    var HTBC = [
        { ID: 'BC1', MA: 'THBC01', TEN: 'Thống kê quy mô người học', HIEULUC: 1, PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Đào tạo' },
        { ID: 'BC2', MA: 'THBC02', TEN: 'Thống kê đội ngũ giảng viên', HIEULUC: 1, PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Nhân sự' },
        { ID: 'BC3', MA: 'THBC03', TEN: 'Công khai tài chính', HIEULUC: 0, PHANLOAI_ID: 'PL3', PHANLOAI_TEN: 'Tài chính' }
    ];
    var PQ = [
        { ID: 'PQ1', KH: 'KH1', THBC_NHATRUONG_TEN: 'Trường Đại học Kinh tế Kỹ thuật', THBC_COSODAOTAO_ID: 'CS1', THBC_COSODAOTAO_TEN: 'Cơ sở chính — Hà Nội', THBC_HETHONGBAOCAO_ID: 'BC1', THBC_HETHONGBAOCAO_TEN: 'Thống kê quy mô người học' },
        { ID: 'PQ2', KH: 'KH1', THBC_NHATRUONG_TEN: 'Trường Đại học Kinh tế Kỹ thuật', THBC_COSODAOTAO_ID: 'CS2', THBC_COSODAOTAO_TEN: 'Phân hiệu Thanh Hoá', THBC_HETHONGBAOCAO_ID: 'BC1', THBC_HETHONGBAOCAO_TEN: 'Thống kê quy mô người học' },
        { ID: 'PQ3', KH: 'KH1', THBC_NHATRUONG_TEN: 'Trường Đại học Kinh tế Kỹ thuật', THBC_COSODAOTAO_ID: 'CS1', THBC_COSODAOTAO_TEN: 'Cơ sở chính — Hà Nội', THBC_HETHONGBAOCAO_ID: 'BC2', THBC_HETHONGBAOCAO_TEN: 'Thống kê đội ngũ giảng viên' }
    ];
    var fx = {
        'pkg_thbc_xuly.LayDSTHBC_KeHoachBaoCao': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var r = KH.filter(function (x) { return (!o.strTrangThai_Id || x.TRANGTHAI_ID === o.strTrangThai_Id) && (!q || (x.MA + ' ' + x.TEN).toLowerCase().indexOf(q) >= 0); });
            return { rows: r, pager: r.length };
        },
        'CMS_KeHoachBaoCao/ThemMoi': { rows: [], message: '' },
        'CMS_KeHoachBaoCao/CapNhat': { rows: [], message: '' },
        'CMS_KeHoachBaoCao/Xoa': { rows: [], message: '' },
        'CMS_BaoCao_Chung/LayDanhSach': COSO,
        'CMS_HeThongBaoCao/LayDanhSach': function (o) {
            var r = HTBC.filter(function (x) { return !o.strPhanLoai_Id || x.PHANLOAI_ID === o.strPhanLoai_Id; });
            return { rows: r, pager: r.length };
        },
        'CMS_BaoCao_CoSo/LayDanhSach': function (o) { return PQ.filter(function (x) { return x.KH === o.strTHBC_KeHoachBaoCao_Id; }); },
        'CMS_BaoCao_CoSo/ThemMoi': function (o) {
            var cs = COSO.filter(function (x) { return x.ID === o.strTHBC_CoSoDaoTao_Id; })[0] || {};
            var bc = HTBC.filter(function (x) { return x.ID === o.strTHBC_HeThongBaoCao_Id; })[0] || {};
            PQ.push({ ID: 'PQ' + (PQ.length + 10), KH: o.strTHBC_KeHoachBaoCao_Id, THBC_NHATRUONG_TEN: cs.DAOTAO_COSODAOTAO_CHA_TEN,
                THBC_COSODAOTAO_ID: cs.ID, THBC_COSODAOTAO_TEN: cs.TEN, THBC_HETHONGBAOCAO_ID: bc.ID, THBC_HETHONGBAOCAO_TEN: bc.TEN });
            return { rows: [], message: '' };
        },
        'CMS_BaoCao_CoSo/CapNhat': { rows: [], message: '' },
        'CMS_BaoCao_CoSo/Xoa': function (o) { PQ = PQ.filter(function (x) { return x.ID !== o.strIds; }); return { rows: [], message: '' }; }
    };
    fx[D + 'THBC.KEHOACH.TRANGTHAI'] = [
        { ID: 'TT1', MA: 'DANGTH', TEN: 'Đang thực hiện', CHUNG_TENDANHMUC_TEN: 'Trạng thái kế hoạch' },
        { ID: 'TT2', MA: 'DAKHOA', TEN: 'Đã khoá', CHUNG_TENDANHMUC_TEN: 'Trạng thái kế hoạch' },
        { ID: 'TT3', MA: 'CHUAMO', TEN: 'Chưa mở', CHUNG_TENDANHMUC_TEN: 'Trạng thái kế hoạch' }
    ];
    ums.demo.add(fx);
})();
