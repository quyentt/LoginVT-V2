/* Dữ liệu mẫu cho luanan/dulieu — chỉ dùng ở chế độ dựng thử (API thật không đọc bảng này). */
(function () {
    'use strict';
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }

    var ROWS = [
        { ID: 'LA1', HOATDONG_ID: 'HD1', HOATDONG_TEN: 'Hướng dẫn luận án', HEDAOTAO_ID: 'HE3', HEDAOTAO_TEN: 'Tiến sĩ', DONVI_ID: 'CC2',
          NHANSU_HOSOCANBO_ID: 'NS1', NHANSU_HOSOCANBO_MASO: 'GV001', NHANSU_HOSOCANBO_HODEM: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'An',
          DAOTAO_THOIGIANDAOTAO_ID: 'TG1', DAOTAO_THOIGIANDAOTAO_NAM: '2025_2026', DAOTAO_THOIGIANDAOTAO_KY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1',
          PHANLOAIDOITUONG_ID: 'DT1', SOGIO: '45', SOGIOCHUAN: '60', NGAYBATDAU: '01/09/2025', NGAYKETTHUC: '31/12/2025', GHICHU: 'Hướng dẫn chính 2 NCS' },
        { ID: 'LA2', HOATDONG_ID: 'HD2', HOATDONG_TEN: 'Phản biện luận án', HEDAOTAO_ID: 'HE3', HEDAOTAO_TEN: 'Tiến sĩ', DONVI_ID: 'CC2',
          NHANSU_HOSOCANBO_ID: 'NS2', NHANSU_HOSOCANBO_MASO: 'GV003', NHANSU_HOSOCANBO_HODEM: 'Lê Minh', NHANSU_HOSOCANBO_TEN: 'Châu',
          DAOTAO_THOIGIANDAOTAO_ID: 'TG1', DAOTAO_THOIGIANDAOTAO_NAM: '2025_2026', DAOTAO_THOIGIANDAOTAO_KY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1',
          PHANLOAIDOITUONG_ID: 'DT1', SOGIO: '8', SOGIOCHUAN: '10', NGAYBATDAU: '15/10/2025', NGAYKETTHUC: '15/10/2025', GHICHU: '' },
        { ID: 'LA3', HOATDONG_ID: 'HD3', HOATDONG_TEN: 'Hội đồng đánh giá', HEDAOTAO_ID: 'HE2', HEDAOTAO_TEN: 'Thạc sĩ', DONVI_ID: 'CC3',
          NHANSU_HOSOCANBO_ID: 'NS3', NHANSU_HOSOCANBO_MASO: 'GV010', NHANSU_HOSOCANBO_HODEM: 'Trần Thị', NHANSU_HOSOCANBO_TEN: 'Bình',
          DAOTAO_THOIGIANDAOTAO_ID: 'TG2', DAOTAO_THOIGIANDAOTAO_NAM: '2025_2026', DAOTAO_THOIGIANDAOTAO_KY: '2', DAOTAO_THOIGIANDAOTAO_DOT: '1',
          PHANLOAIDOITUONG_ID: 'DT2', SOGIO: '4', SOGIOCHUAN: '5', NGAYBATDAU: '20/02/2026', NGAYKETTHUC: '20/02/2026', GHICHU: 'Uỷ viên hội đồng' }
    ];
    var NS = {
        CC2: [{ ID: 'NS1', HOTEN: 'Nguyễn Văn An', MASO: 'GV001' }, { ID: 'NS2', HOTEN: 'Lê Minh Châu', MASO: 'GV003' }],
        CC3: [{ ID: 'NS3', HOTEN: 'Trần Thị Bình', MASO: 'GV010' }, { ID: 'NS4', HOTEN: 'Phạm Quốc Dũng', MASO: 'GV012' }]
    };
    var fx = {
        'LVLA_DuLieu/LayDanhSach': ROWS,
        'LVLA_DuLieu/ThemMoi': { rows: [], raw: { Id: 'LA_MOI' } },
        'LVLA_DuLieu/CapNhat': { rows: [], raw: { Id: 'LA1' } },
        'LVLA_DuLieu/Xoa': { rows: [], raw: {} },
        'NS_HoSoV2/LayDanhSach': function (o) { return NS[o.strDaoTao_CoCauToChuc_Id] || NS.CC2.concat(NS.CC3); }
    };
    fx[DM + 'KLGD.HOATDONG'] = [dm('HD1', 'HDLA', 'Hướng dẫn luận án', 'Hoạt động'), dm('HD2', 'PBLA', 'Phản biện luận án', 'Hoạt động'), dm('HD3', 'HDDG', 'Hội đồng đánh giá', 'Hoạt động')];
    fx[DM + 'KHDT.PHANLOAIDOITUONGDAOTAO'] = [dm('DT1', 'NCS', 'Nghiên cứu sinh', 'Đối tượng đào tạo'), dm('DT2', 'HVCH', 'Học viên cao học', 'Đối tượng đào tạo')];
    /* Thời gian đào tạo: chỉ thêm khi phân hệ khác chưa đăng ký (trùng khoá thì bản sau thắng — không ghi đè màn khác). */
    if (!ums.demo.fixtures['KHCT_ThoiGianDaoTao/LayDanhSach']) {
        fx['KHCT_ThoiGianDaoTao/LayDanhSach'] = [
            { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2025_2026_1_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2_1' }, { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: '2031_2032_2_1' }
        ];
    }
    ums.demo.add(fx);
})();
