/* Dữ liệu mẫu cho sinhvienmiengiammoi — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var SV = ums.demo.mg.SV.slice(0, 5);
    function nh(s) {
        return { QLSV_NGUOIHOC_ID: s.ID, QLSV_NGUOIHOC_MASO: s.MASONGUOIHOC, QLSV_NGUOIHOC_HODEM: s.HODEM, QLSV_NGUOIHOC_TEN: s.TEN,
            QLSV_NGUOIHOC_NGAYSINH: s.NGAYSINH_NGAY + '/' + s.NGAYSINH_THANG + '/' + s.NGAYSINH_NAM,
            DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh', QLSV_NGUOIHOC_LOP: s.DAOTAO_LOPQUANLY_TEN };
    }
    function c(id, sv, tg, v, dt) {
        var s = SV.filter(function (x) { return x.ID === sv; })[0], r = nh(s);
        r.ID = id; r.DAOTAO_THOIGIANDAOTAO_ID = tg; r.PHANTRAMMIENGIAM = v; r.SOTIEN = v * 45000;
        r.QLSV_DOITUONG_ID = dt; r.DAOTAO_TOCHUCCHUONGTRINH_ID = 'CT01'; r.KIEUHOC_ID = 'KHOC1'; r.TAICHINH_CACKHOANTHU_ID = 'KT1';
        return r;
    }
    var COLS = [{ ID: 'TG231', THOIGIAN: 'HK1 2023-2024' }, { ID: 'TG232', THOIGIAN: 'HK2 2023-2024' }, { ID: 'TG241', THOIGIAN: 'HK1 2024-2025' }];
    var CELLS = [c('SM1', 'SV01', 'TG231', 100, 'DT01'), c('SM2', 'SV01', 'TG232', 100, 'DT01'), c('SM3', 'SV02', 'TG231', 70, 'DT02'),
        c('SM4', 'SV04', 'TG232', 50, 'DT05'), c('SM5', 'SV05', 'TG241', 70, 'DT03')];
    ums.demo.add({
        'TC_DoiTuong_MienGiam/LayDSThoiGian_DoiTuong_Mien': COLS,
        'TC_DoiTuong_MienGiam/LayDSTaiChinh_NguoiHoc_Mien': SV.map(nh),
        'TC_DoiTuong_MienGiam/LayDanhSach': CELLS,
        'TC_SoTienMien/LayDSThoiGian_DT_SoTienMien': COLS,
        'TC_SoTienMien/LayDSTaiChinh_NH_SoTienMien': SV.map(nh),
        'TC_SoTienMien/LayDanhSach': CELLS
    });
})();
