/* Dữ liệu mẫu cho thamnien — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ds = [
        { ID: 'TN1', NHANSU_HOSOCANBO_ID: 'NS1', DAOTAO_COCAUTOCHUC_ID: 'CC1', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', NHANSU_HOSOCANBO_MASO: 'CB001',
          NHANSU_HOSOCANBO_HODEM: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'Hùng', TUNGAY: '01/09/2005', DENNGAY: '' },
        { ID: 'TN2', NHANSU_HOSOCANBO_ID: 'NS2', DAOTAO_COCAUTOCHUC_ID: 'CC2', DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Hệ thống thông tin', NHANSU_HOSOCANBO_MASO: 'CB015',
          NHANSU_HOSOCANBO_HODEM: 'Trần Thị', NHANSU_HOSOCANBO_TEN: 'Mai', TUNGAY: '15/08/2012', DENNGAY: '31/12/2025' }
    ];
    ums.demo.add({ 'NS_QT_ThamNien/LayDanhSach': function () { return { rows: ds, pager: ds.length }; } });
})();
