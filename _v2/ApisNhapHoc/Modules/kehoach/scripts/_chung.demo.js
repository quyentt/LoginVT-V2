/* Dữ liệu mẫu chung của các màn Nhập học dùng kế hoạch nhập học (ums.nhKH) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var KH = ums.demo.nhKH = [
        { ID: 'KHNH2026', TENKEHOACH: 'Nhập học Đại học chính quy khóa 2026', NGAYBATDAU: '20/08/2026', NGAYKETTHUC: '10/09/2026',
          DAOTAO_HEDAOTAO_ID: 'HE_DHCQ', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_ID: 'K68', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68',
          MOHINHNHAPHOC_ID: 'MH1', MOHINHNHAPHOC_TEN: 'Nhập học trực tiếp', MOHINHAPDUNGPHIEUTHU_ID: 'PT1', MOHINHAPDUNGPHIEUTHU_TEN: 'Một phiếu cho mọi khoản',
          MOHINHAPDUNGPHIEURUT_ID: 'PR1', TAICHINH_HETHONGPHIEUTHU_ID: 'HTP1', TAICHINH_HETHONGPHIEURUT_ID: 'HTP2' },
        { ID: 'KHNH2026B', TENKEHOACH: 'Nhập học bổ sung đợt 2 năm 2026', NGAYBATDAU: '15/09/2026', NGAYKETTHUC: '30/09/2026',
          DAOTAO_HEDAOTAO_ID: 'HE_DHCQ', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_ID: 'K68', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68',
          MOHINHNHAPHOC_ID: 'MH2', MOHINHNHAPHOC_TEN: 'Nhập học trực tuyến', MOHINHAPDUNGPHIEUTHU_ID: 'PT2', MOHINHAPDUNGPHIEUTHU_TEN: 'Mỗi khoản một phiếu',
          MOHINHAPDUNGPHIEURUT_ID: 'PR1', TAICHINH_HETHONGPHIEUTHU_ID: 'HTP1', TAICHINH_HETHONGPHIEURUT_ID: 'HTP2' },
        { ID: 'KHNH2025', TENKEHOACH: 'Nhập học Đại học chính quy khóa 2025', NGAYBATDAU: '18/08/2025', NGAYKETTHUC: '08/09/2025',
          DAOTAO_HEDAOTAO_ID: 'HE_DHCQ', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67',
          MOHINHNHAPHOC_ID: 'MH1', MOHINHNHAPHOC_TEN: 'Nhập học trực tiếp', MOHINHAPDUNGPHIEUTHU_ID: 'PT1', MOHINHAPDUNGPHIEUTHU_TEN: 'Một phiếu cho mọi khoản',
          MOHINHAPDUNGPHIEURUT_ID: 'PR2', TAICHINH_HETHONGPHIEUTHU_ID: 'HTP1', TAICHINH_HETHONGPHIEURUT_ID: 'HTP2' }
    ];
    function like(q, r) { return !q || String(r.TENKEHOACH).toLowerCase().indexOf(String(q).toLowerCase()) >= 0; }
    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_KeHoachNhapHoc': function (o) { return KH.filter(function (r) { return like(o.strTuKhoa, r); }); },
        'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc': function () { return KH.slice(0, 2); }
    });
})();
