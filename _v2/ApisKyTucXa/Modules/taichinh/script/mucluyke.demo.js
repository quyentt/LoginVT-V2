/* Dữ liệu mẫu cho taichinh/mucluyke — chỉ dùng ở chế độ dựng thử. */
(function () {
    ums.demo.crudStore('KTX_LuyKe', [
        { ID: 'LK1', MA: 'B1', TEN: 'Bậc 1 (0 - 50)', MUCCANDUOI: 0, MUCCANTREN: 50 },
        { ID: 'LK2', MA: 'B2', TEN: 'Bậc 2 (51 - 100)', MUCCANDUOI: 51, MUCCANTREN: 100 },
        { ID: 'LK3', MA: 'B3', TEN: 'Bậc 3 (trên 100)', MUCCANDUOI: 101, MUCCANTREN: 999999 }
    ], { list: function (rows, o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return rows.filter(function (r) { return !q || (r.MA + ' ' + r.TEN).toLowerCase().indexOf(q) >= 0; });
    }, map: function (o) { return { MA: o.strMa, TEN: o.strTen, MUCCANDUOI: o.dMucCanDuoi, MUCCANTREN: o.dMucCanTren }; } });
})();
