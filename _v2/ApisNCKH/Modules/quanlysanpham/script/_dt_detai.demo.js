/* Dữ liệu mẫu cho hai màn Đề tài/dự án NCKH (quản trị + xác nhận) — chỉ dùng ở chế độ dựng thử.
   Dòng đề tài / khối con lấy từ _sanpham.demo.js của Cổng cán bộ; ở đây bổ sung cột của bản xác nhận,
   danh mục cấp quản lý NCKH.CAQL, danh sách cán bộ theo đơn vị, xác nhận kê khai, gộp tệp. */
(function () {
    var fx = ums.demo.fixtures || {};
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: ten }; }
    var add = {};
    add[DM + 'NCKH.CAQL'] = [dm('CQ1', 'NN', 'Nhà nước'), dm('CQ2', 'BO', 'Bộ'), dm('CQ3', 'TR', 'Trường')];

    /* Cột thêm của danh sách bản xác nhận (bọc hàm của _sanpham.demo.js đúng MỘT lần) */
    var THEM = {
        DT1: { PHANLOAIDETAI_TEN: 'Ứng dụng', NGAYNGHIEMTHU: '20', THANGNGHIEMTHU: '12', NAMNGHIEMTHU: '2026', NGAYCONGNHAN: '05', THANGCONGNHAN: '01',
            NAMCONGNHAN: '2027', VAITRO_TEN: 'Chủ nhiệm', KETQUAXACNHAN_THONGTIN1: 'fa fa-check-circle', KETQUAXACNHAN_NOIDUNG: 'Hồ sơ đầy đủ' },
        DT2: { PHANLOAIDETAI_TEN: 'Loại khác', VAITRO_TEN: 'Thành viên' }
    };
    var ds = fx['NCKH_DeTai/LayDanhSach'];
    if (ds && !ds._dt) {
        var boc = function (o) {
            var rows = typeof ds === 'function' ? ds(o) : (ds || []);
            return rows.map(function (r) { return Object.assign({}, THEM[r.ID] || {}, r); });
        };
        boc._dt = true;
        add['NCKH_DeTai/LayDanhSach'] = boc;
    }
    /* Tệp minh chứng mẫu của đề tài DT1 + quyết định KQ1 (cột "File đính kèm", "Tải file") */
    var tep = fx['NCKH_Files/LayDanhSach'];
    if (tep && !tep._dt) {
        var bocTep = function (o) {
            var l = typeof tep === 'function' ? tep(o) : [];
            if (l && l.length) return l;
            if (o.strDuLieu_Id === 'DT1') return [{ ID: 'FDT1', FILEMINHCHUNG: 'Upload/File/NCKH/thuyet-minh-de-tai.pdf', TENHIENTHI: 'thuyet-minh-de-tai.pdf' }];
            if (o.strDuLieu_Id === 'KQ1') return [{ ID: 'FKQ1', FILEMINHCHUNG: 'Upload/File/NCKH/qd-45-dhcn.pdf', TENHIENTHI: 'qd-45-dhcn.pdf' }];
            return [];
        };
        bocTep._dt = true;
        add['NCKH_Files/LayDanhSach'] = bocTep;
    }
    add['NCKH_Files/GopFile'] = { rows: 'Temp/gop_minh_chung_de_tai.zip' };

    var CB = [
        { ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001', DV: 'DV1' }, { ID: 'CB2', HOTEN: 'Trần Thị Mai', MASO: 'CB002', DV: 'DV1' },
        { ID: 'CB3', HOTEN: 'Lê Quốc Bảo', MASO: 'CB015', DV: 'DV2' }
    ];
    add['NS_HoSoV2/LayDanhSach'] = function (o) {
        if (!o.strDaoTao_CoCauToChuc_Id) return CB.slice();
        var l = CB.filter(function (r) { return r.DV === o.strDaoTao_CoCauToChuc_Id; });
        return l.length ? l : CB.slice(0, 2);     // đơn vị của dữ liệu mẫu chung không khớp → trả hai người đầu
    };

    add['NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung'] = [
        { ID: 'XN0', MA: 'XNKKCHUAKHAI', TEN: 'Chưa kê khai' },
        { ID: 'XN1', MA: 'XNKKDAXACNHAN', TEN: 'Đã xác nhận', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color:#198754' },
        { ID: 'XN2', MA: 'XNKKYEUCAUSUA', TEN: 'Yêu cầu bổ sung', THONGTIN1: 'fa fa-pencil', THONGTIN2: 'color:#d97706' },
        { ID: 'XN3', MA: 'XNKKKHONGDUYET', TEN: 'Không xác nhận', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color:#dc3545' }
    ];
    var LS = { DT1: [{ ID: 'L1', TINHTRANG_TEN: 'Yêu cầu bổ sung', NOIDUNG: 'Thiếu quyết định nghiệm thu', NGUOIXACNHAN_TENDAYDU: 'Trần Thị Mai', NGAYTAO_DD_MM_YYYY: '12/09/2026' },
        { ID: 'L2', TINHTRANG_TEN: 'Đã xác nhận', NOIDUNG: 'Hồ sơ đầy đủ', NGUOIXACNHAN_TENDAYDU: 'Trần Thị Mai', NGAYTAO_DD_MM_YYYY: '20/09/2026' }] };
    add['NCKH_SP_XacNhanKeKhai/LayDanhSach'] = function (o) { return (LS[o.strSanPham_Id] || []).slice(); };
    add['NCKH_SP_XacNhanKeKhai/ThemMoi'] = function (o) {
        var l = LS[o.strSanPham_Id] || (LS[o.strSanPham_Id] = []);
        var x = (add['NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung'] || []).filter(function (d) { return d.ID === o.strTinhTrang_Id; })[0];
        l.push({ ID: 'L' + Date.now(), TINHTRANG_TEN: x ? x.TEN : o.strTinhTrang_Id, NOIDUNG: o.strNoiDung, NGUOIXACNHAN_TENDAYDU: 'Người dùng thử', NGAYTAO_DD_MM_YYYY: '27/09/2026' });
        return [];
    };
    ums.demo.add(add);
})();
