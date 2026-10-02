/* Dữ liệu mẫu cho khaimucphinhaphoc — chỉ dùng ở chế độ dựng thử.
   Giữ đúng tên cột bản gốc đọc; thêm / sửa / xoá ghi vào bộ nhớ để thử được. */
(function () {
    var so = 0;
    function id(p) { so++; return p + ('000' + so).slice(-4) + 'A1B2C3D4E5F6A7B8C9D0E1F2'; }
    function bo(s) { return String(s || '').toLowerCase(); }
    var BAYGIO = '26/09/2026 09:15:32';

    var KEHOACH = [
        { ID: 'KHNH2026D1', TEN: 'Kế hoạch nhập học Đại học chính quy 2026 — đợt 1' },
        { ID: 'KHNH2026D2', TEN: 'Kế hoạch nhập học Đại học chính quy 2026 — đợt 2' },
        { ID: 'KHNH2026LT', TEN: 'Kế hoạch nhập học Liên thông 2026' }
    ];
    var NHOM = [
        { ID: 'NHOM01', NH_KEHOACH_NHAPHOC_ID: 'KHNH2026D1', MA_NHOM: 'CHUNG', TEN_NHOM: 'Mức phí chung', GHICHU: 'Áp dụng cho mọi ngành còn lại', PRIORITY_NO: 100, IS_DEFAULT: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '12/08/2026 08:30:11', NGUOITAO_TENDAYDU: 'Nguyễn Thị Hương' },
        { ID: 'NHOM02', NH_KEHOACH_NHAPHOC_ID: 'KHNH2026D1', MA_NHOM: 'CLC', TEN_NHOM: 'Chương trình chất lượng cao', GHICHU: 'Học phí kỳ 1 cao hơn', PRIORITY_NO: 10, IS_DEFAULT: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '12/08/2026 08:42:05', NGUOITAO_TENDAYDU: 'Nguyễn Thị Hương' },
        { ID: 'NHOM03', NH_KEHOACH_NHAPHOC_ID: 'KHNH2026D1', MA_NHOM: 'UUTIEN', TEN_NHOM: 'Đối tượng ưu tiên', GHICHU: 'Con thương binh, dân tộc thiểu số', PRIORITY_NO: 5, IS_DEFAULT: 0, NGAYTAO_DD_MM_YYYY_HHMMSS: '14/08/2026 14:10:47', NGUOITAO_TENDAYDU: 'Trần Văn Nam' },
        { ID: 'NHOM04', NH_KEHOACH_NHAPHOC_ID: 'KHNH2026D2', MA_NHOM: 'CHUNG2', TEN_NHOM: 'Mức phí chung đợt 2', GHICHU: '', PRIORITY_NO: 100, IS_DEFAULT: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '01/09/2026 10:00:00', NGUOITAO_TENDAYDU: 'Trần Văn Nam' }
    ];
    function kt(nhom, khoan, ten, ma, tien, dvt, bb, tds, tt, kieu, mg, cs, gc) {
        return { ID: id('KT'), NH_CAUHINH_TC_NHOM_ID: nhom, TAICHINH_CACKHOANTHU_ID: khoan, TEN_HIEN_THI: ten, KHOANTHU_MA: ma,
            NHOM_TEN: '', SO_TIEN_DINH_MUC: tien, DON_VI_TIEN_ID: dvt, BAT_BUOC: bb, TU_DONG_SINH_PHAITHU: tds, THU_TU_HIEN_THI: tt,
            KIEU_TU_DONG_SINH_PHAITHU_ID: kieu, CHO_PHEP_MIEN_GIAM: mg, NHAPHOC_COSO_ID: cs, GHICHU: gc };
    }
    var KHOAN = [
        kt('NHOM01', 'KT1', 'Học phí học kỳ 1', 'HP', 12500000, 'HK', 1, 1, 1, 'DINHMUC', 1, '', 'Thu khi nhập học'),
        kt('NHOM01', 'KT4', 'Bảo hiểm y tế 12 tháng', 'BHYT', 1263000, 'LAN', 1, 1, 2, 'DINHMUC', 0, '', ''),
        kt('NHOM01', 'KT5', 'Phí ký túc xá tháng đầu', 'KTX', 450000, 'THANG', 0, 0, 3, 'THEOSOLUONG', 0, 'CS1', 'Chỉ sinh viên đăng ký ở KTX'),
        kt('NHOM02', 'KT1', 'Học phí CLC học kỳ 1', 'HP', 21000000, 'HK', 1, 1, 1, 'DINHMUC', 1, '', ''),
        kt('NHOM02', 'KT4', 'Bảo hiểm y tế 12 tháng', 'BHYT', 1263000, 'LAN', 1, 1, 2, 'DINHMUC', 0, '', ''),
        kt('NHOM03', 'KT1', 'Học phí học kỳ 1 (ưu tiên)', 'HP', 6250000, 'HK', 1, 1, 1, 'DINHMUC', 1, '', 'Đã giảm 50%')
    ];
    function dr(khId, he, khoa, dtTen, dtMa, tsTen, tsMa, kql, ctTen, ctMa) {
        return { ID: id('DR'), NH_KEHOACH_NHAPHOC_ID: khId, HEDAOTAO_TEN: he, KHOADAOTAO_TEN: khoa, NGANH_DT_TEN: dtTen, NGANH_DT_MA: dtMa,
            NGANH_TS_TEN: tsTen, NGANH_TS_MA: tsMa, KHOAQUANLY_TEN: kql, CHUONGTRINH_TEN: ctTen, CHUONGTRINH_MA: ctMa, GHICHU: '' };
    }
    var DAURA = [
        dr('KHNH2026D1', 'Đại học chính quy', 'K71', 'Công nghệ thông tin', '7480201', 'Công nghệ thông tin', '7480201', 'Khoa Công nghệ thông tin', 'Công nghệ thông tin', 'CNTT71'),
        dr('KHNH2026D1', 'Đại học chính quy', 'K71', 'Kỹ thuật phần mềm', '7480103', 'Kỹ thuật phần mềm', '7480103', 'Khoa Công nghệ thông tin', 'Kỹ thuật phần mềm', 'KTPM71'),
        dr('KHNH2026D1', 'Đại học chính quy', 'K71', 'Quản trị kinh doanh', '7340101', 'Quản trị kinh doanh', '7340101', 'Khoa Kinh tế', 'Quản trị kinh doanh', 'QTKD71'),
        dr('KHNH2026D1', 'Đại học chính quy', 'K71', 'Kế toán', '7340301', 'Kế toán', '7340301', 'Khoa Kinh tế', 'Kế toán', 'KT71'),
        dr('KHNH2026D1', 'Đại học chính quy', 'K71', 'Công nghệ thông tin', '7480201', 'Công nghệ thông tin (CLC)', '7480201CLC', 'Khoa Công nghệ thông tin', 'CNTT chất lượng cao', 'CNTTCLC71'),
        dr('KHNH2026D1', 'Đại học chính quy', 'K71', 'Ngôn ngữ Anh', '7220201', 'Ngôn ngữ Anh', '7220201', 'Khoa Ngoại ngữ', 'Ngôn ngữ Anh', 'NNA71'),
        dr('KHNH2026D2', 'Đại học chính quy', 'K71', 'Luật kinh tế', '7380107', 'Luật kinh tế', '7380107', 'Khoa Luật', 'Luật kinh tế', 'LKT71')
    ];
    var NHOM_DR = [];   // { ID, NH_CAUHINH_TC_NHOM_ID, NH_KEHOACH_DAURA_ID }
    function ganDR(nhom, dra) { NHOM_DR.push({ ID: id('ND'), NH_CAUHINH_TC_NHOM_ID: nhom, NH_KEHOACH_DAURA_ID: dra }); }
    ganDR('NHOM01', DAURA[0].ID); ganDR('NHOM01', DAURA[1].ID); ganDR('NHOM01', DAURA[2].ID); ganDR('NHOM02', DAURA[4].ID);

    var DOITUONG = [
        { ID: 'DT01', MA: 'CTB', TEN: 'Con thương binh', CHUNG_TENDANHMUC_TEN: 'Đối tượng' },
        { ID: 'DT02', MA: 'DTTS', TEN: 'Người dân tộc thiểu số', CHUNG_TENDANHMUC_TEN: 'Đối tượng' },
        { ID: 'DT03', MA: 'HN', TEN: 'Hộ nghèo', CHUNG_TENDANHMUC_TEN: 'Đối tượng' }
    ];
    var DAUVAO = [
        { ID: id('DV'), NH_CAUHINH_TC_NHOM_ID: 'NHOM03', SV_MASO: '', SV_HOTEN: '', DOI_TUONG_TEN: 'Con thương binh', GHICHU: 'Theo quyết định 123/QĐ', IS_ACTIVE: 1, IS_CURRENT: 1 },
        { ID: id('DV'), NH_CAUHINH_TC_NHOM_ID: 'NHOM03', SV_MASO: '26A1001234', SV_HOTEN: 'Hoàng Minh Anh', DOI_TUONG_TEN: '', GHICHU: 'Hoàn cảnh đặc biệt', IS_ACTIVE: 1, IS_CURRENT: 0 },
        { ID: id('DV'), NH_CAUHINH_TC_NHOM_ID: 'NHOM03', SV_MASO: '', SV_HOTEN: '', DOI_TUONG_TEN: 'Hộ nghèo', GHICHU: '', IS_ACTIVE: 0, IS_CURRENT: 0 }
    ];

    var HO = ['Nguyễn Văn', 'Trần Thị', 'Lê Minh', 'Phạm Thu', 'Hoàng Đức', 'Vũ Thị', 'Đặng Quốc', 'Bùi Ngọc'];
    var TEN = ['An', 'Bình', 'Châu', 'Dũng', 'Giang', 'Hà', 'Khoa', 'Lan', 'Minh', 'Ngọc', 'Phúc', 'Quyên'];
    var NGANH = [['Công nghệ thông tin', 'Công nghệ thông tin', 'CNTT71', 'CNTT71.01'], ['Quản trị kinh doanh', 'Quản trị kinh doanh', 'QTKD71', 'QTKD71.02'],
        ['Kế toán', 'Kế toán', 'KT71', 'KT71.01'], ['Công nghệ thông tin (CLC)', 'CNTT chất lượng cao', 'CNTTCLC71', 'CLC71.01']];
    var THISINH = [];
    for (var i = 0; i < 64; i++) {
        var ng = NGANH[i % NGANH.length], clc = ng[2] === 'CNTTCLC71';
        var tong = i % 9 === 0 ? 0 : (clc ? 22263000 : 13763000) + (i % 5 === 0 ? 450000 : 0);
        var daNop = i % 3 === 0 ? tong : (i % 3 === 1 ? Math.round(tong / 2) : 0);
        var hoTen = HO[i % HO.length] + ' ' + TEN[i % TEN.length];
        THISINH.push({
            ID: 'INTAKE' + ('000' + (i + 1)).slice(-4), HODEM: HO[i % HO.length], TEN: TEN[i % TEN.length],
            IDENTIFIER_NO: '0012060' + ('00000' + (10234 + i * 37)).slice(-5), CURRENT_EMPLOYEE_CODE: '26A10' + ('0000' + (1001 + i)).slice(-5),
            FULL_NAME: hoTen, GENDER_TEN: i % 2 ? 'Nữ' : 'Nam', DATE_OF_BIRTH: ('0' + (1 + i % 28)).slice(-2) + '/' + ('0' + (1 + i % 12)).slice(-2) + '/2008',
            DAOTAO_NGANH_TS_TEN: ng[0], TENCHUONGTRINH: ng[1], MACHUONGTRINH: ng[2], LOPQUANLY_TEN: i % 4 === 3 ? '' : ng[3],
            THONGTINMUCPHI: clc ? 'Nhóm: Chương trình chất lượng cao' : 'Nhóm: Mức phí chung', TONGMUCPHI: tong, TONGSOTIENDANOP: daNop,
            SODIENTHOAICANHAN: '09' + ('0000000' + (12345678 + i * 911)).slice(-8), ISSTUDYCREATED: i % 3 === 2 ? 0 : 1,
            NGAYNOP: daNop ? ('0' + (1 + i % 20)).slice(-2) + '/09/2026' : '', GHICHU: i % 11 === 0 ? 'Chờ xác nhận miễn giảm' : ''
        });
    }

    function tim(ds, strId) { for (var k = 0; k < ds.length; k++) if (ds[k].ID === strId) return k; return -1; }
    function nhomCua(o) { return NHOM[tim(NHOM, o.strNH_CauHinh_TC_Nhom_Id)] || {}; }

    ums.demo.add({
        'PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_NhapHoc_By': function (o) {
            var q = bo(o.strTuKhoa);
            return KEHOACH.filter(function (x) { return !q || bo(x.TEN).indexOf(q) >= 0; });
        },
        'PKG_CORE_NHAPHOC.LayDS_NhapHoc_CauHinh_TC_Nhom': function (o) {
            return NHOM.filter(function (x) { return x.NH_KEHOACH_NHAPHOC_ID === o.strNH_KeHoach_NhapHoc_Id; });
        },
        'PKG_CORE_NHAPHOC.LayTT_NhapHoc_CauHinh_TC_Nhom': function (o) {
            var r = NHOM[tim(NHOM, o.strId)];
            if (!r) return [];
            // LayTT thật có thể không trả cột ID — màn phải tự giữ ID dòng đã bấm
            var c = {}; Object.keys(r).forEach(function (k) { if (k !== 'ID') c[k] = r[k]; });
            return [c];
        },
        'PKG_CORE_NHAPHOC.Them_NhapHoc_CauHinh_TC_Nhom': function (o) {
            NHOM.push({ ID: id('NH'), NH_KEHOACH_NHAPHOC_ID: o.strNH_KeHoach_NhapHoc_Id, MA_NHOM: o.strMa_Nhom, TEN_NHOM: o.strTen_Nhom,
                GHICHU: o.strGhiChu, PRIORITY_NO: o.dPriority_No, IS_DEFAULT: o.dIs_Default, NGAYTAO_DD_MM_YYYY_HHMMSS: BAYGIO, NGUOITAO_TENDAYDU: 'Cán bộ dựng thử' });
            return [];
        },
        'PKG_CORE_NHAPHOC.Sua_NhapHoc_CauHinh_TC_Nhom': function (o) {
            var r = NHOM[tim(NHOM, o.strId)];
            if (r) { r.MA_NHOM = o.strMa_Nhom; r.TEN_NHOM = o.strTen_Nhom; r.GHICHU = o.strGhiChu; r.PRIORITY_NO = o.dPriority_No; r.IS_DEFAULT = o.dIs_Default; }
            return [];
        },
        'PKG_CORE_NHAPHOC.Xoa_NhapHoc_CauHinh_TC_Nhom': function (o) { var k = tim(NHOM, o.strId); if (k >= 0) NHOM.splice(k, 1); return []; },

        'PKG_CORE_NHAPHOC.LayDS_NhapHoc_CauHinh_TC': function (o) {
            var ten = nhomCua(o).TEN_NHOM || '';
            return KHOAN.filter(function (x) { return x.NH_CAUHINH_TC_NHOM_ID === o.strNH_CauHinh_TC_Nhom_Id; })
                .map(function (x) { x.NHOM_TEN = ten; return x; });
        },
        'PKG_CORE_NHAPHOC.Them_NhapHoc_CauHinh_TC': function (o) {
            KHOAN.push(kt(o.strNH_CauHinh_TC_Nhom_Id, o.strTaiChinh_CacKhoanThu_Id, o.strTen_KhoanThu_HienThi, 'KT', o.dSo_Tien_Dinh_Muc, o.strDon_Vi_Tien_Id,
                o.dBat_Buoc, o.dTu_Dong_Sinh_PhaiThu, o.dThu_Tu_Hien_Thi, o.strKieu_Sinh_PhaiThu_Id, o.dCho_Phep_Mien_Giam, o.strNhapHoc_CoSo_Id, o.strGhiChu));
            return [];
        },
        'PKG_CORE_NHAPHOC.Sua_NhapHoc_CauHinh_TC': function (o) {
            var r = KHOAN[tim(KHOAN, o.strId)];
            if (r) {
                r.TAICHINH_CACKHOANTHU_ID = o.strTaiChinh_CacKhoanThu_Id; r.TEN_HIEN_THI = o.strTen_KhoanThu_HienThi; r.SO_TIEN_DINH_MUC = o.dSo_Tien_Dinh_Muc;
                r.DON_VI_TIEN_ID = o.strDon_Vi_Tien_Id; r.BAT_BUOC = o.dBat_Buoc; r.TU_DONG_SINH_PHAITHU = o.dTu_Dong_Sinh_PhaiThu; r.THU_TU_HIEN_THI = o.dThu_Tu_Hien_Thi;
                r.KIEU_TU_DONG_SINH_PHAITHU_ID = o.strKieu_Sinh_PhaiThu_Id; r.CHO_PHEP_MIEN_GIAM = o.dCho_Phep_Mien_Giam; r.NHAPHOC_COSO_ID = o.strNhapHoc_CoSo_Id; r.GHICHU = o.strGhiChu;
            }
            return [];
        },
        'PKG_CORE_NHAPHOC.Xoa_NhapHoc_CauHinh_TC': function (o) { var k = tim(KHOAN, o.strId); if (k >= 0) KHOAN.splice(k, 1); return []; },

        'PKG_CORE_NHAPHOC.LayDS_NH_CauHinh_TC_Nhom_DauRa': function (o) {
            return NHOM_DR.filter(function (x) { return x.NH_CAUHINH_TC_NHOM_ID === o.strNH_CauHinh_TC_Nhom_Id; }).map(function (x) {
                var d = DAURA[tim(DAURA, x.NH_KEHOACH_DAURA_ID)] || {};
                return { ID: x.ID, TENHEDAOTAO: d.HEDAOTAO_TEN, TENKHOA: d.KHOADAOTAO_TEN, TEN_NGANH_DT: d.NGANH_DT_TEN, MA_NGANH_DT: d.NGANH_DT_MA,
                    TEN_NGANH_TS: d.NGANH_TS_TEN, MA_NGANH_TS: d.NGANH_TS_MA, TEN_KHOAQUANLY: d.KHOAQUANLY_TEN, TENCHUONGTRINH: d.CHUONGTRINH_TEN,
                    MACHUONGTRINH: d.CHUONGTRINH_MA, GHICHU: '' };
            });
        },
        'PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_DauRa': function (o) {
            var q = bo(o.strTuKhoa);
            return DAURA.filter(function (x) {
                return x.NH_KEHOACH_NHAPHOC_ID === o.strNH_KeHoach_NhapHoc_Id &&
                    (!q || [x.NGANH_DT_TEN, x.NGANH_TS_TEN, x.CHUONGTRINH_TEN, x.CHUONGTRINH_MA, x.KHOAQUANLY_TEN].some(function (s) { return bo(s).indexOf(q) >= 0; }));
            });
        },
        'PKG_CORE_NHAPHOC.Them_NH_CauHinh_TC_Nhom_DauRa': function (o) { ganDR(o.strNH_CauHinh_TC_Nhom_Id, o.strNH_KeHoach_DauRa_Id); return []; },
        'PKG_CORE_NHAPHOC.Xoa_NH_CauHinh_TC_Nhom_DauRa': function (o) { var k = tim(NHOM_DR, o.strId); if (k >= 0) NHOM_DR.splice(k, 1); return []; },

        'PKG_CORE_NHAPHOC.LayDS_NH_CauHinh_TC_Nhom_DT': function (o) {
            return DAUVAO.filter(function (x) { return x.NH_CAUHINH_TC_NHOM_ID === o.strNH_CauHinh_TC_Nhom_Id; });
        },
        'PKG_CORE_NHAPHOC.Them_NH_CauHinh_TC_Nhom_DT': function (o) {
            var dt = DOITUONG[tim(DOITUONG, o.strDoi_Tuong_ApDung_Id)] || {};
            DAUVAO.push({ ID: id('DV'), NH_CAUHINH_TC_NHOM_ID: o.strNH_CauHinh_TC_Nhom_Id, SV_MASO: '', SV_HOTEN: '', DOI_TUONG_TEN: dt.TEN || '',
                GHICHU: o.strGhiChu, IS_ACTIVE: 1, IS_CURRENT: 1 });
            return [];
        },
        'PKG_CORE_NHAPHOC.Xoa_NH_CauHinh_TC_Nhom_DT': function (o) { var k = tim(DAUVAO, o.strId); if (k >= 0) DAUVAO.splice(k, 1); return []; },

        'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao': [{ ID: 'CS1', TEN: 'Cơ sở Hà Nội' }, { ID: 'CS2', TEN: 'Cơ sở Hưng Yên' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NHAPHOC_CAUHINH_TC.KIEUTUDONG.PHAINOP': [
            { ID: 'KTD1', MA: 'DINHMUC', TEN: 'Theo định mức', CHUNG_TENDANHMUC_TEN: 'Kiểu tự động sinh phải thu' },
            { ID: 'KTD2', MA: 'THEOSOLUONG', TEN: 'Theo số lượng đăng ký', CHUNG_TENDANHMUC_TEN: 'Kiểu tự động sinh phải thu' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.DOITUONG': DOITUONG,

        'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS': function () { return THISINH.slice(0, 12); },
        'PKG_CORE_NhapHoc_ThuTien.Gen_TaiChinh_PhaiNop_Intake': function (o) {
            return { rows: [], message: o.strCore_Person_Intake_Id === 'INTAKE0010' ? '' : 'Đã sinh 3 khoản phải nộp' };
        },
        'PKG_CORE_NhapHoc_ThuTien.LayDSMucPhiDaGanNhapHoc': function (o) {
            return String(o.dDaNhapHoc) === '1' ? THISINH.filter(function (x) { return x.ISSTUDYCREATED === 1; }) : THISINH;
        },
        'PKG_CORE_NhapHoc_ThuTien.LayDS_PhaiNop_TheoIntake': function (o) {
            var r = THISINH.filter(function (x) { return x.ID === o.strCore_Person_Intake_Id; })[0] || {};
            var clc = r.MACHUONGTRINH === 'CNTTCLC71', hp = clc ? 21000000 : 12500000;
            var daHP = Math.min(hp, r.TONGSOTIENDANOP || 0), daBH = Math.max(0, (r.TONGSOTIENDANOP || 0) - daHP);
            return [
                { TEN_KHOAN: clc ? 'Học phí CLC học kỳ 1' : 'Học phí học kỳ 1', MA_KHOAN: 'HP', SO_TIEN_PHAI_NOP: hp, SO_TIEN_DA_NOP: daHP, DON_VI_TIEN_MA: 'HK', GHICHU: '' },
                { TEN_KHOAN: 'Bảo hiểm y tế 12 tháng', MA_KHOAN: 'BHYT', SO_TIEN_PHAI_NOP: 1263000, SO_TIEN_DA_NOP: Math.min(1263000, daBH), DON_VI_TIEN_MA: 'LAN', GHICHU: '' }
            ];
        },
        'PKG_CORE_NhapHoc_ThuTien.LayDSThiSinhNhapHoc': function () { return THISINH; }
    });
    // DVT dùng danh mục TAICHINH.DVT chung (MA: TC, HK, THANG, LAN); khoản thu dùng TC_KhoanThu/LayDanhSach chung.
})();
