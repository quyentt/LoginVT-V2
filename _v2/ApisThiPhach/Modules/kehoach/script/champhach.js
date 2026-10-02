/* champhach — Lập danh sách chấm kiểm tra theo TÚI / PHÁCH.
   Khung chung: _tp_cham.js (chú thích đầy đủ ở đó). Bản gốc: kehoach/script/champhach.js (html nạp "ChamPhach.js"). */
(function () {
    'use strict';
    ums.tpCham.man(document.getElementById('tp-champhach'), {
        tieuDe: 'Lập danh sách chấm kiểm tra - Phách', kieu: 'tui',
        ds: { ds: 'TP_ChamKiemTra/LayDSTheoTui', nn: 'TP_ChamKiemTra/LayDSNgauNhienTheoTui', kq: 'TP_ChamKiemTra/LayDSTheoTuiChamKT' },
        them: 'TP_ChamKiemTra/Them_Thi_DSSV_Tui_ChamKT', xoa: 'TP_ChamKiemTra/Xoa_Thi_DSSV_Tui_ChamKT',
        cot: ums.tpCham.COT.tui
    });
})();
