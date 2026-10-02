/* Dữ liệu mẫu cho nghile — chỉ dùng ở chế độ dựng thử. */
(function () {
    var NL = [{ ID: 'NL1', MA: 'TET', TEN: 'Tết nguyên đán' }, { ID: 'NL2', MA: 'HV', TEN: 'Giỗ tổ Hùng Vương' },
        { ID: 'NL3', MA: '3004', TEN: 'Nghỉ lễ 30-4 và 1-5' }, { ID: 'NL4', MA: 'QK', TEN: 'Quốc khánh' }, { ID: 'NL5', MA: 'TDL', TEN: 'Tết dương lịch' }];
    function ten(id) { var r = NL.filter(function (x) { return x.ID === id; })[0]; return r ? r.TEN : ''; }
    var nam = String(new Date().getFullYear());
    ums.demo.add({ 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.NNL0': NL });
    ums.demo.crudStore('NS_QuyDinhNghiLe', [
        { ID: 'QL1', DANHMUCNGHILE_ID: 'NL5', DANHMUCNGHILE_TEN: 'Tết dương lịch', NGAYNGHI: '01/01/' + nam, NAMAPDUNG: nam, NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Thị Hạnh' },
        { ID: 'QL2', DANHMUCNGHILE_ID: 'NL3', DANHMUCNGHILE_TEN: 'Nghỉ lễ 30-4 và 1-5', NGAYNGHI: '30/04/' + nam, NAMAPDUNG: nam, NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Thị Hạnh' },
        { ID: 'QL3', DANHMUCNGHILE_ID: 'NL4', DANHMUCNGHILE_TEN: 'Quốc khánh', NGAYNGHI: '02/09/' + nam, NAMAPDUNG: nam, NGUOITHUCHIEN_TENDAYDU: 'Trần Văn Nam' }
    ], {
        map: function (o) { return { DANHMUCNGHILE_ID: o.strDanhMucNghiLe_Id, DANHMUCNGHILE_TEN: ten(o.strDanhMucNghiLe_Id), NGAYNGHI: o.strNgayNghi, NAMAPDUNG: o.strNamApDung }; },
        list: function (rows, o) {
            var r = rows.filter(function (x) { return (!o.strNamApDung || String(x.NAMAPDUNG) === String(o.strNamApDung)) && (!o.strDanhMucNghiLe_Id || x.DANHMUCNGHILE_ID === o.strDanhMucNghiLe_Id); });
            return { rows: r, pager: r.length };
        }
    });
})();
