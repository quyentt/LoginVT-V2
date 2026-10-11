/* Dữ liệu mẫu DÙNG CHUNG cho module kehoach (KTX) — chỉ ở chế độ dựng thử, nạp trước _kehoach.js. Kho KTX_KeHoachDangKy
   (LayDanhSach / ThemMoi / CapNhat / Xoa) + danh mục loại kế hoạch + phân công SV / toà nhà / phòng cho kế hoạch (DT, TN, PH). */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var LOAI = [
        { ID: 'LKH1', MA: 'KTX.LKH0.01', TEN: 'Đăng ký ở đầu năm học' },
        { ID: 'LKH2', MA: 'KTX.LKH0.02', TEN: 'Đăng ký ở bổ sung' },
        { ID: 'LKH3', MA: 'KTX.LKH0.03', TEN: 'Gia hạn ở' }
    ];
    var fx = {};
    fx[D + 'KTX.LKH0'] = LOAI;
    fx[D + 'KTX.LOAIKEHOACH'] = LOAI;            // kehoachdangky.js gốc gọi danh mục này bằng mã chữ
    ums.demo.add(fx);

    function tenLoai(id) { var r = LOAI.filter(function (x) { return x.ID === id; })[0]; return r ? r.TEN : ''; }

    var KH = [
        { ID: 'KH1', TENKEHOACH: 'Đăng ký ký túc xá năm học 2026-2027', TUNGAY: '01/08/2026', DENNGAY: '20/08/2026', NGAYVAO: '01/09/2026', NGAYRA: '30/06/2027',
          LOAIKEHOACH_ID: 'LKH1', LOAIKEHOACH_TEN: 'Đăng ký ở đầu năm học', SONGAYHIEULUCGIUCHO: 7, HIEULUC: 1, SOPHONGPHANCONG: 12, SODOITUONG: 86 },
        { ID: 'KH2', TENKEHOACH: 'Đăng ký bổ sung học kỳ 1 (đợt 2)', TUNGAY: '15/09/2026', DENNGAY: '25/09/2026', NGAYVAO: '01/10/2026', NGAYRA: '31/01/2027',
          LOAIKEHOACH_ID: 'LKH2', LOAIKEHOACH_TEN: 'Đăng ký ở bổ sung', SONGAYHIEULUCGIUCHO: 3, HIEULUC: 1, SOPHONGPHANCONG: 4, SODOITUONG: 18 },
        { ID: 'KH3', TENKEHOACH: 'Gia hạn ở học kỳ 2 năm học 2025-2026', TUNGAY: '05/01/2026', DENNGAY: '15/01/2026', NGAYVAO: '01/02/2026', NGAYRA: '30/06/2026',
          LOAIKEHOACH_ID: 'LKH3', LOAIKEHOACH_TEN: 'Gia hạn ở', SONGAYHIEULUCGIUCHO: 5, HIEULUC: 0, SOPHONGPHANCONG: 20, SODOITUONG: 140 }
    ];
    ums.demo.crudStore('KTX_KeHoachDangKy', KH, {
        list: function (rows, o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var rs = rows.filter(function (r) {
                return (!q || String(r.TENKEHOACH || '').toLowerCase().indexOf(q) >= 0) &&
                    (!o.strLoaiKeHoach_Id || r.LOAIKEHOACH_ID === o.strLoaiKeHoach_Id);
            });
            var size = Number(o.pageSize) || rs.length, idx = Number(o.pageIndex) || 1;
            if (size >= rs.length) return { rows: rs, pager: rs.length };
            return { rows: rs.slice((idx - 1) * size, idx * size), pager: rs.length };
        },
        map: function (o) {
            var m = { TENKEHOACH: o.strTenKeHoach, TUNGAY: o.strTuNgay, DENNGAY: o.strDenNgay,
                LOAIKEHOACH_ID: o.strLoaiKeHoach_Id, LOAIKEHOACH_TEN: tenLoai(o.strLoaiKeHoach_Id), SONGAYHIEULUCGIUCHO: o.dSoNgayHieuLucGiuCho };
            if (o.strNgayVao !== undefined) m.NGAYVAO = o.strNgayVao;
            if (o.strNgayRa !== undefined) m.NGAYRA = o.strNgayRa;
            if (o.dHieuLuc !== undefined) m.HIEULUC = o.dHieuLuc;
            return m;
        }
    });

    /* ---------- Phân công SV / toà nhà / phòng cho kế hoạch (kehoachdangky, phanphongdangky) ---------- */
    function trang(rows, o) {
        var size = Number(o.pageSize) || rows.length, idx = Number(o.pageIndex) || 1;
        if (size >= rows.length) return { rows: rows, pager: rows.length };
        return { rows: rows.slice((idx - 1) * size, idx * size), pager: rows.length };
    }
    function phong(id) { return (ums.demo.ktx ? ums.demo.ktx.PHONG : []).filter(function (r) { return r.ID === id; })[0] || {}; }
    function nguoi(id) { return ((ums.demo.ktxKHDK && ums.demo.ktxKHDK.NO) || []).filter(function (r) { return r.ID === id; })[0] || {}; }
    function demLai() {
        KH.forEach(function (k) {
            k.SODOITUONG = DT.filter(function (x) { return x.KTX_KEHOACHDANGKY_ID === k.ID; }).length;
            k.SOPHONGPHANCONG = PH.filter(function (x) { return x.KTX_KEHOACHDANGKY_ID === k.ID; }).length + TN.filter(function (x) { return x.KTX_KEHOACHDANGKY_ID === k.ID; }).length;
        });
    }
    var seq = 10;
    /* Sinh viên được phép đăng ký */
    var DT = [
        { ID: 'DT1', KTX_KEHOACHDANGKY_ID: 'KH1', KTX_DOITUONGOKYTUCXA_ID: 'NO1', KTX_DOITUONGOKYTUCXA_MASO: 'BIT220263', KTX_DOITUONGOKYTUCXA_HODEM: 'Nguyễn Văn', KTX_DOITUONGOKYTUCXA_TEN: 'An' },
        { ID: 'DT2', KTX_KEHOACHDANGKY_ID: 'KH1', KTX_DOITUONGOKYTUCXA_ID: 'NO3', KTX_DOITUONGOKYTUCXA_MASO: 'BBA220561', KTX_DOITUONGOKYTUCXA_HODEM: 'Lê Minh', KTX_DOITUONGOKYTUCXA_TEN: 'Châu' },
        { ID: 'DT3', KTX_KEHOACHDANGKY_ID: 'KH2', KTX_DOITUONGOKYTUCXA_ID: 'NO2', KTX_DOITUONGOKYTUCXA_MASO: 'BIT220271', KTX_DOITUONGOKYTUCXA_HODEM: 'Trần Thị', KTX_DOITUONGOKYTUCXA_TEN: 'Bình' }
    ];
    /* Toà nhà phân cả toà (phanphongdangky) */
    var TN = [{ ID: 'TN1', KTX_KEHOACHDANGKY_ID: 'KH1', KTX_TOANHA_ID: 'TN3', KTX_TOANHA_TEN: 'Nhà B', KTX_TOANHA_MA: 'B' }];
    /* Phòng được đăng ký */
    var PH = [
        { ID: 'PC1', KTX_KEHOACHDANGKY_ID: 'KH1', KTX_TOANHA_ID: 'TN1', KTX_TOANHA_TEN: 'Nhà A1', KTX_PHONG_ID: 'P101', KTX_PHONG_MA: 'A1-101', KTX_PHONG_TEN: '101', NGAYVAO: '01/09/2026', NGAYRA: '30/06/2027' },
        { ID: 'PC2', KTX_KEHOACHDANGKY_ID: 'KH1', KTX_TOANHA_ID: 'TN1', KTX_TOANHA_TEN: 'Nhà A1', KTX_PHONG_ID: 'P102', KTX_PHONG_MA: 'A1-102', KTX_PHONG_TEN: '102', NGAYVAO: '01/09/2026', NGAYRA: '30/06/2027' },
        { ID: 'PC3', KTX_KEHOACHDANGKY_ID: 'KH2', KTX_TOANHA_ID: 'TN2', KTX_TOANHA_TEN: 'Nhà A2', KTX_PHONG_ID: 'Q101', KTX_PHONG_MA: 'A2-101', KTX_PHONG_TEN: '101', NGAYVAO: '01/10/2026', NGAYRA: '31/01/2027' }
    ];
    ums.demo.add({
        'KTX_PhanCongDTDangKy/LayDanhSach': function (o) { return trang(DT.filter(function (r) { return r.KTX_KEHOACHDANGKY_ID === o.strKTX_KeHoachDangKy_Id; }), o); },
        'KTX_PhanCongDTDangKy/ThemMoi': function (o) {
            var n = nguoi(o.strKTX_DoiTuongOKyTucXa_Id);
            DT.push({ ID: 'DT' + (seq++), KTX_KEHOACHDANGKY_ID: o.strKTX_KeHoachDangKy_Id, KTX_DOITUONGOKYTUCXA_ID: n.ID || '', KTX_DOITUONGOKYTUCXA_MASO: n.MASO || '',
                KTX_DOITUONGOKYTUCXA_HODEM: n.HODEM || '', KTX_DOITUONGOKYTUCXA_TEN: n.TEN || '' });
            demLai();
            return { rows: [], message: '' };
        },
        'KTX_PhanCongDTDangKy/Xoa': function (o) {
            String(o.strIds || '').split(',').forEach(function (id) { for (var i = DT.length - 1; i >= 0; i--) if (DT[i].ID === id) DT.splice(i, 1); });
            demLai();
            return { rows: [], message: '' };
        },
        'KTX_PhanCongPhongDangKy/LayDanhSach': function (o) { return trang(PH.filter(function (r) { return r.KTX_KEHOACHDANGKY_ID === o.strKTX_KeHoachDangKy_Id; }), o); },
        'KTX_PhanCongPhongDangKy/ThemMoi': function (o) {
            function arr(v) { return Array.isArray(v) ? v : (v ? String(v).split(',') : []); }
            arr(o.strKTX_Phong_Id).forEach(function (pid) {
                var p = phong(pid);
                PH.push({ ID: 'PC' + (seq++), KTX_KEHOACHDANGKY_ID: o.strKTX_KeHoachDangKy_Id, KTX_TOANHA_ID: p.KTX_TOANHA_ID || (Array.isArray(o.strKTX_ToaNha_Id) ? '' : o.strKTX_ToaNha_Id),
                    KTX_TOANHA_TEN: p.KTX_TOANHA_TEN || '', KTX_PHONG_ID: pid, KTX_PHONG_MA: p.MA || '', KTX_PHONG_TEN: p.TEN || '', NGAYVAO: o.strNgayVao || '', NGAYRA: o.strNgayRa || '' });
            });
            if (Array.isArray(o.strKTX_ToaNha_Id)) o.strKTX_ToaNha_Id.forEach(function (tid) {
                var t = (ums.demo.ktx ? ums.demo.ktx.TOA : []).filter(function (x) { return x.ID === tid; })[0] || {};
                if (!TN.some(function (x) { return x.KTX_KEHOACHDANGKY_ID === o.strKTX_KeHoachDangKy_Id && x.KTX_TOANHA_ID === tid; }))
                    TN.push({ ID: 'TN' + (seq++), KTX_KEHOACHDANGKY_ID: o.strKTX_KeHoachDangKy_Id, KTX_TOANHA_ID: tid, KTX_TOANHA_TEN: t.TEN || '', KTX_TOANHA_MA: t.MA || '' });
            });
            demLai();
            return { rows: [], message: '' };
        },
        'KTX_PhanCongToaNhaDangKy/LayDanhSach': function (o) {
            /* toà đã phân trực tiếp + toà của các phòng đã phân (mỗi toà một dòng) */
            var kh = o.strKTX_KeHoachDangKy_Id, rs = TN.filter(function (r) { return r.KTX_KEHOACHDANGKY_ID === kh; }).slice();
            PH.filter(function (r) { return r.KTX_KEHOACHDANGKY_ID === kh; }).forEach(function (r) {
                if (!rs.some(function (x) { return x.KTX_TOANHA_ID === r.KTX_TOANHA_ID; }))
                    rs.push({ ID: 'TN-' + r.KTX_TOANHA_ID, KTX_KEHOACHDANGKY_ID: kh, KTX_TOANHA_ID: r.KTX_TOANHA_ID, KTX_TOANHA_TEN: r.KTX_TOANHA_TEN, KTX_TOANHA_MA: '' });
            });
            return rs;
        },
        'KTX_PhanCongPhongDangKy/Xoa': function (o) {
            String(o.strIds || o.strId || '').split(',').forEach(function (id) { for (var i = PH.length - 1; i >= 0; i--) if (PH[i].ID === id) PH.splice(i, 1); });
            demLai();
            return { rows: [], message: '' };
        }
    });
    demLai();
    ums.demo.ktxKeHoach = { KH: KH, LOAI: LOAI, DT: DT, PH: PH, TN: TN };
    ums.demo.ktxKHDK = ums.demo.ktxKHDK || {};
})();
