/* Dữ liệu mẫu cho tinhdiem/tinhdiemsanpham — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx['NCKH_TinhDiem_KeHoach/LayDanhSach'] = [
        { ID: 'KHTD1', MOTA: 'Tính điểm NCKH năm học 2025-2026', TUNGAY: '01/09/2025', DENNGAY: '31/08/2026' },
        { ID: 'KHTD2', MOTA: 'Tính điểm NCKH năm học 2024-2025', TUNGAY: '01/09/2024', DENNGAY: '31/08/2025' }
    ];
    fx[D + 'NCKH.XNKK'] = [
        { ID: 'XN1', MA: 'XNKKDONGY', TEN: 'Đồng ý' }, { ID: 'XN2', MA: 'XNKKBOSUNG', TEN: 'Yêu cầu bổ sung' }, { ID: 'XN3', MA: 'XNKKTUCHOI', TEN: 'Không đồng ý' }
    ];
    var NS = [
        { ID: 'HS1', MASO: 'GV001', HODEM: 'Nguyễn Văn', TEN: 'An', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', DV: 'CC1' },
        { ID: 'HS2', MASO: 'GV002', HODEM: 'Trần Thị', TEN: 'Bình', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', DV: 'CC1' },
        { ID: 'HS3', MASO: 'GV014', HODEM: 'Lê Minh', TEN: 'Châu', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Kinh tế', DV: 'CC3' },
        { ID: 'HS4', MASO: 'GV027', HODEM: 'Phạm Quốc', TEN: 'Dũng', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Kinh tế', DV: 'CC3' }
    ];
    var LOAI = [{ ID: 'LSP1', TEN: 'Tạp chí quốc tế' }, { ID: 'LSP2', TEN: 'Tạp chí quốc gia' }, { ID: 'LSP3', TEN: 'Đề tài' }];
    var KQ = { HS1: { LSP1: [12, 45], LSP2: [4, 20], LSP3: [8.5, 60] }, HS2: { LSP2: [6, 40], LSP3: [3.25, 30] }, HS3: { LSP1: [10, 30] }, HS4: {} };
    fx['NCKH_PhanBoTinhDiem/LayDSNCKH_TinhDiem_KetQua'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var ns = NS.filter(function (x) {
            return (!o.strDaoTao_CoCauToChuc_Id || x.DV === o.strDaoTao_CoCauToChuc_Id) && (!q || (x.MASO + ' ' + x.HODEM + ' ' + x.TEN).toLowerCase().indexOf(q) >= 0);
        });
        return { rows: { rsLoaiSanPham: LOAI, rsNhanSu: ns }, pager: 0 };
    };
    fx['NCKH_PhanBoTinhDiem/LayKQCaNhan'] = function (o) {
        var x = (KQ[o.strNhanSu_HoSoCanBo_Id] || {})[o.strLoaiSanPham_Id];
        return x ? [{ DIEM: x[0], GIOCHUAN: x[1] }] : [];
    };
    fx['NCKH_TinhDiem/TinhDiem_NCKH'] = [];
    ums.demo.add(fx);
})();
