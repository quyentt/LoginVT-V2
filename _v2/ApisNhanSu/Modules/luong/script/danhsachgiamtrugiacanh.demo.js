/* Dữ liệu mẫu cho danhsachgiamtrugiacanh (Nhân sự) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'CHUN.CHLU'] = [{ ID: 'VN', MA: 'VN', TEN: 'Việt Nam' }, { ID: 'JP', MA: 'JP', TEN: 'Nhật Bản' }];
    fx[D + 'NS.QHGD'] = [{ ID: 'QH4', MA: 'CON', TEN: 'Con' }, { ID: 'QH3', MA: 'VO', TEN: 'Vợ' }, { ID: 'QH1', MA: 'CHA', TEN: 'Cha' }];
    fx[D + 'CHUN.DMTT'] = [{ ID: 'TT01', MA: '01', TEN: 'Hà Nội' }, { ID: 'TT02', MA: '004', TEN: 'Quận Cầu Giấy' }, { ID: 'TT03', MA: '00157', TEN: 'Phường Dịch Vọng' }];
    fx['L_GiamTruGiaCanh/KeThua'] = [];
    ums.demo.add(fx);
    ums.demo.crudStore('L_GiamTruGiaCanh', [
        { ID: 'GT1', NHANSU_HOSOCANBO_HODEM: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'Hùng', NHANSU_HOSOCANBO_MASOTHUE: '8012345678', HOTEN: 'Nguyễn Minh An', NGAYSINH: '12', THANGSINH: '05', NAMSINH: '2015',
          MASOTHUENGUOIPHUTHUOC: '', QUOCTICH_ID: 'VN', QUOCTICH_MA: 'VN', QUOCTICH_TEN: 'Việt Nam', CMTND: '', THECANCUOC: '', HOCHIEU: '', QUANHEVOINGUOINOPTHUE_ID: 'QH4', QUANHE_MA: 'CON', QUANHE_TEN: 'Con',
          GIAYKHAISINH_SO: '125', GIAYKHAISINH_QUYEN: '02/2015', GIAYKHAISINH_QUOCGIA_ID: 'VN', GIAYKHAISINH_QUOCGIA_MA: 'VN', GIAYKHAISINH_QUOCGIA_TEN: 'Việt Nam',
          GIAYKHAISINH_TINHTHANH_ID: 'TT01', GIAYKHAISINH_TINHTHANH_MA: '01', GIAYKHAISINH_TINHTHANH_TEN: 'Hà Nội', TUTHANG: '01', TUNAM: '2026', DENTHANG: '12', DENNAM: '2026' },
        { ID: 'GT2', NHANSU_HOSOCANBO_HODEM: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'Hùng', NHANSU_HOSOCANBO_MASOTHUE: '8012345678', HOTEN: 'Phạm Thị Lan', NGAYSINH: '03', THANGSINH: '09', NAMSINH: '1950',
          MASOTHUENGUOIPHUTHUOC: '8098765432', QUOCTICH_ID: 'VN', QUOCTICH_MA: 'VN', QUOCTICH_TEN: 'Việt Nam', CMTND: '001150002233', THECANCUOC: '', HOCHIEU: '', QUANHEVOINGUOINOPTHUE_ID: 'QH1', QUANHE_MA: 'ME', QUANHE_TEN: 'Mẹ',
          TUTHANG: '01', TUNAM: '2026', DENTHANG: '12', DENNAM: '2026' }
    ], { map: function (o) { return { HOTEN: o.strHoTen, NGAYSINH: o.strNgaySinh, THANGSINH: o.strThangSinh, NAMSINH: o.strNamSinh, QUOCTICH_ID: o.strQuocTich_Id,
        QUANHEVOINGUOINOPTHUE_ID: o.strQuanHeVoiNguoiNopThue_Id, TUTHANG: o.strTuThang, TUNAM: o.strTuNam, DENTHANG: o.strDenThang, DENNAM: o.strDenNam }; } });
})();
