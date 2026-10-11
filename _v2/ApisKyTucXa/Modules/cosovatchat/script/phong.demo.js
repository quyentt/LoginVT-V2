/* Dữ liệu mẫu cho cosovatchat/phong — công tơ gắn phòng; chỉ ở chế độ dựng thử (toà nhà / phòng ở _ktx.demo.js). */
(function () {
    var fx = ums.demo.fixtures || {};
    var CTD = [
        { ID: 'CTD1', TEN: 'Công tơ A1-101', MA: 'CTD-A1-101' }, { ID: 'CTD2', TEN: 'Công tơ A1-102', MA: 'CTD-A1-102' },
        { ID: 'CTD3', TEN: 'Công tơ A2-101', MA: 'CTD-A2-101' }, { ID: 'CTD4', TEN: '', MA: 'CTD-B-201' }
    ];
    var CTN = [
        { ID: 'CTN1', TEN: 'Đồng hồ nước A1-T1', MA: 'CTN-A1-T1' }, { ID: 'CTN2', TEN: 'Đồng hồ nước A1-T2', MA: 'CTN-A1-T2' },
        { ID: 'CTN3', TEN: 'Đồng hồ nước A2-T1', MA: 'CTN-A2-T1' }
    ];
    if (!fx['KTX_CongToDien/LayDanhSach']) ums.demo.add({ 'KTX_CongToDien/LayDanhSach': CTD });
    if (!fx['KTX_CongToNuoc/LayDanhSach']) ums.demo.add({ 'KTX_CongToNuoc/LayDanhSach': CTN });

    var seq = 10;
    function kho(ctrl, kCongTo, colId, colTen, dsCongTo, rows) {
        var o = {};
        o[ctrl + '/LayDanhSach'] = function (q) { return rows.filter(function (r) { return r.KTX_PHONG_ID === q.strKTX_Phong_Id; }); };
        o[ctrl + '/ThemMoi'] = function (q) {
            var ct = dsCongTo.filter(function (x) { return x.ID === q[kCongTo]; })[0] || {};
            var id = ctrl + (seq++), r = { ID: id, KTX_PHONG_ID: q.strKTX_Phong_Id };
            r[colId] = q[kCongTo]; r[colTen] = ct.TEN || ct.MA || '';
            rows.push(r);
            return { rows: [], raw: { Id: id } };
        };
        o[ctrl + '/Xoa'] = function (q) {
            var ids = String(q.strIds || '').split(',');
            for (var i = rows.length - 1; i >= 0; i--) if (ids.indexOf(rows[i].ID) >= 0) rows.splice(i, 1);
            return [];
        };
        ums.demo.add(o);
    }
    kho('KTX_CongToDien_Phong', 'strKTX_CongToDien_Id', 'KTX_CONGTODIEN_ID', 'KTX_CONGTODIEN_TEN', CTD, [
        { ID: 'CDP1', KTX_PHONG_ID: 'P101', KTX_CONGTODIEN_ID: 'CTD1', KTX_CONGTODIEN_TEN: 'Công tơ A1-101' },
        { ID: 'CDP2', KTX_PHONG_ID: 'P102', KTX_CONGTODIEN_ID: 'CTD2', KTX_CONGTODIEN_TEN: 'Công tơ A1-102' }
    ]);
    kho('KTX_CongToNuoc_Phong', 'strKTX_CongToNuoc_Id', 'KTX_CONGTONUOC_ID', 'KTX_CONGTONUOC_TEN', CTN, [
        { ID: 'CNP1', KTX_PHONG_ID: 'P101', KTX_CONGTONUOC_ID: 'CTN1', KTX_CONGTONUOC_TEN: 'Đồng hồ nước A1-T1' }
    ]);
})();
