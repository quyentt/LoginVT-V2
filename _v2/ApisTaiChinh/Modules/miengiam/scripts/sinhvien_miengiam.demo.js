/* Dữ liệu mẫu cho sinhvien_miengiam — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var SV = ums.demo.mg.SV;
    var DT = {};
    ums.demo.mg.DTMG.forEach(function (x) { DT[x.ID] = x.TEN; });
    function r(id, i, dt, pt, duyet) {
        var s = SV[i];
        return {
            ID: id, QLSV_NGUOIHOC_MASO: s.MASONGUOIHOC, QLSV_NGUOIHOC_HODEM: s.HODEM, QLSV_NGUOIHOC_TEN: s.TEN,
            QLSV_NGUOIHOC_NGAYSINH: s.NGAYSINH_NGAY + '/' + s.NGAYSINH_THANG + '/' + s.NGAYSINH_NAM,
            QLSV_NGUOIHOC_TINHTRANG: 'Đang học', QLSV_DOITUONG_TEN: DT[dt], QLSV_NGUOIHOC_LOP: s.DAOTAO_LOPQUANLY_TEN,
            DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh', PHANTRAMMIENGIAM: pt, CANBODUYET_ID: duyet ? 'CB01' : null
        };
    }
    ums.demo.add({
        'TC_DoiTuong_MienGiam/LayDanhSach': [
            r('SVM1', 0, 'DT01', 100, true), r('SVM2', 1, 'DT02', 70, true), r('SVM3', 2, 'DT03', 70, false),
            r('SVM4', 3, 'DT05', 50, false), r('SVM5', 5, 'DT04', 100, false)
        ],
        'TC_MucMienGiam/LayDanhSach': [
            { ID: 'MMG1', QLSV_DOITUONG_ID: 'DT01', QLSV_DOITUONG_TEN: DT.DT01, PHANTRAMMIENGIAM: 100 },
            { ID: 'MMG3', QLSV_DOITUONG_ID: 'DT02', QLSV_DOITUONG_TEN: DT.DT02, PHANTRAMMIENGIAM: 70 },
            { ID: 'MMG5', QLSV_DOITUONG_ID: 'DT03', QLSV_DOITUONG_TEN: DT.DT03, PHANTRAMMIENGIAM: 70 },
            { ID: 'MMG7', QLSV_DOITUONG_ID: 'DT05', QLSV_DOITUONG_TEN: DT.DT05, PHANTRAMMIENGIAM: 50 }
        ]
    });
})();
