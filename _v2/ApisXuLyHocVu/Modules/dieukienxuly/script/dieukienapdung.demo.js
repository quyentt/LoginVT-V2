/* Dữ liệu mẫu cho dieukienapdung — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var KHOA = { K67: 'Khóa 67', K68: 'Khóa 68', LT12: 'Liên thông khóa 12' };
    var TG = { TG261: '2026_2027_1', TG252: '2025_2026_2', TG251: '2025_2026_1' };
    var rows = [
        { ID: 'AD1', XLHV_DIEUKIENXULY_ID: 'DK1', LOAIXULY_ID: 'LXL1', MUCXULY_ID: 'MXL1', MUCXULY_TEN: 'Cảnh báo mức 1', THUTU: 1,
          MOTA: 'Điểm TB học kỳ dưới 1,0', XAUDIEUKIEN: '[DTBHK] < 1.0', PHAMVIAPDUNG_ID: 'K67', PHAMVIAPDUNG_TEN: 'Khóa 67',
          DAOTAO_THOIGIANDAOTAO_ID: 'TG252', DAOTAO_THOIGIANDAOTAO_KY: '2025_2026_2' },
        { ID: 'AD2', XLHV_DIEUKIENXULY_ID: 'DK2', LOAIXULY_ID: 'LXL1', MUCXULY_ID: 'MXL2', MUCXULY_TEN: 'Cảnh báo mức 2', THUTU: 2,
          MOTA: 'Đã bị cảnh báo mức 1 và điểm TB tích lũy dưới 1,5', XAUDIEUKIEN: '[SOLANCB] >= 1 AND [DTBTL] < 1.5',
          PHAMVIAPDUNG_ID: 'K67', PHAMVIAPDUNG_TEN: 'Khóa 67', DAOTAO_THOIGIANDAOTAO_ID: 'TG252', DAOTAO_THOIGIANDAOTAO_KY: '2025_2026_2' },
        { ID: 'AD3', XLHV_DIEUKIENXULY_ID: 'DK4', LOAIXULY_ID: 'LXL2', MUCXULY_ID: 'MXL4', MUCXULY_TEN: 'Buộc thôi học', THUTU: 4,
          MOTA: 'Bị cảnh báo 3 lần liên tiếp', XAUDIEUKIEN: '[SOLANCB] >= 3', PHAMVIAPDUNG_ID: 'K68', PHAMVIAPDUNG_TEN: 'Khóa 68',
          DAOTAO_THOIGIANDAOTAO_ID: 'TG261', DAOTAO_THOIGIANDAOTAO_KY: '2026_2027_1' }
    ];
    ums.demo.crudStore('XLHV_DieuKienXuLy_AD', rows, {
        map: function (o) {
            return { XLHV_DIEUKIENXULY_ID: o.strXLHV_DieuKienXuLy_Id, LOAIXULY_ID: o.strLoaiXuLy_Id, MUCXULY_ID: o.strMucXuLy_Id,
                     THUTU: o.dThuTu, MOTA: o.strMoTa, XAUDIEUKIEN: o.strXauDieuKien,
                     PHAMVIAPDUNG_ID: o.strPhamViApDung_Id, PHAMVIAPDUNG_TEN: KHOA[o.strPhamViApDung_Id] || '',
                     DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id, DAOTAO_THOIGIANDAOTAO_KY: TG[o.strDaoTao_ThoiGianDaoTao_Id] || '' };
        },
        list: function (all, o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return all.filter(function (r) {
                return (!o.strLoaiXuLy_Id || r.LOAIXULY_ID === o.strLoaiXuLy_Id) &&
                    (!o.strPhamViApDung_Id || r.PHAMVIAPDUNG_ID === o.strPhamViApDung_Id) &&
                    (!o.strDaoTao_ThoiGianDaoTao_Id || r.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id) &&
                    (!q || (r.MOTA + ' ' + r.XAUDIEUKIEN).toLowerCase().indexOf(q) >= 0);
            });
        }
    });
    ums.demo.add({
        'XLHV_DieuKienXuLy_AD/KeThua': [],
        'XLHV_DieuKienXuLy_AD/Xoa_XLHV_DieuKienXuLy_AD_Tat': []
    });
})();
