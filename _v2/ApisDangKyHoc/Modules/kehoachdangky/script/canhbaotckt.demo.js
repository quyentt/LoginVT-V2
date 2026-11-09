/* Dữ liệu mẫu cho canhbaotckt — chỉ dùng ở chế độ dựng thử. Tên cột chép từ bản gốc.
   Bốn khoá dùng chung với màn khác (LayDSDangKyHoc / LayDSDangKyHocDoCanBo của lophocphan, LayDSThoiGianRut / LayDSRut của _hp,
   LayDanhSach của kehoachdangky) chỉ thêm khi màn kia CHƯA nạp — không ghi đè dữ liệu mẫu của họ. */
(function () {
    'use strict';
    var fx = (ums.demo && ums.demo.fixtures) || {};
    function trang(rows, o) {
        var pi = Number(o.pageIndex) || 1, ps = Number(o.pageSize) || 10;
        return { rows: rows.slice((pi - 1) * ps, pi * ps), pager: rows.length };
    }
    function tuKhoa(rows, q, cot) {
        q = String(q || '').toLowerCase();
        return !q ? rows : rows.filter(function (r) { return cot.some(function (c) { return String(r[c] || '').toLowerCase().indexOf(q) >= 0; }); });
    }
    var A = String.fromCharCode(4);   // máy chủ thay '@' bằng ký tự mã 4 trong MAILTO

    /* Kế hoạch: KH01 đăng ký 04/08–17/08/2025 (08:00–17:30), rút từ 08/09/2025 + 14 ngày; KH02 đăng ký 25/08–31/08/2025 */
    var KH = [
        { ID: 'KH01', MAKEHOACH: 'DKH-2526-HK1-D1', TENKEHOACH: 'Đăng ký học kỳ 1 năm học 2025-2026 (đợt 1)',
            NGAYBATDAU: '04/08/2025', GIODANGKYTRONGNGAYDAU: 8, PHUTDANGKYTRONGNGAYDAU: 0, NGAYKETTHUC: '17/08/2025', GIOKETTHUCTRONGNGAYCUOI: 17, PHUTKETTHUCTRONGNGAYCUOI: 30,
            NGAYBATDAUTINHRUTHOCPHAN: '08/09/2025', SONGAYDUOCPHEPRUTHOCPHAN: 14 },
        { ID: 'KH02', MAKEHOACH: 'DKH-2526-HK1-D2', TENKEHOACH: 'Đăng ký bổ sung học kỳ 1 năm học 2025-2026',
            NGAYBATDAU: '25/08/2025', GIODANGKYTRONGNGAYDAU: 8, PHUTDANGKYTRONGNGAYDAU: 0, NGAYKETTHUC: '31/08/2025', GIOKETTHUCTRONGNGAYCUOI: 17, PHUTKETTHUCTRONGNGAYCUOI: 0,
            NGAYBATDAUTINHRUTHOCPHAN: '', SONGAYDUOCPHEPRUTHOCPHAN: '' }
    ];
    var DOT = [{ ID: 'TG251', THOIGIAN: 'Học kỳ 1 năm học 2025-2026' }, { ID: 'TG243', THOIGIAN: 'Học kỳ hè năm học 2024-2025' }];
    var HP = [['IT3100', 'Lập trình hướng đối tượng'], ['IT3090', 'Cơ sở dữ liệu'], ['MI1111', 'Giải tích I'], ['EM1010', 'Quản trị học đại cương']];
    var HO = ['Nguyễn Văn', 'Trần Thị', 'Lê Hoàng', 'Phạm Minh', 'Hoàng Thị', 'Vũ Đức', 'Đặng Thu', 'Bùi Quang'];
    var TEN = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hải', 'Hương', 'Khánh'];
    /* Thời điểm đăng ký: xen kẽ trong đợt (04–17/08), ngoài đợt (20/08, 02/09, 19/09) và một dòng không đọc được */
    var TD = ['05/08/2025 09:12:05', '20/08/2025 14:03:10', '12/08/2025 16:40:00', '02/09/2025 08:15:30', '17/08/2025 17:29:59', '19/09/2025 10:05:00', '', '28/08/2025 09:00:00'];
    var DK = [];
    for (var k = 0; k < 23; k++) {
        var hp = HP[k % 4];
        DK.push({
            ID: 'DK' + (500 + k), QLSV_NGUOIHOC_ID: 'SV' + (1000 + k), QLSV_NGUOIHOC_MASO: 'BIT2' + (20100 + k * 7),
            QLSV_NGUOIHOC_HODEM: HO[k % 8], QLSV_NGUOIHOC_TEN: TEN[(k * 3) % 8],
            DAOTAO_HOCPHAN_ID: 'HP0' + (k % 4 + 1), DAOTAO_HOCPHAN_TEN: hp[1], DAOTAO_HOCPHAN_MA: hp[0],
            DANGKY_LOPHOCPHAN_ID: 'LHP' + (100 + k % 8), DANGKY_LOPHOCPHAN_MA: hp[0] + '.' + (k % 3 + 1), DANGKY_LOPHOCPHAN_TEN: hp[1] + ' - Nhóm ' + (k % 3 + 1),
            NGAYTAO_DD_MM_YYYY_HHMMSS: TD[k % 8], NGUOITAO_TAIKHOAN: k % 3 ? 'sv.' + (20100 + k * 7) : 'canbo.dkh',
            HANHDONG_XACNHAN_TEN: k % 5 === 2 ? 'Đồng ý' : '', DANGKY_KEHOACHDANGKY_ID: k % 7 === 6 ? 'KH02' : 'KH01', DAOTAO_THOIGIANDAOTAO_ID: 'TG251',
            DAOTAO_LOPQUANLY_TEN: 'CNTT' + (66 + k % 2) + '.0' + (1 + k % 3), DAOTAO_CHUONGTRINH_TEN: k % 2 ? 'Kỹ thuật phần mềm' : 'Công nghệ thông tin',
            KIEUHOC_TEN: k % 4 === 3 ? 'Học lại' : 'Học lần đầu', SOTINCHI: 3
        });
    }
    function locDK(rows, o) {
        var r = tuKhoa(rows, o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_TEN', 'QLSV_NGUOIHOC_HODEM', 'DAOTAO_HOCPHAN_TEN', 'DAOTAO_HOCPHAN_MA']);
        if (o.strDangKy_KeHoachDangKy_Id) r = r.filter(function (x) { return x.DANGKY_KEHOACHDANGKY_ID === o.strDangKy_KeHoachDangKy_Id; });
        if (o.strDaoTao_ThoiGianDaoTao_Id) r = r.filter(function (x) { return x.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id; });
        return trang(r, o);
    }
    /* Rút học phần: NGAYRUT trong cửa sổ rút (08/09 + 14 ngày) và ngoài */
    var NR = ['10/09/2025', '25/09/2025', '15/09/2025', '03/10/2025', '21/09/2025'];
    var RUT = [];
    for (var j = 0; j < 9; j++) {
        var h2 = HP[j % 4];
        RUT.push({
            ID: 'RHP' + (700 + j), QLSV_NGUOIHOC_ID: 'SV' + (1000 + j), QLSV_NGUOIHOC_MASO: 'BIT2' + (20100 + j * 7),
            QLSV_NGUOIHOC_HODEM: HO[j % 8], QLSV_NGUOIHOC_TEN: TEN[(j * 3) % 8],
            DAOTAO_HOCPHAN_ID: 'HP0' + (j % 4 + 1), DAOTAO_HOCPHAN_TEN: h2[1], DAOTAO_HOCPHAN_MA: h2[0], DSLOPHOCPHAN: h2[0] + '.' + (j % 3 + 1),
            NGAYRUT_DD_MM_YYYY: NR[j % 5], NGUOIRUT_TAIKHOAN: j % 2 ? 'lan.nt' : 'hung.nv', PHANTRAMPHITINH: j % 2 ? 50 : 100,
            DANGKY_KEHOACHDANGKY_ID: j === 8 ? '' : 'KH01', DAOTAO_THOIGIANDAOTAO_ID: 'TG251', GHICHU: ''
        });
    }

    /* Mẫu email + lịch sử gửi (chỉ của mẫu MA_MAU) */
    var MAU = { ID: 'CT-TCKT', MA: 'DKH_CANHBAO_THAYDOI_NGOAIDOT', TENEMAILHIENTHI: 'Hệ thống Quản lý đào tạo',
        TIEUDE: '[CẢNH BÁO] Thay đổi đăng ký/rút học phần ngoài thời gian chính thức',
        NOIDUNG: '<p>Kính gửi Phòng Tài chính - Kế toán,</p><p>Hệ thống ghi nhận có thay đổi đăng ký/rút học phần của sinh viên diễn ra ngoài khoảng thời gian đăng ký/rút chính thức của đợt.</p><p>Trân trọng.</p>',
        DANHSACHNHANEMAIL: 'tckt@eaut.edu.vn; ketoan.hocphi@eaut.edu.vn', GHICHU: 'Tạo từ trang Gửi cảnh báo TC-KT' };
    var LS = [], TT = ['1', '1', '2', '0', '1'];
    for (var i = 0; i < 7; i++) {
        LS.push({ ID: 'Q' + (900 + i), CAUTRUC: MAU.ID, MAILTO: 'tckt' + A + 'eaut.edu.vn', MAILSUBJECT: MAU.TIEUDE,
            NOIDUNGEMAIL: MAU.NOIDUNG.replace('Trân trọng.', 'Sinh viên ' + HO[i % 8] + ' ' + TEN[(i * 3) % 8] + ' (' + DK[i].QLSV_NGUOIHOC_MASO + ') — ' + HP[i % 4][1] + '.</p><p>Trân trọng.'),
            NGAYGUI: (20 + i % 5) + '/09/2025 0' + (8 + i % 2) + ':1' + i + ':00', DAGUI: TT[i % 5], LOIGUIMAIL: TT[i % 5] === '2' ? '550 5.1.1 Mailbox unavailable' : '',
            NGUOITAO_TAIKHOAN: i % 3 ? 'canbo.dkh' : 'phong.dt' });
    }

    var them = {};
    function neuChua(k, val) { if (!fx.hasOwnProperty(k)) them[k] = val; }
    neuChua('PKG_DANGKYHOC_THONGTIN2.LayDSDangKyHocDoCanBo', function (o) { return locDK(DK.filter(function (x) { return x.NGUOITAO_TAIKHOAN === 'canbo.dkh'; }), o); });
    neuChua('pkg_dangkyhoc_thongtin2.LayDSDangKyHoc', function (o) { return locDK(DK, o); });
    neuChua('DKH_RutHocPhan/LayDSThoiGianRut', DOT);
    neuChua('DKH_RutHocPhan/LayDSRut', function (o) {
        var r = tuKhoa(RUT, o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_TEN', 'DAOTAO_HOCPHAN_TEN']);
        if (o.strDaoTao_ThoiGianDaoTao_Id) r = r.filter(function (x) { return x.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id; });
        return { rows: r, pager: r.length };
    });
    neuChua('DKH_KeHoachDangKy/LayDanhSach', function (o) { return trang(tuKhoa(KH, o.strTuKhoa, ['MAKEHOACH', 'TENKEHOACH']), o); });

    them['CMS_TienIch/LayDS_CauTrucNoiDungGuiEmail'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return !q || MAU.MA.toLowerCase().indexOf(q) >= 0 ? [MAU] : [];
    };
    them['CMS_TienIch/Them_CauTrucNoiDungGuiEmail'] = function (o) { capNhatMau(o); return { rows: [], raw: { Id: MAU.ID } }; };
    them['CMS_TienIch/Sua_CauTrucNoiDungGuiEmail'] = function (o) { capNhatMau(o); return []; };
    function capNhatMau(o) {
        MAU.TENEMAILHIENTHI = o.strTenEmailHienThi; MAU.TIEUDE = o.strTieuDe; MAU.NOIDUNG = o.strNoiDung;
        MAU.DANHSACHNHANEMAIL = o.strDanhSachNhanEmail; MAU.GHICHU = o.strGhiChu;
    }
    them['CMS_TienIch/LayDS_TienTrinhGuiEmail'] = function (o) {
        var r = LS.filter(function (x) { return !o.strCauTrucNoiDungGuiEmailId || x.CAUTRUC === o.strCauTrucNoiDungGuiEmailId; });
        if (o.strDaGui !== undefined && o.strDaGui !== '') r = r.filter(function (x) { return x.DAGUI === String(o.strDaGui); });
        if (o.strNguoiTao_Id) r = r.filter(function (x) { return x.NGUOITAO_TAIKHOAN === 'canbo.dkh'; });
        var q = String(o.strTuKhoa || '').toLowerCase();
        if (q) r = r.filter(function (x) { return (x.MAILTO.replace(A, '@') + ' ' + x.NOIDUNGEMAIL).toLowerCase().indexOf(q) >= 0; });
        return trang(r, o);
    };
    /* Gửi theo mẫu: thêm một dòng lịch sử "Thành công" cho thay đổi vừa gửi */
    them['CMS_TienIch/ThucHienGuiEmailTheoCauTruc'] = function (o) {
        var dong = DK.concat(RUT).filter(function (x) { return x.ID === o.strDuLieuId; })[0];
        var d = new Date();
        function p2(n) { return (n < 10 ? '0' : '') + n; }
        LS.unshift({ ID: 'Q' + (1000 + LS.length), CAUTRUC: MAU.ID, MAILTO: 'tckt' + A + 'eaut.edu.vn', MAILSUBJECT: MAU.TIEUDE,
            NOIDUNGEMAIL: MAU.NOIDUNG + (dong ? '<p>' + dong.QLSV_NGUOIHOC_HODEM + ' ' + dong.QLSV_NGUOIHOC_TEN + ' (' + dong.QLSV_NGUOIHOC_MASO + ') — ' + dong.DAOTAO_HOCPHAN_TEN + '</p>' : ''),
            NGAYGUI: p2(d.getDate()) + '/' + p2(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds()),
            DAGUI: '1', LOIGUIMAIL: '', NGUOITAO_TAIKHOAN: 'canbo.dkh' });
        return { rows: [], message: 'Đã đưa vào hàng đợi gửi email' };
    };
    /* Gửi lại: các dòng đã chọn đổi thành "Thành công" */
    them['CMS_TienIch/ThucHienGuiEmail'] = function (o) {
        String(o.ArrstrId || '').split(',').forEach(function (id) { LS.forEach(function (x) { if (x.ID === id) { x.DAGUI = '1'; x.LOIGUIMAIL = ''; } }); });
        return { rows: [], message: 'Đã yêu cầu gửi lại' };
    };

    ums.demo.add(them);
})();
