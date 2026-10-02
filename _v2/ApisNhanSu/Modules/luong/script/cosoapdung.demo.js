/* Dữ liệu mẫu cho cosoapdung (dùng chung cho khoankhongtinh) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'NHANSU.LUONG.PHANLOAILUONGAPDUNG'] = [{ ID: 'PL1', MA: 'LCS', TEN: 'Lương cơ sở' }, { ID: 'PL2', MA: 'LTT', TEN: 'Lương tối thiểu vùng' }];
    fx['NS_HoSoV2/LayDanhSach'] = function (o) {
        var ns = [
            { ID: 'NS1', MASO: 'CB001', HOTEN: 'Nguyễn Văn Hùng', DV: 'CC1' },
            { ID: 'NS3', MASO: 'CB102', HOTEN: 'Lê Quang Minh', DV: 'CC1' },
            { ID: 'NS2', MASO: 'CB015', HOTEN: 'Trần Thị Mai', DV: 'CC3' }
        ];
        return ns.filter(function (r) { return !o.strDaoTao_CoCauToChuc_Id || r.DV === o.strDaoTao_CoCauToChuc_Id; });
    };
    ums.demo.add(fx);
    function r(id, ns, ma, ho, ten, dv, dvTen, ngay, muc) {
        return { ID: id, NHANSU_HOSOCANBO_ID: ns, NHANSU_HOSOCANBO_MASO: ma, NHANSU_HOSOCANBO_HODEM: ho, NHANSU_HOSOCANBO_TEN: ten,
            NHANSU_HOSOCANBO_NGAYSINH: '12/04/1975', NHANSU_HOSOCANBO_MASOTHUE: '8012345678', DAOTAO_COCAUTOCHUC_ID: dv, DAOTAO_COCAUTOCHUC_TEN: dvTen,
            PHANLOAIAPDUNG_ID: 'PL1', PHANLOAIAPDUNG_TEN: 'Lương cơ sở', NGAYAPDUNG: ngay, MUCAPDUNG: muc };
    }
    ums.demo.crudStore('L_NhanSu_LuongCoSo_ApDung', [
        r('CS1', 'NS1', 'CB001', 'Nguyễn Văn', 'Hùng', 'CC1', 'Khoa Công nghệ thông tin', '01/07/2024', '2340000'),
        r('CS2', 'NS3', 'CB102', 'Lê Quang', 'Minh', 'CC1', 'Khoa Công nghệ thông tin', '01/07/2024', '2340000'),
        r('CS3', 'NS2', 'CB015', 'Trần Thị', 'Mai', 'CC3', 'Khoa Kinh tế', '01/07/2023', '1800000')
    ], {
        map: function (o) { return { NHANSU_HOSOCANBO_ID: o.strNhanSu_HoSoCanBo_Id, PHANLOAIAPDUNG_ID: o.strPhanLoaiApDung_Id, NGAYAPDUNG: o.strNgayApDung, MUCAPDUNG: o.dMucApDung }; },
        list: function (rows, o) {
            return rows.filter(function (x) {
                return (!o.strDaoTao_CoCauToChuc_Id || x.DAOTAO_COCAUTOCHUC_ID === o.strDaoTao_CoCauToChuc_Id) &&
                    (!o.strNhansu_HoSoCanBo_Id || x.NHANSU_HOSOCANBO_ID === o.strNhansu_HoSoCanBo_Id);
            });
        }
    });
})();
