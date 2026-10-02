/* Dữ liệu mẫu cho lichgiangnhieuphonghoc — chỉ dùng ở chế độ dựng thử. 40 phòng để thử nạp thêm khi cuộn.
   Pull 29/9: thêm sức chứa (cột SUCCHUA hoặc "(N)" cuối TEN; phòng 7 không rõ), IDLICHHOC, lịch kéo dài 2 module (T2-5),
   lịch dạy của người đăng nhập (LayDSLichGiang) và ba lời gọi đổi lịch. Kéo gốc 30/9 – 1/10: phòng trống (LAYPHONGHOCTRONG). */
(function () {
    var fx = {}, C = 'KHCT_LichGiang_DoiLich/';
    function hai(n) { return (n < 10 ? '0' : '') + n; }
    function dmy(d) { return hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear(); }
    function parse(s) { var p = String(s || '').split('/'); return new Date(+p[2], +p[1] - 1, +p[0]); }
    var TOA = [{ ID: 'T1', TENTOANHA: 'Nhà A1' }, { ID: 'T2', TENTOANHA: 'Nhà A2' }];
    var PH = [];
    for (var i = 1; i <= 40; i++) {
        var ten = (i % 2 ? 'A1-' : 'A2-') + (100 + i);
        var p = { ID: 'P' + i, TEN: ten, KIEUPHONG: i % 5 ? 'LT' : 'TH', MOTAKIEUPHONG: i % 5 ? 'Phòng lý thuyết' : '', TKB_TOANHA_ID: i % 2 ? 'T1' : 'T2' };
        if (i % 3 === 0) p.TEN = ten + '(' + (40 + i * 2) + ')';       // sức chứa nằm trong tên
        else if (i !== 7) p.SUCCHUA = 40 + i;                           // sức chứa ở cột riêng; phòng 7 không rõ
        PH.push(p);
    }
    fx['PKG_CONGTHONGTINCANBO.LayDSToaNha'] = TOA;
    fx['pkg_congthongtincanbo.LayDSPhongHoc'] = function (o) { return PH.filter(function (p) { return !o.strTKB_ToaNha_Id || p.TKB_TOANHA_ID === o.strTKB_ToaNha_Id; }); };
    var HP = [['L1', 'Lập trình hướng đối tượng', 'IT3100.01'], ['L2', 'Cơ sở dữ liệu', 'IT3200.02'], ['L3', 'Kiến trúc máy tính', 'IT3300.01'], ['L4', 'Toán rời rạc', 'MI2020.03']];
    function lichPhong(idPhong, bd, kt) {
        var n = +String(idPhong).slice(1), a = parse(bd), b = parse(kt), ds = [], k;
        if (n % 6 === 4) return ds;                                     // vài phòng luôn trống (thử lọc phòng trống nhiều ngày)
        for (var d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) {
            k = Math.round((d - new Date(2026, 0, 5)) / 864e5);      // theo ngày tuyệt đối → gọi một ngày hay cả tuần đều ra cùng lịch
            k = ((k % 21) + 21) % 21;
            if ((n + k) % 3 === 0) {
                /* Phòng 2: ngày trống thì xếp một lịch T2-5 → chạm hai module sáng, ô phải gộp */
                if (n === 2) ds.push({ ID: 'D' + n + '_' + dmy(d), IDLICHHOC: 'LHD' + n + '_' + dmy(d), IDPHONGHOC: idPhong, IDLOPHOCPHAN: 'L6', IDHOCPHAN: 'HPL6', TENHOCPHAN: 'Đồ án cơ sở', TENLOPHOCPHAN: 'IT3900.01',
                    TENPHONGHOC: PH[n - 1].TEN, NGAYHOC: dmy(d), THUHOC: (d.getDay() || 7) + 1, TIETBATDAU: 2, TIETKETTHUC: 5, GIOBATDAU: 7, PHUTBATDAU: 50, GIOKETTHUC: 11, PHUTKETTHUC: 25, THONGTINGIANGVIEN: 'PGS. Phạm Đức Long' });
                continue;
            }
            var h = HP[(n + k) % 4], ca = (n + k) % 3;
            var r = { ID: 'E' + n + '_' + dmy(d), IDLICHHOC: 'LH' + n + '_' + dmy(d), IDPHONGHOC: idPhong, IDLOPHOCPHAN: h[0], IDHOCPHAN: 'HP' + h[0], IDHINHTHUCXEP: 'HT1',
                TENHOCPHAN: h[1], TENLOPHOCPHAN: h[2], TENPHONGHOC: (PH[n - 1] || {}).TEN, NGAYHOC: dmy(d), THUHOC: (d.getDay() || 7) + 1,
                THONGTINGIANGVIEN: 'TS. Nguyễn Văn Hùng<br>ThS. Trần Thị Mai' };
            if (ca === 1) { r.TIETBATDAU = 1; r.TIETKETTHUC = 3; r.GIOBATDAU = 7; r.PHUTBATDAU = 0; r.GIOKETTHUC = 9; r.PHUTKETTHUC = 25; }
            else { r.TIETBATDAU = 7; r.TIETKETTHUC = 9; r.GIOBATDAU = 13; r.PHUTBATDAU = 0; r.GIOKETTHUC = 15; r.PHUTKETTHUC = 30; }
            ds.push(r);
            if (n % 4 === 1) ds.push({ ID: 'T' + n + '_' + dmy(d), IDLICHHOC: 'LHT' + n + '_' + dmy(d), IDPHONGHOC: idPhong, IDLOPHOCPHAN: 'L5', TENHOCPHAN: 'Tiếng Anh "B1"', TENLOPHOCPHAN: 'EN1000.05',
                TENPHONGHOC: (PH[n - 1] || {}).TEN, NGAYHOC: dmy(d), GIOBATDAU: 19, PHUTBATDAU: 0, GIOKETTHUC: 21, PHUTKETTHUC: 0, THONGTINGIANGVIEN: 'ThS. Lê Quang Minh' });  // không có tiết → theo giờ
        }
        return ds;
    }
    fx['pkg_congthongtincanbo.LayLichPhongHoc'] = function (o) { return lichPhong(o.strIdPhongHoc, o.strNgayBatDau, o.strNgayKetThuc); };

    /* Lịch dạy của người đăng nhập: buổi đầu tuần có tiết của phòng 1 (LT), phòng 5 (TH) và buổi T2-5 của phòng 2 */
    fx['NS_ThongTinCanBo/LayDSLichGiang'] = function (o) {
        var ds = [];
        ['P1', 'P5', 'P2'].forEach(function (id) {
            var x = lichPhong(id, o.strNgayBatDau, o.strNgayKetThuc).filter(function (r) { return r.TIETBATDAU; })[0];
            if (x) ds.push(x);
        });
        return ds;
    };
    fx[C + 'KhoiTaoThongTinYeuCauDoiLich'] = function (o) {
        var ph = PH.filter(function (p) { return p.ID === o.strIdPhongHoc; })[0] || {};
        return { rsThongTinChung: [{ NOIDUNG: '', LOPHOCPHAN_TEN: 'IT3200.02', NGAYHOC: o.strNgayHoc, NGAYHOC_THAYDOI: '', TIETBATDAU: o.strTietBatDau, TIETBATDAU_THAYDOI: '',
                    TIETKETTHUC: o.strTietKetThuc, TIETKETTHUC_THAYDOI: '', PHONGHOC_TEN: ph.TEN, IDPHONGHOC_THAYDOI: '' }],
                 rsGiangVien: [{ ID: 'NS1', HODEM: 'Nguyễn Văn', TEN: 'Hùng', MASO: 'CB001' }],
                 rsDanhMucPhong: PH.slice(0, 12).map(function (p) { return { ID: p.ID, TENPHONGHOC: p.TEN.replace(/\(\d+\)$/, '') }; }),
                 rsDanhMucGiangVien: [{ ID: 'NS1', HODEM: 'Nguyễn Văn', TEN: 'Hùng', MASO: 'CB001' }, { ID: 'NS3', HODEM: 'Lê Quang', TEN: 'Minh', MASO: 'CB102' }] };
    };
    fx[C + 'KiemTraLichCanDoi'] = function (o) {
        return o.strIdPhongHoc_ThayDoi === 'P4' ? [{ HOPLE: 0, THONGTINLOI: 'Phòng A2-104 đã có lớp IT2000.03 trong các tiết này' }] : [{ HOPLE: 1 }];
    };
    fx[C + 'GuiYeuCauDoiLich'] = [];
    /* Kéo gốc 30/9 – 1/10: phòng trống một ngày + khung giờ (TKB_CHUNG.LAYPHONGHOCTRONG) — phòng không có lịch nào chạm
       khoảng giờ gửi lên; lọc theo loại phòng, bỏ qua buổi strIdLichBoQua. Phòng 3 luôn "bận" ngày Chủ nhật để thử trống một phần. */
    fx['TKB_CHUNG.LAYPHONGHOCTRONG'] = function (o) {
        var a = (+o.dGioBatDau) * 60 + (+o.dPhutBatDau || 0), b = (+o.dGioKetThuc) * 60 + (+o.dPhutKetThuc || 0), cn = parse(o.strNgay).getDay() === 0;
        return PH.filter(function (p) {
            if (o.strKieuPhong && p.KIEUPHONG !== o.strKieuPhong) return false;
            if (p.ID === 'P3' && cn) return false;
            return !lichPhong(p.ID, o.strNgay, o.strNgay).some(function (r) {
                if (o.strIdLichBoQua && r.IDLICHHOC === o.strIdLichBoQua) return false;
                var x = (+r.GIOBATDAU) * 60 + (+r.PHUTBATDAU || 0), y = (+r.GIOKETTHUC) * 60 + (+r.PHUTKETTHUC || 0);
                return x < b && y > a;
            });
        }).map(function (p) { return { ID: p.ID, TENPHONGHOC: p.TEN, KIEUPHONG: p.KIEUPHONG }; });
    };
    ums.demo.add(fx);
})();
