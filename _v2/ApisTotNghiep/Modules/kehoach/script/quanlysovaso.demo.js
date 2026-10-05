/* Dữ liệu mẫu cho Quản lý số vào sổ — chỉ dùng ở chế độ dựng thử. */
(function () {
    var P = 'PKG_VANBANG_CHUNGCHI_CHUNG.';
    var QT = [
        { ID: 'QT01', MA: 'SVS-DHCQ', TEN: 'Số vào sổ bằng đại học chính quy' },
        { ID: 'QT02', MA: 'SVS-THS', TEN: 'Số vào sổ bằng thạc sĩ' },
        { ID: 'QT03', MA: 'SVS-CC', TEN: 'Số vào sổ chứng chỉ' }
    ];
    var ROWS = [
        { ID: 'SVS0001', CHISO: 1, SOCHUNGTU: 'DHCQ-2026-0001', HETHONGCHUNGTU_MA: 'SVS-DHCQ', HETHONGCHUNGTU_AD_ID: 'QT01', NGAYTHUCHIEN: '20/06/2026', NAMTHUCHIEN: '2026', IS_NHAP_THUCONG: 0, DA_SU_DUNG: 1 },
        { ID: 'SVS0002', CHISO: 2, SOCHUNGTU: 'DHCQ-2026-0002', HETHONGCHUNGTU_MA: 'SVS-DHCQ', HETHONGCHUNGTU_AD_ID: 'QT01', NGAYTHUCHIEN: '20/06/2026', NAMTHUCHIEN: '2026', IS_NHAP_THUCONG: 0, DA_SU_DUNG: 1 },
        { ID: 'SVS0003', CHISO: 3, SOCHUNGTU: 'DHCQ-2026-0003', HETHONGCHUNGTU_MA: 'SVS-DHCQ', HETHONGCHUNGTU_AD_ID: 'QT01', NGAYTHUCHIEN: '21/06/2026', NAMTHUCHIEN: '2026', IS_NHAP_THUCONG: 0, DA_SU_DUNG: 0 },
        { ID: 'SVS0004', CHISO: 15, SOCHUNGTU: 'DHCQ-2026-0015', HETHONGCHUNGTU_MA: 'SVS-DHCQ', HETHONGCHUNGTU_AD_ID: 'QT01', NGAYTHUCHIEN: '25/06/2026', NAMTHUCHIEN: '2026', IS_NHAP_THUCONG: 1, DA_SU_DUNG: 0 },
        { ID: 'SVS0005', CHISO: 1, SOCHUNGTU: 'THS-2026-0001', HETHONGCHUNGTU_MA: 'SVS-THS', HETHONGCHUNGTU_AD_ID: 'QT02', NGAYTHUCHIEN: '02/07/2026', NAMTHUCHIEN: '2026', IS_NHAP_THUCONG: 1, DA_SU_DUNG: 1 },
        { ID: 'SVS0006', CHISO: 4, SOCHUNGTU: 'CC-2025-0004', HETHONGCHUNGTU_MA: 'SVS-CC', HETHONGCHUNGTU_AD_ID: 'QT03', NGAYTHUCHIEN: '12/12/2025', NAMTHUCHIEN: '2025', IS_NHAP_THUCONG: 0, DA_SU_DUNG: 0 }
    ];
    var fx = {};
    fx[P + 'LayDSTN_QuyTacSinh_SoVaoSo_Ad'] = QT;
    fx[P + 'SoChungTu_LayDanhSach'] = function (o) {
        var q = String(o.strSoChungTu || '').toLowerCase();
        var rs = ROWS.filter(function (r) {
            return (!o.strTN_HeThongChungTu_Ad_Id || r.HETHONGCHUNGTU_AD_ID === o.strTN_HeThongChungTu_Ad_Id) &&
                (!o.strNamThucHien || r.NAMTHUCHIEN === String(o.strNamThucHien)) &&
                (!q || r.SOCHUNGTU.toLowerCase().indexOf(q) >= 0);
        });
        var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
        return { rows: rs.slice((pi - 1) * sz, pi * sz), pager: rs.length };
    };
    fx[P + 'SoChungTu_LayTheoId'] = function (o) {
        return ROWS.filter(function (r) { return r.ID === o.strId; }).map(function (r) {
            return { ID: r.ID, CHISO: r.CHISO, SOCHUNGTU: r.SOCHUNGTU, HETHONGCHUNGTU_AD_ID: r.HETHONGCHUNGTU_AD_ID,
                HETHONGCHUNGTU_MA: r.HETHONGCHUNGTU_MA, NGAYTHUCHIEN: r.NGAYTHUCHIEN, NAMTHUCHIEN: r.NAMTHUCHIEN,
                IS_NHAP_THUCONG: r.IS_NHAP_THUCONG, DA_SU_DUNG: r.DA_SU_DUNG, NGUOITAO_TAIKHOAN: 'admin', NGAYTAO_DD_MM_YYYY: r.NGAYTHUCHIEN };
        });
    };
    fx[P + 'SoChungTu_ThemMoi_ThuCong'] = { rows: [], message: 'SVS_MOI' };
    fx[P + 'SoChungTu_Sua_ThuCong'] = [];
    fx[P + 'SoChungTu_Xoa_ThuCong'] = [];
    ums.demo.add(fx);
})();
