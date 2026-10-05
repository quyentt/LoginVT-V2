/* Dữ liệu mẫu cho Quản lý phúc tra, phúc khảo — chỉ dùng ở chế độ dựng thử.
   Đơn vị / đợt thi / đề thi / phần thi / báo cáo lấy từ _phongthi.demo.js (Cổng cán bộ, nạp kèm _phongthi.js);
   ở đây chỉ khai lời gọi riêng của màn. */
(function () {
    'use strict';
    function phong(id, ten, mon, ngay, dot, mo, hien, sl) {
        return { ID: id, ROOMNAME: ten, COURSENAME: mon, EXAMDATE: ngay, TENDOTTHI: dot, OPENSTATUS: mo, STATUS: hien, SOLUONGTHISINH: sl,
            TENDONVI: 'Khoa Công nghệ thông tin', DEPARTORGANID: 'DV1', EXAMSTRUCTID: 'CT1', MATKHAUCHOPHONGTHI: 'A7K2Q9' };
    }
    var PHONG = [
        phong('PT1', 'Phòng máy 301 - A2', 'Tin học đại cương', '06/01/2027', 'Thi cuối kỳ HK1 2026-2027', '0', '1', 4),
        phong('PT2', 'Phòng máy 302 - A2', 'Cơ sở dữ liệu', '06/01/2027', 'Thi cuối kỳ HK1 2026-2027', '1', '1', 3),
        phong('PT3', 'Phòng máy 205 - B1', 'Lập trình hướng đối tượng', '07/01/2027', 'Thi giữa kỳ HK1 2026-2027', '0', '0', 2),
        phong('PT4', 'Phòng máy 206 - B1', 'Mạng máy tính', '08/01/2027', 'Thi cuối kỳ HK1 2026-2027', '0', '1', 3)
    ];
    function ts(id, ma, ten, o) {
        return Object.assign({ ID: id, USERID: 'U' + id, STUDENTCODE: ma, FULLNAME: ten, BIRTHDATE_USER: '12/03/2006', SOBAODANHIMPORT: 'SBD' + id.slice(-2),
            MARK: '7.5', MARKPHUCTRA: '', GHICHUPHUCTRA: '', TIMERCOUNTDOWN: '-1', TIMERSHOW: 0, THOIGIANCONLAI: 0, FINISHED: '1',
            STATUS: '', TIMESTARTDOEXAM_TEXT: '07:31', TIMEHHMISSSTARTDOEXAM: '07:31:05', TENMAYDADANGNHAP: 'PM3-' + id.slice(-2) }, o || {});
    }
    var TS = [
        ts('TS01', 'BIT220101', 'Nguyễn Văn An', { MARK: '8.5', MARKPHUCTRA: '9', GHICHUPHUCTRA: 'Chấm lại câu 12' }),
        ts('TS02', 'BIT220102', 'Trần Thị Bình', { MARK: '6' }),
        ts('TS03', 'BIT220103', 'Lê Minh Cường', { MARK: '', FINISHED: '0', TIMESTARTDOEXAM_TEXT: '', TIMEHHMISSSTARTDOEXAM: '', TENMAYDADANGNHAP: '' }),
        ts('TS04', 'BIT220104', 'Phạm Thu Dung', { MARK: '4.5', MARKPHUCTRA: '5', GHICHUPHUCTRA: 'Đơn phúc khảo số 18' })
    ];
    ums.demo.add({
        'QLTTN_QuanLyThi/LayDS_ThongTinPhongThi': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var d = PHONG.filter(function (p) {
                return (!o.strTrangThaiPhongThi || p.OPENSTATUS === String(o.strTrangThaiPhongThi)) &&
                    (!o.strStatus || p.STATUS === String(o.strStatus)) &&
                    (!q || (p.ROOMNAME + ' ' + p.COURSENAME).toLowerCase().indexOf(q) >= 0);
            });
            return { rows: d, pager: d.length };
        },
        'QLTTN_QuanLyThi/LayDS_ChiTietPhongThi_KetQua': function (o) {
            var d = o.strExamRoomInfoId === 'PT3' ? TS.slice(0, 2) : TS;
            return { rows: d, pager: d.length };
        },
        'QLTTN_QuanLyThi/save_DiemPhucTra': function (o) {
            TS.forEach(function (r) { if (r.ID === o.strId) { r.MARKPHUCTRA = o.strMarkPhucTra; r.GHICHUPHUCTRA = o.strGhiChuPhucTra; } });
            return [];
        },
        'TTN_ThiSinh/gen_KetQuaThi': { rows: '<h3>Bài thi trắc nghiệm — Tin học đại cương</h3>' +
            '<p><b>Câu 1.</b> Đơn vị nhỏ nhất của thông tin là gì?<br>A. Byte &nbsp; <u>B. Bit</u> &nbsp; C. Word &nbsp; D. KB — <i>Đúng</i></p>' +
            '<p><b>Câu 2.</b> Phím tắt lưu tệp trong Word?<br><u>A. Ctrl+S</u> &nbsp; B. Ctrl+P &nbsp; C. Ctrl+O &nbsp; D. Ctrl+N — <i>Đúng</i></p>' +
            '<p><b>Câu 3.</b> Hệ đếm cơ số 16 dùng bao nhiêu ký số?<br>A. 8 &nbsp; B. 10 &nbsp; <u>C. 12</u> &nbsp; D. 16 — <i>Sai (đáp án D)</i></p>' }
    });
})();
