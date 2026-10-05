/* Dữ liệu mẫu cho tintuc — chỉ dùng ở chế độ dựng thử. */
(function () {
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten, MOTA: '' }; }
    var CHUYENMUC = [dm('CM1', 'TB_CHUNG', 'Thông báo chung'), dm('CM2', 'TB_DT', 'Thông báo đào tạo'), dm('CM3', 'SK', 'Sự kiện')];
    var PHEDUYET = [dm('PD1', 'CHO', 'Chờ duyệt'), dm('PD2', 'DADUYET', 'Đã duyệt'), dm('PD3', 'TUCHOI', 'Từ chối')];
    var NOIDUNG = '<p>Phòng Đào tạo thông báo tới toàn thể sinh viên về <b>lịch thi kết thúc học phần</b> học kỳ 2 năm học 2025-2026.</p>' +
        '<ul><li>Thời gian: từ 15/06/2026 đến 30/06/2026.</li><li>Địa điểm: theo lịch thi công bố trên cổng sinh viên.</li></ul>' +
        '<p>Sinh viên lưu ý mang theo thẻ sinh viên khi dự thi.</p>';
    var TIN = [
        { ID: 'TT1', TIEUDE: 'Thông báo lịch thi kết thúc học phần HK2 2025-2026', CHUYENMUC_ID: 'CM2', CHUYENMUC_TEN: 'Thông báo đào tạo',
          NGAYBATDAU: '01/06/2026', NGAYKETTHUC: '30/06/2026', DAOTAO_COCAUTOCHUC_ID: 'CC1', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Đào tạo',
          CHUNG_UNGDUNG_ID: 'UD1', CHUNG_UNGDUNG_TEN: 'Cổng sinh viên', TIEUDIEM: 1, TINQUANTRONG: 1, DUONGDANANHHIENTHI: '' },
        { ID: 'TT2', TIEUDE: 'Kế hoạch tổ chức Ngày hội việc làm 2026', CHUYENMUC_ID: 'CM3', CHUYENMUC_TEN: 'Sự kiện',
          NGAYBATDAU: '10/05/2026', NGAYKETTHUC: '25/05/2026', DAOTAO_COCAUTOCHUC_ID: 'CC2', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Công tác sinh viên',
          CHUNG_UNGDUNG_ID: 'UD1', CHUNG_UNGDUNG_TEN: 'Cổng sinh viên', TIEUDIEM: 0, TINQUANTRONG: 0, DUONGDANANHHIENTHI: '' },
        { ID: 'TT3', TIEUDE: 'Lịch nghỉ lễ 30/4 và 1/5', CHUYENMUC_ID: 'CM1', CHUYENMUC_TEN: 'Thông báo chung',
          NGAYBATDAU: '20/04/2026', NGAYKETTHUC: '05/05/2026', DAOTAO_COCAUTOCHUC_ID: 'CC3', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Hành chính',
          CHUNG_UNGDUNG_ID: 'UD2', CHUNG_UNGDUNG_TEN: 'Cổng cán bộ', TIEUDIEM: 1, TINQUANTRONG: 1, DUONGDANANHHIENTHI: '' },
        { ID: 'TT4', TIEUDE: 'Hướng dẫn đăng ký học phần học kỳ hè', CHUYENMUC_ID: 'CM2', CHUYENMUC_TEN: 'Thông báo đào tạo',
          NGAYBATDAU: '15/05/2026', NGAYKETTHUC: '15/06/2026', DAOTAO_COCAUTOCHUC_ID: 'CC1', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Đào tạo',
          CHUNG_UNGDUNG_ID: 'UD1', CHUNG_UNGDUNG_TEN: 'Cổng sinh viên', TIEUDIEM: 0, TINQUANTRONG: 0, DUONGDANANHHIENTHI: '' }
    ];
    var PHAMVI = {
        TT1: [
            { ID: 'PV1', PHANCAPAPDUNG_TEN: 'Khóa đào tạo', PHAMVIAPDUNG_ID: 'K67', PHAMVIAPDUNG_TEN: 'Khóa 67', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', NGAYTAO_DD_MM_YYYY: '02/06/2026', QLSV_NGUOIHOC_ID: '' },
            { ID: 'PV2', PHANCAPAPDUNG_TEN: 'Lớp quản lý', PHAMVIAPDUNG_ID: 'L1', PHAMVIAPDUNG_TEN: 'K67-KTPM1', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', NGAYTAO_DD_MM_YYYY: '02/06/2026', QLSV_NGUOIHOC_ID: '' },
            { ID: 'PV3', PHANCAPAPDUNG_TEN: 'Sinh viên', PHAMVIAPDUNG_ID: 'NH1', PHAMVIAPDUNG_TEN: 'Nguyễn Văn An', QLSV_TRANGTHAINGUOIHOC_TEN: '', NGAYTAO_DD_MM_YYYY: '03/06/2026', QLSV_NGUOIHOC_ID: 'NH1' }
        ]
    };
    var pvSeq = 10, ttSeq = 10, cmSeq = 10;
    var SV = [];
    var ho = ['Nguyễn Văn', 'Trần Thị', 'Lê Minh', 'Phạm Thu', 'Hoàng Anh', 'Vũ Đức', 'Đặng Hồng', 'Bùi Quang'];
    var ten = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hà', 'Khánh', 'Linh', 'Minh', 'Nam', 'Oanh', 'Phúc', 'Quân', 'Sơn', 'Trang', 'Uyên'];
    for (var i = 0; i < 47; i++) {
        var ma = 'BIT2202' + (10 + i);
        SV.push({ ID: 'HS' + i, MASO: ma, HODEM: ho[i % ho.length], TEN: ten[i % ten.length],
            TTLL_EMAILCANHAN: i % 9 === 4 ? '' : ma.toLowerCase() + '@st.eaut.edu.vn',
            LOP: i % 2 ? 'K67-KTPM1' : 'K67-QTKD2', KHOADAOTAO: 'Khóa 67', HEDAOTAO: 'Đại học chính quy',
            QLSV_NGUOIHOC_TRANGTHAI: i % 11 === 7 ? 'Bảo lưu' : 'Đang học' });
    }
    function trang(rows, o) {
        var ps = Number(o.pageSize) || 20, pi = Number(o.pageIndex) || 1;
        return { rows: rows.slice((pi - 1) * ps, pi * ps), pager: rows.length };
    }
    function khop(s, q) { return !q || String(s || '').toLowerCase().indexOf(String(q).toLowerCase()) >= 0; }

    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TINTUC.CHUYENMUC': function () { return CHUYENMUC.slice(); },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TINTUC.PHEDUYET': PHEDUYET,
        'CMS_UngDung/LayDanhSach': [{ ID: 'UD1', MAUNGDUNG: 'CSV', TENUNGDUNG: 'Cổng sinh viên' }, { ID: 'UD2', MAUNGDUNG: 'CCB', TENUNGDUNG: 'Cổng cán bộ' }],

        'TT_BangTin/LayDanhSach': function (o) {
            var rs = TIN.filter(function (t) {
                return khop(t.TIEUDE, o.strTuKhoa) && (!o.strChuyenMuc_Id || t.CHUYENMUC_ID === o.strChuyenMuc_Id) &&
                    (!o.strChung_UngDung_Id || t.CHUNG_UNGDUNG_ID === o.strChung_UngDung_Id) &&
                    (!o.strDaoTao_CoCauToChuc_Id || t.DAOTAO_COCAUTOCHUC_ID === o.strDaoTao_CoCauToChuc_Id);
            });
            return trang(rs, o);
        },
        'pkg_tintuc.LayTinTuc_BangTin_ChiTiet': function (o) {
            var t = TIN.filter(function (x) { return x.ID === o.strTinTuc_BangTin_Id; })[0];
            if (!t) return [];
            var d = {}; Object.keys(t).forEach(function (k) { d[k] = t[k]; });
            d.NOIDUNG = NOIDUNG;
            return [d];
        },
        'TT_BangTin/ThemMoi': function (o) {
            var id = 'TT' + (ttSeq++);
            var cm = CHUYENMUC.filter(function (c) { return c.ID === o.strChuyenMuc_Id; })[0];
            TIN.push({ ID: id, TIEUDE: o.strTieuDe, CHUYENMUC_ID: o.strChuyenMuc_Id, CHUYENMUC_TEN: cm ? cm.TEN : '',
                NGAYBATDAU: o.strNgayBatDau, NGAYKETTHUC: o.strNgayKetThuc, DAOTAO_COCAUTOCHUC_ID: o.strDaoTao_CoCauToChuc_Id, DAOTAO_COCAUTOCHUC_TEN: '',
                CHUNG_UNGDUNG_ID: o.strChung_UngDung_Id, CHUNG_UNGDUNG_TEN: '', TIEUDIEM: Number(o.dTinQuanTrong) || 0, TINQUANTRONG: Number(o.dTinQuanTrong) || 0,
                DUONGDANANHHIENTHI: o.strDuongDanAnhHienThi || '' });
            return { rows: [], raw: { Id: id } };
        },
        'TT_BangTin/CapNhat': function (o) {
            TIN.forEach(function (t) {
                if (t.ID !== o.strId) return;
                var cm = CHUYENMUC.filter(function (c) { return c.ID === o.strChuyenMuc_Id; })[0];
                t.TIEUDE = o.strTieuDe; t.CHUYENMUC_ID = o.strChuyenMuc_Id; t.CHUYENMUC_TEN = cm ? cm.TEN : '';
                t.NGAYBATDAU = o.strNgayBatDau; t.NGAYKETTHUC = o.strNgayKetThuc;
                t.DAOTAO_COCAUTOCHUC_ID = o.strDaoTao_CoCauToChuc_Id; t.CHUNG_UNGDUNG_ID = o.strChung_UngDung_Id;
                t.TIEUDIEM = t.TINQUANTRONG = Number(o.dTinQuanTrong) || 0; t.DUONGDANANHHIENTHI = o.strDuongDanAnhHienThi || '';
            });
            return { rows: [], raw: { Id: o.strId } };
        },
        'TT_BangTin/Xoa': function (o) {
            for (var i = TIN.length - 1; i >= 0; i--) if (TIN[i].ID === o.strIds) TIN.splice(i, 1);
            return [];
        },
        'SV_Files/LayDanhSach': function (o) {
            return o.strDuLieu_Id === 'TT1' ? [{ ID: 'F1', FILEMINHCHUNG: 'Upload/TinTuc/lichthi_hk2.pdf', TENHIENTHI: 'lichthi_hk2.pdf' }] : [];
        },

        'TT_PhamVi/LayDanhSach': function (o) { return trang(PHAMVI[o.strTinTuc_BangTin_Id] || [], o); },
        'TT_PhamVi/ThemMoi': function (o) {
            var list = PHAMVI[o.strTinTuc_BangTin_Id] || (PHAMVI[o.strTinTuc_BangTin_Id] = []);
            list.push({ ID: 'PV' + (pvSeq++), PHANCAPAPDUNG_TEN: 'Phạm vi', PHAMVIAPDUNG_ID: o.strPhamViApDung_Id, PHAMVIAPDUNG_TEN: o.strPhamViApDung_Id,
                QLSV_TRANGTHAINGUOIHOC_TEN: '', NGAYTAO_DD_MM_YYYY: '05/10/2026' });
            return [];
        },
        'TT_PhamVi/Xoa': function (o) {
            Object.keys(PHAMVI).forEach(function (k) { PHAMVI[k] = PHAMVI[k].filter(function (r) { return r.ID !== o.strIds; }); });
            return [];
        },

        'SV_HoSo/LayDanhSach': function (o) {
            var rs = SV.filter(function (s) {
                return khop(s.MASO + ' ' + s.HODEM + ' ' + s.TEN, o.strTuKhoa) &&
                    (!o.strLopQuanLy_Id || (o.strLopQuanLy_Id.indexOf('L1') >= 0 && s.LOP === 'K67-KTPM1') || (o.strLopQuanLy_Id.indexOf('L2') >= 0 && s.LOP === 'K67-QTKD2'));
            });
            return trang(rs, o);
        },
        'CMS_NguoiDung/SendEmail': function () { return []; },

        'CMS_DanhMucTenBang/LayDanhSach': [{ ID: 'TB_CM', MADANHMUC: 'TINTUC.CHUYENMUC', TEN: 'Chuyên mục tin tức' }],
        'CMS_DanhMucDuLieu/LayDanhSach': function (o) { return o.strCHUNG_TENDANHMUC_Id === 'TB_CM' ? CHUYENMUC.slice() : []; },
        'CMS_DanhMucDuLieu/ThemMoi': function (o) {
            var id = 'CM' + (cmSeq++);
            CHUYENMUC.push({ ID: id, MA: o.strMa, TEN: o.strTen, MOTA: o.strMoTa || '' });
            return { rows: [], raw: { Id: id } };
        },
        'CMS_DanhMucDuLieu/CapNhat': function (o) {
            CHUYENMUC.forEach(function (c) { if (c.ID === o.strId) { c.MA = o.strMa; c.TEN = o.strTen; c.MOTA = o.strMoTa || ''; } });
            return [];
        },
        'CMS_DanhMucDuLieu/Xoa': function (o) {
            for (var i = CHUYENMUC.length - 1; i >= 0; i--) if (CHUYENMUC[i].ID === o.strId) CHUYENMUC.splice(i, 1);
            return [];
        }
    });
})();
