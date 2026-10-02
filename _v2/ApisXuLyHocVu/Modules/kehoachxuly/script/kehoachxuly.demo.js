/* Dữ liệu mẫu cho kehoachxuly (Kế hoạch xử lý học vụ) — chỉ dùng ở chế độ dựng thử.
   Mã sinh viên / người dùng là mã bịa, không lấy từ dữ liệu thật. */
(function () {
    function boDau(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function like(rows, q, cols) {
        q = boDau(q).trim();
        if (!q) return rows.slice();
        return rows.filter(function (r) { return cols.some(function (c) { return boDau(r[c]).indexOf(q) >= 0; }); });
    }
    function trang(rows, o) {
        var p = Number(o.pageIndex) || 1, s = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((p - 1) * s, p * s), pager: rows.length };
    }

    var TG = [
        { ID: 'TG251', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - Năm học 2025-2026' },
        { ID: 'TG252', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - Năm học 2025-2026' },
        { ID: 'TG242', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - Năm học 2024-2025' }
    ];
    var LOAI = [
        { ID: 'LXL1', MA: 'CANHBAO', TEN: 'Cảnh báo học vụ' },
        { ID: 'LXL2', MA: 'BUOCTHOIHOC', TEN: 'Buộc thôi học' },
        { ID: 'LXL3', MA: 'HOCBONG', TEN: 'Xét học bổng' }
    ];
    var KH = [
        { ID: 'KHXL01', MA: 'CBHV-HK1-2526', TEN: 'Cảnh báo học vụ học kỳ 1 năm 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG251', DAOTAO_THOIGIANDAOTAO_KY: '1/2025-2026',
          LOAIXULY_ID: 'LXL1', LOAIXULY_TEN: 'Cảnh báo học vụ', TUNGAY: '05/02/2026', DENNGAY: '28/02/2026', KETQUACHINHTHUC: 1, SOLUONG: 5 },
        { ID: 'KHXL02', MA: 'BTH-HK2-2425', TEN: 'Xét buộc thôi học học kỳ 2 năm 2024-2025', DAOTAO_THOIGIANDAOTAO_ID: 'TG242', DAOTAO_THOIGIANDAOTAO_KY: '2/2024-2025',
          LOAIXULY_ID: 'LXL2', LOAIXULY_TEN: 'Buộc thôi học', TUNGAY: '10/08/2025', DENNGAY: '30/08/2025', KETQUACHINHTHUC: 1, SOLUONG: 2 },
        { ID: 'KHXL03', MA: 'CBHV-THU-2526', TEN: 'Cảnh báo thử (không dùng làm kết quả chính)', DAOTAO_THOIGIANDAOTAO_ID: 'TG251', DAOTAO_THOIGIANDAOTAO_KY: '1/2025-2026',
          LOAIXULY_ID: 'LXL1', LOAIXULY_TEN: 'Cảnh báo học vụ', TUNGAY: '01/02/2026', DENNGAY: '03/02/2026', KETQUACHINHTHUC: 0, SOLUONG: 0 }
    ];

    var SV = [
        ['NH01', 'SV24001', 'Nguyễn Văn', 'An', 'K24-CNTT1', 'L01', 'Công nghệ thông tin', 'CT01', 'Khóa 2024'],
        ['NH02', 'SV24017', 'Trần Thị', 'Bình', 'K24-CNTT1', 'L01', 'Công nghệ thông tin', 'CT01', 'Khóa 2024'],
        ['NH03', 'SV23045', 'Lê Hoàng', 'Cường', 'K23-QTKD2', 'L02', 'Quản trị kinh doanh', 'CT02', 'Khóa 2023'],
        ['NH04', 'SV23058', 'Phạm Minh', 'Đức', 'K23-QTKD2', 'L02', 'Quản trị kinh doanh', 'CT02', 'Khóa 2023'],
        ['NH05', 'SV22110', 'Vũ Ngọc', 'Hà', 'K22-KT1', 'L03', 'Kế toán', 'CT03', 'Khóa 2022']
    ].map(function (x) {
        return { QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            QLSV_NGUOIHOC_NGAYSINH: '12/05/2004', DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_LOPQUANLY_ID: x[5],
            DAOTAO_CHUONGTRINH_TEN: x[6], DAOTAO_TOCHUCCHUONGTRINH_ID: x[7], DAOTAO_KHOADAOTAO_TEN: x[8],
            QLSV_TRANGTHAINGUOIHOC_ID: 'TT1', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', ANH: '' };
    });
    function svCua(kh, tien) {
        return SV.map(function (s, i) {
            var r = { ID: tien + kh + '_' + i, XLHV_KEHOACHXULY_ID: kh, DAOTAO_THOIGIANDAOTAO_ID: 'TG251', LOAIXULY_ID: 'LXL1' };
            Object.keys(s).forEach(function (k) { r[k] = s[k]; });
            return r;
        });
    }
    var MUC = ['Cảnh báo mức 1', 'Cảnh báo mức 2', 'Không bị xử lý', 'Cảnh báo mức 1', 'Cảnh báo mức 3'];

    var DK1 = [
        { ID: 'DK1', LOAIXULY_TEN: 'Cảnh báo học vụ', MUCXULY_TEN: 'Cảnh báo mức 1', DAOTAO_THOIGIANDAOTAO_KY: '1/2025-2026', XAUDIEUKIEN: 'DTBHK < 1.0 OR DTBTL < 1.2' },
        { ID: 'DK2', LOAIXULY_TEN: 'Cảnh báo học vụ', MUCXULY_TEN: 'Cảnh báo mức 2', DAOTAO_THOIGIANDAOTAO_KY: '1/2025-2026', XAUDIEUKIEN: 'CANHBAO_KYTRUOC = 1 AND DTBHK < 1.0' },
        { ID: 'DK3', LOAIXULY_TEN: 'Cảnh báo học vụ', MUCXULY_TEN: 'Cảnh báo mức 3', DAOTAO_THOIGIANDAOTAO_KY: '1/2025-2026', XAUDIEUKIEN: 'CANHBAO_KYTRUOC = 2 AND DTBHK < 1.0' }
    ];
    var DK2 = [
        { ID: 'DKP1', LOAIXULY_TEN: 'Cảnh báo học vụ', MUCXULY_TEN: 'Cảnh báo tại kỳ đang xét', DAOTAO_THOIGIANDAOTAO_KY: '1/2025-2026', XAUDIEUKIEN: 'SOTCNO > 24' }
    ];
    var ND = [
        { ID: 'ND01', TAIKHOAN: 'hoang.lm', TENDAYDU: 'Hoàng Lê Minh', GIOITINH_TEN: 'Nam', HINHDAIDIEN: '' },
        { ID: 'ND02', TAIKHOAN: 'thu.nt', TENDAYDU: 'Nguyễn Thị Thu', GIOITINH_TEN: 'Nữ', HINHDAIDIEN: '' },
        { ID: 'ND03', TAIKHOAN: 'quang.pv', TENDAYDU: 'Phạm Văn Quang', GIOITINH_TEN: 'Nam', HINHDAIDIEN: '' }
    ];
    var PC = [
        { ID: 'PC01', NGUOIDUNG_TAIKHOAN: 'hoang.lm', NGUOIDUNG_TENDAYDU: 'Hoàng Lê Minh', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Đào tạo' },
        { ID: 'PC02', NGUOIDUNG_TAIKHOAN: 'thu.nt', NGUOIDUNG_TENDAYDU: 'Nguyễn Thị Thu', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Công tác sinh viên' }
    ];

    var P = 'pkg_xulyhocvu_thongtin.';
    var fx = {};
    fx['pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao'] = TG;
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#XLHV.LOAIXULY'] = LOAI;
    fx['XLHV_KeHoachXuLy/LayDanhSach'] = function (o) {
        var r = like(KH, o.strTuKhoa, ['MA', 'TEN']);
        if (o.strDaoTao_ThoiGianDaoTao_Id) r = r.filter(function (x) { return x.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id; });
        return trang(r, o);
    };
    fx[P + 'Them_XLHV_KeHoachXuLy'] = { rows: [], raw: { Id: 'KHXL_MOI' } };
    fx[P + 'Sua_XLHV_KeHoachXuLy'] = [];
    fx['XLHV_KeHoachXuLy/Xoa'] = [];

    fx[P + 'LayDSXLHV_KeHoach_NhanSu'] = function (o) { return o.strXLHV_KeHoach_Id === 'KHXL01' ? trang(PC, o) : { rows: [], pager: 0 }; };
    fx[P + 'Them_XLHV_KeHoach_NhanSu'] = [];
    fx[P + 'Xoa_XLHV_KeHoach_NhanSu'] = [];
    fx['pkg_chung_quanlynguoidung.LayDanhSachNguoiDung'] = function (o) { return trang(like(ND, o.strTuKhoa, ['TAIKHOAN', 'TENDAYDU']), o); };

    fx['XLHV_DanhSachKhongXuLy/LayDanhSach'] = function (o) {
        return o.strXLHV_KeHoachXuLy_Id === 'KHXL_MOI' ? [] : svCua(o.strXLHV_KeHoachXuLy_Id, 'DS').slice(0, 4);
    };
    fx['XLHV_ThongTin/Them_XLHV_DSKhongXuLy_PhamVi'] = [];
    fx['XLHV_DanhSachKhongXuLy/Xoa'] = [];
    fx['PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc'] = function (o) {
        var r = like(SV.map(function (s) { var x = { ID: 'R' + s.QLSV_NGUOIHOC_ID }; Object.keys(s).forEach(function (k) { x[k] = s[k]; }); return x; }),
            o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HODEM', 'QLSV_NGUOIHOC_TEN']);
        return trang(r, o);
    };

    fx['XLHV_DieuKienXuLy_AD/LayDanhSach'] = function () { return DK1; };
    fx['XLHV_DieuKienXuLy_AD/LayDSXLHV_DieuKienXuLy_Phu_AD'] = function () { return DK2; };
    fx['XLHV_DieuKienXuLy_AD/Sua_XLHV_DieuKienXuLy_DK_AD'] = [];
    fx['XLHV_DieuKienXuLy_AD/Sua_XLHV_DieuKienXL_Phu_DK_AD'] = [];
    fx['XLHV_DieuKienXuLy_AD/Xoa'] = [];
    fx['XLHV_DieuKienXuLy_AD/Xoa_XLHV_DieuKienXuLy_Phu_AD'] = [];
    fx['XLHV_ThongTin/KeThuaDieuKienChuanApDung'] = [];
    fx[P + 'LayDSXLHV_PhamVi_ApDung'] = [
        { ID: 'PV01', TEN: 'Đại học chính quy - Khóa 2023', MOTA: 'Điều kiện cảnh báo dùng cho khóa 2023' },
        { ID: 'PV02', TEN: 'Đại học chính quy - Khóa 2024', MOTA: 'Điều kiện cảnh báo dùng cho khóa 2024' }
    ];
    fx[P + 'KeThua_DieuKienXuLy_Ad'] = [];

    fx['XLHV_KetQuaXuLy/LayDanhSach'] = function (o) {
        var r = svCua(o.strXLHV_KeHoachXuLy_Id, 'KQ');
        r.forEach(function (x, i) { x.MUCXULY_TEN = MUC[i]; });
        return { rsThongTinNguoiHoc: r };
    };
    fx['XLHV_KetQuaXuLy/Xoa'] = [];
    fx['XLHV_TinhToan/XuLyHocVuNguoiHoc'] = [];
    fx[P + 'LayDSXLHV_DanhSachKhongXuLy'] = function (o) {
        return like(svCua(o.strXLHV_KeHoachXuLy_Id, 'XET'), o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HODEM', 'QLSV_NGUOIHOC_TEN']);
    };

    ums.demo.add(fx);
})();
