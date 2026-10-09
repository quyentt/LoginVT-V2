/* =========================================================================
   NCKH — Đề tài: MƯỢN các khối con của bản Cổng cán bộ đã chuyển (không sửa tệp CCB)
   ---------------------------------------------------------------------------
   Tệp CCB `ApisCongCanBo/Modules/sanphamkhoahoc/script/detai.js` là một IIFE tự dựng màn khi thấy
   phần tử #sanphamkhoahoc-detai rồi gọi ums.nckh.man(root, cfg). cfg.khoi chứa 7 khối con đã chuyển
   (sản phẩm khoa học + đào tạo, sản phẩm ứng dụng, đơn vị hợp tác, tiến độ, quyết định phê duyệt -
   nghiệm thu…). Tệp này đặt TẠM một phần tử ẩn cùng id và bọc ums.nckh.man: lần gọi đầu với phần tử
   tạm đó thì CHỈ GIỮ cfg (ums.nckhDt.cfgCCB) — không dựng gì — rồi trả lại hàm gốc và gỡ phần tử tạm.
   Thứ tự nạp trong html:  _sanpham.js (CCB) → _dt_muon.js → detai.js (CCB) → _dt_detai.js → màn.
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nckh;
    var D = ums.nckhDt = ums.nckhDt || {};
    D.cfgCCB = null;
    if (!N || typeof N.man !== 'function' || document.getElementById('sanphamkhoahoc-detai')) return;
    var goc = N.man;
    var tam = document.createElement('div');
    tam.id = 'sanphamkhoahoc-detai';
    tam.hidden = true;
    document.body.appendChild(tam);
    function traLai() {
        if (N.man === boc) N.man = goc;
        if (tam && tam.parentNode) tam.parentNode.removeChild(tam);
        tam = null;
    }
    function boc(root, cfg) {
        if (tam && root === tam) { D.cfgCCB = cfg; traLai(); return null; }
        traLai();
        return goc.apply(this, arguments);
    }
    N.man = boc;
    /* Tệp CCB không nạp được thì màn vẫn phải trả hàm gốc về (ums.nckhDt.man gọi) */
    D.traLai = traLai;
})();
