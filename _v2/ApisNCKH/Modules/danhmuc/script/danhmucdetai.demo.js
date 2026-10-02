/* Dữ liệu mẫu cho Danh mục đề tài (NCKH) — chỉ dùng ở chế độ dựng thử.
   Danh mục NCKH.PLDT / NCKH.VTDT, NCKH_ThanhVien, NCKH_Files lấy từ _sanpham.demo.js của Cổng cán bộ (nạp cùng _sanpham.js). */
(function () {
    'use strict';
    var PL = { PL1: 'Cơ sở', PL2: 'Ứng dụng', PLK: 'Loại khác' };
    ums.demo.crudStore('NCKH_DanhMucDeTai', [
        { ID: 'DT1', MADETAI: 'DM-01', TENDETAI: 'Chuyển đổi số trong quản lý đào tạo', TENDETAITIENGANH: 'Digital transformation in training management',
            PHANLOAIDETAI_ID: 'PL2', PHANLOAIDETAI_TEN: 'Ứng dụng', MOTA: 'Nghiên cứu mô hình quản lý đào tạo trên nền tảng số.' },
        { ID: 'DMDT2', MADETAI: 'DM-02', TENDETAI: 'Đánh giá chất lượng học phần trực tuyến', TENDETAITIENGANH: '', PHANLOAIDETAI_ID: 'PL1',
            PHANLOAIDETAI_TEN: 'Cơ sở', MOTA: '' }
    ], {
        map: function (o) {
            return { MADETAI: o.strMaDeTai || '', TENDETAI: o.strTenDeTai, TENDETAITIENGANH: o.strTenDeTaiTiengAnh, PHANLOAIDETAI_ID: o.strPhanLoaiDeTai_Id,
                PHANLOAIDETAI_TEN: PL[o.strPhanLoaiDeTai_Id] || '', MOTA: o.strMoTa };
        },
        list: function (rows, o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var d = rows.filter(function (r) { return !q || (r.TENDETAI + ' ' + r.MADETAI).toLowerCase().indexOf(q) >= 0; });
            return { rows: d, pager: d.length };
        }
    });
})();
