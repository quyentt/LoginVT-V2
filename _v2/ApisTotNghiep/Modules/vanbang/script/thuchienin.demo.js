/* Dữ liệu mẫu cho Thực hiện in văn bằng — chỉ dùng ở chế độ dựng thử. */
(function () {
    var SV = [
        ['KQ01', 'SV20001', 'Nguyễn Văn', 'An', '12', '03', '2002', 'Nam', 'Kinh', 'Hà Nội', 'Kỹ thuật phần mềm', 'Giỏi', 'QH-2026-001', '0012/VB'],
        ['KQ02', 'SV20014', 'Trần Thị', 'Bình', '05', '07', '2002', 'Nữ', 'Kinh', 'Nam Định', 'Kỹ thuật phần mềm', 'Khá', 'QH-2026-002', '0013/VB'],
        ['KQ03', 'SV20027', 'Lê Hoàng', 'Cường', '21', '11', '2002', 'Nam', 'Tày', 'Lạng Sơn', 'Quản trị kinh doanh', 'Trung bình', 'QH-2026-003', '0014/VB'],
        ['KQ04', 'SV20031', 'Phạm Thu', 'Dung', '02', '01', '2003', 'Nữ', 'Kinh', 'Thái Bình', 'Quản trị kinh doanh', 'Xuất sắc', 'QH-2026-004', '0015/VB']
    ];
    var ROWS = SV.map(function (x) {
        return { ID: x[0], MASO: x[1], HODEM: x[2], TEN: x[3], NGAYSINH: x[4], THANGSINH: x[5], NAMSINH: x[6],
            QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], QLSV_NGUOIHOC_GIOITINH: x[7],
            QLSV_NGUOIHOC_DANTOC: x[8], QLSV_NGUOIHOC_NOISINH: x[9], QLSV_NGUOIHOC_NGANHNGHE: x[10], XEPLOAI_TEN: x[11],
            SOHIEUBANG: x[12], SOVAOSOCAPBANG: x[13], NGAYKYBANG: '25/06/2026', SOQUYETDINH: '215/QĐ-ĐHKT', NGAYQUYETDINH: '20/06/2026' };
    });
    var fx = {};
    fx['PKG_VANBANG_CHUNGCHI.LayDSTN_KetQua_CongNhan_VB'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var rs = ROWS.filter(function (r) { return !q || (r.MASO + ' ' + r.HODEM + ' ' + r.TEN).toLowerCase().indexOf(q) >= 0; });
        var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
        return { rows: rs.slice((pi - 1) * sz, pi * sz), pager: rs.length };
    };
    /* Mẫu phôi: ảnh nền không có ở chế độ dựng thử (DUONGDANFILE rỗng) — chỉ vẽ các ô chữ */
    function o(id, nd, top, left, them) {
        var r = { ID: id, NOIDUNG: nd, LETREN: top, LETRAI: left, TRANG: 0, FONT: 'Times New Roman', COCHU: 18, DUONGDANFILE: '',
            MARGIN_TOP: '', MARGIN_LEFT: '', KHOGIAY: 30, FONTSIZE: '', DINHDANG: '', LEPHAI: '', CANLE_TRAI_PHAI_GIUA: '', DORONGPHANTUCANLE: '' };
        Object.keys(them || {}).forEach(function (k) { r[k] = them[k]; });
        return r;
    }
    fx['CMS_MauPhoiIn_ChiTiet/LayDanhSach'] = function (q) {
        if (!q.strId) return [];
        return [
            o('O01', "'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'", 10, 160, { DINHDANG: 'font-weight: bold' }),
            o('O02', "'BẰNG CỬ NHÂN'", 60, 250, { FONTSIZE: 28, DINHDANG: 'font-weight: bold; color: #b91c1c' }),
            o('O03', "aData.QLSV_NGUOIHOC_NGANHNGHE.toUpperCase()", 110, 230),
            o('O04', "'Cho: ' + aData.QLSV_NGUOIHOC_HODEM + ' ' + aData.QLSV_NGUOIHOC_TEN", 160, 120),
            o('O05', "'Ngày sinh: ' + aData.NGAYSINH + '/' + aData.THANGSINH + '/' + aData.NAMSINH", 200, 120),
            o('O06', "'Xếp loại tốt nghiệp: ' + (aData.XEPLOAI_TEN || 'Chưa xếp loại')", 240, 120),
            o('O07', "'Số hiệu: ' + aData.SOHIEUBANG", 300, 40, { FONTSIZE: 14 }),
            o('O08', "'Số vào sổ cấp bằng: ' + aData.SOVAOSOCAPBANG", 325, 40, { FONTSIZE: 14 }),
            o('O09', "'Hà Nội, ngày ' + aData.NGAYKYBANG.split('/')[0] + ' tháng ' + aData.NGAYKYBANG.split('/')[1] + ' năm ' + aData.NGAYKYBANG.split('/')[2]", 300, 380, { FONTSIZE: 15, DINHDANG: 'font-style: italic' })
        ];
    };
    fx['TN_KetQua_CongNhan_VB/ThemMoi'] = [];
    fx['CTT_Token/TaoQRCode'] = '';
    ums.demo.add(fx);
})();
