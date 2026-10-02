/* Dữ liệu mẫu cho lichchamthi — chỉ dùng ở chế độ dựng thử. */
(function () {
    var TUI = [2, 10, 1].map(function (n, i) {
        return { ID: 'TB' + n, THI_TUIBAI_TEN: 'Túi ' + n, CANBOCHAMTHI_HOTEN: 'Nguyễn Văn Hùng', SOBAI: 30 + i, DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT',
            NGAYBATDAUCHAM: '05/01/2027', NGAYHOANTHANHCHAM: '15/01/2027', NGAYNHANBAI: '04/01/2027', TINHTRANGCHAM: i === 1 ? 1 : 0, GHICHU: '', TENDOTTHI: 'Đợt 1 HK1' };
    });
    var THI = [{ ID: 'DST1', DANHSACHTHI_TEN: 'IT3200 - Nhóm 1', CANBOCHAMTHI_HOTEN: 'Nguyễn Văn Hùng', SOBAI: 25, DAOTAO_HOCPHAN_MA: 'IT3200', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu',
        NGAYBATDAUCHAM: '08/01/2027', CATHI_TEN: 'Ca 1', PHONGTHI_TEN: 'A2-301', NGAYHOANTHANHCHAM: '12/01/2027', NGAYNHANBAI: '08/01/2027', TINHTRANGCHAM: 0, GHICHU: 'Vấn đáp', TENDOTTHI: 'Đợt 1 HK1' }];
    ums.demo.add({
        'NS_ThongTinCanBo/LayDSKetQuaChamThi': function () { return { rows: { rsTheoTui: TUI, rsTheoDST: THI } }; },
        'TP_XuLy/XacNhanTinhTrangChamThi': function (o) { TUI.concat(THI).forEach(function (x) { if (x.ID === o.strId) x.TINHTRANGCHAM = Number(o.dTinhTrangCham); }); return []; }
    });
})();
