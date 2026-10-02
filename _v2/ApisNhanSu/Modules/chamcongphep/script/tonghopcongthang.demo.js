/* Dữ liệu mẫu cho tonghopcongthang — chỉ dùng ở chế độ dựng thử. */
(function () {
    var XN = [{ ID: 'XN1', TEN: 'Đồng ý', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #2e7d32' },
              { ID: 'XN2', TEN: 'Không đồng ý', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #c62828' }];
    var NS = [{ ID: 'NS1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001', DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Hệ thống thông tin', KETQUAXACNHAN_ID: 'XN1' },
              { ID: 'NS3', HOTEN: 'Lê Quang Minh', MASO: 'CB102', DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Hệ thống thông tin', KETQUAXACNHAN_ID: '' }];
    function ngay(o) {
        var y = Number(o.strNam), m = Number(o.strThang), so = new Date(y, m, 0).getDate(), out = [];
        for (var d = 1; d <= Math.min(so, 10); d++) {
            var dt = new Date(y, m - 1, d), thu = dt.getDay() === 0 ? 8 : dt.getDay() + 1;
            out.push({ CHAMCONG_NGAY: d, CHAMCONG_NGAYDAYDU: (d < 10 ? '0' : '') + d + '/' + o.strThang + '/' + y, THUTRONGTUAN: thu, TUAN: Math.ceil((d + ((new Date(y, m - 1, 1).getDay() + 6) % 7)) / 7) });
        }
        return out;
    }
    ums.demo.add({
        'NS_CongPhep_Chung/LayDSXacNhanTheoNguoiDung': XN,
        'NS_CongPhep_Chung/LayDSDonViTheoNguoiDung': [{ ID: 'CC2', TEN: 'Bộ môn Hệ thống thông tin' }, { ID: 'CC5', TEN: 'Bộ môn Khoa học máy tính' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NHANSU.CONGPHEP.DANHGIA': [{ ID: 'DG1', MA: 'X', TEN: 'X' }, { ID: 'DG2', MA: 'P', TEN: 'P' }, { ID: 'DG3', MA: 'Ô', TEN: 'Ô' }],
        'NS_ChamCong_CaNhan/LayDSNhanSu_ChamCong': function (o) {
            return { rows: { rsThongTinNgay: ngay(o), rsThongTinNhanSu: NS, rsThongTinMoRong: [{ THANHPHAN_ID: 'TP1', THANHPHAN_TEN: 'Tổng công' }] } };
        },
        'NS_ChamCong_CaNhan/LayKetQuaChamCongDonVi': function (o) {
            return { rows: {
                rs: [{ NHANSU_HOSOCANBO_ID: 'NS1', CHAMCONG_NGAYDAYDU: '02/' + o.strThang + '/' + o.strNam, DANHGIA_ID: 'DG2', PHANTRAMHUONG: 100 },
                     { NHANSU_HOSOCANBO_ID: 'NS3', CHAMCONG_NGAYDAYDU: '03/' + o.strThang + '/' + o.strNam, DANHGIA_ID: 'DG3', PHANTRAMHUONG: 75 }],
                rsMoRong: [{ NHANSU_HOSOCANBO_ID: 'NS1', THANHPHAN_ID: 'TP1', THANHPHAN_GIATRI: 21 }, { NHANSU_HOSOCANBO_ID: 'NS3', THANHPHAN_ID: 'TP1', THANHPHAN_GIATRI: 20.5 }]
            } };
        },
        'NS_ChamCong_CaNhan/LayDSHoatDongChamCong': { rows: {
            rsHoatDong: [{ MA: 'X', TEN: 'Đi làm' }, { MA: 'P', TEN: 'Nghỉ phép' }, { MA: 'Ô', TEN: 'Nghỉ ốm' }],
            rsQuyDinhTongHopCong: [{ TEN: 'Cột Tổng công', MOTA: 'Số ngày công hưởng lương trong tháng' }]
        } },
        'NS_ChamCong_CaNhan/ThemMoi': [],
        'NS_NghiPhepCaNhan/TuDong_CapNhat_QuaTrinh_CaNhan': [],
        'NS_ChamCong_XacNhan/XacNhanTatCa_NhanSu_ChamCong': [],
        'NS_ChamCong_XacNhan/LayDanhSach': [{ ID: 'LS1', TINHTRANG_TEN: 'Đồng ý', NOIDUNG: 'Đã kiểm tra', NGUOIXACNHAN_TAIKHOAN: 'truongbm', NGAYTAO_DD_MM_YYYY: '05/09/2026' }]
    });
})();
