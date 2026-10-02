/* Dữ liệu mẫu cho dangkyhoc/dinhhuong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var P = 'pkg_kehoach_thongtin.', seq = 10, fx = {};
    var KQ = [{ ID: 'DK01', DAOTAO_CT_DINHHUONG_ID: 'DH02', DAOTAO_CT_DINHHUONG_TEN: 'Định hướng Ô tô điện và hybrid', NGAYTAO_DD_MM_YYYY: '12/09/2026' }];
    var DS = [
        { ID: 'DH01', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTOTO16', TEN: 'Định hướng Cơ điện tử ô tô', NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '30/09/2026', CHEDODANGKYDINHHUONG_TEN: 'Tự chọn' },
        { ID: 'DH02', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTOTO16', TEN: 'Định hướng Ô tô điện và hybrid', NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '30/09/2026', CHEDODANGKYDINHHUONG_TEN: 'Tự chọn' },
        { ID: 'DH03', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTOTO16', TEN: 'Định hướng Khai thác và dịch vụ ô tô', NGAYBATDAU: '05/09/2026', NGAYKETTHUC: '05/10/2026', CHEDODANGKYDINHHUONG_TEN: 'Xét theo điểm' }
    ];
    /* Ô Chương trình dùng chung với nhiều màn Cổng sinh viên */
    fx['pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc'] = function (o) {
        return o.strQLSV_NguoiHoc_Id
            ? [{ DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTOTO16', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ kỹ thuật ô tô', DAOTAO_CHUONGTRINH_MA: '7510205' }] : [];
    };
    fx[P + 'LayDSDinhHuongCaNhan'] = function (o) {
        return o.strDaoTao_ChuongTrinh_Id ? { rsDSChung: DS, rsKetQuaCaNhan: KQ } : { rsDSChung: [], rsKetQuaCaNhan: [] };
    };
    fx[P + 'Them_DaoTao_CT_DinhHuong_NH'] = function (o) {
        var d = DS.filter(function (x) { return x.ID === o.strDaoTao_CT_DinhHuong_Id; })[0];
        var n = new Date(), p = function (x) { return (x < 10 ? '0' : '') + x; };
        if (d) KQ.push({ ID: 'DK' + (seq++), DAOTAO_CT_DINHHUONG_ID: d.ID, DAOTAO_CT_DINHHUONG_TEN: d.TEN,
            NGAYTAO_DD_MM_YYYY: p(n.getDate()) + '/' + p(n.getMonth() + 1) + '/' + n.getFullYear() });
        return [];
    };
    fx[P + 'Xoa_DaoTao_CT_DinhHuong_NH'] = function (o) {
        KQ = KQ.filter(function (x) { return x.ID !== o.strIds; });
        return [];
    };
    ums.demo.add(fx);
})();
