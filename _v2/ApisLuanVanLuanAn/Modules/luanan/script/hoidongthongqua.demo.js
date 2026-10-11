/* Dữ liệu mẫu cho luanan/hoidongthongqua — danh sách đăng ký khai lại nếu màn đăng ký chưa mở. Chỉ dùng ở chế độ dựng thử. */
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
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    if (!ums.demo.fixtures[DM + 'LVLA.DGHD']) {
        var fx2 = {}; fx2[DM + 'LVLA.DGHD'] = [{ ID: 'DG1', MA: 'DAT', TEN: 'Đạt', THONGTIN1: '', THONGTIN2: '' }, { ID: 'DG2', MA: 'KDAT', TEN: 'Không đạt', THONGTIN1: '', THONGTIN2: '' }];
        ums.demo.add(fx2);
    }
    if (!ums.demo.fixtures['LVLA_DangKy_ChuyenDe/LayDanhSach']) {
        ums.demo.crudStore('LVLA_DangKy_ChuyenDe', [cd('DK1', 0), cd('DK2', 1), cd('DK3', 2)], {
            list: function (r, o) { return o.strLVLA_KeHoach_ChuyenDe_Id ? r.filter(function (x) { return x.LVLA_KEHOACH_CHUYENDE_ID === o.strLVLA_KeHoach_ChuyenDe_Id; }) : r.slice(); }
        });
    }
    ums.demo.crudStore('LVLA_BaoVe_ChuyenDe_HoiDong_ThanhVien', [{ ID: 'TV1', THANHVIEN_ID: 'GV3', THANHVIEN_HODEM: 'Lê Quang', THANHVIEN_TEN: 'Minh', THANHVIEN_COQUANCONGTAC: 'Khoa CNTT',
        VAITRO_ID: 'HD1', VAITRO_TEN: 'Chủ tịch', DIEM: '8.5', DANHGIA_ID: 'DG1', NHANXET: 'Tốt', DECUONG: 'DK1' }], {
        map: function (o) { return { THANHVIEN_ID: o.strThanhVien_Id, THANHVIEN_HODEM: 'Thành viên', THANHVIEN_TEN: 'mới', VAITRO_ID: o.strVaiTro_Id, DIEM: o.dDiem, DANHGIA_ID: o.strDanhGia_Id, NHANXET: o.strNhanXet, DECUONG: o.strLVLA_DangKy_ChuyenDe_Id }; },
        list: function (r, o) { return r.filter(function (x) { return x.DECUONG === o.strLVLA_DangKy_ChuyenDe_Id; }); }
    });
})();
