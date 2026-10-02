/* Dữ liệu mẫu chung cho nhóm công cụ ApisCMS/danhmuc (comparetable, exporttable,
   autologdb, upcode, cloudupdate) — chỉ dùng ở chế độ dựng thử.
   Lời gọi GHI (CreatAndAlterTable, deleteBot, UpCode, CloudUpdate, ImportDataTable)
   chỉ trả "thành công", không chạm gì. */
(function () {
    var O = 'CMS_OraDBTableName/', fx = {};

    /* Bảng ở CSDL hiện tại (strDataBaseName rỗng) và ở CSDL nguồn */
    var BANG_GOC = ['QLSV_NGUOIHOC', 'DAOTAO_LOPQUANLY', 'TC_KHOANTHU', 'TC_HOADON', 'CORE_NGUOIDUNG'];
    var BANG_NGUON = [
        ['QLSV_NGUOIHOC', 'USERS'], ['DAOTAO_LOPQUANLY', 'USERS'], ['TC_KHOANTHU', 'TS_TAICHINH'],
        ['TC_HOADON', 'TS_TAICHINH'], ['CORE_NGUOIDUNG', 'USERS'],
        ['TC_HOADON_DIENTU', 'TS_TAICHINH'], ['KTX_PHONG', 'USERS'], ['BIN$Xk2Qw8pV', 'USERS']
    ];
    fx[O + 'LayDanhSach'] = function (o) {
        // exporttable gửi id database → danh sách bảng của CSDL đó; comparetable gửi rỗng → CSDL hiện tại
        var ds = o.strDataBaseName ? BANG_NGUON.map(function (x) { return x[0]; }).filter(function (t) { return t.indexOf('$') < 0; }) : BANG_GOC;
        return ds.map(function (t) { return { TABLE_NAME: t }; });
    };
    fx[O + 'getTableNames_Source'] = function () {
        return BANG_NGUON.map(function (x) { return { OBJECT_NAME: x[0], TABLESPACE_NAME: x[1] }; });
    };

    function cot(ten, kieu, dai, nul) { return { COLUMN_NAME: ten, DATA_TYPE: kieu, DATA_LENGTH: dai, NULLABLE: nul }; }
    var COT_GOC = {
        QLSV_NGUOIHOC: [cot('ID', 'VARCHAR2', 32, 'N'), cot('MASO', 'VARCHAR2', 20, 'N'), cot('HODEM', 'NVARCHAR2', 100, 'Y'), cot('TEN', 'NVARCHAR2', 50, 'Y')],
        DAOTAO_LOPQUANLY: [cot('ID', 'VARCHAR2', 32, 'N'), cot('TEN', 'NVARCHAR2', 200, 'Y')],
        TC_KHOANTHU: [cot('ID', 'VARCHAR2', 32, 'N'), cot('MA', 'VARCHAR2', 50, 'Y'), cot('TEN', 'NVARCHAR2', 200, 'Y')],
        TC_HOADON: [cot('ID', 'VARCHAR2', 32, 'N'), cot('SOHOADON', 'VARCHAR2', 20, 'Y')],
        CORE_NGUOIDUNG: [cot('ID', 'VARCHAR2', 32, 'N'), cot('TAIKHOAN', 'VARCHAR2', 100, 'N')]
    };
    var COT_NGUON = {
        QLSV_NGUOIHOC: [cot('ID', 'VARCHAR2', 32, 'N'), cot('MASO', 'VARCHAR2', 30, 'N'), cot('HODEM', 'NVARCHAR2', 100, 'Y'),
            cot('TEN', 'NVARCHAR2', 50, 'Y'), cot('EMAIL', 'VARCHAR2', 200, 'Y'), cot('SYS_NC00012$', 'NUMBER', 22, 'Y')],
        DAOTAO_LOPQUANLY: [cot('ID', 'VARCHAR2', 32, 'N'), cot('TEN', 'NVARCHAR2', 200, 'Y')],
        TC_KHOANTHU: [cot('ID', 'VARCHAR2', 32, 'N'), cot('MA', 'VARCHAR2', 50, 'N'), cot('TEN', 'NVARCHAR2', 200, 'Y'), cot('VAT', 'NUMBER', 22, 'Y')],
        TC_HOADON: [cot('ID', 'VARCHAR2', 32, 'N'), cot('SOHOADON', 'VARCHAR2', 20, 'Y'), cot('KYHIEU', 'VARCHAR2', 20, 'Y')],
        CORE_NGUOIDUNG: [cot('ID', 'VARCHAR2', 32, 'N'), cot('TAIKHOAN', 'VARCHAR2', 100, 'N')],
        TC_HOADON_DIENTU: [cot('ID', 'VARCHAR2', 32, 'N'), cot('TC_HOADON_ID', 'VARCHAR2', 32, 'N'), cot('MATRACUU', 'VARCHAR2', 50, 'Y')],
        KTX_PHONG: [cot('ID', 'VARCHAR2', 32, 'N'), cot('TENPHONG', 'NVARCHAR2', 100, 'Y'), cot('SUCCHUA', 'NUMBER', 22, 'Y')]
    };
    fx[O + 'getTableProperty'] = function (o) {
        var nguon = o.strConnect ? COT_NGUON : COT_GOC;
        return (nguon[o.strTable_Name] || []).slice();
    };

    var PKG = ['PKG_CORE_QUANTRI_01', 'PKG_TAICHINH_THUCHI', 'PKG_BAOCAO_THONGTIN', 'PKG_CHUNG'];
    fx[O + 'getListPackage'] = PKG.map(function (p) { return { OBJECT_NAME: p }; });

    fx[O + 'getSourceLine'] = function (o) {
        var p = (o.strPackage || 'PKG_MAU').toLowerCase();
        if (o.strType === 'PACKAGE') {
            return [{ TEXT: 'package ' + p + ' is\n' }, { TEXT: '  procedure LayDanhSach(ParamTuKhoa in varchar2, rs out sys_refcursor);\n' }, { TEXT: 'end ' + p + ';\n' }];
        }
        return [
            { TEXT: 'package body ' + p + ' is\n' },
            { TEXT: '  procedure LayDanhSach(ParamTuKhoa in varchar2, strNguoiThucHien_Id in varchar2, rs out sys_refcursor)\n' },
            { TEXT: '  is\n' },
            { TEXT: '  begin\n' },
            { TEXT: '    open rs for select * from core_nguoidung where taikhoan like \'%\' || ParamTuKhoa || \'%\';\n' },
            { TEXT: '  end;\n' },
            { TEXT: '  procedure Them(ParamId in varchar2, strTen in nvarchar2, ParamErr out varchar2)\n' },
            { TEXT: '  is\n' },
            { TEXT: '  begin\n' },
            { TEXT: '    insert into core_nguoidung(id, taikhoan) values (ParamId, strTen);\n' },
            { TEXT: '  end;\n' },
            { TEXT: 'end ' + p + ';\n' }
        ];
    };
    fx[O + 'CreatAndAlterTable'] = { rows: [], message: '' };

    /* Nhật ký gọi hàm (bảng BOT): A package · B procedure · C thời điểm · D tham số · E giá trị */
    var BOT = [
        ['pkg_core_quantri_01', 'LayDSVaiTroNguoiDung', '25/09/2026 08:12:31', 'strNguoiDung_Id', '9F1C2A7E55B04D3C8E61D0A4B7C3E215'],
        ['pkg_core_quantri_01', 'LayDSVaiTroNguoiDung', '25/09/2026 08:12:31', 'strUngDung_Id', ''],
        ['pkg_core_quantri_01', 'LayDSChucNangNguoiDung', '25/09/2026 08:12:34', 'strVaiTro_Id', 'B2042224DB1D4AA6BC11B65EED062359'],
        ['pkg_core_quantri_01', 'LayDSChucNangNguoiDung', '25/09/2026 08:12:34', 'strNguoiDung_Id', '9F1C2A7E55B04D3C8E61D0A4B7C3E215'],
        ['pkg_taichinh_thuchi', 'Them_TaiChinh_CacKhoanThu', '25/09/2026 08:20:05', 'strMa', 'HP_K66'],
        ['pkg_taichinh_thuchi', 'Them_TaiChinh_CacKhoanThu', '25/09/2026 08:20:05', 'strTen', 'Học phí K66'],
        ['pkg_taichinh_thuchi', 'Them_TaiChinh_CacKhoanThu', '25/09/2026 08:20:05', 'dVAT', '0']
    ];
    fx[O + 'getListBot'] = BOT.map(function (b) { return { A: b[0], B: b[1], C: b[2], D: b[3], E: b[4] }; });
    fx[O + 'deleteBot'] = { rows: [], message: '' };

    /* Upcode / Cloud update / Import dữ liệu bảng */
    fx['CMS_UpCode/UpCode'] = { rows: [], message: 'ApisCMS.zip — 128 tệp đã cập nhật' };
    fx['CMS_UpCode/CloudUpdate'] = { rows: [], message: '' };
    fx['SYS_Import/ImportDataTable'] = { rows: [], message: '3 bảng, 1.245 dòng' };

    /* Danh mục của cloudupdate */
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    fx[DM + 'CMS.UCSV'] = [
        { ID: 'SV1', MA: 'HIENTAI', TEN: 'Máy chủ hiện tại' },
        { ID: 'SV2', MA: 'https://ums-demo.truong.edu.vn', TEN: 'Máy chủ thử nghiệm' }
    ];
    fx[DM + 'CMS.DUSER'] = [
        { ID: 'DU1', MA: 'dev01', TEN: 'Dropbox — dev01' },
        { ID: 'DU2', MA: 'dev02', TEN: 'Dropbox — dev02' }
    ];
    fx[DM + 'CMS.UCPR'] = [
        { ID: 'P1', MA: 'P1', TEN: 'ApisCMS' },
        { ID: 'P2', MA: 'P2', TEN: 'ApisTaiChinh' },
        { ID: 'P3', MA: 'P3', TEN: 'ApisCongCanBo' },
        { ID: 'P4', MA: 'P4', TEN: 'ApisCongSinhVien' }
    ];

    ums.demo.add(fx);
})();
