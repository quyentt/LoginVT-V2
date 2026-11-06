/* Dữ liệu mẫu cho lichgiangnhieuphonghocgiangvien — chỉ dùng ở chế độ dựng thử. 120 giảng viên để thử phân trang ô chọn;
   cứ 10 người có 1 người "Nghỉ hưu" để thử ô Tình trạng nhân sự (kéo gốc lần 12). */
(function () {
    var fx = {};
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.TTNS'] = [{ ID: 'TT1', MA: 'DLV', TEN: 'Đang làm việc' }, { ID: 'TT2', MA: 'NH', TEN: 'Nghỉ hưu' }, { ID: 'TT3', MA: 'TV', TEN: 'Thôi việc' }];
    function hai(n) { return (n < 10 ? '0' : '') + n; }
    function dmy(d) { return hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear(); }
    function parse(s) { var p = String(s || '').split('/'); return new Date(+p[2], +p[1] - 1, +p[0]); }
    var DV = [{ ID: 'K1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'B11', TEN: 'Bộ môn Kỹ thuật phần mềm', DAOTAO_COCAUTOCHUC_CHA_ID: 'K1' },
        { ID: 'B12', TEN: 'Bộ môn Hệ thống thông tin', DAOTAO_COCAUTOCHUC_CHA_ID: 'K1' }, { ID: 'K2', TEN: 'Khoa Kinh tế' }];
    fx['pkg_nhansu_hoso_v2.LayDanhSachToanBo'] = DV;
    var HO = ['Nguyễn Văn', 'Trần Thị', 'Lê Quang', 'Phạm Minh', 'Hoàng Thu'], TEN = ['Hùng', 'Mai', 'Minh', 'Tuấn', 'Lan', 'Hà'];
    var CB = [];
    for (var i = 1; i <= 120; i++) {
        var dv = ['B11', 'B12', 'K2'][i % 3];
        CB.push({ ID: 'CB' + i, MASO: 'GV' + (1000 + i), HODEM: HO[i % 5], TEN: TEN[i % 6], DAOTAO_COCAUTOCHUC_ID: dv, DAOTAO_COCAUTOCHUC_TEN: (DV.filter(function (x) { return x.ID === dv; })[0] || {}).TEN,
            TINHTRANGNHANSU_ID: i % 10 === 0 ? 'TT2' : 'TT1' });
    }
    fx['pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2'] = function (o) {
        var dv = o.strDaoTao_CoCauToChuc_Id, tt = o.strTinhTrangNhanSu_Id;
        return CB.filter(function (r) { return (!dv || r.DAOTAO_COCAUTOCHUC_ID === dv || (dv === 'K1' && /^B1/.test(r.DAOTAO_COCAUTOCHUC_ID))) && (!tt || r.TINHTRANGNHANSU_ID === tt); });
    };
    var HP = [['L1', 'Lập trình hướng đối tượng', 'IT3100.01', 'A2-301'], ['L2', 'Cơ sở dữ liệu', 'IT3200.02', 'A1-205'], ['L3', 'Kinh tế vi mô', 'EC1010.01', 'C1-102']];
    fx['NS_ThongTinCanBo/LayDSLichGiang'] = function (o) {
        var n = +String(o.strNhanSu_HoSoCanBo_Id).slice(2), a = parse(o.strNgayBatDau), b = parse(o.strNgayKetThuc), ds = [], k = 0;
        for (var d = new Date(a); d <= b; d.setDate(d.getDate() + 1), k++) {
            if ((n + k) % 3 === 0) continue;
            var h = HP[(n + k) % 3], ca = (n + k) % 3;
            var r = { ID: 'LG' + ((n + k) % 7) + '_' + dmy(d), IDLOPHOCPHAN: h[0], TENHOCPHAN: h[1], TENLOPHOCPHAN: h[2], TENPHONGHOC: h[3], NGAYHOC: dmy(d) };
            if (ca === 1) { r.TIETBATDAU = 1; r.TIETKETTHUC = 3; r.GIOBATDAU = 7; r.PHUTBATDAU = 0; r.GIOKETTHUC = 9; r.PHUTKETTHUC = 25; }
            else { r.TIETBATDAU = 7; r.TIETKETTHUC = 9; r.GIOBATDAU = 13; r.PHUTBATDAU = 0; r.GIOKETTHUC = 15; r.PHUTKETTHUC = 30; }
            ds.push(r);
            if (n === 1 && k === 1) ds.push({ ID: 'KT_' + dmy(d), IDLOPHOCPHAN: 'L9', TENHOCPHAN: 'Buổi không có tiết', TENLOPHOCPHAN: 'X', TENPHONGHOC: 'X', NGAYHOC: dmy(d), GIOBATDAU: 19, PHUTBATDAU: 0, GIOKETTHUC: 21, PHUTKETTHUC: 0 });
        }
        return ds;
    };
    ums.demo.add(fx);
})();
