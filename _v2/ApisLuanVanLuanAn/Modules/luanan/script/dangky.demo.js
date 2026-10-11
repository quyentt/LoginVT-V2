/* Dữ liệu mẫu cho luanan/dangky — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    /* kế hoạch chuyên đề (dùng chung cho 4 màn luanan) */
    if (!ums.demo.fixtures['LVLA_KeHoach_ChuyenDe/LayDanhSach']) {
        ums.demo.crudStore('LVLA_KeHoach_ChuyenDe', [
            { ID: 'KC1', TEN: 'Chuyên đề đợt 1 năm 2025', MOTA: '', NGAYBATDAU: '01/09/2025', NGAYKETTHUC: '30/12/2025' },
            { ID: 'KC2', TEN: 'Chuyên đề đợt 2 năm 2026', MOTA: 'Đợt bổ sung', NGAYBATDAU: '01/03/2026', NGAYKETTHUC: '30/06/2026' }
        ], { map: function (o) { return { TEN: o.strTen, MOTA: o.strMoTa, NGAYBATDAU: o.strNgayBatDau, NGAYKETTHUC: o.strNgayKetThuc }; } });
    }
    /* đăng ký chuyên đề: dòng mẫu của khung đề cương, đổi sang khoá kế hoạch chuyên đề + phân loại */
    var PLCD = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#LVLA.PLCD';
    function cd(id, n) {
        var r = ums.demo.lvDeCuong(id, n);
        r.LVLA_KEHOACH_CHUYENDE_ID = 'KC1'; delete r.LVLA_KEHOACH_DECUONG_ID;
        r.PHANLOAI_ID = n === 1 ? 'PL2' : 'PL1'; r.PHANLOAI_TEN = n === 1 ? 'Chuyên đề 2' : 'Chuyên đề 1';
        return r;
    }
    if (!ums.demo.fixtures[PLCD]) {
        var fx = {}; fx[PLCD] = [{ ID: 'PL1', MA: 'CD1', TEN: 'Chuyên đề 1', THONGTIN1: '', THONGTIN2: '' }, { ID: 'PL2', MA: 'CD2', TEN: 'Chuyên đề 2', THONGTIN1: '', THONGTIN2: '' }];
        ums.demo.add(fx);
    }
    ums.demo.crudStore('LVLA_DangKy_ChuyenDe', [cd('DK1', 0), cd('DK2', 1), cd('DK3', 2)], {
        map: function (o) { return { LVLA_KEHOACH_CHUYENDE_ID: o.strLVLA_KeHoach_ChuyenDe_Id, QLSV_NGUOIHOC_ID: o.strQLSV_NguoiHoc_Id, QLSV_NGUOIHOC_MASO: 'BIT220101',
            QLSV_NGUOIHOC_HOTEN: 'Nguyễn Văn An', TENTIENGVIET: o.strTenTiengViet, TENTIENGANH: o.strTenTiengAnh, MOTA: o.strMoTa, NGAYDANGKY: o.strNgayDangKy,
            PHANLOAI_ID: o.strPhanLoai_Id, PHANLOAI_TEN: o.strPhanLoai_Id === 'PL2' ? 'Chuyên đề 2' : 'Chuyên đề 1', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1' }; },
        list: function (r, o) { return o.strLVLA_KeHoach_ChuyenDe_Id ? r.filter(function (x) { return x.LVLA_KEHOACH_CHUYENDE_ID === o.strLVLA_KeHoach_ChuyenDe_Id; }) : r.slice(); }
    });
})();
