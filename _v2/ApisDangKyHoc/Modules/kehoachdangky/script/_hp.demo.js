/* Dữ liệu mẫu cho Áp phí học phần / Rút học phần (_hp.js) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var SV = [
        ['NH01', 'BIT220263', 'Nguyễn Văn', 'An', 'K66-KTPM1', 'Kỹ thuật phần mềm', 'Khóa 66'],
        ['NH02', 'BIT220271', 'Trần Thị', 'Bình', 'K66-KTPM1', 'Kỹ thuật phần mềm', 'Khóa 66'],
        ['NH03', 'BBA220561', 'Lê Minh', 'Châu', 'K66-QTKD2', 'Quản trị kinh doanh', 'Khóa 66'],
        ['NH04', 'BIT230210', 'Phạm Thu', 'Dung', 'K67-HTTT1', 'Hệ thống thông tin', 'Khóa 67']
    ];
    var HP = [
        ['HP01', 'IT3100', 'Lập trình hướng đối tượng', 'IT3100.01'],
        ['HP02', 'IT3080', 'Mạng máy tính', 'IT3080.02'],
        ['HP03', 'EM1010', 'Quản trị học đại cương', 'EM1010.03']
    ];
    function dong(i, sv, hp, them) {
        var r = {
            ID: 'D' + i, QLSV_NGUOIHOC_ID: sv[0], QLSV_NGUOIHOC_MASO: sv[1], QLSV_NGUOIHOC_HODEM: sv[2], QLSV_NGUOIHOC_TEN: sv[3],
            DAOTAO_LOPQUANLY_TEN: sv[4], DAOTAO_CHUONGTRINH_TEN: sv[5], DAOTAO_KHOADAOTAO_TEN: sv[6], QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học',
            THOIGIAN: 'Học kỳ 1 năm 2026-2027', DAOTAO_THOIGIANDAOTAO_ID: 'TG20261', DANGKY_KEHOACHDANGKY_ID: 'KH01',
            DAOTAO_HOCPHAN_ID: hp[0], DAOTAO_HOCPHAN_MA: hp[1], DAOTAO_HOCPHAN_TEN: hp[2], DSLOPHOCPHAN: hp[3],
            KIEUHOC_TEN: 'Học lần đầu', SOTINCHI_HOCTAP: 3, SOTINCHI_TINHPHI: 3
        };
        Object.keys(them || {}).forEach(function (k) { r[k] = them[k]; });
        return r;
    }
    function loc(rows, o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        return rows.filter(function (r) { return !q || (r.QLSV_NGUOIHOC_MASO + ' ' + r.QLSV_NGUOIHOC_HODEM + ' ' + r.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0; });
    }
    var DA = [
        dong(1, SV[0], HP[0], { PHANTRAMPHITINH: 50, SOTIENPHAINOP: 1275000, NGAYRUT_DD_MM_YYYY: '12/09/2026', NGUOIRUT_TAIKHOAN: 'lan.nt', GHICHU: 'Rút do trùng lịch' }),
        dong(2, SV[1], HP[0], { PHANTRAMPHITINH: 100, SOTIENPHAINOP: 2550000, NGAYRUT_DD_MM_YYYY: '13/09/2026', NGUOIRUT_TAIKHOAN: 'lan.nt', GHICHU: '' }),
        dong(3, SV[2], HP[2], { PHANTRAMPHITINH: 30, SOTIENPHAINOP: 765000, NGAYRUT_DD_MM_YYYY: '15/09/2026', NGUOIRUT_TAIKHOAN: 'hung.nv', GHICHU: 'Đơn xin rút ngày 14/09' })
    ];
    var DK = [
        dong(11, SV[0], HP[1], { DANHAPDIEM: 0, DADIEMDANH: 2 }),
        dong(12, SV[1], HP[1], { DANHAPDIEM: 0, DADIEMDANH: 0 }),
        dong(13, SV[2], HP[0], { DANHAPDIEM: 1, DADIEMDANH: 5 }),
        dong(14, SV[3], HP[2], { DANHAPDIEM: 0, DADIEMDANH: 1 })
    ];
    var DOT = [{ ID: 'TG20261', THOIGIAN: 'Học kỳ 1 năm 2026-2027' }, { ID: 'TG20252', THOIGIAN: 'Học kỳ 2 năm 2025-2026' }];
    var fx = {};
    ['DKH_RutHocPhan/', 'DKH_ApPhiHocPhan/'].forEach(function (c) {
        fx[c + 'LayDSDangKy'] = function (o) { return loc(DK, o); };
        fx[c + 'CapNhatPhanTramTinhPhi'] = { rows: [], message: '' };
        fx[c + (c === 'DKH_RutHocPhan/' ? 'HuyRut' : 'HuyApPhi')] = { rows: [], message: '' };
        fx[c + (c === 'DKH_RutHocPhan/' ? 'ThucHienRut' : 'ThucHienApPhi')] = { rows: [], message: '' };
    });
    fx['DKH_RutHocPhan/LayDSThoiGianRut'] = DOT;
    fx['DKH_ApPhiHocPhan/LayDSThoiGianApPhi'] = DOT;
    fx['DKH_RutHocPhan/LayDSRut'] = function (o) { var r = loc(DA, o); return { rows: r, pager: r.length }; };
    fx['DKH_ApPhiHocPhan/LayDSApPhi'] = function (o) { var r = loc(DA, o); return { rows: r, pager: r.length }; };
    ums.demo.add(fx);
})();
