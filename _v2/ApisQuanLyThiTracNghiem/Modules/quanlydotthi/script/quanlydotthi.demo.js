/* Dữ liệu mẫu cho Quản lý đợt thi (thi trắc nghiệm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function kd(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    var seq = 10;
    var DOT = [
        ['DT01', 'Thi cuối kỳ HK1 2026-2027', '2026-2027', 'HK1', '1', '10', '1', '1'],
        ['DT02', 'Thi giữa kỳ HK1 2026-2027', '2026-2027', 'HK1', '1', '10', '1', '1'],
        ['DT03', 'Thi thử tin học đầu vào K21', '2026-2027', 'HK1', '2', '10', '0', '1'],
        ['DT04', 'Thi cuối kỳ HK2 2025-2026', '2025-2026', 'HK2', '1', '10', '1', '0'],
        ['DT05', 'Thi chuẩn đầu ra ngoại ngữ đợt 3', '2025-2026', 'HK3', '1', '100', '1', '1']
    ].map(function (x) {
        return { ID: x[0], NAME: x[1], SCHOOLYEAR: x[2], SEMESTER: x[3], SODIEMLE: x[4], THANGDIEM: x[5], EXAMSCHEDULETYPE: x[6], STATUS: x[7] };
    });
    var TG = [{ ID: 'TG1', THOIGIAN: '2026-2027_1' }, { ID: 'TG2', THOIGIAN: '2025-2026_2' }, { ID: 'TG3', THOIGIAN: '2025-2026_1' }];
    var XLT = {
        TG1: [{ ID: 'X11', TEN: 'Đợt 1 - Thi kết thúc học phần HK1 2026-2027' }, { ID: 'X12', TEN: 'Đợt 2 - Thi lại HK1 2026-2027' }],
        TG2: [{ ID: 'X21', TEN: 'Đợt 1 - Thi kết thúc học phần HK2 2025-2026' }],
        TG3: []
    };
    function tim(id) { return DOT.filter(function (r) { return r.ID === id; })[0]; }

    ums.demo.add({
        'QLTTN_ThongTin/LayDS_ThonTinDotThi': function (o) {
            var q = kd(o.strTuKhoa), rows = DOT.filter(function (r) {
                return (!o.strStatus || r.STATUS === String(o.strStatus)) && (!q || kd(r.NAME + ' ' + r.SCHOOLYEAR + ' ' + r.SEMESTER).indexOf(q) >= 0);
            });
            var sz = Number(o.ItemPerPage) || 10, p = Number(o.PageNumber) || 1;
            return { rows: rows.slice((p - 1) * sz, p * sz), pager: rows.length };
        },
        'QLTTN_ThongTin/Them_ThongTinDotThi': function (o) {
            var id = 'DT' + (++seq);
            DOT.unshift({ ID: id, NAME: o.strName, SCHOOLYEAR: o.strSchoolyear, SEMESTER: o.strSemester, SODIEMLE: o.strSoDiemLe,
                THANGDIEM: o.strThangDiem, EXAMSCHEDULETYPE: o.strExamscheduleType, STATUS: o.strStatus });
            return { rows: [], message: id };
        },
        'QLTTN_ThongTin/Sua_ThongTinDotThi': function (o) {
            var r = tim(o.strId);
            if (r) { r.NAME = o.strName; r.SCHOOLYEAR = o.strSchoolyear; r.SEMESTER = o.strSemester; r.SODIEMLE = o.strSoDiemLe;
                r.THANGDIEM = o.strThangDiem; r.EXAMSCHEDULETYPE = o.strExamscheduleType; r.STATUS = o.strStatus; }
            return [];
        },
        'QLTTN_ThongTin/Xoa_ThongTinDotThi': function (o) {
            var i = DOT.indexOf(tim(o.strId));
            if (i >= 0) DOT.splice(i, 1);
            return [];
        },
        'TP_Chung/LayThoiGian': TG,
        'QLTTN_QuanLyThi/LayDanhSach_DotThi': function (o) { return XLT[o.strDaoTao_ThoiGianDaoTao_Id] || []; },
        'QLTTN_ThongTin/Import_ThongTinDotThi': function (o) {
            DOT.unshift({ ID: 'DT' + (++seq), NAME: o.strName, SCHOOLYEAR: o.strSchoolyear, SEMESTER: o.strSemester, SODIEMLE: o.strSoDiemLe,
                THANGDIEM: o.strThangDiem, EXAMSCHEDULETYPE: o.strExamscheduleType, STATUS: o.strStatus });
            return [];
        }
    });
})();
