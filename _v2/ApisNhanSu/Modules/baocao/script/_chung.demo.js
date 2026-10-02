/* Dữ liệu mẫu chung của hai báo cáo nhân lực — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function ns(dv, dvTen, cha, chaTen, gt, tuoi, hv, cm, ngach, cd, hsl, gio, bb, them) {
        var x = { DAOTAO_COCAUTOCHUC_ID: dv, DAOTAO_COCAUTOCHUC: dvTen, DAOTAO_COCAUTOCHUC_CHA_ID: cha, DAOTAO_COCAUTOCHUC_CHA: chaTen,
            GIOITINH_MA: gt, TUOI: tuoi, LOAIHOCVI_MA: hv, TRINHDOCHUYENMONCAONHAT_MA: cm, NGACHLUONG_MA: ngach, LOAICHUCDANH_MA: cd,
            HESOLUONG_HIENTAI: hsl, SOGIOHODO: gio, SOGIOCOTH: 0, SOGIODIPH: 0, SOGIOHDHD: 0, SOGIOKHAC: 0, SOLUONGBAIBAOQUOCTE: bb,
            DANTOC_MA: '1', TONGIAO_MA: 'KTG', NGAYCHINHTHUCVAODANGCSVN: '', TRINHDOLYLUANCHINHTRI_MA: '', TRINHDOTINHOC_MA: '', TRINHDONGOAINGU_MA: '' };
        Object.keys(them || {}).forEach(function (k) { x[k] = them[k]; });
        return x;
    }
    var DS = [
        ns('CC2', 'Bộ môn Hệ thống thông tin', 'CC1', 'Khoa Công nghệ thông tin', '1', 45, 'TS', 'CN', 'V.07.01.02', 'PGS', 4.65, 320, 3, { NGAYCHINHTHUCVAODANGCSVN: '19/05/2005', TRINHDOLYLUANCHINHTRI_MA: '2', TRINHDOTINHOC_MA: '9' }),
        ns('CC1', 'Khoa Công nghệ thông tin', '', '', '0', 38, 'ThS', 'CN', 'V.07.01.03', '', 3.33, 280, 1, { TRINHDONGOAINGU_MA: 'B2', TRINHDOTINHOC_MA: '4' }),
        ns('CC3', 'Khoa Kinh tế', '', '', '0', 53, 'TS', 'CN', 'V.07.01.01', 'GS', 6.2, 210, 5, { DANTOC_MA: '4', TONGIAO_MA: 'PG' }),
        ns('CC4', 'Phòng Đào tạo', '', '', '1', 29, '', 'CN', '', '', 2.67, null, null, {})
    ];
    ums.demo.add({
        'NS_HoSo/LayDanhSach': function (o) {
            var dv = o.strChung_DonVi_Id;
            return DS.filter(function (x) { return !dv || x.DAOTAO_COCAUTOCHUC_ID === dv || x.DAOTAO_COCAUTOCHUC_CHA_ID === dv; });
        },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.LHD0': [{ ID: 'HD1', MA: 'BC', TEN: 'Biên chế', CHUNG_TENDANHMUC_TEN: 'Loại hợp đồng' }, { ID: 'HD2', MA: 'HD', TEN: 'Hợp đồng', CHUNG_TENDANHMUC_TEN: 'Loại hợp đồng' }]
    });
})();
