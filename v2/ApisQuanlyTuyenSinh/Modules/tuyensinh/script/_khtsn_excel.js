/* =========================================================================
   ums.khtsn — ĐỌC tệp Excel / CSV (Import trúng tuyển, Đối chiếu file)
   ---------------------------------------------------------------------------
   Bản gốc nạp SheetJS (xlsx-js-style 1.2.0) từ CDN ngay khi mở màn. _v2 tự chứa phụ thuộc: cùng bản đó nay nằm ở
   assets/vendor/xlsx/xlsx.bundle.js (Apache-2.0, tải 2026-09-27) — chỉ nạp khi người dùng thật sự đọc tệp, KHÔNG gọi CDN.
   Nợ tầng chung: hàm ums.ui.docXls dùng chung.
   XUẤT Excel dùng ums.ui.xuatXls (bảng HTML đuôi .xls — không cần thư viện). Tệp
   xuất ra vẫn đọc lại được bằng SheetJS (nhập lại nhóm "Chỉ trong file").
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, T = ums.khtsn;

    var CDN = ['assets/vendor/xlsx/xlsx.bundle.js'];   // bản cục bộ (đường dẫn tính từ vỏ _v2/index.aspx)
    var pXLSX = null;
    T.napXLSX = function () {
        if (window.XLSX && window.XLSX.version) return Promise.resolve(window.XLSX);
        if (pXLSX) return pXLSX;
        pXLSX = new Promise(function (ok, loi) {
            var i = 0;
            (function thu() {
                if (i >= CDN.length) { pXLSX = null; loi(new Error('Không tải được thư viện đọc Excel (assets/vendor/xlsx)')); return; }
                var s = document.createElement('script');
                s.src = CDN[i];
                s.onload = function () { ok(window.XLSX); };
                s.onerror = function () { i++; s.remove(); thu(); };
                document.head.appendChild(s);
            })();
        });
        return pXLSX;
    };

    /** Đọc sheet đầu tiên → mảng dòng { tên cột: giá trị } (hàng 1 = tiêu đề), như XLSX.utils.sheet_to_json của gốc */
    T.docTep = function (file) {
        if (!file) return Promise.reject(new Error('Vui lòng chọn file'));
        return T.napXLSX().then(function (X) {
            return new Promise(function (ok, loi) {
                var rd = new FileReader();
                rd.onload = function (ev) {
                    try {
                        var wb = X.read(ev.target.result, { type: 'array', cellDates: true, cellNF: false });
                        var ws = wb.Sheets[wb.SheetNames[0]];
                        ok(X.utils.sheet_to_json(ws, { defval: '', raw: false }));
                    } catch (ex) { loi(new Error('Không đọc được file: ' + (ex && ex.message ? ex.message : ex))); }
                };
                rd.onerror = function () { loi(new Error('Lỗi đọc file')); };
                rd.readAsArrayBuffer(file);
            });
        });
    };

    /** Xuất mảng hai chiều (hàng 1 = tiêu đề) ra .xls — thay XLSX.utils.aoa_to_sheet + writeFile của gốc */
    T.xuatAoa = function (ten, aoa) {
        var head = aoa[0] || [];
        ums.ui.xuatXls(ten, {
            cot: head.map(function (h, i) { return { title: h, get: function (r) { return r[i]; } }; }),
            dong: aoa.slice(1)
        });
    };
    /** Xuất mảng bản ghi, tiêu đề = hợp mọi khoá theo thứ tự xuất hiện (giữ nguyên cột file gốc) */
    T.xuatBanGhi = function (ten, rows, tienTo) {
        var keys = [], seen = {};
        (tienTo || []).forEach(function (k) { seen[k] = 1; keys.push(k); });
        rows.forEach(function (r) {
            Object.keys(r || {}).forEach(function (k) { if (!seen[k]) { seen[k] = 1; keys.push(k); } });
        });
        var aoa = [keys];
        rows.forEach(function (r) {
            aoa.push(keys.map(function (k) {
                var v = r[k];
                if (v === null || v === undefined) return '';
                return typeof v === 'object' ? JSON.stringify(v) : v;
            }));
        });
        T.xuatAoa(ten, aoa);
    };
})();
