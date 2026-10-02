/* Dữ liệu mẫu cho Thu tiền nhập học (taichinhnew + bản cũ taichinh) — chỉ dùng ở chế độ dựng thử.
   Giữ đúng tên cột bản gốc đọc. Thu tiền / sửa / huỷ phiếu ghi vào kho tạm để thử trọn vòng. */
(function () {
    'use strict';

    var KH = [
        { ID: 'KHNH25D1', TENKEHOACH: 'Kế hoạch nhập học Đại học chính quy K2025 - Đợt 1' },
        { ID: 'KHNH25D2', TENKEHOACH: 'Kế hoạch nhập học Đại học chính quy K2025 - Đợt 2' }
    ];

    function nh(id, ho, ten, sbd, maso, ns, nganh, lop, daNhap, dt, kv, mg, diem) {
        return {
            ID: id, HODEM: ho, TEN: ten, SOBAODANH: sbd, MASO: maso, ANH: '', DANHAPHOC: daNhap,
            NGAYSINH_NGAY: ns[0], NGAYSINH_THANG: ns[1], NGAYSINH_NAM: ns[2],
            SODIENTHOAICANHAN: '09' + sbd.slice(-8), CMTND_SO: '0012050' + sbd.slice(-5),
            HOKHAU_PHUONGXAKHOIXOM: 'Xã Quyết Thắng', HOKHAU_PHUONGXA_TEN: 'Xã Quyết Thắng',
            HOKHAU_QUANHUYEN_TEN: 'TP Thái Nguyên', HOKHAU_TINHTHANH_TEN: 'Thái Nguyên',
            DAOTAO_NGANHNHAPHOC: nganh, NGANHHOC_TEN: nganh, DAOTAO_LOPQUANLY_TEN: lop, DAOTAO_KHOADAOTAO_TEN: 'K2025',
            DOITUONGDUTHI_TEN: dt, KHUVUC_TEN: kv, PHANTRAMMIENGIAM: mg, DIEMTS_TONGDIEM: diem,
            MASOTHUECANHAN: '', NOIOHIENNAY: 'Tổ 5, Phường Tân Thịnh, TP Thái Nguyên', DIACHINGUOIMUA: 'Tổ 5, Phường Tân Thịnh, TP Thái Nguyên',
            SODATHUTIEN: 0, MOHINHNHAPHOC_MA: 'TRUCTIEP'
        };
    }
    var NGUOI = [
        nh('NH01', 'Nguyễn Văn', 'An', 'TNU25000101', 'DTC255200101', ['12', '03', '2007'], 'Công nghệ thông tin', 'CNTT K25A', 1, 'Đối tượng 01', 'KV1', 0, 26.5),
        nh('NH02', 'Trần Thị', 'Bình', 'TNU25000102', 'DTC255200102', ['05', '11', '2007'], 'Kỹ thuật phần mềm', 'KTPM K25A', 1, '', 'KV2-NT', 0, 24.75),
        nh('NH03', 'Lê Minh', 'Châu', 'TNU25000103', '', ['21', '07', '2007'], 'Hệ thống thông tin', '', 0, 'Đối tượng 06', 'KV1', 50, 22),
        nh('NH04', 'Phạm Thu', 'Dung', 'TNU25000104', 'DTC255200104', ['30', '01', '2007'], 'Công nghệ thông tin', 'CNTT K25B', 1, '', 'KV2', 0, 25.25),
        nh('NH05', 'Hoàng Đức', 'Em', 'TNU25000105', '', ['14', '09', '2007'], 'An toàn thông tin', '', 0, '', 'KV3', 0, 23.5),
        nh('NH06', 'Vũ Thị Hồng', 'Gấm', 'TNU25000106', 'DTC255200106', ['02', '02', '2007'], 'Truyền thông đa phương tiện', 'TTĐPT K25A', 1, 'Đối tượng 01', 'KV1', 100, 27),
        nh('NH07', 'Đỗ Quang', 'Huy', 'TNU25000107', 'DTC255200107', ['19', '06', '2007'], 'Kỹ thuật máy tính', 'KTMT K25A', 1, '', 'KV2-NT', 0, 21.75),
        nh('NH08', 'Bùi Ngọc', 'Khánh', 'TNU25000108', '', ['08', '12', '2007'], 'Khoa học máy tính', '', 0, '', 'KV2', 0, 24)
    ];
    var KHOAN = [
        { TAICHINH_CACKHOANTHU_ID: 'KT01', TAICHINH_CACKHOANTHU_TEN: 'Học phí học kỳ 1', SOTIENDINHMUC_CHUNG: 8500000, DAOTAO_THOIGIANDAOTAO_ID: 'TG251' },
        { TAICHINH_CACKHOANTHU_ID: 'KT02', TAICHINH_CACKHOANTHU_TEN: 'Bảo hiểm y tế', SOTIENDINHMUC_CHUNG: 884520, DAOTAO_THOIGIANDAOTAO_ID: 'TG251' },
        { TAICHINH_CACKHOANTHU_ID: 'KT03', TAICHINH_CACKHOANTHU_TEN: 'Khám sức khoẻ đầu khoá', SOTIENDINHMUC_CHUNG: 150000, DAOTAO_THOIGIANDAOTAO_ID: 'TG251' },
        { TAICHINH_CACKHOANTHU_ID: 'KT04', TAICHINH_CACKHOANTHU_TEN: 'Thẻ sinh viên', SOTIENDINHMUC_CHUNG: 50000, DAOTAO_THOIGIANDAOTAO_ID: 'TG251' },
        { TAICHINH_CACKHOANTHU_ID: 'KT05', TAICHINH_CACKHOANTHU_TEN: 'Đồng phục thể dục', SOTIENDINHMUC_CHUNG: 320000, DAOTAO_THOIGIANDAOTAO_ID: 'TG251' }
    ];
    var HT = { HT1: ['TM', 'Tiền mặt'], HT2: ['CK', 'Chuyển khoản'], HT3: ['POS', 'Quẹt thẻ POS'], HT4: ['VNPAY', 'Cổng VNPAY'] };

    /* Kho phiếu: { ID, SO, NH, HUY, HT, NGAY, DONG: [{ KT, TIEN }] } */
    var PHIEU = [
        { ID: 'PT01', SO: '0000125', NH: 'NH01', HUY: 0, HT: 'HT1', NGAY: '18/08/2025', DONG: [{ KT: 'KT01', TIEN: 8500000 }, { KT: 'KT02', TIEN: 884520 }] },
        { ID: 'PT02', SO: '0000126', NH: 'NH01', HUY: 1, HT: 'HT2', NGAY: '17/08/2025', DONG: [{ KT: 'KT03', TIEN: 150000 }] },
        { ID: 'PT03', SO: '0000127', NH: 'NH02', HUY: 0, HT: 'HT1', NGAY: '18/08/2025', DONG: [{ KT: 'KT01', TIEN: 8500000 }, { KT: 'KT02', TIEN: 884520 }, { KT: 'KT03', TIEN: 150000 }, { KT: 'KT04', TIEN: 50000 }, { KT: 'KT05', TIEN: 320000 }] }
    ];
    var soTiep = 128, idTiep = 10;

    function daThu(nhId, ktId) {
        return PHIEU.filter(function (p) { return p.NH === nhId && !p.HUY; }).reduce(function (a, p) {
            return a + p.DONG.filter(function (d) { return d.KT === ktId; }).reduce(function (b, d) { return b + d.TIEN; }, 0);
        }, 0);
    }
    function tongDaThu(nhId) { return KHOAN.reduce(function (a, k) { return a + daThu(nhId, k.TAICHINH_CACKHOANTHU_ID); }, 0); }
    function nguoi(id) {
        var n = NGUOI.filter(function (x) { return x.ID === id; })[0];
        if (!n) return null;
        var o = {}; Object.keys(n).forEach(function (k) { o[k] = n[k]; });
        o.SODATHUTIEN = tongDaThu(id);
        return o;
    }

    function dsNguoiHoc(o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var dk = String(o.dDaNhapHoc);
        var ds = NGUOI.filter(function (n) {
            if (o.strTaiChinh_KeHoach_Id === 'xxx') return false;
            if (dk === '1' && n.DANHAPHOC !== 1) return false;
            if (dk === '0' && n.DANHAPHOC !== 0) return false;
            return !q || (n.HODEM + ' ' + n.TEN + ' ' + n.SOBAODANH + ' ' + n.MASO).toLowerCase().indexOf(q) >= 0;
        }).map(function (n) { return nguoi(n.ID); });
        var size = Number(o.pageSize) || 10, i = Number(o.pageIndex) || 1;
        return { rows: ds.slice((i - 1) * size, i * size), pager: ds.length };
    }
    function cacKhoan(o) {
        var id = o.strQLSV_NguoiHoc_TTTS_Id;
        var n = NGUOI.filter(function (x) { return x.ID === id; })[0];
        var mg = n ? Number(n.PHANTRAMMIENGIAM) || 0 : 0;
        return KHOAN.map(function (k) {
            var dm = k.TAICHINH_CACKHOANTHU_ID === 'KT01' ? Math.round(k.SOTIENDINHMUC_CHUNG * (100 - mg) / 100) : k.SOTIENDINHMUC_CHUNG;
            return { TAICHINH_CACKHOANTHU_ID: k.TAICHINH_CACKHOANTHU_ID, TAICHINH_CACKHOANTHU_TEN: k.TAICHINH_CACKHOANTHU_TEN,
                SOTIENDINHMUC_CHUNG: k.SOTIENDINHMUC_CHUNG, SOTIENDINHMUC: dm, SOTIENDATHU: daThu(id, k.TAICHINH_CACKHOANTHU_ID) };
        });
    }
    function thuTien(o) {
        var ids = String(o.strTAICHINH_CacKhoanThu_Ids || '').split(','), tien = String(o.strTAICHINH_SoTien_s || '').split(',');
        var p = { ID: 'PT' + (idTiep++), SO: '0000' + (soTiep++), NH: o.strQLSV_NguoiHoc_TTTS_Id, HUY: 0, HT: o.strHinhThucThu_Id || 'HT1',
            NGAY: o.strNgayThuTien || '27/09/2026', DONG: [] };
        ids.forEach(function (k, i) { var t = Number(tien[i]) || 0; if (t) p.DONG.push({ KT: k, TIEN: t }); });
        PHIEU.push(p);
        return { rows: null, message: p.ID + ',' + p.SO };
    }
    function khoanDaThu(o) {
        var p = PHIEU.filter(function (x) { return x.ID === o.strPhieuThu_Rut_Id; })[0];
        if (!p) return [];
        var ht = HT[p.HT] || HT.HT1, ng = p.NGAY.split('/');
        return p.DONG.map(function (d, i) {
            var k = KHOAN.filter(function (x) { return x.TAICHINH_CACKHOANTHU_ID === d.KT; })[0] || {};
            return {
                ID: p.ID + '_' + i, CHUNGTU_ID: p.ID, SOCHUNGTU: p.SO, NOIDUNG: k.TAICHINH_CACKHOANTHU_TEN, SOTIENDATHU: d.TIEN,
                TAICHINH_CACKHOANTHU_ID: d.KT, DAOTAO_THOIGIANDAOTAO_ID: k.DAOTAO_THOIGIANDAOTAO_ID,
                MAUIN_MASO: 'DHTL_PHIEUTHU_NHAPHOC_2018', TENPHIEU: 'PHIẾU THU', MAUSO: 'C40-BB', KYHIEU: 'NH25',
                HINHTHUCTHU_ID: p.HT, HINHTHUCTHU_MA: ht[0], HINHTHUCTHU_TEN: ht[1], LOAITIENTE_MA: 'VND', DONVITINH_TEN: 'Lần',
                NGAYTAO_DD_MM_YYYY: p.NGAY, NGAYIN_NGAY: ng[0], NGAYIN_THANG: ng[1], NGAYIN_NAM: ng[2],
                NGUOITAO_TENDAYDU: 'Hoàng Thu Trang', DAOTAO_COCAUTOCHUC_TEN: 'Trường Đại học Công nghệ Thông tin và Truyền thông',
                MA_QHNS: '1057284', MASOTHUE: '4600399999', DIACHI: 'Đường Z115, Quyết Thắng, TP Thái Nguyên', SODIENTHOAI: '0208 3846 254'
            };
        });
    }
    function suaPhieu(o) {
        var p = PHIEU.filter(function (x) { return x.ID === o.strPhieuThu_Rut_Id; })[0];
        if (!p) return [];
        var ids = String(o.strTAICHINH_CacKhoanThu_Ids || '').split(','), tien = String(o.strTAICHINH_SoTien_s || '').split(',');
        p.DONG = [];
        ids.forEach(function (k, i) { var t = Number(tien[i]) || 0; if (t) p.DONG.push({ KT: k, TIEN: t }); });
        if (o.strHinhThucThu_Ids) p.HT = o.strHinhThucThu_Ids;
        if (o.strNgayTao) p.NGAY = o.strNgayTao;
        return [];
    }
    function dsPhieu(huy) {
        return function (o) {
            var id = o.strQlsv_Nguoihoc_Id || o.strQLSV_NguoiHoc_Id;
            return PHIEU.filter(function (p) { return p.NH === id && !!p.HUY === huy; }).map(function (p) { return { ID: p.ID, SOPHIEUTHU: p.SO }; });
        };
    }
    var hdTiep = 1;

    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc': KH,
        'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS': dsNguoiHoc,
        'PKG_CORE_NhapHoc_ThuTien.LayDSCacKhoanNhapHoc': cacKhoan,
        'PKG_CORE_NhapHoc_ThuTien.NhapHoc_ThuTien': thuTien,
        'PKG_CORE_NhapHoc_ThuTien.NhapHoc_SuaPhieuThu': suaPhieu,
        'PKG_CORE_NhapHoc_ThuTien.LayTTQLSV_NguoiHoc_TTTS': function (o) { var n = nguoi(o.strId); return n ? [n] : []; },
        'PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc': khoanDaThu,
        /* bản cũ — cùng dữ liệu */
        'NH_DinhMuc_Chung/LayDSCacKhoanNhapHoc': cacKhoan,
        'NH_ThongTin/NhapHoc_ThuTien': thuTien,
        'NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_SuaPhieuThu': suaPhieu,
        'NH_NguoiHoc_ThongTinTuyenSinh/LayChiTiet': function (o) { var n = nguoi(o.strId); return n ? [n] : []; },
        'NH_DinhMuc_Chung/LayDSKhoanDaThuNhapHoc': khoanDaThu,
        /* phiếu */
        'TC_PhieuThu/LayDSPhieuThuNhaphoc': dsPhieu(false),
        'TC_PhieuThu/LayDSPhieuThuNhaphoc_Huy': dsPhieu(true),
        'TC_PhieuThu/HuyPhieuNhapHoc': function (o) {
            PHIEU.forEach(function (p) { if (p.ID === o.strPhieu_Id) p.HUY = 1; });
            return [];
        },
        /* hoá đơn */
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.NUTHDDT': [
            { ID: 'N1', MA: 'HDDTNHAP', TEN: 'Xem bản nháp HĐĐT', THONGTIN1: 'fa fa-eye', THONGTIN2: '', THONGTIN3: '' },
            { ID: 'N2', MA: 'HDDT_VNPT', TEN: 'Xuất HĐĐT (VNPT)', THONGTIN1: 'fa fa-paper-plane', THONGTIN2: '', THONGTIN3: '' }
        ],
        'TC_DaNop_HoaDon/ThemMoi': function () { return { rows: null, raw: { Id: 'HDNH' + (hdTiep++) } }; },
        'HDDT_HoaDon/ThemMoi': function () { return { rows: null, raw: { Id: 'HDNH' + (hdTiep++) } }; },
        'HDDT_HoaDon/ThemMoi_Nhap': { rows: 'HDDTFILE/nhap-nhaphoc-demo.pdf' },
        'TC_HoaDon/HuyHoaDon': [],
        'TC_HoaDon/Them_TinhTrangInHoaDon': []
    });
})();
