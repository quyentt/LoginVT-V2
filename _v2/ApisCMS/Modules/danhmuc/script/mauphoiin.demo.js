/* Dữ liệu mẫu cho danhmuc/mauphoiin — chỉ dùng ở chế độ dựng thử.
   DUONGDANFILE mang kích thước ảnh trong tên (<userId>_<rộng>_<cao>_…) như getImage của gốc;
   ảnh không có trên máy nên trang phôi hiện nền trắng đúng khổ. */
(function () {
    var CT = 'CMS_MauPhoiIn_ChiTiet/', fx = {};
    var MAU = [
        { ID: 'A7C1E2D3F4B54A6B8C9D0E1F2A3B4C51', MAPHOI: 'BANGTOTNGHIEP_DHCQ', TENPHOI: '', KHOGIAY: '30', FONT: 'Times New Roman',
          DUONGDANFILE: 'ApisCMS/Avatar/CANBO01_1123_794_phoibang.jpg', DODAI: '18', DORONG: '96', MARGIN_TOP: '0', MARGIN_LEFT: '0', SOTRANG: 1 },
        { ID: 'A7C1E2D3F4B54A6B8C9D0E1F2A3B4C52', MAPHOI: 'GIAYCHUNGNHAN_2TRANG', TENPHOI: '', KHOGIAY: '28', FONT: 'Palatino Linotype',
          DUONGDANFILE: 'ApisCMS/Avatar/CANBO01_794_1123_giaychungnhan.jpg', DODAI: '', DORONG: '', MARGIN_TOP: '10', MARGIN_LEFT: '5', SOTRANG: 2 },
        { ID: 'A7C1E2D3F4B54A6B8C9D0E1F2A3B4C53', MAPHOI: 'THE_SINHVIEN', TENPHOI: '', KHOGIAY: '', FONT: 'Arial Black',
          DUONGDANFILE: '', DODAI: '14', DORONG: '96', MARGIN_TOP: '', MARGIN_LEFT: '', SOTRANG: 1 }
    ];
    var ND = {
        A7C1E2D3F4B54A6B8C9D0E1F2A3B4C51: [
            { ID: 'N1', NOIDUNG: 'aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN', LETRAI: '420', LETREN: '310', LEPHAI: 'font-weight: bold;', DINHDANG: '', FONTSIZE: '26', TRANG: '0', CANLE_TRAI_PHAI_GIUA: 'text-align: center;', DORONGPHANTUCANLE: '360' },
            { ID: 'N2', NOIDUNG: 'aData.QLSV_NGUOIHOC_NGAYSINH', LETRAI: '470', LETREN: '372', LEPHAI: '', DINHDANG: '', FONTSIZE: '', TRANG: '0', CANLE_TRAI_PHAI_GIUA: '', DORONGPHANTUCANLE: '' },
            { ID: 'N3', NOIDUNG: 'aData.XEPLOAI', LETRAI: '470', LETREN: '420', LEPHAI: 'font-style: italic;', DINHDANG: 'letter-spacing: 1px', FONTSIZE: '', TRANG: '0', CANLE_TRAI_PHAI_GIUA: '', DORONGPHANTUCANLE: '' },
            { ID: 'N4', NOIDUNG: 'Số hiệu: aData.SOHIEUBANG', LETRAI: '120', LETREN: '640', LEPHAI: '', DINHDANG: '', FONTSIZE: '14', TRANG: '0', CANLE_TRAI_PHAI_GIUA: '', DORONGPHANTUCANLE: '' }
        ],
        A7C1E2D3F4B54A6B8C9D0E1F2A3B4C52: [
            { ID: 'N5', NOIDUNG: 'aData.QLSV_NGUOIHOC_MASO', LETRAI: '150', LETREN: '200', LEPHAI: '', DINHDANG: '', FONTSIZE: '', TRANG: '0', CANLE_TRAI_PHAI_GIUA: '', DORONGPHANTUCANLE: '' },
            { ID: 'N6', NOIDUNG: 'Ngày cấp: aData.NGAYCAP', LETRAI: '480', LETREN: '900', LEPHAI: '', DINHDANG: '', FONTSIZE: '', TRANG: '1', CANLE_TRAI_PHAI_GIUA: 'text-align: right;', DORONGPHANTUCANLE: '220' }
        ]
    };
    var seq = 54, nseq = 10;
    fx['CMS_MauPhoiIn/LayDanhSach'] = function () { return MAU.slice(); };
    fx['pkg_baocao_thongtin.Them_MauPhoiIn'] = function (o) {
        var id = 'A7C1E2D3F4B54A6B8C9D0E1F2A3B4C' + (seq++);
        MAU.push({ ID: id, MAPHOI: o.strMaPhoi, TENPHOI: '', KHOGIAY: o.strKhogiay, FONT: o.strFont, DUONGDANFILE: o.strDuongDanFile,
                   DODAI: o.strDoDai, DORONG: o.strDoRong, MARGIN_TOP: o.strMargin_Top, MARGIN_LEFT: o.strMargin_Left, SOTRANG: Number(o.strSoTrang) || 1 });
        return { rows: [], raw: { Id: id } };
    };
    fx['CMS_BaoCao_ThongTin_MH/Sua_MauPhoiIn'] = function (o) {
        MAU.forEach(function (x) {
            if (x.ID !== o.strId) return;
            x.KHOGIAY = o.strKhogiay; x.FONT = o.strFont; x.DODAI = o.strDoDai; x.DORONG = o.strDoRong;
            x.MARGIN_TOP = o.strMargin_Top; x.MARGIN_LEFT = o.strMargin_Left;
        });
        return [];
    };
    fx[CT + 'LayDanhSach'] = function (o) { return (ND[o.strId] || []).slice(); };
    function ghi(o) {
        var ds = ND[o.strPhoi_MauPhoiIn_Id] = ND[o.strPhoi_MauPhoiIn_Id] || [];
        var d = { ID: o.strId || ('N' + (nseq++)), NOIDUNG: o.strNoiDung, LETRAI: o.strLetrai, LETREN: o.strLeTren, LEPHAI: o.strLephai,
                  DINHDANG: o.strDinhDang, FONTSIZE: o.strFontSize, TRANG: o.strTrang, CANLE_TRAI_PHAI_GIUA: o.strCanLe_Trai_Phai_Giua,
                  DORONGPHANTUCANLE: o.strDoRongPhanTuCanLe };
        var i = ds.map(function (x) { return x.ID; }).indexOf(d.ID);
        if (i >= 0) ds[i] = d; else ds.push(d);
        return [];
    }
    fx[CT + 'ThemMoi'] = ghi;
    fx[CT + 'CapNhat'] = ghi;
    fx[CT + 'Xoa'] = function (o) {
        Object.keys(ND).forEach(function (k) { ND[k] = ND[k].filter(function (x) { return x.ID !== o.strId; }); });
        return [];
    };
    ums.demo.add(fx);
})();
