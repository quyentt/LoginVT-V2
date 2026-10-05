/* Dữ liệu mẫu cho module Bộ đề (quanlybode, taodethucong) — chỉ dùng ở chế độ dựng thử.
   Đơn vị / nhóm câu hỏi / nhóm con / loại / mức độ / câu hỏi / đáp án lấy từ _nhch.demo.js (nạp kèm _nhch.js — id DV01…, GQ01…, GD01…,
   LT01…, MD01…); ở đây khai lời gọi QLTTN_QuanLyBoDe/* và giữ trạng thái trong phiên (thêm / sửa / xoá đổi dữ liệu). */
(function () {
    'use strict';
    var BD = 'QLTTN_QuanLyBoDe/';
    var seq = 500;
    function id(p) { return (p || 'X') + (++seq); }
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function trang(rows, o) {
        var n = Number(o.ItemPerPage) || 10, p = Number(o.PageNumber) || 1;
        return { rows: n >= 1000000 ? rows : rows.slice((p - 1) * n, p * n), pager: rows.length };
    }
    var GHI = { rows: null, message: '' };
    var DV = { DV01: 'Khoa Công nghệ thông tin', DV02: 'Khoa Kinh tế', DV03: 'Bộ môn Toán' };
    var GQ = { GQ01: ['NHCH-LTC', 'Ngân hàng câu hỏi Lập trình C', 'DV01'], GQ02: ['NHCH-CSDL', 'Ngân hàng câu hỏi Cơ sở dữ liệu', 'DV01'],
        GQ03: ['NHCH-KTVM', 'Ngân hàng câu hỏi Kinh tế vi mô', 'DV02'], GQ04: ['NHCH-GT1', 'Ngân hàng câu hỏi Giải tích 1', 'DV03'] };
    var GD = { GD01: 'Chương 1 — Nhập môn', GD02: '1.1 Biến và kiểu dữ liệu', GD03: '1.2 Toán tử', GD04: 'Chương 2 — Cấu trúc điều khiển', GD05: 'Mô hình quan hệ', GD06: 'Giới hạn' };
    var LOAI = { LT01: 'Một lựa chọn', LT02: 'Nhiều lựa chọn', LT03: 'Đúng / Sai từng ý', LT06: 'Điền khuyết' };
    var MUC = { MD01: 'Nhận biết', MD02: 'Thông hiểu', MD03: 'Vận dụng' };

    function boDe(idB, ten, gq, tinh, tong, st) {
        var g = GQ[gq];
        return { ID: idB, NAME: ten, MAVATENNHOM: g[0] + ' - ' + g[1], STATUS: st === undefined ? '1' : st, GROUPQUESTIONID: gq, GROUPQUESTIONNAME: g[1],
            DEPARTORGANID: g[2], DEPARTORGANNAME: DV[g[2]], TINHDIEMTHEOSOCAUTRALOIDUNG: tinh, TONGTHOIGIAN: tong || '' };
    }
    var BO_DE = [
        boDe('CT01', 'Bộ đề Lập trình C — cuối kỳ 40 câu', 'GQ01', '1', ''),
        boDe('CT02', 'Bộ đề Cơ sở dữ liệu — 2 phần, 90 phút', 'GQ02', '0', '90'),
        boDe('CT03', 'Bộ đề Giải tích 1 — thi thử', 'GQ04', '1', '', '0')
    ];
    var PHAN = [
        { ID: 'P01', PARENTID: null, TITLE: 'Phần 1 - Trắc nghiệm', GUIDE: 'Chọn một đáp án đúng cho mỗi câu', TOTALTIME: '45', KIEULAMBAITHI: 'THIONLINE', ORDERS: '1', EXAMSTRUCTID: 'CT01' },
        { ID: 'P02', PARENTID: null, TITLE: 'Phần 2 - Tự luận', GUIDE: 'Trả lời ngắn gọn, đúng trọng tâm', TOTALTIME: '30', KIEULAMBAITHI: 'THITULUANVANBAN', ORDERS: '2', EXAMSTRUCTID: 'CT01' },
        { ID: 'P01A', PARENTID: 'P01', TITLE: 'Nhóm câu dễ', GUIDE: 'Câu nhận biết', TOTALTIME: '15', KIEULAMBAITHI: 'THIONLINE', ORDERS: '1', EXAMSTRUCTID: 'CT01' },
        { ID: 'P03', PARENTID: null, TITLE: 'Trắc nghiệm CSDL', GUIDE: 'Mỗi câu một đáp án', TOTALTIME: '90', KIEULAMBAITHI: 'THIONLINE', ORDERS: '1', EXAMSTRUCTID: 'CT02' }
    ];
    function ct(idC, cau, phan, nhom, loai, muc, trongNH, lay, orders, nhomCT, soNhom) {
        var p = PHAN.filter(function (x) { return x.ID === phan; })[0] || {};
        return { ID: idC, ORDERS: orders, EXAMPARTTILEPARENT: e(p.TITLE), GROUPQUESTIONDETAILNAME: GD[nhom] || '', TEN_CHONMOTTRONGCACNHOM: nhomCT || '',
            SONHOMCON: soNhom || '', QUESTIONTYPENAME: LOAI[loai] || '', LEVELQUESTIONNAME: MUC[muc] || '', SOCAUTRONGNGANHANGCAUHOI: trongNH, NUMBERQUESTION: lay,
            LEVELQUESTIONID: muc, QUESTIONTYPEID: loai, GROUPQUESTIONDETAILID: nhom, EXAMSTRUCTPARTID: phan, EXAMSTRUCTID: cau };
    }
    var CAU_TRUC = [
        ct('CD01', 'CT01', 'P01', 'GD02', 'LT01', 'MD01', 12, 8, '1'),
        ct('CD02', 'CT01', 'P01', 'GD02', 'LT02', 'MD02', 6, 4, '2'),
        ct('CD03', 'CT01', 'P01', 'GD04', 'LT01', 'MD03', 9, 3, '3'),
        ct('CD04', 'CT01', 'P01', '', '', '', '', '', '4', 'Chương 1 — Nhập môn', '2'),
        ct('CD05', 'CT01', 'P02', 'GD03', 'LT06', 'MD02', 5, 1, '1'),
        ct('CD06', 'CT02', 'P03', 'GD05', 'LT01', 'MD01', 20, 15, '1')
    ];
    /* Số câu trong ngân hàng theo nhóm con: [loại, mức, số] */
    var TRONG_NH = { GD02: [['LT01', 'MD01', 12], ['LT02', 'MD02', 6], ['LT01', 'MD03', 2]], GD03: [['LT06', 'MD02', 5], ['LT03', 'MD01', 3]],
        GD04: [['LT01', 'MD03', 9], ['LT01', 'MD01', 4]], GD05: [['LT01', 'MD01', 20]], GD06: [['LT01', 'MD02', 7]], GD01: [['LT01', 'MD01', 2]] };
    var DE_THI = [
        { ID: 'WE01', NAME: 'Đề cuối kỳ LTC 2026', SODETAO: '4', EXAMSTRUCTID: 'CT01' },
        { ID: 'WE02', NAME: 'Đề dự phòng LTC', SODETAO: '2', EXAMSTRUCTID: 'CT01' },
        { ID: 'WE03', NAME: 'Đề CSDL đợt 1', SODETAO: '6', EXAMSTRUCTID: 'CT02' }
    ];
    var THU_CONG = [
        { ID: 'TC01', NAME: 'Đề thủ công LTC — giữa kỳ', SODETAO: '2', GROUPQUESTIONID: 'GQ01', GROUPQUESTIONNAME: GQ.GQ01[1], STATUS: '1', DEPARTORGANID: 'DV01', DEPARTORGANNAME: DV.DV01, EXAMSTRUCTID: 'CT01' },
        { ID: 'TC02', NAME: 'Đề thủ công CSDL — ôn tập', SODETAO: '3', GROUPQUESTIONID: 'GQ02', GROUPQUESTIONNAME: GQ.GQ02[1], STATUS: '1', DEPARTORGANID: 'DV01', DEPARTORGANNAME: DV.DV01, EXAMSTRUCTID: 'CT02' },
        { ID: 'TC03', NAME: 'Đề thủ công Giải tích — nháp', SODETAO: '1', GROUPQUESTIONID: 'GQ04', GROUPQUESTIONNAME: GQ.GQ04[1], STATUS: '0', DEPARTORGANID: 'DV03', DEPARTORGANNAME: DV.DV03, EXAMSTRUCTID: 'CT03' }
    ];
    function chTC(idQ, tc, de, orders, nd, loai, muc, soDa) {
        return { ID: idQ, QUESTIONID: idQ, WRITENEXAMID: tc, DETHITHU: de, ORDERS: orders, CONTENT: nd, SODAPAN: soDa || 4, TENLOAICAUHOI: LOAI[loai], TENMUCDOCAUHOI: MUC[muc],
            PLUSMARK: '1', MINUSMARK: '0', DAODAPAN: '1', STATUS: '1' };
    }
    var CH_TC = [
        chTC('TQ01', 'TC01', '1', '1', '<p>Trong ngôn ngữ C, từ khoá nào dùng để khai báo <b>hằng</b>?</p>', 'LT01', 'MD01'),
        chTC('TQ02', 'TC01', '1', '2', '<p>Toán tử <code>%</code> trong C dùng để làm gì?</p>', 'LT01', 'MD01'),
        chTC('TQ03', 'TC01', '2', '1', '<p>Chọn các phát biểu ĐÚNG về vòng lặp <code>for</code>.</p>', 'LT02', 'MD02', 5),
        chTC('TQ04', 'TC02', '1', '1', '<p>Khoá chính của một quan hệ có thể nhận giá trị NULL không?</p>', 'LT01', 'MD01')
    ];

    function ten(ds, k, v) { return ds.filter(function (r) { return e(r[k]) === e(v); }); }
    function xoaTheoId(ds, o) { var i = ds.findIndex(function (r) { return r.ID === o.strId; }); if (i >= 0) ds.splice(i, 1); return GHI; }
    function htmlDe(tieuDe, mota) {
        return '<div style="text-align:center"><b>TRƯỜNG ĐẠI HỌC DỰNG THỬ</b><br><i>' + tieuDe + '</i></div><p>' + mota + '</p>' +
            '<p><b>Câu 1.</b> Trong ngôn ngữ C, từ khoá nào dùng để khai báo hằng?<br>A. let &nbsp; B. var &nbsp; <u>C. const</u> &nbsp; D. define</p>' +
            '<p><b>Câu 2.</b> Giá trị của \\(2^{10}\\) là?<br><u>A. 1024</u> &nbsp; B. 512 &nbsp; C. 2048 &nbsp; D. 100</p>' +
            '<p><b>Câu 3.</b> Toán tử <code>%</code> dùng để lấy …<br>A. thương &nbsp; <u>B. số dư</u> &nbsp; C. luỹ thừa &nbsp; D. căn</p>';
    }

    var fx = {};
    /* ---- Bộ đề ---- */
    fx[BD + 'LayDS_ExamStruct'] = function (o) {
        var rows = BO_DE.filter(function (r) {
            return (!o.strDepartorganId || r.DEPARTORGANID === o.strDepartorganId) && (!o.strGroupQuestionId || r.GROUPQUESTIONID === o.strGroupQuestionId) &&
                (!o.strStatus || r.STATUS === e(o.strStatus));
        });
        return trang(rows, o);
    };
    fx[BD + 'ThemMoi_ExamStruct'] = function (o) {
        var r = boDe(id('CT'), o.strName, o.strGroupQuestionId, o.strTinhDiemTheoHeSoCauTLDung, o.strTongThoiGian, o.strStatus);
        if (!GQ[o.strGroupQuestionId]) { r.GROUPQUESTIONNAME = 'Nhóm ' + o.strGroupQuestionId; r.MAVATENNHOM = r.GROUPQUESTIONNAME; r.DEPARTORGANNAME = ''; }
        BO_DE.push(r);
        return { rows: null, raw: { Id: r.ID } };
    };
    fx[BD + 'Sua_ExamStruct'] = function (o) {
        ten(BO_DE, 'ID', o.strId).forEach(function (r) {
            r.NAME = o.strName; r.STATUS = o.strStatus; r.TINHDIEMTHEOSOCAUTRALOIDUNG = o.strTinhDiemTheoHeSoCauTLDung; r.TONGTHOIGIAN = o.strTongThoiGian;
            if (GQ[o.strGroupQuestionId]) { r.GROUPQUESTIONID = o.strGroupQuestionId; r.GROUPQUESTIONNAME = GQ[o.strGroupQuestionId][1]; r.MAVATENNHOM = GQ[o.strGroupQuestionId][0] + ' - ' + r.GROUPQUESTIONNAME; }
        });
        return GHI;
    };
    fx[BD + 'Xoa_ExamStruct'] = function (o) { return xoaTheoId(BO_DE, o); };
    /* ---- Phần thi ---- */
    fx['QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart'] = function (o) { return ten(PHAN, 'EXAMSTRUCTID', o.strExamStructId); };
    fx[BD + 'LayDS_drpExamStructPart'] = function (o) { return ten(PHAN, 'EXAMSTRUCTID', o.strExamStructId).filter(function (p) { return p.PARENTID === null; }); };
    fx[BD + 'Them_ExamStructPart'] = function (o) {
        PHAN.push({ ID: id('P'), PARENTID: o.strParentId || null, TITLE: o.strTitle, GUIDE: o.strGuide, TOTALTIME: o.strTotalTime, KIEULAMBAITHI: o.strKieuLamBaiThi, ORDERS: o.strOrders, EXAMSTRUCTID: o.strExamStructId });
        return GHI;
    };
    fx[BD + 'Sua_ExamStructPart'] = function (o) {
        ten(PHAN, 'ID', o.strId).forEach(function (p) { p.TITLE = o.strTitle; p.GUIDE = o.strGuide; p.TOTALTIME = o.strTotalTime; p.KIEULAMBAITHI = o.strKieuLamBaiThi; p.ORDERS = o.strOrders; });
        return GHI;
    };
    fx[BD + 'Xoa_ExamStructPart'] = function (o) {
        for (var i = PHAN.length - 1; i >= 0; i--) if (PHAN[i].ID === o.strId || PHAN[i].PARENTID === o.strId) PHAN.splice(i, 1);
        return GHI;
    };
    /* ---- Ma trận / cấu trúc đề ---- */
    fx[BD + 'LayDS_CauHoiTuNganHang'] = function (o) {
        var ds = TRONG_NH[o.strGroupQuestionDetailId] || [], out = [];
        ds.forEach(function (x) {
            if ((o.strQuestionTypeId && o.strQuestionTypeId !== x[0]) || (o.strLeVelId && o.strLeVelId !== x[1])) return;
            for (var i = 0; i < x[2]; i++) out.push({ QUESTIONTYPEID: x[0], QUESTIONLEVELID: x[1] });
        });
        return out;
    };
    fx[BD + 'LayDS_CauTrucDeThi'] = function (o) {
        return CAU_TRUC.filter(function (r) { return r.EXAMSTRUCTID === o.strExamStructId && (!o.strExamStructPartId || r.EXAMSTRUCTPARTID === o.strExamStructPartId); });
    };
    fx[BD + 'Them_ExamStructDetail'] = function (o) {
        var tong = (TRONG_NH[o.strGroupQuestionDetailId] || []).filter(function (x) { return (!o.strQuestionTypeId || x[0] === o.strQuestionTypeId) && (!o.strLevelQuestionId || x[1] === o.strLevelQuestionId); })
            .reduce(function (a, x) { return a + x[2]; }, 0);
        CAU_TRUC.push(ct(id('CD'), o.strExamstructId, o.strExamStructPartId, o.strGroupQuestionDetailId, o.strQuestionTypeId, o.strLevelQuestionId, tong, o.strNumberQuestion,
            String(ten(CAU_TRUC, 'EXAMSTRUCTID', o.strExamstructId).length + 1)));
        return GHI;
    };
    fx[BD + 'Them_ExamStructTheoNhomCT'] = function (o) {
        CAU_TRUC.push(ct(id('CD'), o.strExamstructId, o.strExamStructPartId, '', '', '', '', '', String(ten(CAU_TRUC, 'EXAMSTRUCTID', o.strExamstructId).length + 1),
            GD[o.strLayGroupQuestionDetailId_CT] || o.strLayGroupQuestionDetailId_CT, o.strSoNhomCon));
        return GHI;
    };
    fx[BD + 'Sua_ExamStructDetail'] = function (o) {
        ten(CAU_TRUC, 'ID', o.strId).forEach(function (r) { r.ORDERS = o.strOrders; if (r.TEN_CHONMOTTRONGCACNHOM) r.SONHOMCON = o.strSoNhomCon; else r.NUMBERQUESTION = o.strNumberQuestion; });
        return GHI;
    };
    fx[BD + 'Xoa_ExamStructDetail'] = function (o) { return xoaTheoId(CAU_TRUC, o); };
    /* ---- Đề thi của bộ đề ---- */
    fx[BD + 'LayDS_WritenExam'] = function (o) { return ten(DE_THI, 'EXAMSTRUCTID', o.strExamStructId); };
    fx[BD + 'Them_WritenExam'] = function (o) { DE_THI.push({ ID: id('WE'), NAME: o.strName, SODETAO: o.strSoDeTao, EXAMSTRUCTID: o.strExamStructId }); return GHI; };
    fx[BD + 'Sua_WritenExam'] = function (o) { ten(DE_THI, 'ID', o.strId).forEach(function (r) { r.NAME = o.strName; }); return GHI; };
    fx[BD + 'Xoa_WritenExam'] = function (o) { return xoaTheoId(DE_THI, o); };
    fx[BD + 'gen_ChiTietDeThiViet'] = function (o) { var d = ten(DE_THI, 'ID', o.strWritenExamId)[0] || {}; return { rows: htmlDe('ĐỀ THI ' + e(d.NAME).toUpperCase(), 'Chi tiết các đề đã sinh (' + e(d.SODETAO) + ' đề).') }; };
    ['gen_InDeThiTuLuanHTMLMau01', 'gen_InDapAnDeThiVietHTMLMau01', 'gen_InDeThiTracNghiemMau01', 'gen_InDapAnDeThiTracNghiemMau01'].forEach(function (k) {
        fx[BD + k] = function (o) { var d = ten(DE_THI, 'ID', o.strWritenExamId)[0] || {}; return { rows: htmlDe(k.replace('gen_', '') + ' — ' + e(d.NAME), 'Mẫu in dựng thử (HTML do máy chủ trả).') }; };
    });
    /* ---- Đề thi thủ công ---- */
    fx[BD + 'LayDS_DeThiThuCong'] = function (o) {
        var rows = THU_CONG.filter(function (r) {
            return (!o.strDepartorganId || r.DEPARTORGANID === o.strDepartorganId) && (!o.strGroupQuestionId || r.GROUPQUESTIONID === o.strGroupQuestionId) &&
                (!o.strStatus || r.STATUS === e(o.strStatus));
        });
        return trang(rows, o);
    };
    fx[BD + 'Them_DeThiThuCong'] = function (o) {
        var g = GQ[o.strGroupQuestionId] || ['', 'Nhóm ' + o.strGroupQuestionId, o.strDepartOrganId];
        THU_CONG.push({ ID: id('TC'), NAME: o.strName, SODETAO: o.strSoDeTao, GROUPQUESTIONID: o.strGroupQuestionId, GROUPQUESTIONNAME: g[1], STATUS: o.strStatus,
            DEPARTORGANID: o.strDepartOrganId, DEPARTORGANNAME: DV[o.strDepartOrganId] || '', EXAMSTRUCTID: '' });
        return GHI;
    };
    fx[BD + 'Sua_DeThiThuCong'] = function (o) {
        ten(THU_CONG, 'ID', o.strId).forEach(function (r) {
            r.NAME = o.strName; r.SODETAO = o.strSoDeTao; r.STATUS = o.strStatus;
            if (GQ[o.strGroupQuestionId]) { r.GROUPQUESTIONID = o.strGroupQuestionId; r.GROUPQUESTIONNAME = GQ[o.strGroupQuestionId][1]; }
        });
        return GHI;
    };
    fx[BD + 'Xoa_DeThiThuCong'] = function (o) { return xoaTheoId(THU_CONG, o); };
    fx[BD + 'LayDS_CacDeThi'] = function (o) { var n = Number(o.strSoDeTao) || 0, out = []; for (var i = 1; i <= n; i++) out.push({ DeThiThu: String(i) }); return out; };
    fx[BD + 'LayDS_CauHoiDeThiThuCong'] = function (o) {
        return trang(CH_TC.filter(function (r) { return r.WRITENEXAMID === o.strWritenExamId && r.DETHITHU === e(o.strDeThiThu); }), o);
    };
    fx[BD + 'Them_CauHoiDeThiThuCong'] = function (o) {
        var da = CH_TC.filter(function (r) { return r.WRITENEXAMID === o.strWritenExamId && r.DETHITHU === e(o.strDethithu); });
        if (da.some(function (r) { return r.QUESTIONID === o.strQuestionId; })) return GHI;    // đã có trong đề: dữ liệu mẫu bỏ qua
        CH_TC.push(chTC(o.strQuestionId, o.strWritenExamId, e(o.strDethithu), String(da.length + 1), '<p>Câu hỏi ' + o.strQuestionId + ' (thêm từ ngân hàng)</p>', 'LT01', 'MD01'));
        return GHI;
    };
    fx[BD + 'Sua_CauHoiDeThiThuCong'] = function (o) { ten(CH_TC, 'ID', o.strId).forEach(function (r) { r.ORDERS = o.strOrders; }); return GHI; };
    fx[BD + 'Xoa_CauHoiDeThiThuCong'] = function (o) { return xoaTheoId(CH_TC, o); };
    fx[BD + 'gen_DeThiThuCongThu'] = function (o) { var d = ten(THU_CONG, 'ID', o.strWritenExamId)[0] || {}; return { rows: htmlDe('ĐỀ THI THỦ CÔNG — ' + e(d.NAME) + ' (đề ' + e(o.strDeThiThuCongThu) + ')', 'Câu hỏi theo thứ tự Order đã khai.') }; };
    fx['SYS_Report/ThemMoi'] = { rows: null, message: 'BC-DEMO-BODE' };
    ums.demo.add(fx);
})();
