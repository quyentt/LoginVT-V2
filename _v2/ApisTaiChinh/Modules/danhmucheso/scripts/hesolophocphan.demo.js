/* Dữ liệu mẫu cho hesolophocphan — chỉ dùng ở chế độ dựng thử.
   Hệ/khoá/chương trình/học kỳ/kiểu học dùng chung nằm trong _chung_a.js;
   khoản thu (TC_KhoanThu/LayDanhSach, KT1…KT5) có sẵn trong assets/js/demo-data.js.
   TC_HocPhan_HeSo/LayDanhSach dùng chung action với hesohocphan nên hàm mẫu
   trả cả dữ liệu học phần HP1…HP5 lẫn lớp học phần LHP1…LHP4. */
(function () {
    var LHP = [
        { ID: 'L01', DAOTAO_HOCPHAN_ID: 'LHP1', DAOTAO_HOCPHAN_MA: 'INT1001 1', DAOTAO_HOCPHAN_TEN: 'Nhập môn lập trình - Lớp 1' },
        { ID: 'L02', DAOTAO_HOCPHAN_ID: 'LHP2', DAOTAO_HOCPHAN_MA: 'INT1001 2', DAOTAO_HOCPHAN_TEN: 'Nhập môn lập trình - Lớp 2' },
        { ID: 'L03', DAOTAO_HOCPHAN_ID: 'LHP3', DAOTAO_HOCPHAN_MA: 'INT2211 1', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu - Lớp 1' },
        { ID: 'L04', DAOTAO_HOCPHAN_ID: 'LHP4', DAOTAO_HOCPHAN_MA: 'FLF1107 3', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh B1 - Lớp 3' }
    ];
    var TGTEN = { TG1: 'Học kỳ 1 năm 2025-2026', TG2: 'Học kỳ 2 năm 2025-2026', TG4: 'Học kỳ 1 năm 2026-2027' };
    function r(id, hp, tg, kt, kh, heso) {
        return { ID: id, DAOTAO_HOCPHAN_ID: hp, DAOTAO_THOIGIANDAOTAO_ID: tg, DAOTAO_THOIGIANDAOTAO_HOCKY: TGTEN[tg],
                 TAICHINH_CACKHOANTHU_ID: kt, KIEUHOC_ID: kh, HESO: heso };
    }
    var HESO = [
        // học phần (màn hesohocphan)
        r('HS01', 'HP1', 'TG1', 'KT1', 'KHO1', '1'),   r('HS02', 'HP1', 'TG1', 'KT1', 'KHO2', '1.2'),
        r('HS03', 'HP1', 'TG1', 'KT2', 'KHO2', '1.5'), r('HS04', 'HP1', 'TG2', 'KT1', 'KHO1', '1'),
        r('HS05', 'HP1', 'TG2', 'KT1', 'KHO3', '0.8'), r('HS06', 'HP1', 'TG4', 'KT2', 'KHO2', '1.5'),
        r('HS07', 'HP2', 'TG1', 'KT1', 'KHO1', '1.2'), r('HS08', 'HP2', 'TG2', 'KT1', 'KHO2', '1.4'),
        r('HS09', 'HP4', 'TG2', 'KT1', 'KHO1', '0.5'), r('HS10', 'HP5', 'TG4', 'KT2', 'KHO2', '1.5'),
        // lớp học phần (màn này)
        r('HL01', 'LHP1', 'TG1', 'KT1', 'KHO1', '1.1'), r('HL02', 'LHP1', 'TG1', 'KT1', 'KHO2', '1.3'),
        r('HL03', 'LHP1', 'TG2', 'KT1', 'KHO1', '1'),   r('HL04', 'LHP1', 'TG2', 'KT2', 'KHO3', '0.9'),
        r('HL05', 'LHP3', 'TG1', 'KT1', 'KHO1', '1.2'), r('HL06', 'LHP4', 'TG4', 'KT2', 'KHO2', '1.5')
    ];
    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_Lop': LHP,
        'TC_HocPhan_HeSo/LayDanhSach': function (o) {
            return HESO.filter(function (x) { return !o.strDaoTao_HocPhan_Id || x.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; });
        }
    });
})();
