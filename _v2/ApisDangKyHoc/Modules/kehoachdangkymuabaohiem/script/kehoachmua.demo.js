/* Dữ liệu mẫu cho kehoachmua (Kế hoạch tổ chức đăng ký mua) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    var P = 'PKG_TAICHINH_DANGKYMUA.';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }

    var LOAI = [dm('LKH1', 'BHYT', 'Bảo hiểm y tế'), dm('LKH2', 'BHTN', 'Bảo hiểm thân thể'), dm('LKH3', 'DONGPHUC', 'Đồng phục')];
    var TT = [dm('TT1', 'MO', 'Đang mở'), dm('TT2', 'DONG', 'Đã đóng'), dm('TT3', 'NHAP', 'Bản nháp')];
    var PL = [dm('PL1', 'BH', 'Bảo hiểm'), dm('PL2', 'TRANGPHUC', 'Trang phục'), dm('PL3', 'HOCLIEU', 'Học liệu')];
    var DVT = [dm('DV1', 'THE', 'Thẻ'), dm('DV2', 'BO', 'Bộ'), dm('DV3', 'CAI', 'Cái')];

    function ten(list, id) { var x = list.filter(function (r) { return r.ID === id; })[0]; return x ? x.TEN : ''; }

    var KH = [
        { ID: 'KHM1', MA: 'BHYT-2026', TEN: 'Đăng ký mua BHYT sinh viên năm học 2026-2027', MOTA: 'Áp dụng cho sinh viên chính quy các khoá', TUNGAY: '01/09/2026', DENNGAY: '31/10/2026',
          LOAIKEHOACH_ID: 'LKH1', LOAIKEHOACH_TEN: 'Bảo hiểm y tế', TINHTRANG_ID: 'TT1', TINHTRANG_TEN: 'Đang mở', DAOTAO_THOIGIANDAOTAO_ID: 'TG1',
          CHOPHEPSUASOLUONG: 0, CHOPHEPHUYTRUOCTHANHTOAN: 1, YEUCAUTHANHTOANNGAY: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '15/08/2026 09:12:40', NGUOITAO_TAIKHOAN: 'phongtaichinh' },
        { ID: 'KHM2', MA: 'BHTT-2026', TEN: 'Bảo hiểm thân thể tự nguyện 2026', MOTA: '', TUNGAY: '05/09/2026', DENNGAY: '30/09/2026',
          LOAIKEHOACH_ID: 'LKH2', LOAIKEHOACH_TEN: 'Bảo hiểm thân thể', TINHTRANG_ID: 'TT1', TINHTRANG_TEN: 'Đang mở', DAOTAO_THOIGIANDAOTAO_ID: 'TG1',
          CHOPHEPSUASOLUONG: 1, CHOPHEPHUYTRUOCTHANHTOAN: 1, YEUCAUTHANHTOANNGAY: 0, NGAYTAO_DD_MM_YYYY_HHMMSS: '20/08/2026 14:03:11', NGUOITAO_TAIKHOAN: 'phongtaichinh' },
        { ID: 'KHM3', MA: 'DP-K68', TEN: 'Đăng ký mua đồng phục tân sinh viên K68', MOTA: 'Áo sơ mi, áo thể dục', TUNGAY: '20/08/2026', DENNGAY: '15/09/2026',
          LOAIKEHOACH_ID: 'LKH3', LOAIKEHOACH_TEN: 'Đồng phục', TINHTRANG_ID: 'TT2', TINHTRANG_TEN: 'Đã đóng', DAOTAO_THOIGIANDAOTAO_ID: 'TG1',
          CHOPHEPSUASOLUONG: 1, CHOPHEPHUYTRUOCTHANHTOAN: 0, YEUCAUTHANHTOANNGAY: 0, NGAYTAO_DD_MM_YYYY_HHMMSS: '01/08/2026 08:30:00', NGUOITAO_TAIKHOAN: 'ctsv.nguyenha' },
        { ID: 'KHM4', MA: 'BHYT-2025-HK2', TEN: 'Gia hạn BHYT học kỳ 2 năm 2025-2026', MOTA: '', TUNGAY: '05/01/2026', DENNGAY: '28/02/2026',
          LOAIKEHOACH_ID: 'LKH1', LOAIKEHOACH_TEN: 'Bảo hiểm y tế', TINHTRANG_ID: 'TT2', TINHTRANG_TEN: 'Đã đóng', DAOTAO_THOIGIANDAOTAO_ID: 'TG2',
          CHOPHEPSUASOLUONG: 0, CHOPHEPHUYTRUOCTHANHTOAN: 0, YEUCAUTHANHTOANNGAY: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '20/12/2025 10:45:21', NGUOITAO_TAIKHOAN: 'phongtaichinh' }
    ];

    var DG = [
        { ID: 'DG1', TAICHINH_KH_MUAHANG_ID: 'KHM1', TAICHINH_CACKHOANTHU_ID: 'KT4', TEN_KHOANTHU: 'Bảo hiểm y tế', DONGIA: 884520, PHANLOAIHANGHOA_ID: 'PL1', PHANLOAIHANGHOA_TEN: 'Bảo hiểm',
          DONVITINH_ID: 'DV1', TEN_DONVITINH: 'Thẻ', CHOPHEPKHONGMUA: 1, BATBUOC: 0, CONHAPSOLUONG: 0, SOLUONGTOITHIEU: 1, SOLUONGTOIDA: 1, HIEULUC: 1, SAPXEP: 1,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '15/08/2026 09:20:02', NGUOITAO_TAIKHOAN: 'phongtaichinh' },
        { ID: 'DG2', TAICHINH_KH_MUAHANG_ID: 'KHM2', TAICHINH_CACKHOANTHU_ID: 'KT4', TEN_KHOANTHU: 'Bảo hiểm thân thể', DONGIA: 150000, PHANLOAIHANGHOA_ID: 'PL1', PHANLOAIHANGHOA_TEN: 'Bảo hiểm',
          DONVITINH_ID: 'DV1', TEN_DONVITINH: 'Thẻ', CHOPHEPKHONGMUA: 1, BATBUOC: 0, CONHAPSOLUONG: 0, SOLUONGTOITHIEU: 1, SOLUONGTOIDA: 1, HIEULUC: 1, SAPXEP: 1,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '20/08/2026 14:10:00', NGUOITAO_TAIKHOAN: 'phongtaichinh' },
        { ID: 'DG3', TAICHINH_KH_MUAHANG_ID: 'KHM3', TAICHINH_CACKHOANTHU_ID: 'KT5', TEN_KHOANTHU: 'Áo sơ mi đồng phục', DONGIA: 185000, PHANLOAIHANGHOA_ID: 'PL2', PHANLOAIHANGHOA_TEN: 'Trang phục',
          DONVITINH_ID: 'DV3', TEN_DONVITINH: 'Cái', CHOPHEPKHONGMUA: 0, BATBUOC: 1, CONHAPSOLUONG: 1, SOLUONGTOITHIEU: 1, SOLUONGTOIDA: 3, HIEULUC: 1, SAPXEP: 1,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '01/08/2026 08:40:00', NGUOITAO_TAIKHOAN: 'ctsv.nguyenha' },
        { ID: 'DG4', TAICHINH_KH_MUAHANG_ID: 'KHM3', TAICHINH_CACKHOANTHU_ID: 'KT5', TEN_KHOANTHU: 'Bộ quần áo thể dục', DONGIA: 220000, PHANLOAIHANGHOA_ID: 'PL2', PHANLOAIHANGHOA_TEN: 'Trang phục',
          DONVITINH_ID: 'DV2', TEN_DONVITINH: 'Bộ', CHOPHEPKHONGMUA: 1, BATBUOC: 0, CONHAPSOLUONG: 1, SOLUONGTOITHIEU: 0, SOLUONGTOIDA: 2, HIEULUC: 1, SAPXEP: 2,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '01/08/2026 08:42:10', NGUOITAO_TAIKHOAN: 'ctsv.nguyenha' }
    ];

    var PV = [
        { ID: 'PV1', TAICHINH_KH_MUAHANG_ID: 'KHM1', PHAMVIAPDUNG_ID: 'H1', PHAMVIAPDUNG_TEN: 'Đại học chính quy', HIEULUC: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '15/08/2026 09:25:00', NGUOITAO_TAIKHOAN: 'phongtaichinh' },
        { ID: 'PV2', TAICHINH_KH_MUAHANG_ID: 'KHM1', PHAMVIAPDUNG_ID: 'K68', PHAMVIAPDUNG_TEN: 'Khóa 68', HIEULUC: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '15/08/2026 09:25:03', NGUOITAO_TAIKHOAN: 'phongtaichinh' },
        { ID: 'PV3', TAICHINH_KH_MUAHANG_ID: 'KHM1', PHAMVIAPDUNG_ID: 'L9', PHAMVIAPDUNG_TEN: 'K66-KTPM1', HIEULUC: 0, NGAYTAO_DD_MM_YYYY_HHMMSS: '15/08/2026 09:26:00', NGUOITAO_TAIKHOAN: 'phongtaichinh' },
        { ID: 'PV4', TAICHINH_KH_MUAHANG_ID: 'KHM3', PHAMVIAPDUNG_ID: 'K68', PHAMVIAPDUNG_TEN: 'Khóa 68', HIEULUC: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '01/08/2026 08:45:00', NGUOITAO_TAIKHOAN: 'ctsv.nguyenha' }
    ];

    var KQ = [
        { ID: 'KQ1', TAICHINH_KH_MUAHANG_ID: 'KHM1', MASO: '68KTPM0012', HODEM: 'Nguyễn Văn', TEN: 'An', NGAYMUA_DD_MM_YYYY_HHMMSS: '03/09/2026 08:12:00', TEN_KHOANTHU: 'Bảo hiểm y tế',
          TINHTRANGDANGKY_CODE_NAME: 'Đăng ký mua', LYDOKHONGMUA: '', MINHCHUNG: '', SOLUONG: 1, DONGIA: 884520, SOTIEN_PHAINOP: 884520, SOTIEN_DANOP: 884520,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '03/09/2026 08:12:00', NGUOITAO_TAIKHOAN: '68KTPM0012' },
        { ID: 'KQ2', TAICHINH_KH_MUAHANG_ID: 'KHM1', MASO: '68KTPM0027', HODEM: 'Trần Thị', TEN: 'Bình', NGAYMUA_DD_MM_YYYY_HHMMSS: '04/09/2026 10:01:30', TEN_KHOANTHU: 'Bảo hiểm y tế',
          TINHTRANGDANGKY_CODE_NAME: 'Không mua', LYDOKHONGMUA: 'Đã có thẻ BHYT hộ gia đình', MINHCHUNG: '/Upload/File/minhchung/68KTPM0027.pdf', SOLUONG: 0, DONGIA: 884520, SOTIEN_PHAINOP: 0, SOTIEN_DANOP: 0,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '04/09/2026 10:01:30', NGUOITAO_TAIKHOAN: '68KTPM0027' },
        { ID: 'KQ3', TAICHINH_KH_MUAHANG_ID: 'KHM1', MASO: '68QTKD0105', HODEM: 'Lê Minh', TEN: 'Châu', NGAYMUA_DD_MM_YYYY_HHMMSS: '05/09/2026 15:44:10', TEN_KHOANTHU: 'Bảo hiểm y tế',
          TINHTRANGDANGKY_CODE_NAME: 'Đăng ký mua', LYDOKHONGMUA: '', MINHCHUNG: '', SOLUONG: 1, DONGIA: 884520, SOTIEN_PHAINOP: 884520, SOTIEN_DANOP: 0,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '05/09/2026 15:44:10', NGUOITAO_TAIKHOAN: '68QTKD0105' },
        { ID: 'KQ4', TAICHINH_KH_MUAHANG_ID: 'KHM3', MASO: '68HTTT0041', HODEM: 'Phạm Quốc', TEN: 'Dũng', NGAYMUA_DD_MM_YYYY_HHMMSS: '25/08/2026 09:00:00', TEN_KHOANTHU: 'Áo sơ mi đồng phục',
          TINHTRANGDANGKY_CODE_NAME: 'Đăng ký mua', LYDOKHONGMUA: '', MINHCHUNG: '', SOLUONG: 2, DONGIA: 185000, SOTIEN_PHAINOP: 370000, SOTIEN_DANOP: 370000,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '25/08/2026 09:00:00', NGUOITAO_TAIKHOAN: '68HTTT0041' },
        { ID: 'KQ5', TAICHINH_KH_MUAHANG_ID: 'KHM3', MASO: '68HTTT0041', HODEM: 'Phạm Quốc', TEN: 'Dũng', NGAYMUA_DD_MM_YYYY_HHMMSS: '25/08/2026 09:00:00', TEN_KHOANTHU: 'Bộ quần áo thể dục',
          TINHTRANGDANGKY_CODE_NAME: 'Không mua', LYDOKHONGMUA: 'Đã có từ năm trước', MINHCHUNG: '', SOLUONG: 0, DONGIA: 220000, SOTIEN_PHAINOP: 0, SOTIEN_DANOP: 0,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '25/08/2026 09:00:00', NGUOITAO_TAIKHOAN: '68HTTT0041' }
    ];

    var seq = 100;
    function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function theoKH(list, o) { return list.filter(function (r) { return r.TAICHINH_KH_MUAHANG_ID === o.strTaiChinh_KH_MuaHang_Id; }); }
    function xoa(list, id) { for (var i = list.length - 1; i >= 0; i--) if (list[i].ID === id) list.splice(i, 1); return []; }
    function hom() {
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    }
    function ganKH(r, o) {
        r.MA = o.strMa; r.TEN = o.strTen; r.MOTA = o.strMoTa; r.TUNGAY = o.strTuNgay; r.DENNGAY = o.strDenNgay;
        r.LOAIKEHOACH_ID = o.strLoaiKeHoach_Id; r.LOAIKEHOACH_TEN = ten(LOAI, o.strLoaiKeHoach_Id);
        r.TINHTRANG_ID = o.strTinhTrang_Id; r.TINHTRANG_TEN = ten(TT, o.strTinhTrang_Id);
        r.DAOTAO_THOIGIANDAOTAO_ID = o.strDAOTAO_ThoiGianDaoTao_Id;
        r.CHOPHEPSUASOLUONG = Number(o.dChoPhepSuaSoLuong); r.CHOPHEPHUYTRUOCTHANHTOAN = Number(o.dChoPhepHuyTruocThanhToan);
        r.YEUCAUTHANHTOANNGAY = Number(o.dYeuCauThanhToanNgay);
        return r;
    }
    function ganDG(r, o) {
        r.TAICHINH_KH_MUAHANG_ID = o.strTaiChinh_KH_MuaHang_Id; r.TAICHINH_CACKHOANTHU_ID = o.strTaiChinh_CacKhoanThu_Id;
        r.DONGIA = Number(o.dDonGia) || 0; r.PHANLOAIHANGHOA_ID = o.strPhanLoaiHangHoa_Id; r.PHANLOAIHANGHOA_TEN = ten(PL, o.strPhanLoaiHangHoa_Id);
        r.DONVITINH_ID = o.strDonViTinh_Id; r.TEN_DONVITINH = ten(DVT, o.strDonViTinh_Id);
        r.CHOPHEPKHONGMUA = Number(o.dChoPhepKhongMua); r.BATBUOC = Number(o.dBatBuoc); r.CONHAPSOLUONG = Number(o.dCoNhapSoLuong);
        r.SOLUONGTOITHIEU = o.dSoLuongToiThieu; r.SOLUONGTOIDA = o.dSoLuongToiDa; r.HIEULUC = Number(o.dHieuLuc); r.SAPXEP = o.dSapXep;
        return r;
    }

    var fx = {
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.KEHOACH.MUAHANG.LOAI': LOAI,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.KEHOACH.MUAHANG.TINHTRANG': TT,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.KEHOACH.MUAHANG.PHANLOAIHANGHOA': PL,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.KEHOACH.MUAHANG.DONVITINH': DVT,
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2026-2027' },
            { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2025-2026' },
            { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2025-2026' }
        ],
        'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }],
        'pkg_hosohocvien.LayDanhSachHoSo': function (o) {
            if (!o.strLopQuanLy_Id) return [];
            return [
                { ID: 'SVA1', MASO: '67KTPM0003', HODEM: 'Đỗ Thị', TEN: 'Hạnh' },
                { ID: 'SVA2', MASO: '67KTPM0018', HODEM: 'Vũ Đức', TEN: 'Long' },
                { ID: 'SVA3', MASO: '67KTPM0031', HODEM: 'Hoàng Thu', TEN: 'Trang' }
            ];
        }
    };
    fx[P + 'Pr_TC_KH_MuaHang_LayDS'] = function (o) {
        var q = norm(o.strTuKhoa);
        return KH.filter(function (r) {
            return (!o.strLoaiKeHoach_Id || r.LOAIKEHOACH_ID === o.strLoaiKeHoach_Id) &&
                (!o.strTinhTrang_Id || r.TINHTRANG_ID === o.strTinhTrang_Id) &&
                (!q || norm(r.MA + ' ' + r.TEN + ' ' + r.MOTA).indexOf(q) >= 0);
        });
    };
    fx[P + 'Pr_TC_KH_MuaHang_Get_By_Id'] = function (o) { return KH.filter(function (r) { return r.ID === o.strId; }); };
    fx[P + 'Pr_TC_KH_MuaHang_Them'] = function (o) {
        KH.unshift(ganKH({ ID: 'KHM' + (seq++), NGAYTAO_DD_MM_YYYY_HHMMSS: hom(), NGUOITAO_TAIKHOAN: 'admin' }, o));
        return [];
    };
    fx[P + 'Pr_TC_KH_MuaHang_Sua'] = function (o) { KH.forEach(function (r) { if (r.ID === o.strId) ganKH(r, o); }); return []; };
    fx[P + 'Pr_TC_KH_MuaHang_Xoa'] = function (o) { return xoa(KH, o.strId); };

    fx[P + 'Pr_TC_KH_MH_DG_LayDS'] = function (o) { return theoKH(DG, o); };
    fx[P + 'Pr_TC_KH_MH_DG_Get_By_Id'] = function (o) { return DG.filter(function (r) { return r.ID === o.strId; }); };
    fx[P + 'Pr_TC_KH_MH_DG_Them'] = function (o) {
        var r = ganDG({ ID: 'DG' + (seq++), NGAYTAO_DD_MM_YYYY_HHMMSS: hom(), NGUOITAO_TAIKHOAN: 'admin' }, o);
        r.TEN_KHOANTHU = 'Khoản thu ' + (o.strTaiChinh_CacKhoanThu_Id || '');
        DG.push(r);
        return [];
    };
    fx[P + 'Pr_TC_KH_MH_DG_Sua'] = function (o) { DG.forEach(function (r) { if (r.ID === o.strId) ganDG(r, o); }); return []; };
    fx[P + 'Pr_TC_KH_MH_DG_Xoa'] = function (o) { return xoa(DG, o.strId); };

    fx[P + 'Pr_TC_KH_MH_PV_LayDS'] = function (o) { return theoKH(PV, o); };
    fx[P + 'Pr_TC_KH_MH_PV_Them'] = function (o) {
        PV.push({ ID: 'PV' + (seq++), TAICHINH_KH_MUAHANG_ID: o.strTaiChinh_KH_MuaHang_Id, PHAMVIAPDUNG_ID: o.strPhamViApDung_Id,
            PHAMVIAPDUNG_TEN: 'Phạm vi ' + o.strPhamViApDung_Id, HIEULUC: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: hom(), NGUOITAO_TAIKHOAN: 'admin' });
        return [];
    };
    fx[P + 'Pr_TC_KH_MH_PV_Xoa'] = function (o) { return xoa(PV, o.strId); };

    fx[P + 'Pr_TC_KH_MH_KQ_LayDS'] = function (o) { return theoKH(KQ, o); };

    ums.demo.add(fx);
})();
