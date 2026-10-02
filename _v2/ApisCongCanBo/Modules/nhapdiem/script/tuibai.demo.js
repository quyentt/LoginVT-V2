/* Dữ liệu mẫu cho tuibai — chỉ dùng ở chế độ dựng thử. */
(function () {
    var T = 'TP_Chung/', fx = {};
    fx[T + 'LayThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }];
    fx[T + 'LayLoaiDiem'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi cuối kỳ' }] : []; };
    fx[T + 'LayHinhThucThi'] = function (o) { return o.strDiem_ThanhPhanDiem_Id ? [{ ID: 'HT1', TEN: 'Tự luận' }] : []; };
    fx[T + 'LayDotThi'] = function (o) { return o.strHinhThucThi_Id ? [{ ID: 'DOT1', TEN: 'Đợt 1 HK1' }] : []; };
    fx[T + 'LayHocPhan'] = function (o) { return o.strDotThi_Id ? [{ ID: 'HP1', TEN: 'Lập trình HĐT', MA: 'IT3100' }] : []; };
    fx[T + 'LayDotTaoPhach'] = [{ ID: 'DP1', TEN: 'Đợt phách IT3100 - Ca 2 - 06/01/2027' }, { ID: 'DP2', TEN: 'Đợt phách IT3200 - Ca 3 - 07/01/2027' }];
    fx[T + 'LayDSTuiTheoDotPhach'] = function (o) { return o.strThi_DotPhach_Id === 'DP1' ? [{ ID: 'TUI1', TEN: 'Túi 01' }, { ID: 'TUI2', TEN: 'Túi 02' }] : []; };
    var PH = [101, 102, 103].map(function (n, i) { return { ID: 'TN' + n, SOPHACH: n, DIEMBANDAU: i ? '' : 7.5, THONGTINXULY: i === 2 ? 'Khiển trách' : '', QLSV_NGUOIHOC_ID: 'SV' + n }; });
    fx['TP_XuLy/LayDSPhachTheoTui'] = function (o) { return o.strThi_TuiBai_Id === 'TUI1' ? PH : []; };
    fx['TP_XuLy/CapNhat_DiemPhachTheoTuiBai'] = function (o) { PH.forEach(function (p) { if (p.ID === o.strThi_TuiBai_NguoiHoc_Id) p.DIEMBANDAU = o.strDiem; }); return []; };
    fx['D_HanhDongXacNhan/LayDanhSach'] = [{ ID: 'HDX1', TEN: 'Hoàn thành' }, { ID: 'HDX2', TEN: 'Huỷ hoàn thành' }];
    var LS = [];
    fx['D_XacNhan/LayDSDiem_XacNhan'] = function (o) { return LS.filter(function (x) { return x.id === o.strDuLieuXacNhan; }); };
    fx['D_XacNhan/Them_Diem_XacNhan'] = function (o) { LS.unshift({ id: o.strDuLieuXacNhan, TEN: o.strHanhDong_Id === 'HDX1' ? 'Hoàn thành' : 'Huỷ hoàn thành', NGUOIXACNHAN_TENDAYDU: 'Cán bộ chấm', NGAYTAO_DD_MM_YYYY: '22/09/2026' }); return []; };
    ums.demo.add(fx);
})();
