/* Dữ liệu mẫu dùng chung cho hoatdong (hocphan, molop, dukienhocphan) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', P = 'PKG_KEHOACH_HOATDONG_';
    fx[D + 'KH.PHANLOAI.HOCPHAN.LOAILOP'] = [{ ID: 'PLL1', MA: 'LT', TEN: 'Lý thuyết' }, { ID: 'PLL2', MA: 'TH', TEN: 'Thực hành' }];
    fx[D + 'KLGD.PHANLOAIXACNHAN'] = [{ ID: 'LXN1', MA: 'KHOA', TEN: 'Khoa xác nhận' }, { ID: 'LXN2', MA: 'DAOTAO', TEN: 'Đào tạo duyệt' }];
    fx['KHCT_HoatDong_XacNhan/LayHanhDongXacNhanNguoiDung'] = function (o) {
        return o.strLoaiXacNhan_Id ? [{ ID: 'HD1', TEN: 'Đồng ý', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #16a34a' },
            { ID: 'HD2', TEN: 'Không đồng ý', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #dc2626' }] : [];
    };
    fx[P + 'CHUNG.LayDSNam'] = [{ ID: 'N2026', NAM: '2026' }];
    fx[P + 'KEHOACH.LayDSKH_Nam_TongHop'] = function (o) { return o.strNam ? [{ ID: 'KHN1', TEN: 'Kế hoạch đào tạo năm 2026' }] : []; };
    fx[P + 'KEHOACH.LayDSKH_Nam_ChiTietTheo'] = function (o) { return o.strKH_Nam_TongHop_Id ? [{ ID: 'KHCT1', TEN: 'Học kỳ 1 năm 2026 - 2027' }] : []; };
    fx['KHCT_ThoiGianDaoTao/LayDanhSach'] = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2026_2027_2' }];
    ums.demo.add(fx);
})();
