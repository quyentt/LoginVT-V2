/* Dữ liệu mẫu cho lophocphan — chỉ dùng ở chế độ dựng thử. Tên cột chép từ bản gốc. */
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
        { ID: 'HP01', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng', TC: 3 },
        { ID: 'HP02', MA: 'IT3090', TEN: 'Cơ sở dữ liệu', TC: 3 },
        { ID: 'HP03', MA: 'MI1111', TEN: 'Giải tích I', TC: 4 },
        { ID: 'HP04', MA: 'EM1010', TEN: 'Quản trị học đại cương', TC: 2 }
    ];
    var GV = [['GV0012', 'ThS.', 'Nguyễn Thị Thu Hà'], ['GV0045', 'TS.', 'Trần Minh Đức'], ['GV0107', 'PGS.TS.', 'Lê Văn Hùng'], ['', '', '']];
    var LICH = [
        'Từ 08/09 đến 21/12:<br>Thứ 2 tiết 1,2,3 — P.301-D3',
        'Từ 08/09 đến 21/12:<br>Thứ 4 tiết 7,8,9 — P.205-D5',
        'Từ 15/09 đến 28/12:<br>Thứ 6 tiết 4,5,6 — P.102-TC',
        ''
    ];
    var LOP = [];
    for (var i = 0; i < 14; i++) {
        var hp = HP[i % 4], g = GV[i % 4], rieng = i % 5 === 3;
        LOP.push({
            ID: 'LHP' + (100 + i), MALOP: hp.MA + '.' + (i < 4 ? 1 : i < 8 ? 2 : i < 12 ? 3 : 4) + (rieng ? 'R' : ''),
            TENLOP: hp.TEN + ' - Nhóm ' + (Math.floor(i / 4) + 1), LOAILOP: rieng ? 'Lớp riêng' : 'Lớp thường',
            SOTINCHI: hp.TC, THONGTINPHANBO: i % 3 === 0 ? '2-1-0' : '3-0-0', MAGV: g[0], CHUCDANH: g[1], TENGV: g[2],
            CHUONGTRINHMOLOP: i % 2 ? 'Kỹ thuật phần mềm' : 'Công nghệ thông tin', PHIPHAINOP: hp.TC * 520000 * (20 + i),
            PHIDANOP: hp.TC * 520000 * (12 + i), THOIGIANCHITIET: LICH[i % 4],
            HINHTHUCHOC_TEN: i % 3 === 2 ? 'Trực tuyến' : 'Trực tiếp', HINHTHUCHOC_MA: i % 3 === 2 ? 'TT' : 'TR',
            SOSVDADANGKY: i === 13 ? 0 : 18 + i * 3, SOLUONGDUKIENHOC: 60, HOCPHITINHRIENG: rieng ? 1 : 0,
            KHONGTINHPHI: i === 6 ? 1 : 0, KHONGTOCHUCTHI: i === 9 ? 1 : 0,
            PHANLOAICACHTINH_TEN: i % 4 === 1 ? 'Lớp ghép' : '', CHEDOTINHPHI_TEN: i % 5 === 0 ? 'Tính theo tín chỉ học phí' : '',
            CHEDOTINHPHI_ID: i % 5 === 0 ? 'CDP' + i : '', DAOTAO_HOCPHAN_ID: hp.ID
        });
    }

    var HO = ['Nguyễn Văn', 'Trần Thị', 'Lê Hoàng', 'Phạm Minh', 'Hoàng Thị', 'Vũ Đức', 'Đặng Thu', 'Bùi Quang'];
    var TEN = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hải', 'Hương', 'Khánh'];
    var SV = [];
    for (var k = 0; k < 16; k++) {
        var h = HP[k % 4], l = LOP[k % 8];
        SV.push({
            ID: 'DK' + (500 + k), QLSV_NGUOIHOC_ID: 'SV' + (1000 + k), QLSV_NGUOIHOC_MASO: 'BIT2' + (20100 + k * 7),
            QLSV_NGUOIHOC_HODEM: HO[k % 8], QLSV_NGUOIHOC_TEN: TEN[(k * 3) % 8], QLSV_NGUOIHOC_NGAYSINH: (10 + k % 18) + '/0' + (1 + k % 9) + '/2004',
            DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT0' + (k % 2 + 1), DAOTAO_TOCHUCCHUONGTRINH_TEN: k % 2 ? 'Kỹ thuật phần mềm' : 'Công nghệ thông tin',
            DAOTAO_TOCHUCCHUONGTRINH_MA: k % 2 ? 'KTPM' : 'CNTT', DAOTAO_CHUONGTRINH_TEN: k % 2 ? 'Kỹ thuật phần mềm' : 'Công nghệ thông tin',
            DAOTAO_KHOADAOTAO_TEN: 'Khóa ' + (66 + k % 2), DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin',
            DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_LOPQUANLY_TEN: 'CNTT' + (66 + k % 2) + '.0' + (1 + k % 3),
            QLSV_TRANGTHAINGUOIHOC_TEN: k === 5 ? 'Bảo lưu' : 'Đang học',
            LOPRIENG: l.LOAILOP, DANGKY_LOPHOCPHAN_ID: l.ID, DANGKY_LOPHOCPHAN_MA: l.MALOP, DANGKY_LOPHOCPHAN_TEN: l.TENLOP,
            DAOTAO_HOCPHAN_ID: h.ID, DAOTAO_HOCPHAN_TEN: h.TEN, DAOTAO_HOCPHAN_MA: h.MA, TENHINHTHUCHOC: 'Trực tiếp', SOTINCHI: h.TC,
            KIEUHOC_ID: k % 4 === 3 ? 'KH2' : 'KH1', KIEUHOC_TEN: k % 4 === 3 ? 'Học lại' : 'Học lần đầu',
            NGAYTAO_DD_MM_YYYY_HHMMSS: (1 + k % 9) + '/08/2025 0' + (8 + k % 2) + ':1' + (k % 6) + ':05', NGUOITAO_TAIKHOAN: k % 3 ? 'sv.' + (20100 + k * 7) : 'canbo.dkh',
            DAOTAO_CHUONGTRINHDK_TEN: k % 2 ? 'Kỹ thuật phần mềm' : 'Công nghệ thông tin', DAOTAO_CHUONGTRINHDK_MA: k % 2 ? 'KTPM' : 'CNTT',
            SOTIEN: h.TC * 520000, SOTIEN1: h.TC * 520000, SOTIEN2: 0, SOTIENDANOP: k % 3 === 0 ? 0 : h.TC * 520000,
            TONGSOTIENDANOP: k % 3 === 0 ? 0 : h.TC * 520000, TONGNO: k % 3 === 0 ? h.TC * 520000 : 0, TONGDU: 0,
            TAICHINH_CACKHOANTHU_ID: 'KT01', TAICHINH_CACKHOANTHU_TEN: 'Học phí tín chỉ', DACHUYENKETOAN: k % 4 === 1 ? 1 : 0,
            HANHDONG_XACNHAN_TEN: k % 5 === 2 ? 'Đồng ý' : '', DANGKY_KEHOACHDANGKY_ID: 'KH01', DAOTAO_THOIGIANDAOTAO_ID: 'TG251',
            CHEDOTINHPHI_TEN: k % 6 === 0 ? 'Miễn học phí' : '', SOLUONGDUKIENHOC: 60,
            NGUOIRUT_TAIKHOAN: 'canbo.dkh', NGAYRUT_DD_MM_YYYY_HHMMSS: (10 + k % 9) + '/09/2025 14:2' + (k % 6) + ':00', PHANTRAMPHITINH: k % 2 ? 50 : 100
        });
    }

    ums.demo.add({
        'DKH_Chung/LayThoiGianDangKyHoc': [
            { ID: 'TG251', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2025-2026' },
            { ID: 'TG243', DAOTAO_THOIGIANDAOTAO: 'Học kỳ hè năm học 2024-2025' },
            { ID: 'TG242', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2024-2025' }
        ],
        'DKH_PhanCong_LopHP/LayDSKhoaToChuc': [{ ID: 'K66', TENKHOA: 'Khóa 66' }, { ID: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', TENKHOA: 'Khóa 68' }],
        'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc': [{ ID: 'CT01', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'CT02', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }],
        'DKH_PhanCong_LopHP/LayDSHocPhan': HP.map(function (h) { return { ID: h.ID, TEN: h.TEN, MA: h.MA }; }),
        'DKH_ThongTin/LayDSDangKy_KeHoachDangKy': [
            { ID: 'KH01', TENKEHOACH: 'Đăng ký học HK1 2025-2026 — đợt chính' },
            { ID: 'KH02', TENKEHOACH: 'Đăng ký học HK1 2025-2026 — đợt bổ sung' }
        ],
        'pkg_dangkyhoc_chung.LayDSHinhThucHoc': [
            { ID: 'HT1', TENHINHTHUCHOC: 'Trực tiếp', MAHINHTHUCHOC: 'TR' }, { ID: 'HT2', TENHINHTHUCHOC: 'Trực tuyến', MAHINHTHUCHOC: 'TT' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHDT.DIEM.KIEUHOC': [dm('KH1', 'LD', 'Học lần đầu', 'Kiểu học'), dm('KH2', 'HL', 'Học lại', 'Kiểu học'), dm('KH3', 'CT', 'Học cải thiện', 'Kiểu học')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.XACNHAN.KETQUA': [dm('XN1', 'DY', 'Đồng ý', 'Hành động xác nhận'), dm('XN2', 'KDY', 'Không đồng ý', 'Hành động xác nhận')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.NGUOIHOC.CHEDOTINHPHI': [dm('CD1', 'TC', 'Tính theo tín chỉ học phí'), dm('CD2', 'MIEN', 'Miễn học phí'), dm('CD3', 'GIAM50', 'Giảm 50% học phí')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KLGD.LOPHOCPHAN.PHANLOAI': [dm('PL1', 'GHEP', 'Lớp ghép'), dm('PL2', 'CLC', 'Lớp chất lượng cao'), dm('PL3', 'TA', 'Lớp dạy bằng tiếng Anh')],

        'pkg_dangkyhoc_baocao.LayDSLopHocPhanPhanTrang': function (o) { return trang(tuKhoa(LOP, o, ['MALOP', 'TENLOP', 'TENGV']), o); },
        'pkg_dangkyhoc_thongtin2.LayDSDangKyHoc': function (o) { return trang(tuKhoa(SV, o, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_TEN']), o); },
        'PKG_DANGKYHOC_THONGTIN2.LayDSDangKyHocDoCanBo': function (o) {
            return trang(SV.filter(function (r) { return r.NGUOITAO_TAIKHOAN === 'canbo.dkh'; }), o);
        },
        'pkg_dangkyhoc_thongtin2.LayDSRutDangKyHoc': function (o) { return trang(SV.slice(10), o); },

        'DKH_PhanCong_LopHP/LayDanhSach': [
            { ID: 'PV1', PHAMVIAPDUNG_TEN: 'Khóa 66 - Công nghệ thông tin', PHANCAPAPDUNG_TEN: 'Chương trình' },
            { ID: 'PV2', PHAMVIAPDUNG_TEN: 'CNTT66.02', PHANCAPAPDUNG_TEN: 'Lớp quản lý' }
        ],
        'DKH_PhanCong_LopHP/LayDSDangKyHoc': function (o) {
            var id = o.strDaoTao_LopHocPhan_Id, n = (parseInt(String(id).replace(/\D/g, ''), 10) || 0) % 5;
            return SV.slice(n, n + 7).map(function (r, i) {
                var x = {}; Object.keys(r).forEach(function (c) { x[c] = r[c]; });
                x.ID = r.ID + '-' + id; x.DANGKY_LOPHOCPHAN_ID = id; x.QLSV_NGUOIHOC_ID = r.QLSV_NGUOIHOC_ID;
                x.DAOTAO_HOCPHAN_ID = 'HP0' + (1 + (parseInt(String(id).replace(/\D/g, ''), 10) || 0) % 4);
                x.CHEDOTINHPHI_TEN = i === 1 ? 'Miễn học phí' : '';
                return x;
            });
        },
        'DKH_BaoCao/LayDSKhongDangKy': SV.slice(0, 13).map(function (r, i) {
            return { QLSV_NGUOIHOC_MASO: r.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: r.QLSV_NGUOIHOC_HODEM, QLSV_NGUOIHOC_TEN: r.QLSV_NGUOIHOC_TEN,
                QLSV_TRANGTHAI_TEN: i === 4 ? 'Bảo lưu' : 'Đang học', TONGNOPHI: i % 3 ? 0 : 3120000,
                DAOTAO_TOCHUCCHUONGTRINH_TEN: r.DAOTAO_TOCHUCCHUONGTRINH_TEN, DAOTAO_LOPQUANLY_TEN: r.DAOTAO_LOPQUANLY_TEN,
                DAOTAO_KHOADAOTAO_TEN: r.DAOTAO_KHOADAOTAO_TEN };
        }),
        'DKH_ThongTin2/LayThongTinChuanBiDonLop': {
            rows: {
                rsLopBanDau: [
                    { ID: 'LHP100', TENLOP: 'Lập trình hướng đối tượng - Nhóm 1', HINHTHUC_TEN: 'Lý thuyết', IDHINHTHUCHOC: 'LT' },
                    { ID: 'LHP100TH', TENLOP: 'Lập trình hướng đối tượng - Nhóm 1 (thực hành)', HINHTHUC_TEN: 'Thực hành', IDHINHTHUCHOC: 'TH' }
                ],
                rsLopMoi: [{ ID: 'LHP104', TENLOP: 'Lập trình hướng đối tượng - Nhóm 2' }, { ID: 'LHP108', TENLOP: 'Lập trình hướng đối tượng - Nhóm 3' }]
            }
        },
        'DKH_ThongTin2/LayDSLopMoiTheo': function (o) {
            return o.strIdHinhThucHoc === 'TH'
                ? [{ ID: o.strDangKy_LopHocPhan_Moi_Id + 'TH', TENLOP: 'Nhóm thực hành của lớp đã chọn' }]
                : [{ ID: o.strDangKy_LopHocPhan_Moi_Id, TENLOP: 'Lớp lý thuyết đã chọn' }];
        },
        'DKH_ThongTin2/LayDSDuLieuDonLop': SV.slice(0, 3).map(function (r) {
            return { QLSV_NGUOIHOC_MASO: r.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: r.QLSV_NGUOIHOC_HODEM, QLSV_NGUOIHOC_TEN: r.QLSV_NGUOIHOC_TEN, DAOTAO_CHUONGTRINH_TEN: r.DAOTAO_CHUONGTRINH_TEN };
        })
    });
})();
