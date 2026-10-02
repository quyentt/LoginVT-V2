/* Dữ liệu mẫu dùng chung cho cauhinhhienthi, cauhinhhienthichung (Quản lý điểm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    function kho() {
        return [
            ['A1B2C3D4E5F60718293A4B5C6D7E8F90', 1, 'MASO', 'Mã sinh viên', '120', '13', '000000', 'text-align: center', '', '1', '1', '1'],
            ['B1B2C3D4E5F60718293A4B5C6D7E8F90', 2, 'HOTEN', 'Họ và tên', '220', '13', '000000', 'text-align: left', 'font-weight: bold;', '1', '1', '1'],
            ['C1B2C3D4E5F60718293A4B5C6D7E8F90', 3, 'DIEMCC', 'Chuyên cần', '80', '13', '4472c4', 'text-align: center', '', '0', '1', '0'],
            ['D1B2C3D4E5F60718293A4B5C6D7E8F90', 4, 'DIEMGK', 'Giữa kỳ', '80', '13', '70ad47', 'text-align: center', '', '0', '1', '0'],
            ['E1B2C3D4E5F60718293A4B5C6D7E8F90', 5, 'DIEMTKHP', 'Tổng kết học phần', '100', '14', 'ff0000', 'text-align: right', 'font-weight: bold;font-style:italic;', '1', '1', '1']
        ].map(function (x) {
            return { ID: x[0], THUTU: x[1], MACOT: x[2], TENCOT: x[3], DORONG: x[4], KICHTHUOCFONTCHU: x[5], MAMAUHIENTHI: x[6], CANLE: x[7],
                CHUDAM: x[8], CHIXEM: x[9], HIENTHI: x[10], DANHCHOHETHONG: x[11], CHUCNANG_ID: 'CN1', NGUOIDUNG_ID: 'ND1' };
        });
    }
    var fx = {
        'CM_ChucNang/LayDanhSach': [{ ID: 'CN1', MA: 'NHAPDIEM', TENCHUCNANG: 'Nhập điểm' }, { ID: 'CN2', MA: 'NHAPDIEMPK', TENCHUCNANG: 'Nhập điểm phúc khảo' }]
    };
    ['D_CauHinhCotHienThi', 'D_CauHinhCotHienThi_C'].forEach(function (ctl) {
        var ds = kho(), seq = 0;
        function hang(o, r) {
            r.THUTU = o.strThuTu; r.MACOT = o.strMaCot; r.TENCOT = o.strTenCot; r.DORONG = o.strDoRong; r.KICHTHUOCFONTCHU = o.strKichThuocFontChu;
            r.MAMAUHIENTHI = o.strMaMauHienThi; r.CANLE = o.strCanLe; r.CHUDAM = o.strChuDam; r.CHIXEM = o.strChiXem; r.HIENTHI = o.strHienThi;
            r.DANHCHOHETHONG = o.strDanhChoHeThong; return r;
        }
        fx[ctl + '/LayDanhSach'] = function () { return ds.slice(); };
        fx[ctl + '/ThemMoi'] = function (o) {
            ds.push(hang(o, { ID: ('F' + (++seq) + '0000000000000000000000000000000').slice(0, 32), CHUCNANG_ID: o.strChucNang_Id, NGUOIDUNG_ID: o.strNguoiDung_Id }));
            return [];
        };
        fx[ctl + '/CapNhat'] = function (o) { ds.forEach(function (r) { if (r.ID === o.strId) hang(o, r); }); return []; };
        fx[ctl + '/Xoa'] = function (o) { ds = ds.filter(function (r) { return r.ID !== o.strId; }); return []; };
    });
    ums.demo.add(fx);
})();
