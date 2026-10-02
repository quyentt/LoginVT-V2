/* Dữ liệu mẫu cho kehoachtuyensinhnew (Kế hoạch nhập học new) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var P = 'PKG_CORE_NHAPHOC.';
    function dm(ma, ten) { return { ID: 'DM_' + ma, MA: ma, TEN: ten }; }

    var KHNH = [
        { ID: 'KHNH1', MA: 'NH2026-D1', TEN: 'Nhập học đại học chính quy 2026 — đợt 1', NGAY_BATDAU: '20260815', NGAY_KETTHUC: '20260830',
          TS_KEHOACH_TUYENSINH_ID: 'KHTS2026', TS_KEHOACH_TUYENSINH_DOT_ID: 'DOT1', NHAPHOC_TYPE_CODE: 'CHINHQUY', STATUS_CODE: 'DANG_MO',
          OWNER_ORG_ID: 'DV1', MANAGE_ORG_ID: 'DV2', RECEIVE_ORG_ID: 'DV2', REQUIRE_XACNHAN: 1, REQUIRE_HOSO: 1, REQUIRE_TAICHINH: 1,
          REQUIRE_PHANLOP: 0, REQUIRE_TAIKHOAN: 1, IS_AUTO_STUDY: 1, IS_AUTO_CLASS_ASSIGN: 0, IS_AUTO_ACCOUNT_CREATE: 1, IS_AUTO_COMPLETE: 0,
          IS_ACTIVE: 1, GHICHU: 'Tiếp nhận tại hội trường A', NGAYTAO: '20260706102656', NGUOITAO_TEN: 'Nguyễn Thị Hạnh' },
        { ID: 'KHNH2', MA: 'NH2026-D2', TEN: 'Nhập học bổ sung 2026 — đợt 2', NGAY_BATDAU: '20260910', NGAY_KETTHUC: '20260920',
          TS_KEHOACH_TUYENSINH_ID: 'KHTS2026', TS_KEHOACH_TUYENSINH_DOT_ID: 'DOT2', NHAPHOC_TYPE_CODE: 'CHINHQUY', STATUS_CODE: 'DRAFT',
          OWNER_ORG_ID: 'DV1', MANAGE_ORG_ID: 'DV2', RECEIVE_ORG_ID: 'DV4', REQUIRE_XACNHAN: 1, REQUIRE_HOSO: 1, REQUIRE_TAICHINH: 1,
          REQUIRE_PHANLOP: 0, REQUIRE_TAIKHOAN: 0, IS_AUTO_STUDY: 0, IS_AUTO_CLASS_ASSIGN: 0, IS_AUTO_ACCOUNT_CREATE: 0, IS_AUTO_COMPLETE: 0,
          IS_ACTIVE: 1, GHICHU: '', NGAYTAO: '20260801083011', NGUOITAO_TEN: 'Trần Văn Nam' },
        { ID: 'KHNH3', MA: 'NHLT2026', TEN: 'Nhập học liên thông 2026', NGAY_BATDAU: '20261001', NGAY_KETTHUC: '20261015',
          TS_KEHOACH_TUYENSINH_ID: 'KHTS2026LT', TS_KEHOACH_TUYENSINH_DOT_ID: 'DOT3', NHAPHOC_TYPE_CODE: 'LIENTHONG', STATUS_CODE: 'CHO_DUYET',
          OWNER_ORG_ID: 'DV1', MANAGE_ORG_ID: 'DV1', RECEIVE_ORG_ID: 'DV2', REQUIRE_XACNHAN: 0, REQUIRE_HOSO: 1, REQUIRE_TAICHINH: 1,
          REQUIRE_PHANLOP: 1, REQUIRE_TAIKHOAN: 0, IS_AUTO_STUDY: 0, IS_AUTO_CLASS_ASSIGN: 1, IS_AUTO_ACCOUNT_CREATE: 0, IS_AUTO_COMPLETE: 0,
          IS_ACTIVE: 1, GHICHU: '', NGAYTAO: '20260812141500', NGUOITAO_TEN: 'Nguyễn Thị Hạnh' }
    ];
    var seq = 10;
    function tim(id) { return KHNH.filter(function (r) { return r.ID === id; })[0]; }
    function gan(r, o) {
        r.MA = o.strMa_KeHoach; r.TEN = o.strTen_KeHoach; r.NGAY_BATDAU = o.strNgay_BatDau; r.NGAY_KETTHUC = o.strNgay_KetThuc;
        r.TS_KEHOACH_TUYENSINH_ID = o.strTS_KeHoach_TuyenSinh_Id; r.TS_KEHOACH_TUYENSINH_DOT_ID = o.strTS_KeHoach_TS_Dot_Id;
        r.NHAPHOC_TYPE_CODE = o.strNhapHoc_Type_Code; r.STATUS_CODE = o.strStatus_Code;
        r.OWNER_ORG_ID = o.strOwner_Org_Id; r.MANAGE_ORG_ID = o.strManage_Org_Id; r.RECEIVE_ORG_ID = o.strReceive_Org_Id;
        r.REQUIRE_XACNHAN = o.dRequire_XacNhan; r.REQUIRE_HOSO = o.dRequire_HoSo; r.REQUIRE_TAICHINH = o.dRequire_TaiChinh;
        r.REQUIRE_PHANLOP = o.dRequire_PhanLop; r.REQUIRE_TAIKHOAN = o.dRequire_TaiKhoan;
        r.IS_AUTO_STUDY = o.dIs_Auto_Study; r.IS_AUTO_CLASS_ASSIGN = o.dIs_Auto_Class_Assign;
        r.IS_AUTO_ACCOUNT_CREATE = o.dIs_Auto_Account_Create; r.IS_AUTO_COMPLETE = o.dIs_Auto_Complete;
        r.IS_ACTIVE = Number(o.dIs_Active); r.GHICHU = o.strGhiChu;
        return r;
    }

    var DAURA = {
        KHNH1: [
            { ID: 'DR1', MA_DAU_RA: 'DR-CNTT', TEN_DAU_RA: 'Công nghệ thông tin K68', HEDAOTAO_TEN: 'Đại học chính quy', KHOADAOTAO_TEN: 'Khóa 68',
              CHUONGTRINH_TEN: 'Công nghệ thông tin', CHUONGTRINH_MA: '7480201', NGANH_DT_TEN: 'Công nghệ thông tin', NGANH_DT_MA: '7480201',
              NGANH_TS_TEN: 'Công nghệ thông tin', NGANH_TS_MA: '7480201', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', CHI_TIEU_NHAPHOC: 240,
              SO_DA_GAN: 231, SO_DA_XACNHAN: 198, SO_DA_TAO_STUDY: 150, REQUIRE_XACNHAN_COSO: 1, DAURA_STATUS_TEN: 'Đang mở', IS_ACTIVE: 1,
              NGAYTAO: '20260707090000', NGUOITAO_TEN: 'Nguyễn Thị Hạnh' },
            { ID: 'DR2', MA_DAU_RA: 'DR-QTKD', TEN_DAU_RA: 'Quản trị kinh doanh K68', HEDAOTAO_TEN: 'Đại học chính quy', KHOADAOTAO_TEN: 'Khóa 68',
              CHUONGTRINH_TEN: 'Quản trị kinh doanh', CHUONGTRINH_MA: '7340101', NGANH_DT_TEN: 'Quản trị kinh doanh', NGANH_DT_MA: '7340101',
              NGANH_TS_TEN: 'Quản trị kinh doanh', NGANH_TS_MA: '7340101', KHOAQUANLY_TEN: 'Khoa Kinh tế', CHI_TIEU_NHAPHOC: 180,
              SO_DA_GAN: 176, SO_DA_XACNHAN: 160, SO_DA_TAO_STUDY: 120, REQUIRE_XACNHAN_COSO: 0, DAURA_STATUS_TEN: 'Đang mở', IS_ACTIVE: 1,
              NGAYTAO: '20260707090000', NGUOITAO_TEN: 'Nguyễn Thị Hạnh' }
        ]
    };
    var NS = {
        KHNH1: [
            { ID: 'PC1', CORE_PERSON_ID: 'NS1', PERSON_HOTEN: 'Nguyễn Văn Hùng', PERSON_MA: 'CB001', DONVI_ID: 'DV1', DONVI_TEN: 'Ban Giám hiệu',
              NH_KEHOACH_NHAPHOC_TEN: 'Nhập học đại học chính quy 2026 — đợt 1', VAITRO_NHAPHOC_CODE: 'CHU_TICH', VAITRO_TEN: 'Chủ tịch hội đồng',
              NGAY_BATDAU: '20260815', NGAY_KETTHUC: '20260830', IS_PRIMARY: 1, IS_MANAGER: 1, IS_APPROVER: 1, PHANCONG_STATUS_CODE: 'DANG_LAM',
              PHANCONG_STATUS_TEN: 'Đang làm', IS_ACTIVE: 1, SOURCE_TYPE_CODE: 'MANUAL', NGUOITAO_TAIKHOAN: 'hanhnt', NGAYTAO: '20260710080000', GHICHU: '' },
            /* Bản ghi máy chủ trả THIẾU tên (lỗi JOIN của procedure) — màn tự bù từ hồ sơ nhân sự */
            { ID: 'PC2', CORE_PERSON_ID: 'NS2', PERSON_HOTEN: '', PERSON_MA: '', DONVI_ID: 'DV2', DONVI_TEN: '',
              NH_KEHOACH_NHAPHOC_TEN: 'Nhập học đại học chính quy 2026 — đợt 1', VAITRO_NHAPHOC_CODE: 'CAN_BO_TN', VAITRO_TEN: 'Cán bộ tiếp nhận',
              NGAY_BATDAU: '20260815', NGAY_KETTHUC: '20260830', IS_PRIMARY: 0, IS_MANAGER: 0, IS_APPROVER: 0, PHANCONG_STATUS_CODE: 'CHUA_BAT_DAU',
              PHANCONG_STATUS_TEN: 'Chưa bắt đầu', IS_ACTIVE: 1, SOURCE_TYPE_CODE: 'MANUAL', NGUOITAO_TAIKHOAN: 'hanhnt', NGAYTAO: '20260710081500', GHICHU: 'Bàn số 3' }
        ]
    };

    var fx = {
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NH_KEHOACH_NHAPHOC.NHAPHOC_TYPE_CODE': [dm('CHINHQUY', 'Nhập học chính quy'), dm('LIENTHONG', 'Nhập học liên thông'), dm('VB2', 'Văn bằng 2')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NH_KEHOACH_NHAPHOC.STA': [],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NH_KEHOACH_NHANSU.VAITRO_NHAPHOC_CODE': [],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NH_KEHOACH_NHANSU.PHANCONG_STATUS_CODE': []
    };
    fx[P + 'Pr_Nh_KhNhapHoc_GetDs'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return KHNH.filter(function (r) {
            return (!o.strTS_KeHoach_TuyenSinh_Id || r.TS_KEHOACH_TUYENSINH_ID === o.strTS_KeHoach_TuyenSinh_Id) &&
                (!o.strTS_KeHoach_TS_Dot_Id || r.TS_KEHOACH_TUYENSINH_DOT_ID === o.strTS_KeHoach_TS_Dot_Id) &&
                String(r.IS_ACTIVE) === String(o.dIs_Active) &&
                (!q || (r.MA + ' ' + r.TEN).toLowerCase().indexOf(q) >= 0);
        });
    };
    fx[P + 'Pr_Nh_KhNhapHoc_GetById'] = function (o) { var r = tim(o.strId); return r ? [r] : []; };
    fx[P + 'Pr_Nh_KhNhapHoc_Them'] = function (o) { KHNH.push(gan({ ID: 'KHNH' + (seq++), NGAYTAO: '20260927090000', NGUOITAO_TEN: 'Người dùng thử' }, o)); return []; };
    fx[P + 'Pr_Nh_KhNhapHoc_Sua'] = function (o) { var r = tim(o.strId); if (r) gan(r, o); return []; };
    fx[P + 'Pr_Nh_KhNhapHoc_Xoa'] = function (o) { KHNH = KHNH.filter(function (r) { return r.ID !== o.strId; }); return []; };
    fx[P + 'LayDS_NH_KeHoach_DauRa'] = function (o) { return (DAURA[o.strNH_KeHoach_NhapHoc_Id] || []).slice(); };
    fx[P + 'Chuyen_KH_DauRa_TuTuyenSinh'] = function (o) {
        var l = DAURA[o.strNH_KH_NhapHoc_Id] || (DAURA[o.strNH_KH_NhapHoc_Id] = []);
        if (!l.length) {
            l.push({ ID: 'DR' + (seq++), MA_DAU_RA: 'DR-KT', TEN_DAU_RA: 'Kế toán', HEDAOTAO_TEN: 'Đại học chính quy', KHOADAOTAO_TEN: 'Khóa 68',
                CHUONGTRINH_TEN: 'Kế toán', CHUONGTRINH_MA: '7340301', KHOAQUANLY_TEN: 'Khoa Kinh tế', CHI_TIEU_NHAPHOC: 120, REQUIRE_XACNHAN_COSO: 0,
                DAURA_STATUS_TEN: 'Bản nháp', IS_ACTIVE: 1, NGAYTAO: '20260927090000', NGUOITAO_TEN: 'Người dùng thử' });
        }
        return [];
    };
    fx[P + 'Sua_KeHoachDauRa_XacNhanCoSo'] = function (o) {
        Object.keys(DAURA).forEach(function (k) {
            DAURA[k].forEach(function (d) { if (d.ID === o.strNh_KeHoach_Dau_Ra_Id) d.REQUIRE_XACNHAN_COSO = Number(o.dGiaTri); });
        });
        return [];
    };
    fx[P + 'LayDS_NH_KeHoach_NhanSu'] = function (o) {
        return (NS[o.strNH_KeHoach_NhapHoc_Id] || []).map(function (r) { var c = {}; Object.keys(r).forEach(function (k) { c[k] = r[k]; }); return c; });
    };
    fx[P + 'Them_NH_KeHoach_NhanSu'] = function (o) {
        var l = NS[o.strNH_KeHoach_NhapHoc_Id] || (NS[o.strNH_KeHoach_NhapHoc_Id] = []);
        l.push({ ID: 'PC' + (seq++), CORE_PERSON_ID: o.strPerson_Id, PERSON_HOTEN: '', PERSON_MA: '', DONVI_ID: o.strDonVi_Id,
            VAITRO_NHAPHOC_CODE: o.strVaiTro_NhapHoc_Code, VAITRO_TEN: o.strVaiTro_NhapHoc_Code, NGAY_BATDAU: o.strNgay_BatDau, NGAY_KETTHUC: o.strNgay_KetThuc,
            IS_PRIMARY: o.dIs_Primary, IS_MANAGER: o.dIs_Manager, IS_APPROVER: o.dIs_Approver, IS_ACTIVE: 1, SOURCE_TYPE_CODE: o.strSource_Type_Code,
            GHICHU: o.strGhiChu, NGUOITAO_TAIKHOAN: 'nguoidungthu', NGAYTAO: '20260927090000' });
        return [];
    };
    fx[P + 'Sua_NH_KeHoach_NhanSu'] = function (o) {
        Object.keys(NS).forEach(function (k) {
            NS[k].forEach(function (r) {
                if (r.ID !== o.strId) return;
                r.VAITRO_NHAPHOC_CODE = o.strVaiTro_NhapHoc_Code; r.NGAY_BATDAU = o.strNgay_BatDau; r.NGAY_KETTHUC = o.strNgay_KetThuc;
                r.IS_PRIMARY = o.dIs_Primary; r.IS_MANAGER = o.dIs_Manager; r.IS_APPROVER = o.dIs_Approver; r.GHICHU = o.strGhiChu;
            });
        });
        return [];
    };
    fx[P + 'Xoa_NH_KeHoach_NhanSu'] = function (o) {
        Object.keys(NS).forEach(function (k) { NS[k] = NS[k].filter(function (r) { return r.ID !== o.strId; }); });
        return [];
    };
    ums.demo.add(fx);
})();
