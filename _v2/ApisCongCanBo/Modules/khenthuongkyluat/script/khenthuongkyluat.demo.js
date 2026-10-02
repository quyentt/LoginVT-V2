/* Dữ liệu mẫu cho khenthuongkyluat — chỉ dùng ở chế độ dựng thử. NS.QUDI, NS_Files có sẵn. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'NS.HINHTHUCKHENTHUONG'] = [{ ID: 'HT1', MA: 'GK', TEN: 'Giấy khen' }, { ID: 'HT2', MA: 'BK', TEN: 'Bằng khen' }];
    fx[D + 'NCKH.LKT'] = [{ ID: 'CK1', MA: 'TRUONG', TEN: 'Cấp trường' }, { ID: 'CK2', MA: 'BO', TEN: 'Cấp bộ' }];
    fx[D + 'NS.HINHTHUCKYLUAT'] = [{ ID: 'KL1', MA: 'KT', TEN: 'Khiển trách' }, { ID: 'KL2', MA: 'CC', TEN: 'Cảnh cáo' }];
    ums.demo.add(fx);
    ums.demo.crudStore('NS_QT_KhenThuong', [
        { ID: 'KTH1', COQUANKHENTHUONG: 'Trường Đại học', THANHTICHKHENTHUONG_KHAC: 'Giảng viên dạy giỏi 2024-2025', HINHTHUCKHENTHUONG_ID: 'HT1',
          HINHTHUCKHENTHUONG_TEN: 'Giấy khen', CAPKHENTHUONG_ID: 'CK1', CAPKHENTHUONG_TEN: 'Cấp trường', LOAIQUYETDINH_ID: 'QD1',
          NHANSU_TTQUYETDINH_SOQD: '320/QĐ-ĐHHN', NHANSU_TTQUYETDINH_NGAYQD: '20/08/2025', NHANSU_THONGTINQUYETDINH_ID: 'TTQ9' }
    ], { map: function (o) { return { COQUANKHENTHUONG: o.strCoQuanKhenThuong, THANHTICHKHENTHUONG_KHAC: o.strThanhTichKhenThuong_Khac,
        HINHTHUCKHENTHUONG_ID: o.strHinhThucKhenThuong_Id, CAPKHENTHUONG_ID: o.strCapKhenThuong_Id, NHANSU_TTQUYETDINH_SOQD: o.strSoQuyetDinh,
        NHANSU_TTQUYETDINH_NGAYQD: o.strNgayQuyetDinh }; } });
    ums.demo.crudStore('NS_QT_KyLuat', [], { map: function (o) { return { COQUANKYLUAT: o.strCoQuanKyLuat, LYDO: o.strLyDo,
        HINHTHUCKYLUAT_ID: o.strHinhThucKyLuat_Id, NHANSU_TTQUYETDINH_SOQD: o.strSoQuyetDinh, NHANSU_TTQUYETDINH_NGAYQD: o.strNgayQuyetDinh }; } });
})();
