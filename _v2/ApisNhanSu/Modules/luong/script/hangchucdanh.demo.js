/* Dữ liệu mẫu cho hangchucdanh — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'NS.NHNG'] = [
        { ID: 'NN1', MA: 'A', TEN: 'Công chức, viên chức loại A', QUANHECHA_ID: '' },
        { ID: 'NN11', MA: 'A3', TEN: 'Loại A3', QUANHECHA_ID: 'NN1' },
        { ID: 'NN12', MA: 'A2', TEN: 'Loại A2', QUANHECHA_ID: 'NN1' },
        { ID: 'NN13', MA: 'A1', TEN: 'Loại A1', QUANHECHA_ID: 'NN1' },
        { ID: 'NN2', MA: 'B', TEN: 'Viên chức loại B', QUANHECHA_ID: '' }
    ];
    fx[D + 'NS.CDNN'] = [{ ID: 'CD1', MA: 'GV', TEN: 'Giảng viên' }, { ID: 'CD2', MA: 'GVC', TEN: 'Giảng viên chính' }, { ID: 'CD3', MA: 'GVCC', TEN: 'Giảng viên cao cấp' }];
    fx[D + 'NS.HACD'] = [{ ID: 'H1', MA: 'I', TEN: 'Hạng I' }, { ID: 'H2', MA: 'II', TEN: 'Hạng II' }, { ID: 'H3', MA: 'III', TEN: 'Hạng III' }];
    fx[D + 'NS.NGLU'] = [{ ID: 'NG1', MA: 'V.07.01.01', TEN: 'V.07.01.01' }, { ID: 'NG2', MA: 'V.07.01.02', TEN: 'V.07.01.02' }, { ID: 'NG3', MA: 'V.07.01.03', TEN: 'V.07.01.03' }];
    fx['NS_NhomNgachBac/LayDanhSach'] = function (o) {
        return [1, 2, 3, 4].map(function (b) { return { ID: o.strNhomNgach_Id + 'B' + b, NHOMNGACH_TEN: 'Loại A3', BAC_TEN: 'Bậc ' + b }; });
    };
    ums.demo.add(fx);
    var TEN = { NN1: 'Công chức, viên chức loại A', NN11: 'Loại A3', NN12: 'Loại A2', NN13: 'Loại A1', NN2: 'Viên chức loại B' };
    ums.demo.crudStore('NS_HangChucDanh', [
        { ID: 'HCD1', NHOMNGACH_ID: 'NN11', NHOMNGACH_TEN: 'Loại A3', LOAICHUCDANHNGHENGHIEP_ID: 'CD3', LOAICHUCDANHNGHENGHIEP_TEN: 'Giảng viên cao cấp', HANG_ID: 'H1', HANG_TEN: 'Hạng I', NGACH_ID: 'NG1', NGACH_TEN: 'V.07.01.01', GHICHU: '' },
        { ID: 'HCD2', NHOMNGACH_ID: 'NN12', NHOMNGACH_TEN: 'Loại A2', LOAICHUCDANHNGHENGHIEP_ID: 'CD2', LOAICHUCDANHNGHENGHIEP_TEN: 'Giảng viên chính', HANG_ID: 'H2', HANG_TEN: 'Hạng II', NGACH_ID: 'NG2', NGACH_TEN: 'V.07.01.02', GHICHU: '' },
        { ID: 'HCD3', NHOMNGACH_ID: 'NN13', NHOMNGACH_TEN: 'Loại A1', LOAICHUCDANHNGHENGHIEP_ID: 'CD1', LOAICHUCDANHNGHENGHIEP_TEN: 'Giảng viên', HANG_ID: 'H3', HANG_TEN: 'Hạng III', NGACH_ID: 'NG3', NGACH_TEN: 'V.07.01.03', GHICHU: '' }
    ], {
        map: function (o) { return { NHOMNGACH_ID: o.strNhomNgach_Id, NHOMNGACH_TEN: TEN[o.strNhomNgach_Id] || '', LOAICHUCDANHNGHENGHIEP_ID: o.strLoaiChucDanhNgheNghiep_Id,
            HANG_ID: o.strHang_Id, NGACH_ID: o.strNgach_Id, NGACH_TEN: o.strNgach_Id, GHICHU: o.strGhiChu }; },
        list: function (rows, o) { return rows.filter(function (r) { return r.NHOMNGACH_ID === o.strNhomNgach_Id; }); }
    });
})();
