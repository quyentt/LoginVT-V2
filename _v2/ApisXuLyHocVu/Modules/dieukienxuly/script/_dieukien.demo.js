/* Dữ liệu mẫu chung của module dieukienxuly — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }

    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#XLHV.LOAIXULY': [
            dm('LXL1', 'CANHBAO', 'Cảnh báo học vụ'), dm('LXL2', 'BUOCTHOIHOC', 'Buộc thôi học'), dm('LXL3', 'DINHCHI', 'Đình chỉ học tập')
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#XLHV.MUCXULY': [
            dm('MXL1', 'CB1', 'Cảnh báo mức 1'), dm('MXL2', 'CB2', 'Cảnh báo mức 2'), dm('MXL3', 'CB3', 'Cảnh báo mức 3'),
            dm('MXL4', 'BTH', 'Buộc thôi học')
        ],
        'XLHV_ThongTinChung/LayDSTuKhoa': [
            { TUKHOA: '[DTBHK]', MOTA: 'Điểm trung bình học kỳ (thang 4)' },
            { TUKHOA: '[DTBTL]', MOTA: 'Điểm trung bình tích lũy (thang 4)' },
            { TUKHOA: '[SOTCNO]', MOTA: 'Tổng số tín chỉ nợ tính đến học kỳ xét' },
            { TUKHOA: '[SOLANCB]', MOTA: 'Số lần đã bị cảnh báo học vụ liên tiếp' },
            { TUKHOA: '[NAMTHU]', MOTA: 'Năm học thứ mấy của người học' }
        ],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'TG261', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' },
            { ID: 'TG252', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' },
            { ID: 'TG251', DAOTAO_THOIGIANDAOTAO: '2025_2026_1' }
        ],
        // Khoá mang DAOTAO_HEDAOTAO_ID (màn suy hệ từ khoá khi mở biểu mẫu sửa)
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': function (o) {
            var all = [
                { ID: 'K67', TENKHOA: 'Khóa 67', DAOTAO_HEDAOTAO_ID: 'H1' },
                { ID: 'K68', TENKHOA: 'Khóa 68', DAOTAO_HEDAOTAO_ID: 'H1' },
                { ID: 'LT12', TENKHOA: 'Liên thông khóa 12', DAOTAO_HEDAOTAO_ID: 'H2' }
            ];
            return o.strDAOTAO_HeDaoTao_Id ? all.filter(function (k) { return k.DAOTAO_HEDAOTAO_ID === o.strDAOTAO_HeDaoTao_Id; }) : all;
        }
    });

    var CHUNG = [
        { ID: 'DK1', LOAIXULY_ID: 'LXL1', MUCXULY_ID: 'MXL1', MUCXULY_TEN: 'Cảnh báo mức 1', THUTU: 1,
          MOTA: 'Điểm TB học kỳ dưới 0,8 (học kỳ đầu) hoặc dưới 1,0', XAUDIEUKIEN: '[DTBHK] < 1.0' },
        { ID: 'DK2', LOAIXULY_ID: 'LXL1', MUCXULY_ID: 'MXL2', MUCXULY_TEN: 'Cảnh báo mức 2', THUTU: 2,
          MOTA: 'Đã bị cảnh báo mức 1 và điểm TB tích lũy dưới 1,5', XAUDIEUKIEN: '[SOLANCB] >= 1 AND [DTBTL] < 1.5' },
        { ID: 'DK3', LOAIXULY_ID: 'LXL1', MUCXULY_ID: 'MXL3', MUCXULY_TEN: 'Cảnh báo mức 3', THUTU: 3,
          MOTA: 'Tổng số tín chỉ nợ vượt quá 24', XAUDIEUKIEN: '[SOTCNO] > 24' },
        { ID: 'DK4', LOAIXULY_ID: 'LXL2', MUCXULY_ID: 'MXL4', MUCXULY_TEN: 'Buộc thôi học', THUTU: 4,
          MOTA: 'Bị cảnh báo 3 lần liên tiếp', XAUDIEUKIEN: '[SOLANCB] >= 3' }
    ];
    ums.demo.crudStore('XLHV_DieuKienXuLy', CHUNG, {
        map: function (o) {
            return { LOAIXULY_ID: o.strLoaiXuLy_Id, MUCXULY_ID: o.strMucXuLy_Id, THUTU: o.iThuTu,
                     MOTA: o.strMoTa, XAUDIEUKIEN: o.strXauDieuKien, MUCXULY_TEN: o.strMucXuLy_Id };
        },
        list: function (rows, o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return rows.filter(function (r) {
                return (!o.strLoaiXuLy_Id || r.LOAIXULY_ID === o.strLoaiXuLy_Id) &&
                    (!q || (r.MOTA + ' ' + r.XAUDIEUKIEN).toLowerCase().indexOf(q) >= 0);
            });
        }
    });
})();
