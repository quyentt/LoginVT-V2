/* chamkiemtradst — Lập danh sách chấm kiểm tra theo DANH SÁCH THI.
   Khung chung: _tp_cham.js (chú thích đầy đủ ở đó). Bản gốc: kehoach/script/chamkiemtradst.js (html nạp "ChamKiemTradst.js"). */
(function () {
    'use strict';
    ums.tpCham.man(document.getElementById('tp-chamkiemtradst'), {
        tieuDe: 'Lập danh sách chấm kiểm tra - Danh sách thi', kieu: 'dst',
        ds: { ds: 'TP_ChamKiemTra/LayDSTheoDST', nn: 'TP_ChamKiemTra/LayDSNgauNhienTheoDST', kq: 'TP_ChamKiemTra/LayDSTheoDSTChamKT' },
        them: 'TP_ChamKiemTra/Them_Thi_DSSV_ChamKT', xoa: 'TP_ChamKiemTra/Xoa_Thi_DSSV_ChamKT',
        cot: ums.tpCham.COT.dst
    });
})();
