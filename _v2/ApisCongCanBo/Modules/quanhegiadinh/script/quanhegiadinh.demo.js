/* Dữ liệu mẫu cho quanhegiadinh — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'NS.QHGD'] = [{ ID: 'QH1', MA: 'BO', TEN: 'Bố' }, { ID: 'QH2', MA: 'ME', TEN: 'Mẹ' }, { ID: 'QH3', MA: 'VO', TEN: 'Vợ' }, { ID: 'QH4', MA: 'CON', TEN: 'Con' }];
    fx[D + 'CHUN.CHLU'] = [{ ID: 'VN', MA: 'VN', TEN: 'Việt Nam' }, { ID: 'US', MA: 'US', TEN: 'Hoa Kỳ' }, { ID: 'JP', MA: 'JP', TEN: 'Nhật Bản' }];
    ums.demo.add(fx);
    function map(o) { return { QUANHE_ID: o.strNhanSu_QuanHe_Id || o.strQuanHe_Id, HODEM: o.strHoDem, TEN1: o.strTen, NAMSINH: o.strNamSinh,
        NGHENGHIEP: o.strNgheNghiep, HOVATEN: o.strHoVaTen, NUOCDINHCU: o.strNuocDinhCu, QUOCTICH: o.strQuocTich, NAMDINHCU: o.strNamDinhCu,
        DONVICONGTAC: o.strDonViCongTac, QUOCGIA_ID: o.strQuocGia_Id, NOIO: o.strNoiO, QUEQUAN: o.strQueQuan, MOTA: o.strMoTa }; }
    ums.demo.crudStore('NS_QT_QuanHeThanToc', [
        { ID: 'GD1', QUANHE_ID: 'QH1', QUANHE_TEN: 'Bố', HODEM: 'Nguyễn Văn', TEN1: 'Hùng', NAMSINH: '1958', NGHENGHIEP: 'Nghỉ hưu', QUOCGIA_ID: 'VN', NOIO: 'Nam Định' },
        { ID: 'GD2', QUANHE_ID: 'QH2', QUANHE_TEN: 'Mẹ', HODEM: 'Trần Thị', TEN1: 'Mai', NAMSINH: '1961', NGHENGHIEP: 'Nghỉ hưu', QUOCGIA_ID: 'VN', NOIO: 'Nam Định' },
        { ID: 'GD3', QUANHE_ID: 'QH4', QUANHE_TEN: 'Con', HODEM: 'Nguyễn Minh', TEN1: 'An', NAMSINH: '2015', NGHENGHIEP: 'Học sinh', QUOCGIA_ID: 'VN' }
    ], { map: map });
    ums.demo.crudStore('NS_QT_QuanHeVoChong', [
        { ID: 'VC1', QUANHE_ID: 'QH1', QUANHE_TEN: 'Bố', HODEM: 'Lê Văn', TEN1: 'Tâm', NAMSINH: '1960', NGHENGHIEP: 'Giáo viên', QUEQUAN: 'Hà Nam' }
    ], { map: map });
    ums.demo.crudStore('NS_QT_ThanNhanNuocNgoai', [
        { ID: 'NN1', QUANHE_ID: 'QH3', QUANHE_TEN: 'Vợ', HOVATEN: 'Lê Thu Hà', NAMSINH: '1988', NGHENGHIEP: 'Nghiên cứu sinh', NUOCDINHCU: 'Nhật Bản', QUOCTICH: 'Việt Nam', NAMDINHCU: '2023' }
    ], { map: map });
})();
