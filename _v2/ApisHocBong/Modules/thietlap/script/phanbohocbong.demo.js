/* Dữ liệu mẫu cho Phân bổ học bổng — chỉ dùng ở chế độ dựng thử. */
(function () {
    var LOP = { L1: 'K67 Kỹ thuật phần mềm 1', L2: 'K67 Kỹ thuật phần mềm 2', L3: 'K67 Quản trị kinh doanh 1', L4: 'K68 Kỹ thuật phần mềm 1' };
    var ROWS = [
        { ID: 'PB1', PHAMVIAPDUNG_TEN: 'K67 Kỹ thuật phần mềm 1', SOLUONGNGUOIHOC: 48, CHITIEUSOLUONG: 5, QUY: 'QHB1', TG: 'HK1' },
        { ID: 'PB2', PHAMVIAPDUNG_TEN: 'K67 Quản trị kinh doanh 1', SOLUONGNGUOIHOC: 52, CHITIEUSOLUONG: 5, QUY: 'QHB1', TG: 'HK1' },
        { ID: 'PB3', PHAMVIAPDUNG_TEN: 'K68 Kỹ thuật phần mềm 1', SOLUONGNGUOIHOC: 55, CHITIEUSOLUONG: 6, QUY: 'QHB1', TG: 'HK1' },
        { ID: 'PB4', PHAMVIAPDUNG_TEN: 'K67 Kỹ thuật phần mềm 2', SOLUONGNGUOIHOC: 46, CHITIEUSOLUONG: 2, QUY: 'QHB2', TG: 'HK1' }
    ];
    var seq = 10;
    ums.demo.add({
        'HB_ChiTieuPhanBo/LayDanhSach': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var rs = ROWS.filter(function (r) {
                return (!o.strHB_QuyHocBong_Id || r.QUY === o.strHB_QuyHocBong_Id) && (!o.strDaoTao_ThoiGianDaoTao_Id || r.TG === o.strDaoTao_ThoiGianDaoTao_Id) &&
                    (!q || r.PHAMVIAPDUNG_TEN.toLowerCase().indexOf(q) >= 0);
            });
            var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
            return { rows: rs.slice((pi - 1) * sz, pi * sz), pager: rs.length };
        },
        'HB_ChiTieuPhanBo/ThemMoi': function (o) {
            var ten = String(o.strPhamViApDung_Id).split(',').map(function (id) { return LOP[id] || id; }).join(', ');
            ROWS.push({ ID: 'PB' + (seq++), PHAMVIAPDUNG_TEN: ten, SOLUONGNGUOIHOC: 50, CHITIEUSOLUONG: Number(o.dChiTieuSoLuong) || 0,
                QUY: o.strHB_QuyHocBong_Id, TG: o.strDaoTao_ThoiGianDaoTao_Id });
            return [];
        },
        'HB_ChiTieuPhanBo/Xoa': function (o) {
            for (var i = ROWS.length - 1; i >= 0; i--) if (ROWS[i].ID === o.strIds) ROWS.splice(i, 1);
            return [];
        },
        'HB_TinhToan/ThucHienPhanBoTuDong': []
    });
})();
