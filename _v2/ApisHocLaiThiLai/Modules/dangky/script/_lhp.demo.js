/* Dữ liệu mẫu cho _lhp.js (Lớp học phần — Học lại thi lại) — chỉ dùng ở chế độ dựng thử.
   Tên cột chép từ bản gốc (genTable_LopHocPhan / genTable_LopHocPhanChiTiet / genTable_DangKyHoc…). */
(function () {
    'use strict';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    function trang(rows, o) {
        var pi = Number(o.pageIndex) || 1, ps = Number(o.pageSize) || 10;
        return { rows: rows.slice((pi - 1) * ps, pi * ps), pager: rows.length };
    }
    function tuKhoa(rows, o, cot) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return !q ? rows : rows.filter(function (r) { return cot.some(function (c) { return String(r[c] || '').toLowerCase().indexOf(q) >= 0; }); });
    }

    var HP = [
        { ID: 'HLHP01', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng', TC: 3 },
        { ID: 'HLHP02', MA: 'IT3090', TEN: 'Cơ sở dữ liệu', TC: 3 },
        { ID: 'HLHP03', MA: 'MI1111', TEN: 'Giải tích I', TC: 4 }
    ];
    var LICH = ['Thứ 2 tiết 1-3, P.301-D3 (08/09–21/12/2025)', 'Thứ 4 tiết 7-9, P.205-D5 (08/09–21/12/2025)', 'Thứ 6 tiết 4-6, P.102-TC (15/09–28/12/2025)'];
    var LOP = [];
    for (var i = 0; i < 12; i++) {
        var hp = HP[i % 3];
        LOP.push({
            ID: 'HLLOP' + (10 + i), MALOP: hp.MA + '.HL' + (Math.floor(i / 3) + 1), TENLOP: hp.TEN + ' (học lại) - Nhóm ' + (Math.floor(i / 3) + 1),
            THOIGIANCHITIET: LICH[i % 3], SOSVDADANGKY: i === 11 ? 0 : 6 + i * 2, SOLUONGDUKIENHOC: 40,
            HOCPHITINHRIENG: i % 4 === 1 ? 1 : 0, DAOTAO_HOCPHAN_ID: hp.ID
        });
    }

    var HO = ['Nguyễn Văn', 'Trần Thị', 'Lê Minh', 'Phạm Quốc', 'Hoàng Thu', 'Vũ Đức', 'Đặng Ngọc', 'Bùi Thanh'];
    var TEN = ['An', 'Bình', 'Châu', 'Dũng', 'Hà', 'Khánh', 'Lan', 'Phong'];
    var CT = [['CT01', 'KTPM', 'Kỹ thuật phần mềm'], ['CT02', 'HTTT', 'Hệ thống thông tin'], ['CT03', 'KHMT', 'Khoa học máy tính']];
    var DK = [];
    for (var j = 0; j < 17; j++) {
        var h = HP[j % 3], c = CT[j % 3], lop = LOP[j % 12];
        DK.push({
            ID: 'HLDK' + (200 + j), QLSV_NGUOIHOC_ID: 'HLSV' + (300 + j), QLSV_NGUOIHOC_MASO: 'SV22' + (1040 + j),
            QLSV_NGUOIHOC_HODEM: HO[j % 8], QLSV_NGUOIHOC_TEN: TEN[(j * 3) % 8],
            DAOTAO_TOCHUCCHUONGTRINH_ID: c[0], DAOTAO_TOCHUCCHUONGTRINH_MA: c[1], DAOTAO_TOCHUCCHUONGTRINH_TEN: c[2],
            DAOTAO_KHOADAOTAO_TEN: j % 2 ? 'Khóa 66' : 'Khóa 67', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin',
            LOPRIENG: lop.HOCPHITINHRIENG ? 'Lớp riêng' : 'Lớp thường',
            DANGKY_LOPHOCPHAN_ID: lop.ID, DANGKY_LOPHOCPHAN_MA: lop.MALOP, DANGKY_LOPHOCPHAN_TEN: lop.TENLOP,
            DAOTAO_HOCPHAN_ID: h.ID, DAOTAO_HOCPHAN_MA: h.MA, DAOTAO_HOCPHAN_TEN: h.TEN, SOTINCHI: h.TC,
            KIEUHOC_TEN: j % 4 === 0 ? 'Thi lại' : 'Học lại', NGAYTAO_DD_MM_YYYY_HHMMSS: (10 + (j % 15)) + '/09/2025 0' + (8 + j % 2) + ':1' + (j % 6) + ':22',
            NGUOITAO_TAIKHOAN: j % 3 ? 'sv22' + (1040 + j) : 'cb.daotao',
            DAOTAO_CHUONGTRINHDK_TEN: c[2], DAOTAO_CHUONGTRINHDK_MA: c[1]
        });
    }

    /* Sinh viên của một lớp (DKH_PhanCong_LopHP/LayDSDangKyHoc) — hộp số SV + khung Dồn lớp */
    function svLop(idLop) {
        var n = idLop === 'HLLOP21' ? 0 : 3 + (String(idLop).length + Number(String(idLop).slice(-1)) || 0) % 4;
        var rows = [];
        for (var k = 0; k < n; k++) {
            var c = CT[k % 3];
            rows.push({
                ID: idLop + '-SV' + k, QLSV_NGUOIHOC_ID: 'HLSV' + (400 + k), QLSV_NGUOIHOC_MASO: 'SV22' + (2100 + k + Number(String(idLop).slice(-2)) * 7),
                QLSV_NGUOIHOC_HODEM: HO[(k + 2) % 8], QLSV_NGUOIHOC_TEN: TEN[(k * 5) % 8], QLSV_NGUOIHOC_NGAYSINH: (k + 3) + '/0' + (k % 9 + 1) + '/2004',
                QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: c[1] + '0' + (k % 2 + 1) + '-K67',
                DAOTAO_CHUONGTRINH_TEN: c[2], DAOTAO_TOCHUCCHUONGTRINH_ID: c[0], DAOTAO_TOCHUCCHUONGTRINH_TEN: c[2],
                DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy',
                NGAYTAO_DD_MM_YYYY_HHMMSS: '1' + k + '/09/2025 09:0' + k + ':15', SOLUONGDUKIENHOC: 40,
                DAOTAO_HOCPHAN_ID: 'HLHP01', DANGKY_LOPHOCPHAN_ID: idLop, DANGKY_KEHOACHDANGKY_ID: 'HLKH1'
            });
        }
        return rows;
    }

    ums.demo.add({
        'DKH_Chung/LayThoiGianDangKyHoc': [{ ID: 'HLTG1', DAOTAO_THOIGIANDAOTAO: '2025_2026_1' }, { ID: 'HLTG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Toán - Tin' }],
        'DKH_PhanCong_LopHP/LayDSKhoaToChuc': [{ ID: 'K66', TENKHOA: 'Khóa 66' }, { ID: 'K67', TENKHOA: 'Khóa 67' }],
        'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc': CT.map(function (c) { return { ID: c[0], TENCHUONGTRINH: c[2] }; }),
        'DKH_PhanCong_LopHP/LayDSHocPhan': HP.map(function (h) { return { ID: h.ID, MA: h.MA, TEN: h.TEN }; }),
        'DKH_ThongTin/LayDSDangKy_KeHoachDangKy': [{ ID: 'HLKH1', TENKEHOACH: 'Đăng ký học lại, thi lại học kỳ 1 năm 2025–2026' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.TRANGTHAI': [dm('TT1', 'DH', 'Đang học'), dm('TT2', 'BL', 'Bảo lưu'), dm('TT3', 'NH', 'Nghỉ học tạm thời')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHDT.DIEM.KIEUHOC': [dm('KH1', 'HL', 'Học lại', 'Kiểu học'), dm('KH2', 'TL', 'Thi lại', 'Kiểu học'), dm('KH3', 'CT', 'Học cải thiện', 'Kiểu học')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.DANHGIA': [dm('DG1', 'DAT', 'Đạt', 'Đánh giá'), dm('DG2', 'KDAT', 'Không đạt', 'Đánh giá')],
        'DKH_ThongTin2/LayDSDangKyHocKetQuaHocTap': function (o) { return trang(tuKhoa(LOP, o, ['MALOP', 'TENLOP']), o); },
        'DKH_ThongTin2/LayDSDangKyHoc': function (o) { return trang(tuKhoa(DK, o, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_TEN', 'DANGKY_LOPHOCPHAN_MA']), o); },
        'DKH_PhanCong_LopHP/LayDanhSach': [
            { ID: 'HLPV1', PHAMVIAPDUNG_TEN: 'Kỹ thuật phần mềm - Khóa 67', PHANCAPAPDUNG_TEN: 'Chương trình' },
            { ID: 'HLPV2', PHAMVIAPDUNG_TEN: 'KTPM01-K67', PHANCAPAPDUNG_TEN: 'Lớp quản lý' }
        ],
        'DKH_PhanCong_LopHP/LayDSDangKyHoc': function (o) { return svLop(o.strDaoTao_LopHocPhan_Id || ''); },
        'DKH_PhanCong_LopHP/ThietDatThuocTinhLopRieng': { rows: [], message: '' },
        'HLTL_ThongTin/LapDSNguoiHocHocLaiThiLai': { rows: [], message: '' },
        'DKH_DangKy/ThucHienDonLopDangKyHoc': { rows: [], message: '' },
        'DKH_DangKy/ThucHienHuyDangKyHocHocPhan': { rows: [], message: '' }
    });
})();
