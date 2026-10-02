/* Dữ liệu mẫu dùng chung của nhóm chamcongphep (nạp cùng _chung.js) — chỉ dùng ở chế độ dựng thử.
   Danh sách nhân sự / cơ cấu tổ chức dùng dữ liệu chung ở assets/js/demo-data.js. */
(function () {
    var NS = {
        NS1: ['CB001', 'Nguyễn Văn', 'Hùng', '12/04/1975', 'CC1', 'Khoa Công nghệ thông tin'],
        NS2: ['CB015', 'Trần Thị', 'Mai', '03/09/1988', 'CC4', 'Phòng Đào tạo'],
        NS3: ['CB102', 'Lê Quang', 'Minh', '21/01/1983', 'CC1', 'Khoa Công nghệ thông tin']
    };
    var phep = [
        ['NP1', 'NS1', '2026', 12, 2, 3, 11], ['NP2', 'NS1', '2025', 12, 1, 13, 0],
        ['NP3', 'NS2', '2026', 12, 0, 0, 12], ['NP4', 'NS3', '2026', 12, 1, 5, 8]
    ].map(function (x) {
        var n = NS[x[1]];
        return { ID: x[0], NHANSU_HOSOCANBO_ID: x[1], NAMAPDUNG: x[2], SONGAYDUOCNGHI: x[3], SONGAYNGHITHAMNIEN: x[4],
            SONGAYPHEPDASUDUNG: x[5], SONGAYNGHICONLAI: x[6], NGAYBATDAU: '01/01/' + x[2], NGAYKETTHUC: '31/12/' + x[2],
            NHANSU_HOSOCANBO_MASO: n[0], NHANSU_HOSOCANBO_HODEM: n[1], NHANSU_HOSOCANBO_TEN: n[2], NGAYSINHDAYDU: n[3],
            DAOTAO_COCAUTOCHUC_ID: n[4], DAOTAO_COCAUTOCHUC_TEN: n[5] };
    });
    ums.demo.add({
        'NS_NghiPhepCaNhan/LayDanhSach': function (o) {
            var r = phep.filter(function (x) {
                return (!o.strNhanSu_HoSoCanBo_Id || x.NHANSU_HOSOCANBO_ID === o.strNhanSu_HoSoCanBo_Id) &&
                    (!o.strDaoTao_CoCauToChuc_Id || x.DAOTAO_COCAUTOCHUC_ID === o.strDaoTao_CoCauToChuc_Id) &&
                    (!o.strNamApDung || x.NAMAPDUNG === String(o.strNamApDung));
            });
            return { rows: r, pager: r.length };
        },
        'NS_NghiPhepCaNhan/ThemMoi': [],
        'NS_NghiPhepCaNhan/KeThua': [],
        'NS_NghiPhepCaNhan/CapNhat': function (o) {
            phep.forEach(function (r) {
                if (r.ID !== o.strId) return;
                r.NAMAPDUNG = o.strNamApDung; r.SONGAYDUOCNGHI = o.dSoNgayDuocNghi; r.SONGAYNGHITHAMNIEN = o.dSoNgayNghiThamNien;
                r.NGAYBATDAU = o.strNgayBatDau; r.NGAYKETTHUC = o.strNgayKetThuc;
            });
            return [];
        },
        'NS_HoSoV2/LayDanhSach': function (o) {
            return Object.keys(NS).filter(function (k) { return !o.strDaoTao_CoCauToChuc_Id || NS[k][4] === o.strDaoTao_CoCauToChuc_Id; })
                .map(function (k) { return { ID: k, MASO: NS[k][0], HOTEN: NS[k][1] + ' ' + NS[k][2] }; });
        }
    });
})();
