/* Dữ liệu mẫu cho Giám sát thi (QLTTN) — chỉ dùng ở chế độ dựng thử.
   Đơn vị / đợt thi / đề thi / phần thi / thí sinh / tình huống / vi phạm lấy từ _phongthi.demo.js (Cổng cán bộ, nạp kèm
   _phongthi.js); ở đây chỉ khai lời gọi riêng của màn. */
(function () {
    'use strict';
    function phong(id, ten, mon, ngay, dot, mo, hien, sl) {
        return { ID: id, ROOMNAME: ten, COURSENAME: mon, EXAMDATE: ngay, TENDOTTHI: dot, OPENSTATUS: mo, STATUS: hien, SOLUONGTHISINH: sl,
            TENDONVI: 'Khoa Công nghệ thông tin', DEPARTORGANID: 'DV1', EXAMSTRUCTID: 'CT1', MATKHAUCHOPHONGTHI: 'A7K2Q9', TONGTHOIGIAN: null };
    }
    var PHONG = [
        phong('PT1', 'Phòng máy 301 - A2', 'Tin học đại cương', '06/01/2027', 'Thi cuối kỳ HK1 2026-2027', '1', '1', 4),
        phong('PT2', 'Phòng máy 302 - A2', 'Cơ sở dữ liệu', '06/01/2027', 'Thi cuối kỳ HK1 2026-2027', '0', '1', 3),
        phong('PT3', 'Phòng máy 205 - B1', 'Lập trình hướng đối tượng', '07/01/2027', 'Thi giữa kỳ HK1 2026-2027', '1', '0', 2)
    ];
    ums.demo.add({
        'QLTTN_QuanLyThi/LayDS_ThongTinPhongThi_GST': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var d = PHONG.filter(function (p) {
                return (!o.strTrangThaiPhongThi || p.OPENSTATUS === String(o.strTrangThaiPhongThi)) &&
                    (!o.strStatus || p.STATUS === String(o.strStatus)) &&
                    (!q || (p.ROOMNAME + ' ' + p.COURSENAME).toLowerCase().indexOf(q) >= 0);
            });
            return { rows: d, pager: d.length };
        },
        'QLTTN_QuanLyThi/ThaoTacPhongThi_PhongThi': function (o) {
            PHONG.forEach(function (p) {
                if (p.ID !== o.strExamRoomInfoId) return;
                if (o.strThaoTacPhongThi === 'MOPHONGTHI') p.OPENSTATUS = '1';
                if (o.strThaoTacPhongThi === 'DONGPHONGTHI') p.OPENSTATUS = '0';
                if (o.strThaoTacPhongThi === 'ANPHONGTHI') p.STATUS = '0';
                if (o.strThaoTacPhongThi === 'HIENPHONGTHI') p.STATUS = '1';
            });
            return [];
        },
        'TTN_ThiSinh/gen_KetQuaThi': { rows: '<h3>Bài thi trắc nghiệm — Tin học đại cương</h3>' +
            '<p><b>Câu 1.</b> Đơn vị nhỏ nhất của thông tin là gì?<br>A. Byte &nbsp; <u>B. Bit</u> &nbsp; C. Word &nbsp; D. KB — <i>Đúng</i></p>' +
            '<p><b>Câu 2.</b> Giá trị của \\(2^{10}\\) là?<br><u>A. 1024</u> &nbsp; B. 512 &nbsp; C. 2048 &nbsp; D. 100 — <i>Đúng</i></p>' +
            '<p><b>Câu 3.</b> Hệ đếm cơ số 16 dùng bao nhiêu ký số?<br>A. 8 &nbsp; B. 10 &nbsp; <u>C. 12</u> &nbsp; D. 16 — <i>Sai (đáp án D)</i></p>' }
    });
})();
