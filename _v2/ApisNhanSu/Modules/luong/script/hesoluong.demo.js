/* Dữ liệu mẫu cho hesoluong — chỉ dùng ở chế độ dựng thử (quy định lương ở _luongA.demo.js khi có, khai lại ở đây). */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx['L_BangQuyDinhLuong/LayDanhSach'] = function (o) {
        var rows = [{ ID: 'QD1', MUCLUONGCOBAN: '1800000' }, { ID: 'QD2', MUCLUONGCOBAN: '2340000' }];
        return rows.filter(function (r) { return !o.strTuKhoa || r.MUCLUONGCOBAN.indexOf(o.strTuKhoa) >= 0; });
    };
    fx[D + 'LUONG.LOAIHESOLUONG'] = [{ ID: 'LHS1', MA: 'CC', TEN: 'Công chức' }, { ID: 'LHS2', MA: 'VC', TEN: 'Viên chức' }];
    fx[D + 'LUONG.NHOMNGACH'] = [{ ID: 'NHN1', MA: 'A3', TEN: 'Loại A3' }, { ID: 'NHN2', MA: 'A2', TEN: 'Loại A2' }, { ID: 'NHN3', MA: 'A1', TEN: 'Loại A1' }];
    fx[D + 'LUONG.NGACH'] = [{ ID: 'NG1', MA: 'V.07.01.01', TEN: 'Giảng viên cao cấp' }, { ID: 'NG2', MA: 'V.07.01.02', TEN: 'Giảng viên chính' }, { ID: 'NG3', MA: 'V.07.01.03', TEN: 'Giảng viên' }];
    var HS = {
        NG1: [6.20, 6.56, 6.92, 7.28, 7.64, 8.00],
        NG2: [4.40, 4.74, 5.08, 5.42, 5.76, 6.10, 6.44, 6.78],
        NG3: [2.34, 2.67, 3.00, 3.33, 3.66, 3.99, 4.32, 4.65, 4.98]
    };
    var heSo = [], seq = 1;
    function sinh(ngach, nhom, loai, n) {
        for (var b = 1; b <= n; b++) {
            heSo.push({ ID: 'A1B2C3D4E5F60718293A4B5C6D7E8F' + (seq < 10 ? '0' : '') + (seq++), NGACH_ID: ngach, BAC: b, NHOM_ID: nhom, LOAI: loai,
                HESOLUONG: HS[ngach] && HS[ngach][b - 1] !== undefined ? String(HS[ngach][b - 1]) : '' });
        }
    }
    sinh('NG1', 'NHN1', 'LHS2', 6); sinh('NG2', 'NHN2', 'LHS2', 8); sinh('NG3', 'NHN3', 'LHS2', 9);
    var NGACH = { NG1: ['V.07.01.01', 'Giảng viên cao cấp', 'Loại A3'], NG2: ['V.07.01.02', 'Giảng viên chính', 'Loại A2'], NG3: ['V.07.01.03', 'Giảng viên', 'Loại A1'] };
    fx['L_BangHeSoLuong/LayDanhSach'] = function () { return heSo; };
    fx['L_Ngach/LayDanhSach'] = function () {
        var co = {};
        heSo.forEach(function (h) { co[h.NGACH_ID] = true; });
        return Object.keys(co).map(function (id) { var x = NGACH[id] || [id, id, '']; return { NGACH_ID: id, NGACH_MA: x[0], NGACH_TEN: x[1], NHOM_TEN: x[2], LOAI_TEN: 'Viên chức', GHICHU: '' }; });
    };
    fx['L_BangHeSoLuong/CapNhat'] = function (o) { heSo.forEach(function (h) { if (h.ID === o.strId) h.HESOLUONG = o.dHeSoLuong; }); return []; };
    fx['L_BangHeSoLuong/ThemMoi'] = [];
    fx['L_BangHeSoLuong/Xoa_NhanSu_BangHeSoLuong_Ngach'] = function (o) { heSo = heSo.filter(function (h) { return h.NGACH_ID !== o.strNgach_Id; }); return []; };
    fx['L_BangHeSoLuong/KhoiTao_NgachBac_BangHeSoLuong'] = function (o) {
        heSo = heSo.filter(function (h) { return h.NGACH_ID !== o.strNgach_Id; });
        sinh(o.strNgach_Id || 'NG3', o.strNhom_Id, o.strLoai_Id, Number(o.dSoBacToiDa) || 1);
        return [];
    };
    ums.demo.add(fx);
})();
