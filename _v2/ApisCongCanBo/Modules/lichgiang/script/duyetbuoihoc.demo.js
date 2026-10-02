/* Dữ liệu mẫu cho duyetbuoihoc (và hộp "Duyệt buổi học" của khoiluongcanhan) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {};
    fx['NS_ThongTinCanBo/LayDSKeHoachKLGDChiTiet'] = [{ ID: 'KH1', TEN: 'Kế hoạch KLGD 2026_2027_1' }];
    fx['NS_ThongTinCanBo/LayDSHocPhanTinhKLGDTheoKhoaQL'] = function (o) { return o.strKLGD_KeHoachChiTiet_Id ? [{ ID: 'HP1', TEN: 'Lập trình hướng đối tượng', MA: 'IT3100' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu', MA: 'IT3200' }] : []; };
    fx['TKGG_KeHoach/LayDSLopHocPhanDuyet'] = function (o) { return o.strDaoTao_HocPhan_Id ? [{ ID: 'LHP1', TENLOP: 'Lập trình HĐT 01', MALOP: 'IT3100.01' }] : []; };
    fx['TKGG_KeHoach/LayDSGVLichGiangKLGDTheoHP'] = [{ ID: 'GV1', NGUOIDUNG_HODEM: 'Nguyễn Văn', NGUOIDUNG_TEN: 'Hùng', NGUOIDUNG_MASO: 'CB001' },
        { ID: 'GV2', NGUOIDUNG_HODEM: 'Trần Thị', NGUOIDUNG_TEN: 'Mai', NGUOIDUNG_MASO: 'CB015' }];
    var BUOI = [];
    for (var i = 1; i <= 5; i++) BUOI.push({ ID: 'B' + i, MALOP: 'IT3100.01', TENLOP: 'Lập trình HĐT 01', NGAY: '0' + (i + 1) + '/09/2026', THU: (i % 6) + 2, SOTIET: 3,
        TIETBATDAU: 1, TIETKETTHUC: 3, DAOTAO_LOPHOCPHAN_ID: 'LHP1', KLGD_KEHOACHCHITIET_ID: 'KH1' });
    fx['TKGG_KeHoach/LayDSDuLieuLichGiangDuyet'] = BUOI;
    var XN = { 'B1|GV1': '1', 'B2|GV1': '1', 'B3|GV1': '0', 'B1|GV2': '1' };
    fx['TKGG_KeHoach/LayKQXacNhanVaDiemDanhLG'] = function (o) {
        var k = o.strKLGD_DuLieu_LichGiang_Id + '|' + o.strNguoiDung_Id;
        return [{ COLICH: (o.strNguoiDung_Id === 'GV2' && o.strKLGD_DuLieu_LichGiang_Id === 'B5') ? '0' : '1', XACNHANDONGY_KHONGDONGY: XN[k] || '', TINHTRANGDIEMDANH: XN[k] ? '1' : '0' }];
    };
    fx['TKGG_XacNhan/Them_KLGD_QuanLy_XacNhan'] = function (o) {
        BUOI.forEach(function (b) {
            ['GV1', 'GV2'].forEach(function (g) { if (o.strDuLieuXacNhan === b.DAOTAO_LOPHOCPHAN_ID + g + b.NGAY + b.TIETBATDAU + b.TIETKETTHUC) XN[b.ID + '|' + g] = String(o.strHanhDong_Id); });
        });
        return [];
    };
    ums.demo.add(fx);
})();
