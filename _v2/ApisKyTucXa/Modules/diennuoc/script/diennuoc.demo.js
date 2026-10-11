/* Dữ liệu mẫu màn Quản lý điện - nước (tự nạp trước diennuoc.js ở chế độ dựng thử) — cột theo tệp .js gốc. */
(function () {
    function like(s, q) { return !q || String(s || '').toLowerCase().indexOf(String(q).toLowerCase()) >= 0; }
    var TOANHA = [{ ID: 'TN1', MA: 'A1', TEN: 'Nhà A1' }, { ID: 'TN2', MA: 'A2', TEN: 'Nhà A2' }, { ID: 'TN3', MA: 'B1', TEN: 'Nhà B1' }];
    var PHONG = [
        { ID: 'P101', MA: 'A1-101', TEN: 'Phòng 101', KTX_TOANHA_ID: 'TN1', KTX_TOANHA_TEN: 'Nhà A1', LOAIPHONG_TEN: '8 người', TINHCHAT_TEN: 'Nam' },
        { ID: 'P102', MA: 'A1-102', TEN: 'Phòng 102', KTX_TOANHA_ID: 'TN1', KTX_TOANHA_TEN: 'Nhà A1', LOAIPHONG_TEN: '8 người', TINHCHAT_TEN: 'Nam' },
        { ID: 'P201', MA: 'A2-201', TEN: 'Phòng 201', KTX_TOANHA_ID: 'TN2', KTX_TOANHA_TEN: 'Nhà A2', LOAIPHONG_TEN: '6 người', TINHCHAT_TEN: 'Nữ' },
        { ID: 'P301', MA: 'B1-301', TEN: 'Phòng 301', KTX_TOANHA_ID: 'TN3', KTX_TOANHA_TEN: 'Nhà B1', LOAIPHONG_TEN: '4 người', TINHCHAT_TEN: 'Nữ' }
    ];
    ums.demo.add({
        'KTX_ToaNha/LayDanhSach': function (o) { return TOANHA.filter(function (r) { return like(r.TEN, o.strTuKhoa); }); },
        'KTX_Phong/LayDanhSach': function (o) {
            var r = PHONG.filter(function (p) { return (!o.strKTX_ToaNha_Id || p.KTX_TOANHA_ID === o.strKTX_ToaNha_Id) && (like(p.TEN, o.strTuKhoa) || like(p.MA, o.strTuKhoa)); });
            var size = Number(o.pageSize) || 10, idx = Number(o.pageIndex) || 1;
            return { rows: r.slice((idx - 1) * size, idx * size), pager: r.length };
        }
    });
    function chiSo(ctrl, maCot, suDung, rows) {
        ums.demo.crudStore(ctrl, rows, {
            map: function (o) {
                var m = { KTX_PHONG_ID: o.strKTX_Phong_Id, NGAYLAYTHONGTIN: o.strNgayLayThongTin, CHISODAU: o.dChiSoDau, CHISOGHINHAN: o.dChiSoGhiNhan };
                m[maCot] = 'CT-' + o.strKTX_Phong_Id; m[suDung] = Number(o.dChiSoGhiNhan || 0) - Number(o.dChiSoDau || 0);
                return m;
            },
            list: function (all, o) { var r = all.filter(function (x) { return !o.strKTX_Phong_Id || x.KTX_PHONG_ID === o.strKTX_Phong_Id; }); return { rows: r, pager: r.length }; }
        });
    }
    chiSo('KTX_TrangThietBi_ChiSoDien', 'KTX_CONGTODIEN_MA', 'SODIENSUDUNG', [
        { ID: 'CSD1', KTX_PHONG_ID: 'P101', KTX_CONGTODIEN_MA: 'CT-P101', NGAYLAYTHONGTIN: '31/08/2026', CHISODAU: 1200, CHISOGHINHAN: 1350, SODIENSUDUNG: 150 },
        { ID: 'CSD2', KTX_PHONG_ID: 'P101', KTX_CONGTODIEN_MA: 'CT-P101', NGAYLAYTHONGTIN: '30/09/2026', CHISODAU: 1350, CHISOGHINHAN: 1520, SODIENSUDUNG: 170 },
        { ID: 'CSD3', KTX_PHONG_ID: 'P201', KTX_CONGTODIEN_MA: 'CT-P201', NGAYLAYTHONGTIN: '30/09/2026', CHISODAU: 800, CHISOGHINHAN: 905, SODIENSUDUNG: 105 }
    ]);
    chiSo('KTX_TrangThietBi_ChiSoNuoc', 'KTX_CONGTONUOC_MA', 'SONUOCSUDUNG', [
        { ID: 'CSN1', KTX_PHONG_ID: 'P101', KTX_CONGTONUOC_MA: 'CTN-P101', NGAYLAYTHONGTIN: '31/08/2026', CHISODAU: 300, CHISOGHINHAN: 318, SONUOCSUDUNG: 18 },
        { ID: 'CSN2', KTX_PHONG_ID: 'P101', KTX_CONGTONUOC_MA: 'CTN-P101', NGAYLAYTHONGTIN: '30/09/2026', CHISODAU: 318, CHISOGHINHAN: 340, SONUOCSUDUNG: 22 }
    ]);
})();
