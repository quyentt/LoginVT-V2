/* Dữ liệu mẫu cho tinhdiem/tinhdiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    var C = 'NCKH_TinhDiem_KeHoach', n = 3;
    var KH = [
        { ID: 'KHTD1', MOTA: 'Tính điểm NCKH năm học 2025-2026', TUNGAY: '01/09/2025', DENNGAY: '31/08/2026' },
        { ID: 'KHTD2', MOTA: 'Tính điểm NCKH năm học 2024-2025', TUNGAY: '01/09/2024', DENNGAY: '31/08/2025' },
        { ID: 'KHTD3', MOTA: 'Tính điểm NCKH học kỳ I 2025-2026 (đợt bổ sung)', TUNGAY: '15/01/2026', DENNGAY: '28/02/2026' }
    ];
    var fx = {};
    fx[C + '/LayDanhSach'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var r = KH.filter(function (x) { return !q || x.MOTA.toLowerCase().indexOf(q) >= 0; });
        return { rows: r, pager: r.length };
    };
    fx[C + '/ThemMoi'] = function (o) { KH.push({ ID: 'KHTD' + (++n), MOTA: o.strMoTa, TUNGAY: o.strTuNgay, DENNGAY: o.strDenNgay }); return []; };
    fx[C + '/CapNhat'] = function (o) {
        KH.forEach(function (x) { if (x.ID === o.strId) { x.MOTA = o.strMoTa; x.TUNGAY = o.strTuNgay; x.DENNGAY = o.strDenNgay; } });
        return [];
    };
    fx[C + '/Xoa'] = function (o) { KH = KH.filter(function (x) { return x.ID !== o.strIds; }); return []; };
    ums.demo.add(fx);
})();
