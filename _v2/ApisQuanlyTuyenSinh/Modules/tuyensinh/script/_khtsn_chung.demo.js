/* Dữ liệu mẫu cho Kế hoạch tuyển sinh (new) — ums.khtsn — chỉ dùng ở chế độ dựng thử.
   Nạp SAU _khts.demo.js (Nhập học) nên khai lại danh sách kế hoạch / đợt với đủ cột của màn này. */
(function () {
    'use strict';
    var seq = 500;
    function moi() { return 'KTSN' + (++seq); }
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var DMK = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';

    var KH = [
        { ID: 'KHTS2026', MA: 'TS2026', TEN: 'Kế hoạch tuyển sinh đại học chính quy 2026', LOAI_TUYENSINH_ID: 'LTS1', LOAI_TUYENSINH_TEN: 'Đại học chính quy',
          TS_PHUONGAN_TUYENSINH_ID: 'PA1', TS_PHUONGAN_TUYENSINH_TEN: 'Phương án tuyển sinh 2026', NAM_TUYENSINH: 2026, NAM_HOC: '2026-2027', HOC_KY: 1,
          PLAN_STATUS_CODE: 'DANGMO', PLAN_STATUS_TEN: 'Đang mở', IS_ACTIVE: 1, IS_PUBLIC: 1, ALLOW_IMPORT: 1, ALLOW_DIRECT_INPUT: 1, ALLOW_API: 1,
          SO_DA_DANGKY: 1240, SO_DA_NOP_HOSO: 980, SO_DA_TIEPNHAN: 950, SO_DA_TRUNGTUYEN: 720, SO_DA_NHAPHOC: 610, NGUOITAO_TEN: 'hanhnt', NGAYTAO: '02/03/2026' },
        { ID: 'KHTS2026LT', MA: 'TSLT2026', TEN: 'Kế hoạch tuyển sinh liên thông 2026', LOAI_TUYENSINH_ID: 'LTS2', LOAI_TUYENSINH_TEN: 'Liên thông',
          TS_PHUONGAN_TUYENSINH_ID: 'PA1', TS_PHUONGAN_TUYENSINH_TEN: 'Phương án tuyển sinh 2026', NAM_TUYENSINH: 2026, NAM_HOC: '2026-2027', HOC_KY: 1,
          PLAN_STATUS_CODE: 'NHAP', PLAN_STATUS_TEN: 'Bản nháp', IS_ACTIVE: 1, SO_DA_DANGKY: 85, SO_DA_NOP_HOSO: 60, SO_DA_TIEPNHAN: 58, SO_DA_TRUNGTUYEN: 40,
          SO_DA_NHAPHOC: 0, NGUOITAO_TEN: 'hanhnt', NGAYTAO: '15/04/2026' },
        { ID: 'KHTS2025', MA: 'TS2025', TEN: 'Kế hoạch tuyển sinh đại học chính quy 2025', LOAI_TUYENSINH_ID: 'LTS1', LOAI_TUYENSINH_TEN: 'Đại học chính quy',
          NAM_TUYENSINH: 2025, NAM_HOC: '2025-2026', HOC_KY: 1, PLAN_STATUS_CODE: 'DADONG', PLAN_STATUS_TEN: 'Đã đóng', IS_ACTIVE: 0, NGUOITAO_TEN: 'admin', NGAYTAO: '01/03/2025' }
    ];
    var DOT = [
        { ID: 'DOT1', TS_KEHOACH_TUYENSINH_ID: 'KHTS2026', MA: 'D1', TEN: 'Đợt 1 — xét tuyển kết quả thi THPT', DOT_TYPE_CODE: 'CHINH', DOT_TYPE_CODE_Ten: 'Đợt chính',
          DOT_STATUS_CODE: 'DANGMO', DOT_STATUS_CODE_Ten: 'Đang mở', NGAY_BATDAU_DANGKY: '01/07/2026', NGAY_KETTHUC_DANGKY: '30/07/2026', IS_ACTIVE: 1, IS_PUBLIC: 1,
          SO_DA_DANGKY: 900, SO_DA_NOP_HOSO: 720, SO_DA_TIEPNHAN: 700, SO_DA_TRUNGTUYEN: 520, SO_DA_NHAPHOC: 450, NGUOITAO_TaiKhoan: 'hanhnt', NgayTao_dd_mm_yyyy_hhmmss: '02/03/2026 08:10:00' },
        { ID: 'DOT2', TS_KEHOACH_TUYENSINH_ID: 'KHTS2026', MA: 'D2', TEN: 'Đợt 2 — xét tuyển bổ sung', DOT_TYPE_CODE: 'BOSUNG', DOT_TYPE_CODE_Ten: 'Đợt bổ sung',
          DOT_STATUS_CODE: 'NHAP', DOT_STATUS_CODE_Ten: 'Chưa mở', NGAY_BATDAU_DANGKY: '15/08/2026', NGAY_KETTHUC_DANGKY: '15/09/2026', IS_ACTIVE: 1,
          SO_DA_DANGKY: 0, NGUOITAO_TaiKhoan: 'hanhnt', NgayTao_dd_mm_yyyy_hhmmss: '02/03/2026 08:12:40' },
        { ID: 'DOT3', TS_KEHOACH_TUYENSINH_ID: 'KHTS2026LT', MA: 'LT1', TEN: 'Đợt 1 liên thông', IS_ACTIVE: 1 },
        { ID: 'DOT4', TS_KEHOACH_TUYENSINH_ID: 'KHTS2025', MA: 'D1', TEN: 'Đợt 1 năm 2025', IS_ACTIVE: 0 }
    ];
    var DAURA = [
        { ID: 'DR1', TS_KEHOACH_TUYENSINH_ID: 'KHTS2026', TS_KEHOACH_TUYENSINH_TEN: KH[0].TEN, TS_KEHOACH_TUYENSINH_DOT_ID: 'DOT1', TS_KEHOACH_TUYENSINH_DOT_TEN: DOT[0].TEN,
          DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'K66', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin',
          DAOTAO_NGANH_TS_ID: 'NN1', DAOTAO_NGANH_TS_TEN: 'Công nghệ thông tin', MA_HIENTHI: '7480201', TEN_HIENTHI: 'Công nghệ thông tin (K66)', CHI_TIEU: 120, THU_TU_HIENTHI: 1, IS_ACTIVE: 1 },
        { ID: 'DR2', TS_KEHOACH_TUYENSINH_ID: 'KHTS2026', TS_KEHOACH_TUYENSINH_TEN: KH[0].TEN, TS_KEHOACH_TUYENSINH_DOT_ID: 'DOT1', TS_KEHOACH_TUYENSINH_DOT_TEN: DOT[0].TEN,
          DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'K66', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT2', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kế toán',
          DAOTAO_NGANH_TS_ID: 'NN2', DAOTAO_NGANH_TS_TEN: 'Kế toán', MA_HIENTHI: '7340301', TEN_HIENTHI: 'Kế toán (K66)', CHI_TIEU: 80, THU_TU_HIENTHI: 2, IS_ACTIVE: 1 }
    ];
    var HOSO = [
        { HOSO_ID: 'HS1', COREPERSON_ID: 'P1', COREPERSON_HOTEN: 'Nguyễn Văn An', COREPERSON_NGAYSINH: '12/05/2008', COREPERSON_GIOITINH_ID: 'GT1',
          PERSONIDEN_SOCCCD: '001208012345', PERSONCONTACT_DIENTHOAI: '0912345678', PERSONCONTACT_EMAIL: 'an.nv@example.com', HOSO_MAHOSO: 'HS2026-0001',
          HOSO_SOBAODANH: '01001234', NGUYENVONG_DAURA_ID: 'DR1', HOSO_KH_TS_DOT_ID: 'DOT1', HOSO_KETQUA: 'TRUNGTUYEN', XETTUYEN_TOHOPMON_CODE: 'A00', XETTUYEN_DIEMTONGXT: 25.5,
          CORE_PERSON_INTAKE_ID: 'IN1', INTAKE_ISSTUDYCREATED: 0,
          /* pull 29/9: cột nhóm "Hồ sơ & kế hoạch" */
          HOSO_STATUS: 'DA_TIEPNHAN', HOSO_NGAYNOP: '10/06/2026', HOSO_NGAYKETQUA: '20/08/2026', INTAKE_NGAYTIEPNHAN: '05/09/2026' },
        { HOSO_ID: 'HS2', COREPERSON_ID: 'P2', COREPERSON_HOTEN: 'Trần Thị Bình', COREPERSON_NGAYSINH: '03/09/2008', COREPERSON_GIOITINH_ID: 'GT2',
          PERSONIDEN_SOCCCD: '036308054321', PERSONCONTACT_DIENTHOAI: '0987654321', HOSO_MAHOSO: 'HS2026-0002', HOSO_SOBAODANH: '01005678',
          NGUYENVONG_DAURA_ID: 'DR2', HOSO_KH_TS_DOT_ID: 'DOT1', HOSO_KETQUA: 'CHOXETTUYEN', XETTUYEN_TOHOPMON_CODE: 'D01', XETTUYEN_DIEMTONGXT: 22.75,
          CORE_PERSON_INTAKE_ID: 'IN2', INTAKE_ISSTUDYCREATED: 0, HOSO_STATUS: 'DA_NOPHOSO', HOSO_NGAYNOP: '12/06/2026' }
    ];
    var PC = [{ ID: 'PC1', FULL_NAME: 'Nguyễn Thị Hạnh', current_employee_code: 'CB0012', ts_kehoach_tuyensinh_ten: KH[0].TEN, role_code: 'TUVAN', role_code_Name: 'Tư vấn tuyển sinh',
        ngay_batdau: '01/03/2026', ngay_ketthuc: '30/09/2026', is_allowed: 1, is_active: 1, NGUOITAO_TaiKhoan: 'admin', NgayTao_dd_mm_yyyy_hhmmss: '02/03/2026 09:00:00', person_id: 'NS1' }];
    var QD = [{ ID: 'QD1', TS_KEHOACHTUYENSINH_ID: 'DOT1', LOAIHOSO_ID: 'LHS1', LOAIHOSO_TEN: 'Bản sao CCCD', SOLUONG: 2, TINHCHATHOSO_ID: 'TC1', TINHCHATHOSO_TEN: 'Bắt buộc', THUTU: 1 },
        { ID: 'QD2', TS_KEHOACHTUYENSINH_ID: 'DOT1', LOAIHOSO_ID: 'LHS2', LOAIHOSO_TEN: 'Học bạ THPT (bản sao)', SOLUONG: 1, TINHCHATHOSO_ID: 'TC1', TINHCHATHOSO_TEN: 'Bắt buộc', THUTU: 2 }];

    function loc(rows, key, v) { return v ? rows.filter(function (r) { return String(r[key]) === String(v); }) : rows.slice(); }
    function ok(extra) { return { rows: [], raw: extra || {} }; }
    var P = 'PKG_CORE_TS_KEHOACH.', H = 'PKG_CORE_TS_HOSO.';
    var fx = {};
    fx[P + 'Pr_Ts_KH_TuyenSinh_Get_List'] = function (o) {
        var kw = String(o.strTuKhoa || '').toLowerCase();
        return KH.filter(function (r) {
            return (o.dIs_Active === '' || o.dIs_Active === undefined || String(r.IS_ACTIVE) === String(o.dIs_Active)) &&
                (!kw || (r.MA + ' ' + r.TEN).toLowerCase().indexOf(kw) >= 0) &&
                (!o.strLoai_TuyenSinh_Id || r.LOAI_TUYENSINH_ID === o.strLoai_TuyenSinh_Id) &&
                (!o.strPlan_Status_Code || r.PLAN_STATUS_CODE === o.strPlan_Status_Code);
        });
    };
    fx[P + 'Pr_Ts_KH_TuyenSinh_Get_By_Id'] = function (o) { return loc(KH, 'ID', o.strId); };
    fx[P + 'Pr_Ts_KeHoach_TuyenSinh_Create'] = function (o) { KH.push({ ID: moi(), MA: o.strMa || o.strKeHoach_Ma || '', TEN: o.strTen || o.strKeHoach_Ten || '', IS_ACTIVE: 1 }); return ok(); };
    fx[P + 'Pr_Ts_KeHoach_TuyenSinh_Update'] = ok();
    fx[P + 'Pr_Ts_KeHoach_TuyenSinh_Delete'] = ok();
    fx[P + 'Pr_Ts_Loai_TuyenSinh_Get_Ds'] = [dm('LTS1', 'DHCQ', 'Đại học chính quy'), dm('LTS2', 'LT', 'Liên thông'), dm('LTS3', 'VB2', 'Văn bằng 2')];
    fx[P + 'Pr_Ts_PA_TuyenSinh_Get_Ds'] = [dm('PA1', 'PA2026', 'Phương án tuyển sinh 2026')];
    fx[P + 'Pr_Ts_Kh_Ts_Dot_Get_Ds'] = function (o) { return loc(DOT, 'TS_KEHOACH_TUYENSINH_ID', o.strTs_KeHoach_TuyenSinh_Id || o.strTs_Kh_TuyenSinh_Id); };
    fx[P + 'Pr_Ts_Kh_Ts_Dot_Get_By_Id'] = function (o) { return loc(DOT, 'ID', o.strId); };
    ['Pr_Ts_Kh_Ts_Dot_Ins', 'Pr_Ts_Kh_Ts_Dot_Upd', 'Pr_Ts_Kh_Ts_Dot_Del', 'Pr_Ts_Kh_Dau_Ra_Ins', 'Pr_Ts_Kh_Dau_Ra_Upd', 'Pr_Ts_Kh_Dau_Ra_Del',
        'Pr_Ts_Kh_Ns_PhanCong_Ins', 'Pr_Ts_Kh_Ns_PhanCong_Upd', 'Pr_Ts_Kh_Ns_PhanCong_Del'].forEach(function (k) { fx[P + k] = ok(); });
    fx[P + 'Pr_Ts_Kh_Dau_Ra_Get_Ds'] = function (o) {
        return DAURA.filter(function (r) { return (!o.strTs_Kh_TuyenSinh_Id || r.TS_KEHOACH_TUYENSINH_ID === o.strTs_Kh_TuyenSinh_Id) &&
            (!o.strTs_Kh_TuyenSinh_Dot_Id || r.TS_KEHOACH_TUYENSINH_DOT_ID === o.strTs_Kh_TuyenSinh_Dot_Id); });
    };
    fx[P + 'Pr_Ts_Kh_Dau_Ra_Get_By_Id'] = function (o) { return loc(DAURA, 'ID', o.strId); };
    fx[P + 'Pr_Ts_Kh_Ns_PhanCong_Get_Ds'] = function () { return PC.slice(); };
    fx[P + 'Pr_Ts_Kh_Ns_PhanCong_Get_By_Id'] = function (o) { return loc(PC, 'ID', o.strId); };
    fx[P + 'LayDS_PhuongThucTuyenSinh'] = [dm('PT1', 'THPT', 'Xét điểm thi tốt nghiệp THPT'), dm('PT2', 'HOCBA', 'Xét học bạ')];
    fx[P + 'LayDS_LopQuanLy_TheoDauRa'] = function (o) { return o.strDauRa_Id === 'DR1' ? [dm('LQL1', 'K66-CNTT1', 'Công nghệ thông tin 1 — K66')] : [dm('LQL2', 'K66-KT1', 'Kế toán 1 — K66')]; };
    fx['pkg_tuyensinh_kehoach.LayDSTS_QuyDinhHoSo'] = function (o) { return loc(QD, 'TS_KEHOACHTUYENSINH_ID', o.strTS_KeHoachTuyenSinh_Id); };
    ['Them_TS_QuyDinhHoSo', 'Sua_TS_QuyDinhHoSo', 'Xoa_TS_QuyDinhHoSo'].forEach(function (k) { fx['pkg_tuyensinh_kehoach.' + k] = ok(); });
    fx[H + 'LayDS_HoSo_TS'] = function (o) {
        var kw = String(o.strTuKhoa || '');
        return HOSO.filter(function (r) { return (!kw || r.COREPERSON_HOTEN.indexOf(kw) >= 0 || r.PERSONIDEN_SOCCCD.indexOf(kw) >= 0) &&
            (!o.strHoSo_KH_TS_Dot_Id || r.HOSO_KH_TS_DOT_ID === o.strHoSo_KH_TS_Dot_Id); });
    };
    fx[H + 'LayDS_HoSo_TS_FULL'] = fx[H + 'LayDS_HoSo_TS'];
    fx[H + 'LayTT_HoSo_TS'] = function (o) { return loc(HOSO, 'HOSO_ID', o.strHoSo_Id); };
    fx[H + 'Them_HoSo_TS'] = function (o) {
        HOSO.push({ HOSO_ID: moi(), COREPERSON_ID: moi(), COREPERSON_HOTEN: o.strCorePerson_HoTen, COREPERSON_NGAYSINH: o.strCorePerson_NgaySinh,
            COREPERSON_GIOITINH_ID: o.strCorePerson_GioiTinh_Id, PERSONIDEN_SOCCCD: o.strPersonIden_SoCCCD, NGUYENVONG_DAURA_ID: o.strNguyenVong_DauRa_Id,
            HOSO_KH_TS_DOT_ID: o.strHoSo_KH_TS_Dot_Id });
        return ok();
    };
    ['Sua_HoSo_TS', 'Xoa_HoSo_TS', 'XacNhanChonChuongTrinhHoc'].forEach(function (k) { fx[H + k] = ok(); });
    fx['PKG_CORE_TS_HOSO_IMPORT.Them_HoSo_TS'] = ok();
    fx['pkg_tuyensinh_hoso.LayDSTS_HoSo'] = function (o) { return o.strTS_HoSoDuTuyen_Id === 'HS1' ? [{ ID: 'TSHS1', LOAIHOSO_ID: 'LHS1', SOLUONG: 2, MOTA: '' }] : []; };
    ['Them_TS_HoSo', 'Sua_TS_HoSo', 'Xoa_TS_HoSo'].forEach(function (k) { fx['pkg_tuyensinh_hoso.' + k] = ok(); });
    fx['pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao'] = [dm('CS1', 'HN', 'Cơ sở Hà Nội'), dm('CS2', 'HCM', 'Cơ sở Hồ Chí Minh')];
    fx['PKG_CORE_NhapHoc_ThuTien.PhanLop_TuDong'] = ok();
    fx['CM_UngDung/CustomAPIGet'] = function () {
        return { rows: JSON.stringify({ data: [
            { mssv: 'CMC26001', hoten: 'Lê Minh Châu', dob: '2008-02-14', gt: 'Nữ', cccd: '001308011111', sdt: '0901111222', manganh: '7480201', tennganh: 'Công nghệ thông tin' },
            { mssv: 'CMC26002', hoten: 'Phạm Quốc Dũng', dob: '2008-11-30', gt: 'Nam', cccd: '001208022222', sdt: '0903333444', manganh: '7340301', tennganh: 'Kế toán' }
        ] }) };
    };
    fx['KHCT_HeDaoTao/LayDanhSach'] = [{ ID: 'HE1', TENHEDAOTAO: 'Đại học chính quy' }];
    fx['KHCT_KhoaDaoTao/LayDanhSach'] = [{ ID: 'KH66', TENKHOA: 'K66' }];
    fx['KHCT_ToChucChuongTrinh/LayDanhSach'] = [{ ID: 'CT1', MACHUONGTRINH: '7480201', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'CT2', MACHUONGTRINH: '7340301', TENCHUONGTRINH: 'Kế toán' }];

    var DMS = {
        'TS.KEHOACH.TINHTRANG': [dm('TT1', 'NHAP', 'Bản nháp'), dm('TT2', 'DANGMO', 'Đang mở'), dm('TT3', 'DADONG', 'Đã đóng')],
        'TS.KEHOACH.DOT.KIEUDOT': [dm('KD1', 'CHINH', 'Đợt chính'), dm('KD2', 'BOSUNG', 'Đợt bổ sung')],
        'TS.KEHOACH.DOT.TINHTRANG': [dm('DT1', 'NHAP', 'Chưa mở'), dm('DT2', 'DANGMO', 'Đang mở'), dm('DT3', 'DADONG', 'Đã đóng')],
        'TS.KEHOACH.NHANSU.VAITRO': [dm('VT1', 'TUVAN', 'Tư vấn tuyển sinh'), dm('VT2', 'TIEPNHAN', 'Tiếp nhận hồ sơ')],
        'TS.KEHOACH.DAURA.LOAI': [dm('LD1', 'NGANH', 'Theo ngành')], 'TS.KEHOACH.DAURA.KIEUHOC': [dm('KH1', 'CHINHQUY', 'Chính quy')],
        'TS.KEHOACH.DAURA.TRANGTHAI': [dm('TD1', 'MO', 'Đang mở')],
        'TUYENSINH.LOAIHOSO': [dm('LHS1', 'CCCD', 'Bản sao CCCD'), dm('LHS2', 'HOCBA', 'Học bạ THPT (bản sao)')],
        'TUYENSINH.TINHCHATHOSO': [dm('TC1', 'BB', 'Bắt buộc'), dm('TC2', 'KBB', 'Không bắt buộc')],
        'TUYENSINH.NGANHNGHE': [dm('NN1', '7480201', 'Công nghệ thông tin'), dm('NN2', '7340301', 'Kế toán')],
        'NS.GITI': [dm('GT1', 'NAM', 'Nam'), dm('GT2', 'NU', 'Nữ')],
        'TS.DOITUONGDUTUYEN': [dm('DTT1', 'THPT', 'Học sinh tốt nghiệp THPT')], 'TS.DOITUONGHOADON': [dm('HD1', 'CN', 'Cá nhân'), dm('HD2', 'TC', 'Tổ chức')],
        'TUYENSINH.TRUONGHOC': [dm('TR1', '01001', 'THPT Chu Văn An')], 'TUYENSINH.HOCLUC': [dm('HL1', 'GIOI', 'Giỏi'), dm('HL2', 'KHA', 'Khá')],
        'TUYENSINH.HANHKIEM': [dm('HK1', 'TOT', 'Tốt'), dm('HK2', 'KHA', 'Khá')]
    };
    Object.keys(DMS).forEach(function (k) { if (!ums.demo.fixtures.hasOwnProperty(DMK + k)) fx[DMK + k] = DMS[k]; });
    ums.demo.add(fx);
})();
