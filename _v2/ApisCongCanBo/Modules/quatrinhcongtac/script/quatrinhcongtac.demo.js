/* Dữ liệu mẫu cho quatrinhcongtac — chỉ dùng ở chế độ dựng thử. NS.DMCV, cơ cấu tổ chức, NS_Files có sẵn. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'NS.CDNN'] = [{ ID: 'CDN1', MA: 'GV', TEN: 'Giảng viên' }, { ID: 'CDN2', MA: 'GVC', TEN: 'Giảng viên chính' }];
    fx[D + 'NS.LGV0'] = [{ ID: 'LGV1', MA: 'CH', TEN: 'Cơ hữu' }, { ID: 'LGV2', MA: 'TG', TEN: 'Thỉnh giảng' }];
    ums.demo.add(fx);
    ums.demo.crudStore('NS_QT_TieuSuBanThan_TruocTD', [
        { ID: 'TSB1', TUNGAY: '01/09/2009', DENNGAY: '31/08/2012', DONVICONGTAC_ID: '', DONVICONGTAC_TEN: '', MOTA: 'Công ty CP Phần mềm FPT',
          LOAIGIANGVIEN_ID: '', LOAIGIANGVIEN_TEN: '', LOAICHUCDANHNGHENGHIEP_ID: '', CHUCDANHNGHENGHIEP_TEN: '', CHUCVU_ID: '', CHUCVU_TEN: '' },
        { ID: 'TSB2', TUNGAY: '01/09/2012', DENNGAY: '', DONVICONGTAC_ID: 'CC1', DONVICONGTAC_TEN: 'Khoa Công nghệ thông tin', MOTA: '',
          LOAIGIANGVIEN_ID: 'LGV1', LOAIGIANGVIEN_TEN: 'Cơ hữu', LOAICHUCDANHNGHENGHIEP_ID: 'CDN1', CHUCDANHNGHENGHIEP_TEN: 'Giảng viên', CHUCVU_ID: 'CV1', CHUCVU_TEN: 'Giảng viên' }
    ], { map: function (o) { return { TUNGAY: o.strTuNgay, DENNGAY: o.strDenNgay, DONVICONGTAC_ID: o.strDonViCongTac_Id, MOTA: o.strMoTa,
        LOAIGIANGVIEN_ID: o.strLoaiGiangVien_Id, LOAICHUCDANHNGHENGHIEP_ID: o.strChucDanhNgheNghiep_Id, CHUCVU_ID: o.strChucVu_Id }; } });
})();
