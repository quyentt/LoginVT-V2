/* Dữ liệu mẫu cho cosovatchat/toanha — chỉ ở chế độ dựng thử (toà nhà, phòng, danh mục ở _ktx.demo.js). */
(function () {
    var AD = [
        { ID: 'AD1', KTX_PHONG_ID: 'P101', PHANLOAIDOITUONG_ID: 'DT1' },
        { ID: 'AD2', KTX_PHONG_ID: 'P101', PHANLOAIDOITUONG_ID: 'DT2' },
        { ID: 'AD3', KTX_PHONG_ID: 'Q101', PHANLOAIDOITUONG_ID: 'DT1' }
    ];
    var seq = 10;
    ums.demo.add({
        'KTX_Phong_ApDung/LayDanhSach': function (o) { return AD.filter(function (r) { return r.KTX_PHONG_ID === o.strKTX_Phong_Id; }); },
        'KTX_Phong_ApDung/ThemMoi': function (o) { var id = 'AD' + (seq++); AD.push({ ID: id, KTX_PHONG_ID: o.strKTX_Phong_Id, PHANLOAIDOITUONG_ID: o.strPhanLoaiDoiTuong_Id }); return { rows: [], raw: { Id: id } }; },
        'KTX_Phong_ApDung/Xoa': function (o) {
            for (var i = AD.length - 1; i >= 0; i--) if (AD[i].KTX_PHONG_ID === o.strKTX_Phong_Id && AD[i].PHANLOAIDOITUONG_ID === o.strPhanLoaiDoiTuong_Id) AD.splice(i, 1);
            return [];
        }
    });
})();
