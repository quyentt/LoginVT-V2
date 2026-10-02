/* Dữ liệu mẫu cho cthp — chỉ dùng ở chế độ dựng thử.
   Pull 29/9: dòng chương trình CT1 có thêm hai cột MOHINH…THEOPHAMVI — chỉ màn Kế hoạch chương trình đọc
   (hai ô "mô hình" ở vùng soạn); màn Tài chính / Cổng cán bộ không dùng. */
(function () {
    'use strict';

    function hp(khoiCol, khoi, ma, ten, ta, tc, tcp, tg) {
        var o = { DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, DAOTAO_HOCPHAN_TEN_TA: ta, HOCTRINHAPDUNGHOCTAP: tc,
                  HOCTRINHAPDUNGTINHHOCPHI: tcp, LAMONTINHDIEMTHEOCHUONGTRINH: 1, THUOCTINHHOCPHAN_TEN: 'Lý thuyết', THOIGIAN: tg };
        o[khoiCol] = khoi;
        return o;
    }
    var HP_BB = [
        hp('DAOTAO_KHOIBATBUOC_ID', 'KB1', 'MAT101', 'Giải tích 1', 'Calculus 1', 3, 3, 'HK1'),
        hp('DAOTAO_KHOIBATBUOC_ID', 'KB1', 'MAT102', 'Đại số tuyến tính', 'Linear Algebra', 3, 3, 'HK1'),
        hp('DAOTAO_KHOIBATBUOC_ID', 'KB2', 'IT201', 'Cấu trúc dữ liệu và giải thuật', 'Data Structures and Algorithms', 4, 4, 'HK3')
    ];
    var HP_TC = [
        hp('DAOTAO_KHOITUCHON_DON_ID', 'KT1', 'IT401', 'Học máy', 'Machine Learning', 3, 3, 'HK7'),
        hp('DAOTAO_KHOITUCHON_DON_ID', 'KT1', 'IT402', 'Điện toán đám mây', 'Cloud Computing', 3, 3, 'HK7')
    ];

    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': [{ ID: 'K1', TENKHOA: 'K66' }, { ID: 'K2', TENKHOA: 'K67' }],
        'KHCT_ToChucChuongTrinh/LayDanhSach': [
            { ID: 'CT1', TENCHUONGTRINH: 'Công nghệ thông tin', MACHUONGTRINH: '7480201-K66', DAOTAO_KHOADAOTAO_TEN: 'K66', DAOTAO_N_CN_TEN: 'Công nghệ thông tin',
              DAOTAO_KHOAQUANLY_TEN: 'Khoa CNTT', TONGSOTINCHIQUYDINH: 150, TONGSOTINCHITHEOKHOIKT: 148, SODANGHOC: 412, TONGSOSV: 436,
              MOHINHTUONGDUONGTHEOPHAMVI: 1, MOHINHTHAYTHETHEOPHAMVI: 0 },
            { ID: 'CT2', TENCHUONGTRINH: 'Kế toán', MACHUONGTRINH: '7340301-K66', DAOTAO_KHOADAOTAO_TEN: 'K66', DAOTAO_N_CN_TEN: 'Kế toán',
              DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế', TONGSOTINCHIQUYDINH: 130, TONGSOTINCHITHEOKHOIKT: 130, SODANGHOC: 280, TONGSOSV: 301 }
        ],
        'KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong': [{ MA: 'KHMT', TEN: 'Khoa học máy tính', SOSV: 120 }, { MA: 'KTPM', TEN: 'Kỹ thuật phần mềm', SOSV: 165 }],
        'KHCT_ThongTin/LayDSKS_DaoTao_KhoiBatBuoc': [
            { ID: 'KB1', KYHIEU: 'DC', TEN: 'Kiến thức đại cương', PHANLOAI_TEN: 'Bắt buộc', TONGSOTINCHI: 6, TONGSOTINCHITINHPHI: 6 },
            { ID: 'KB2', KYHIEU: 'CS', TEN: 'Cơ sở ngành', PHANLOAI_TEN: 'Bắt buộc', TONGSOTINCHI: 4, TONGSOTINCHITINHPHI: 4 }
        ],
        'KHCT_ThongTin/LayDSKS_DaoTao_HP_KhoiBatBuoc': function (o) { return HP_BB.filter(function (h) { return h.DAOTAO_KHOIBATBUOC_ID === o.strDaoTao_KhoiBatBuoc_Id; }); },
        'KHCT_ThongTin/LayDSKS_DaoTao_KhoiTuChon_Don': [{ ID: 'KT1', KYHIEU: 'TC1', TEN: 'Tự chọn chuyên ngành', PHANLOAI_TEN: 'Chọn 1 trong 2', SOTINCHIQUYDINH: 3, SOTINCHIPHIQUYDINH: 3 }],
        'KHCT_ThongTin/LayDSKS_DaoTao_HP_KTuChon_Don': function (o) { return HP_TC.filter(function (h) { return h.DAOTAO_KHOITUCHON_DON_ID === o.strDaoTao_KTuChon_Don_Id; }); }
    });
})();
