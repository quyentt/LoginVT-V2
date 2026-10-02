/* Dữ liệu mẫu cho Kế hoạch thi lại — chỉ dùng ở chế độ dựng thử. Tên cột chép từ bản gốc. */
(function () {
    'use strict';

    var AC = 'DKH_DangKyThi_MonThi_Chung/', TT = 'DKH_DangKyThi_MonThi_ThongTin/';
    var PK = 'PKG_DANGKYTHI_MONTHI_CHUNG.', PT = 'pkg_dangkythi_monthi_thongtin.', PD = 'pkg_dangkythi_monthi_diem.';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    function like(rows, q, cols) {
        q = String(q || '').toLowerCase().trim();
        if (!q) return rows;
        return rows.filter(function (r) { return cols.some(function (c) { return String(r[c] || '').toLowerCase().indexOf(q) >= 0; }); });
    }
    function cua(store, id) { return store[id] || (store[id] = []); }
    function xoaKhoi(store, id) {
        Object.keys(store).forEach(function (k) { store[k] = store[k].filter(function (r) { return r.ID !== id; }); });
    }
    var seq = 100;
    function moi(p) { return p + (seq++); }

    /* ---------- Kế hoạch ------------------------------------------------ */
    var MH = { DK: dm('MH1', 'TUDK', 'Sinh viên tự đăng ký', 'Mô hình đăng ký thi'), CB: dm('MH2', 'CBDK', 'Cán bộ đăng ký hộ', 'Mô hình đăng ký thi') };
    var LOAI = [dm('PL1', 'THILAI', 'Thi lại', 'Phân loại kế hoạch thi'), dm('PL2', 'THICAITHIEN', 'Thi cải thiện điểm', 'Phân loại kế hoạch thi')];
    var KH = [
        { ID: 'KHTL01', TENKEHOACH: 'Thi lại học kỳ 2 năm học 2025-2026', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Thi lại', MOHINHDANGKY_ID: 'MH1', MOHINHDANGKY_TEN: 'Sinh viên tự đăng ký',
          TUNGAY: '01/08/2026', DENNGAY: '15/08/2026', NGAYHANNOPPHI: '20/08/2026', TRINHDO: 'Đại học', THOIGIANTHIDUKIEN: 'Tuần 2 tháng 9/2026', DIADIEMDUKIEN: 'Nhà A2',
          HIEULUC: 1, MOTA: 'Kế hoạch thi lại cho sinh viên chưa đạt học kỳ 2' },
        { ID: 'KHTL02', TENKEHOACH: 'Thi cải thiện hè 2026', PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Thi cải thiện điểm', MOHINHDANGKY_ID: 'MH1', MOHINHDANGKY_TEN: 'Sinh viên tự đăng ký',
          TUNGAY: '10/06/2026', DENNGAY: '25/06/2026', NGAYHANNOPPHI: '30/06/2026', TRINHDO: 'Đại học', THOIGIANTHIDUKIEN: 'Tháng 7/2026', DIADIEMDUKIEN: 'Nhà B1',
          HIEULUC: 1, MOTA: '' },
        { ID: 'KHTL03', TENKEHOACH: 'Thi lại học kỳ 1 năm học 2025-2026', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Thi lại', MOHINHDANGKY_ID: 'MH2', MOHINHDANGKY_TEN: 'Cán bộ đăng ký hộ',
          TUNGAY: '05/02/2026', DENNGAY: '20/02/2026', NGAYHANNOPPHI: '25/02/2026', TRINHDO: 'Đại học', THOIGIANTHIDUKIEN: 'Tuần 1 tháng 3/2026', DIADIEMDUKIEN: 'Nhà A2, A3',
          HIEULUC: 0, MOTA: 'Đã kết thúc' },
        { ID: 'KHTL04', TENKEHOACH: 'Thi lại liên thông đợt 1/2026', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Thi lại', MOHINHDANGKY_ID: 'MH2', MOHINHDANGKY_TEN: 'Cán bộ đăng ký hộ',
          TUNGAY: '15/03/2026', DENNGAY: '30/03/2026', NGAYHANNOPPHI: '05/04/2026', TRINHDO: 'Liên thông', THOIGIANTHIDUKIEN: 'Tháng 4/2026', DIADIEMDUKIEN: 'Cơ sở 2',
          HIEULUC: 1, MOTA: '' }
    ];
    function capNhat(r, o) {
        r.TENKEHOACH = o.strTenKeHoach; r.PHANLOAI_ID = o.strPhanLoai_Id; r.MOHINHDANGKY_ID = o.strMoHinhDangKy_Id;
        r.PHANLOAI_TEN = (LOAI.filter(function (x) { return x.ID === o.strPhanLoai_Id; })[0] || {}).TEN || '';
        r.MOHINHDANGKY_TEN = (o.strMoHinhDangKy_Id === 'MH2' ? MH.CB : o.strMoHinhDangKy_Id === 'MH1' ? MH.DK : {}).TEN || '';
        r.TUNGAY = o.strTuNgay; r.DENNGAY = o.strDenNgay; r.NGAYHANNOPPHI = o.strHanNopPhi; r.TRINHDO = o.strTrinhDo;
        r.THOIGIANTHIDUKIEN = o.strThoiGianThiDuKien; r.DIADIEMDUKIEN = o.strDiaDiemDuKien; r.HIEULUC = Number(o.dHieuLuc); r.MOTA = o.strMoTa;
        return r;
    }

    /* ---------- Khối con của kế hoạch ------------------------------------ */
    var TG = [
        { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2025-2026' },
        { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2025-2026' },
        { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ hè năm học 2025-2026' },
        { ID: 'TG4', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2026-2027' }
    ];
    var KH_TG = { KHTL01: [{ ID: 'KTG1', DAOTAO_THOIGIANDAOTAO_ID: 'TG2' }], KHTL03: [{ ID: 'KTG2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1' }] };
    var DOT = [
        { ID: 'DT1', THI_DOTTHI_TEN: 'Đợt thi lại 1 - HK2 2025-2026' },
        { ID: 'DT2', THI_DOTTHI_TEN: 'Đợt thi lại 2 - HK2 2025-2026' },
        { ID: 'DT3', THI_DOTTHI_TEN: 'Đợt thi cải thiện hè 2026' }
    ];
    var KH_DOT = { KHTL01: [{ ID: 'KDT1', THI_DOTTHI_ID: 'DT1', THI_DOTTHI_TEN: 'Đợt thi lại 1 - HK2 2025-2026' }] };
    var KH_PV = { KHTL01: [
        { ID: 'KPV1', PHAMVIAPDUNG_ID: 'K67', PHAMVIAPDUNG_TEN: 'Khóa 67' },
        { ID: 'KPV2', PHAMVIAPDUNG_ID: 'CTKTPM', PHAMVIAPDUNG_TEN: 'Kỹ thuật phần mềm' }] };
    var HP = [
        { ID: 'HP1', MA: 'INT1306', TEN: 'Cấu trúc dữ liệu và giải thuật', HOCTRINH: 3, DONVI: 'Bộ môn Khoa học máy tính' },
        { ID: 'HP2', MA: 'INT2211', TEN: 'Cơ sở dữ liệu', HOCTRINH: 3, DONVI: 'Bộ môn Hệ thống thông tin' },
        { ID: 'HP3', MA: 'MAT1093', TEN: 'Đại số tuyến tính', HOCTRINH: 4, DONVI: 'Bộ môn Toán' },
        { ID: 'HP4', MA: 'ECO1001', TEN: 'Kinh tế vi mô', HOCTRINH: 3, DONVI: 'Khoa Kinh tế' },
        { ID: 'HP5', MA: 'PHI1004', TEN: 'Triết học Mác - Lênin', HOCTRINH: 3, DONVI: 'Bộ môn Lý luận chính trị' }
    ];
    function hpDong(h, id) {
        return { ID: id, DAOTAO_HOCPHAN_ID: h.ID, DAOTAO_HOCPHAN_MA: h.MA, DAOTAO_HOCPHAN_TEN: h.TEN, DAOTAO_HOCPHAN_SOTIN: h.HOCTRINH, DAOTAO_HOCPHAN_DONVI: h.DONVI };
    }
    var KH_HP = { KHTL01: [hpDong(HP[0], 'KHP1'), hpDong(HP[1], 'KHP2'), hpDong(HP[2], 'KHP3')] };
    var KH_HPK = { KHTL01: [hpDong(HP[4], 'KHK1')] };

    /* ---------- Kết quả đăng ký ------------------------------------------ */
    var SV = [
        ['NH01', 'BIT220101', 'Nguyễn Văn', 'An', '12/03/2004', 'Nam', 'K67-KTPM1'],
        ['NH02', 'BIT220102', 'Trần Thị', 'Bình', '05/07/2004', 'Nữ', 'K67-KTPM1'],
        ['NH03', 'BBA220561', 'Lê Minh', 'Châu', '21/11/2004', 'Nam', 'K67-QTKD2'],
        ['NH04', 'BIT230210', 'Phạm Thu', 'Dung', '02/01/2005', 'Nữ', 'K68-HTTT1'],
        ['NH05', 'BIT220263', 'Hoàng Đức', 'Mạnh', '17/09/2004', 'Nam', 'K67-KTPM2']
    ];
    var KQ = [];
    SV.forEach(function (s, i) {
        var h = HP[i % 3];
        KQ.push({
            ID: 'KQ' + (i + 1), DANGKY_THI_HOCPHAN_KEHOACH_ID: 'KHTL01', QLSV_NGUOIHOC_ID: s[0], QLSV_NGUOIHOC_MASO: s[1],
            QLSV_NGUOIHOC_HODEM: s[2], QLSV_NGUOIHOC_TEN: s[3], QLSV_NGUOIHOC_NGAYSINH: s[4], GIOITINH_TEN: s[5],
            DAOTAO_LOPQUANLY_TEN: s[6], DAOTAO_CHUONGTRINH_TEN: i === 2 ? 'Quản trị kinh doanh' : 'Kỹ thuật phần mềm',
            DAOTAO_KHOADAOTAO_TEN: i === 3 ? 'Khóa 68' : 'Khóa 67', DAOTAO_KHOAQUANLY_TEN: i === 2 ? 'Khoa Kinh tế' : 'Khoa Công nghệ thông tin',
            DAOTAO_TRUONG_TEN: 'Trường Đại học Công nghệ', DAOTAO_HOCPHAN_ID: h.ID, DAOTAO_HOCPHAN_MA: h.MA, DAOTAO_HOCPHAN_TEN: h.TEN,
            DAOTAO_THOIGIANDAOTAO_ID: 'TG2', THI_DOTTHI_TEN: 'Đợt thi lại 1 - HK2 2025-2026', HOCTRINH: h.HOCTRINH,
            DIEM_THANHPHANDIEM_MA: 'THI', DIEM: [3.5, 2.0, 4.0, 3.0, 1.5][i], DANHGIA_TEN: 'Không đạt', DIEM_DANHSACHHOC_ID: 'DSH' + (i + 1),
            THOIGIAN: 'Học kỳ 2 năm học 2025-2026', NGAYDK_DD_MM_YYYY_HHMMS: '0' + (3 + i) + '/08/2026 09:1' + i + ':25',
            SOTIEN: 250000 * h.HOCTRINH / 3, SOTIENDANOP: i % 2 ? 0 : 250000 * h.HOCTRINH / 3, SOTIENRUT: 0,
            TINHTRANG_TEN: i === 0 ? 'Đã duyệt' : 'Chờ duyệt'
        });
    });

    /* ---------- Cán bộ đăng ký ------------------------------------------- */
    var CBDK = SV.slice(0, 4).map(function (s, i) {
        var h = HP[i % 2];
        return { ID: 'QL' + (i + 1), QLSV_NGUOIHOC_MASO: s[1], QLSV_NGUOIHOC_HODEM: s[2], QLSV_NGUOIHOC_TEN: s[3], DAOTAO_LOPQUANLY_TENLOP: s[6],
            DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_HOCPHAN_TEN: h.TEN, DAOTAO_HOCPHAN_MA: h.MA };
    });

    /* ---------- Nhân sự, phí --------------------------------------------- */
    var ND = [
        { ID: 'ND1', TAIKHOAN: 'hungnv', TENDAYDU: 'Nguyễn Văn Hùng', GIOITINH_TEN: 'Nam', HINHDAIDIEN: '' },
        { ID: 'ND2', TAIKHOAN: 'maitt', TENDAYDU: 'Trần Thị Mai', GIOITINH_TEN: 'Nữ', HINHDAIDIEN: '' },
        { ID: 'ND3', TAIKHOAN: 'minhlq', TENDAYDU: 'Lê Quang Minh', GIOITINH_TEN: 'Nam', HINHDAIDIEN: '' },
        { ID: 'ND4', TAIKHOAN: 'thuydt', TENDAYDU: 'Đỗ Thị Thuỷ', GIOITINH_TEN: 'Nữ', HINHDAIDIEN: '' }
    ];
    var KH_NS = { KHTL01: [
        { ID: 'KNS1', NGUOIDUNG_ID: 'ND2', NGUOIDUNG_TAIKHOAN: 'maitt', NGUOIDUNG_TENDAYDU: 'Trần Thị Mai', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Đào tạo' }] };
    var KT = [
        { ID: 'KT1', MA: 'LPTL', TEN: 'Lệ phí thi lại' },
        { ID: 'KT2', MA: 'LPCT', TEN: 'Lệ phí thi cải thiện' },
        { ID: 'KT3', MA: 'HPHL', TEN: 'Học phí học lại' }
    ];
    var KH_PHI = { KHTL01: [{ ID: 'KPH1', TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_MA: 'LPTL', TAICHINH_CACKHOANTHU_TEN: 'Lệ phí thi lại', SOTIEN: 250000 }] };

    /* ---------- Danh sách nhập điểm -------------------------------------- */
    var DSH = [{ ID: 'DS1', TEN: 'DS thi lại INT1306 - nhóm 1', HP: 'HP1' }, { ID: 'DS2', TEN: 'DS thi lại INT2211 - nhóm 1', HP: 'HP2' }];
    var DSD = KQ.slice(0, 4).map(function (k, i) {
        return { ID: 'DSN' + (i + 1), DIEM_DANHSACHHOC_ID: i < 2 ? 'DS1' : 'DS2', DIEM_DANHSACHHOC_TEN: i < 2 ? DSH[0].TEN : DSH[1].TEN,
            QLSV_NGUOIHOC_MASO: k.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: k.QLSV_NGUOIHOC_HODEM, QLSV_NGUOIHOC_TEN: k.QLSV_NGUOIHOC_TEN,
            QLSV_NGUOIHOC_NGAYSINH: k.QLSV_NGUOIHOC_NGAYSINH, GIOITINH_TEN: k.GIOITINH_TEN, DAOTAO_LOPQUANLY_TEN: k.DAOTAO_LOPQUANLY_TEN,
            DAOTAO_CHUONGTRINH_TEN: k.DAOTAO_CHUONGTRINH_TEN, DAOTAO_KHOADAOTAO_TEN: k.DAOTAO_KHOADAOTAO_TEN,
            DAOTAO_HOCPHAN_ID: i < 2 ? 'HP1' : 'HP2', DAOTAO_HOCPHAN_MA: i < 2 ? HP[0].MA : HP[1].MA, DAOTAO_HOCPHAN_TEN: i < 2 ? HP[0].TEN : HP[1].TEN,
            HOCTRINH: 3, LANHOC: 1, LANTHI: 2, THOIGIAN: 'Học kỳ 2 năm học 2025-2026', DAOTAO_LOPHOCPHAN_GOC_TEN: (i < 2 ? HP[0].MA : HP[1].MA) + '-N0' + (i % 2 + 1),
            DIEM: [6.5, 5.0, 7.0, ''][i], DIEMQUYDOI: [2.5, 1.5, 3.0, ''][i], DIEMCHU: ['C+', 'D+', 'B', ''][i], DANHGIA_TEN: i < 3 ? 'Đạt' : '' };
    });

    /* ---------- Lớp học phần / lớp quản lý sử dụng ----------------------- */
    var KH_LHP = { KHTL01: [{ ID: 'LSD1', DANGKY_KEHOACHDANGKY_TEN: 'Đăng ký học HK2 2025-2026', DAOTAO_HOCPHAN_TEN: HP[0].TEN, DAOTAO_HOCPHAN_MA: HP[0].MA,
        DAOTAO_LOPHOCPHAN_TEN: 'INT1306-N01', KIEUHOC_TEN: 'Học lần đầu', DIEM_THANHPHANDIEM_TEN: 'Điểm thi cuối kỳ' }] };
    var KH_LQL = { KHTL01: [{ ID: 'LQ1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67',
        DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1' }] };

    function kid(o) { return o.strDangKy_Thi_HP_KeHoach_Id; }

    var fx = {};
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.THI.HOCPHAN.MOHINH'] = [MH.DK, MH.CB];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.THI.HOCPHAN.LOAI'] = LOAI;
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHDT.DIEM.KIEUHOC'] = [dm('KH1', 'LD', 'Học lần đầu'), dm('KH2', 'HL', 'Học lại'), dm('KH3', 'CT', 'Học cải thiện')];

    fx[AC + 'LayDSKeHoach'] = function (o) {
        var rows = KH.filter(function (r) { return !o.strMoHinh_Id || r.MOHINHDANGKY_ID === o.strMoHinh_Id; });
        return like(rows, o.strTuKhoa, ['TENKEHOACH', 'PHANLOAI_TEN']);
    };
    fx[AC + 'Them_DangKy_Thi_HP_KeHoach'] = function (o) { var id = moi('KHTL'); KH.push(capNhat({ ID: id }, o)); return { rows: [], raw: { Id: id } }; };
    fx[AC + 'Sua_DangKy_Thi_HP_KeHoach'] = function (o) { KH.forEach(function (r) { if (r.ID === o.strId) capNhat(r, o); }); return { rows: [], raw: { Id: o.strId } }; };
    fx[AC + 'Xoa_DangKy_Thi_HP_KeHoach'] = function (o) { for (var i = KH.length - 1; i >= 0; i--) if (KH[i].ID === o.strId) KH.splice(i, 1); return []; };

    fx['KHCT_ThoiGianDaoTao/LayDanhSach'] = TG;
    fx[AC + 'LayDSDangKy_Thi_HP_KH_ThoiGian'] = function (o) { return cua(KH_TG, kid(o)).slice(); };
    fx[AC + 'Them_DangKy_Thi_HP_KH_ThoiGian'] = function (o) { var id = moi('KTG'); cua(KH_TG, kid(o)).push({ ID: id, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id }); return { rows: [], raw: { Id: id } }; };
    fx[AC + 'Sua_DangKy_Thi_HP_KH_ThoiGian'] = function (o) { cua(KH_TG, kid(o)).forEach(function (r) { if (r.ID === o.strId) r.DAOTAO_THOIGIANDAOTAO_ID = o.strDaoTao_ThoiGianDaoTao_Id; }); return []; };
    fx[AC + 'Xoa_DangKy_Thi_HP_KH_ThoiGian'] = function (o) { xoaKhoi(KH_TG, o.strId); return []; };

    fx[AC + 'LayDSDangKy_Thi_HP_KH_PhamVi'] = function (o) { return cua(KH_PV, kid(o)).slice(); };
    fx[AC + 'Them_DangKy_Thi_HP_KH_PhamVi'] = function (o) {
        cua(KH_PV, kid(o)).push({ ID: moi('KPV'), PHAMVIAPDUNG_ID: o.strPhamViApDung_Id, PHAMVIAPDUNG_TEN: 'Phạm vi ' + o.strPhamViApDung_Id });
        return [];
    };
    fx[AC + 'Xoa_DangKy_Thi_HP_KH_PhamVi'] = function (o) { xoaKhoi(KH_PV, o.strId); return []; };

    fx[PK + 'LayDSDangKy_Thi_HP_KH_DotThi'] = function (o) { return cua(KH_DOT, kid(o)).slice(); };
    fx[PK + 'LayDSDotThi'] = DOT;
    fx[PK + 'Them_DangKy_Thi_HP_KH_DotThi'] = function (o) {
        var d = DOT.filter(function (x) { return x.ID === o.strThi_DotThi_Id; })[0] || {};
        cua(KH_DOT, kid(o)).push({ ID: moi('KDT'), THI_DOTTHI_ID: d.ID, THI_DOTTHI_TEN: d.THI_DOTTHI_TEN });
        return [];
    };
    fx[PK + 'Xoa_DangKy_Thi_HP_KH_DotThi'] = function (o) { xoaKhoi(KH_DOT, o.strId); return []; };

    [['HocPhan', KH_HP], ['KHocPhan', KH_HPK]].forEach(function (x) {
        fx[PK + 'LayDSDangKy_Thi_HP_KH_' + x[0]] = function (o) { return cua(x[1], kid(o)).slice(); };
        fx[PK + 'Them_DangKy_Thi_HP_KH_' + x[0]] = function (o) {
            var h = HP.filter(function (y) { return y.ID === o.strDaoTao_HocPhan_Id; })[0];
            if (h) cua(x[1], kid(o)).push(hpDong(h, moi('KHP')));
            return [];
        };
        fx[PK + 'Xoa_DangKy_Thi_HP_KH_' + x[0]] = function (o) { xoaKhoi(x[1], o.strId); return []; };
    });
    fx['pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan'] = function (o) {
        var rows = like(HP, o.strTuKhoa, ['MA', 'TEN']);
        return { rows: rows, pager: rows.length };
    };

    fx[AC + 'LayDSDK_Nganh_Thi_HP_KetQua_PT'] = function (o) {
        var rows = KQ.filter(function (r) { return r.DANGKY_THI_HOCPHAN_KEHOACH_ID === kid(o); });
        if (String(o.dTinhTrangNopTien) === '1') rows = rows.filter(function (r) { return r.SOTIENDANOP > 0; });
        if (String(o.dTinhTrangNopTien) === '0') rows = rows.filter(function (r) { return !r.SOTIENDANOP; });
        rows = like(rows, o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_TEN', 'DAOTAO_LOPQUANLY_TEN', 'DAOTAO_HOCPHAN_TEN', 'DAOTAO_HOCPHAN_MA']);
        var n = rows.length, s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
        return { rows: rows.slice((p - 1) * s, p * s), pager: n };
    };
    fx[TT + 'ThucHienHuyDangKy'] = function (o) {
        if (o.strDangKy_Thi_HocPhan_KQ_Id) for (var i = KQ.length - 1; i >= 0; i--) if (KQ[i].ID === o.strId) KQ.splice(i, 1);
        return [];
    };
    fx[TT + 'ThucHienDangKy'] = [];
    fx['pkg_taichinh_tinhphi.TinhPhiThiTuDong'] = [];
    fx[AC + 'LayDSTinhTrangTheoNguoiDung'] = [
        { ID: 'XN1', TEN: 'Duyệt', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color:#16a34a' },
        { ID: 'XN2', TEN: 'Không duyệt', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color:#dc2626' },
        { ID: 'XN3', TEN: 'Trả lại', THONGTIN1: 'fa fa-reply', THONGTIN2: '' }
    ];
    fx[TT + 'LayDSDangKy_Thi_XacNhan'] = [{ ID: 'LS1', TEN: 'Chờ duyệt', NGUOIXACNHAN_TENDAYDU: 'Trần Thị Mai', NGAYTAO_DD_MM_YYYY: '05/08/2026' }];
    fx[TT + 'Them_DangKy_Thi_XacNhan'] = [];
    fx['SV_ThongTin/LatKetQuaDiemCaNhanTheoLop'] = {
        rsTP: [
            { DIEM_THANHPHANDIEM_TEN: 'Chuyên cần', LANHOC: 1, LANTHI: 1, DIEM: 8, DANHGIA_TEN: 'Đạt', DIEMQUYDOI_SO: '', DIEMQUYDOI_CHU: '', GHICHU: '' },
            { DIEM_THANHPHANDIEM_TEN: 'Giữa kỳ', LANHOC: 1, LANTHI: 1, DIEM: 5.5, DANHGIA_TEN: 'Đạt', DIEMQUYDOI_SO: '', DIEMQUYDOI_CHU: '', GHICHU: '' },
            { DIEM_THANHPHANDIEM_TEN: 'Thi cuối kỳ', LANHOC: 1, LANTHI: 1, DIEM: 2.5, DANHGIA_TEN: 'Không đạt', DIEMQUYDOI_SO: '', DIEMQUYDOI_CHU: '', GHICHU: 'Dưới điểm liệt' }
        ],
        rsTKHP: [{ DIEM_THANHPHANDIEM_TEN: 'Tổng kết học phần', LANHOC: 1, LANTHI: 1, DIEM: 3.9, DANHGIA_TEN: 'Không đạt', DIEMQUYDOI_SO: 0, DIEMQUYDOI_CHU: 'F', GHICHU: '' }]
    };

    fx[TT + 'LayDSHocPhanDangKyTheoPhamVi'] = function (o) { return String(o.dKhoiTaoDuLieu) === '1' ? CBDK.concat([
        { ID: 'QL9', QLSV_NGUOIHOC_MASO: 'BIT220263', QLSV_NGUOIHOC_HODEM: 'Hoàng Đức', QLSV_NGUOIHOC_TEN: 'Mạnh', DAOTAO_LOPQUANLY_TENLOP: 'K67-KTPM2',
          DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_HOCPHAN_TEN: HP[2].TEN, DAOTAO_HOCPHAN_MA: HP[2].MA }]) : CBDK.slice(); };
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#IMPORTWITHPROC_MTTHUCHIENDANGKY'] = [];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#IMPORTWITHPROC_MTHUYDANGKY'] = [];

    fx[PT + 'LayDSDangKy_Thi_Hp_Kh_NhanSu'] = function (o) { return cua(KH_NS, kid(o)).slice(); };
    fx[PT + 'Them_DangKy_Thi_Hp_Kh_NhanSu'] = function (o) {
        var n = ND.filter(function (x) { return x.ID === o.strNguoiDung_Id; })[0] || {};
        cua(KH_NS, kid(o)).push({ ID: moi('KNS'), NGUOIDUNG_ID: n.ID, NGUOIDUNG_TAIKHOAN: n.TAIKHOAN, NGUOIDUNG_TENDAYDU: n.TENDAYDU, DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin' });
        return [];
    };
    fx[PT + 'Xoa_DangKy_Thi_Hp_Kh_NhanSu'] = function (o) { xoaKhoi(KH_NS, o.strId); return []; };
    fx['pkg_chung_quanlynguoidung.LayDanhSachNguoiDung'] = function (o) {
        var rows = like(ND, o.strTuKhoa, ['TAIKHOAN', 'TENDAYDU']);
        return { rows: rows, pager: rows.length };
    };

    fx['pkg_taichinh_thuchi.LayDSCacKhoanThu'] = KT;
    fx[PT + 'LayDSDangKy_Thi_Hp_Kh_MucPhi'] = function (o) { return cua(KH_PHI, kid(o)).slice(); };
    function phi(r, o) {
        var k = KT.filter(function (x) { return x.ID === o.strTaiChinh_CacKhoanThu_Id; })[0] || {};
        r.TAICHINH_CACKHOANTHU_ID = k.ID; r.TAICHINH_CACKHOANTHU_MA = k.MA; r.TAICHINH_CACKHOANTHU_TEN = k.TEN; r.SOTIEN = o.dSoTien;
        return r;
    }
    fx[PT + 'Them_DangKy_Thi_Hp_Kh_MucPhi'] = function (o) { cua(KH_PHI, kid(o)).push(phi({ ID: moi('KPH') }, o)); return []; };
    fx[PT + 'Sua_DangKy_Thi_Hp_Kh_MucPhi'] = function (o) { cua(KH_PHI, kid(o)).forEach(function (r) { if (r.ID === o.strId) phi(r, o); }); return []; };
    fx[PT + 'Xoa_DangKy_Thi_Hp_Kh_MucPhi'] = function (o) { xoaKhoi(KH_PHI, o.strId); return []; };

    fx[PD + 'LayDSHocPhanTheoKetQuaDangKy'] = [{ ID: 'HP1', TEN: HP[0].TEN + ' (' + HP[0].MA + ')' }, { ID: 'HP2', TEN: HP[1].TEN + ' (' + HP[1].MA + ')' }];
    fx[PD + 'LayDSDanhSachHoc'] = function (o) { return DSH.filter(function (d) { return !o.strDaoTao_HocPhan_Id || d.HP === o.strDaoTao_HocPhan_Id; }); };
    fx[PD + 'LayDSDanhSachHoc_NguoiHoc'] = function (o) {
        return DSD.filter(function (r) {
            return (!o.strDaoTao_HocPhan_Id || r.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id) && (!o.strDiem_DanhSach_Id || r.DIEM_DANHSACHHOC_ID === o.strDiem_DanhSach_Id);
        });
    };
    fx[PD + 'TaoDSNhapDiemTheoKetQuaDangKy'] = [];
    fx[PD + 'TinhLaiDiemThiLai'] = [];
    fx[PD + 'LayDSDaDuyetNhungChuaTaoDSDiem'] = [KQ[4]].map(function (k) {
        return { ID: 'CT1', QLSV_NGUOIHOC_MASO: k.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: k.QLSV_NGUOIHOC_HODEM, QLSV_NGUOIHOC_TEN: k.QLSV_NGUOIHOC_TEN,
            DAOTAO_HOCPHAN_MA: k.DAOTAO_HOCPHAN_MA, DAOTAO_HOCPHAN_TEN: k.DAOTAO_HOCPHAN_TEN, HOCTRINH: k.HOCTRINH, LANHOC: 1, LANTHI: 2 };
    });

    fx['pkg_dangkythi_monthi_chung.LayDSDKTrongPhamViNhungChuaDK'] = SV.slice(1, 4).map(function (s, i) {
        return { ID: 'CD' + i, MASO: s[1], HODEM: s[2], TEN: s[3], CHUONGTRINH: 'Kỹ thuật phần mềm', KHOAHOC: 'Khóa 67', KHOAQUANLY: 'Khoa Công nghệ thông tin',
            TENHOCPHAN: HP[3].TEN, MAHOCPHAN: HP[3].MA, SOTINCHI: 3, LOPDANGKY: 'ECO1001-N0' + (i + 1), DIEM: 3.0 + i * 0.5, DANHGIA_TEN: 'Không đạt',
            DIEMQUYDOI: 0, DIEMCHU: 'F', THOIGIAN: 'Học kỳ 2 năm học 2025-2026' };
    });

    fx[TT + 'LayDSDangKy_Thi_LopHocPhan'] = function (o) { return cua(KH_LHP, kid(o)).slice(); };
    fx[TT + 'Them_DangKy_Thi_LopHocPhan'] = function (o) {
        cua(KH_LHP, kid(o)).push({ ID: moi('LSD'), DANGKY_KEHOACHDANGKY_TEN: 'Đăng ký học HK2 2025-2026', DAOTAO_HOCPHAN_TEN: HP[1].TEN, DAOTAO_HOCPHAN_MA: HP[1].MA,
            DAOTAO_LOPHOCPHAN_TEN: 'INT2211-N01', KIEUHOC_TEN: 'Học lại', DIEM_THANHPHANDIEM_TEN: 'Điểm thi cuối kỳ' });
        return [];
    };
    fx[TT + 'Xoa_DangKy_Thi_LopHocPhan'] = function (o) { xoaKhoi(KH_LHP, o.strId); return []; };
    fx[TT + 'LayDSDangKy_Thi_LopQuanLy'] = function (o) { return cua(KH_LQL, kid(o)).slice(); };
    fx[TT + 'Them_DangKy_Thi_LopQuanLy'] = function (o) {
        cua(KH_LQL, kid(o)).push({ ID: moi('LQ'), DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67',
            DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM2' });
        return [];
    };
    fx[TT + 'Xoa_DangKy_Thi_LopQuanLy'] = function (o) { xoaKhoi(KH_LQL, o.strId); return []; };
    fx['DKH_KeHoachDangKy/LayDanhSach'] = [{ ID: 'KHDK1', TENKEHOACH: 'Đăng ký học HK2 2025-2026' }, { ID: 'KHDK2', TENKEHOACH: 'Đăng ký học hè 2026' }];
    fx['DKH_ThongTin/LayDSHocPhanTheoKeHoach'] = function (o) { return o.strDangKy_KeHoachDangKy_Id ? HP.slice(0, 3) : []; };
    fx['DKH_ThongTin/LayDSLopHocPhanTheoKeHoach'] = function (o) {
        var h = HP.filter(function (x) { return x.ID === o.strDaoTao_HocPhan_Id; })[0];
        return h ? [{ ID: 'LHP1', TENLOP: h.TEN + ' - N01', MALOP: h.MA + '-N01' }, { ID: 'LHP2', TENLOP: h.TEN + ' - N02', MALOP: h.MA + '-N02' }] : [];
    };
    fx['pkg_diem_thongtin.LayDSDiem_ThanhPhanDiem'] = [{ ID: 'TPD1', TEN: 'Điểm chuyên cần' }, { ID: 'TPD2', TEN: 'Điểm giữa kỳ' }, { ID: 'TPD3', TEN: 'Điểm thi cuối kỳ' }];

    ums.demo.add(fx);
})();
