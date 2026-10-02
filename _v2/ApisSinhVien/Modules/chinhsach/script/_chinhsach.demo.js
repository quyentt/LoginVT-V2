/* Dữ liệu mẫu cho sáu màn lưới chính sách (_chinhsach.js) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    var DMU = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';

    var DOITUONG = {
        CD1: [
            { ID: 'CD1DT1', DOITUONG_ID: 'DT1', DOITUONG_TEN: 'Con thương binh, liệt sĩ' },
            { ID: 'CD1DT2', DOITUONG_ID: 'DT2', DOITUONG_TEN: 'Hộ nghèo, cận nghèo' },
            { ID: 'CD1DT3', DOITUONG_ID: 'DT3', DOITUONG_TEN: 'Dân tộc thiểu số vùng khó khăn' }
        ],
        CD2: [
            { ID: 'CD2DT4', DOITUONG_ID: 'DT4', DOITUONG_TEN: 'Khuyết tật' },
            { ID: 'CD2DT5', DOITUONG_ID: 'DT5', DOITUONG_TEN: 'Mồ côi cả cha lẫn mẹ' }
        ]
    };

    var HO = [['Nguyễn Văn', 'An'], ['Trần Thị', 'Bình'], ['Lê Hoàng', 'Cường'], ['Phạm Thu', 'Dung'],
        ['Hoàng Minh', 'Đức'], ['Vũ Thị', 'Hà'], ['Đặng Quốc', 'Huy'], ['Bùi Thanh', 'Lan'],
        ['Đỗ Văn', 'Long'], ['Ngô Thị', 'Mai'], ['Dương Anh', 'Nam'], ['Lý Thị', 'Oanh']];
    var LOP = [['L1', 'K67-KTPM1', 'CTKTPM', 'Kỹ thuật phần mềm'], ['L2', 'K67-QTKD2', 'CTQTKD', 'Quản trị kinh doanh']];

    function sv(i) {
        var l = LOP[i % 2];
        return {
            ID: 'SV' + (1000 + i), QLSV_NGUOIHOC_ID: 'NH' + (1000 + i),
            HEDAOTAO: 'Đại học chính quy', KHOADAOTAO: 'Khóa 67', CHUONGTRINH: l[3], KHOAQUANLY: i % 2 ? 'Khoa Kinh tế' : 'Khoa Công nghệ thông tin',
            LOP: l[1], MASO: 'DCQT.67.' + (420100 + i), HODEM: HO[i][0], TEN: HO[i][1],
            QLSV_NGUOIHOC_NGAYSINH: (10 + i) + '/0' + (1 + i % 9) + '/2005',
            CHUONGTRINH_ID: l[2], LOP_ID: l[0], QLSV_NGUOIHOC_TRANGTHAI_ID: 'TT1',
            TAICHINH_CS_GOIHOTRO_TEN: 'Gói hỗ trợ học tập'
        };
    }
    function svTH(i) {
        var x = sv(i);
        return {
            ID: 'TH' + (1000 + i), QLSV_NGUOIHOC_ID: x.QLSV_NGUOIHOC_ID,
            DAOTAO_HEDAOTAO_TEN: x.HEDAOTAO, DAOTAO_KHOADAOTAO_TEN: x.KHOADAOTAO, DAOTAO_CHUONGTRINH_TEN: x.CHUONGTRINH,
            KHOAQUANLY_TEN: x.KHOAQUANLY, DAOTAO_LOPQUANLY_TEN: x.LOP, QLSV_NGUOIHOC_MASO: x.MASO,
            QLSV_NGUOIHOC_HODEM: x.HODEM, QLSV_NGUOIHOC_TEN: x.TEN, QLSV_NGUOIHOC_NGAYSINH: x.QLSV_NGUOIHOC_NGAYSINH,
            DAOTAO_TOCHUCCHUONGTRINH_ID: x.CHUONGTRINH_ID, DAOTAO_LOPQUANLY_ID: x.LOP_ID, QLSV_TRANGTHAINGUOIHOC_ID: 'TT1',
            TAICHINH_CS_GOIHOTRO_TEN: x.TAICHINH_CS_GOIHOTRO_TEN
        };
    }
    function dsCS(o) {
        var r = HO.slice(0, 8).map(function (h, i) { return sv(i); });
        var q = (o.strTuKhoa || '').toLowerCase();
        return q ? r.filter(function (x) { return (x.HODEM + ' ' + x.TEN + ' ' + x.MASO).toLowerCase().indexOf(q) >= 0; }) : r;
    }
    function dsTH(o) {
        var all = HO.map(function (h, i) { return svTH(i); });
        var q = (o.strTuKhoa || '').toLowerCase();
        if (q) all = all.filter(function (x) { return (x.QLSV_NGUOIHOC_HODEM + ' ' + x.QLSV_NGUOIHOC_TEN + ' ' + x.QLSV_NGUOIHOC_MASO).toLowerCase().indexOf(q) >= 0; });
        var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
        return { rows: all.slice((pi - 1) * sz, pi * sz), pager: all.length };
    }
    /* Ô lưới: người học có số cuối chẵn + đối tượng đầu tiên → đã có bản ghi */
    function so(o) { return Number(String(o.strQLSV_NguoiHoc_Id || '').replace(/\D/g, '')) || 0; }
    function co(o) { return so(o) % 2 === 0 && (o.strDoiTuong_Id === 'DT1' || o.strDoiTuong_Id === 'DT4'); }

    ums.demo.add({
        'CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI': [
            { ID: 'TT1', TEN: 'Đang học' }, { ID: 'TT2', TEN: 'Bảo lưu' }, { ID: 'TT3', TEN: 'Tạm dừng' },
            { ID: 'TT4', TEN: 'Đã tốt nghiệp' }, { ID: 'TT5', TEN: 'Thôi học' }
        ],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'HK1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026' },
            { ID: 'HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026' },
            { ID: 'HK3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2026-2027' }
        ]
    });
    var fx = {};
    fx[DMU + 'KHDT.DIEM.KIEUHOC'] = [dm('KH1', 'HM', 'Học mới', 'Kiểu học'), dm('KH2', 'HL', 'Học lại', 'Kiểu học'), dm('KH3', 'CT', 'Cải thiện', 'Kiểu học')];
    fx[DMU + 'QLTC.CDCS'] = [dm('CD1', 'MGHP', 'Miễn giảm học phí', 'Chế độ chính sách'), dm('CD2', 'TCXH', 'Trợ cấp xã hội', 'Chế độ chính sách')];
    fx['SV_ChinhSach/LayDS_DoiTuong_CheDo'] = function (o) { return DOITUONG[o.strCheDoChinhSach_Id] || []; };
    fx['SV_ChinhSach/LayDSSV_ChinhSach_PhanTram'] = dsCS;
    fx['SV_ChinhSach/LayDSSV_TongHop_DoiTuong'] = dsTH;
    fx['SV_ChinhSach/LayDSSV_TongHop_PhanTram'] = dsTH;
    fx['SV_ChinhSach/LayDSSV_TongHop_SoTien'] = dsTH;
    fx['SV_ChinhSach/LayKQChinhSach_DoiTuong'] = function (o) { return co(o) ? [{ ID: 'KQ' + so(o) + o.strDoiTuong_Id, SOTHANG: 5 }] : []; };
    fx['PKG_HOSOSINHVIEN_CHINHSACH.LayKQChinhSach_PhanTram'] = function (o) {
        return co(o) ? [{ ID: 'PT' + so(o) + o.strDoiTuong_Id, SOTHANG: 5, PHANTRAMMIENGIAM: 50 }] : [];
    };
    fx['SV_ChinhSach/LayKQChinhSach_SoTien'] = function (o) {
        return co(o) ? [{ ID: 'ST' + so(o) + o.strDoiTuong_Id, SOTHANG: 10, SOTIEN: 1250000 }] : [];
    };
    fx['SV_LopQuanLy/LayDanhSach'] = [
        { ID: 'L1', TEN: 'K67-KTPM1', CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', KHOADAOTAO_TEN: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', HEDAOTAO_TEN: 'Đại học chính quy', SOSVDANGHOC: 48 },
        { ID: 'L2', TEN: 'K67-QTKD2', CHUONGTRINH_TEN: 'Quản trị kinh doanh', KHOADAOTAO_TEN: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa Kinh tế', HEDAOTAO_TEN: 'Đại học chính quy', SOSVDANGHOC: 52 },
        { ID: 'L3', TEN: 'K68-HTTT1', CHUONGTRINH_TEN: 'Hệ thống thông tin', KHOADAOTAO_TEN: 'Khóa 68', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', HEDAOTAO_TEN: 'Đại học chính quy', SOSVDANGHOC: 45 }
    ];
    fx['SV_KetQua_ChinhSach/LayDanhSach'] = [
        { ID: 'KQS1', TAICHINH_CACKHOANTHU_TEN: 'Trợ cấp sinh hoạt', SOTIENTHEOCHINHSACH: 1490000, SOTIEN: 1490000,
          DAOTAO_THOIGIANDAOTAO_HOCKY: 1, DAOTAO_THOIGIANDAOTAO_DOT: 1, NGAYAPDUNG: '01/09/2025',
          DOITUONG_TEN: 'Con thương binh, liệt sĩ', CHEDOCHINHSACH_TEN: 'Miễn giảm học phí', GHICHU: '' },
        { ID: 'KQS2', TAICHINH_CACKHOANTHU_TEN: 'Hỗ trợ chi phí học tập', SOTIENTHEOCHINHSACH: 894000, SOTIEN: 894000,
          DAOTAO_THOIGIANDAOTAO_HOCKY: 1, DAOTAO_THOIGIANDAOTAO_DOT: 1, NGAYAPDUNG: '01/09/2025',
          DOITUONG_TEN: 'Con thương binh, liệt sĩ', CHEDOCHINHSACH_TEN: 'Miễn giảm học phí', GHICHU: 'Theo QĐ 66/2013' }
    ];
    fx['PKG_HOSOSINHVIEN_CHINHSACH.LayDSChinhSachMienSV'] = [
        { KIEUHOC_TEN: 'Học mới', TAICHINH_CACKHOANTHU_TEN: 'Học phí', CHINHSACH_TEN: 'Miễn giảm học phí', DOITUONG_TEN: 'Con thương binh, liệt sĩ',
          DOITUONG_MA: 'CTB', THOIGIAN: 'Học kỳ 1 năm 2025-2026', SOTHANG: 5, PHANTRAMMIENGIAMDUYET: 50,
          QLSV_NGUOIHOC_MASO: 'DCQT.67.420100', QLSV_NGUOIHOC_HOTEN: 'Nguyễn Văn An', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm' }
    ];
    fx['PKG_HOSOSINHVIEN_CHINHSACH.LayDSTongHopNhieuDoiTuong'] = [
        { QLSV_NGUOIHOC_MASO: 'DCQT.67.420102', QLSV_NGUOIHOC_HOTEN: 'Lê Hoàng Cường', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1',
          DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', SO_DOITUONG: 2, DS_DOITUONG: 'Con thương binh, liệt sĩ; Hộ nghèo, cận nghèo' }
    ];
    ums.demo.add(fx);
})();
