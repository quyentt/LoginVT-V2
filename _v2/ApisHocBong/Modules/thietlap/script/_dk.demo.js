/* Dữ liệu mẫu chung của ums.hbDk (thamsochung, dieukienxet, xeploaihabac) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';

    var PHANCAP = [
        dm('PC1', 'HEDAOTAO', 'Hệ đào tạo'), dm('PC2', 'KHOAHOC', 'Khóa học'), dm('PC3', 'CHUONGTRINH', 'Chương trình'),
        dm('PC4', 'LOPQUANLY', 'Lớp quản lý'), dm('PC5', 'HSSV', 'Học sinh, sinh viên'), dm('PC6', 'KHOAQUANLY', 'Khoa quản lý'),
        dm('PC7', 'KEHOACHXETTOTNGHIEP', 'Kế hoạch xét'), dm('PC8', 'MOHINHNIENCHE_TINCHI', 'Mô hình niên chế / tín chỉ')
    ];
    function phanCap(o) { return o.strPhanLoai_Id ? PHANCAP : []; }

    var fx = {
        'TN_PhanCapApDung/LayDanhSach': phanCap,
        'HB_PhanCapApDung/LayDanhSach': phanCap,
        'SV_HoSo/LayDanhSach': function (o) {
            if (!o.strLopQuanLy_Id) return [];
            return [
                { ID: 'SV01', MASO: 'SV0001', HODEM: 'Nguyễn Thị', TEN: 'An' },
                { ID: 'SV02', MASO: 'SV0002', HODEM: 'Trần Văn', TEN: 'Bình' },
                { ID: 'SV03', MASO: 'SV0003', HODEM: 'Lê Minh', TEN: 'Châu' }
            ];
        },
        'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }],
        'TN_ThongTin/LayDSTN_KeHoach': [{ ID: 'KHX1', TEN: 'Xét học kỳ 1 năm học 2025-2026' }, { ID: 'KHX2', TEN: 'Xét học kỳ 2 năm học 2025-2026' }],
        'HB_KeHoach/LayDanhSach': [{ ID: 'KHB1', TEN: 'Xét học bổng học kỳ 1 năm học 2025-2026' }, { ID: 'KHB2', TEN: 'Xét học bổng học kỳ 2 năm học 2025-2026' }],
        // ThemMoi trả id bản ghi mới (data.Id) — hai lưới của xeploaihabac gắn vào id này
        'TN_XetDuyet_ThamSo/ThemMoi': { rows: [], raw: { Id: 'MOI01' } },
        'TN_XetDuyet_ThamSo_Ad/ThemMoi': { rows: [], raw: { Id: 'MOI02' } },
        'HB_XetDuyet_DieuKien/ThemMoi': { rows: [], raw: { Id: 'MOI03' } },
        'HB_XetDuyet_DieuKien_Ad/ThemMoi': { rows: [], raw: { Id: 'MOI04' } },
        'TN_XepLoai_DieuKien/ThemMoi': { rows: [], raw: { Id: 'MOI05' } },
        'TN_XepLoai_DieuKien_Ad/ThemMoi': { rows: [], raw: { Id: 'MOI06' } }
    };
    fx[DM + 'TN.PHANLOAI'] = [dm('PL1', 'TOTNGHIEP', 'Xét tốt nghiệp'), dm('PL2', 'HOCBONG', 'Xét học bổng'), dm('PL3', 'KHENTHUONG', 'Xét khen thưởng')];
    fx[DM + 'KHCT.LOAILOP'] = [dm('MH1', 'NIENCHE', 'Niên chế'), dm('MH2', 'TINCHI', 'Tín chỉ')];
    fx[DM + 'VANBANG.XEPLOAI'] = [dm('XL1', 'XS', 'Xuất sắc'), dm('XL2', 'G', 'Giỏi'), dm('XL3', 'K', 'Khá'), dm('XL4', 'TBK', 'Trung bình khá'), dm('XL5', 'TB', 'Trung bình')];
    ums.demo.add(fx);
})();
