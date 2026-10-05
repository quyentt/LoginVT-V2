/* Dữ liệu mẫu cho dieukiennhom (Xét tốt nghiệp) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var NHOM = [
        { ID: 'DKN01', MA: 'TN-DHCQ', TEN: 'Điều kiện tốt nghiệp đại học chính quy', PHANLOAI_ID: 'PLTN1', PHANLOAI_TEN: 'Xét tốt nghiệp',
          HIEULUC: 1, MOTA: 'Áp dụng từ khóa 2022', NGAYTAO_DD_MM_YYYY_HHMMSS: '12/08/2026 09:15:22', NGUOITAO_TAIKHOAN: 'admin' },
        { ID: 'DKN02', MA: 'TN-LT', TEN: 'Điều kiện tốt nghiệp liên thông', PHANLOAI_ID: 'PLTN1', PHANLOAI_TEN: 'Xét tốt nghiệp',
          HIEULUC: 1, MOTA: '', NGAYTAO_DD_MM_YYYY_HHMMSS: '20/08/2026 14:02:10', NGUOITAO_TAIKHOAN: 'nguyenvana' },
        { ID: 'DKN03', MA: 'TN-CU', TEN: 'Điều kiện tốt nghiệp (quy chế 2017)', PHANLOAI_ID: 'PLTN2', PHANLOAI_TEN: 'Xét hoàn thành chương trình',
          HIEULUC: 0, MOTA: 'Không dùng nữa', NGAYTAO_DD_MM_YYYY_HHMMSS: '05/09/2023 08:30:00', NGUOITAO_TAIKHOAN: 'admin' }
    ];
    var LENH_DK = [
        { ID: 'LDK1', TUKHOA: '[DTBTL]', TENTUKHOA: 'Điểm trung bình tích lũy', MOTA: 'Thang điểm 4', TENPKG: 'PKG_TOTNGHIEP_TINHTOAN',
          TENFUNCTION: 'FN_DTBTL', TENDATABASELINK: '', KIEUDULIEU: 'NUMBER', SOCHUSOLAMTRON: 2 },
        { ID: 'LDK2', TUKHOA: '[TCNO]', TENTUKHOA: 'Số tín chỉ còn nợ', MOTA: 'Học phần bắt buộc chưa đạt', TENPKG: 'PKG_TOTNGHIEP_TINHTOAN',
          TENFUNCTION: 'FN_TCNO', TENDATABASELINK: '', KIEUDULIEU: 'NUMBER', SOCHUSOLAMTRON: 0 },
        { ID: 'LDK3', TUKHOA: '[CHUANDAURA]', TENTUKHOA: 'Đạt chuẩn đầu ra', MOTA: '1 = đạt', TENPKG: 'PKG_TOTNGHIEP_TINHTOAN',
          TENFUNCTION: 'FN_CHUANDAURA', TENDATABASELINK: '', KIEUDULIEU: 'NUMBER', SOCHUSOLAMTRON: 0 }
    ];
    var LENH_XL = [
        { ID: 'LXL1', TUKHOA: '[XL_DTBTL]', TENTUKHOA: 'Điểm xếp loại tốt nghiệp', MOTA: 'Điểm TBTL toàn khóa', TENPKG: 'PKG_TOTNGHIEP_XEPLOAI',
          TENFUNCTION: 'FN_XL_DTBTL', TENDATABASELINK: '', KIEUDULIEU: 'NUMBER', SOCHUSOLAMTRON: 2 },
        { ID: 'LXL2', TUKHOA: '[TLHOCLAI]', TENTUKHOA: 'Tỷ lệ tín chỉ học lại', MOTA: 'Dùng để hạ bậc xếp loại', TENPKG: 'PKG_TOTNGHIEP_XEPLOAI',
          TENFUNCTION: 'FN_TLHOCLAI', TENDATABASELINK: '', KIEUDULIEU: 'NUMBER', SOCHUSOLAMTRON: 2 }
    ];
    var THAMSO = {
        LDK1: [{ ID: 'TS1', TENTHAMSO: 'P_NGUOIHOC_ID', GIATRIMACDINH: '', PHANLOAI: 'VARCHAR2', MOTA: 'ID người học', THUTU: 1 },
               { ID: 'TS2', TENTHAMSO: 'P_THANGDIEM', GIATRIMACDINH: '4', PHANLOAI: 'NUMBER', MOTA: 'Thang điểm quy đổi', THUTU: 2 }],
        LDK2: [{ ID: 'TS3', TENTHAMSO: 'P_NGUOIHOC_ID', GIATRIMACDINH: '', PHANLOAI: 'VARCHAR2', MOTA: 'ID người học', THUTU: 1 }],
        LXL1: [{ ID: 'TS4', TENTHAMSO: 'P_NGUOIHOC_ID', GIATRIMACDINH: '', PHANLOAI: 'VARCHAR2', MOTA: 'ID người học', THUTU: 1 }]
    };
    var XET = {
        DKN01: [{ ID: 'XD1', XAUDIEUKIEN: '[DTBTL] >= 2.0 AND [TCNO] = 0 AND [CHUANDAURA] = 1', PHANLOAI_ID: 'PLTN1',
                  PHAMVIAPDUNG_ID: 'DKN01', DAOTAO_THOIGIANDAOTAO_ID: '' }]
    };
    var XEPLOAI = {
        DKN01: [
            { ID: 'XL1', XEPLOAI_ID: 'GIOI', XEPLOAI_TEN: 'Giỏi', THOIGIAN: '2025_2026_2', XAUDIEUKIEN: '[XL_DTBTL] >= 3.2 AND [XL_DTBTL] < 3.6',
              PHANLOAI_ID: 'PLTN1', THUTU: 2, MOTA: '', PHAMVIAPDUNG_ID: 'DKN01', DAOTAO_THOIGIANDAOTAO_ID: 'TG1' },
            { ID: 'XL2', XEPLOAI_ID: 'XSAC', XEPLOAI_TEN: 'Xuất sắc', THOIGIAN: '2025_2026_2', XAUDIEUKIEN: '[XL_DTBTL] >= 3.6',
              PHANLOAI_ID: 'PLTN1', THUTU: 1, MOTA: '', PHAMVIAPDUNG_ID: 'DKN01', DAOTAO_THOIGIANDAOTAO_ID: 'TG1' }
        ]
    };
    function loc(rows, q, cols) {
        q = (q || '').toLowerCase();
        return !q ? rows : rows.filter(function (r) { return cols.some(function (c) { return String(r[c] || '').toLowerCase().indexOf(q) >= 0; }); });
    }

    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TN.PHANLOAI': [
            { ID: 'PLTN1', MA: 'XETTN', TEN: 'Xét tốt nghiệp', CHUNG_TENDANHMUC_TEN: 'Phân loại' },
            { ID: 'PLTN2', MA: 'HTCT', TEN: 'Xét hoàn thành chương trình', CHUNG_TENDANHMUC_TEN: 'Phân loại' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#VANBANG.XEPLOAI': [
            { ID: 'XSAC', MA: 'XS', TEN: 'Xuất sắc', CHUNG_TENDANHMUC_TEN: 'Xếp loại' },
            { ID: 'GIOI', MA: 'G', TEN: 'Giỏi', CHUNG_TENDANHMUC_TEN: 'Xếp loại' },
            { ID: 'KHA', MA: 'K', TEN: 'Khá', CHUNG_TENDANHMUC_TEN: 'Xếp loại' },
            { ID: 'TBINH', MA: 'TB', TEN: 'Trung bình', CHUNG_TENDANHMUC_TEN: 'Xếp loại' }
        ],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' },
            { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }
        ],
        'PKG_TOTNGHIEP_THAMSO.LayDSTN_PhamVi_ApDung': function (o) {
            return loc(NHOM, o.strTuKhoa, ['MA', 'TEN']).filter(function (r) { return !o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id; });
        },
        'pkg_totnghiep_thongtin.LayDSTN_XetDuyet_TuKhoa': function (o) { return loc(LENH_DK, o.strTuKhoa, ['TUKHOA', 'TENTUKHOA']); },
        'pkg_totnghiep_thongtin.LayDSTN_XepLoai_TuKhoa': function (o) { return loc(LENH_XL, o.strTuKhoa, ['TUKHOA', 'TENTUKHOA']); },
        'PKG_TOTNGHIEP_THAMSO.LayDS_XetDuyet_TuKhoa_ThamSo': function (o) { return THAMSO[o.strTN_XetDuyet_TuKhoa_Id] || []; },
        'PKG_TOTNGHIEP_THAMSO.LayDS_XepLoai_TuKhoa_ThamSo': function (o) { return THAMSO[o.strTN_XepLoai_TuKhoa_Id] || []; },
        'TN_ThongTin/LayDSTN_XetDuyet_DieuKien_Ad': function (o) { return XET[o.strPhamViApDung_Id] || []; },
        'TN_ThongTin/LayDSTN_XepLoai_DieuKien_Ad': function (o) { return XEPLOAI[o.strPhamViApDung_Id] || []; },
        'pkg_totnghiep_thongtin.LayDSTN_XepLoai_DieuKien_HaBac': function (o) {
            return o.strTn_XepLoai_DieuKien_Id === 'XL1'
                ? [{ ID: 'HB1', XAUDIEUKIEN: '[TLHOCLAI] > 5', XEPLOAI_TEN: 'Khá' }]
                : [];
        }
    });
})();
