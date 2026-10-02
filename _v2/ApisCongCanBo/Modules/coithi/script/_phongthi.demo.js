/* Dữ liệu mẫu chung cho module coithi (coithi, chamthituluan, duyetdiemthitracnghiem) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var QL = 'QLTTN_QuanLyThi/';
    var DV = [{ ID: 'DV1', NAME: 'Khoa Công nghệ thông tin' }, { ID: 'DV2', NAME: 'Trung tâm Khảo thí' }];
    var DOT = [{ ID: 'DT1', NAME: 'Thi cuối kỳ HK1 2026-2027' }, { ID: 'DT2', NAME: 'Thi giữa kỳ HK1 2026-2027' }];
    function phong(id, ten, mon, ngay, gio, mo, sl, tong) {
        return { ID: id, ROOMNAME: ten, COURSENAME: mon, EXAMDATE: ngay, GIOTHI: gio, TENDOTTHI: DOT[0].NAME, OPENSTATUS: mo, SOLUONGTHISINH: sl,
            TENDONVI: DV[0].NAME, DEPARTORGANID: 'DV1', MATKHAUCHOPHONGTHI: 'A7K2Q9', TONGTHOIGIAN: tong || null };
    }
    var PHONG = [
        phong('PT1', 'Phòng máy 301 - A2', 'Tin học đại cương', '06/01/2027', '07:30', '1', 4),
        phong('PT2', 'Phòng máy 302 - A2', 'Cơ sở dữ liệu', '06/01/2027', '09:30', '0', 3, 90),
        phong('PT3', 'Phòng máy 205 - B1', 'Lập trình hướng đối tượng', '07/01/2027', '13:30', '1', 2)
    ];
    function ts(id, ma, ho, ten, o) {
        return Object.assign({ ID: id, STUDENTEXAMROOMID: id, STUDENTEXAMROOMPARTID: id + '-P', USERID: 'U' + id, STUDENTCODE: ma,
            FULLNAME: ho + ' ' + ten, HODEM: ho, TEN: ten, BIRTHDATE_USER: '12/03/2006', SOBAODANHIMPORT: 'SBD' + id.slice(-2),
            CLASSNAMEIMPORT: 'K67-CNTT1', DETHITHU: 'Đề 01', DIEMTINH: null, MARK: null, MARKTULUAN: null, GHICHU: null, GHICHUTULUAN: null,
            TIMERCOUNTDOWN: '-1', TIMERSHOW: 0, THOIGIANCONLAI: 0, FINISHED: '1', STATUS: '', TIMESTARTDOEXAM_TEXT: '07:31',
            TIMEHHMISSSTARTDOEXAM: '07:31:05', DIACHIIPMAYDADANGNHAP: '10.0.3.21', COTRONGLICHTHI: '1', GIANLAN: '0', TENVIPHAMQUYCHETHI: null }, o || {});
    }
    var TS = [
        ts('TS01', 'BIT220101', 'Nguyễn Văn', 'An', { DIEMTINH: '8.5', MARKTULUAN: '7' }),
        ts('TS02', 'BIT220102', 'Trần Thị', 'Bình', { FINISHED: '0', TIMERCOUNTDOWN: '25', TIMERSHOW: 1500000, THOIGIANCONLAI: 25, DIEMTINH: null,
            DIACHIIPMAYDADANGNHAP: '10.0.3.22', GIANLAN: '1' }),
        ts('TS03', 'BIT220103', 'Lê Minh', 'Cường', { FINISHED: '0', TIMERCOUNTDOWN: '60', THOIGIANCONLAI: 60, TIMESTARTDOEXAM_TEXT: '',
            TIMEHHMISSSTARTDOEXAM: '', DIACHIIPMAYDADANGNHAP: '' }),
        ts('TS04', 'BIT220104', 'Phạm Thu', 'Dung', { FINISHED: '0', STATUS: 'TAMDUNGTHI', TIMERCOUNTDOWN: '12', TIMERSHOW: 720000, THOIGIANCONLAI: 12,
            COTRONGLICHTHI: '0', TENVIPHAMQUYCHETHI: 'Sử dụng tài liệu', GHICHU: 'Lập biên bản' })
    ];
    var FILES = [{ ID: 'F1', DULIEU_ID: 'TS01-P', DUONGDAN: 'BaiThi/BIT220101_phan2.pdf', TENHIENTHI: 'BIT220101_phan2.pdf' }];
    var GHI = { rows: null, message: '' };
    function locPhong(o) {
        return PHONG.filter(function (p) {
            return (!o.strTrangThaiPhongThi || p.OPENSTATUS === o.strTrangThaiPhongThi || o.action.indexOf('ChamThi') > 0) &&
                (!o.strTuKhoa || (p.ROOMNAME + p.COURSENAME).toLowerCase().indexOf(String(o.strTuKhoa).toLowerCase()) >= 0);
        });
    }
    var fx = {
        'QLTTN_ThongTin/LayDS_DonViByUserId_GST': DV,
        'QLTTN_ThongTin/LayDS_DonViByUserId': DV,
        'QLTTN_QuanLyThi/LayDS_DotThi': DOT,
        'QLTTN_QuanLyThi/LayDS_HocKy': [{ SEMESTER: '20261' }, { SEMESTER: '20252' }],
        'QLTTN_QuanLyThi/LayDS_DoThiByHocKy': function (o) { return o.strHocKy ? DOT : []; },
        'QLTTN_QuanLyThi/LayDS_MucPheDuyet': ['GVCOITHI', 'KHAOTHI', 'GIAOVU', 'DAOTAO'].map(function (m) { return { MA: m, LOAIPHEDUYET: 'PHEDUYETDIEM' }; }),
        'QLTTN_QuanLyThi/LayDS_PhongThiCanBo_GST': function (o) { var d = locPhong(o); return { rows: d, pager: d.length }; },
        'QLTTN_QuanLyThi/LayDS_PhongThi_ChamThi': function (o) { var d = locPhong(o); return { rows: d, pager: d.length }; },
        'QLTTN_QuanLyThi/LayDS_PhongThi_MucPheDuyet': function (o) {
            var d = o.strMucPheDuyet === 'DIEMDADUOCCONGNHAN' ? PHONG.slice(2) : PHONG.slice(0, 2);
            return { rows: d, pager: d.length };
        },
        'QLTTN_QuanLyThi/LayDS_ExamRoomInfoDetail': [{ EXAMSTRUCTID: 'CT1', GENSTYLETEXT: 'Tạo đề ngẫu nhiên', DATAODE: 'Đã tạo đề',
            TOLTALQUESTION: 40, EXAMSTRUCTNAME: 'Cấu trúc 40 câu + 1 tự luận', WRITETENEXAMNAME: 'Đề 01' }],
        'QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart': [
            { ID: 'P1', PARENTID: null, TITLE: 'Phần 1 - Trắc nghiệm', KIEULAMBAITHI: 'THITRACNGHIEM' },
            { ID: 'P2', PARENTID: null, TITLE: 'Phần 2 - Tự luận', KIEULAMBAITHI: 'THITULUANVANBAN' },
            { ID: 'P1A', PARENTID: 'P1', TITLE: 'Nhóm câu dễ', KIEULAMBAITHI: 'THITRACNGHIEM' }],
        'QLTTN_QuanLyThi/LayDS_ChiTietPhongThi_KetQua': function (o) {
            var d = o.strExamRoomInfoId === 'PT3' ? TS.slice(0, 2) : TS;
            return { rows: { ChiTietPhongThi: d, StudentFiles: FILES }, pager: d.length };
        },
        'QLTTN_QuanLyThi/LayDS_CTPhongThi_Part_TuLuan': { rows: { ChiTietPhongThi: TS, StudentFiles: FILES }, pager: TS.length },
        'QLTTN_QuanLyThi/LayDS_ThiSinhGianLan': [{ STUDENTEXAMROOMID: 'TS02', GIANLAN: '1' }],
        'QLTTN_QuanLyThi/LayDS_CauHinhThiTracNghiem': [{ CODE: 'COITHI.CHOPHEPTHISINHDOIMAY', GIATRI: '1' }, { CODE: 'COITHI.TAMDUNG', GIATRI: '1' }],
        'QLTTN_QuanLyTHI/LayDS_ViPhamQuyChe': [{ ID: 'VP1', NAME: 'Vắng thi' }, { ID: '3442B9AD42EC44DF85D8A2322067B2EE', NAME: 'Khiển trách' },
            { ID: 'VP3', NAME: 'Đình chỉ thi' }],
        'QLTTN_QuanLyThi/LayDS_ThiSinh_TinhHuongThi': function (o) {
            var ids = String(o.strStudentExamRoomIds || '').split(',');
            return TS.filter(function (x) { return ids.indexOf(x.ID) >= 0; }).map(function (x) {
                return Object.assign({ TRANGTHAILAMBAICACPHANTHI: x.FINISHED === '1' ? 'Phần 1: Thi xong' : 'Phần 1: Đang làm', TENMAYDADANGNHAP: 'PM3-' + x.ID.slice(-2) }, x);
            });
        },
        'QLTTN_QuanLyThi/LayDS_DiaChiIP_ThiSinh': { rows: [
            { IPADDRESS: '10.0.3.22', COMPUTERNAME: 'PM3-22', DATELOGIN: '06/01/2027 07:31:10' },
            { IPADDRESS: '10.0.3.40', COMPUTERNAME: 'PM3-40', DATELOGIN: '06/01/2027 07:52:44' }], pager: 2 },
        'TTN_ThiSinh/gen_KetQuaThi_KIEULAMBAI': { rows: '<h3>Phần 2 - Tự luận</h3><p><b>Câu 1.</b> Trình bày khái niệm khoá chính.</p>' +
            '<p><i>Bài làm:</i> Khoá chính là tập thuộc tính xác định duy nhất một bộ trong quan hệ…</p>' },
        'SYS_Report/ThemMoi': { rows: null, message: 'BC-DEMO-001' }
    };
    ['XulyTinhHuongThi', 'KhoiTaoLaiDeChoThiSinh', 'Save_DoiMay', 'Save_ViPhamQuyCheThi', 'Sua_CongNhanDiem', 'Sua_CongNhanDiem_ALL',
        'Sua_CongNhanDiem_TuLuan', 'ThaoTacPhongThi_PhongThi_GST', 'Update_PhongThi_MucPheDuyet'].forEach(function (k) { fx[QL + k] = GHI; });
    ums.demo.add(fx);
})();
