/* Dữ liệu mẫu cho nhapchuyencan/nhaptheolop — chỉ dùng ở chế độ dựng thử (sinh viên / ngày dùng chung _chung.demo.js). */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    fx[D + 'DIEM.LOAIDANHSACH'] = [{ ID: 'LD1', MA: 'LHP', TEN: 'Lớp học phần', CHUNG_TENDANHMUC_TEN: 'Loại danh sách' },
        { ID: 'LD2', MA: 'LTHI', TEN: 'Danh sách thi', CHUNG_TENDANHMUC_TEN: 'Loại danh sách' }];
    fx['D_XuLyDiem/LayDSThoiGian'] = function (o) { return o.strLoaiDanhSach_Id ? [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }] : []; };
    fx['D_XuLyDiem/LayDSLopQuanLy'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'L1', TEN: 'DHCQ-IT-K66A' }, { ID: 'L2', TEN: 'DHCQ-QT-K66B' }] : []; };
    fx['D_XuLyDiem/LayDSHocPhan'] = function (o) { return o.strDaoTao_LopQuanLy_Id ? [{ ID: 'HP1', TEN: 'Lập trình hướng đối tượng' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu' }] : []; };
    var DS = [
        { ID: 'DS1', LOAIDANHSACH_TEN: 'Lớp học phần', MA: 'IT3100.01', TEN: 'Lập trình HĐT - Nhóm 01', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', SOLUONG: 3, DAOTAO_THOIGIANDAOTAO: '2026_2027_1', HP: 'HP1', LOP: 'L1' },
        { ID: 'DS2', LOAIDANHSACH_TEN: 'Lớp học phần', MA: 'IT3090.02', TEN: 'Cơ sở dữ liệu - Nhóm 02', DAOTAO_HOCPHAN_MA: 'IT3090', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', SOLUONG: 3, DAOTAO_THOIGIANDAOTAO: '2026_2027_1', HP: 'HP2', LOP: 'L1' },
        { ID: 'DS3', LOAIDANHSACH_TEN: 'Lớp học phần', MA: 'BA2010.01', TEN: 'Quản trị học - Nhóm 01', DAOTAO_HOCPHAN_MA: 'BA2010', DAOTAO_HOCPHAN_TEN: 'Quản trị học', SOLUONG: 3, DAOTAO_THOIGIANDAOTAO: '2026_2027_1', HP: 'HP3', LOP: 'L2' }
    ];
    fx['D_XuLyDiem/LayDSDiem_DanhSachHoc'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        var r = DS.filter(function (x) {
            return (!o.strDaoTao_HocPhan_Id || x.HP === o.strDaoTao_HocPhan_Id) && (!o.strDaoTao_LopQuanLy_Id || x.LOP === o.strDaoTao_LopQuanLy_Id) &&
                (!q || (x.MA + ' ' + x.TEN).toLowerCase().indexOf(q) >= 0);
        });
        return { rows: r, pager: r.length };
    };
    /* Danh sách SV của một danh sách học: lớp IT (SV1–3) hoặc QT (SV4–6) */
    fx['PKG_CHUYENCAN_THONGTIN.LayDSQLSV_NguoiHoc_ChuyenCan'] = function (o) {
        var sv = ums.demo.ccSV || [], ngay = ums.demo.ccNgay || [];
        if (o.strDiem_DanhSachHoc_Id === 'DS3') sv = sv.slice(3); else if (o.strDiem_DanhSachHoc_Id) sv = sv.slice(0, 3);
        return { rows: { rs: sv, rsNgay: ngay } };
    };
    fx['CC_NguoiHoc_ChuyenCan/LayKetQuaChuyenCanTheoNgay'] = function (o) { return ums.demo.ccMot(o.strQLSV_NguoiHoc_Id, o.strNgay_Gio_Phut_Giay_Id, o.strKieuChuyenCan_Id); };
    fx['CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan'] = { rows: [], message: 'Xoá thành công' };
    fx['CC_ThoiGian_ChuyenCan/ThemMoi'] = { rows: [], message: 'Khởi tạo thành công' };
    fx['PKG_DIEM_CHUNG.LayDSHanhDongXacNhan'] = [
        { ID: 'HD1', TEN: 'Hoàn thành', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color:#16a34a' },
        { ID: 'HD0', TEN: 'Chưa hoàn thành', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color:#dc2626' }];
    fx['D_XacNhan/LayDSDiem_XacNhan'] = function (o) {
        return o.strDuLieuXacNhan === 'DS1' ? [{ TEN: 'Hoàn thành', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Thị Lan', NGAYTAO_DD_MM_YYYY: '22/09/2026' }] : [];
    };
    fx['D_XacNhan/Them_Diem_XacNhan'] = { rows: [], message: 'Xác nhận thành công' };
    ums.demo.add(fx);
})();
