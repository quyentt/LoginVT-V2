/* Dữ liệu mẫu cho sukien/sukien — chỉ dùng ở chế độ dựng thử. */
(function () {
    var C = 'SV_SuKien/', D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    fx[C + 'LayDSQLSV_SuKien_KeHoach'] = [
        { ID: 'SKH1', TENKEHOACH: 'Tuần sinh hoạt công dân đầu khoá 2026' },
        { ID: 'SKH2', TENKEHOACH: 'Ngày hội việc làm 2026' }
    ];
    var HD = [
        { ID: 'HD1', QLSV_SUKIEN_KEHOACH_ID: 'SKH1', TEN: 'Khai mạc tuần sinh hoạt công dân', MA: 'SHCD-01', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Hội nghị', TRONGSOTINHDIEM: 1, HINHANHSUKIEN: '' },
        { ID: 'HD2', QLSV_SUKIEN_KEHOACH_ID: 'SKH1', TEN: 'Chuyên đề an toàn giao thông', MA: 'SHCD-02', PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Chuyên đề', TRONGSOTINHDIEM: 0.5, HINHANHSUKIEN: '' },
        { ID: 'HD3', QLSV_SUKIEN_KEHOACH_ID: 'SKH2', TEN: 'Gặp gỡ doanh nghiệp CNTT', MA: 'NHVL-01', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Hội nghị', TRONGSOTINHDIEM: 1, HINHANHSUKIEN: '' }
    ];
    var seq = 10;
    fx[C + 'LayDSQLSV_SuKien_HoatDong'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        return HD.filter(function (h) { return h.QLSV_SUKIEN_KEHOACH_ID === o.strQLSV_SuKien_KeHoach_Id && (!q || h.TEN.toLowerCase().indexOf(q) >= 0); });
    };
    function luu(o) {
        var r = o.strId ? HD.filter(function (h) { return h.ID === o.strId; })[0] : null;
        if (!r) { r = { ID: 'HD' + (seq++) }; HD.push(r); }
        r.QLSV_SUKIEN_KEHOACH_ID = o.strQLSV_SuKien_KeHoach_Id; r.TEN = o.strTen; r.MA = o.strMa; r.PHANLOAI_ID = o.strPhanLoai_Id;
        r.TRONGSOTINHDIEM = o.dTrongSoTinhDiem; r.HINHANHSUKIEN = o.strHinhAnhDaiDien;
        return { rows: [], raw: { Id: r.ID } };
    }
    fx[C + 'Them_QLSV_SuKien_HoatDong'] = luu;
    fx[C + 'Sua_QLSV_SuKien_HoatDong'] = luu;
    fx[C + 'Xoa_QLSV_SuKien_HoatDong'] = function (o) { HD = HD.filter(function (h) { return h.ID !== o.strId; }); return []; };

    /* Ba lưới con: kho chung theo id sự kiện */
    function kho(api, parentKey, rows, map) {
        fx[C + 'LayDS' + api] = function (o) { return rows.filter(function (r) { return r.P === o[parentKey]; }); };
        function luuCon(o) {
            var r = o.strId ? rows.filter(function (x) { return x.ID === o.strId; })[0] : null;
            if (!r) { r = { ID: api + (seq++), P: o.strQLSV_SuKien_HoatDong_Id }; rows.push(r); }
            var m = map(o); Object.keys(m).forEach(function (k) { r[k] = m[k]; });
            return { rows: [], raw: { Id: r.ID } };
        }
        fx[C + 'Them_' + api] = luuCon;
        fx[C + 'Sua_' + api] = luuCon;
        fx[C + 'Xoa_' + api] = function (o) { for (var i = rows.length - 1; i >= 0; i--) if (rows[i].ID === o.strId) rows.splice(i, 1); return []; };
    }
    kho('SuKien_HoatDong_ThoiGian', 'strQLSV_SuKien_HoatDong_Id', [
        { ID: 'TG1', P: 'HD1', DIADIEM: 'Hội trường A', TUNGAY: '01/09/2026', GIOBATDAU: 7, PHUTBATDAU: 30, DENNGAY: '01/09/2026', GIOKETTHUC: 11, PHUTKETTHUC: 0 }
    ], function (o) { return { DIADIEM: o.strDiaDiem, TUNGAY: o.strTuNgay, GIOBATDAU: o.dGioBatDau, PHUTBATDAU: o.dPhutBatDau, DENNGAY: o.strDenNgay, GIOKETTHUC: o.dGioKetThuc, PHUTKETTHUC: o.dPhutKetThuc }; });
    kho('SuKien_HoatDong_BoTri', 'strQLSV_SuKien_KeHoach_Id', [
        { ID: 'BT1', P: 'HD1', NHANSUTHAMGIA_ID: 'NS1', VAITRO_ID: 'VT1', MOTA: 'Chủ trì' }
    ], function (o) { return { NHANSUTHAMGIA_ID: o.strNhanSuThamGia_Id, VAITRO_ID: o.strVaiTro_Id, MOTA: o.strMoTa }; });
    kho('SuKien_HoatDong_DienGia', 'strQLSV_SuKien_HoatDong_Id', [
        { ID: 'DG1', P: 'HD1', DIENGIA: 'TS. Nguyễn Văn Hùng', MOTA: 'Phó Hiệu trưởng' }
    ], function (o) { return { DIENGIA: o.strDienGia, MOTA: o.strMoTa }; });

    fx[D + 'QLSV.SUKIEN.PHANLOAI'] = [dm('PL1', 'HN', 'Hội nghị'), dm('PL2', 'CD', 'Chuyên đề'), dm('PL3', 'VN', 'Văn nghệ')];
    fx[D + 'QLSV.SUKIEN.VAITRO'] = [dm('VT1', 'CT', 'Chủ trì'), dm('VT2', 'TK', 'Thư ký'), dm('VT3', 'HT', 'Hỗ trợ')];
    fx['pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2'] = [
        { ID: 'NS1', HODEM: 'Nguyễn Văn', TEN: 'Hùng', MASO: 'CB001', DAOTAO_COCAUTOCHUC_TEN: 'Ban Giám hiệu' },
        { ID: 'NS2', HODEM: 'Trần Thị', TEN: 'Mai', MASO: 'CB015', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Công tác sinh viên' },
        { ID: 'NS3', HODEM: 'Lê Quang', TEN: 'Minh', MASO: 'CB102', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin' }
    ];
    var FILES = {};
    fx['SV_Files/LayDanhSach'] = function (o) { return FILES[o.strDuLieu_Id] || []; };
    fx['SV_Files/ThemMoi'] = function (o) { (FILES[o.strDuLieu_Id] = FILES[o.strDuLieu_Id] || []).push({ ID: 'F' + (seq++), FILEMINHCHUNG: o.strFileMinhChung, TENHIENTHI: o.strTenHienThi }); return []; };
    fx['SV_Files/Xoa'] = function () { return []; };
    ums.demo.add(fx);
})();
