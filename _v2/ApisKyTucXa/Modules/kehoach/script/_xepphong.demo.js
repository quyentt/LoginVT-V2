/* Dữ liệu mẫu cho khung xếp phòng theo đăng ký (_xepphong.js) — chỉ ở chế độ dựng thử, nạp SAU _ktx.demo.js / _hoso.demo.js
   nên bọc lại kho toà nhà / phòng của _ktx.demo.js (thêm cột số người đang ở, chỗ trống, đơn giá) và ghi đè các lời gọi
   riêng của màn: KTX_DaXepPhong, KTX_DangKyPhong, KTX_NguoiHocOKTX, TC_KhoanThu, KTX_HopDong/ThemMoi, KTX_TinhTienPhongTheoNguoi. */
(function () {
    var fx = ums.demo.fixtures;
    function goc(h, o) { return typeof h === 'function' ? h(o) : h; }
    function list(r) { return Array.isArray(r) ? r : ((r && r.rows) || []); }
    function cung(r, rs) { return Array.isArray(r) ? rs : { rows: rs, pager: r && r.pager !== undefined ? r.pager : rs.length }; }
    function like(s, q) { return !q || String(s || '').toLowerCase().indexOf(String(q).toLowerCase()) >= 0; }
    function PHONG() { return (ums.demo.ktx && ums.demo.ktx.PHONG) || []; }
    function phong(id) { return PHONG().filter(function (p) { return p.ID === id; })[0] || {}; }
    var DONGIA = { LP1: 400000, LP2: 500000, LP3: 800000 };
    var BAO = { P301: 1 };
    var TCMA = { TC1: 'NAM', TC2: 'NU' };          // TINHCHAT_MA so với GIOITINH_MA người học (cảnh báo giới tính)

    /* Người học (hộp chọn người ở) — NO1…NO4 trùng id với _hoso.demo.js để Sửa hồ sơ đọc được chi tiết */
    var NH = [
        { ID: 'NO1', MASO: 'BIT220263', HODEM: 'Nguyễn Văn', TEN: 'An', NGAYSINH: '12', THANGSINH: '3', NAMSINH: '2004', GIOITINH_TEN: 'Nam', GIOITINH_MA: 'NAM', GIOITINH_ID: 'GT1', PHANLOAIDOITUONG_ID: 'DT1', TRANGTHAINGUOIHOC_TEN: 'Đang học', ANH: '', SDT: '0912 345 678' },
        { ID: 'NO2', MASO: 'BIT220271', HODEM: 'Trần Thị', TEN: 'Bình', NGAYSINH: '5', THANGSINH: '7', NAMSINH: '2004', GIOITINH_TEN: 'Nữ', GIOITINH_MA: 'NU', GIOITINH_ID: 'GT2', PHANLOAIDOITUONG_ID: 'DT1', TRANGTHAINGUOIHOC_TEN: 'Đang học', ANH: '', SDT: '0912 111 222' },
        { ID: 'NO3', MASO: 'BBA220561', HODEM: 'Lê Minh', TEN: 'Châu', NGAYSINH: '21', THANGSINH: '11', NAMSINH: '2004', GIOITINH_TEN: 'Nam', GIOITINH_MA: 'NAM', GIOITINH_ID: 'GT1', PHANLOAIDOITUONG_ID: 'DT1', TRANGTHAINGUOIHOC_TEN: 'Đang học', ANH: '', SDT: '0987 654 321' },
        { ID: 'NO4', MASO: 'BIT230210', HODEM: 'Phạm Thu', TEN: 'Dung', NGAYSINH: '2', THANGSINH: '1', NAMSINH: '2005', GIOITINH_TEN: 'Nữ', GIOITINH_MA: 'NU', GIOITINH_ID: 'GT2', PHANLOAIDOITUONG_ID: 'DT1', TRANGTHAINGUOIHOC_TEN: 'Đang học', ANH: '', SDT: '0909 000 111' },
        { ID: 'NO5', MASO: 'BIT230355', HODEM: 'Hoàng Đức', TEN: 'Em', NGAYSINH: '9', THANGSINH: '9', NAMSINH: '2005', GIOITINH_TEN: 'Nam', GIOITINH_MA: 'NAM', GIOITINH_ID: 'GT1', PHANLOAIDOITUONG_ID: 'DT2', TRANGTHAINGUOIHOC_TEN: 'Đang học', ANH: '', SDT: '0933 444 555' },
        { ID: 'NO6', MASO: 'BIT230402', HODEM: 'Vũ Ngọc', TEN: 'Giang', NGAYSINH: '14', THANGSINH: '2', NAMSINH: '2005', GIOITINH_TEN: 'Nữ', GIOITINH_MA: 'NU', GIOITINH_ID: 'GT2', PHANLOAIDOITUONG_ID: 'DT1', TRANGTHAINGUOIHOC_TEN: 'Bảo lưu', ANH: '', SDT: '0966 777 888' }
    ];
    function nh(id) { return NH.filter(function (x) { return x.ID === id; })[0] || {}; }
    function dongNguoi(id, phongId, extra) {
        var n = nh(id), p = phong(phongId);
        return Object.assign({ KTX_PHONG_ID: phongId, KTX_PHONG_MA: p.MA || '', KTX_PHONG_TEN: p.TEN || '', KTX_TOANHA_ID: p.KTX_TOANHA_ID || '', KTX_TOANHA_TEN: p.KTX_TOANHA_TEN || '',
            KTX_DOITUONGOKYTUCXA_ID: id, KTX_DOITUONGOKYTUCXA_HODEM: n.HODEM || '', KTX_DOITUONGOKYTUCXA_TEN: n.TEN || '', KTX_DOITUONGOKYTUCXA_MASO: n.MASO || '',
            KTX_DOITUONGOKYTUCXA_NGAYSINH: n.NGAYSINH ? n.NGAYSINH + '/' + n.THANGSINH + '/' + n.NAMSINH : '', KTX_DOITUONGOKYTUCXA_DIENTHOAI: n.SDT || '', ANH: '' }, extra || {});
    }
    var seq = 10;
    /* Đã xếp phòng (KTX_DaXepPhong) */
    var DXP = [
        dongNguoi('NO1', 'P101', { ID: 'DXP1', NGAYVAO: '01/09/2026', NGAYRA: '30/06/2027', KTX_HOPDONG_ID: 'HD1' }),
        dongNguoi('NO3', 'P101', { ID: 'DXP2', NGAYVAO: '01/09/2026', NGAYRA: '30/06/2027', KTX_HOPDONG_ID: '' }),
        dongNguoi('NO2', 'Q101', { ID: 'DXP3', NGAYVAO: '15/08/2026', NGAYRA: '', KTX_HOPDONG_ID: '' })
    ];
    /* Đăng ký chờ xác nhận (KTX_DangKyPhong) */
    var DK = [
        dongNguoi('NO4', 'P101', { ID: 'DK1', NGUOITHUCHIEN_ID: 'U-NO4', NGUOITHUCHIEN_TENDAYDU: 'Phạm Thu Dung', KTX_HOPDONG_ID: '' }),
        dongNguoi('NO5', 'P101', { ID: 'DK2', NGUOITHUCHIEN_ID: 'U-NO5', NGUOITHUCHIEN_TENDAYDU: 'Hoàng Đức Em', KTX_HOPDONG_ID: '' }),
        dongNguoi('NO6', 'Q102', { ID: 'DK3', NGUOITHUCHIEN_ID: 'U-NO6', NGUOITHUCHIEN_TENDAYDU: 'Vũ Ngọc Giang', KTX_HOPDONG_ID: '' })
    ];
    function dangO(phongId) { return DXP.filter(function (x) { return x.KTX_PHONG_ID === phongId; }).length; }
    function boSungPhong(p) {
        return Object.assign({}, p, { SONGUOIDANGOPHONG: dangO(p.ID), DONGIAPHONGTUNGNGUOI: DONGIA[p.LOAIPHONG_ID] || 300000, BAOPHONG: BAO[p.ID] || 0, TINHCHAT_MA: TCMA[p.TINHCHAT_ID] || '' });
    }
    var cuToa = fx['KTX_ToaNha/LayDanhSach'], cuPhong = fx['KTX_Phong/LayDanhSach'], cuChiTiet = fx['KTX_Phong/LayChiTiet'];
    ums.demo.add({
        'KTX_ToaNha/LayDanhSach': function (o) {
            var r = goc(cuToa, o);
            var rs = list(r).filter(function (t) {
                /* lọc toà theo thuộc tính phòng như máy chủ: toà có ít nhất một phòng khớp Loại phòng / Tính chất */
                if (!o.strLoaiPhong_Id && !o.strTinhChat_Id) return true;
                return PHONG().some(function (p) { return p.KTX_TOANHA_ID === t.ID && (!o.strLoaiPhong_Id || p.LOAIPHONG_ID === o.strLoaiPhong_Id) && (!o.strTinhChat_Id || p.TINHCHAT_ID === o.strTinhChat_Id); });
            }).map(function (t) {
                var ps = PHONG().filter(function (p) { return p.KTX_TOANHA_ID === t.ID; }), trong = 0, cho = 0;
                ps.forEach(function (p) { var c = Number(p.SOSINHVIENTOIDA || 0) - dangO(p.ID); if (c > 0) { trong++; cho += c; } });
                return Object.assign({}, t, { TONGSOPHONG: ps.length, SOPHONGTRONG: trong, TONGSOCHOTRONG: cho });
            });
            return cung(r, rs);
        },
        'KTX_Phong/LayDanhSach': function (o) { var r = goc(cuPhong, o); return cung(r, list(r).map(boSungPhong)); },
        'KTX_Phong/LayChiTiet': function (o) {
            return list(goc(cuChiTiet, o)).map(function (p) {
                return Object.assign(boSungPhong(p), { CHISODIENCUOICUNG: 1250, NGAYCHISODIENCUOICUNG: '(30/09/2026)', CHISONUOCCUOICUNG: 318, NGAYCHISONUOCCUOICUNG: '(30/09/2026)',
                    DONGIACAPHONG: (DONGIA[p.LOAIPHONG_ID] || 300000) * Number(p.SOSINHVIENTOIDA || 1), DONGIATUNGNGUOI: DONGIA[p.LOAIPHONG_ID] || 300000 });
            });
        },
        'KTX_DaXepPhong/LayDanhSach': function (o) {
            var rs = DXP.filter(function (x) { return (!o.strKTX_Phong_Id || x.KTX_PHONG_ID === o.strKTX_Phong_Id) && (!o.strKTX_DoiTuongOKyTucXa_Id || x.KTX_DOITUONGOKYTUCXA_ID === o.strKTX_DoiTuongOKyTucXa_Id); });
            return { rows: rs, pager: rs.length };
        },
        'KTX_DaXepPhong/ThemMoi': function (o) {
            if (DXP.some(function (x) { return x.KTX_DOITUONGOKYTUCXA_ID === o.strKTX_DoiTuongOKyTucXa_Id; })) return { rows: [], message: 'Đối tượng đang ở một phòng khác, hãy cho rời phòng trước!' };
            var id = 'DXP' + (seq++);
            DXP.push(dongNguoi(o.strKTX_DoiTuongOKyTucXa_Id, o.strKTX_Phong_Id, { ID: id, NGAYVAO: o.strNgayVao || '', NGAYRA: o.strNgayRa || '', KTX_HOPDONG_ID: '' }));
            return { rows: [], raw: { Id: id } };
        },
        'KTX_DaXepPhong/Xoa': function (o) {
            var ids = String(o.strIds || '').split(',');
            for (var i = DXP.length - 1; i >= 0; i--) if (ids.indexOf(DXP[i].ID) >= 0) DXP.splice(i, 1);
            return { rows: [], message: '' };
        },
        'KTX_DangKyPhong/LayDanhSach': function (o) {
            var rs = DK.filter(function (x) { return !o.strKTX_Phong_Id || x.KTX_PHONG_ID === o.strKTX_Phong_Id; });
            return { rows: rs, pager: rs.length };
        },
        'KTX_DangKyPhong/Xoa': function (o) {
            var ids = String(o.strIds || '').split(',');
            for (var i = DK.length - 1; i >= 0; i--) if (ids.indexOf(DK[i].ID) >= 0) DK.splice(i, 1);
            return { rows: [], message: '' };
        },
        'KTX_NguoiHocOKTX/LayDanhSach': function (o) {
            var rs = NH.filter(function (x) {
                return (like(x.HODEM + ' ' + x.TEN, o.strTuKhoa) || like(x.MASO, o.strTuKhoa)) &&
                    (!o.strGioiTinh_Id || x.GIOITINH_ID === o.strGioiTinh_Id) && (!o.strPhanLoaiDoiTuong_Id || x.PHANLOAIDOITUONG_ID === o.strPhanLoaiDoiTuong_Id);
            });
            var size = Number(o.pageSize) || 10, idx = Number(o.pageIndex) || 1;
            return { rows: rs.slice((idx - 1) * size, idx * size), pager: rs.length };
        },
        'TC_KhoanThu/LayDanhSach': function () {
            return [
                { ID: 'KT1', MA: 'KTX.TIENPHONG', TEN: 'Tiền phòng ký túc xá', NHOMCACKHOANTHU_MA: 'KTX' },
                { ID: 'KT2', MA: 'KTX.DIEN', TEN: 'Tiền điện', NHOMCACKHOANTHU_MA: 'KTX' },
                { ID: 'KT3', MA: 'KTX.NUOC', TEN: 'Tiền nước', NHOMCACKHOANTHU_MA: 'KTX' },
                { ID: 'KT4', MA: 'KTXMG.TIENPHONG', TEN: 'Miễn giảm tiền phòng', NHOMCACKHOANTHU_MA: 'MienGiamKTX' },
                { ID: 'KT5', MA: 'KTXMG.DIEN', TEN: 'Miễn giảm tiền điện', NHOMCACKHOANTHU_MA: 'MienGiamKTX' },
                { ID: 'KT6', MA: 'HP.HOCPHI', TEN: 'Học phí', NHOMCACKHOANTHU_MA: 'HOCPHI' }
            ];
        },
        'KTX_HopDong/ThemMoi': function (o) {
            var id = 'HD' + (seq++);
            DXP.forEach(function (x) { if (x.KTX_DOITUONGOKYTUCXA_ID === o.strKTX_DoiTuongOKyTucXa_Id) x.KTX_HOPDONG_ID = id; });
            return { rows: [], raw: { Id: id } };
        },
        'KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi': function (o) {
            var p = phong(o.strKTX_Phong_Id);
            return [{ TONGTIEN: (DONGIA[p.LOAIPHONG_ID] || 300000) * (Number(o.dSoThang) || 0) }];
        }
    });
    ums.demo.ktxXP = { DXP: DXP, DK: DK, NH: NH };
})();
