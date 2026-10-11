/* Dữ liệu mẫu DÙNG CHUNG cho module cosovatchat (toà nhà, phòng, thiết bị, danh mục KTX) — chỉ ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    function khop(r, q) {
        q = String(q || '').toLowerCase();
        return !q || (String(r.TEN || '') + ' ' + String(r.MA || '')).toLowerCase().indexOf(q) >= 0;
    }
    function trang(rows, o) {
        var size = Number(o.pageSize) || rows.length, idx = Number(o.pageIndex) || 1;
        if (size >= rows.length) return { rows: rows, pager: rows.length };
        return { rows: rows.slice((idx - 1) * size, idx * size), pager: rows.length };
    }

    fx[D + 'KTX.LTN0'] = [dm('LTN1', 'KTX.LTN0.01', 'Nhà nam'), dm('LTN2', 'KTX.LTN0.02', 'Nhà nữ'), dm('LTN3', 'KTX.LTN0.03', 'Nhà hỗn hợp')];
    fx[D + 'KTX.VTCT'] = [dm('VT1', 'KTX.VTCT.01', 'Đầu hồi'), dm('VT2', 'KTX.VTCT.02', 'Giữa nhà')];
    fx[D + 'KTX.ST00'] = [dm('T1', 'KTX.ST00.01', 'Tầng 1'), dm('T2', 'KTX.ST00.02', 'Tầng 2'), dm('T3', 'KTX.ST00.03', 'Tầng 3'), dm('T4', 'KTX.ST00.04', 'Tầng 4')];
    fx[D + 'KTX.LP00'] = [dm('LP1', 'KTX.LP00.01', 'Phòng 8 người'), dm('LP2', 'KTX.LP00.02', 'Phòng 6 người'), dm('LP3', 'KTX.LP00.03', 'Phòng dịch vụ')];
    fx[D + 'KTX.TCP0'] = [dm('TC1', 'KTX.TCP0.01', 'Phòng nam'), dm('TC2', 'KTX.TCP0.02', 'Phòng nữ')];
    fx[D + 'KTX.TTP0'] = [dm('TT1', 'KTX.TTP0.01', 'Đang sử dụng'), dm('TT2', 'KTX.TTP0.02', 'Đang sửa chữa'), dm('TT3', 'KTX.TTP0.03', 'Ngừng sử dụng')];
    fx[D + 'KTX_PHANLOAIDOITUONG'] = [dm('DT1', 'DT.01', 'Sinh viên Việt Nam'), dm('DT2', 'DT.02', 'Lưu học sinh'), dm('DT3', 'DT.03', 'Học viên cao học')];
    fx[D + 'KTX.LTB0'] = [dm('LTB1', 'KTX.LTB0.01', 'Giường tầng'), dm('LTB2', 'KTX.LTB0.02', 'Quạt trần'), dm('LTB3', 'KTX.LTB0.03', 'Bình nóng lạnh'), dm('LTB4', 'KTX.LTB0.04', 'Tủ đồ')];
    fx[D + 'KTX.TTTB'] = [dm('TTB1', 'KTX.TTTB.01', 'Đang sử dụng tốt'), dm('TTB2', 'KTX.TTTB.02', 'Hỏng'), dm('TTB3', 'KTX.TTTB.03', 'Chờ thanh lý')];
    fx[D + 'TS.HSX0'] = [dm('HSX1', 'TS.HSX0.01', 'EMIC'), dm('HSX2', 'TS.HSX0.02', 'Landis+Gyr'), dm('HSX3', 'TS.HSX0.03', 'Vinasino')];
    ums.demo.add(fx);

    var TOA = [
        { ID: 'TN1', TEN: 'Nhà A1', MA: 'A1', SOTANG: 5, THONGTINLIENHE: 'Ban quản lý KTX - 024 3838 1234', DIACHI: 'Khu KTX số 1', LOAITOANHA_ID: 'LTN1', LOAITOANHA_TEN: 'Nhà nam', VITRICAUTHANG_ID: 'VT1', VITRICAUTHANG_TEN: 'Đầu hồi' },
        { ID: 'TN2', TEN: 'Nhà A2', MA: 'A2', SOTANG: 5, THONGTINLIENHE: 'Ban quản lý KTX - 024 3838 1235', DIACHI: 'Khu KTX số 1', LOAITOANHA_ID: 'LTN2', LOAITOANHA_TEN: 'Nhà nữ', VITRICAUTHANG_ID: 'VT2', VITRICAUTHANG_TEN: 'Giữa nhà' },
        { ID: 'TN3', TEN: 'Nhà B', MA: 'B', SOTANG: 3, THONGTINLIENHE: 'Ban quản lý KTX - 024 3838 1236', DIACHI: 'Khu KTX số 2', LOAITOANHA_ID: 'LTN3', LOAITOANHA_TEN: 'Nhà hỗn hợp', VITRICAUTHANG_ID: 'VT1', VITRICAUTHANG_TEN: 'Đầu hồi' }
    ];
    ums.demo.crudStore('KTX_ToaNha', TOA, {
        list: function (rows, o) { return trang(rows.filter(function (r) { return khop(r, o.strTuKhoa); }), o); },
        map: function (o) {
            var lt = fx[D + 'KTX.LTN0'].filter(function (x) { return x.ID === o.strLoaiToaNha_Id; })[0];
            var vt = fx[D + 'KTX.VTCT'].filter(function (x) { return x.ID === o.strViTriCauThang_Id; })[0];
            return { TEN: o.strTen, MA: o.strMa, SOTANG: o.dSoTang, THONGTINLIENHE: o.strThongTinLienHe, DIACHI: o.strDiaChi,
                LOAITOANHA_ID: o.strLoaiToaNha_Id, LOAITOANHA_TEN: lt ? lt.TEN : '', VITRICAUTHANG_ID: o.strViTriCauThang_Id, VITRICAUTHANG_TEN: vt ? vt.TEN : '' };
        }
    });

    var PHONG = [];
    function themPhong(id, toa, ten, tang, lp, tc, tt, dt, g, n) {
        var t = TOA.filter(function (x) { return x.ID === toa; })[0];
        PHONG.push({ ID: id, TEN: ten, MA: t.MA + '-' + ten, KTX_TOANHA_ID: toa, KTX_TOANHA_TEN: t.TEN,
            TANGTHU_ID: tang, TANGTHU_TEN: 'Tầng ' + tang.slice(1), LOAIPHONG_ID: lp, LOAIPHONG_TEN: fx[D + 'KTX.LP00'].filter(function (x) { return x.ID === lp; })[0].TEN,
            TINHCHAT_ID: tc, TINHCHAT_TEN: fx[D + 'KTX.TCP0'].filter(function (x) { return x.ID === tc; })[0].TEN,
            TINHTRANG_ID: tt, TINHTRANG_TEN: fx[D + 'KTX.TTP0'].filter(function (x) { return x.ID === tt; })[0].TEN,
            DIENTICHSUDUNG: dt, SOGIUONG: g, SOSINHVIENTOIDA: n, MOTA: '' });
    }
    themPhong('P101', 'TN1', '101', 'T1', 'LP1', 'TC1', 'TT1', 32, 4, 8);
    themPhong('P102', 'TN1', '102', 'T1', 'LP1', 'TC1', 'TT1', 32, 4, 8);
    themPhong('P201', 'TN1', '201', 'T2', 'LP2', 'TC1', 'TT2', 28, 3, 6);
    themPhong('P202', 'TN1', '202', 'T2', 'LP2', 'TC1', 'TT1', 28, 3, 6);
    themPhong('P301', 'TN1', '301', 'T3', 'LP3', 'TC1', 'TT1', 24, 2, 4);
    themPhong('Q101', 'TN2', '101', 'T1', 'LP1', 'TC2', 'TT1', 32, 4, 8);
    themPhong('Q102', 'TN2', '102', 'T1', 'LP1', 'TC2', 'TT1', 32, 4, 8);
    themPhong('Q201', 'TN2', '201', 'T2', 'LP2', 'TC2', 'TT3', 28, 3, 6);
    themPhong('Q202', 'TN2', '202', 'T2', 'LP2', 'TC2', 'TT1', 28, 3, 6);
    themPhong('Q203', 'TN2', '203', 'T2', 'LP2', 'TC2', 'TT1', 28, 3, 6);
    themPhong('Q301', 'TN2', '301', 'T3', 'LP3', 'TC2', 'TT1', 24, 2, 4);
    themPhong('Q302', 'TN2', '302', 'T3', 'LP3', 'TC2', 'TT1', 24, 2, 4);
    themPhong('B101', 'TN3', '101', 'T1', 'LP1', 'TC1', 'TT1', 30, 4, 8);
    themPhong('B102', 'TN3', '102', 'T1', 'LP1', 'TC2', 'TT1', 30, 4, 8);
    themPhong('B201', 'TN3', '201', 'T2', 'LP2', 'TC1', 'TT1', 26, 3, 6);
    ums.demo.crudStore('KTX_Phong', PHONG, {
        list: function (rows, o) {
            var rs = rows.filter(function (r) {
                return khop(r, o.strTuKhoa) &&
                    (!o.strKTX_ToaNha_Id || r.KTX_TOANHA_ID === o.strKTX_ToaNha_Id) &&
                    (!o.strLoaiPhong_Id || r.LOAIPHONG_ID === o.strLoaiPhong_Id) &&
                    (!o.strTinhChat_Id || r.TINHCHAT_ID === o.strTinhChat_Id) &&
                    (!o.strTangThu_Id || r.TANGTHU_ID === o.strTangThu_Id) &&
                    (!o.strTinhTrang_Id || r.TINHTRANG_ID === o.strTinhTrang_Id);
            });
            return trang(rs, o);
        },
        map: function (o) {
            var t = TOA.filter(function (x) { return x.ID === o.strKTX_ToaNha_Id; })[0];
            function ten(ma, id) { var x = fx[D + ma].filter(function (y) { return y.ID === id; })[0]; return x ? x.TEN : ''; }
            return { TEN: o.strTen, MA: o.strMa, KTX_TOANHA_ID: o.strKTX_ToaNha_Id, KTX_TOANHA_TEN: t ? t.TEN : '',
                TANGTHU_ID: o.strTangThu_Id, TANGTHU_TEN: ten('KTX.ST00', o.strTangThu_Id),
                LOAIPHONG_ID: o.strLoaiPhong_Id, LOAIPHONG_TEN: ten('KTX.LP00', o.strLoaiPhong_Id),
                TINHCHAT_ID: o.strTinhChat_Id, TINHCHAT_TEN: ten('KTX.TCP0', o.strTinhChat_Id),
                TINHTRANG_ID: o.strTinhTrang_Id, TINHTRANG_TEN: ten('KTX.TTP0', o.strTinhTrang_Id),
                DIENTICHSUDUNG: o.strDienTichSuDung, SOGIUONG: o.strSoGiuong, SOSINHVIENTOIDA: o.dSoSinhVienToiDa, MOTA: o.strMoTa };
        }
    });

    /* ---------- Thiết bị + lịch sử chuyển phòng (thietbi, quanlythietbi) ---------- */
    var LTB = fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.LTB0'];
    var TTTB = fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.TTTB'];
    function ph(id) { return PHONG.filter(function (p) { return p.ID === id; })[0] || {}; }
    function timDM(ds, id) { return ds.filter(function (x) { return x.ID === id; })[0] || {}; }
    function dong(id, phongId, ma, ten, sl, loai, tt, mota) {
        var p = ph(phongId);
        return { ID: id, KTX_PHONG_ID: phongId, KTX_PHONG_TEN: p.TEN || '', KTX_PHONG_MA: p.MA || '', MA: ma, TEN: ten, SOLUONG: sl,
            LOAITRANGTHIETBI_ID: loai, LOAITRANGTHIETBI_TEN: timDM(LTB, loai).TEN || '', TINHTRANGSUDUNG_ID: tt,
            TINHTRANGSUDUNG_MA: timDM(TTTB, tt).MA || '', TINHTRANGSUDUNG_TEN: timDM(TTTB, tt).TEN || '', MOTA: mota || '' };
    }
    var TB = [
        dong('TB1', 'P101', 'GT-01', 'Giường tầng sắt', 4, 'LTB1', 'TTB1'),
        dong('TB2', 'P101', 'QT-01', 'Quạt trần Panasonic', 2, 'LTB2', 'TTB1'),
        dong('TB3', 'P101', 'NL-01', 'Bình nóng lạnh Ariston 30L', 1, 'LTB3', 'TTB2', 'Rò điện, chờ sửa'),
        dong('TB4', 'P102', 'GT-02', 'Giường tầng sắt', 4, 'LTB1', 'TTB1'),
        dong('TB5', 'Q101', 'TD-01', 'Tủ đồ 8 ngăn', 1, 'LTB4', 'TTB3')
    ];
    var CHUYEN = [
        { ID: 'CH1', KTX_TRANGTHIETBI_ID: 'TB5', KTX_PHONG_ID: 'P201', KTX_PHONG_TEN: '201', MOTA: 'Chuyển từ nhà A1' },
        { ID: 'CH2', KTX_TRANGTHIETBI_ID: 'TB5', KTX_PHONG_ID: 'Q101', KTX_PHONG_TEN: '101', MOTA: '' }
    ];
    var seq = 10;
    ums.demo.crudStore('KTX_TrangThietBi', TB, {
        list: function (rows, o) {
            var rs = rows.filter(function (r) { return khop(r, o.strTuKhoa) && (!o.strKTX_Phong_Id || r.KTX_PHONG_ID === o.strKTX_Phong_Id); });
            return trang(rs, o);
        },
        map: function (o) {
            var r = dong('', o.strKTX_Phong_Id, o.strMa, o.strTen, o.dSoLuong, o.strLoaiTrangThietBi_Id, o.strTinhTrangSuDung_Id, o.strMoTa);
            delete r.ID;
            return r;
        }
    });
    ums.demo.add({
        'KTX_TrangThietBi/ChuyenTrangThietBi': function (o) {
            var p = ph(o.strKTX_Phong_Id);
            CHUYEN.push({ ID: 'CH' + (seq++), KTX_TRANGTHIETBI_ID: o.strKTX_TrangThietBi_Id, KTX_PHONG_ID: o.strKTX_Phong_Id, KTX_PHONG_TEN: p.TEN || '', MOTA: o.strMoTa || '' });
            TB.forEach(function (r) { if (r.ID === o.strKTX_TrangThietBi_Id) { r.KTX_PHONG_ID = p.ID; r.KTX_PHONG_TEN = p.TEN; r.KTX_PHONG_MA = p.MA; } });
            return { rows: [], message: '' };
        },
        'KTX_TrangThietBi/LayDSChuyenTrangThietBi': function (o) {
            return CHUYEN.filter(function (r) { return r.KTX_TRANGTHIETBI_ID === o.strKTX_TrangThietBi_Id; });
        }
    });

    ums.demo.ktx = { TOA: TOA, PHONG: PHONG, TB: TB, CHUYEN: CHUYEN, dm: fx, khop: khop, trang: trang };
})();
