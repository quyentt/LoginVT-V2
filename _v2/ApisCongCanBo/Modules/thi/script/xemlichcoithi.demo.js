/* Dữ liệu mẫu cho xemlichcoithi — chỉ dùng ở chế độ dựng thử. */
(function () {
    function l(ngay, ca, g, hp, ma) { return { NGAYTHI: ngay, CATHI_TEN: ca, CATHI_GIOBATDAU: g, CATHI_PHUTBATDAU: 0, CATHI_GIOKETTHUC: g + 1, CATHI_PHUTKETTHUC: 30,
        DAOTAO_HOCPHAN_TEN: hp, DAOTAO_HOCPHAN_MA: ma, HINHTHUCTHI_TEN: 'Tự luận', PHONGTHI_TEN: 'A2-301', THOIGIAN: '2026_2027_1', GHICHU: '' }; }
    ums.demo.add({ 'pkg_congthongtincanbo.LayDSKetQuaCoiThi': { rows: { rsChuaThi: [l('06/01/2027', 'Ca 2', 9, 'Lập trình HĐT', 'IT3100')], rsDaThi: [l('10/06/2026', 'Ca 1', 7, 'Cơ sở dữ liệu', 'IT3200')] } } });
})();
