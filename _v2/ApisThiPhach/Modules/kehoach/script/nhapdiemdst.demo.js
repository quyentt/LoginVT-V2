/* Dữ liệu mẫu cho nhapdiemdst (Nhập điểm theo danh sách thi — Thi phách) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {};
    var DST = [];
    [['IT3100', 'Lập trình hướng đối tượng', 'HP1', 'KCNTT'], ['IT3090', 'Cơ sở dữ liệu', 'HP2', 'KCNTT'], ['EC1010', 'Kinh tế vi mô', 'HP3', 'KKT']].forEach(function (hp, j) {
        for (var i = 1; i <= 4; i++) DST.push({ ID: 'DST' + j + i, MADANHSACHTHI: 'DST-' + hp[0] + '-0' + i, DAOTAO_HOCPHAN_TEN: hp[1], HP: hp[2], K: hp[3],
            NGAYTHI: '0' + (6 + j) + '/01/2027', THI_CATHI_TEN: 'Ca ' + i, TKB_PHONGTHI_TEN: 'A2-30' + i, SOSVTHEODST: 28 + i + j,
            DSNHANSUCHAMTHI: i === 1 ? 'Trần Văn Hùng; Lê Thị Mai' : '', XACNHANHOANTHANHDIEMTHI: i === 2 ? 1 : 0 });
    });
    fx['pkg_thi_phach_chung.LayDSThiTheoDotThi'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return DST.filter(function (x) {
            return (!o.strDaoTao_HocPhan_Id || x.HP === o.strDaoTao_HocPhan_Id) && (!o.strDaoTao_CoCauToChuc_Id || x.K === o.strDaoTao_CoCauToChuc_Id) &&
                (!q || (x.MADANHSACHTHI + ' ' + x.DAOTAO_HOCPHAN_TEN).toLowerCase().indexOf(q) >= 0);
        }).map(function (x) { x.NGAYNHANBAI = (ums.demo.tpNdNgay || {})[x.ID] || x.NGAYNHANBAI || ''; return x; });
    };
    var TEN = [['2201', 'Trần Minh', 'Anh', 7.5], ['2202', 'Lê Thu', 'Hà', 8], ['2203', 'Phạm Quốc', 'Bảo', ''], ['2204', 'Ngô Bảo', 'Châu', ''],
        ['2205', 'Đỗ Thị', 'Dung', ''], ['2206', 'Vũ Hoàng', 'Giang', '']];
    var NH = {};
    function nguoiHoc(id) {
        if (!NH[id]) NH[id] = TEN.map(function (x, i) {
            return { ID: id + 'SV' + i, QLSV_NGUOIHOC_ID: 'NH' + x[0], QLSV_NGUOIHOC_MASO: 'DCQT.14.' + x[0], QLSV_NGUOIHOC_HODEM: x[1], QLSV_NGUOIHOC_TEN: x[2],
                DAOTAO_LOPQUANLY_TEN: i < 3 ? 'KTPM01-K14' : 'KTPM02-K14', DIEM_THANHPHANDIEM_TEN: 'Điểm thi cuối kỳ', LANHOC: 1, LANTHI: i === 5 ? 2 : 1, SOBAODANH: ('00' + (i + 1)).slice(-3),
                DIEMBANDAU: x[3], DIEMPHUCKHAO: i === 1 ? 8.5 : '', DIEM_DANHSACHHOC_TEN: 'IT3100.0' + (i < 3 ? 1 : 2), NGUOISUA_TAIKHOAN: x[3] === '' ? '' : 'hungtv',
                NGAYSUA_DD_MM_YYYY: x[3] === '' ? '' : '10/01/2027', CAMTHI_DUYETDKTHI: i === 4 ? '1' : '0', CAMTHI_VIPHAMQUYCHE: '0' };
        });
        return NH[id];
    }
    fx['TP_Chung/LayDSNguoiHocTheoDST'] = function (o) { return o.strDanhSachThi_Id ? nguoiHoc(o.strDanhSachThi_Id) : []; };
    fx['TP_XuLy/CapNhat_DiemPhachTheoDST'] = function (o) {
        Object.keys(NH).forEach(function (k) { NH[k].forEach(function (n) {
            if (n.ID === o.strThi_DanhSachSinhVien_Id) { n.DIEMBANDAU = o.strDiem; n.NGUOISUA_TAIKHOAN = 'khaothi01'; n.NGAYSUA_DD_MM_YYYY = '28/09/2026'; }
        }); });
        return [];
    };
    ums.demo.tpNdXacNhan = function (o) {
        if (o.strLoaiXacNhan_Id === 'XACNHAN_HOANTHANH_DIEMTHI') DST.forEach(function (x) { if (x.ID === o.strDuLieuXacNhan) x.XACNHANHOANTHANHDIEMTHI = o.strHanhDong_Id === 'HDX1' ? 1 : 0; });
    };
    var TK = [];
    [['Khoa Công nghệ thông tin', 'Kỹ thuật phần mềm'], ['Khoa Công nghệ thông tin', 'Hệ thống thông tin'], ['Khoa Kinh tế', 'Kế toán']].forEach(function (k, j) {
        for (var i = 1; i <= 9; i++) TK.push({ MA_HOCPHAN: ['IT3100', 'IT3090', 'EC1010'][j], TEN_HOCPHAN: ['Lập trình hướng đối tượng', 'Cơ sở dữ liệu', 'Kinh tế vi mô'][j],
            KHOA_QLSV: k[0], CHUYEN_NGANH: k[1], LOP: 'K14-0' + i, SO_SV: 30 + i, DIEM_A: 3 + (i % 4), DIEM_B: 10 + i, DIEM_C: 9, DIEM_D: 5, DIEM_F: i % 3 });
    });
    fx['PKG_THI_PHACH_THONGKE.ThongKeKetQuaDiemThiTheo'] = function (o) { return o.strDaoTao_KhoaQuanLyHP_Id === 'KKT' ? TK.filter(function (x) { return x.KHOA_QLSV === 'Khoa Kinh tế'; }) : TK; };
    ums.demo.add(fx);
})();
