/* Dữ liệu mẫu cho khungcocaunhansu — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var NS = {
        CC02: [
            { ID: 'NS21', MASO: 'CB0211', HODEM: 'Nguyễn Văn', TEN: 'Hùng', NGAYSINH: 12, THANGSINH: 4, NAMSINH: 1978, SDT_CANHAN: '0912 345 678', EMAIL: 'hungnv@truong.edu.vn', ANH: '', DAOTAO_COCAUTOCHUC_ID: 'CC02' },
            { ID: 'NS22', MASO: 'CB0215', HODEM: 'Trần Thị', TEN: 'Mai', NGAYSINH: 3, THANGSINH: 9, NAMSINH: 1988, SDT_CANHAN: '0987 654 321', EMAIL: 'maitt@truong.edu.vn', ANH: '', DAOTAO_COCAUTOCHUC_ID: 'CC02' }
        ],
        CC03: [
            { ID: 'NS31', MASO: 'CB0302', HODEM: 'Lê Quang', TEN: 'Minh', NGAYSINH: 21, THANGSINH: 1, NAMSINH: 1983, SDT_CANHAN: '0903 111 222', EMAIL: 'minhlq@truong.edu.vn', ANH: '', DAOTAO_COCAUTOCHUC_ID: 'CC03' }
        ]
    };
    ums.demo.add({
        'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2': function (o) {
            var rows = NS[o.strDaoTao_CoCauToChuc_Id] || [];
            return { rows: rows, pager: rows.length };
        },
        'NS_QT_ThuyenChuyenCanBo/ThemMoi': { rows: [], raw: { Id: 'TC' + Date.now() } }
    });
})();
