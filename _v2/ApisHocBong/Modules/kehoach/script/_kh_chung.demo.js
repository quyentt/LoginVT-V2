/* Dữ liệu mẫu chung cho ba màn Kế hoạch xét học bổng / Thực hiện xét / Xác nhận kết quả
   (_kh_chung.js — ums.hbKh). Chỉ dùng ở chế độ dựng thử. Mã sinh viên / cán bộ là mã bịa. */
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
    var QUY = [
        { ID: 'QHB1', MA: 'KKHT', TEN: 'Quỹ học bổng khuyến khích học tập' },
        { ID: 'QHB2', MA: 'TAITRO', TEN: 'Quỹ học bổng tài trợ doanh nghiệp' },
        { ID: 'QHB3', MA: 'VUOTKHO', TEN: 'Quỹ học bổng vượt khó' }
    ];
    var KH = [
        { ID: 'HBKH01', MA: 'HB-KKHT-2526-1', TEN: 'Xét học bổng khuyến khích học tập học kỳ 1 năm 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG251',
          DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - Năm học 2025-2026', HB_QUYHOCBONG_ID: 'QHB1', NGAYBATDAU: '05/02/2026', NGAYKETTHUC: '28/02/2026',
          PHANLOAI_TEN: 'Khuyến khích học tập', DIEUKIENXET: 'Điểm TB học kỳ ≥ 3,2; rèn luyện ≥ 80', KETQUACHINHTHUC: 1 },
        { ID: 'HBKH02', MA: 'HB-TT-2526-1', TEN: 'Học bổng tài trợ doanh nghiệp học kỳ 1 năm 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG251',
          DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - Năm học 2025-2026', HB_QUYHOCBONG_ID: 'QHB2', NGAYBATDAU: '10/02/2026', NGAYKETTHUC: '15/03/2026',
          PHANLOAI_TEN: 'Tài trợ', DIEUKIENXET: 'Điểm TB tích luỹ ≥ 3,0', KETQUACHINHTHUC: 0 },
        { ID: 'HBKH03', MA: 'HB-VK-2425-2', TEN: 'Học bổng vượt khó học kỳ 2 năm 2024-2025', DAOTAO_THOIGIANDAOTAO_ID: 'TG242',
          DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - Năm học 2024-2025', HB_QUYHOCBONG_ID: 'QHB3', NGAYBATDAU: '01/08/2025', NGAYKETTHUC: '31/08/2025',
          PHANLOAI_TEN: 'Vượt khó', DIEUKIENXET: 'Hoàn cảnh khó khăn, điểm TB ≥ 2,5', KETQUACHINHTHUC: 0 }
    ];
    var NS = {
        HBKH01: [['PC1', 'ND01', 'cb.lan', 'Nguyễn Thị Lan'], ['PC2', 'ND02', 'cb.minh', 'Trần Quang Minh']],
        HBKH02: [['PC3', 'ND03', 'cb.hoa', 'Lê Thu Hoà']],
        HBKH03: []
    };
    var SV = [
        ['NH01', 'SV24001', 'Nguyễn Văn', 'An', 'K24-CNTT1', 'L01', 'Công nghệ thông tin', 'CT01', 'Khóa 2024', 'Xuất sắc', 'Giỏi'],
        ['NH02', 'SV24017', 'Trần Thị', 'Bình', 'K24-CNTT1', 'L01', 'Công nghệ thông tin', 'CT01', 'Khóa 2024', 'Giỏi', ''],
        ['NH03', 'SV23045', 'Lê Hoàng', 'Cường', 'K23-QTKD2', 'L02', 'Quản trị kinh doanh', 'CT02', 'Khóa 2023', 'Giỏi', ''],
        ['NH04', 'SV23058', 'Phạm Minh', 'Đức', 'K23-QTKD2', 'L02', 'Quản trị kinh doanh', 'CT02', 'Khóa 2023', 'Khá', ''],
        ['NH05', 'SV22110', 'Vũ Ngọc', 'Hà', 'K22-KT1', 'L03', 'Kế toán', 'CT03', 'Khóa 2022', 'Xuất sắc', 'Giỏi'],
        ['NH06', 'SV22131', 'Đỗ Thanh', 'Hương', 'K22-KT1', 'L03', 'Kế toán', 'CT03', 'Khóa 2022', 'Khá', '']
    ].map(function (x) {
        return { QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            QLSV_NGUOIHOC_HOTEN: x[2] + ' ' + x[3], QLSV_NGUOIHOC_NGAYSINH: '12/05/2004',
            DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_LOPQUANLY_ID: x[5], DAOTAO_CHUONGTRINH_TEN: x[6], DAOTAO_TOCHUCCHUONGTRINH_ID: x[7],
            DAOTAO_KHOADAOTAO_TEN: x[8], DAOTAO_KHOADAOTAO_ID: 'K' + x[8].slice(-2), KHOAQUANLY_TEN: x[6] === 'Kế toán' ? 'Khoa Kinh tế' : 'Khoa ' + x[6],
            DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', QLSV_TRANGTHAINGUOIHOC_ID: 'TT1', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học',
            XEPLOAI_TEN: x[9], XEPLOAI_THAYDOI_TEN: x[10], XEPLOAI_THAYDOI: x[10], ANH: '' };
    });
    function svCua(kh, tien, tu, den) {
        var k = KH.filter(function (x) { return x.ID === kh; })[0] || KH[0];
        return SV.slice(tu || 0, den || SV.length).map(function (s, i) {
            var r = { ID: tien + kh + '_' + i, HB_KEHOACH_ID: kh, HB_QUYHOCBONG_ID: k.HB_QUYHOCBONG_ID, DAOTAO_THOIGIANDAOTAO_ID: k.DAOTAO_THOIGIANDAOTAO_ID,
                TN_KEHOACH_ID: kh, PHANLOAI_ID: 'PL1' };
            Object.keys(s).forEach(function (c) { r[c] = s[c]; });
            return r;
        });
    }
    var COT_DAT = [{ ID: 'C1', TEN: 'Điểm TB học kỳ' }, { ID: 'C2', TEN: 'Điểm rèn luyện' }];
    var COT_LOI = [{ ID: 'L1', TEN: 'Lý do không đạt' }];

    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': TG,
        'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }],
        'HB_QuyHocBong/LayDanhSach': QUY,
        /* Hộp chọn sinh viên (Corei getList_SinhVien) */
        'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc': function (o) {
            var r = SV.map(function (s) { var x = { ID: 'NHCT_' + s.QLSV_NGUOIHOC_ID }; Object.keys(s).forEach(function (c) { x[c] = s[c]; }); return x; });
            return trang(like(r, o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        },
        'HB_ThongTin/LayDSHB_KeHoach': function (o) {
            var r = like(KH, o.strTuKhoa, ['TEN', 'MA']).filter(function (x) {
                return (!o.strDaoTao_ThoiGianDaoTao_Id || x.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id) &&
                    (!o.strHB_QuyHocBong_Id || x.HB_QUYHOCBONG_ID === o.strHB_QuyHocBong_Id);
            });
            return trang(r, o);
        },
        'HB_KeHoach/ThemMoi': { rows: [], raw: { Id: 'HBKH99' } },
        'HB_KeHoach_NhanSu/LayDanhSach': function (o) {
            return (NS[o.strHB_KeHoach_Id] || []).map(function (x) {
                return { ID: x[0], NGUOIDUNG_ID: x[1], NGUOIDUNG_TAIKHOAN: x[2], NGUOIDUNG_TENDAYDU: x[3], NGUOICUOI_TENDAYDU: x[3] };
            });
        },
        'HB_KeHoach_PhamVi/LayDanhSach': function (o) {
            return trang(like(svCua(o.strHB_KeHoach_Id, 'PV'), o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        },
        'HB_KetQua/LayDanhSach': function (o) {
            return trang(like(svCua(o.strHB_KeHoach_Id, 'KQ', 0, 4), o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        },
        'HB_KetQua/LayChiTiet': function (o) {
            var d = [];
            svCua(o.strHB_KeHoach_Id, 'KQ', 0, 4).forEach(function (r, i) {
                d.push({ HB_KETQUA_ID: r.ID, ID: 'C1', GIATRI: (3.9 - i * 0.2).toFixed(2) });
                d.push({ HB_KETQUA_ID: r.ID, ID: 'C2', GIATRI: String(92 - i * 3) });
            });
            return { rows: { rsCot: COT_DAT, rsDuLieu: d } };
        },
        'HB_KetQua/LayDSHB_KetQua_Loi': function (o) {
            return trang(like(svCua(o.strHB_KeHoach_Id, 'KL', 4), o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        },
        'HB_KetQua/LayDSHB_KetQua_Loi_ChiTiet': function (o) {
            return { rows: { rsCot: COT_LOI, rsDuLieu: svCua(o.strHB_KeHoach_Id, 'KL', 4).map(function (r) {
                return { HB_KETQUA_ID: r.ID, ID: 'L1', GIATRI: 'Còn học phần chưa đạt' };
            }) } };
        },
        'TN_KetQuaHocPhan/LayDanhSach': [
            { DAOTAO_HOCPHAN_MA: 'KT201', DAOTAO_HOCPHAN_TEN: 'Nguyên lý kế toán', DIEM: '3,5', DANHGIA_TEN: 'Chưa đạt', MOTA: 'Thi lại' },
            { DAOTAO_HOCPHAN_MA: 'TO102', DAOTAO_HOCPHAN_TEN: 'Toán cao cấp 2', DIEM: '4,0', DANHGIA_TEN: 'Chưa đạt', MOTA: '' }
        ],
        'HB_XepLoai_DieuKien_Ad/LayDSHB_XepLoai_DieuKien_Ad': [
            { ID: 'DK1', XEPLOAI_TEN: 'Xuất sắc', XAUDIEUKIEN: 'DIEMTB_HK >= 3.6 AND DIEMRL >= 90' },
            { ID: 'DK2', XEPLOAI_TEN: 'Giỏi', XAUDIEUKIEN: 'DIEMTB_HK >= 3.2 AND DIEMRL >= 80' },
            { ID: 'DK3', XEPLOAI_TEN: 'Khá', XAUDIEUKIEN: 'DIEMTB_HK >= 2.5 AND DIEMRL >= 65' }
        ],
        'pkg_hocbong_thongtin.LayDSHB_PhamVi_ApDung': [
            { ID: 'PVN1', TEN: 'Điều kiện chuẩn khuyến khích học tập', MOTA: 'Áp dụng toàn trường' },
            { ID: 'PVN2', TEN: 'Điều kiện học bổng tài trợ', MOTA: 'Theo yêu cầu nhà tài trợ' }
        ],
        'HB_KetQua/LayDSHB_KetQua_CongNhan': function (o) {
            var r = svCua('HBKH01', 'CN').map(function (x, i) { x.KETQUAXACNHAN_TEN = i < 2 ? 'Đã duyệt' : ''; return x; });
            return trang(like(r, o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        },
        'HB_XacNhanKetQua/LayDSTinhTrangXacNhan': [
            { ID: 'XN1', TEN: 'Duyệt', THONGTIN1: 'fa fa-check-circle' },
            { ID: 'XN2', TEN: 'Không duyệt', THONGTIN1: 'fa fa-times-circle' }
        ],
        'HB_XacNhanKetQua/LayDanhSach': [
            { TINHTRANG_TEN: 'Duyệt', NOIDUNG: 'Đủ điều kiện', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Thị Lan', NGAYTAO_DD_MM_YYYY: '20/03/2026' }
        ]
    });
})();
