/* Dữ liệu mẫu cho Lịch rút học phần — chỉ dùng ở chế độ dựng thử.
   Ngày rút đặt TƯƠNG ĐỐI so với hôm nay để lưới tuần / lịch tháng luôn có ô sáng khi mở màn.
   Cùng khoá fixture với kehoachdangky/_hp.demo.js (DKH_RutHocPhan/*), hình dạng trả về giống nhau. */
(function () {
    'use strict';

    function p2(n) { return (n < 10 ? '0' : '') + n; }
    function ngay(lech) {
        var d = new Date(); d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + lech);
        return p2(d.getDate()) + '/' + p2(d.getMonth() + 1) + '/' + d.getFullYear();
    }
    /* [id, mã, họ đệm, tên, lớp, chương trình, khoá, trạng thái, hệ] */
    var SV = [
        ['NH01', 'BIT220263', 'Nguyễn Văn', 'An', 'K66-KTPM1', 'Kỹ thuật phần mềm', 'Khóa 66', 'Đang học', 'H1'],
        ['NH02', 'BIT220271', 'Trần Thị', 'Bình', 'K66-KTPM1', 'Kỹ thuật phần mềm', 'Khóa 66', 'Đang học', 'H1'],
        ['NH03', 'BBA220561', 'Lê Minh', 'Châu', 'K66-QTKD2', 'Quản trị kinh doanh', 'Khóa 66', 'Đang học', 'H1'],
        ['NH04', 'BIT230210', 'Phạm Thu', 'Dung', 'K67-HTTT1', 'Hệ thống thông tin', 'Khóa 67', 'Bảo lưu', 'H1'],
        ['NH05', 'BIT230388', 'Hoàng Đức', 'Em', 'K67-KTPM2', 'Kỹ thuật phần mềm', 'Khóa 67', 'Đang học', 'H1'],
        ['NH06', 'LBA210045', 'Vũ Hải', 'Yến', 'LT21-QTKD', 'Quản trị kinh doanh', 'Khóa LT21', 'Đang học', 'H2']
    ];
    /* [id, mã, tên, lớp học phần, tín học tập, tín tính phí] */
    var HP = [
        ['HP01', 'IT3100', 'Lập trình hướng đối tượng', 'IT3100.01', 3, 3],
        ['HP02', 'IT3080', 'Mạng máy tính', 'IT3080.02', 3, 3],
        ['HP03', 'EM1010', 'Quản trị học đại cương', 'EM1010.03', 2, 2],
        ['HP04', 'IT4409', 'Công nghệ Web và dịch vụ trực tuyến', 'IT4409.01, IT4409.02', 2, 3],
        ['HP05', 'MI1111', 'Giải tích I', 'MI1111.05', 4, 4]
    ];
    var DOT = [{ ID: 'TG20261', THOIGIAN: '2026_2027_1,1' }, { ID: 'TG20252', THOIGIAN: '2025_2026_2,1' }];

    var n = 0;
    function dong(sv, hp, lech, pt, nguoi, ghiChu, dotId, kieuHoc) {
        n++;
        var tinPhi = hp[5], tien = Math.round(tinPhi * 850000 * (pt / 100));
        return {
            ID: 'D' + n, QLSV_NGUOIHOC_ID: sv[0], QLSV_NGUOIHOC_MASO: sv[1], QLSV_NGUOIHOC_HODEM: sv[2], QLSV_NGUOIHOC_TEN: sv[3],
            DAOTAO_LOPQUANLY_TEN: sv[4], DAOTAO_CHUONGTRINH_TEN: sv[5], DAOTAO_KHOADAOTAO_TEN: sv[6], QLSV_TRANGTHAINGUOIHOC_TEN: sv[7],
            DAOTAO_HEDAOTAO_ID: sv[8],
            THOIGIAN: dotId === 'TG20261' ? 'Học kỳ 1 năm 2026-2027' : 'Học kỳ 2 năm 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: dotId,
            DANGKY_KEHOACHDANGKY_ID: 'KH01',
            DAOTAO_HOCPHAN_ID: hp[0], DAOTAO_HOCPHAN_MA: hp[1], DAOTAO_HOCPHAN_TEN: hp[2], DSLOPHOCPHAN: hp[3],
            KIEUHOC_TEN: kieuHoc || 'Học lần đầu', SOTINCHI_HOCTAP: hp[4], SOTINCHI_TINHPHI: tinPhi,
            PHANTRAMPHITINH: pt, SOTIENPHAINOP: tien,
            NGAYRUT_DD_MM_YYYY: lech === null ? '' : ngay(lech), NGUOIRUT_TAIKHOAN: nguoi, GHICHU: ghiChu || ''
        };
    }
    var DA = [
        /* tuần này */
        dong(SV[0], HP[0], 0, 50, 'lan.nt', 'Rút do trùng lịch', 'TG20261'),
        dong(SV[0], HP[3], 0, 50, 'lan.nt', '', 'TG20261'),
        dong(SV[1], HP[0], 0, 100, 'lan.nt', '', 'TG20261'),
        dong(SV[2], HP[2], -1, 30, 'hung.nv', 'Đơn xin rút', 'TG20261'),
        dong(SV[4], HP[1], -1, 100, 'hung.nv', '', 'TG20261', 'Học lại'),
        dong(SV[3], HP[4], -2, 0, 'lan.nt', 'Bảo lưu học kỳ', 'TG20261'),
        dong(SV[3], HP[1], -2, 0, 'lan.nt', 'Bảo lưu học kỳ', 'TG20261'),
        dong(SV[5], HP[2], 1, 50, 'hung.nv', '', 'TG20261'),
        /* tuần trước */
        dong(SV[1], HP[3], -8, 100, 'lan.nt', '', 'TG20261'),
        dong(SV[2], HP[0], -9, 50, 'lan.nt', '', 'TG20261', 'Học cải thiện'),
        dong(SV[4], HP[4], -9, 100, 'hung.nv', '', 'TG20261'),
        /* tháng trước */
        dong(SV[0], HP[1], -31, 100, 'lan.nt', '', 'TG20261'),
        /* không có ngày rút → không lên lịch, có cảnh báo */
        dong(SV[5], HP[4], null, 100, 'hung.nv', 'Thiếu ngày rút trong CSDL', 'TG20261'),
        /* đợt cũ */
        dong(SV[0], HP[2], -120, 100, 'lan.nt', '', 'TG20252'),
        dong(SV[2], HP[4], -121, 50, 'lan.nt', '', 'TG20252')
    ];

    function loc(o) {
        var q = String(o.strTuKhoa || '').toLowerCase(), dot = o.strDaoTao_ThoiGianDaoTao_Id || '', he = o.strDaoTao_HeDaoTao_Id || '';
        return DA.filter(function (r) {
            if (dot && r.DAOTAO_THOIGIANDAOTAO_ID !== dot) return false;
            if (he && r.DAOTAO_HEDAOTAO_ID !== he) return false;
            return !q || (r.QLSV_NGUOIHOC_MASO + ' ' + r.QLSV_NGUOIHOC_HODEM + ' ' + r.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0;
        });
    }

    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông đại học' }],
        'DKH_RutHocPhan/LayDSThoiGianRut': DOT,
        'DKH_RutHocPhan/LayDSRut': function (o) { var r = loc(o); return { rows: r, pager: r.length }; }
    });
})();
