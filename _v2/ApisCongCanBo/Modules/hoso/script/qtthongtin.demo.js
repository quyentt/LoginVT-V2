/* Dữ liệu mẫu cho qtthongtin — chỉ dùng ở chế độ dựng thử. NS.DMCV, NS.QUDI, cơ cấu tổ chức, NS_Files có sẵn. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'NS.DMHV'] = [{ ID: 'HV2', MA: 'THS', TEN: 'Thạc sĩ' }, { ID: 'HV3', MA: 'TS', TEN: 'Tiến sĩ' }];
    fx[D + 'NS.LOCD'] = [{ ID: 'CD1', MA: 'PGS', TEN: 'Phó giáo sư' }];
    fx[D + 'NS.TDCT'] = [{ ID: 'CT2', MA: 'TC', TEN: 'Trung cấp' }, { ID: 'CT3', MA: 'CC', TEN: 'Cao cấp' }];
    fx[D + 'NS.TDTH'] = [{ ID: 'TH2', MA: 'NC', TEN: 'Tin học nâng cao' }];
    fx[D + 'NS.TDNN'] = [{ ID: 'NN3', MA: 'C1', TEN: 'C1' }];
    fx[D + 'NS.QHGD'] = [{ ID: 'QH4', MA: 'CON', TEN: 'Con' }];
    fx['NS_HoatDong_ThongTin/LayDM_NhanSu_HoatDong'] = [
        { ID: 'HD1', MA: 'BN', TEN: 'Bổ nhiệm, điều động' }, { ID: 'HD2', MA: 'DT', TEN: 'Đi học, bồi dưỡng' }
    ];
    fx['NS_HoatDong_DuLieu/LayDanhSach'] = [
        { ID: 'TT1', TEN: 'Nơi làm việc mới', KIEUDULIEU: 'TEXT', THONGTINXACMINH: '' },
        { ID: 'TT2', TEN: 'Quan hệ người đi cùng', KIEUDULIEU: 'LIST', MABANGDANHMUC: 'NS.QHGD', THONGTINXACMINH: '' },
        { ID: 'TT3', TEN: 'Văn bản kèm theo', KIEUDULIEU: 'FILE', THONGTINXACMINH: '' }
    ];
    fx['NS_HoatDong_DuLieu/ThemMoi'] = [];
    ums.demo.add(fx);
    var ROWS = [
        { ID: 'HDT1', HOATDONGNHANSU_ID: 'HD1', HOATDONGNHANSU_TEN: 'Bổ nhiệm, điều động', MOTA: 'Bổ nhiệm Phó trưởng khoa', TUNGAY: '01/07/2025', DENNGAY: '',
          DONVI_CCTC_HIENTAI_ID: 'CC2', DONVI_CCTC_HIENTAI_TEN: 'Bộ môn HTTT', DONVI_CCTC_BIENDONG_ID: 'CC1', DONVI_CCTC_BIENDONG_TEN: 'Khoa CNTT',
          CHUCVU_HIENTAI_ID: 'CV4', CHUCVU_HIENTAI_TEN: 'Trưởng bộ môn', CHUCVU_BIENDONG_ID: 'CV2', CHUCVU_BIENDONG_TEN: 'Phó trưởng khoa', DSSOQUYETDINH: '88/QĐ-ĐHHN' },
        { ID: 'HDT2', HOATDONGNHANSU_ID: 'HD2', HOATDONGNHANSU_TEN: 'Đi học, bồi dưỡng', MOTA: 'Học lý luận chính trị cao cấp', TUNGAY: '01/03/2026', DENNGAY: '30/09/2026',
          TRINHDOCHINHTRI_HIENTAI_ID: 'CT2', TRINHDOCHINHTRI_HIENTAI_TEN: 'Trung cấp', TRINHDOCHINHTRI_BIENDONG_ID: 'CT3', TRINHDOCHINHTRI_BIENDONG_TEN: 'Cao cấp', DSSOQUYETDINH: '' }
    ];
    ums.demo.crudStore('NS_HoatDong_ThongTin', ROWS, {
        list: function (rows, o) { return rows.filter(function (r) { return !o.strHoatDongNhanSu_Id || r.HOATDONGNHANSU_ID === o.strHoatDongNhanSu_Id; }); },
        map: function (o) { return { HOATDONGNHANSU_ID: o.strHoatDongNhanSu_Id, MOTA: o.strMoTa, TUNGAY: o.strTuNgay, DENNGAY: o.strDenNgay }; }
    });
    ums.demo.crudStore('NS_ThongTinQuyetDinh', [
        { ID: 'QDT1', NGUONDULIEU_ID: 'HDT1', LOAIQUYETDINH_ID: 'QD1', SOQUYETDINH: '88/QĐ-ĐHHN', NGAYQUYETDINH: '20/06/2025', NGAYHIEULUC: '01/07/2025' }
    ], { list: function (rows, o) { return rows.filter(function (r) { return r.NGUONDULIEU_ID === o.strNguonDuLieu_Id; }); },
         map: function (o) { return { NGUONDULIEU_ID: o.strNguonDuLieu_Id, SOQUYETDINH: o.strSoQuyetDinh, LOAIQUYETDINH_ID: o.strLoaiQuyetDinh_Id }; } });
})();
