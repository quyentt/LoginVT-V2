/* Dữ liệu mẫu cho tintuc — chỉ dùng ở chế độ dựng thử. */
(function () {
    var TIN = [
        { ID: 'TIN1', TIEUDE: 'Thông báo lịch nghỉ Tết Nguyên đán năm 2027', DAOTAO_COCAUTOCHUC_ID: 'PHC', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Hành chính',
          NGAYBATDAU: '15/09/2026', NOIDUNG: '<p>Nhà trường thông báo lịch nghỉ Tết Nguyên đán Đinh Mùi 2027 từ ngày <b>01/02/2027</b> đến hết ngày <b>14/02/2027</b>.</p>',
          NGUOITAO_TENDAYDU: 'Phòng Hành chính', DUONGDANANHHIENTHI: '' },
        { ID: 'TIN2', TIEUDE: 'Hội thảo khoa học quốc tế về chuyển đổi số trong giáo dục', DAOTAO_COCAUTOCHUC_ID: 'KCNTT', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin',
          NGAYBATDAU: '10/09/2026', NOIDUNG: '<p>Hội thảo diễn ra tại hội trường A, mời cán bộ đăng ký tham luận trước ngày 30/09.</p>', NGUOITAO_TENDAYDU: 'Khoa CNTT', DUONGDANANHHIENTHI: '' },
        { ID: 'TIN3', TIEUDE: 'Kế hoạch khám sức khoẻ định kỳ cho cán bộ viên chức', DAOTAO_COCAUTOCHUC_ID: 'PHC', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Hành chính',
          NGAYBATDAU: '02/09/2026', NOIDUNG: '<p>Thời gian khám: 20–25/10/2026 tại trạm y tế trường.</p>', NGUOITAO_TENDAYDU: 'Trạm y tế', DUONGDANANHHIENTHI: '' }
    ];
    var LUU = [{ ID: 'L1', TINTUC_BANGTIN_ID: 'TIN2', TIEUDE: TIN[1].TIEUDE, DAOTAO_COCAUTOCHUC_TEN: TIN[1].DAOTAO_COCAUTOCHUC_TEN, NGAYBATDAU: TIN[1].NGAYBATDAU }];
    var BL = [{ ID: 'B1', TINTUC_BANGTIN_ID: 'TIN2', NGUOIDUNG_TENDAYDU: 'Trần Thị Bình', NOIDUNG: 'Tôi xin đăng ký một tham luận.', NGAYTAO: '11/09/2026 08:30' }];
    ums.demo.add({
        'TT_DonViCungCapNguon/LayDanhSach': [{ ID: 'PHC', TEN: 'Phòng Hành chính' }, { ID: 'KCNTT', TEN: 'Khoa Công nghệ thông tin' }],
        'TT_BangTin_NguoiDung/LayDanhSach': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            return TIN.filter(function (t) { return (!o.strDaoTao_CoCauToChuc_Id || t.DAOTAO_COCAUTOCHUC_ID === o.strDaoTao_CoCauToChuc_Id) && (!q || t.TIEUDE.toLowerCase().indexOf(q) >= 0); });
        },
        'TT_LuotXem/ThemMoi': [],
        'TT_LuuTru/LayDanhSach': function () { return LUU.slice(); },
        'TT_LuuTru/Xoa': function (o) {
            for (var i = LUU.length - 1; i >= 0; i--) if (LUU[i].TINTUC_BANGTIN_ID === o.strTinTuc_BangTin_Id) LUU.splice(i, 1);
            return [];
        },
        'TT_LuuTru/ThemMoi': function (o) {
            var t = TIN.filter(function (x) { return x.ID === o.strTinTuc_BangTin_Id; })[0];
            if (t) LUU.push({ ID: 'L' + (LUU.length + 1), TINTUC_BANGTIN_ID: t.ID, TIEUDE: t.TIEUDE, DAOTAO_COCAUTOCHUC_TEN: t.DAOTAO_COCAUTOCHUC_TEN, NGAYBATDAU: t.NGAYBATDAU });
            return [];
        },
        'TT_BinhLuan/LayDanhSach': function (o) { return BL.filter(function (b) { return b.TINTUC_BANGTIN_ID === o.strTinTuc_BangTin_Id; }); },
        'TT_BinhLuan/ThemMoi': function (o) { BL.push({ ID: 'B' + (BL.length + 1), TINTUC_BANGTIN_ID: o.strTinTuc_BangTin_Id, NGUOIDUNG_TENDAYDU: 'admin', NOIDUNG: o.strNoiDung, NGAYTAO: 'vừa xong' }); return []; },
        'SV_Files/LayDanhSach': []
    });
})();
