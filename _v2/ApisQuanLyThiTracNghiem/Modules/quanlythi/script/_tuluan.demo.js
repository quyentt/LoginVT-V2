/* Dữ liệu mẫu cho hai màn thi tự luận (quanlythituluan, duyetdiemthituluan) — chỉ dùng ở chế độ dựng thử.
   Đơn vị / đợt thi / phần thi / báo cáo lấy từ _phongthi.demo.js (Cổng cán bộ, nạp kèm _phongthi.js); ở đây khai lời gọi riêng. */
(function () {
    'use strict';
    function phong(id, ten, mon, ngay, dot, mo, hien, sl) {
        return { ID: id, ROOMNAME: ten, COURSENAME: mon, EXAMDATE: ngay, TENDOTTHI: dot, OPENSTATUS: mo, STATUS: hien, SOLUONGTHISINH: sl,
            TENDONVI: 'Khoa Công nghệ thông tin', DEPARTORGANID: 'DV1', EXAMSTRUCTID: 'CT1', MATKHAUCHOPHONGTHI: 'A7K2Q9',
            GENSTYLETEXT: 'Tạo đề ngẫu nhiên', EXAMSTRUCTNAME: 'Cấu trúc 40 câu + 1 tự luận', TOLTALQUESTION: 41, DATAODE: 'Đã tạo đề', WRITETENEXAMNAME: 'Đề 01' };
    }
    var PHONG = [
        phong('PT1', 'Phòng máy 301 - A2', 'Tin học đại cương', '06/01/2027', 'Thi cuối kỳ HK1 2026-2027', '0', '1', 4),
        phong('PT2', 'Phòng máy 302 - A2', 'Cơ sở dữ liệu', '06/01/2027', 'Thi cuối kỳ HK1 2026-2027', '1', '1', 3),
        phong('PT3', 'Phòng máy 205 - B1', 'Lập trình hướng đối tượng', '07/01/2027', 'Thi giữa kỳ HK1 2026-2027', '0', '0', 2)
    ];
    function ts(id, ma, ten, o) {
        return Object.assign({ ID: id, STUDENTEXAMROOMID: id, EXAMSTRUCTPARTID: 'P2', USERID: 'U' + id, STUDENTCODE: ma, FULLNAME: ten,
            BIRTHDATE_USER: '12/03/2006', SOBAODANHIMPORT: 'SBD' + id.slice(-2), SOPHACH: '', MARK: null, MARKTULUAN: null, GHICHUTULUAN: null,
            DIACHIIPMAYDADANGNHAP: '10.0.3.' + (20 + Number(id.slice(-2))), TENVIPHAMQUYCHETHI: null }, o || {});
    }
    var TS = [
        ts('TS01', 'BIT220101', 'Nguyễn Văn An', { SOPHACH: 'P0001', MARKTULUAN: '7', MARK: '7' }),
        ts('TS02', 'BIT220102', 'Trần Thị Bình', { SOPHACH: 'P0002', MARKTULUAN: '8.5' }),
        ts('TS03', 'BIT220103', 'Lê Minh Cường', { SOPHACH: 'P0003', DIACHIIPMAYDADANGNHAP: '' }),
        ts('TS04', 'BIT220104', 'Phạm Thu Dung', { SOPHACH: 'P0004', TENVIPHAMQUYCHETHI: 'Sử dụng tài liệu', GHICHUTULUAN: 'Lập biên bản' })
    ];
    var FILES = [{ ID: 'F1', DULIEU_ID: 'TS01', DUONGDAN: 'BaiThi/BIT220101_tuluan.pdf', TENHIENTHI: 'BIT220101_tuluan.pdf' },
        { ID: 'F2', DULIEU_ID: 'TS02', DUONGDAN: 'BaiThi/BIT220102_tuluan.docx', TENHIENTHI: 'BIT220102_tuluan.docx' }];
    var GV = [{ NHANSUID: 'GV1', FULLNAME: 'Nguyễn Thị Hoa', NAME: 'GV1' }, { NHANSUID: 'GV2', FULLNAME: 'Trần Văn Khoa', NAME: 'GV2' }];
    function dgv(gv, u, m) { return { NHANSUID: gv, EXAMSTRUCTPARTID: 'P2', USERID: u, MARK: m }; }
    var DGV = [dgv('GV1', 'UTS01', '7'), dgv('GV2', 'UTS01', '7'), dgv('GV1', 'UTS02', '8'), dgv('GV2', 'UTS02', '9'),
        dgv('GV1', 'UTS03', '6'), dgv('GV2', 'UTS03', '6'), dgv('GV1', 'UTS04', '4')];
    // Điểm so sánh: chỉ có khi hai giảng viên thống nhất
    var DSS = [{ EXAMSTRUCTPARTID: 'P2', USERID: 'UTS01', MARK: '7' }, { EXAMSTRUCTPARTID: 'P2', USERID: 'UTS03', MARK: '6' }];
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
        'QLTTN_QuanLyThi/LayDS_CTPhongThi_Part_TuLuan': function (o) {
            var d = o.strExamRoomInfoId === 'PT3' ? TS.slice(0, 2) : TS;
            return { rows: { ChiTietPhongThi: d, StudentFiles: FILES, GiaoVienChamThi: GV, DiemGiaoVienChamThi: DGV, DiemSoSanhGiaoVien: DSS }, pager: d.length };
        },
        'QLTTN_QuanLyThi/Sua_CongNhanDiem_TuLuan': function (o) {
            TS.forEach(function (r) { if (r.ID === o.strId) { r.MARKTULUAN = o.strMark; r.GHICHUTULUAN = o.strGhiChu; } });
            return [];
        },
        'QLTTN_QuanLyThi/Sua_CongNhanDiem': function (o) {
            TS.forEach(function (r) { if (r.ID === o.strId) { r.MARK = o.strMark; r.GHICHUTULUAN = o.strGhiChu; } });
            return [];
        },
        'QLTTN_QuanLyThi/save_TaoPhach': function () {
            TS.forEach(function (r, i) { if (!r.SOPHACH) r.SOPHACH = 'P00' + (10 + i); });
            return [];
        },
        'QLTTN_QuanLyThi/TaiFileThiSinhLamBai': { rows: 'BaiLam/PT1_tuluan.zip' },
        'TTN_ThiSinh/gen_KetQuaThi_KIEULAMBAI': { rows: '<h3>Phần 2 - Tự luận</h3><p><b>Câu 1.</b> Chứng minh \\(a^2 + b^2 \\ge 2ab\\).</p>' +
            '<p><i>Bài làm:</i> Ta có \\((a-b)^2 \\ge 0\\) nên \\(a^2 - 2ab + b^2 \\ge 0\\), suy ra điều phải chứng minh.</p>' }
    });
})();
