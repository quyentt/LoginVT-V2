/* Dữ liệu mẫu nhóm hợp đồng KTX (tự nạp trước _hopdong.js ở chế độ dựng thử) — hình dạng cột theo tệp .js gốc. */
(function () {
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: '' }; }
    function like(s, q) { return !q || String(s || '').toLowerCase().indexOf(String(q).toLowerCase()) >= 0; }

    /* Tòa nhà / phòng: kho CHUNG của cosovatchat/script/_ktx.demo.js (nạp trước vì thẻ _ktx.js đứng trước _hopdong.js);
       TN1 Nhà A1 (P101, P102, P201, P202, P301) · TN2 Nhà A2 (Q101…) · TN3 Nhà B (B101…) — không khai riêng ở đây nữa (12/10) */
    var PHONG = (ums.demo.ktx || { PHONG: [] }).PHONG;
    var KHOANTHU_KTX = [
        { ID: 'KT-KTX1', MA: 'TIENPHONG', TEN: 'Tiền phòng ký túc xá', NHOMCACKHOANTHU_ID: 'KTX' },
        { ID: 'KT-KTX2', MA: 'DIEN', TEN: 'Tiền điện', NHOMCACKHOANTHU_ID: 'KTX' },
        { ID: 'KT-KTX3', MA: 'NUOC', TEN: 'Tiền nước', NHOMCACKHOANTHU_ID: 'KTX' }
    ];
    /* Người đã xếp phòng (KTX_DaXepPhong/LayDanhSach) */
    var NGUOI = [
        { KTX_DOITUONGOKYTUCXA_ID: 'DT1', KTX_DOITUONGOKYTUCXA_HODEM: 'Lăng Văn', KTX_DOITUONGOKYTUCXA_TEN: 'Huy', KTX_DOITUONGOKYTUCXA_MASO: '25001029', ANH: '', KTX_TOANHA_ID: 'TN1', KTX_TOANHA_TEN: 'Nhà A1', KTX_TOANHA_MA: 'A1', KTX_PHONG_ID: 'P101', KTX_PHONG_TEN: '101', KTX_PHONG_MA: 'A1-101', NGAYVAO: '01/09/2026', NGAYRA: '30/06/2027' },
        { KTX_DOITUONGOKYTUCXA_ID: 'DT2', KTX_DOITUONGOKYTUCXA_HODEM: 'Nguyễn Thị', KTX_DOITUONGOKYTUCXA_TEN: 'Lan', KTX_DOITUONGOKYTUCXA_MASO: '25001030', ANH: '', KTX_TOANHA_ID: 'TN2', KTX_TOANHA_TEN: 'Nhà A2', KTX_TOANHA_MA: 'A2', KTX_PHONG_ID: 'Q201', KTX_PHONG_TEN: '201', KTX_PHONG_MA: 'A2-201', NGAYVAO: '01/09/2026', NGAYRA: '30/06/2027' },
        { KTX_DOITUONGOKYTUCXA_ID: 'DT3', KTX_DOITUONGOKYTUCXA_HODEM: 'Trần Minh', KTX_DOITUONGOKYTUCXA_TEN: 'Đức', KTX_DOITUONGOKYTUCXA_MASO: '24002118', ANH: '', KTX_TOANHA_ID: 'TN1', KTX_TOANHA_TEN: 'Nhà A1', KTX_TOANHA_MA: 'A1', KTX_PHONG_ID: 'P102', KTX_PHONG_TEN: '102', KTX_PHONG_MA: 'A1-102', NGAYVAO: '15/08/2026', NGAYRA: '15/06/2027' },
        { KTX_DOITUONGOKYTUCXA_ID: 'DT4', KTX_DOITUONGOKYTUCXA_HODEM: 'Phạm Thu', KTX_DOITUONGOKYTUCXA_TEN: 'Hà', KTX_DOITUONGOKYTUCXA_MASO: '23003305', ANH: '', KTX_TOANHA_ID: 'TN3', KTX_TOANHA_TEN: 'Nhà B', KTX_TOANHA_MA: 'B', KTX_PHONG_ID: 'B201', KTX_PHONG_TEN: '201', KTX_PHONG_MA: 'B-201', NGAYVAO: '01/09/2026', NGAYRA: '30/06/2027' }
    ];
    /* Hợp đồng (KTX_HopDong) — DT1, DT2 đã có; DT3, DT4 chưa */
    var HOPDONG = [
        { ID: 'HD-KTX1', SOHOPDONG: '01/HĐKTX-2026', NGAYKYHOPDONG: '01/09/2026', NGAYKETTHUCHOPDONG: '30/06/2027', TINHTRANG_ID: 'TTHD1', KTX_PHONG_ID: 'P101', KTX_PHONG_TEN: '101', KTX_TOANHA_ID: 'TN1', KTX_TOANHA_TEN: 'Nhà A1',
          KTX_DOITUONGOKYTUCXA_ID: 'DT1', KTX_DOITUONGOKYTUCXA_HODEM: 'Lăng Văn', KTX_DOITUONGOKYTUCXA_TEN: 'Huy', KTX_DOITUONGOKYTUCXA_MASO: '25001029', NGAYVAO: '01/09/2026', NGAYRA: '30/06/2027', SOTHANG: 10, TONGTIENTHUE: 4000000, GIATHUE_THANG: 400000, SOCHOTHUE: 1, BAOPHONG: 0 },
        { ID: 'HD-KTX2', SOHOPDONG: '02/HĐKTX-2026', NGAYKYHOPDONG: '01/09/2026', NGAYKETTHUCHOPDONG: '30/06/2027', TINHTRANG_ID: 'TTHD1', KTX_PHONG_ID: 'Q201', KTX_PHONG_TEN: '201', KTX_TOANHA_ID: 'TN2', KTX_TOANHA_TEN: 'Nhà A2',
          KTX_DOITUONGOKYTUCXA_ID: 'DT2', KTX_DOITUONGOKYTUCXA_HODEM: 'Nguyễn Thị', KTX_DOITUONGOKYTUCXA_TEN: 'Lan', KTX_DOITUONGOKYTUCXA_MASO: '25001030', NGAYVAO: '01/09/2026', NGAYRA: '30/06/2027', SOTHANG: 10, TONGTIENTHUE: 5000000, GIATHUE_THANG: 500000, SOCHOTHUE: 1, BAOPHONG: 0 }
    ];
    function nguoi(id) { return NGUOI.filter(function (x) { return x.KTX_DOITUONGOKYTUCXA_ID === id; })[0] || {}; }
    function hopDongCua(dtId) { return HOPDONG.filter(function (h) { return h.KTX_DOITUONGOKYTUCXA_ID === dtId; })[0]; }

    var khoanThuCu = ums.demo.fixtures['TC_KhoanThu/LayDanhSach'];
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.TTHD': [dm('TTHD1', '1', 'Đang hiệu lực'), dm('TTHD2', '2', 'Hết hạn'), dm('TTHD3', '3', 'Đã hủy')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.DVT0': [dm('DVT1', 'KW', 'Số điện (kWh)'), dm('DVT2', 'M3', 'Số nước (m³)'), dm('DVT3', 'PT', 'Phần trăm'), dm('DVT4', 'VND', 'Đồng')],
        'TC_KhoanThu/LayDanhSach': function (o) {
            if (o.strNhomCacKhoanThu_Id === 'KTX') return KHOANTHU_KTX;
            return typeof khoanThuCu === 'function' ? khoanThuCu(o) : (khoanThuCu || []);
        },
        'KTX_DaXepPhong/LayDanhSach': function (o) {
            var daLap = Number(o.dDaLapHopDong) === 1;
            var r = NGUOI.filter(function (n) {
                var hd = hopDongCua(n.KTX_DOITUONGOKYTUCXA_ID);
                if (daLap !== !!hd) return false;
                if (o.strKTX_Phong_Id && n.KTX_PHONG_ID !== o.strKTX_Phong_Id) return false;
                if (o.strTinhTrangHopDong_Id && (!hd || hd.TINHTRANG_ID !== o.strTinhTrangHopDong_Id)) return false;
                var q = o.strTuKhoa;
                return like(n.KTX_DOITUONGOKYTUCXA_HODEM + ' ' + n.KTX_DOITUONGOKYTUCXA_TEN, q) || like(n.KTX_DOITUONGOKYTUCXA_MASO, q);
            }).map(function (n) {
                var hd = hopDongCua(n.KTX_DOITUONGOKYTUCXA_ID);
                return Object.assign({ ID: n.KTX_DOITUONGOKYTUCXA_ID, KTX_HOPDONG_ID: hd ? hd.ID : '' }, n);
            });
            var size = Number(o.pageSize) || 10, idx = Number(o.pageIndex) || 1;
            return { rows: r.slice((idx - 1) * size, idx * size), pager: r.length };
        }
    });

    ums.demo.crudStore('KTX_HopDong', HOPDONG, {
        map: function (o) {
            var n = nguoi(o.strKTX_DoiTuongOKyTucXa_Id);
            var p = PHONG.filter(function (x) { return x.ID === o.strKTX_Phong_Id; })[0] || {};
            return { SOHOPDONG: o.strSoHopDong, NGAYKYHOPDONG: o.strNgayKyHopDong, NGAYKETTHUCHOPDONG: o.strNgayKetThucHopDong, TINHTRANG_ID: o.strTinhTrang_Id,
                KTX_PHONG_ID: o.strKTX_Phong_Id, KTX_PHONG_TEN: p.TEN || '', KTX_TOANHA_ID: p.KTX_TOANHA_ID || o.strKTX_ToaNha_Id || '', KTX_TOANHA_TEN: p.KTX_TOANHA_TEN || '',
                KTX_DOITUONGOKYTUCXA_ID: o.strKTX_DoiTuongOKyTucXa_Id, KTX_DOITUONGOKYTUCXA_HODEM: n.KTX_DOITUONGOKYTUCXA_HODEM, KTX_DOITUONGOKYTUCXA_TEN: n.KTX_DOITUONGOKYTUCXA_TEN,
                KTX_DOITUONGOKYTUCXA_MASO: n.KTX_DOITUONGOKYTUCXA_MASO, NGAYVAO: o.strNgayVao, NGAYRA: o.strNgayRa, SOTHANG: o.dSoThang, TONGTIENTHUE: o.dTongTienThue,
                GIATHUE_THANG: o.dGiaThue_Thang, SOCHOTHUE: o.dSoChoThue, BAOPHONG: o.dBaoPhong };
        }
    });

    function luoi(ctrl, rows, heSoKey, heSoCol) {
        ums.demo.crudStore(ctrl, rows, {
            map: function (o) {
                var m = { KTX_HOPDONG_ID: o.strKTX_HopDong_Id, KTX_DOITUONGOKYTUCXA_ID: o.strKTX_DoiTuongOKyTucXa_Id, TAICHINH_CACKHOANTHU_ID: o.strTaiChinh_CacKhoanThu_Id,
                    DONVITINH_ID: o.strDonViTinh_Id, NGAYBATDAUAPDUNG: o.strNgayBatDauApDung, NGAYKETTHUCAPDUNG: o.strNgayKetThucApDung };
                m[heSoCol] = o[heSoKey];
                var n = nguoi(o.strKTX_DoiTuongOKyTucXa_Id);
                m.KTX_DOITUONGOKYTUCXA_HODEM = n.KTX_DOITUONGOKYTUCXA_HODEM; m.KTX_DOITUONGOKYTUCXA_TEN = n.KTX_DOITUONGOKYTUCXA_TEN; m.KTX_DOITUONGOKYTUCXA_MASO = n.KTX_DOITUONGOKYTUCXA_MASO;
                return m;
            },
            list: function (all, o) {
                var r = all.filter(function (x) {
                    return (!o.strKTX_HopDong_Id || x.KTX_HOPDONG_ID === o.strKTX_HopDong_Id) &&
                        (!o.strKTX_DoiTuongOKyTucXa_Id || x.KTX_DOITUONGOKYTUCXA_ID === o.strKTX_DoiTuongOKyTucXa_Id) &&
                        (like(x.KTX_DOITUONGOKYTUCXA_HODEM + ' ' + x.KTX_DOITUONGOKYTUCXA_TEN, o.strTuKhoa) || like(x.KTX_DOITUONGOKYTUCXA_MASO, o.strTuKhoa));
                });
                return { rows: r, pager: r.length };
            }
        });
    }
    luoi('KTX_HopDong_ChinhSach', [
        { ID: 'CS1', KTX_HOPDONG_ID: 'HD-KTX1', KTX_DOITUONGOKYTUCXA_ID: 'DT1', KTX_DOITUONGOKYTUCXA_HODEM: 'Lăng Văn', KTX_DOITUONGOKYTUCXA_TEN: 'Huy', KTX_DOITUONGOKYTUCXA_MASO: '25001029', TAICHINH_CACKHOANTHU_ID: 'KT-KTX2', SODIENNUOCDUOCMIEN: 30, DONVITINH_ID: 'DVT1', NGAYBATDAUAPDUNG: '01/09/2026', NGAYKETTHUCAPDUNG: '30/06/2027' },
        { ID: 'CS2', KTX_HOPDONG_ID: 'HD-KTX2', KTX_DOITUONGOKYTUCXA_ID: 'DT2', KTX_DOITUONGOKYTUCXA_HODEM: 'Nguyễn Thị', KTX_DOITUONGOKYTUCXA_TEN: 'Lan', KTX_DOITUONGOKYTUCXA_MASO: '25001030', TAICHINH_CACKHOANTHU_ID: 'KT-KTX3', SODIENNUOCDUOCMIEN: 3, DONVITINH_ID: 'DVT2', NGAYBATDAUAPDUNG: '01/09/2026', NGAYKETTHUCAPDUNG: '' }
    ], 'dSoDienNuocDuocMien', 'SODIENNUOCDUOCMIEN');
    luoi('KTX_HopDong_MienGiam', [
        { ID: 'MG1', KTX_HOPDONG_ID: 'HD-KTX1', KTX_DOITUONGOKYTUCXA_ID: 'DT1', KTX_DOITUONGOKYTUCXA_HODEM: 'Lăng Văn', KTX_DOITUONGOKYTUCXA_TEN: 'Huy', KTX_DOITUONGOKYTUCXA_MASO: '25001029', TAICHINH_CACKHOANTHU_ID: 'KT-KTX1', PHANTRAMMIENGIAM: 50, DONVITINH_ID: 'DVT3', NGAYBATDAUAPDUNG: '01/09/2026', NGAYKETTHUCAPDUNG: '31/12/2026' }
    ], 'dPhanTramMienGiam', 'PHANTRAMMIENGIAM');
})();
