/* Dữ liệu mẫu cho Tình trạng quân số — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var CAU = [
        { THANHPHAN_ID: 'KCN', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khoa Công nghệ thông tin' },
        { THANHPHAN_ID: 'KCN-K67', THANHPHAN_CHA_ID: 'KCN', THANHPHAN_TEN: 'Khóa 67' },
        { THANHPHAN_ID: 'L1', THANHPHAN_CHA_ID: 'KCN-K67', THANHPHAN_TEN: 'K67-KTPM1' },
        { THANHPHAN_ID: 'L4', THANHPHAN_CHA_ID: 'KCN-K67', THANHPHAN_TEN: 'K67-KTPM2' },
        { THANHPHAN_ID: 'KCN-K68', THANHPHAN_CHA_ID: 'KCN', THANHPHAN_TEN: 'Khóa 68' },
        { THANHPHAN_ID: 'L3', THANHPHAN_CHA_ID: 'KCN-K68', THANHPHAN_TEN: 'K68-HTTT1' },
        { THANHPHAN_ID: 'KKT', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khoa Kinh tế' },
        { THANHPHAN_ID: 'L2', THANHPHAN_CHA_ID: 'KKT', THANHPHAN_TEN: 'K67-QTKD2' }
    ];
    var SL = { L1: [38, 2, 0], L4: [41, 1, 0], L3: [45, 0, 0], L2: [36, 3, 1] };
    function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 97; return h; }
    ums.demo.add({
        'SV_CauTrucQuanSo/LayDanhSach': CAU,
        'SV_CauTrucQuanSo/LayDSQuanSoTheoTinhTrang': function (o) {
            var s = SL[o.strDaoTao_LopQuanLy_Id] || [0, 0, 0];
            return [{ ID: 'TT1', SOLUONG: s[0] }, { ID: 'TT2', SOLUONG: s[1] }, { ID: 'TT3', SOLUONG: s[2] }];
        },
        'SV_CauTrucQuanSo/LayDSQuanSoTheoTieuChiMoRong': function (o) {
            var n = hash(o.strDaoTao_LopQuanLy_Id || '') % 20;
            return [{ ID: 'MR1', SOLUONG: 12 + n }, { ID: 'MR2', SOLUONG: n % 4 }];
        },
        'SV_CauTrucQuanSo/LayDSQuanSoTheoLop': [
            { QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', QLSV_NGUOIHOC_NGAYSINH: '12/03/2004',
              QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
              DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy',
              HOKHAUTHUONGTRU: 'Xã Đông Hưng, huyện Đông Hưng, Thái Bình', TTLL_KHICANBAOTINCHOAI_ODAU: 'Bố: Nguyễn Văn Hải — 0912 345 678',
              QLSV_QUYETDINH_SOQD: '', QLSV_QUYETDINH_NGAYQD: '' },
            { QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình', QLSV_NGUOIHOC_NGAYSINH: '05/07/2004',
              QLSV_TRANGTHAINGUOIHOC_TEN: 'Bảo lưu', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
              DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy',
              HOKHAUTHUONGTRU: 'Phường Tân Mai, Hoàng Mai, Hà Nội', TTLL_KHICANBAOTINCHOAI_ODAU: 'Mẹ: Lê Thị Hoa — 0987 111 222',
              QLSV_QUYETDINH_SOQD: '215/QĐ-ĐHCN', QLSV_QUYETDINH_NGAYQD: '14/02/2026' }
        ],
        'SV_QuanSo/LayDSKyTheoCauTruc': [
            { ID: 'HK1', THOIGIAN: 'Học kỳ 1 năm học 2025-2026' },
            { ID: 'HK2', THOIGIAN: 'Học kỳ 2 năm học 2025-2026' }
        ],
        'SV_QuanSo/LayDSQuanSoTheoKy': function (o) {
            var s = SL[o.strDaoTao_LopQuanLy_Id] || [0];
            return [{ ID: o.strDaoTao_ThoiGianDaoTao_Id, SOLUONG: s[0] - (o.strDaoTao_ThoiGianDaoTao_Id === 'HK2' ? 1 : 0) }];
        }
    });
    ums.demo.add((function () {
        var x = {};
        x[D + 'QLSV.QUANSO.MORONG'] = [
            { ID: 'MR1', MA: 'NU', TEN: 'Nữ', CHUNG_TENDANHMUC_TEN: 'Tiêu chí mở rộng quân số' },
            { ID: 'MR2', MA: 'DTTS', TEN: 'Dân tộc thiểu số', CHUNG_TENDANHMUC_TEN: 'Tiêu chí mở rộng quân số' }
        ];
        return x;
    })());
})();
