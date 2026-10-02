/* Dữ liệu mẫu cho tintuc / tintuc1 (Cổng sinh viên) — chỉ dùng ở chế độ dựng thử.
   Tên cột đúng như màn đọc: ID, TIEUDE, DAOTAO_COCAUTOCHUC_ID/_TEN, NGAYBATDAU,
   NOIDUNG, NGUOITAO_TENDAYDU, DUONGDANANHHIENTHI; dòng lưu trữ có TINTUC_BANGTIN_ID. */
(function () {
    var TIN = [
        { ID: 'TIN1', TIEUDE: 'Thông báo lịch nghỉ Tết Nguyên đán năm 2027 của sinh viên',
          DAOTAO_COCAUTOCHUC_ID: 'PCTSV', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Công tác sinh viên', NGAYBATDAU: '18/09/2026',
          NOIDUNG: '<p>Nhà trường thông báo lịch nghỉ Tết Nguyên đán năm 2027 của sinh viên từ ngày ' +
                   '<b>01/02/2027</b> đến hết ngày <b>14/02/2027</b>. Sinh viên trở lại học tập bình thường từ ' +
                   'ngày 15/02/2027.</p><p>Đề nghị sinh viên ở ký túc xá đăng ký với Ban quản lý trước ngày 25/01/2027.</p>',
          NGUOITAO_TENDAYDU: 'Phòng Công tác sinh viên', DUONGDANANHHIENTHI: '' },
        { ID: 'TB1', TIEUDE: 'THÔNG BÁO Về việc điều chỉnh thời hạn đăng ký học lại và hạn nộp học phí đối với các lớp học riêng, Kỳ 3 (hè) năm học 2025 - 2026',
          DAOTAO_COCAUTOCHUC_ID: 'PQLDT', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Quản lý đào tạo và Đảm bảo chất lượng',
          NGAYBATDAU: '16/05/2026', TINQUANTRONG: 1,
          NOIDUNG: '<p><b>Kính gửi: Các bạn sinh viên,</b></p><p>Do số lượng đăng ký lớp mở riêng nhiều và cần thêm ' +
                   'thời gian rà soát sĩ số để mở lớp và tính học phí, Phòng Quản lý đào tạo và Đảm bảo chất lượng ' +
                   'thông báo điều chỉnh thời gian đăng ký học lại và nộp phí đối với các lớp học riêng kỳ 3 (hè) ' +
                   'năm học 2025 - 2026.</p><p><b>Hạn đăng ký và nộp học phí trên cổng sinh viên:</b> đến hết ngày <b>22/05/2026</b>.</p>',
          NGUOITAO_TENDAYDU: 'Phòng Quản lý đào tạo và Đảm bảo chất lượng', DUONGDANANHHIENTHI: '' },
        { ID: 'TIN2', TIEUDE: 'Kế hoạch đăng ký học kỳ 1 năm học 2026 - 2027',
          DAOTAO_COCAUTOCHUC_ID: 'PQLDT', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Quản lý đào tạo và Đảm bảo chất lượng',
          NGAYBATDAU: '12/09/2026',
          NOIDUNG: '<p>Cổng đăng ký học mở từ <b>20/09/2026</b> đến <b>30/09/2026</b>. Sinh viên đăng ký theo ' +
                   'đúng khung thời gian của từng khoá.</p>',
          NGUOITAO_TENDAYDU: 'Phòng Quản lý đào tạo và Đảm bảo chất lượng', DUONGDANANHHIENTHI: '' },
        { ID: 'TIN3', TIEUDE: 'Thông báo nộp học phí học kỳ 1 năm học 2026 - 2027',
          DAOTAO_COCAUTOCHUC_ID: 'PKHTC', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Kế hoạch - Tài chính', NGAYBATDAU: '05/09/2026',
          NOIDUNG: '<p>Hạn nộp học phí: <b>15/10/2026</b>. Sinh viên nộp trực tuyến trên cổng sinh viên hoặc ' +
                   'chuyển khoản theo cú pháp <b>Mã sinh viên - Họ tên</b>.</p>',
          NGUOITAO_TENDAYDU: 'Phòng Kế hoạch - Tài chính', DUONGDANANHHIENTHI: '' },
        { ID: 'TIN4', TIEUDE: 'Hội thảo hướng nghiệp "Sinh viên công nghệ và thị trường lao động số"',
          DAOTAO_COCAUTOCHUC_ID: 'KCNTT', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', NGAYBATDAU: '02/09/2026',
          NOIDUNG: '<p>Thời gian: 14h00 ngày 28/09/2026 tại Hội trường A. Sinh viên đăng ký tham dự tại văn phòng khoa.</p>',
          NGUOITAO_TENDAYDU: 'Khoa Công nghệ thông tin', DUONGDANANHHIENTHI: '' }
    ];
    /* Thêm 5 tin "Tin nhà trường" để nhóm dư 6 tin → có nút "Xem thêm (n)" */
    ['Lịch tiếp sinh viên của Ban Giám hiệu tháng 10', 'Thông báo tuyển cộng tác viên thư viện',
     'Kết quả bình chọn giảng viên được yêu thích', 'Hướng dẫn cài đặt ứng dụng cổng sinh viên trên điện thoại',
     'Thông báo lịch bảo trì hệ thống ngày 05/10/2026'].forEach(function (td, i) {
        TIN.push({ ID: 'TIN' + (5 + i), TIEUDE: td, DAOTAO_COCAUTOCHUC_ID: 'PKHTC', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Kế hoạch - Tài chính',
            NGAYBATDAU: (20 + i) + '/08/2026', NOIDUNG: '<p>' + td + '.</p>', NGUOITAO_TENDAYDU: 'Phòng Kế hoạch - Tài chính', DUONGDANANHHIENTHI: '' });
    });
    /* Đã đánh dấu sẵn một tin để cột phải "Tin đã đánh dấu" có dữ liệu */
    function tin(id) { return TIN.filter(function (x) { return x.ID === id; })[0] || {}; }
    var LUU = (function (t) {
        return [{ ID: 'LT1', TINTUC_BANGTIN_ID: t.ID, TIEUDE: t.TIEUDE, DAOTAO_COCAUTOCHUC_TEN: t.DAOTAO_COCAUTOCHUC_TEN,
                  NGAYBATDAU: t.NGAYBATDAU, NOIDUNG: t.NOIDUNG, NGUOITAO_TENDAYDU: t.NGUOITAO_TENDAYDU, DUONGDANANHHIENTHI: '' }];
    })(tin('TIN2'));
    var BL = [
        { ID: 'BL1', TINTUC_BANGTIN_ID: 'TIN2', NGUOIDUNG_TENDAYDU: 'Lăng Văn Huy', NOIDUNG: 'Cho em hỏi khoá 16 đăng ký từ ngày nào ạ?', NGAYTAO: '13/09/2026 09:12' },
        { ID: 'BL2', TINTUC_BANGTIN_ID: 'TIN2', NGUOIDUNG_TENDAYDU: 'Phòng Quản lý đào tạo', NOIDUNG: 'Khoá 16 đăng ký từ 8h00 ngày 22/09/2026.', NGAYTAO: '13/09/2026 10:40' }
    ];

    function ngay(s) {                          // 'dd/MM/yyyy' → số so sánh được
        var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(s || ''));
        return m ? Number(m[3] + m[2] + m[1]) : 0;
    }

    ums.demo.add({
        'pkg_tintuc.LayDSDonViCungCapNguon': [
            { ID: 'PQLDT', TEN: 'Phòng Quản lý đào tạo và Đảm bảo chất lượng' },
            { ID: 'PCTSV', TEN: 'Phòng Công tác sinh viên' },
            { ID: 'PKHTC', TEN: 'Phòng Kế hoạch - Tài chính' },
            { ID: 'KCNTT', TEN: 'Khoa Công nghệ thông tin' }
        ],
        'pkg_tintuc.LayDSTinTuc_BangTin_NguoiDung': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var tu = ngay(o.strTuNgay), den = ngay(o.strDenNgay);
            return TIN.filter(function (t) {
                /* dTinQuanTrong: -1 mọi tin · 1 chỉ tin quan trọng (khối thông báo đầu lưới) */
                var qt = Number(o.dTinQuanTrong);
                if (qt === 1 && Number(t.TINQUANTRONG) !== 1) return false;
                if (qt !== 1 && Number(t.TINQUANTRONG) === 1) return false;
                if (o.strDaoTao_CoCauToChuc_Id && t.DAOTAO_COCAUTOCHUC_ID !== o.strDaoTao_CoCauToChuc_Id) return false;
                if (q && t.TIEUDE.toLowerCase().indexOf(q) < 0) return false;
                if (tu && ngay(t.NGAYBATDAU) < tu) return false;
                if (den && ngay(t.NGAYBATDAU) > den) return false;
                return true;
            });
        },
        /* Chi tiết một tin (kho gốc 30/09/2026: bấm tin gọi LayTinTuc_BangTin_ChiTiet) */
        'pkg_tintuc.LayTinTuc_BangTin_ChiTiet': function (o) {
            return TIN.filter(function (t) { return t.ID === o.strTinTuc_BangTin_Id; });
        },
        'pkg_tintuc.Them_TinTuc_BangTin_LuotXem': [],
        'pkg_tintuc.LayDSTinTuc_BangTin_LuuTru': function () { return LUU.slice(); },
        'pkg_tintuc.Xoa_TinTuc_BangTin_LuuTru': function (o) {
            for (var i = LUU.length - 1; i >= 0; i--) if (LUU[i].TINTUC_BANGTIN_ID === o.strTinTuc_BangTin_Id) LUU.splice(i, 1);
            return [];
        },
        'pkg_tintuc.Them_TinTuc_BangTin_LuuTru': function (o) {
            var t = TIN.filter(function (x) { return x.ID === o.strTinTuc_BangTin_Id; })[0];
            if (t && !LUU.some(function (x) { return x.TINTUC_BANGTIN_ID === t.ID; })) {
                LUU.push({ ID: 'LT' + (LUU.length + 1), TINTUC_BANGTIN_ID: t.ID, TIEUDE: t.TIEUDE,
                    DAOTAO_COCAUTOCHUC_TEN: t.DAOTAO_COCAUTOCHUC_TEN, NGAYBATDAU: t.NGAYBATDAU,
                    NOIDUNG: t.NOIDUNG, NGUOITAO_TENDAYDU: t.NGUOITAO_TENDAYDU, DUONGDANANHHIENTHI: '' });
            }
            return [];
        },
        'pkg_tintuc.LayDSTinTuc_BangTin_BinhLuan': function (o) {
            return BL.filter(function (b) { return b.TINTUC_BANGTIN_ID === o.strTinTuc_BangTin_Id; });
        },
        'pkg_tintuc.Them_TinTuc_BangTin_BinhLuan': function (o) {
            BL.push({ ID: 'BL' + (BL.length + 1), TINTUC_BANGTIN_ID: o.strTinTuc_BangTin_Id,
                NGUOIDUNG_TENDAYDU: 'Lăng Văn Huy', NOIDUNG: o.strNoiDung, NGAYTAO: 'vừa xong' });
            return [];
        },
        /* Tệp đính kèm của bản tin (edu.system.viewFiles → SV_Files) */
        'SV_Files/LayDanhSach': function (o) {
            return o.strDuLieu_Id === 'TIN2'
                ? [{ ID: 'F1', FILEMINHCHUNG: 'TinTuc/ke-hoach-dang-ky-hk1.pdf', TENHIENTHI: 'ke-hoach-dang-ky-hk1.pdf' }]
                : [];
        }
    });
})();
