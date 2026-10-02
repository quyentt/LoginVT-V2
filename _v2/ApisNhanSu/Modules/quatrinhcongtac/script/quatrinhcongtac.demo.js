/* Dữ liệu mẫu cho quatrinhcongtac (Nhân sự) — chỉ dùng ở chế độ dựng thử.
   Tab 1 dùng quatrinhcongtac.demo.js của Cổng cán bộ (nạp cùng tệp .js); ở đây là tab 2 (điều chuyển). */
(function () {
    ums.demo.add({ 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#IMPORTWITHPROC_TCCB': [] });
    ums.demo.crudStore('NS_QT_ThuyenChuyenCanBo', [
        { ID: 'TC1', NGAYCHUYEN: '01/09/2020', DONVICU_ID: 'CC2', DONVICU_TENDONVI: 'Bộ môn Hệ thống thông tin', DONVICU_NGOAITRUONG: '',
          DONVIMOI_ID: 'CC1', DONVIMOI_TENDONVI: 'Khoa Công nghệ thông tin', DONVIMOI_NGOAITRUONG: '', SOQUYETDINH: '215/QĐ-ĐH',
          NGAYQUYETDINH: '20/08/2020', LOAIQUYETDINH_ID: 'QD1', NHANSU_TTQUYETDINH_NGAYAD: '01/09/2020', NHANSU_TTQUYETDINH_NGAYHL: '01/09/2020',
          NHANSU_TTQUYETDINH_NGAYHHL: '', CHUCVUCU_ID: 'CV1', CHUCVUMOI_ID: 'CV2', NHANSU_THONGTINQUYETDINH_ID: 'QDTC1', LAQUATRINHHIENTAI: 'CUOICUNG' },
        { ID: 'TC2', NGAYCHUYEN: '01/03/2015', DONVICU_ID: '', DONVICU_TENDONVI: '', DONVICU_NGOAITRUONG: 'Công ty CP Phần mềm FPT',
          DONVIMOI_ID: 'CC2', DONVIMOI_TENDONVI: 'Bộ môn Hệ thống thông tin', DONVIMOI_NGOAITRUONG: '', SOQUYETDINH: '48/QĐ-ĐH',
          NGAYQUYETDINH: '15/02/2015', LOAIQUYETDINH_ID: 'QD1', NHANSU_TTQUYETDINH_NGAYAD: '01/03/2015', LAQUATRINHHIENTAI: '' }
    ], { map: function (o) {
        return { NGAYCHUYEN: o.strNgayChuyen, DONVICU_ID: o.strDonViCu_Id, DONVICU_NGOAITRUONG: o.strDonViCu_NgoaiTruong,
            DONVIMOI_ID: o.strDonViMoi_Id, DONVIMOI_NGOAITRUONG: o.strDonViMoi_NgoaiTruong, SOQUYETDINH: o.strSoQuyetDinh,
            NGAYQUYETDINH: o.strNgayQuyetDinh, LOAIQUYETDINH_ID: o.strLoaiQuyetDinh_Id, NHANSU_TTQUYETDINH_NGAYAD: o.strNgayApDung,
            NHANSU_TTQUYETDINH_NGAYHL: o.strNgayHieuLuc, NHANSU_TTQUYETDINH_NGAYHHL: o.strNgayHetHieuLuc,
            CHUCVUCU_ID: o.strChucVuCu_Id, CHUCVUMOI_ID: o.strChucVuMoi_Id };
    } });
})();
