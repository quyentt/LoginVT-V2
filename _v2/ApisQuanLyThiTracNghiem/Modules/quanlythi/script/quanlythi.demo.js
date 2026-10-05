/* Dữ liệu mẫu cho Quản lý thi (QLTTN quanlythi/quanlythi) — chỉ dùng ở chế độ dựng thử.
   Thí sinh / đề / phần thi / tình huống / vi phạm / IP lấy từ _phongthi.demo.js (Cổng cán bộ, nạp kèm _phongthi.js — phòng PT1…PT3);
   ở đây khai phòng thi ĐỦ cột cho biểu mẫu, bộ lọc năm học / học kỳ / đợt / học phần, cán bộ, import, tạo đề. Có trạng thái trong phiên. */
(function () {
    'use strict';
    var QL = 'QLTTN_QuanLyThi/';
    var seq = 10;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function trang(rows, o) {
        var n = Number(o.ItemPerPage) || 10, p = Number(o.PageNumber) || 1;
        return { rows: n >= 1000000 ? rows : rows.slice((p - 1) * n, p * n), pager: rows.length };
    }
    var GHI = { rows: null, message: '' };
    var DOT = [{ ID: 'DT1', NAME: 'Thi cuối kỳ HK1 2026-2027' }, { ID: 'DT2', NAME: 'Thi giữa kỳ HK1 2026-2027' }];
    var HP = [
        { ID: 'HP1', TEN: 'Tin học đại cương', MA: 'INT101', HOCTRINH: '3', THUOCBOMON_TEN: 'Bộ môn Khoa học máy tính' },
        { ID: 'HP2', TEN: 'Cơ sở dữ liệu', MA: 'INT201', HOCTRINH: '3', THUOCBOMON_TEN: 'Bộ môn Hệ thống thông tin' },
        { ID: 'HP3', TEN: 'Lập trình hướng đối tượng', MA: 'INT202', HOCTRINH: '4', THUOCBOMON_TEN: 'Bộ môn Công nghệ phần mềm' }
    ];
    function phong(id, ten, hp, ngay, gio, mo, hien, sl, o) {
        var h = HP.filter(function (x) { return x.ID === hp; })[0];
        return Object.assign({ ID: id, ROOMNAME: ten, COURSENAME: h.TEN, COURSECODE: h.MA, COURSECREDIT: h.HOCTRINH, HOCPHANID: hp, CODEDST: 'DST-' + id,
            EXAMDATE: ngay, GIOTHI: gio, TENDOTTHI: DOT[0].NAME, EXAMSCHEDULEID: 'DT1', OPENSTATUS: mo, STATUS: hien, SOLUONGTHISINH: sl,
            TENDONVI: 'Khoa Công nghệ thông tin', DEPARTORGANID: 'DV1', MATKHAUCHOPHONGTHI: 'A7K2Q9', TONGTHOIGIAN: null, EXAMSTRUCTID: 'CT1',
            ROOMTITLE: 'Thi ' + h.TEN, ROOMHELP: 'Đọc kỹ đề trước khi làm bài', TEACHER1: 'Nguyễn Văn Giám', TEACHER2: 'Trần Thị Khảo',
            TOTALTIME: '60', THANGDIEM: '10', SODIEMLE: '1', CACHTINHDIEM: 'THEOSOY', CHOPHEPXEMDIEM: '1', CHOPHEPXEMKETQUATRALOI: '0' }, o || {});
    }
    var PHONG = [
        phong('PT1', 'Phòng máy 301 - A2', 'HP1', '06/01/2027', '07:30', '1', '1', 4),
        phong('PT2', 'Phòng máy 302 - A2', 'HP2', '06/01/2027', '09:30', '0', '1', 3, { TONGTHOIGIAN: 90, TOTALTIME: '90', CACHTINHDIEM: 'THEOSOCAU' }),
        phong('PT3', 'Phòng máy 205 - B1', 'HP3', '07/01/2027', '13:30', '1', '0', 2, { TENDOTTHI: DOT[1].NAME, EXAMSCHEDULEID: 'DT2' })
    ];
    var CB = [
        { ID: 'NS1', MASO: 'GV001', HOTEN: 'Nguyễn Văn Giám', TENDONVI: 'Khoa Công nghệ thông tin' }, { ID: 'NS2', MASO: 'GV002', HOTEN: 'Trần Thị Khảo', TENDONVI: 'Khoa Công nghệ thông tin' },
        { ID: 'NS3', MASO: 'GV003', HOTEN: 'Lê Minh Chấm', TENDONVI: 'Trung tâm Khảo thí' }, { ID: 'NS4', MASO: 'GV004', HOTEN: 'Phạm Thu Coi', TENDONVI: 'Khoa Kinh tế' },
        { ID: 'NS5', MASO: 'GV005', HOTEN: 'Hoàng Anh Dũng', TENDONVI: 'Trung tâm Khảo thí' }
    ];
    /* cán bộ coi / chấm theo phòng: [{ID dòng, NHANSUID}] */
    var COI = { PT1: [{ ID: 'C1', NS: 'NS1' }, { ID: 'C2', NS: 'NS2' }], PT2: [{ ID: 'C3', NS: 'NS4' }], PT3: [] };
    var CHAM = { PT1: [{ ID: 'K1', NS: 'NS3' }], PT2: [], PT3: [{ ID: 'K2', NS: 'NS5' }] };
    function dsCB(kho, o) {
        var rows = (kho[o.strExamRoomInfoId] || []).map(function (x) { var ns = CB.filter(function (c) { return c.ID === x.NS; })[0] || {}; return { ID: x.ID, MASO: ns.MASO, HOTEN: ns.HOTEN, TENDONVI: ns.TENDONVI }; });
        return trang(rows, o);
    }
    function timCB(o) {
        var q = e(o.strTuKhoa).toLowerCase();
        return trang(CB.filter(function (c) { return !q || (c.MASO + ' ' + c.HOTEN + ' ' + c.TENDONVI).toLowerCase().indexOf(q) >= 0; }), o);
    }
    function themCB(kho, o) { (kho[o.strExamRoomInfoId] = kho[o.strExamRoomInfoId] || []).push({ ID: 'C' + (++seq), NS: o.strNhanSuId }); return GHI; }
    function xoaCB(kho, o) { Object.keys(kho).forEach(function (k) { kho[k] = kho[k].filter(function (x) { return x.ID !== o.strId; }); }); return GHI; }

    var DS_THI = [
        { ID: 'DS1', MADANHSACHTHI: 'DST-INT101-01', NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 1 (07:30)', TKB_PHONGTHI_TEN: 'A2-301', SOLUONGTHISINHDUDIEUKIENDUTHI: 40, SOLUONGTSDAIMPORT: 4 },
        { ID: 'DS2', MADANHSACHTHI: 'DST-INT101-02', NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 2 (09:30)', TKB_PHONGTHI_TEN: 'A2-302', SOLUONGTHISINHDUDIEUKIENDUTHI: 38, SOLUONGTSDAIMPORT: 0 },
        { ID: 'DS3', MADANHSACHTHI: 'DST-INT201-01', NGAYTHI: '07/01/2027', THI_CATHI_TEN: 'Ca 3 (13:30)', TKB_PHONGTHI_TEN: 'B1-205', SOLUONGTHISINHDUDIEUKIENDUTHI: 25, SOLUONGTSDAIMPORT: 0 }
    ];
    function tsImport(ma, ho, ten, lop, sbd, daThi) { return { MATHISINH: ma, HODEM: ho, TEN: ten, NGAYSINH: '12/03/2006', CLASSNAME: lop, SOBAODANH: sbd, DATHI: daThi }; }
    var TS_DA = [tsImport('BIT220101', 'Nguyễn Văn', 'An', 'K67-CNTT1', 'SBD01', '1'), tsImport('BIT220102', 'Trần Thị', 'Bình', 'K67-CNTT1', 'SBD02', '0'),
        tsImport('BIT220103', 'Lê Minh', 'Cường', 'K67-CNTT1', 'SBD03', '0'), tsImport('BIT220104', 'Phạm Thu', 'Dung', 'K67-CNTT2', 'SBD04', '0')];
    var TS_CHUA = [tsImport('BIT220105', 'Vũ Hải', 'Đăng', 'K67-CNTT2', 'SBD05'), tsImport('BIT220106', 'Đỗ Thị', 'Giang', 'K67-CNTT2', 'SBD06')];

    var fx = {
        'QLTTN_ThongTin/LayDS_DonViByUserId': [{ ID: 'DV1', NAME: 'Khoa Công nghệ thông tin' }, { ID: 'DV2', NAME: 'Trung tâm Khảo thí' }],
        'QLTTN_QuanLyThi/LayDS_NamHoc': [{ SCHOOLYEAR: '2026-2027' }, { SCHOOLYEAR: '2025-2026' }],
        'QLTTN_QuanLyThi/LayDS_HocKyBySchoolYear': function (o) { return o.strSchoolYear ? [{ SEMESTER: '1' }, { SEMESTER: '2' }] : []; },
        'QLTTN_QuanLyThi/LayDS_DoThiByHocKy': function (o) { return o.strHocKy ? DOT : []; },
        'QLTTN_QuanLyThi/LayDS_HocPhan_TheoDotThi': function (o) { return { rows: { Table: o.strDotThiId ? HP.map(function (h) { return { ID: h.ID, TEN: h.TEN, MA: h.MA }; }) : [] } }; },
        'QLTTN_QuanLyThi/LayDS_HocPhan': HP,
        'QLTTN_QuanLyThi/LayDS_ThongTinPhongThi': function (o) {
            var q = e(o.strTuKhoa).toLowerCase();
            var d = PHONG.filter(function (p) {
                return (!o.strDonVi_Id || p.DEPARTORGANID === o.strDonVi_Id) && (!o.strDotThi_Id || p.EXAMSCHEDULEID === o.strDotThi_Id) &&
                    (!o.strTrangThaiPhongThi || p.OPENSTATUS === e(o.strTrangThaiPhongThi)) && (!o.strStatus || p.STATUS === e(o.strStatus)) &&
                    (!o.strHocPhanId || p.HOCPHANID === o.strHocPhanId) && (!q || (p.ROOMNAME + ' ' + p.COURSENAME).toLowerCase().indexOf(q) >= 0);
            });
            return trang(d, o);
        },
        'QLTTN_QuanLyThi/Them_PhongThi': function (o) {
            var hp = HP.filter(function (x) { return x.ID === o.strHocPhanId; })[0] || HP[0];
            var p = phong('PT' + (++seq), o.strRoomName, hp.ID, o.strExamDate, '07:30', o.strOpenstatus, o.strStatus, 0, {
                COURSENAME: o.strCourseName, COURSECODE: o.strCourseCode, COURSECREDIT: o.strCourseCredit, CODEDST: o.strCodeDST, ROOMTITLE: o.strRoomTitle, ROOMHELP: o.strRoomHelp,
                TEACHER1: o.strTeacher1, TEACHER2: o.strTeacher2, TOTALTIME: o.strTotalTime, THANGDIEM: o.strThangDiem, SODIEMLE: o.strSoDiemLe, CACHTINHDIEM: o.strCachTinhDiem,
                CHOPHEPXEMDIEM: o.ChoPhepXemDiem, CHOPHEPXEMKETQUATRALOI: o.ChoPhepXemKetQuaTraLoi, MATKHAUCHOPHONGTHI: o.strMatKhauChoPhongThi,
                EXAMSCHEDULEID: o.strExamScheduleId, TENDOTTHI: (DOT.filter(function (d) { return d.ID === o.strExamScheduleId; })[0] || {}).NAME || '', DEPARTORGANID: o.strDepartOrganId });
            PHONG.push(p);
            return GHI;
        },
        'QLTTN_QuanLyThi/Sua_PhongThi': function (o) {
            PHONG.forEach(function (p) {
                if (p.ID !== o.strId) return;
                Object.assign(p, { ROOMNAME: o.strRoomName, COURSENAME: o.strCourseName, COURSECODE: o.strCourseCode, COURSECREDIT: o.strCourseCredit, CODEDST: o.strCodeDST,
                    ROOMTITLE: o.strRoomTitle, ROOMHELP: o.strRoomHelp, TEACHER1: o.strTeacher1, TEACHER2: o.strTeacher2, EXAMDATE: o.strExamDate, TOTALTIME: o.strTotalTime,
                    THANGDIEM: o.strThangDiem, SODIEMLE: o.strSoDiemLe, CACHTINHDIEM: o.strCachTinhDiem, OPENSTATUS: o.strOpenstatus, STATUS: o.strStatus, HOCPHANID: o.strHocPhanId,
                    CHOPHEPXEMDIEM: o.ChoPhepXemDiem, CHOPHEPXEMKETQUATRALOI: o.ChoPhepXemKetQuaTraLoi, MATKHAUCHOPHONGTHI: o.strMatKhauChoPhongThi });
            });
            return GHI;
        },
        'QLTTN_QuanLyThi/Xoa_PhongThi': function (o) { for (var i = PHONG.length - 1; i >= 0; i--) if (PHONG[i].ID === o.strId) PHONG.splice(i, 1); return GHI; },
        'QLTTN_QuanLyThi/ThaoTacPhongThi_PhongThi': function (o) {
            PHONG.forEach(function (p) {
                if (p.ID !== o.strExamRoomInfoIds) return;
                if (o.strThaoTacPhongThi === 'MOPHONGTHI') p.OPENSTATUS = '1';
                if (o.strThaoTacPhongThi === 'DONGPHONGTHI') p.OPENSTATUS = '0';
                if (o.strThaoTacPhongThi === 'ANPHONGTHI') p.STATUS = '0';
                if (o.strThaoTacPhongThi === 'HIENPHONGTHI') p.STATUS = '1';
            });
            return GHI;
        },
        'QLTTN_QuanLyThi/LayDS_NhanSuCoiThi': function (o) { return dsCB(COI, o); },
        'QLTTN_QuanLyThi/LayDS_NhanSuChamThi': function (o) { return dsCB(CHAM, o); },
        'QLTTN_QuanLyThi/getList_SearchCanBoCoiThi': timCB,
        'QLTTN_QuanLyThi/getList_SearchCanBoChamThi': timCB,
        'QLTTN_QuanLyThi/Them_CanBoCoiThi': function (o) { return themCB(COI, o); },
        'QLTTN_QuanLyThi/Them_CanBoChamThi': function (o) { return themCB(CHAM, o); },
        'QLTTN_QuanLyThi/Xoa_CanBoCoiThi': function (o) { return xoaCB(COI, o); },
        'QLTTN_QuanLyThi/Xoa_CanBoChamThi': function (o) { return xoaCB(CHAM, o); },
        'QLTTN_QuanLyThi/Import_StudentExamRoom': { rows: { Table1: [{ MATHISINH: 'BIT220199', HOTEN: 'Không rõ', LOI: 'Không tìm thấy sinh viên' }],
            Table2: [{ MATHISINH: 'BIT220105', HOTEN: 'Vũ Hải Đăng', SOBAODANH: 'SBD05' }, { MATHISINH: 'BIT220106', HOTEN: 'Đỗ Thị Giang', SOBAODANH: 'SBD06' }] }, message: '2 thí sinh' },
        'TP_Chung/LayThoiGian': [{ ID: 'TG1', THOIGIAN: '2026-2027_1' }, { ID: 'TG2', THOIGIAN: '2025-2026_2' }],
        'TP_Chung/LayLoaiDiem': function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi kết thúc học phần' }, { ID: 'LD2', TEN: 'Điểm giữa kỳ' }] : []; },
        'TP_Chung/LayHinhThucThi': function (o) { return o.strDiem_ThanhPhanDiem_Id ? [{ ID: 'HT1', TEN: 'Trắc nghiệm trên máy' }, { ID: 'HT2', TEN: 'Tự luận trên máy' }] : []; },
        'QLTTN_QuanLyThi/LayDanhSach_DotThi': function (o) { return o.strHinhThucThi_Id ? [{ ID: 'XD1', TEN: 'Đợt 1 - Thi KTHP HK1 2026-2027' }, { ID: 'XD2', TEN: 'Đợt 2 - Thi lại HK1 2026-2027' }] : []; },
        'TP_Chung/LayHocPhan': function (o) { return o.strDotThi_Id ? HP.map(function (h) { return { ID: h.ID, TEN: h.TEN }; }) : []; },
        'QLTTN_QuanLyThi/LayDS_DSThiTheoDotThi': function (o) {
            return trang(DS_THI.filter(function (d) { return !o.strDaoTao_HocPhan_Id || d.MADANHSACHTHI.indexOf(HP.filter(function (h) { return h.ID === o.strDaoTao_HocPhan_Id; }).map(function (h) { return h.MA; })[0] || '') >= 0; }), o);
        },
        'QLTTN_QuanLyThi/DongBoDuLieuPhongThi': function (o) {
            var d = DS_THI.filter(function (x) { return x.ID === o.strId; })[0];
            if (d) {
                d.SOLUONGTSDAIMPORT = d.SOLUONGTHISINHDUDIEUKIENDUTHI;
                PHONG.push(phong('PT' + (++seq), d.TKB_PHONGTHI_TEN + ' (' + d.THI_CATHI_TEN + ')', 'HP1', d.NGAYTHI, '07:30', '0', '1', d.SOLUONGTHISINHDUDIEUKIENDUTHI,
                    { MATKHAUCHOPHONGTHI: o.strMatKhauChoPhongThi, CACHTINHDIEM: o.strCachTinhDiem, CHOPHEPXEMDIEM: o.ChoPhepXemDiem, CHOPHEPXEMKETQUATRALOI: o.ChoPhepXemKetQuaTraLoi,
                        EXAMSCHEDULEID: o.strExamScheduleId, DEPARTORGANID: o.strDepartOrganId }));
            }
            return GHI;
        },
        'QLTTN_QuanLyThi/LayDS_PhongThiTSDaImport': function (o) { return trang(o.strPhongThiId === 'DS1' ? TS_DA : [], o); },
        'QLTTN_QuanLyThi/LayDS_PhongThiTSChuaImport': function (o) { return trang(o.strPhongThiId === 'DS1' ? TS_CHUA : TS_DA.concat(TS_CHUA), o); },
        'TTN_ThiSinh/LayDS_MatKhauPhanThi': [{ EXAMSTRUCTPARTID: 'P1', MATKHAUPHANTHI: 'P1-2027' }, { EXAMSTRUCTPARTID: 'P2', MATKHAUPHANTHI: '' }],
        'QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion': [
            { ID: 'GQ01', GROUPQUESTIONNAMECODE: 'NHCH-LTC - Ngân hàng câu hỏi Lập trình C', GROUPQUESTIONNAME: 'Ngân hàng câu hỏi Lập trình C' },
            { ID: 'GQ02', GROUPQUESTIONNAMECODE: 'NHCH-CSDL - Ngân hàng câu hỏi Cơ sở dữ liệu', GROUPQUESTIONNAME: 'Ngân hàng câu hỏi Cơ sở dữ liệu' }],
        'QLTTN_QuanLyBoDe/LayDS_ExamStruct': function (o) {
            return o.strGroupQuestionId === 'GQ02' ? [{ ID: 'CT2', NAME: 'Bộ đề CSDL — 2 phần, 90 phút' }] : [{ ID: 'CT1', NAME: 'Cấu trúc 40 câu + 1 tự luận' }, { ID: 'CT3', NAME: 'Bộ đề LTC — thi thử 20 câu' }];
        },
        'QLTTN_QuanLyBoDe/LayDS_WritenExam': function (o) {
            return o.strExamStructId === 'CT1' ? [{ ID: 'WE1', NAME: 'Đề cuối kỳ LTC 2026', SODETAO: '4' }, { ID: 'WE2', NAME: 'Đề dự phòng LTC', SODETAO: '2' }] :
                (o.strExamStructId ? [{ ID: 'WE3', NAME: 'Đề ' + o.strExamStructId, SODETAO: '6' }] : []);
        },
        'QLTTN_QuanLyBoDe/LayDS_CauTrucDeThi': function (o) {
            return o.strExamStructId ? [
                { GROUPQUESTIONDETAILNAME: '1.1 Biến và kiểu dữ liệu', TEN_CHONMOTTRONGCACNHOM: '', SONHOMCON: '', LEVELQUESTIONNAME: 'Nhận biết', SOCAUTRONGNGANHANGCAUHOI: 12, NUMBERQUESTION: 8 },
                { GROUPQUESTIONDETAILNAME: '1.2 Toán tử', TEN_CHONMOTTRONGCACNHOM: '', SONHOMCON: '', LEVELQUESTIONNAME: 'Thông hiểu', SOCAUTRONGNGANHANGCAUHOI: 6, NUMBERQUESTION: 4 },
                { GROUPQUESTIONDETAILNAME: '', TEN_CHONMOTTRONGCACNHOM: 'Chương 2 — Cấu trúc điều khiển', SONHOMCON: '2', LEVELQUESTIONNAME: '', SOCAUTRONGNGANHANGCAUHOI: '', NUMBERQUESTION: '' }] : [];
        },
        'QLTTN_QuanLyBoDe/LayDS_DeThiThuCong': function (o) {
            return o.strGroupQuestionId === 'GQ02' ? [{ ID: 'TC02', NAME: 'Đề thủ công CSDL — ôn tập', SODETAO: '3', EXAMSTRUCTID: 'CT2' }] :
                [{ ID: 'TC01', NAME: 'Đề thủ công LTC — giữa kỳ', SODETAO: '2', EXAMSTRUCTID: 'CT1' }];
        },
        'TTN_ThiSinh/gen_KetQuaThi': { rows: '<h3>Bài thi trắc nghiệm — Tin học đại cương</h3>' +
            '<p><b>Câu 1.</b> Đơn vị nhỏ nhất của thông tin là gì?<br>A. Byte &nbsp; <u>B. Bit</u> &nbsp; C. Word &nbsp; D. KB — <i>Đúng</i></p>' +
            '<p><b>Câu 2.</b> Giá trị của \\(2^{10}\\) là?<br><u>A. 1024</u> &nbsp; B. 512 &nbsp; C. 2048 &nbsp; D. 100 — <i>Đúng</i></p>' }
    };
    ['ThemMoiCapNhat_StudentExamRoom', 'Xoa_ThiSinhKhoiPhongThi', 'ChuyenDuLieuDiem_ThiSinh', 'ThucHienTinhDiemCauHoi_PhongThi', 'CapNhatMatKhauPhanThi',
        'ThucHienGenDeTuDeThiCoSan', 'ThucHienGenDe_NgauNhien', 'ThucHienGenDe_CungDe', 'ThucHienGenDeTuDeThiCoSan_CacPhongThi', 'ThucHienGenDe_NgauNhien_CacPhongThi',
        'ThucHienGenDe_CungDe_CacPhongThi', 'ThucHienGenLayNDeTuDeThiThuCong', 'ThucHienGenDeTuDeThiThuCong', 'ThucHienGenDeThiSinhTuDeThiThuCong']
        .forEach(function (k) { fx[QL + k] = GHI; });
    ums.demo.add(fx);
})();
