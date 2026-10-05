/* Dữ liệu mẫu cho module Ngân hàng câu hỏi (quanlynganhangcauhoi, viewquanlynganhangcauhoi, nhapnganhangcauhoi) —
   chỉ dùng ở chế độ dựng thử. Có trạng thái: thêm / sửa / xoá / chuyển / đưa vào NH đề đổi dữ liệu trong phiên. */
(function () {
    'use strict';
    var NH = 'QLTTN_QuanLyNganHangCauHoi/';
    var seq = 100;
    function id(p) { return (p || 'X') + (++seq); }
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function trang(rows, o) {
        var n = Number(o.ItemPerPage) || 10, p = Number(o.PageNumber) || 1;
        return { rows: n >= 1000000 ? rows : rows.slice((p - 1) * n, p * n), pager: rows.length };
    }

    var donVi = [{ ID: 'DV01', NAME: 'Khoa Công nghệ thông tin' }, { ID: 'DV02', NAME: 'Khoa Kinh tế' }, { ID: 'DV03', NAME: 'Bộ môn Toán' }];
    var nhomLon = [
        { ID: 'GQ01', GROUPQUESTIONCODE: 'NHCH-LTC', GROUPQUESTIONNAME: 'Ngân hàng câu hỏi Lập trình C', GROUPQUESTIONSTATUS: '1', DEPARTORGANID: 'DV01', DEPARTORGANNAME: 'Khoa Công nghệ thông tin' },
        { ID: 'GQ02', GROUPQUESTIONCODE: 'NHCH-CSDL', GROUPQUESTIONNAME: 'Ngân hàng câu hỏi Cơ sở dữ liệu', GROUPQUESTIONSTATUS: '1', DEPARTORGANID: 'DV01', DEPARTORGANNAME: 'Khoa Công nghệ thông tin' },
        { ID: 'GQ03', GROUPQUESTIONCODE: 'NHCH-KTVM', GROUPQUESTIONNAME: 'Ngân hàng câu hỏi Kinh tế vi mô', GROUPQUESTIONSTATUS: '0', DEPARTORGANID: 'DV02', DEPARTORGANNAME: 'Khoa Kinh tế' },
        { ID: 'GQ04', GROUPQUESTIONCODE: 'NHCH-GT1', GROUPQUESTIONNAME: 'Ngân hàng câu hỏi Giải tích 1', GROUPQUESTIONSTATUS: '1', DEPARTORGANID: 'DV03', DEPARTORGANNAME: 'Bộ môn Toán' }
    ];
    var nhomCon = [
        { ID: 'GD01', PARENTID: '', NAME: 'Chương 1 — Nhập môn', CODE: 'C1', GROUPQUESTIONID: 'GQ01', TAPHOPCACCAUHOI: '0', STATUS: '1', CONTENT: '<p>Câu hỏi chương 1: khái niệm cơ bản.</p>' },
        { ID: 'GD02', PARENTID: 'GD01', NAME: '1.1 Biến và kiểu dữ liệu', CODE: 'C1.1', GROUPQUESTIONID: 'GQ01', TAPHOPCACCAUHOI: '0', STATUS: '1', CONTENT: '' },
        { ID: 'GD03', PARENTID: 'GD01', NAME: '1.2 Toán tử', CODE: 'C1.2', GROUPQUESTIONID: 'GQ01', TAPHOPCACCAUHOI: '1', STATUS: '1', CONTENT: '<p>Đọc đoạn mã sau và trả lời các câu hỏi bên dưới.</p>' },
        { ID: 'GD04', PARENTID: '', NAME: 'Chương 2 — Cấu trúc điều khiển', CODE: 'C2', GROUPQUESTIONID: 'GQ01', TAPHOPCACCAUHOI: '0', STATUS: '1', CONTENT: '' },
        { ID: 'GD05', PARENTID: '', NAME: 'Mô hình quan hệ', CODE: 'QH', GROUPQUESTIONID: 'GQ02', TAPHOPCACCAUHOI: '0', STATUS: '1', CONTENT: '' },
        { ID: 'GD06', PARENTID: '', NAME: 'Giới hạn', CODE: 'GH', GROUPQUESTIONID: 'GQ04', TAPHOPCACCAUHOI: '0', STATUS: '1', CONTENT: '' }
    ];
    var loai = [
        { ID: 'LT01', NAME: 'Một lựa chọn', CODE: 'BESTANSWER' }, { ID: 'LT02', NAME: 'Nhiều lựa chọn', CODE: 'MULTICHOICE' },
        { ID: 'LT03', NAME: 'Đúng / Sai từng ý', CODE: 'TRUEFALSE' }, { ID: 'LT04', NAME: 'Đúng / Sai một ý', CODE: 'TRUEFALSEONE' },
        { ID: 'LT05', NAME: 'Ghép đôi', CODE: 'CROSSLINK' }, { ID: 'LT06', NAME: 'Điền khuyết', CODE: 'FILLTHEBLANK' },
        { ID: 'LT07', NAME: 'Tự luận ngắn', CODE: 'FREETEXT' }, { ID: 'LT08', NAME: 'Kéo thả đáp án', CODE: 'KEOTHAXUONGDAPAN' }
    ];
    var muc = [{ ID: 'MD01', NAME: 'Nhận biết', CODE: 'NB' }, { ID: 'MD02', NAME: 'Thông hiểu', CODE: 'TH' }, { ID: 'MD03', NAME: 'Vận dụng', CODE: 'VD' }];
    function tenLoai(idL) { var r = loai.filter(function (x) { return x.ID === idL; })[0]; return r ? r : loai[0]; }
    function tenMuc(idM) { var r = muc.filter(function (x) { return x.ID === idM; })[0]; return r ? r.NAME : ''; }

    /* Câu hỏi thật + tạm, đáp án, vế 2 — dựng bằng hàm để đủ cột máy chủ trả */
    var cauHoi = [], dapAn = [], ve2 = [];
    var cauHoiTam = [], dapAnTam = [], ve2Tam = [];
    function themCH(kho, o) {
        var l = tenLoai(o.loai);
        var r = { ID: id('Q'), ORDERNUMBER: e(o.stt), CONTENT: o.nd, SODAPAN: 0, TENLOAICAUHOI: l.NAME, QUESTIONTYPECODE: l.CODE, QUESTIONTYPEID: l.ID,
            TENMUCDOCAUHOI: tenMuc(o.muc), QUESTIONLEVELID: o.muc, PLUSMARK: e(o.cong === undefined ? 1 : o.cong), MINUSMARK: e(o.tru || 0), DAODAPAN: e(o.dao === undefined ? 1 : o.dao),
            STATUS: e(o.tt === undefined ? 1 : o.tt), TINHDIEMTHEOSOY: e(o.soy || 0), THOIGIAN: e(o.tg || 60), SOLUOTDATHI_CHUALUU: o.thi || 0, SOLUOTDATHI_DALUU: o.thi2 || 0,
            GROUPQUESTIONDETAILID: o.nhom, MUCPHEDUYETID: o.mpd || '' };
        kho.push(r);
        return r;
    }
    function themDA(kho, q, ds) {
        var abc = 'ABCDEFGH';
        ds.forEach(function (a, i) {
            kho.push({ ID: id('A'), QUESTIONID: q.ID, ORDERS: a.tt === undefined ? String(i + 1) : a.tt, ORDERABC: abc[i] + '. ', CONTENT: a.nd, CONTENT2: a.nd2 || '',
                CORRECT: a.dung ? '1' : '0', FIXVITRI: a.fix ? '1' : '0', MARK: e(a.diem || ''), ANSWER_SENCONDID: a.ve2 || '' });
        });
        q.SODAPAN = ds.length;
    }
    var q;
    q = themCH(cauHoi, { nhom: 'GD02', stt: 1, loai: 'LT01', muc: 'MD01', nd: '<p>Trong ngôn ngữ C, từ khoá nào dùng để khai báo <b>hằng</b>?</p>', thi: 12, thi2: 30 });
    themDA(dapAn, q, [{ nd: '<p>const</p>', dung: 1 }, { nd: '<p>static</p>' }, { nd: '<p>define</p>' }, { nd: '<p>final</p>' }]);
    q = themCH(cauHoi, { nhom: 'GD02', stt: 2, loai: 'LT02', muc: 'MD02', nd: '<p>Những kiểu dữ liệu nào là kiểu <i>số nguyên</i> trong C?</p>', soy: 1, thi: 4 });
    themDA(dapAn, q, [{ nd: '<p>int</p>', dung: 1 }, { nd: '<p>float</p>' }, { nd: '<p>long</p>', dung: 1 }, { nd: '<p>double</p>' }]);
    q = themCH(cauHoi, { nhom: 'GD02', stt: 3, loai: 'LT03', muc: 'MD02', nd: '<p>Xét các phát biểu về biến trong C:</p>' });
    themDA(dapAn, q, [{ nd: '<p>Tên biến phân biệt hoa thường</p>', dung: 1 }, { nd: '<p>Tên biến được bắt đầu bằng chữ số</p>' }]);
    q = themCH(cauHoi, { nhom: 'GD02', stt: 4, loai: 'LT06', muc: 'MD03', nd: '<p>Biểu thức $\\sqrt{x^2 + y^2}$ trong C viết là ______.</p>', tt: 0 });
    themDA(dapAn, q, [{ nd: '<p>Hàm cần dùng:</p>', nd2: 'sqrt(x*x + y*y)' }]);
    q = themCH(cauHoi, { nhom: 'GD02', stt: '', loai: 'LT05', muc: 'MD02', nd: '<p>Ghép toán tử với tên gọi:</p>' });
    themDA(dapAn, q, [{ nd: '<p>%</p>', tt: '' }, { nd: '<p>&amp;&amp;</p>' }]);
    ve2.push({ ID: 'V201', QUESTIONID: q.ID, ORDERS: '1', CONTENT: 'Chia lấy dư' }, { ID: 'V202', QUESTIONID: q.ID, ORDERS: '2', CONTENT: 'Và logic' }, { ID: 'V203', QUESTIONID: q.ID, ORDERS: '3', CONTENT: 'Hoặc logic' });
    dapAn.filter(function (a) { return a.QUESTIONID === q.ID; }).forEach(function (a, i) { a.ANSWER_SENCONDID = i === 0 ? 'V201' : 'V202'; });
    q = themCH(cauHoi, { nhom: 'GD02', stt: 6, loai: 'LT07', muc: 'MD03', nd: '<p>Trình bày ngắn gọn khác biệt giữa <code>int</code> và <code>unsigned int</code>.</p>', cong: 2 });
    themDA(dapAn, q, [{ nd: '<p>Đáp án gợi ý: unsigned không có dấu, miền giá trị 0..2^32-1</p>', diem: '2' }]);
    q = themCH(cauHoi, { nhom: 'GD03', stt: 1, loai: 'LT08', muc: 'MD02', nd: '<p>Kéo từ vào chỗ trống: <span class="draggable-word">++</span> <span class="draggable-word">--</span></p><p>Toán tử tăng một đơn vị là ____.</p>' });
    themDA(dapAn, q, [{ nd: '<p>Chỗ trống 1</p>', nd2: '$++$' }]);
    q = themCH(cauHoi, { nhom: 'GD04', stt: 1, loai: 'LT01', muc: 'MD01', nd: '<p>Câu lệnh nào dừng vòng lặp sớm?</p>', thi: 2 });
    themDA(dapAn, q, [{ nd: '<p>break</p>', dung: 1 }, { nd: '<p>continue</p>' }, { nd: '<p>return 0</p>' }]);
    q = themCH(cauHoi, { nhom: 'GD05', stt: 1, loai: 'LT01', muc: 'MD01', nd: '<p>Khoá chính (primary key) có thể nhận giá trị NULL?</p>' });
    themDA(dapAn, q, [{ nd: '<p>Không</p>', dung: 1 }, { nd: '<p>Có</p>' }]);
    q = themCH(cauHoi, { nhom: 'GD06', stt: 1, loai: 'LT01', muc: 'MD02', nd: '<p>Tính $\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$.</p>' });
    themDA(dapAn, q, [{ nd: '<p>$1$</p>', dung: 1 }, { nd: '<p>$0$</p>' }, { nd: '<p>$+\\infty$</p>' }]);
    for (var i = 2; i <= 13; i++) {
        q = themCH(cauHoi, { nhom: 'GD06', stt: i, loai: 'LT01', muc: 'MD0' + (1 + (i % 3)), nd: '<p>Câu hỏi giới hạn số ' + i + ': $\\lim_{n\\to\\infty} \\left(1+\\frac{1}{n}\\right)^{n' + i + '}$ bằng?</p>' });
        themDA(dapAn, q, [{ nd: '<p>$e^{' + i + '}$</p>', dung: 1 }, { nd: '<p>$' + i + '$</p>' }, { nd: '<p>$0$</p>' }]);
    }
    // câu hỏi tạm (import chờ duyệt)
    q = themCH(cauHoiTam, { nhom: 'GD02', stt: 1, loai: 'LT01', muc: 'MD01', nd: '<p>[Tạm] Kích thước kiểu <code>char</code> là bao nhiêu byte?</p>', mpd: 'MPD01' });
    themDA(dapAnTam, q, [{ nd: '<p>1</p>', dung: 1 }, { nd: '<p>2</p>' }, { nd: '<p>4</p>' }]);
    q = themCH(cauHoiTam, { nhom: 'GD02', stt: 2, loai: 'LT02', muc: 'MD02', nd: '<p>[Tạm] Chọn các hàm nhập xuất chuẩn:</p>', mpd: 'MPD01' });
    themDA(dapAnTam, q, [{ nd: '<p>printf</p>', dung: 1 }, { nd: '<p>scanf</p>', dung: 1 }, { nd: '<p>cout</p>' }]);
    q = themCH(cauHoiTam, { nhom: 'GD02', stt: 3, loai: 'LT05', muc: 'MD02', nd: '<p>[Tạm] Ghép thư viện với hàm:</p>', mpd: 'MPD02' });
    themDA(dapAnTam, q, [{ nd: '<p>stdio.h</p>' }, { nd: '<p>math.h</p>' }]);
    ve2Tam.push({ ID: 'V2T1', QUESTIONID: q.ID, ORDERS: '1', CONTENT: 'printf' }, { ID: 'V2T2', QUESTIONID: q.ID, ORDERS: '2', CONTENT: 'sqrt' });
    q = themCH(cauHoiTam, { nhom: 'GD04', stt: 1, loai: 'LT01', muc: 'MD01', nd: '<p>[Tạm] Vòng lặp nào kiểm tra điều kiện sau?</p>', mpd: 'MPD01' });
    themDA(dapAnTam, q, [{ nd: '<p>do…while</p>', dung: 1 }, { nd: '<p>while</p>' }, { nd: '<p>for</p>' }]);

    var tep = [
        { ID: 'F01', DULIEU_ID: 'GD01', TENHIENTHI: 'doc-doan-van.mp3', DUONGDAN: 'Upload/Files/Audio/doc-doan-van.mp3' },
        { ID: 'F02', DULIEU_ID: cauHoi[0].ID, TENHIENTHI: 'cau-hoi-1.mp3', DUONGDAN: 'Upload/Files/QuestionAudio/cau-hoi-1.mp3' }
    ];
    var mucPD = [{ ID: 'MPD01', NAME: 'Giảng viên nhập', ORDERS: '1' }, { ID: 'MPD02', NAME: 'Bộ môn duyệt', ORDERS: '2' }];

    function locNhomLon(o) {
        return nhomLon.filter(function (r) { return (!o.strDepartorganId || r.DEPARTORGANID === o.strDepartorganId) && (!o.strStatus || r.GROUPQUESTIONSTATUS === o.strStatus); });
    }
    function locCauHoi(kho, o) {
        var q = e(o.strTuKhoa).toLowerCase();
        return kho.filter(function (r) {
            return r.GROUPQUESTIONDETAILID === o.strGroupQuestionDetailId && (!o.strStatus || r.STATUS === o.strStatus) &&
                (!o.strQuestionTypeId || r.QUESTIONTYPEID === o.strQuestionTypeId) && (!o.strLeVelId || r.QUESTIONLEVELID === o.strLeVelId) &&
                (!q || r.CONTENT.toLowerCase().indexOf(q) >= 0);
        });
    }
    function luuCH(kho, o) {
        var r = kho.filter(function (x) { return x.ID === o.strId; })[0];
        var l = tenLoai(o.strQuestionTypeId);
        if (!r) { r = themCH(kho, { nhom: o.strGroupQuestionDetailId, loai: o.strQuestionTypeId, muc: o.strLevelId, nd: '' }); }
        Object.assign(r, { CONTENT: e(o.strContent), STATUS: e(o.strStatus), PLUSMARK: e(o.strPlusMark), MINUSMARK: e(o.strMinusMark), QUESTIONTYPEID: l.ID, TENLOAICAUHOI: l.NAME,
            QUESTIONTYPECODE: l.CODE, QUESTIONLEVELID: e(o.strLevelId), TENMUCDOCAUHOI: tenMuc(o.strLevelId), DAODAPAN: e(o.strDaoDapAn), ORDERNUMBER: e(o.strOrderNumber),
            TINHDIEMTHEOSOY: e(o.strTinhDiemTheoSoY), THOIGIAN: e(o.strThoiGian), MUCPHEDUYETID: e(o.strMucPheDuyetId || r.MUCPHEDUYETID) });
        return { rows: [], raw: { Id: r.ID } };
    }
    function luuDA(kho, khoCH, o) {
        var r = kho.filter(function (x) { return x.ID === o.strId; })[0];
        if (!r) {
            r = { ID: id('A'), QUESTIONID: o.strQuestionId, ORDERABC: '' };
            kho.push(r);
            var ds = kho.filter(function (x) { return x.QUESTIONID === o.strQuestionId; });
            ds.forEach(function (a, i) { a.ORDERABC = 'ABCDEFGH'[i] + '. '; });
            khoCH.filter(function (x) { return x.ID === o.strQuestionId; }).forEach(function (x) { x.SODAPAN = ds.length; });
        }
        Object.assign(r, { CONTENT: e(o.strContent), CORRECT: e(o.strCorrect), CONTENT2: e(o.strContent2), ANSWER_SENCONDID: e(o.strAnswer_SencondId), ORDERS: e(o.strOrders), FIXVITRI: e(o.strFixViTri), MARK: e(o.strMark) });
        return { rows: [], raw: { Id: r.ID } };
    }
    function luuV2(kho, o) {
        var r = kho.filter(function (x) { return x.ID === o.strId; })[0];
        if (!r) { r = { ID: id('V2'), QUESTIONID: o.strQuestionId }; kho.push(r); }
        Object.assign(r, { CONTENT: e(o.strContent), ORDERS: e(o.strOrders) });
        return { rows: [], raw: { Id: r.ID } };
    }
    function xoa(kho, ids) { var s = e(ids).split(','); for (var i = kho.length - 1; i >= 0; i--) if (s.indexOf(kho[i].ID) >= 0) kho.splice(i, 1); return []; }
    function xemTruoc(khoCH, khoDA, khoV2, o) {
        var ids = e(o.strId).split(',');
        var qs = khoCH.filter(function (x) { return ids.indexOf(x.ID) >= 0; });
        return {
            rsQuestion: qs.map(function (x) { return { QUESTIONID: x.ID, QUESTIONTYPECODE: x.QUESTIONTYPECODE, GUIDE: 'Chọn phương án đúng', CONTENT: x.CONTENT }; }),
            rsAnswer: khoDA.filter(function (a) { return ids.indexOf(a.QUESTIONID) >= 0; }).map(function (a) { return { QUESTIONID: a.QUESTIONID, ANSWERID: a.ID, ORDERABC: a.ORDERABC, CONTENT: a.CONTENT, CONTENT2: a.CONTENT2, CORRECT: a.CORRECT, STUDENTANSWER_SENCOND_ID: '', STUDENTANSWERCONTENT2: '' }; }),
            rsAnswerSecond: khoV2.filter(function (v) { return ids.indexOf(v.QUESTIONID) >= 0; }).map(function (v) { return { QUESTIONID: v.QUESTIONID, ANSWER_SENCONDID: v.ID, CONTENT: v.CONTENT }; })
        };
    }
    function nhapTep(o) {
        var ok = [], loiDs = [];
        for (var i = 1; i <= 3; i++) {
            var r = themCH(cauHoiTam, { nhom: o.GroupQuestionDetailId, stt: i, loai: o.strQuestionTypeId || 'LT01', muc: 'MD01', nd: '<p>[Import] Câu hỏi số ' + i + ' từ tệp</p>', mpd: o.MucPheDuyetId });
            themDA(dapAnTam, r, [{ nd: '<p>Đáp án A</p>', dung: 1 }, { nd: '<p>Đáp án B</p>' }]);
            ok.push({ STT: i, NOIDUNG: 'Câu hỏi số ' + i + ' từ tệp', SODAPAN: 2 });
        }
        loiDs.push({ STT: 4, NOIDUNG: 'Câu hỏi số 4', LOI: 'Thiếu đáp án đúng' });
        return { rows: { Table1: loiDs, Table2: ok }, message: '3 câu hỏi' };
    }

    var fx = {
        'QLTTN_ThongTin/LayDS_DonViByUserId': donVi,
        'QLTTN_ThongTin/LayDS_MucPheDuyetAdmin': 'MPD02',
        'QLTTN_ThongTin/LayDS_MucPheDuyetByDonViUserId': function (o) { return o.strDonViId === 'DV02' ? [] : mucPD; },
        'QLTTN_Files/LayDanhSach': function (o) { return tep.filter(function (f) { return f.DULIEU_ID === o.strDuLieu_Id; }); },
        'QLTTN_Files/Xoa': function (o) { return xoa(tep, o.strIds); },
        'QLTTN_Files/ThemMoi': function (o) { tep.push({ ID: id('F'), DULIEU_ID: o.strDuLieu_Id, TENHIENTHI: o.strTenHienThi, DUONGDAN: o.strFileMinhChung }); return []; },
        'QLTTN_QuanLyThi/LayDS_NamHoc': [{ SCHOOLYEAR: '2025-2026' }, { SCHOOLYEAR: '2024-2025' }],
        'QLTTN_QuanLyThi/LayDS_HocKyBySchoolYear': [{ SEMESTER: '1' }, { SEMESTER: '2' }],
        'QLTTN_QuanLyThi/LayDS_DoThiByHocKy': [{ ID: 'DT01', NAME: 'Đợt thi giữa kỳ' }, { ID: 'DT02', NAME: 'Đợt thi cuối kỳ' }],
        'QLTTN_QuanLyThi/LayDS_HocPhan_TheoDotThi': { Table: [{ ID: 'HP01', TEN: 'Lập trình C', MA: 'IT101' }, { ID: 'HP02', TEN: 'Cơ sở dữ liệu', MA: 'IT201' }] },
        'TTN_ThiSinh/get_TinhLaiDiemThiSinh': '8.5',
        'SYS_Report/ThemMoi': { rows: [], message: 'BC-DEMO' }
    };
    fx[NH + 'LayDS_GroupQuestion'] = function (o) { return trang(locNhomLon(o), o); };
    fx[NH + 'LayDS_PhanQuyenGroupQuestion'] = function (o) { return trang(locNhomLon(o).filter(function (r) { return r.DEPARTORGANID !== 'DV03'; }), o); };
    fx[NH + 'ThemMoi_GroupQuestion'] = function (o) {
        var dv = donVi.filter(function (d) { return d.ID === o.strDepartOrganId; })[0];
        var r = { ID: id('GQ'), GROUPQUESTIONCODE: o.strCode, GROUPQUESTIONNAME: o.strName, GROUPQUESTIONSTATUS: e(o.strStatus), DEPARTORGANID: o.strDepartOrganId, DEPARTORGANNAME: dv ? dv.NAME : '' };
        nhomLon.push(r); return { rows: [], raw: { ID: r.ID } };
    };
    fx[NH + 'CapNhat_GroupQuestion'] = function (o) { nhomLon.forEach(function (r) { if (r.ID === o.strId) { r.GROUPQUESTIONCODE = o.strCode; r.GROUPQUESTIONNAME = o.strName; r.GROUPQUESTIONSTATUS = e(o.strStatus); } }); return { rows: [], raw: { ID: o.strId } }; };
    fx[NH + 'Xoa_GroupQuestion'] = function (o) { return xoa(nhomLon, o.strId); };
    fx[NH + 'LayDS_GroupQuestionDetail'] = fx[NH + 'LayDS_TreeGroupQuestionDetail'] = function (o) { return nhomCon.filter(function (r) { return r.GROUPQUESTIONID === o.strGroupQuestionId; }); };
    fx[NH + 'ThemMoi_GroupQuestionDetail'] = function (o) { nhomCon.push({ ID: id('GD'), PARENTID: e(o.strParentId), NAME: o.strName, CODE: o.strCode, GROUPQUESTIONID: o.strGroupQuestionId, TAPHOPCACCAUHOI: e(o.strTapHopCacCauHoi), STATUS: '1', CONTENT: '' }); return []; };
    fx[NH + 'CapNhat_GroupQuestionDetail'] = function (o) { nhomCon.forEach(function (r) { if (r.ID === o.strId) { r.PARENTID = e(o.strParentId); r.NAME = o.strName; r.CODE = o.strCode; r.TAPHOPCACCAUHOI = e(o.strTapHopCacCauHoi); } }); return []; };
    fx[NH + 'Xoa_GroupQuestionDetail'] = function (o) { return xoa(nhomCon, o.strId); };
    fx[NH + 'Sua_ContentGroupQuestionDetail'] = function (o) { nhomCon.forEach(function (r) { if (r.ID === o.strId) { r.CONTENT = e(o.strContent); r.STATUS = e(o.strStatus); } }); return []; };
    fx[NH + 'LayDS_LoaiCauHoi'] = loai;
    fx[NH + 'LayDS_MucDoCauHoi'] = muc;
    fx[NH + 'LayDS_CauHoi'] = function (o) { return trang(locCauHoi(cauHoi, o), o); };
    fx[NH + 'LayDS_CauHoi_Temp'] = function (o) { return trang(locCauHoi(cauHoiTam, o).filter(function (r) { return !o.strMucPheDuyetId || r.MUCPHEDUYETID === o.strMucPheDuyetId; }), o); };
    fx[NH + 'LayDS_DapAn_All'] = function (o) { var ids = cauHoi.filter(function (x) { return x.GROUPQUESTIONDETAILID === o.strGroupQuestionDetailId; }).map(function (x) { return x.ID; }); return dapAn.filter(function (a) { return ids.indexOf(a.QUESTIONID) >= 0; }); };
    fx[NH + 'LayDS_DapAn_All_Temp'] = function (o) { var ids = cauHoiTam.filter(function (x) { return x.GROUPQUESTIONDETAILID === o.strGroupQuestionDetailId; }).map(function (x) { return x.ID; }); return dapAnTam.filter(function (a) { return ids.indexOf(a.QUESTIONID) >= 0; }); };
    fx[NH + 'LayDS_AnswerByQuestionId'] = function (o) { return dapAn.filter(function (a) { return a.QUESTIONID === o.strQuestionId; }); };
    fx[NH + 'LayDS_AnswerTempByQuestionId'] = function (o) { return dapAnTam.filter(function (a) { return a.QUESTIONID === o.strQuestionId; }); };
    fx[NH + 'LayDS_Answer_Sencond'] = function (o) { return ve2.filter(function (a) { return a.QUESTIONID === o.strQuestionId; }); };
    fx[NH + 'LayDS_Answer_SencondTemp'] = function (o) { return ve2Tam.filter(function (a) { return a.QUESTIONID === o.strQuestionId; }); };
    fx[NH + 'ThemMoi_Question'] = fx[NH + 'Sua_Question'] = function (o) { return luuCH(cauHoi, o); };
    fx[NH + 'ThemMoi_QuestionTemp'] = fx[NH + 'Sua_QuestionTemp'] = function (o) { return luuCH(cauHoiTam, o); };
    fx[NH + 'Xoa_Question'] = function (o) { return xoa(cauHoi, o.strId); };
    fx[NH + 'Xoa_QuestionTemp'] = function (o) { return xoa(cauHoiTam, o.strId); };
    fx[NH + 'CapNhatTinhTrang_Question'] = function (o) { cauHoi.forEach(function (r) { if (r.ID === o.strId) r.STATUS = e(o.strStatus); }); return []; };
    fx[NH + 'Chuyen_Question'] = function (o) { cauHoi.forEach(function (r) { if (r.ID === o.strId) r.GROUPQUESTIONDETAILID = o.strGroupQuestionDetailId; }); return []; };
    fx[NH + 'Update_Question_STT'] = function (o) { cauHoi.forEach(function (r) { if (r.ID === o.strId) { r.ORDERNUMBER = e(o.strOrderNumber); r.TINHDIEMTHEOSOY = e(o.strTinhDiemTheoSoY); } }); return []; };
    fx[NH + 'Update_Question_Temp_STT'] = function (o) { cauHoiTam.forEach(function (r) { if (r.ID === o.strId) { r.ORDERNUMBER = e(o.strOrderNumber); r.TINHDIEMTHEOSOY = e(o.strTinhDiemTheoSoY); } }); return []; };
    fx[NH + 'DuaCauHoiTmpVaoNH'] = function (o) {
        var r = cauHoiTam.filter(function (x) { return x.ID === o.strId; })[0];
        if (!r) return [];
        xoa(cauHoiTam, r.ID); cauHoi.push(r);
        dapAnTam.filter(function (a) { return a.QUESTIONID === r.ID; }).forEach(function (a) { dapAn.push(a); });
        xoa(dapAnTam, dapAnTam.filter(function (a) { return a.QUESTIONID === r.ID; }).map(function (a) { return a.ID; }).join(','));
        return [];
    };
    fx[NH + 'Duyet_QuestionTemp'] = fx[NH + 'KhongDuyet_QuestionTemp'] = function () { return []; };
    fx[NH + 'ThemMoi_Answer'] = fx[NH + 'Sua_Answer'] = function (o) { return luuDA(dapAn, cauHoi, o); };
    fx[NH + 'ThemMoi_AnswerTemp'] = fx[NH + 'Sua_AnswerTemp'] = function (o) { return luuDA(dapAnTam, cauHoiTam, o); };
    fx[NH + 'Xoa_Answer'] = function (o) { return xoa(dapAn, o.strId); };
    fx[NH + 'Xoa_AnswerTemp'] = function (o) { return xoa(dapAnTam, o.strId); };
    fx[NH + 'ThemMoi_Answer_Sencond'] = fx[NH + 'Sua_Answer_Sencond'] = function (o) { return luuV2(ve2, o); };
    fx[NH + 'ThemMoi_Answer_SencondTemp'] = fx[NH + 'Sua_Answer_SencondTemp'] = function (o) { return luuV2(ve2Tam, o); };
    fx[NH + 'Xoa_Answer_Sencond'] = function (o) { return xoa(ve2, o.strId); };
    fx[NH + 'Xoa_Answer_SencondTemp'] = function (o) { return xoa(ve2Tam, o.strId); };
    fx[NH + 'LayDS_PreviewCauHoi'] = function (o) { return /Temp/.test(e(o.strZone)) ? xemTruoc(cauHoiTam, dapAnTam, ve2Tam, o) : xemTruoc(cauHoi, dapAn, ve2, o); };
    fx[NH + 'ImportNganHangCauHoi_Temp_Doc'] = fx[NH + 'ImportNganHangCauHoi_Temp_LaTeX'] = nhapTep;
    fx[NH + 'LayDS_CauHoiDaTaoDe'] = function (o) {
        var ts = [
            { STUDENTID: 'SV01', STUDENTEXAMROOMID: 'SER01', EXAMROOMINFOID: 'ER01', STUDENTQUESTIONID: 'SQ01', MASINHVIEN: 'BIT220101', HODEM: 'Nguyễn Văn', TEN: 'An', EXAMDATE: '12/03/2026', GIOTHI: '07:30', ROOMNAME: 'Phòng máy 1', FINISHED: '1', TIMESTARTDOEXAM: '07:31', TIMEFINISHED: '08:10', DiemCongNhan: '8', MARK: '8' },
            { STUDENTID: 'SV02', STUDENTEXAMROOMID: 'SER02', EXAMROOMINFOID: 'ER01', STUDENTQUESTIONID: 'SQ02', MASINHVIEN: 'BIT220102', HODEM: 'Trần Thị', TEN: 'Bình', EXAMDATE: '12/03/2026', GIOTHI: '07:30', ROOMNAME: 'Phòng máy 1', FINISHED: '0', TIMESTARTDOEXAM: '', TIMEFINISHED: '', DiemCongNhan: '', MARK: '' },
            { STUDENTID: 'SV03', STUDENTEXAMROOMID: 'SER03', EXAMROOMINFOID: 'ER02', STUDENTQUESTIONID: 'SQ03', MASINHVIEN: 'BIT220103', HODEM: 'Lê Minh', TEN: 'Châu', EXAMDATE: '13/03/2026', GIOTHI: '09:30', ROOMNAME: 'Phòng máy 2', FINISHED: '1', TIMESTARTDOEXAM: '09:31', TIMEFINISHED: '10:05', DiemCongNhan: '6.5', MARK: '6.5' }
        ].filter(function (r) { return !o.strExamRoomInfoId || r.EXAMROOMINFOID === o.strExamRoomInfoId; });
        return { rows: { Table: ts, Table1: [{ STUDENTID: 'SV01', ORDERS: '1', CONTENT: 'const' }, { STUDENTID: 'SV03', ORDERS: '2', CONTENT: 'static' }],
            Table2: [{ ID: 'ER01', ROOMNAME: 'Phòng máy 1' }, { ID: 'ER02', ROOMNAME: 'Phòng máy 2' }] }, pager: ts.length };
    };
    fx[NH + 'LayDS_LichSuCauHoi'] = function (o) {
        var r = cauHoi.filter(function (x) { return x.ID === o.strQuestionId; })[0] || cauHoi[0];
        return [
            { ORDERS: r.ORDERNUMBER, ORDERS_LS: r.ORDERNUMBER, CONTENT: r.CONTENT, CONTENT_LS: '<p>Nội dung cũ của câu hỏi</p>', TENLOAICAUHOI: r.TENLOAICAUHOI, TENLOAICAUHOI_LS: r.TENLOAICAUHOI, TENMUCDOCAUHOI: r.TENMUCDOCAUHOI, TENMUCDOCAUHOI_LS: 'Nhận biết', DIEMCONGTRU: r.PLUSMARK + '/' + r.MINUSMARK, DIEMCONGTRU_LS: '1/0', DAODAPAN: r.DAODAPAN, DAODAPAN_LS: '0', STATUS: r.STATUS, STATUS_LS: r.STATUS, NGAYSUA: '02/10/2026 09:12', TAIKHOANSUA: 'gv.nguyenvana', HANHDONG: 'Sửa' },
            { ORDERS: r.ORDERNUMBER, ORDERS_LS: r.ORDERNUMBER, CONTENT: r.CONTENT, CONTENT_LS: r.CONTENT, TENLOAICAUHOI: r.TENLOAICAUHOI, TENLOAICAUHOI_LS: r.TENLOAICAUHOI, TENMUCDOCAUHOI: r.TENMUCDOCAUHOI, TENMUCDOCAUHOI_LS: r.TENMUCDOCAUHOI, DIEMCONGTRU: r.PLUSMARK + '/' + r.MINUSMARK, DIEMCONGTRU_LS: r.PLUSMARK + '/' + r.MINUSMARK, DAODAPAN: r.DAODAPAN, DAODAPAN_LS: r.DAODAPAN, STATUS: r.STATUS, STATUS_LS: r.STATUS, NGAYSUA: '15/09/2026 14:40', TAIKHOANSUA: 'gv.nguyenvana', HANHDONG: 'Thêm mới' }
        ];
    };
    fx[NH + 'LayDS_LichSuDapAn'] = function (o) {
        return dapAn.filter(function (a) { return a.QUESTIONID === o.strQuestionId; }).map(function (a, i) {
            return { ORDERS: a.ORDERS, ORDERS_LS: a.ORDERS, FIXVITRI: a.FIXVITRI, FIXVITRI_LS: a.FIXVITRI, CORRECT: a.CORRECT, CORRECT_LS: i === 1 ? '1' : a.CORRECT, CONTENT: a.CONTENT, CONTENT_LS: a.CONTENT, NGAYSUA: '02/10/2026 09:12', TAIKHOANSUA: 'gv.nguyenvana', HANHDONG: i === 1 ? 'Sửa' : 'Thêm mới' };
        });
    };
    ums.demo.add(fx);
})();
