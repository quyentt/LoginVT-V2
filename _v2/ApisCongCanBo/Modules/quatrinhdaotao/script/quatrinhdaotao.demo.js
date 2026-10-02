/* Dữ liệu mẫu cho quatrinhdaotao — chỉ dùng ở chế độ dựng thử.
   NS.QUDI, NS_Files có sẵn trong assets/js/demo-data.js. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var fx = {};
    fx[D + 'QLCB.HTDT'] = [dm('HT1', 'CQ', 'Chính quy'), dm('HT2', 'TC', 'Tại chức'), dm('HT3', 'LK', 'Liên kết')];
    fx[D + 'NS.DMHV'] = [dm('HV1', 'CN', 'Cử nhân'), dm('HV2', 'THS', 'Thạc sĩ'), dm('HV3', 'TS', 'Tiến sĩ')];
    fx[D + 'QLCB.CNDT'] = [dm('CN1', 'CNTT', 'Công nghệ thông tin'), dm('CN2', 'HTTT', 'Hệ thống thông tin'), dm('CN3', 'QTKD', 'Quản trị kinh doanh')];
    fx[D + 'NS.GIAHAN'] = [dm('GH1', 'L1', 'Gia hạn lần 1'), dm('GH2', 'L2', 'Gia hạn lần 2')];
    fx[D + 'NS.TIENDOHOCTAP'] = [dm('TD1', 'DUNG', 'Đúng tiến độ'), dm('TD2', 'CHAM', 'Chậm tiến độ'), dm('TD3', 'XONG', 'Đã bảo vệ')];
    fx[D + 'NS.TDCT'] = [dm('CT1', 'SC', 'Sơ cấp'), dm('CT2', 'TC', 'Trung cấp'), dm('CT3', 'CC', 'Cao cấp')];
    fx[D + 'NS.TDTH'] = [dm('TH1', 'CB', 'Tin học cơ bản'), dm('TH2', 'NC', 'Tin học nâng cao')];
    fx[D + 'NS.TDNN'] = [dm('NN1', 'B1', 'B1'), dm('NN2', 'B2', 'B2'), dm('NN3', 'C1', 'C1')];
    fx[D + 'NS.DMNN'] = [dm('NG1', 'EN', 'Tiếng Anh'), dm('NG2', 'FR', 'Tiếng Pháp'), dm('NG3', 'JP', 'Tiếng Nhật')];
    ums.demo.add(fx);

    function map(cols) {
        return function (o) { var r = {}; Object.keys(cols).forEach(function (k) { r[cols[k]] = o[k]; }); return r; };
    }
    function theoDaoTao(rows, o) { return rows.filter(function (r) { return r.NHANSU_QT_DATO_ID === o.strNhanSu_QT_DATO_Id; }); }

    ums.demo.crudStore('NS_QT_DaoTao', [
        { ID: 'DT1', NOIDAOTAO: 'Đại học Bách khoa Hà Nội', NGANHDAOTAO: 'Khoa học máy tính', NGAYBATDAU: '2004', NGAYKETTHUC: '2009',
          HINHTHUCDAOTAO_ID: 'HT1', BANGCAPCHUNGCHI_ID: 'HV1', BANGCAPCHUNGCHI_TEN: 'Cử nhân', NHANSU_THONGTINQUYETDINH_ID: '', SOQUYETDINH: '', NGAYQUYETDINH: '' },
        { ID: 'DT2', NOIDAOTAO: 'Đại học Quốc gia Hà Nội', NGANHDAOTAO: 'Hệ thống thông tin', NGAYBATDAU: '2020', NGAYKETTHUC: '2024',
          HINHTHUCDAOTAO_ID: 'HT1', BANGCAPCHUNGCHI_ID: 'HV3', BANGCAPCHUNGCHI_TEN: 'Tiến sĩ', NHANSU_THONGTINQUYETDINH_ID: 'QD1',
          SOQUYETDINH: '215/QĐ-ĐHHN', NGAYQUYETDINH: '10/09/2020', NGAYBAOVECOSO: '15/05/2023', NGAYBAOVECHINHTHUC: '20/03/2024' }
    ], { map: map({ strNoiDaoTao: 'NOIDAOTAO', strNganhDaoTao: 'NGANHDAOTAO', strNgayBatDau: 'NGAYBATDAU', strNgayKetThuc: 'NGAYKETTHUC',
        strHinhThucDaoTao_Id: 'HINHTHUCDAOTAO_ID', strBangCapChungChi_Id: 'BANGCAPCHUNGCHI_ID', strSoQuyetDinh: 'SOQUYETDINH',
        strNgayQuyetDinh: 'NGAYQUYETDINH', strNhanSu_ThongTinQD_Id: 'NHANSU_THONGTINQUYETDINH_ID',
        strNgayBaoVeCoSo: 'NGAYBAOVECOSO', strNgayBaoVeChinhThuc: 'NGAYBAOVECHINHTHUC' }) });

    ums.demo.crudStore('NS_QT_DaoTao_GiaHan', [
        { ID: 'GHD1', NHANSU_QT_DATO_ID: 'DT2', LOAIQUYETDINH_ID: 'GH1', SOQUYETDINH: '12/QĐ-GH', NGAYKY: '01/09/2023', GIAHANDENNGAY: '31/03/2024' }
    ], { list: theoDaoTao, map: map({ strNhanSu_QT_DATO_Id: 'NHANSU_QT_DATO_ID', strLoaiQuyetDinh_Id: 'LOAIQUYETDINH_ID',
        strSoQuyetDinh: 'SOQUYETDINH', strNgayKy: 'NGAYKY', strGiaHanDenNgay: 'GIAHANDENNGAY' }) });

    ums.demo.crudStore('NS_QT_DaoTao_TienDo', [
        { ID: 'TDD1', NHANSU_QT_DATO_ID: 'DT2', NGAYBAOCAO: '30/06/2022', TIENDO_ID: 'TD1', MOTA: 'Hoàn thành chuyên đề 1' },
        { ID: 'TDD2', NHANSU_QT_DATO_ID: 'DT2', NGAYBAOCAO: '30/06/2023', TIENDO_ID: 'TD2', MOTA: 'Chậm nộp chuyên đề 3' }
    ], { list: theoDaoTao, map: map({ strNhanSu_QT_DATO_Id: 'NHANSU_QT_DATO_ID', strNgayBaoCao: 'NGAYBAOCAO', strTienDo_Id: 'TIENDO_ID', strMoTa: 'MOTA' }) });

    ums.demo.crudStore('NS_QT_BoiDuong', [
        { ID: 'BD1', DIADIEMBOIDUONG: 'Học viện Quản lý giáo dục', NOIDUNGBOIDUONG: 'Nghiệp vụ sư phạm', NGAYBATDAU: '2010', NGAYKETTHUC: '2010',
          HINHTHUCDAOTAO_ID: 'HT2', KETQUADATDUOC: 'Chứng chỉ NVSP', NHANSU_THONGTINQUYETDINH_ID: '', SOQUYETDINH: '', NGAYQUYETDINH: '' }
    ], { map: map({ strDiaDiemBoiDuong: 'DIADIEMBOIDUONG', strNoiDungBoiDuong: 'NOIDUNGBOIDUONG', strNgayBatDau: 'NGAYBATDAU',
        strNgayKetThuc: 'NGAYKETTHUC', strHinhThucDaoTao_Id: 'HINHTHUCDAOTAO_ID', strHinhThucDaoTao_Khac: 'HINHTHUCDAOTAO_KHAC',
        strKetQuaDatDuoc: 'KETQUADATDUOC', strSoQuyetDinh: 'SOQUYETDINH', strNgayQuyetDinh: 'NGAYQUYETDINH' }) });

    ums.demo.crudStore('NS_QT_HocVi', [
        { ID: 'HVI1', HOCVI_ID: 'HV2', HOCVI_TEN: 'Thạc sĩ', CHUYENNGANH_ID: 'CN1', CHUYENNGANH_TEN: 'Công nghệ thông tin', NAMNHANHOCVI: '2012', NOINHANHOCVI: 'ĐH Bách khoa Hà Nội', LAQUATRINHHIENTAI: '' },
        { ID: 'HVI2', HOCVI_ID: 'HV3', HOCVI_TEN: 'Tiến sĩ', CHUYENNGANH_ID: 'CN2', CHUYENNGANH_TEN: 'Hệ thống thông tin', NAMNHANHOCVI: '2024', NOINHANHOCVI: 'ĐHQG Hà Nội', LAQUATRINHHIENTAI: 'CUOICUNG' }
    ], { map: map({ strHocVi_Id: 'HOCVI_ID', strChuyenNganh_Id: 'CHUYENNGANH_ID', strNamNhanHocVi: 'NAMNHANHOCVI', strNoiNhanHocVi: 'NOINHANHOCVI' }) });

    ums.demo.crudStore('NS_QT_TrinhDoLyLuan', [
        { ID: 'LL1', TRINHDOLYLUAN_ID: 'CT2', TRINHDOLYLUAN_TEN: 'Trung cấp', NAMCONGNHAN: '2018', MOTA: '', LAQUATRINHHIENTAI: 'CUOICUNG' }
    ], { map: map({ strTrinhDoLyLuan_Id: 'TRINHDOLYLUAN_ID', strNamCongNhan: 'NAMCONGNHAN', strMoTa: 'MOTA' }) });

    ums.demo.crudStore('NS_QT_TrinhDoTinHoc', [
        { ID: 'TIH1', TRINHDOTINHOC_ID: 'TH2', TRINHDOTINHOC_TEN: 'Tin học nâng cao', TRINHDOTINHOC_KHAC: '', MOTA: 'Không thời hạn' }
    ], { map: map({ strTrinhDoTinHoc_Id: 'TRINHDOTINHOC_ID', strTrinhDoTinHoc_Khac: 'TRINHDOTINHOC_KHAC', strMoTa: 'MOTA' }) });

    ums.demo.crudStore('NS_QT_TrinhDoNgoaiNgu', [
        { ID: 'NGN1', NGONNGU_ID: 'NG1', NGONNGU_TEN: 'Tiếng Anh', TRINHDONGOAINGU_ID: 'NN3', TRINHDONGOAINGU_TEN: 'C1', DIEMSO: '7.5',
          DIEM_KYNANGNGHE: '8', DIEM_KYNANGNOI: '7', DIEM_KYNANGDOC: '8', DIEM_KYNANGVIET: '7', MOTA: 'IELTS' }
    ], { map: map({ strNgonNgu_Id: 'NGONNGU_ID', strTrinhDoNgoaiNgu_Id: 'TRINHDONGOAINGU_ID', strDiemSo: 'DIEMSO',
        strDiem_KyNangNghe: 'DIEM_KYNANGNGHE', strDiem_KyNangNoi: 'DIEM_KYNANGNOI', strDiem_KyNangDoc: 'DIEM_KYNANGDOC',
        strDiem_KyNangViet: 'DIEM_KYNANGVIET', strMoTa: 'MOTA' }) });
})();
