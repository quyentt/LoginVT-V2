/* Dữ liệu mẫu cho tinhdiem/phanbo — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {}, C = 'NCKH_PhanBoTinhDiem';
    fx['NCKH_TinhDiem_KeHoach/LayDanhSach'] = [
        { ID: 'KHTD1', MOTA: 'Tính điểm NCKH năm học 2025-2026' }, { ID: 'KHTD2', MOTA: 'Tính điểm NCKH năm học 2024-2025' }
    ];
    fx[D + 'NCKH.LOAISANPHAM'] = [{ ID: 'LSP1', TEN: 'Tạp chí quốc tế' }, { ID: 'LSP2', TEN: 'Tạp chí quốc gia' }, { ID: 'LSP3', TEN: 'Đề tài' }];
    var CHUA = [
        { ID: 'TV1', LOAI: 'LSP1', THONGTINSANPHAM: 'Deep learning for crop yield prediction — Computers and Electronics in Agriculture (2026)', THONGTINTHANHVIEN: 'Nguyễn Văn An - GV001', VAITRO_TEN: 'Tác giả chính' },
        { ID: 'TV2', LOAI: 'LSP1', THONGTINSANPHAM: 'Deep learning for crop yield prediction — Computers and Electronics in Agriculture (2026)', THONGTINTHANHVIEN: 'Trần Thị Bình - GV002', VAITRO_TEN: 'Đồng tác giả' },
        { ID: 'TV3', LOAI: 'LSP2', THONGTINSANPHAM: 'Ứng dụng blockchain trong quản lý văn bằng — Tạp chí Khoa học Công nghệ số 5/2026', THONGTINTHANHVIEN: 'Lê Minh Châu - GV014', VAITRO_TEN: 'Tác giả chính' },
        { ID: 'TV4', LOAI: 'LSP3', THONGTINSANPHAM: 'Đề tài cấp Bộ B2025-HN-07: Hệ thống cảnh báo sớm học vụ', THONGTINTHANHVIEN: 'Phạm Quốc Dũng - GV027', VAITRO_TEN: 'Chủ nhiệm' }
    ];
    var DA = [
        { ID: 'PB1', KH: 'KHTD1', THONGTINSANPHAM: 'Mô hình dự báo nhu cầu nhân lực ngành logistics — Tạp chí Kinh tế & Phát triển số 312', THONGTINTHANHVIEN: 'Lê Minh Châu - GV014', VAITRO_TEN: 'Tác giả chính', DIEM: 1, GIOCHUAN: 100 },
        { ID: 'PB2', KH: 'KHTD1', THONGTINSANPHAM: 'Giáo trình Cơ sở dữ liệu nâng cao (NXB Giáo dục, 2025)', THONGTINTHANHVIEN: 'Nguyễn Văn An - GV001', VAITRO_TEN: 'Chủ biên', DIEM: 2, GIOCHUAN: 150 },
        { ID: 'PB3', KH: 'KHTD2', THONGTINSANPHAM: 'Hội thảo quốc gia về chuyển đổi số giáo dục 2024', THONGTINTHANHVIEN: 'Trần Thị Bình - GV002', VAITRO_TEN: 'Báo cáo viên', DIEM: 0.5, GIOCHUAN: 40 }
    ];
    function trang(rows, o) { var s = Number(o.pageSize) || rows.length, i = (Number(o.pageIndex) || 1) - 1; return { rows: rows.slice(i * s, i * s + s), pager: rows.length }; }
    fx[C + '/LayDanhSach'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return trang(DA.filter(function (x) {
            return (!o.strNCKH_TinhDiem_KeHoach_Id || x.KH === o.strNCKH_TinhDiem_KeHoach_Id) && (!q || (x.THONGTINSANPHAM + ' ' + x.THONGTINTHANHVIEN).toLowerCase().indexOf(q) >= 0);
        }), o);
    };
    fx[C + '/LayDSNCKH_SP_ChuaPhanBo'] = function (o) { return trang(CHUA.filter(function (x) { return !o.strLoaiSanPham_Id || x.LOAI === o.strLoaiSanPham_Id; }), o); };
    fx[C + '/ThemMoi'] = function (o) {
        var x = CHUA.filter(function (r) { return r.ID === o.strNCKH_SP_ThanhVien_Id; })[0];
        if (x) {
            CHUA = CHUA.filter(function (r) { return r !== x; });
            DA.push({ ID: 'PB' + x.ID, KH: o.strNCKH_TinhDiem_KeHoach_Id, THONGTINSANPHAM: x.THONGTINSANPHAM, THONGTINTHANHVIEN: x.THONGTINTHANHVIEN, VAITRO_TEN: x.VAITRO_TEN, DIEM: '', GIOCHUAN: '' });
        }
        return [];
    };
    fx[C + '/Xoa'] = function (o) { DA = DA.filter(function (x) { return x.ID !== o.strIds; }); return []; };
    ums.demo.add(fx);
})();
