/* Dữ liệu mẫu cho danh mục tên tạp chí quốc tế / quốc gia — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: ten }; }
    function kho(ctl, rows) {
        ums.demo.crudStore(ctl, rows, {
            map: function (o) {
                return { MATAPCHIDANG: o.strMaTapChiDang, TENTAPCHIDANG: o.strTenTapChiDang, LOAITAPCHI_ID: o.strLoaiTapChi_Id, CHISO_ISSN: o.strChiSo_ISSN,
                    COQUANXUATBAN_ID: o.strCoQuanXuatBan_Id, DAIDIEM: o.strDaiDiem, DIEM: o.dDiem, THOIGIANAPDUNG: o.strThoiGianApDung, GHICHU: o.strGhiChu };
            },
            list: function (rows, o) {
                var q = String(o.strTuKhoa || '').toLowerCase();
                var d = rows.filter(function (r) { return !q || (r.TENTAPCHIDANG + ' ' + r.MATAPCHIDANG).toLowerCase().indexOf(q) >= 0; });
                return { rows: d, pager: d.length };
            }
        });
    }
    kho('NCKH_DMTapChiQuocTe', [
        { ID: 'TCQT1', MATAPCHIDANG: 'NATURE', TENTAPCHIDANG: 'Nature', LOAITAPCHI_ID: 'LT1', CHISO_ISSN: '0028-0836', COQUANXUATBAN_ID: 'CQXB2', DAIDIEM: '0 - 2', DIEM: '2', THOIGIANAPDUNG: '01/01/2025', GHICHU: '' },
        { ID: 'TCQT2', MATAPCHIDANG: 'IEEE-TSE', TENTAPCHIDANG: 'IEEE Transactions on Software Engineering', LOAITAPCHI_ID: 'LT1', CHISO_ISSN: '0098-5589', COQUANXUATBAN_ID: 'CQXB2', DAIDIEM: '0 - 1.5', DIEM: '1.5', THOIGIANAPDUNG: '01/01/2025', GHICHU: 'Q1' }
    ]);
    kho('NCKH_DMTapChiQuocGia', [
        { ID: 'TCQG1', MATAPCHIDANG: 'KHCN', TENTAPCHIDANG: 'Tạp chí Khoa học và Công nghệ', LOAITAPCHI_ID: 'LT2', CHISO_ISSN: '1859-1531', COQUANXUATBAN_ID: 'CQXB1', DAIDIEM: '0 - 1', DIEM: '0.75', THOIGIANAPDUNG: '01/01/2025', GHICHU: '' },
        { ID: 'TCQG2', MATAPCHIDANG: 'GD', TENTAPCHIDANG: 'Tạp chí Giáo dục', LOAITAPCHI_ID: 'LT2', CHISO_ISSN: '2354-0753', COQUANXUATBAN_ID: 'CQXB1', DAIDIEM: '0 - 0.5', DIEM: '0.5', THOIGIANAPDUNG: '01/01/2025', GHICHU: '' }
    ]);
    var fx = {};
    fx[DM + 'NCKH.LTQG'] = [dm('LT1', 'ISI', 'Tạp chí ISI/Scopus'), dm('LT2', 'HDGSNN', 'Tạp chí trong danh mục HĐGSNN')];
    fx[DM + 'NCKH.CQXB'] = [dm('CQXB1', 'BGD', 'Bộ Giáo dục và Đào tạo'), dm('CQXB2', 'NXBQT', 'Nhà xuất bản quốc tế')];
    ums.demo.add(fx);
})();
