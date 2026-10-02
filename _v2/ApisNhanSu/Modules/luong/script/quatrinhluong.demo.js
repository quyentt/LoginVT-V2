/* Dữ liệu mẫu cho quatrinhluong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ds = [
        { ID: 'QTL1', NHANSU_HOSOCANBO_ID: 'NS1', NHOM_ID: 'NN1', NGACH_ID: 'NG3', NGACH_MA: 'V.07.01.03', BAC: '3', BACLUONG_HIENTAI: '3', HESOLUONG: '3.00',
          NGAYHUONG: '01/07/2021', PHANTRAMHUONG: '100', LYDO: 'Nâng lương thường xuyên', LOAICHUCDANHNGHENGHIEP_ID: 'CD1', BACLUONG_TIEPTHEO: '01/07/2024', NGAYHUONGLUONG_TIEPTHEO: '01/07/2024' },
        { ID: 'QTL2', NHANSU_HOSOCANBO_ID: 'NS1', NHOM_ID: 'NN1', NGACH_ID: 'NG3', NGACH_MA: 'V.07.01.03', BAC: '4', BACLUONG_HIENTAI: '4', HESOLUONG: '3.33',
          NGAYHUONG: '01/07/2024', PHANTRAMHUONG: '100', LYDO: 'Nâng lương thường xuyên', LOAICHUCDANHNGHENGHIEP_ID: 'CD1', BACLUONG_TIEPTHEO: '', NGAYHUONGLUONG_TIEPTHEO: '01/07/2027' }
    ];
    ums.demo.add({
        'NS_QT_Luong/LayDanhSach': function (o) { return ds.filter(function (r) { return r.NHANSU_HOSOCANBO_ID === o.strNhanSu_HoSoCanBo_Id || o.strNhanSu_HoSoCanBo_Id !== 'NS3'; }); },
        'NS_QT_Luong/LayChiTiet': function (o) { return ds.filter(function (r) { return r.ID === o.strId; }); },
        'NS_ThongTinQuyetDinh/LayDanhSach': function (o) {
            return o.strNguonDuLieu_Id === 'QTL2' ? [{ ID: 'QD01', LOAIQUYETDINH_ID: 'QD1', SOQUYETDINH: '215/QĐ-ĐHKT', NGAYQUYETDINH: '20/06/2024', NGAYHIEULUC: '01/07/2024', NGAYHETHIEULUC: '' }] : [];
        }
    });
})();
