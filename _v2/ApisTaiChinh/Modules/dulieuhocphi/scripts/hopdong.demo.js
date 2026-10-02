/* Dữ liệu mẫu cho hopdong — chỉ dùng ở chế độ dựng thử.
   Sinh viên (hộp chọn), khoản thu, kiểu học: xem _chung.demo.js / demo-data.js */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var HD = [
        { ID: 'HD1', DONVIKYHOPDONG_ID: 'DT1', DONVIKYHOPDONG_TEN: 'Tập đoàn Viettel', SOHOPDONG: '12/2025/HĐĐT-VT', NGAYKY: '15/08/2025', MOTA: 'Đào tạo kỹ sư CNTT theo đặt hàng', HIEULUC: 1, NGUYENTACPHANBO_ID: 'NT1', NGUYENTACPHANBO_TEN: 'Phân bổ theo học kỳ' },
        { ID: 'HD2', DONVIKYHOPDONG_ID: 'DT2', DONVIKYHOPDONG_TEN: 'Ngân hàng BIDV', SOHOPDONG: '05/2025/HĐ-BIDV', NGAYKY: '02/06/2025', MOTA: 'Tài trợ học phí sinh viên kế toán', HIEULUC: 1, NGUYENTACPHANBO_ID: 'NT2', NGUYENTACPHANBO_TEN: 'Phân bổ theo tháng' },
        { ID: 'HD3', DONVIKYHOPDONG_ID: 'DT1', DONVIKYHOPDONG_TEN: 'Tập đoàn Viettel', SOHOPDONG: '09/2023/HĐĐT-VT', NGAYKY: '10/09/2023', MOTA: 'Khoá 2023', HIEULUC: 0, NGUYENTACPHANBO_ID: 'NT1', NGUYENTACPHANBO_TEN: 'Phân bổ theo học kỳ' }
    ];
    function ql(id, sv, ma, hodem, ten, ns, lop, ct, khoa, kql) {
        return { ID: id, QLSV_NGUOIHOC_ID: sv, QLSV_NGUOIHOC_MASO: ma, QLSV_NGUOIHOC_HODEM: hodem, QLSV_NGUOIHOC_TEN: ten,
            QLSV_NGUOIHOC_HOTEN: hodem + ' ' + ten, QLSV_NGUOIHOC_NGAYSINH: ns, QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học',
            DAOTAO_LOPQUANLY_TEN: lop, DAOTAO_CHUONGTRINH_TEN: ct, DAOTAO_KHOADAOTAO_TEN: khoa, KHOAQUANLY_TEN: kql, DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' };
    }
    var QL = {
        HD1: [
            ql('QL1', 'SV1', 'BIT220263', 'Nguyễn Văn', 'An', '12/03/2004', 'CNTT 66A', 'Công nghệ thông tin', 'Khóa 2022 (K66)', 'Khoa CNTT'),
            ql('QL2', 'SV3', 'BIT220301', 'Lê Hoàng', 'Cường', '02/11/2004', 'CNTT 66B', 'Công nghệ thông tin', 'Khóa 2022 (K66)', 'Khoa CNTT')
        ],
        HD2: [
            ql('QL3', 'SV5', 'BAC230118', 'Vũ Minh', 'Đức', '30/09/2005', 'KT 67A', 'Kế toán', 'Khóa 2023 (K67)', 'Khoa Kinh tế')
        ]
    };
    ums.demo.add({
        'TC_DoiTuongKhac/LayDanhSach': [
            { ID: 'DT1', TENDOITUONG: 'Tập đoàn Viettel' }, { ID: 'DT2', TENDOITUONG: 'Ngân hàng BIDV' }, { ID: 'DT3', TENDOITUONG: 'Quỹ học bổng Vallet' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.DOITAC.NGUYENTACPHANBO': [dm('NT1', 'HK', 'Phân bổ theo học kỳ'), dm('NT2', 'THANG', 'Phân bổ theo tháng')],
        'TC_HopDong/LayDSTaiChinh_NguoiHoc_HopDong': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var all = HD.filter(function (h) {
                return (!o.strDonViKyHopDong_Id || h.DONVIKYHOPDONG_ID === o.strDonViKyHopDong_Id) &&
                    (!q || (h.SOHOPDONG + ' ' + h.MOTA).toLowerCase().indexOf(q) >= 0);
            });
            return { rows: all, pager: all.length };
        },
        'TC_NguoiHoc_QuanLy/LayDanhSach': function (o) { return QL[o.strTaiChinh_NguoiHoc_HD_Id] || []; },
        'TC_NguoiHoc_Khoan/LayDanhSach': function (o) {
            return o.strTaiChinh_NguoiHoc_HD_Id === 'HD1' ? [{ ID: 'NK1', TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KH1' }] : [];
        },
        'TC_HopDong_NH_Khoan/LayDanhSach': function (o) {
            return o.strTaiChinh_NguoiHoc_HD_Id === 'HD1' ? [{ ID: 'NR1', TAICHINH_CACKHOANTHU_ID: 'KT2', KIEUHOC_ID: 'KH2', QLSV_NGUOIHOC_ID: 'SV3' }] : [];
        },
        'SV_HoSo/LayDanhSach': [
            { ID: 'SV1', MASO: 'BIT220263', HODEM: 'Nguyễn Văn', TEN: 'An' },
            { ID: 'SV2', MASO: 'BIT220274', HODEM: 'Trần Thị', TEN: 'Bình' },
            { ID: 'SV3', MASO: 'BIT220301', HODEM: 'Lê Hoàng', TEN: 'Cường' },
            { ID: 'SV4', MASO: 'BBA220561', HODEM: 'Phạm Thu', TEN: 'Dung' }
        ],
        // Máy chủ thật trả id mới ở data.Id; dựng thử không đặt được nên trả qua Message
        'TC_NguoiHoc_HopDong/ThemMoi': { rows: [], message: '7C1E0B5A2D4F4B8E9A6C3D2E1F0A9B8C' }
    });
})();
