/* Dữ liệu mẫu cho kehoach/kehoachdangky (KTX) — chỉ ở chế độ dựng thử. Kế hoạch ở _kehoach.demo.js, toà nhà / phòng ở
   cosovatchat/_ktx.demo.js, phân công SV / phòng ở _kehoach.demo.js; ở đây: người ở (nếu module hoso chưa nạp) + hai danh mục lọc. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    if (!ums.demo.fixtures[D + 'KTX_PHANLOAIDOITUONG']) fx[D + 'KTX_PHANLOAIDOITUONG'] = [dm('PL1', 'SV', 'Sinh viên'), dm('PL2', 'LHS', 'Lưu học sinh'), dm('PL3', 'KHAC', 'Đối tượng khác')];
    if (!ums.demo.fixtures[D + 'KTX.KHOADAOTAO']) fx[D + 'KTX.KHOADAOTAO'] = [dm('KH67', 'K67', 'Khóa 67'), dm('KH68', 'K68', 'Khóa 68')];

    function trang(rows, o) {
        var size = Number(o.pageSize) || rows.length, idx = Number(o.pageIndex) || 1;
        if (size >= rows.length) return { rows: rows, pager: rows.length };
        return { rows: rows.slice((idx - 1) * size, idx * size), pager: rows.length };
    }

    /* Người ở — chỉ khi màn chưa nạp kho của module hoso */
    var NO = [
        { ID: 'NO1', MASO: 'BIT220263', HODEM: 'Nguyễn Văn', TEN: 'An', LOPQUANLY: 'K67-KTPM1', KHOAHOC: 'K67', KHOADAOTAO_ID: 'KH67', PHANLOAIDOITUONG_ID: 'PL1', PHANLOAIDOITUONG_TEN: 'Sinh viên' },
        { ID: 'NO2', MASO: 'BIT220271', HODEM: 'Trần Thị', TEN: 'Bình', LOPQUANLY: 'K67-KTPM1', KHOAHOC: 'K67', KHOADAOTAO_ID: 'KH67', PHANLOAIDOITUONG_ID: 'PL1', PHANLOAIDOITUONG_TEN: 'Sinh viên' },
        { ID: 'NO3', MASO: 'BBA220561', HODEM: 'Lê Minh', TEN: 'Châu', LOPQUANLY: 'K67-QTKD2', KHOAHOC: 'K67', KHOADAOTAO_ID: 'KH67', PHANLOAIDOITUONG_ID: 'PL2', PHANLOAIDOITUONG_TEN: 'Lưu học sinh' },
        { ID: 'NO4', MASO: 'BIT230210', HODEM: 'Phạm Thu', TEN: 'Dung', LOPQUANLY: 'K68-HTTT1', KHOAHOC: 'K68', KHOADAOTAO_ID: 'KH68', PHANLOAIDOITUONG_ID: 'PL1', PHANLOAIDOITUONG_TEN: 'Sinh viên' }
    ];
    if (!ums.demo.fixtures['KTX_DoiTuongOKyTucXa/LayDanhSach']) {
        fx['KTX_DoiTuongOKyTucXa/LayDanhSach'] = function (o) {
            return trang(NO.filter(function (r) {
                return (!o.strPhanLoaiDoiTuong_Id || r.PHANLOAIDOITUONG_ID === o.strPhanLoaiDoiTuong_Id) && (!o.strKhoaDaoTao_Id || r.KHOADAOTAO_ID === o.strKhoaDaoTao_Id);
            }), o);
        };
    }
    ums.demo.add(fx);

    ums.demo.ktxKHDK.NO = NO;
})();
