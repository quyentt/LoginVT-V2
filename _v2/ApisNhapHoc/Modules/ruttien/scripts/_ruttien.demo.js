/* Dữ liệu mẫu cho rút tiền nhập học (_ruttien.js) — bản mới và bản cũ. */
(function () {
    'use strict';
    var seq = 3;
    var RUT = { NH01: [{ ID: 'PR1', SOPHIEUTHU: '000101', NGUOITAO_TENDAYDU: 'Phạm Thu Hà', NGAYTAO_DD_MM_YYYY_HHMMSS: '20/08/2026 09:15:02' }] };
    function thu(o) {
        return [
            { ID: 'PT1' + o.strQLSV_NguoiHoc_Id, SOPHIEUTHU: '002341', NGUOITAO_TENDAYDU: 'Nguyễn Văn Bình', NGAYTAO_DD_MM_YYYY_HHMMSS: '18/08/2026 08:02:11' },
            { ID: 'PT2' + o.strQLSV_NguoiHoc_Id, SOPHIEUTHU: '002377', NGUOITAO_TENDAYDU: 'Nguyễn Văn Bình', NGAYTAO_DD_MM_YYYY_HHMMSS: '18/08/2026 10:40:53' }
        ];
    }
    function khoan(o) {
        var id = String(o.strPhieuThu_Rut_Id || '');
        if (id.indexOf('PR') === 0) {
            return [
                { CHUNGTU_ID: id, SOCHUNGTU: '0001' + id.slice(2), TAICHINH_CACKHOANTHU_ID: 'KT3', TAICHINH_CACKHOANTHU_TEN: 'Khám sức khoẻ đầu khoá', NOIDUNG: 'Rút tiền khám sức khoẻ nộp thừa',
                  SOTIENDATHU: 50000, NGAYIN_NGAY: '27', NGAYIN_THANG: '09', NGAYIN_NAM: '2026', DAOTAO_COCAUTOCHUC_TEN: 'TRƯỜNG ĐH CNTT&TT', NGUOITAO_TENDAYDU: 'Phạm Thu Hà', MAUIN_MASO: 'DHCNTTTN_BIENLAIRUT_2018' }
            ];
        }
        return [
            { TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_TEN: 'Học phí học kỳ 1', SOTIENDATHU: 7500000, SOTIENDARUT: 0 },
            { TAICHINH_CACKHOANTHU_ID: 'KT3', TAICHINH_CACKHOANTHU_TEN: 'Khám sức khoẻ đầu khoá', SOTIENDATHU: 200000, SOTIENDARUT: 50000 },
            { TAICHINH_CACKHOANTHU_ID: 'KT4', TAICHINH_CACKHOANTHU_TEN: 'Ký túc xá (4 tháng)', SOTIENDATHU: 500000, SOTIENDARUT: 500000 }
        ];
    }
    function rut(o) {
        var id = 'PR' + (seq++);
        (RUT[o.strQLSV_NguoiHoc_TTTS_Id] = RUT[o.strQLSV_NguoiHoc_TTTS_Id] || []).push({ ID: id, SOPHIEUTHU: '0001' + id.slice(2),
            NGUOITAO_TENDAYDU: 'Cán bộ dựng thử', NGAYTAO_DD_MM_YYYY_HHMMSS: '27/09/2026 14:00:00' });
        return { rows: [], message: id + ',0001' + id.slice(2) };
    }
    ums.demo.add({
        'TC_PhieuThu/LayDSPhieuThuNhaphoc': thu,
        'TC_PhieuThu/LayDSPhieuRutNhaphoc': function (o) { return (RUT[o.strQLSV_NguoiHoc_Id] || []).slice(); },
        'TC_PhieuThu/HuyPhieuNhapHoc': function (o) {
            Object.keys(RUT).forEach(function (k) { RUT[k] = RUT[k].filter(function (x) { return x.ID !== o.strPhieu_Id; }); });
            return { rows: [] };
        },
        'PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc': khoan,
        'NH_DinhMuc_Chung/LayDSKhoanDaThuNhapHoc': khoan,
        'PKG_CORE_NhapHoc_ThuTien.NhapHoc_RutTien': rut,
        'NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_RutTien': rut
    });
})();
