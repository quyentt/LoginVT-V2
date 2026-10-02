/* Dữ liệu mẫu cho _khts.js (ums.khts — dùng chung hai màn Kế hoạch … tuyển sinh new) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var KH = [
        { ID: 'KHTS2026', MA: 'TS2026', TEN: 'Kế hoạch tuyển sinh đại học chính quy 2026' },
        { ID: 'KHTS2026LT', MA: 'TSLT2026', TEN: 'Kế hoạch tuyển sinh liên thông 2026' },
        { ID: 'KHTS2025', MA: 'TS2025', TEN: 'Kế hoạch tuyển sinh đại học chính quy 2025', IS_ACTIVE: 0 }
    ];
    var DOT = [
        { ID: 'DOT1', TS_KEHOACH_TUYENSINH_ID: 'KHTS2026', MA: 'D1', TEN: 'Đợt 1 — xét tuyển kết quả thi THPT' },
        { ID: 'DOT2', TS_KEHOACH_TUYENSINH_ID: 'KHTS2026', MA: 'D2', TEN: 'Đợt 2 — xét tuyển bổ sung' },
        { ID: 'DOT3', TS_KEHOACH_TUYENSINH_ID: 'KHTS2026LT', MA: 'LT1', TEN: 'Đợt 1 liên thông' },
        { ID: 'DOT4', TS_KEHOACH_TUYENSINH_ID: 'KHTS2025', MA: 'D1', TEN: 'Đợt 1 năm 2025' }
    ];
    ums.demo.add({
        'PKG_CORE_TS_KEHOACH.Pr_Ts_KH_TuyenSinh_Get_List': function (o) {
            var hl = String(o.dIs_Active);
            return KH.filter(function (r) { return String(r.IS_ACTIVE === undefined ? 1 : r.IS_ACTIVE) === hl; });
        },
        'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Get_Ds': function (o) {
            return DOT.filter(function (r) { return r.TS_KEHOACH_TUYENSINH_ID === o.strTs_KeHoach_TuyenSinh_Id; });
        },
        'NS_CoCauToChuc/LayDanhSach': [
            { ID: 'DV1', MA: 'PDT', TEN: 'Phòng Đào tạo' },
            { ID: 'DV2', MA: 'PCTSV', TEN: 'Phòng Công tác sinh viên' },
            { ID: 'DV3', MA: 'PKHTC', TEN: 'Phòng Kế hoạch – Tài chính' },
            { ID: 'DV4', MA: 'KCNTT', TEN: 'Khoa Công nghệ thông tin' }
        ]
    });
})();
