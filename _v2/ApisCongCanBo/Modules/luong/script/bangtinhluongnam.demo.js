/* Dữ liệu mẫu cho bangtinhluongnam — chỉ dùng ở chế độ dựng thử.
   Cây thành phần hai tầng: "Lương" (Lương cơ bản, Phụ cấp chức vụ) + "Khấu trừ" (BHXH, Thuế TNCN). */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'NHANSU.LOAIBANGLUONG'] = [{ ID: 'BL1', MA: 'LT', TEN: 'Bảng lương tháng' }, { ID: 'BL2', MA: 'TN', TEN: 'Thu nhập tăng thêm' }];
    var TP = [
        { THANHPHAN_ID: 'G1', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Lương', LATHANHPHANCUOI: 1 },
        { THANHPHAN_ID: 'T1', THANHPHAN_CHA_ID: 'G1', THANHPHAN_TEN: 'Lương cơ bản', LATHANHPHANCUOI: 1 },
        { THANHPHAN_ID: 'T2', THANHPHAN_CHA_ID: 'G1', THANHPHAN_TEN: 'Phụ cấp chức vụ', LATHANHPHANCUOI: 0 },
        { THANHPHAN_ID: 'G2', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khấu trừ', LATHANHPHANCUOI: 1 },
        { THANHPHAN_ID: 'T3', THANHPHAN_CHA_ID: 'G2', THANHPHAN_TEN: 'BHXH', LATHANHPHANCUOI: 1 },
        { THANHPHAN_ID: 'T4', THANHPHAN_CHA_ID: 'G2', THANHPHAN_TEN: 'Thuế TNCN', LATHANHPHANCUOI: 1 },
        { THANHPHAN_ID: 'T5', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Thực lĩnh', LATHANHPHANCUOI: 1 }
    ];
    var NS = { NHANSU_HOSOCANBO_ID: 'U1', NHANSU_HOSOCANBO_MASO: 'CB0123', NHANSU_HOSOCANBO_HO: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'An' };
    function dong(id, extra) { var r = { ID: id }; Object.keys(NS).forEach(function (k) { r[k] = NS[k]; }); Object.keys(extra).forEach(function (k) { r[k] = extra[k]; }); return r; }
    function o(id, tp, v, t, n) { return { ID: id, THANHPHAN_ID: tp, THANHPHAN_GIATRI: String(v), THANG: t, NAM: n, NHANSU_HOSOCANBO_ID: 'U1' }; }
    fx['L_TraCuu_BangLuong/LayDanhSach'] = TP;
    fx['L_TraCuu_BangLuongNam/LayDanhSach'] = TP;
    fx['L_TraCuu_BangLuong/LayDSDuLieuBangLuong'] = function (x) {
        var t = x.dThang == -1 ? 8 : x.dThang;
        return { rows: { rsNhanSu: [dong('R1', { THANG: t, NAM: x.dNam })],
            rsDuLieuLuong: [o('R1', 'T1', 11700000, t, x.dNam), o('R1', 'T2', 1400000, t, x.dNam), o('R1', 'T3', 1228500, t, x.dNam),
                            o('R1', 'T4', 450000, t, x.dNam), o('R1', 'T5', 11421500, t, x.dNam)] } };
    };
    fx['L_TraCuu_BangLuongNam/LayDSDuLieuBangLuongNam'] = function (x) {
        return { rows: { rsNhanSu: [dong('N1', { NAM: x.dNam })],
            rsDuLieuLuong: [o('N1', 'T1', 93600000), o('N1', 'T2', 11200000), o('N1', 'T3', 9828000), o('N1', 'T4', 3600000), o('N1', 'T5', 91372000)] } };
    };
    fx['L_TraCuu_LuongThang/LayChiTiet'] = [
        { THANHPHAN_GIATRI_NOIDUNG: 'Phụ cấp Phó trưởng khoa', THANHPHAN_GIATRI_CHITIET: '1400000', THANHPHAN_GIATRI_NGAY: '05/08/2026', THANHPHAN_GIATRI_THUETNCN: '0', THANHPHAN_GIATRI_GHICHU: '' }
    ];
    ums.demo.add(fx);
})();
