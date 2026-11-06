/*----------------------------------------------
--Chuẩn xuất Excel dùng chung: edu.exporter
--Tạo file .xlsx thật ngay trên trình duyệt (không thư viện ngoài, không gọi server):
--  tiêu đề, dòng điều kiện lọc, tiêu đề cột tô màu, viền, độ rộng cột tự tính, cố định dòng tiêu đề,
--  bộ lọc, dòng tổng, ghi chú ngày xuất, in A4 ngang lặp tiêu đề. Hỗ trợ nhiều sheet.
--Nhập: dữ liệu (mảng) + định nghĩa cột, hoặc 1 bảng đang hiển thị trên màn hình.
--Xuất: file .xlsx tải về máy.
--
--Cách dùng nhanh (mọi chức năng đều chỉ cần 1 lời gọi):
--  edu.exporter.bindButton("#btnExport", function () {
--      return {
--          fileName: "DanhSachSinhVien",              // tự thêm _yyyyMMdd_HHmm.xlsx
--          title: "DANH SÁCH SINH VIÊN",
--          subTitles: ["Năm học: 2025", "Hệ đào tạo: Đại học chính quy"],
--          columns: [{ header: "Mã số", field: "MASO" },
--                    { header: "Họ tên", render: function (row) { return row.HODEM + " " + row.TEN; } },
--                    { header: "Điểm", field: "DIEM", type: "number", sum: true }],
--          data: dtDanhSach
--      };
--  });
--  Tái dùng aoColumns của bảng (không phải khai báo cột 2 lần):
--      { table: "tblXXX", aoColumns: aoColumnsCuaBang, colOptions: { 10: { type: "number" } }, data: dtDanhSach }
--  Xuất thẳng bảng đang hiển thị (hỗ trợ tiêu đề nhiều dòng, colspan/rowspan):
--      edu.exporter.exportTable("tblXXX", { fileName: "...", title: "..." });
--  Nhiều sheet: { fileName: "...", sheets: [ {name, title, columns, data}, {...} ] }
--
--Tùy chọn của 1 sheet:
--  name, title, subTitles[], columns[] | (table + aoColumns + colOptions), data[],
--  stt (mặc định true), sttHeader ("STT"), footer (mặc định true: tổng số bản ghi + ngày xuất + người xuất),
--  user (mặc định lấy tên đang đăng nhập), filter (mặc định true), freeze (mặc định true)
--  filters: [{ label, field | get(row), selected[] | from }] — các danh sách "lọc thêm khi xuất" trong hộp thoại hỏi trước khi xuất
--           (tích chọn nhiều giá trị, có ô tìm kiếm trong danh sách và ô từ khóa chung theo mọi cột của file;
--            không tích gì = tất cả; chỉ áp cho sheet có data).
--           QUY TẮC MẶC ĐỊNH (chung cho mọi bộ lọc): chọn gì ở ngoài màn hình tìm kiếm thì hộp thoại tích sẵn đúng cái đó,
--           không chọn gì thì để trống. Khai báo bằng selected: [tên các mục đã chọn ngoài màn hình, chụp lúc tìm kiếm — nên dùng
--           edu.exporter.selectedTexts("idOChon")] hoặc from: "idOChon" (đọc ngay lúc mở hộp thoại). Khớp theo tên, không phân biệt hoa/thường, dấu.
--  skipWhenFiltered: true => sheet này bị bỏ khi người dùng có lọc thêm (VD sheet thống kê tính sẵn từ server)
--Tùy chọn chung: confirm (mặc định true khi bấm nút gắn bằng bindButton: hiện hộp thoại "Bạn có muốn xuất không?";
--  đặt false để xuất thẳng)
--Tùy chọn của 1 cột:
--  header, field | render(row, index), width, align (left|center|right), html (true: giá trị là HTML -> đổi thành chữ),
--  group (tên nhóm cột: các cột liên tiếp cùng group có thêm dòng tiêu đề nhóm gộp ngang),
--  type ("text" mặc định | "number"), format ("general" | "int" | "dec2"), sum (true: có dòng Tổng)
--Lưu ý: chỉ cột khai type:"number" mới ghi số; mã số/CCCD... luôn là chữ để không mất số 0 đầu.
----------------------------------------------*/
var exportexcelApi = (function (root) {
    var MAX_CELL_LEN = 32000;
    var XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    var NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
    var NS_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

    /*------------------------------------------
    --Discription: [1] Tiện ích
    -------------------------------------------*/
    function pad2(n) { return (n < 10 ? "0" : "") + n; }
    function stamp(d) {
        return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + "_" + pad2(d.getHours()) + pad2(d.getMinutes());
    }
    function fmtDateTime(d) {
        return pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + "/" + d.getFullYear() + " " + pad2(d.getHours()) + ":" + pad2(d.getMinutes());
    }
    function esc(s) {
        return String(s)
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function colName(i) {
        var s = "";
        i++;
        while (i > 0) {
            var m = (i - 1) % 26;
            s = String.fromCharCode(65 + m) + s;
            i = Math.floor((i - 1) / 26);
        }
        return s;
    }
    function ref(r, c) { return colName(c) + (r + 1); }
    function toText(v) {
        if (v === null || v === undefined) return "";
        var s = String(v);
        if (s === "null" || s === "undefined") return "";
        return s.length > MAX_CELL_LEN ? s.substring(0, MAX_CELL_LEN) : s;
    }
    // "7,5" / "7.5" / " 78 " -> số; không phải số -> null
    function toNumber(v) {
        if (typeof v === "number") return isFinite(v) ? v : null;
        var s = toText(v).replace(/\s/g, "");
        if (!/^-?\d+([.,]\d+)?$/.test(s)) return null;
        return parseFloat(s.replace(",", "."));
    }
    function longestLine(s) {
        var max = 0, arr = String(s).split("\n");
        for (var i = 0; i < arr.length; i++) if (arr[i].length > max) max = arr[i].length;
        return max;
    }
    function htmlToText(html) {
        if (html === null || html === undefined) return "";
        var s = String(html);
        if (s.indexOf("<") === -1 && s.indexOf("&") === -1) return s;
        // DOMParser không nạp ảnh/chạy script nên an toàn với HTML do mRender sinh ra
        if (typeof DOMParser !== "undefined") {
            var doc = new DOMParser().parseFromString(s.replace(/<br\s*\/?>/gi, "\n"), "text/html");
            return (doc.body.textContent || "").replace(/\u00a0/g, " ").trim();
        }
        return s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    }
    function utf8(str) { return new TextEncoder().encode(str); }

    /*------------------------------------------
    --Discription: [2] ZIP (không nén) — .xlsx thực chất là file zip chứa các file XML
    -------------------------------------------*/
    var CRC_TABLE = (function () {
        var t = new Uint32Array(256);
        for (var n = 0; n < 256; n++) {
            var c = n;
            for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            t[n] = c >>> 0;
        }
        return t;
    })();
    function crcUpdate(crc, bytes, from, to) {
        for (var i = from; i < to; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
        return crc;
    }
    function crc32(bytes) {
        return (crcUpdate(0xFFFFFFFF, bytes, 0, bytes.length) ^ 0xFFFFFFFF) >>> 0;
    }

    // Chạy fn(từ, đến) lần lượt cho các lô của [0, n) và NHƯỜNG luồng cho trình duyệt giữa các lô (mỗi lượt chạy tối đa SLICE_MS).
    // Dữ liệu hàng chục nghìn dòng mà dựng 1 mạch thì trang đứng nhiều giây (máy yếu: quá 15 giây -> Chrome báo "Page Unresponsive");
    // chia lô thì vòng quay/% tiến độ vẫn chạy và vẫn bấm được. step = số phần tử mỗi lô; onProgress(đã xong, n) gọi sau mỗi lượt.
    var SLICE_MS = 30;
    function nowMs() { return (root.performance && root.performance.now) ? root.performance.now() : Date.now(); }
    function sliceRun(n, fn, onProgress, step) {
        return new Promise(function (resolve, reject) {
            var at = 0, size = step || 200;
            (function run() {
                var t0 = nowMs();
                try {
                    do { var to = Math.min(n, at + size); fn(at, to); at = to; } while (at < n && nowMs() - t0 < SLICE_MS);
                } catch (ex) { reject(ex); return; }
                if (onProgress) onProgress(at, n);
                if (at >= n) { resolve(); return; }
                setTimeout(run, 0);
            })();
        });
    }
    // Ghép nhiều Uint8Array thành 1
    function concatBytes(chunks, total) {
        var out = new Uint8Array(total), pos = 0;
        for (var i = 0; i < chunks.length; i++) { out.set(chunks[i], pos); pos += chunks[i].length; }
        return out;
    }
    // files: [{ name, data }]; file nào có thêm .packed (deflate-raw của data) thì ghi dạng nén, còn lại ghi nguyên
    function zipStore(files) {
        var now = new Date();
        var dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
        var dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
        var parts = [], central = [], offset = 0, cdSize = 0, i;
        for (i = 0; i < files.length; i++) {
            // file lớn đã được tính sẵn crc theo từng lô (files[i].crc) thì dùng luôn
            var name = utf8(files[i].name), data = files[i].data, crc = files[i].crc !== undefined ? files[i].crc : crc32(data);
            var body = files[i].packed || data, method = files[i].packed ? 8 : 0;
            var lh = new Uint8Array(30 + name.length), lv = new DataView(lh.buffer);
            lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true); lv.setUint16(8, method, true);
            lv.setUint16(10, dosTime, true); lv.setUint16(12, dosDate, true); lv.setUint32(14, crc, true);
            lv.setUint32(18, body.length, true); lv.setUint32(22, data.length, true);
            lv.setUint16(26, name.length, true); lv.setUint16(28, 0, true);
            lh.set(name, 30);
            var ch = new Uint8Array(46 + name.length), cv = new DataView(ch.buffer);
            cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true);
            cv.setUint16(10, method, true); cv.setUint16(12, dosTime, true); cv.setUint16(14, dosDate, true);
            cv.setUint32(16, crc, true); cv.setUint32(20, body.length, true); cv.setUint32(24, data.length, true);
            cv.setUint16(28, name.length, true); cv.setUint32(42, offset, true);
            ch.set(name, 46);
            parts.push(lh, body);
            central.push(ch);
            offset += lh.length + body.length;
            cdSize += ch.length;
        }
        var end = new Uint8Array(22), ev = new DataView(end.buffer);
        ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
        ev.setUint32(12, cdSize, true); ev.setUint32(16, offset, true);
        var all = parts.concat(central, [end]), total = 0;
        for (i = 0; i < all.length; i++) total += all[i].length;
        var out = new Uint8Array(total), pos = 0;
        for (i = 0; i < all.length; i++) { out.set(all[i], pos); pos += all[i].length; }
        return out;
    }

    /*------------------------------------------
    --Discription: [3] Kiểu ô (styles.xml) — tạo theo nhu cầu, ô nào cùng kiểu dùng chung 1 xf
    -------------------------------------------*/
    var FONT = { normal: 0, bold: 1, title: 2, italic: 3, head: 4, note: 5 };
    var FILL = { none: 0, head: 2, sum: 3 };
    var FMT = { general: 0, int: 3, dec2: 4 };
    function Styles() {
        this.xfs = [];
        this.map = {};
        this.get({});//xf 0 = mặc định
    }
    Styles.prototype.get = function (spec) {
        var key = JSON.stringify(spec);
        if (this.map[key] !== undefined) return this.map[key];
        var x = '<xf numFmtId="' + (FMT[spec.fmt] || 0) + '" fontId="' + (FONT[spec.font] || 0) + '" fillId="' + (FILL[spec.fill] || 0)
            + '" borderId="' + (spec.border ? 1 : 0) + '" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"';
        if (spec.align || spec.valign || spec.wrap) {
            x += ' applyAlignment="1"><alignment' + (spec.align ? ' horizontal="' + spec.align + '"' : '')
                + (spec.valign ? ' vertical="' + spec.valign + '"' : '') + (spec.wrap ? ' wrapText="1"' : '') + '/></xf>';
        } else {
            x += '/>';
        }
        this.xfs.push(x);
        this.map[key] = this.xfs.length - 1;
        return this.map[key];
    };
    Styles.prototype.toXml = function () {
        var f = '<font><sz val="11"/><name val="Times New Roman"/></font>'
            + '<font><b/><sz val="11"/><name val="Times New Roman"/></font>'
            + '<font><b/><sz val="16"/><name val="Times New Roman"/></font>'
            + '<font><i/><sz val="11"/><name val="Times New Roman"/></font>'
            + '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Times New Roman"/></font>'
            + '<font><i/><sz val="10"/><color rgb="FF595959"/><name val="Times New Roman"/></font>';
        var fills = '<fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'
            + '<fill><patternFill patternType="solid"><fgColor rgb="FF1F3864"/><bgColor indexed="64"/></patternFill></fill>'
            + '<fill><patternFill patternType="solid"><fgColor rgb="FFD9E1F2"/><bgColor indexed="64"/></patternFill></fill>';
        var side = function (n) { return '<' + n + ' style="thin"><color rgb="FF808080"/></' + n + '>'; };
        var borders = '<border><left/><right/><top/><bottom/><diagonal/></border>'
            + '<border>' + side("left") + side("right") + side("top") + side("bottom") + '<diagonal/></border>';
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            + '<styleSheet xmlns="' + NS_MAIN + '">'
            + '<fonts count="6">' + f + '</fonts>'
            + '<fills count="4">' + fills + '</fills>'
            + '<borders count="2">' + borders + '</borders>'
            + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
            + '<cellXfs count="' + this.xfs.length + '">' + this.xfs.join("") + '</cellXfs>'
            + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
            + '</styleSheet>';
    };

    /*------------------------------------------
    --Discription: [4] Dựng 1 sheet từ mô hình chuẩn (sheet model)
    -- sheet = { name, title, subTitles[], header:[[...]], headerMerges:[[r1,c1,r2,c2]],
    --           cols:[{width,align,type,format,sum}], rows:[[...]], footer:[...], filter, freeze }
    -------------------------------------------*/
    function calcWidths(sh) {
        var n = sh.cols.length, widths = [], c, r;
        // chừa chỗ cho mũi tên bộ lọc ở ô tiêu đề để không đè lên chữ
        var pad = (sh.filter !== false && sh.rows.length > 0) ? 3 : 0;
        var spanned = {}, hm = sh.headerMerges || [];
        for (var q = 0; q < hm.length; q++) {
            if (hm[q][3] <= hm[q][1]) continue;
            for (var rr = hm[q][0]; rr <= hm[q][2]; rr++) for (var cc = hm[q][1]; cc <= hm[q][3]; cc++) spanned[rr + "," + cc] = true;
        }
        for (c = 0; c < n; c++) {
            if (sh.cols[c].width) { widths.push(sh.cols[c].width); continue; }
            var need = 0;
            for (r = 0; r < sh.header.length; r++) {
                if (spanned[r + "," + c]) continue;// ô gộp ngang (tên nhóm cột) không được làm rộng 1 cột
                // tiêu đề được phép xuống dòng nên chỉ cần đủ chỗ cho khoảng 16 ký tự
                need = Math.max(need, Math.min(longestLine(toText(sh.header[r][c])), 16));
            }
            for (r = 0; r < sh.rows.length; r++) {
                var len = longestLine(toText(sh.rows[r][c]));
                if (len > need) need = len;
            }
            widths.push(Math.max(6, Math.min(50, Math.round(need * 1.1 + 2 + pad))));
        }
        // Bảng ít cột mà tiêu đề dài: giãn các cột tự tính độ rộng cho đủ chỗ tiêu đề (tối đa 70) thay vì để tiêu đề bị xuống nhiều dòng
        var total = 0, flex = 0;
        for (c = 0; c < n; c++) { total += widths[c]; if (!sh.cols[c].width) flex += widths[c]; }
        var titleNeed = sh.title ? Math.min(70, Math.ceil(longestLine(sh.title) * 2.2)) : 0;
        if (total < titleNeed && flex > 0) {
            var scale = 1 + (titleNeed - total) / flex;
            for (c = 0; c < n; c++) if (!sh.cols[c].width) widths[c] = Math.round(widths[c] * scale);
        }
        return widths;
    }

    // Kế hoạch dựng 1 sheet gồm 3 bước để chạy được theo từng lô: doRows(từ, đến) dựng các dòng dữ liệu, finishParts() dựng phần còn lại
    // và trả { head, rows[], tail } (XML = head + rows.join("") + tail). buildSheet() chạy 1 mạch cho các nơi gọi đồng bộ.
    function sheetPlan(sh, styles, sheetIndex) {
        var n = sh.cols.length, widths = calcWidths(sh), totalWidth = 0, rows = [], merges = [], r = 0, c, i;
        for (c = 0; c < n; c++) totalWidth += widths[c];
        var lastCol = n - 1;
        var sTitle = styles.get({ font: "title", align: "center", valign: "center", wrap: true });
        var sSub = styles.get({ font: "italic", align: "center", valign: "center", wrap: true });
        var sHead = styles.get({ font: "head", fill: "head", border: true, align: "center", valign: "center", wrap: true });
        var sNote = styles.get({ font: "note", align: "left", valign: "center" });

        function addRow(cells, ht) {
            var x = '<row r="' + (r + 1) + '"' + (ht ? ' ht="' + ht + '" customHeight="1"' : '') + '>' + cells + '</row>';
            rows.push(x);
            r++;
        }
        function strCell(rr, cc, v, s) {
            var t = toText(v);
            if (t === "") return '<c r="' + ref(rr, cc) + '" s="' + s + '"/>';
            return '<c r="' + ref(rr, cc) + '" s="' + s + '" t="inlineStr"><is><t xml:space="preserve">' + esc(t) + '</t></is></c>';
        }
        function mergedLine(text, style, charsPerLine, baseHt) {
            var cells = strCell(r, 0, text, style);
            for (c = 1; c < n; c++) cells += '<c r="' + ref(r, c) + '" s="' + style + '"/>';
            if (n > 1) merges.push(ref(r, 0) + ":" + ref(r, lastCol));
            var lines = Math.max(1, Math.ceil(longestLine(text) / Math.max(10, charsPerLine)));
            addRow(cells, baseHt * lines + (baseHt > 20 ? 6 : 0));
        }

        // Tiêu đề + các dòng điều kiện lọc
        if (sh.title) mergedLine(sh.title, sTitle, totalWidth / 2.2, 24);
        var subs = sh.subTitles || [];
        for (i = 0; i < subs.length; i++) if (toText(subs[i]) !== "") mergedLine(subs[i], sSub, totalWidth * 1.05, 16);
        if (r > 0) addRow("", 8);

        // Tiêu đề cột (có thể nhiều dòng, có gộp ô)
        var headStart = r, spanW = {};
        for (i = 0; i < (sh.headerMerges || []).length; i++) {
            var hmg = sh.headerMerges[i], tw = 0;
            if (hmg[3] <= hmg[1]) continue;
            for (c = hmg[1]; c <= hmg[3]; c++) tw += widths[c];
            spanW[hmg[0] + "," + hmg[1]] = tw;
        }
        for (i = 0; i < sh.header.length; i++) {
            var hcells = "", maxLines = 1;
            for (c = 0; c < n; c++) {
                hcells += strCell(r, c, sh.header[i][c], sHead);
                var wCap = Math.max(6, (spanW[i + "," + c] || widths[c]) - 1);
                maxLines = Math.max(maxLines, Math.ceil(longestLine(toText(sh.header[i][c])) / wCap));
            }
            addRow(hcells, Math.max(30, 16 * maxLines + 4));
        }
        var headLast = r - 1;
        for (i = 0; i < (sh.headerMerges || []).length; i++) {
            var m = sh.headerMerges[i];
            merges.push(ref(headStart + m[0], m[1]) + ":" + ref(headStart + m[2], m[3]));
        }

        // Dữ liệu
        var dataStart = r, styleCache = {};
        function dataStyle(col) {
            var k = col.align + "|" + col.type + "|" + col.format;
            if (!styleCache[k]) {
                styleCache[k] = styles.get({
                    font: "normal", border: true, align: col.align, valign: "center", wrap: true,
                    fmt: col.type === "number" ? (col.format || "general") : "general"
                });
            }
            return styleCache[k];
        }
        var sums = [], hasSum = false;
        for (c = 0; c < n; c++) { sums.push(0); if (sh.cols[c].sum) hasSum = true; }
        function doRows(from, to) {
            for (var i = from; i < to; i++) {
                var cells = "", row = sh.rows[i];
                for (var c = 0; c < n; c++) {
                    var col = sh.cols[c], v = row[c], st = dataStyle(col);
                    if (col.type === "number") {
                        var num = toNumber(v);
                        if (num !== null) {
                            cells += '<c r="' + ref(r, c) + '" s="' + st + '"><v>' + num + '</v></c>';
                            if (col.sum) sums[c] += num;
                            continue;
                        }
                    }
                    cells += strCell(r, c, v, st);
                }
                addRow(cells);
            }
        }
        function finishParts() {
            var dataLast = r - 1;

            // Dòng Tổng
            if (hasSum && sh.rows.length > 0) {
                var firstSum = -1;
                for (c = 0; c < n; c++) if (sh.cols[c].sum) { firstSum = c; break; }
                var sLabel = styles.get({ font: "bold", fill: "sum", border: true, align: "center", valign: "center" });
                var sBlank = styles.get({ font: "bold", fill: "sum", border: true });
                var scells = "";
                for (c = 0; c < n; c++) {
                    if (c === 0) { scells += strCell(r, c, "Tổng", sLabel); continue; }
                    if (sh.cols[c].sum) {
                        var sn = styles.get({ font: "bold", fill: "sum", border: true, align: "right", valign: "center", fmt: sh.cols[c].format || "general" });
                        scells += '<c r="' + ref(r, c) + '" s="' + sn + '"><f>SUM(' + ref(dataStart, c) + ':' + ref(dataLast, c) + ')</f><v>' + sums[c] + '</v></c>';
                    } else {
                        scells += '<c r="' + ref(r, c) + '" s="' + sBlank + '"/>';
                    }
                }
                if (firstSum > 1) merges.push(ref(r, 0) + ":" + ref(r, firstSum - 1));
                addRow(scells, 20);
            }

            // Chân file: số bản ghi, ngày xuất, người xuất
            var foot = sh.footer || [];
            if (foot.length > 0) {
                addRow("", 8);
                for (i = 0; i < foot.length; i++) addRow(strCell(r, 0, foot[i], sNote));
            }

            // Ghép XML sheet (thứ tự phần tử theo chuẩn OOXML)
            var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                + '<worksheet xmlns="' + NS_MAIN + '" xmlns:r="' + NS_REL + '">'
                + '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>'
                + '<dimension ref="A1:' + ref(Math.max(r - 1, 0), Math.max(lastCol, 0)) + '"/>'
                + '<sheetViews><sheetView workbookViewId="0" showGridLines="0"' + (sheetIndex === 0 ? ' tabSelected="1"' : '') + '>';
            if (sh.freeze !== false && headLast >= 0) {
                xml += '<pane ySplit="' + (headLast + 1) + '" topLeftCell="A' + (headLast + 2) + '" activePane="bottomLeft" state="frozen"/>'
                    + '<selection pane="bottomLeft" activeCell="A' + (headLast + 2) + '" sqref="A' + (headLast + 2) + '"/>';
            }
            xml += '</sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>';
            for (c = 0; c < n; c++) xml += '<col min="' + (c + 1) + '" max="' + (c + 1) + '" width="' + widths[c] + '" customWidth="1"/>';
            xml += '</cols><sheetData>';
            var head = xml;
            xml = '</sheetData>';
            if (sh.filter !== false && sh.rows.length > 0) {
                xml += '<autoFilter ref="' + ref(headLast, 0) + ':' + ref(dataLast, lastCol) + '"/>';
            }
            if (merges.length > 0) {
                xml += '<mergeCells count="' + merges.length + '">';
                for (i = 0; i < merges.length; i++) xml += '<mergeCell ref="' + merges[i] + '"/>';
                xml += '</mergeCells>';
            }
            xml += '<pageMargins left="0.4" right="0.4" top="0.6" bottom="0.6" header="0.3" footer="0.3"/>'
                + '<pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/>'
                + '<headerFooter><oddFooter>&amp;CTrang &amp;P / &amp;N</oddFooter></headerFooter>';
            // Mã số/CCCD... cố ý lưu dạng chữ: tắt tam giác xanh cảnh báo "số lưu dạng chữ" của Excel
            if (sh.rows.length > 0) {
                xml += '<ignoredErrors><ignoredError sqref="' + ref(dataStart, 0) + ':' + ref(dataLast, lastCol) + '" numberStoredAsText="1"/></ignoredErrors>';
            }
            xml += '</worksheet>';
            return { head: head, rows: rows, tail: xml, headStart: headStart, headLast: headLast };
        }
        return { n: sh.rows.length, doRows: doRows, finishParts: finishParts };
    }
    function buildSheet(sh, styles, sheetIndex) {
        var plan = sheetPlan(sh, styles, sheetIndex);
        plan.doRows(0, plan.n);
        var x = plan.finishParts();
        return { xml: x.head + x.rows.join("") + x.tail, headStart: x.headStart, headLast: x.headLast };
    }

    function safeSheetName(name, idx, used) {
        var s = toText(name).replace(/[\[\]:*?\/\\]/g, " ").replace(/\s+/g, " ").trim();
        if (s === "") s = "Sheet" + (idx + 1);
        s = s.substring(0, 31);
        var base = s, k = 2;
        while (used[s.toLowerCase()]) {
            var suffix = " (" + k++ + ")";
            s = base.substring(0, 31 - suffix.length) + suffix;
        }
        used[s.toLowerCase()] = true;
        return s;
    }

    // Nén deflate-raw bằng CompressionStream có sẵn trong trình duyệt (Promise<Uint8Array>)
    // Đưa dữ liệu vào bộ nén từng mẩu 512KB, giữa 2 mẩu nhường luồng cho trình duyệt: nén nguyên 1 khối hàng chục MB là 1 lượt chạy liền,
    // máy yếu đứng vài giây
    function deflateRaw(bytes) {
        var CHUNK_BYTES = 524288, at = 0;
        var source = new ReadableStream({
            pull: function (controller) {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        if (at >= bytes.length) controller.close();
                        else { controller.enqueue(bytes.subarray(at, Math.min(bytes.length, at + CHUNK_BYTES))); at += CHUNK_BYTES; }
                        resolve();
                    }, 0);
                });
            }
        });
        return new Response(source.pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer().then(function (b) { return new Uint8Array(b); });
    }

    // Dựng danh sách file XML bên trong .xlsx. sheets: mảng sheet model
    function buildFiles(sheets) {
        var styles = new Styles(), used = {}, built = [], i;
        for (i = 0; i < sheets.length; i++) {
            sheets[i].name = safeSheetName(sheets[i].name, i, used);
            built.push(buildSheet(sheets[i], styles, i));
        }
        return assembleFiles(sheets, built, styles, function (k) { return { bytes: utf8(built[k].xml) }; });
    }

    // Như buildFiles nhưng chạy theo lô, nhường luồng cho trình duyệt giữa các lô (xem sliceRun); onProgress(0..1)
    function buildFilesCoop(sheets, onProgress) {
        var styles = new Styles(), used = {}, built = [], encoded = [], chain = Promise.resolve(), total = 0, done = 0;
        sheets.forEach(function (sh) { total += sh.rows.length; });
        function tick(f) { if (onProgress) onProgress(Math.min(1, f)); }
        sheets.forEach(function (sh, i) {
            chain = chain.then(function () {
                sh.name = safeSheetName(sh.name, i, used);
                var plan = sheetPlan(sh, styles, i), base = done;
                return sliceRun(plan.n, plan.doRows, function (a) { tick((base + a * 0.6) / (total || 1)); }).then(function () {
                    built[i] = plan.finishParts();
                    return encodeCoop(built[i], function (f) { tick((base + plan.n * (0.6 + 0.4 * f)) / (total || 1)); });
                }).then(function (enc) { encoded[i] = enc; done += plan.n; });
            });
        });
        return chain.then(function () { return assembleFiles(sheets, built, styles, function (k) { return encoded[k]; }); });
    }
    // XML 1 sheet (đã tách head / các dòng / tail) -> byte UTF-8 + CRC32, mỗi lô vài trăm dòng; Promise<{ bytes, crc }>
    function encodeCoop(p, onProgress) {
        var chunks = [utf8(p.head)], total = chunks[0].length;
        return sliceRun(p.rows.length, function (a, b) {
            var u = utf8(p.rows.slice(a, b).join(""));
            chunks.push(u);
            total += u.length;
        }, function (a, n) { if (onProgress) onProgress(0.7 * a / (n || 1)); }).then(function () {
            var t = utf8(p.tail);
            chunks.push(t);
            total += t.length;
            var bytes = concatBytes(chunks, total), crc = 0xFFFFFFFF;
            return sliceRun(bytes.length, function (a, b) { crc = crcUpdate(crc, bytes, a, b); }, function (a, n) {
                if (onProgress) onProgress(0.7 + 0.3 * a / (n || 1));
            }, 262144).then(function () { return { bytes: bytes, crc: (crc ^ 0xFFFFFFFF) >>> 0 }; });
        });
    }

    // Ghép các file của .xlsx. encOf(i) = { bytes, crc? } của file XML sheet thứ i
    function assembleFiles(sheets, built, styles, encOf) {
        var files = [], i;
        var ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            + '<Default Extension="xml" ContentType="application/xml"/>'
            + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
        var wbSheets = "", wbRels = "", defNames = "";
        for (i = 0; i < sheets.length; i++) {
            ct += '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
            wbSheets += '<sheet name="' + esc(sheets[i].name) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>';
            wbRels += '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>';
            // In nhiều trang thì lặp lại các dòng tiêu đề cột
            if (built[i].headLast >= 0) {
                defNames += '<definedName name="_xlnm.Print_Titles" localSheetId="' + i + '">\'' + esc(sheets[i].name.replace(/'/g, "''")) + '\'!$'
                    + (built[i].headStart + 1) + ':$' + (built[i].headLast + 1) + '</definedName>';
            }
            var enc = encOf(i);
            files.push({ name: "xl/worksheets/sheet" + (i + 1) + ".xml", data: enc.bytes, crc: enc.crc });
        }
        wbRels += '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>';
        ct += '</Types>';
        files.unshift(
            { name: "[Content_Types].xml", data: utf8(ct) },
            {
                name: "_rels/.rels", data: utf8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                    + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                    + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
                    + '</Relationships>')
            },
            {
                name: "xl/workbook.xml", data: utf8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                    + '<workbook xmlns="' + NS_MAIN + '" xmlns:r="' + NS_REL + '">'
                    + '<bookViews><workbookView xWindow="0" yWindow="0" windowWidth="24000" windowHeight="12000"/></bookViews>'
                    + '<sheets>' + wbSheets + '</sheets>'
                    + (defNames ? '<definedNames>' + defNames + '</definedNames>' : '')
                    + '<calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>')
            },
            {
                name: "xl/_rels/workbook.xml.rels", data: utf8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                    + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + wbRels + '</Relationships>')
            },
            { name: "xl/styles.xml", data: utf8(styles.toXml()) }
        );
        return files;
    }

    /*------------------------------------------
    --Discription: [5] Chuyển nguồn dữ liệu -> sheet model
    -------------------------------------------*/
    function currentUser(opts) {
        if (opts.user !== undefined) return opts.user;
        try { if (root.$) return root.$("#lblHoTenNguoiDung").text().replace(/\s+/g, " ").trim(); } catch (e) { }
        return "";
    }
    function buildFooter(opts, iRows) {
        if (opts.footer === false) return [];
        var out = ["Tổng số bản ghi: " + iRows];
        var user = currentUser(opts);
        out.push("Ngày xuất: " + fmtDateTime(new Date()) + (user ? " - Người xuất: " + user : ""));
        return out;
    }
    function subTitlesOf(opts) {
        var s = typeof opts.subTitles === "function" ? opts.subTitles() : opts.subTitles;
        return s ? [].concat(s) : [];
    }

    // Dùng lại aoColumns của bảng: tiêu đề lấy từ <th>, giá trị lấy theo mDataProp/mRender như khi vẽ bảng
    function columnsFromTable(strTable_Id, aoColumns, colOptions) {
        var ths = [];
        if (root.$) {
            var trs = root.$("#" + strTable_Id + " thead tr");
            if (trs.length > 0) ths = root.$(trs[trs.length - 1]).children("th,td").map(function () { return root.$(this).text().replace(/\s+/g, " ").trim(); }).get();
        }
        var offset = ths.length === aoColumns.length + 1 ? 1 : 0;
        var defs = [];
        for (var j = 0; j < aoColumns.length; j++) {
            (function (ao) {
                var d = { header: ths[j + offset] !== undefined ? ths[j + offset] : "Cột " + (j + 1) };
                if (ao.mDataProp) d.field = ao.mDataProp;
                else if (typeof ao.mRender === "function") d.render = function (row, i) { return htmlToText(ao.mRender(i, row)); };
                var o = colOptions && colOptions[j];
                if (o) for (var k in o) d[k] = o[k];
                defs.push(d);
            })(aoColumns[j]);
        }
        return defs;
    }

    // Kế hoạch đổi mảng dữ liệu thành sheet model, chạy được theo lô: fill(từ, đến) đổi các dòng dữ liệu, done() ghép tiêu đề + chân file
    function fromDataPlan(opts) {
        var defs = opts.columns || (opts.aoColumns ? columnsFromTable(opts.table, opts.aoColumns, opts.colOptions) : []);
        var data = opts.data || [], useStt = opts.stt !== false;
        var cols = [], head = [], rows = [], i, j;
        if (useStt) {
            cols.push({ type: "number", format: "int", align: "center", width: opts.filter === false ? 6 : 9 });
            head.push(opts.sttHeader || "STT");
        }
        for (j = 0; j < defs.length; j++) {
            var d = defs[j], type = d.type === "number" ? "number" : "text";
            cols.push({
                type: type, format: d.format, width: d.width, sum: !!d.sum,
                align: d.align || (type === "number" ? "right" : "left")
            });
            head.push(d.header);
        }
        function fill(from, to) {
            for (var i = from; i < to; i++) {
                var r = [];
                if (useStt) r.push(i + 1);
                for (var j = 0; j < defs.length; j++) {
                    var def = defs[j], v;
                    if (typeof def.render === "function") v = def.render(data[i], i);
                    else if (def.field) v = data[i][def.field];
                    else v = "";
                    if (def.html) v = htmlToText(v);
                    r.push(v);
                }
                rows.push(r);
            }
        }
        function done() {
            // Cột có group: thêm 1 dòng tiêu đề nhóm ("Thông tin sinh viên", "Thông tin đăng ký"...) gộp ngang các cột liên tiếp cùng nhóm;
            // cột không thuộc nhóm nào gộp dọc 2 dòng như cột STT
            var header = [head], merges = [], hasGroup = false;
            for (j = 0; j < defs.length; j++) if (defs[j].group) hasGroup = true;
            if (hasGroup) {
                var off = useStt ? 1 : 0, g0 = [], g1 = [];
                if (useStt) { g0.push(head[0]); g1.push(""); merges.push([0, 0, 1, 0]); }
                for (j = 0; j < defs.length; j++) {
                    if (defs[j].group) {
                        g0.push((j === 0 || defs[j - 1].group !== defs[j].group) ? defs[j].group : "");
                        g1.push(defs[j].header);
                    } else {
                        g0.push(defs[j].header);
                        g1.push("");
                        merges.push([0, off + j, 1, off + j]);
                    }
                }
                for (j = 0; j < defs.length;) {
                    if (!defs[j].group) { j++; continue; }
                    var kEnd = j;
                    while (kEnd + 1 < defs.length && defs[kEnd + 1].group === defs[j].group) kEnd++;
                    if (kEnd > j) merges.push([0, off + j, 0, off + kEnd]);
                    j = kEnd + 1;
                }
                header = [g0, g1];
            }
            return {
                name: opts.name, title: opts.title, subTitles: subTitlesOf(opts),
                header: header, headerMerges: merges, cols: cols, rows: rows,
                footer: buildFooter(opts, rows.length), filter: opts.filter, freeze: opts.freeze
            };
        }
        return { n: data.length, fill: fill, done: done };
    }
    function fromData(opts) {
        var plan = fromDataPlan(opts);
        plan.fill(0, plan.n);
        return plan.done();
    }

    function cellText(td) {
        var $td = root.$(td), parts = [];
        $td.find("select").each(function () { var o = root.$(this).find("option:selected"); if (root.$(this).val()) parts.push(o.text()); });
        $td.find("input:not([type=checkbox]):not([type=radio]),textarea").each(function () { parts.push(root.$(this).val()); });
        if (parts.length > 0) return parts.join("; ");
        return (td.innerText || td.textContent || "").replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").trim();
    }

    // Đọc bảng đang hiển thị: tiêu đề nhiều dòng + colspan/rowspan -> lưới + danh sách ô gộp
    function fromDom(opts) {
        var tbl = document.getElementById(opts.table);
        if (!tbl) throw new Error("Không tìm thấy bảng: " + opts.table);
        var grid = [], merges = [], occ = {}, ncols = 0, r, c, k, l;
        var trs = tbl.tHead ? tbl.tHead.rows : [];
        for (r = 0; r < trs.length; r++) {
            grid[r] = grid[r] || [];
            c = 0;
            for (k = 0; k < trs[r].cells.length; k++) {
                var cell = trs[r].cells[k];
                if (cell.style.display === "none" || /tdhidden/.test(cell.className)) continue;
                while (occ[r + "," + c]) c++;
                var rs = Math.max(1, cell.rowSpan), cs = Math.max(1, cell.colSpan);
                grid[r][c] = cellText(cell);
                for (var a = 0; a < rs; a++) {
                    for (var b = 0; b < cs; b++) {
                        occ[(r + a) + "," + (c + b)] = true;
                        if (a || b) { grid[r + a] = grid[r + a] || []; grid[r + a][c + b] = ""; }
                    }
                }
                if (rs > 1 || cs > 1) merges.push([r, c, r + rs - 1, c + cs - 1]);
                c += cs;
                if (c > ncols) ncols = c;
            }
        }
        if (ncols === 0 && tbl.tBodies.length > 0 && tbl.tBodies[0].rows.length > 0) ncols = tbl.tBodies[0].rows[0].cells.length;
        for (r = 0; r < grid.length; r++) for (c = 0; c < ncols; c++) if (grid[r][c] === undefined) grid[r][c] = "";

        var opt = opts.colOptions || {}, cols = [];
        for (c = 0; c < ncols; c++) {
            var o = opt[c] || {}, type = o.type === "number" ? "number" : "text";
            var isStt = grid.length > 0 && /^stt$/i.test(toText(grid[grid.length - 1][c]));
            cols.push({
                type: type, format: o.format, width: o.width || (isStt ? 6 : undefined), sum: !!o.sum,
                align: o.align || (isStt ? "center" : (type === "number" ? "right" : "left"))
            });
        }
        var rows = [];
        for (k = 0; k < tbl.tBodies.length; k++) {
            for (r = 0; r < tbl.tBodies[k].rows.length; r++) {
                var tr = tbl.tBodies[k].rows[r];
                if (tr.cells.length === 1 && tr.cells[0].colSpan > 1) continue;//dòng "Không tìm thấy dữ liệu"
                var row = [];
                for (l = 0; l < tr.cells.length && row.length < ncols; l++) {
                    row.push(cellText(tr.cells[l]));
                    for (var p = 1; p < tr.cells[l].colSpan && row.length < ncols; p++) row.push("");
                }
                while (row.length < ncols) row.push("");
                rows.push(row);
            }
        }
        // Cột không có tiêu đề và mọi ô đều trống (ô tick chọn dòng, cột nút thao tác): không đưa vào file
        if (merges.length === 0 && rows.length > 0 && grid.length > 0) {
            var keep = [];
            for (c = 0; c < ncols; c++) {
                var used = toText(grid[grid.length - 1][c]) !== "";
                for (r = 0; r < rows.length && !used; r++) if (toText(rows[r][c]) !== "") used = true;
                if (used) keep.push(c);
            }
            if (keep.length > 0 && keep.length < ncols) {
                grid = grid.map(function (g) { return keep.map(function (i) { return g[i]; }); });
                cols = keep.map(function (i) { return cols[i]; });
                rows = rows.map(function (rw) { return keep.map(function (i) { return rw[i]; }); });
                ncols = keep.length;
            }
        }
        return {
            name: opts.name, title: opts.title, subTitles: subTitlesOf(opts),
            header: grid, headerMerges: merges, cols: cols, rows: rows,
            footer: buildFooter(opts, rows.length), filter: opts.filter, freeze: opts.freeze
        };
    }

    function toModel(spec) {
        if (spec.data || spec.columns || spec.aoColumns) return fromData(spec);
        if (spec.table) return fromDom(spec);
        throw new Error("Thiếu nguồn dữ liệu để xuất (cần data + columns, hoặc table).");
    }

    function download(bytes, fileName) {
        var blob = new Blob([bytes], { type: XLSX_MIME });
        if (root.navigator && root.navigator.msSaveOrOpenBlob) {
            root.navigator.msSaveOrOpenBlob(blob, fileName);
            return;
        }
        var url = root.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { root.URL.revokeObjectURL(url); document.body.removeChild(a); }, 1000);
    }

    function warn(msg) {
        var edu = root.edu;
        if (edu && edu.system && typeof edu.system.alert === "function") edu.system.alert(msg, "w");
        else if (root.console) root.console.log(msg);
    }

    /*------------------------------------------
    --Discription: [7] Hộp thoại hỏi trước khi xuất + lọc thêm khi xuất
    -- Mỗi bộ lọc là 1 danh sách tích chọn nhiều giá trị, có ô tìm kiếm; không tích gì = lấy tất cả.
    -- Trong 1 bộ lọc các giá trị tích là "hoặc"; giữa các bộ lọc và ô từ khóa là "và".
    -------------------------------------------*/
    var ASK_TEXT = "Bạn có muốn xuất dữ liệu ra file Excel không?";
    function fmtInt(n) { return Number(n).toLocaleString("vi-VN"); }
    var COLLATOR = null;
    try { if (root.Intl && root.Intl.Collator) COLLATOR = new root.Intl.Collator("vi", { numeric: true }); } catch (ex) { COLLATOR = null; }
    // Bỏ dấu + chữ thường để gõ "dien" tìm ra "Điện"
    function fold(s) {
        return toText(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
    }
    // Tên (chữ hiển thị) các mục đang chọn của 1 ô chọn trên màn hình; bỏ mục tiêu đề "-- Chọn ... --" và "Tất cả"
    function selectedTexts(id) {
        var out = [];
        if (!root.$) return out;
        root.$("#" + id + " option:selected").each(function () {
            var v = root.$(this).val(), t = root.$(this).text().replace(/\s+/g, " ").trim();
            if (v && v !== "SELECTALL" && t) out.push(t);
        });
        return out;
    }
    // Các giá trị cần tích sẵn của 1 bộ lọc: def.selected (tên đã chụp lúc tìm kiếm) và/hoặc def.from (id ô chọn ngoài màn hình, đọc ngay lúc mở)
    function presetOf(def) {
        var names = [].concat(def.selected || []), out = [], i;
        if (def.from) {
            var ids = [].concat(def.from);
            for (i = 0; i < ids.length; i++) names = names.concat(selectedTexts(ids[i]));
        }
        for (i = 0; i < names.length; i++) {
            var t = fold(toText(names[i]).replace(/\s+/g, " ").trim());
            if (t) out.push(t);
        }
        return out;
    }
    // Chuỗi để tìm theo từ khóa của từng dòng = các ô hiển thị trong file (bỏ cột STT)
    function haystackOf(spec) {
        try {
            var model = fromData(spec), out = [], start = spec.stt === false ? 0 : 1;
            for (var r = 0; r < model.rows.length; r++) {
                var parts = [];
                for (var c = start; c < model.rows[r].length; c++) {
                    var v = model.rows[r][c];
                    if (v !== "" && v !== null && v !== undefined) parts.push(v);
                }
                out.push(fold(parts.join(" ")));
            }
            return out;
        } catch (ex) { return null; }
    }

    function ensureHay(g, spec) {
        if (g.hayDone) return;
        g.hayDone = true;
        g.hay = haystackOf(spec);
    }

    // Mỗi sheet có filters + data -> 1 nhóm; mỗi bộ lọc giữ sẵn giá trị chuẩn hóa của từng dòng để đếm nhanh.
    // Trả { groups, tasks }: mỗi task dựng 1 bộ lọc (duyệt hết các dòng), chạy lần lượt theo thứ tự là xong; người gọi chạy từng task
    // bằng sliceRun để nhường luồng cho trình duyệt giữa các bộ lọc.
    function filterGroupsPlan(specs) {
        var groups = [], tasks = [];
        for (var s = 0; s < specs.length; s++) {
            var spec = specs[s];
            if (!spec.data || !spec.filters || spec.filters.length === 0) continue;
            var g = { spec: s, name: spec.name || "", total: spec.data.length, items: [], kw: "", tokens: [], hay: null };
            groups.push(g);
            for (var f = 0; f < spec.filters.length; f++) tasks.push(filterItemTask(g, spec, spec.filters[f]));
        }
        return { groups: groups, tasks: tasks };
    }
    function filterItemTask(g, spec, def) {
        return function () {
            var vals = [], counts = Object.create(null), keys = [];
            for (var r = 0; r < spec.data.length; r++) {
                var raw = typeof def.get === "function" ? def.get(spec.data[r]) : spec.data[r][def.field];
                var t = toText(raw).replace(/\s+/g, " ").trim();
                vals.push(t);
                if (counts[t] === undefined) { counts[t] = 0; keys.push(t); }
                counts[t]++;
            }
            if (keys.length === 0) return;
            // 1 bộ so sánh dùng cho cả lần sắp xếp (localeCompare tự dựng bộ so sánh MỖI lần gọi: 8 nghìn người thu mất vài trăm ms)
            keys.sort(COLLATOR ? COLLATOR.compare : function (a, b) { return a.localeCompare(b, "vi", { numeric: true }); });
            // Mặc định theo bộ lọc đã chọn ngoài màn hình tìm kiếm (khớp không phân biệt hoa/thường, dấu):
            // chọn gì ngoài thì tích sẵn đúng cái đó; không chọn gì thì để trống (= xuất tất cả). Mọi bộ lọc cùng 1 quy tắc.
            var want = presetOf(def), sel = Object.create(null), defSel = Object.create(null), nSel = 0, order = [], rest = [];
            for (var q = 0; q < keys.length; q++) {
                if (want.length > 0 && want.indexOf(fold(keys[q])) >= 0) { sel[keys[q]] = true; defSel[keys[q]] = true; nSel++; order.push(q); }
                else rest.push(q);
            }
            // Danh sách dài chỉ vẽ từng lô khi cuộn nên các mục đã tích sẵn được xếp lên đầu để luôn nhìn thấy
            g.items.push({ label: def.label || def.field || "", vals: vals, keys: keys, counts: counts, selected: sel, nSel: nSel, def: defSel, defN: nSel, order: order.concat(rest) });
        };
    }
    function rowMatches(g, r) {
        var i;
        for (i = 0; i < g.items.length; i++) {
            if (g.items[i].nSel > 0 && !g.items[i].selected[g.items[i].vals[r]]) return false;
        }
        if (g.tokens.length > 0) {
            var h = g.hay ? g.hay[r] : "";
            for (i = 0; i < g.tokens.length; i++) if (h.indexOf(g.tokens[i]) < 0) return false;
        }
        return true;
    }
    function countOf(g) {
        var n = 0;
        for (var r = 0; r < g.total; r++) if (rowMatches(g, r)) n++;
        return n;
    }
    // "Có lọc thêm" = số dòng thật sự xuất ít hơn dữ liệu đang xem. Tích đúng những gì đã chọn ngoài màn hình
    // (dữ liệu vốn đã như vậy) thì không tính là lọc thêm.
    function isFiltered(groups) {
        for (var i = 0; i < groups.length; i++) if (countOf(groups[i]) < groups[i].total) return true;
        return false;
    }
    // Lựa chọn của 1 bộ lọc có khác mặc định (theo màn hình tìm kiếm) không
    function itemChanged(it) {
        if (it.nSel !== it.defN) return true;
        for (var k in it.selected) if (!it.def[k]) return true;
        return false;
    }
    function isChanged(groups) {
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].tokens.length > 0) return true;
            for (var j = 0; j < groups[i].items.length; j++) if (itemChanged(groups[i].items[j])) return true;
        }
        return false;
    }
    function copySel(m) {
        var o = Object.create(null);
        for (var k in m) o[k] = true;
        return o;
    }
    // Áp các lựa chọn lọc lên bản sao của opts (không sửa opts gốc của trang)
    function filteredOpts(opts, groups) {
        var active = isFiltered(groups), bySpec = {}, i, k;
        for (i = 0; i < groups.length; i++) bySpec[groups[i].spec] = groups[i];
        var specs = opts.sheets || [opts], out = [];
        for (i = 0; i < specs.length; i++) {
            var spec = specs[i], g = bySpec[i];
            if (active && spec.skipWhenFiltered) continue;
            var copy = {};
            for (k in spec) copy[k] = spec[k];
            if (g && active) {
                var rows = [], desc = [], changed = [], ticked = [], use, j, it, names;
                for (var r = 0; r < spec.data.length; r++) if (rowMatches(g, r)) rows.push(spec.data[r]);
                // Chỉ ghi vào file các bộ lọc người dùng đã đổi so với mặc định (mặc định đã có ở dòng điều kiện tìm kiếm)
                for (j = 0; j < g.items.length; j++) {
                    if (g.items[j].nSel === 0) continue;
                    ticked.push(g.items[j]);
                    if (itemChanged(g.items[j])) changed.push(g.items[j]);
                }
                use = (changed.length > 0 || g.tokens.length > 0) ? changed : ticked;
                for (j = 0; j < use.length; j++) {
                    it = use[j];
                    names = [];
                    for (k = 0; k < it.keys.length; k++) if (it.selected[it.keys[k]]) names.push(it.keys[k] || "(Trống)");
                    desc.push(it.label + " = " + (names.length > 6 ? names.slice(0, 6).join(", ") + " ... (+" + (names.length - 6) + ")" : names.join(", ")));
                }
                if (g.tokens.length > 0) desc.push('Từ khóa = "' + g.kw.trim() + '"');
                copy.data = rows;
                // ghi lại vào file để người đọc biết đây là bản đã lọc
                copy.subTitles = subTitlesOf(spec).concat(["Lọc thêm khi xuất: " + desc.join("; ")]);
            }
            out.push(copy);
        }
        if (!opts.sheets) return out[0];
        var top = {};
        for (k in opts) top[k] = opts[k];
        top.sheets = out;
        return top;
    }

    var ASK_CSS = '#modalEduExporter .modal-dialog{width:1040px !important;max-width:96% !important}'
        + '#modalEduExporter .modal-body{padding:20px 24px !important;max-height:calc(100vh - 190px);overflow-y:auto}'
        + '#modalEduExporter .ee-ask{display:flex;align-items:center;gap:12px;margin:0 0 16px;font-size:18px;font-weight:700;color:#1f3864}'
        + '#modalEduExporter .ee-ask i{color:#217346;font-size:28px}'
        + '#modalEduExporter .ee-cond{margin-bottom:18px;padding:10px 16px;border-left:4px solid #223771;border-radius:6px;background:#f1f5fb}'
        + '#modalEduExporter .ee-cap{font-size:12px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:#64748b}'
        + '#modalEduExporter .ee-cap small{margin-left:8px;font-size:12px;font-weight:500;letter-spacing:0;text-transform:none}'
        + '#modalEduExporter .ee-line{margin-top:3px;line-height:1.55;color:#0f172a}'
        + '#modalEduExporter .ee-sec{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}'
        + '#modalEduExporter .ee-link{cursor:pointer;font-size:13px;font-weight:600;color:#223771}'
        + '#modalEduExporter .ee-link:hover{text-decoration:underline}'
        + '#modalEduExporter .ee-search{position:relative}'
        + '#modalEduExporter .ee-search i{position:absolute;top:50%;left:12px;transform:translateY(-50%);color:#94a3b8}'
        + '#modalEduExporter .ee-search input{width:100%;height:38px;padding:6px 12px 6px 34px;border:1px solid #cbd5e1;border-radius:6px;background:#fff;font-size:14px;color:#0f172a}'
        + '#modalEduExporter .ee-search input:focus{border-color:#223771;outline:none;box-shadow:0 0 0 3px rgba(34,55,113,.12)}'
        + '#modalEduExporter .ee-kw{margin-bottom:14px}'
        + '#modalEduExporter .ee-kw input{height:42px;font-size:15px}'
        + '#modalEduExporter .ee-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:18px}'
        + '@media (max-width:767px){#modalEduExporter .ee-grid{grid-template-columns:minmax(0,1fr) !important}}'
        + '#modalEduExporter .ee-card{overflow:hidden;border:1px solid #e2e8f0;border-radius:8px;background:#fff}'
        + '#modalEduExporter .ee-card.pre{border-color:#223771;box-shadow:0 0 0 1px #223771 inset}'
        + '#modalEduExporter .ee-card-h{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-bottom:1px solid #e2e8f0;background:#f8fafc}'
        + '#modalEduExporter .ee-card-h{gap:14px}'
        + '#modalEduExporter .ee-card-h > span:first-child{min-width:0;white-space:nowrap}'
        + '#modalEduExporter .ee-acts{flex:0 0 auto;white-space:nowrap}'
        + '#modalEduExporter .ee-dot{margin:0 7px;color:#94a3b8}'
        + '#modalEduExporter .ee-card-t{font-weight:700;color:#0f172a}'
        + '#modalEduExporter .ee-badge{display:none;min-width:22px;margin-left:8px;padding:0 8px;border-radius:10px;background:#223771;font-size:12px;font-weight:600;line-height:18px;color:#fff;text-align:center}'
        + '#modalEduExporter .ee-card-s{padding:10px 12px 4px}'
        + '#modalEduExporter .ee-list{max-height:190px;padding:4px 6px 8px;overflow-y:auto}'
        + '#modalEduExporter .ee-opt{display:flex;align-items:center;gap:8px;margin:0;padding:5px 8px;border-radius:5px;font-weight:500;color:#0f172a;cursor:pointer}'
        + '#modalEduExporter .ee-opt:hover{background:#f1f5f9}'
        + '#modalEduExporter .ee-opt.on{background:#e3ecff}'
        + '#modalEduExporter .ee-opt input{flex:0 0 auto;width:16px;height:16px;margin:0;cursor:pointer}'
        + '#modalEduExporter .ee-t{flex:1 1 auto;word-break:break-word}'
        + '#modalEduExporter .ee-n{flex:0 0 auto;padding:0 8px;border-radius:10px;background:#eef2f7;font-size:12px;line-height:18px;color:#64748b}'
        + '#modalEduExporter .ee-hide{display:none !important}'
        + '#modalEduExporter .ee-empty{display:none;padding:10px;text-align:center;color:#94a3b8}'
        + '#modalEduExporter .modal-footer{display:flex;align-items:center;justify-content:flex-end}'
        + '#modalEduExporter .ee-result{display:flex;align-items:center;gap:10px;margin-right:auto;padding:8px 16px;border:1px solid #abefc6;border-radius:8px;background:#ecfdf3;font-size:15px;line-height:1.35;color:#067647;text-align:left}'
        + '#modalEduExporter .ee-result.zero{border-color:#fecdca;background:#fef3f2;color:#b42318}'
        + '#modalEduExporter .ee-result i{font-size:20px}'
        + '#modalEduExporter .ee-result b{font-size:18px}'
        + '#modalEduExporter .ee-warn{margin:0 0 16px;padding:10px 16px;border:1px solid #fedf89;border-left:4px solid #f79009;border-radius:6px;background:#fffaeb;line-height:1.55;color:#93370d}'
        + '#modalEduExporter .ee-warn b{color:#7a2e0e}'
        + '#modalEduExporter .ee-note{display:none;margin:0 0 12px;padding:8px 12px;border:1px solid #fedf89;border-radius:6px;background:#fffaeb;color:#b54708}'
        + '#modalEduExporter .modal-footer .btn i{margin-right:7px}'
        + '#modalEduExporter .modal-footer .btn + .btn{margin-left:12px}';

    // Thẻ "Đã nhận lệnh" dùng chung của edu.process (Corei/processrun.js); chưa nạp file đó thì bỏ qua, xuất vẫn chạy bình thường
    function ackStart(strTitle, strStep) {
        try {
            var e = root.edu;
            if (e && e.process && typeof e.process.ack === "function") return e.process.ack(strTitle, strStep);
        } catch (ex) { }
        return null;
    }
    function paintThen(fn) {
        var e = root.edu;
        if (e && e.process && typeof e.process.paintThen === "function") e.process.paintThen(fn);
        else setTimeout(fn, 0);
    }

    // CSS của hộp thoại nạp 1 lần duy nhất (ngay khi tải trang), không chèn <style> mỗi lần bấm: chèn <style> làm trình duyệt tính lại
    // kiểu dáng toàn trang, rất chậm khi sau lưng có bảng hàng nghìn dòng
    function ensureAskCss() {
        var d = root.document;
        if (!d || !d.head || d.getElementById("eduExporterCss")) return;
        var el = d.createElement("style");
        el.id = "eduExporterCss";
        el.textContent = ASK_CSS;
        d.head.appendChild(el);
    }
    ensureAskCss();

    // 1 lô dòng tích chọn của 1 bộ lọc (it.view = thứ tự đang hiển thị, it.shown = đã vẽ bao nhiêu dòng đầu)
    var CHUNK = 60;
    function optsHtml(it) {
        var h = "", end = Math.min(it.view.length, it.shown + CHUNK);
        for (var a = it.shown; a < end; a++) {
            var k = it.view[a], key = it.keys[k], bOn = !!it.selected[key];
            h += '<label class="ee-opt' + (bOn ? ' on' : '') + '" data-k="' + k + '"><input type="checkbox"' + (bOn ? ' checked' : '') + '>'
                + '<span class="ee-t">' + esc(key || "(Trống)") + '</span><span class="ee-n">' + fmtInt(it.counts[key]) + '</span></label>';
        }
        it.shown = end;
        return h;
    }

    // Hộp thoại hỏi trước khi xuất đang được dựng/đang mở: bấm thêm nút xuất lần nữa thì bỏ qua. Nếu không chặn, mỗi lần bấm dựng thêm 1 hộp thoại
    // và lớp nền mờ của hộp thoại cũ bị bỏ lại -> cả màn hình bị phủ mờ, không bấm được gì.
    var ASKING = 0;
    function isAsking() {
        if (!ASKING) return false;
        if (Date.now() - ASKING < 8000) return true;
        // Quá 8 giây mà hộp thoại không còn trong trang = đã kẹt cờ (lỗi giữa chừng) -> cho phép xuất lại
        var d = root.document;
        if (d && d.getElementById("modalEduExporter")) return true;
        ASKING = 0;
        return false;
    }

    // Hỏi "có muốn xuất không" (kèm các ô lọc thêm nếu có); đồng ý thì gọi fnOk(opts đã lọc). groups: kết quả filterGroupsPlan đã chạy xong
    function askExport(opts, fnOk, ack, groups) {
        var $ = root.$, specs = opts.sheets || [opts], i, j, k;
        if (!$ || !$.fn || !$.fn.modal) {
            if (ack) ack.close();
            ASKING = 0;
            if (!root.confirm || root.confirm(ASK_TEXT)) fnOk(opts);
            return;
        }
        var lines = [], skipNames = [], total = 0, bDom = false;
        var subs = subTitlesOf(specs[0]);
        for (i = 0; i < subs.length; i++) if (toText(subs[i]) !== "") lines.push(subs[i]);
        for (i = 0; i < specs.length; i++) {
            if (specs[i].skipWhenFiltered) skipNames.push(specs[i].name || "");
            if (specs[i].data) total += specs[i].data.length; else bDom = true;
        }

        ensureAskCss();
        var h = '<div class="modal fade" id="modalEduExporter" tabindex="-1" role="dialog">'
            + '<div class="modal-dialog"><div class="modal-content">'
            + '<div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button>'
            + '<h4 class="modal-title"><i class="fa fa-file-excel-o"></i> Xuất Excel</h4></div>'
            + '<div class="modal-body">'
            + '<div class="ee-ask"><i class="fa fa-file-excel-o"></i><span>' + ASK_TEXT + '</span></div>';
        if (lines.length > 0) {
            h += '<div class="ee-cond"><div class="ee-cap">Điều kiện tìm kiếm đang áp dụng</div>';
            // in đậm tên từng điều kiện: "Hệ đào tạo: ...; Khóa: ..." -> "<b>Hệ đào tạo:</b> ...; <b>Khóa:</b> ..."
            for (i = 0; i < lines.length; i++) h += '<div class="ee-line">' + esc(lines[i]).replace(/(^|; )([^:;]+?):/g, "$1<b>$2:</b>") + '</div>';
            h += '</div>';
        }
        // Lưu ý do trang truyền vào (VD tổng các dòng lệch tổng máy chủ trả về): hiện nổi bật nhưng KHÔNG chặn việc xuất; chỉ hiện trong hộp thoại
        if (opts.notice) h += '<div class="ee-warn"><i class="fa fa-exclamation-triangle"></i> ' + esc(opts.notice).replace(/\n/g, "<br>") + '</div>';
        if (groups.length > 0) {
            h += '<div class="ee-sec"><div class="ee-cap">Lọc thêm khi xuất<small>mặc định theo bộ lọc đã chọn ở ngoài; không tích gì là xuất tất cả</small></div>'
                + '<a class="ee-link ee-clear" style="display:none" title="Quay về đúng những gì đã chọn ở ngoài màn hình tìm kiếm"><i class="fa fa-undo"></i> Đặt lại mặc định</a></div>'
                + '<div class="ee-note" id="eduExporterNote"></div>';
            for (i = 0; i < groups.length; i++) {
                if (groups.length > 1 && groups[i].name) h += '<div class="ee-cap" style="margin:6px 0">' + esc(groups[i].name) + '</div>';
                h += '<div class="ee-search ee-kw"><i class="fa fa-search"></i><input type="text" class="ee-kwin" data-g="' + i + '" autocomplete="off" '
                    + 'placeholder="Tìm nhanh theo từ khóa: mã số, họ tên, lớp, chương trình..."></div>';
                // 1-3 bộ lọc: 1 hàng; 4 bộ lọc: 2x2; nhiều hơn: 3 cột
                var nCols = groups[i].items.length === 4 ? 2 : Math.max(1, Math.min(groups[i].items.length, 3));
                h += '<div class="ee-grid" style="grid-template-columns:repeat(' + nCols + ',minmax(0,1fr))">';
                for (j = 0; j < groups[i].items.length; j++) {
                    var it = groups[i].items[j];
                    // Danh sách dài (vài nghìn người thu/lớp) chỉ vẽ từng lô nhỏ, cuộn tới đâu vẽ tới đó: vẽ cả nghìn dòng 1 lúc làm trang đứng vài giây
                    it.view = it.order;
                    it.shown = 0;
                    h += '<div class="ee-card' + (it.defN > 0 ? ' pre' : '') + '" data-g="' + i + '" data-i="' + j + '"'
                        + (it.defN > 0 ? ' title="Đã tích sẵn theo bộ lọc bạn chọn ở ngoài màn hình tìm kiếm"' : '') + '>'
                        + '<div class="ee-card-h"><span><span class="ee-card-t">' + esc(it.label) + '</span>'
                        + '<span class="ee-badge"' + (it.nSel > 0 ? ' style="display:inline-block"' : '') + '>' + it.nSel + '</span></span>'
                        + '<span class="ee-acts"><a class="ee-link ee-all" title="Tích tất cả các mục đang hiện trong danh sách (dùng sau khi gõ tìm kiếm)">Chọn hết</a>'
                        + '<span class="ee-dot">&middot;</span><a class="ee-link ee-none" title="Bỏ tích tất cả">Bỏ chọn</a></span></div>'
                        + '<div class="ee-card-s"><div class="ee-search"><i class="fa fa-search"></i>'
                        + '<input type="text" class="ee-q" autocomplete="off" placeholder="Tìm trong danh sách (' + fmtInt(it.keys.length) + ' mục)..."></div></div>'
                        + '<div class="ee-list">';
                    h += optsHtml(it);
                    h += '<div class="ee-empty">Không có mục nào khớp</div></div></div>';
                }
                h += '</div>';
            }
        }
        // Số bản ghi sẽ xuất đặt ở chân hộp thoại để luôn nhìn thấy dù danh sách lọc dài phải cuộn
        h += '</div><div class="modal-footer">'
            + '<div class="ee-result" id="eduExporterCount"><i class="fa fa-check-circle"></i><span class="ee-rt"></span></div>'
            + '<button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times-circle"></i>Đóng</button>'
            + '<button type="button" class="btn btn-success" id="btnEduExporterOk"><i class="fa fa-file-excel-o"></i>Xuất Excel</button>'
            + '</div></div></div></div>';

        // Còn hộp thoại cũ (không nên xảy ra nhờ isAsking) thì gỡ cả lớp nền mờ của nó, nếu không lớp nền ở lại phủ mờ và chặn mọi cú bấm
        var $old = $("#modalEduExporter");
        if ($old.length > 0) {
            var oldBs = $old.data("bs.modal");
            if (oldBs && oldBs.$backdrop) oldBs.$backdrop.remove();
            $old.off().remove();
            if ($(".modal.in").length === 0) $("body").removeClass("modal-open").css("padding-right", "");
        }
        var $m = $(h).appendTo(document.body), bDone = false;

        function cardOf(el) {
            var $c = $(el).closest(".ee-card");
            return { $c: $c, it: groups[parseInt($c.attr("data-g"), 10)].items[parseInt($c.attr("data-i"), 10)] };
        }
        function syncBadge($c, it) {
            if (it.nSel > 0) $c.find(".ee-badge").text(it.nSel).show(); else $c.find(".ee-badge").hide();
        }
        function refresh() {
            var parts = [], zero = false, filtered = false;
            for (var a = 0; a < groups.length; a++) {
                var n = countOf(groups[a]);
                if (n === 0) zero = true;
                if (n < groups[a].total) filtered = true;
                parts.push((groups.length > 1 && groups[a].name ? esc(groups[a].name) + ": " : "") + "Sẽ xuất <b>" + fmtInt(n) + "</b> / " + fmtInt(groups[a].total) + " bản ghi");
            }
            if (groups.length === 0 && !bDom) parts.push("Sẽ xuất <b>" + fmtInt(total) + "</b> bản ghi");
            var $r = $m.find("#eduExporterCount");
            $r.toggle(parts.length > 0).toggleClass("zero", zero).find(".ee-rt").html(parts.join("<br>"));
            $r.find("i").attr("class", zero ? "fa fa-exclamation-triangle" : "fa fa-check-circle");
            $m.find("#btnEduExporterOk").prop("disabled", zero);
            $m.find(".ee-clear").toggle(isChanged(groups));
            var $note = $m.find("#eduExporterNote");
            if (filtered && skipNames.length > 0) $note.text('Sheet "' + skipNames.join('", "') + '" chỉ được xuất khi không lọc thêm.').show();
            else $note.hide();
        }

        $m.on("change", ".ee-opt input", function () {
            var c = cardOf(this), $o = $(this).closest(".ee-opt"), key = c.it.keys[parseInt($o.attr("data-k"), 10)];
            if (this.checked) {
                if (!c.it.selected[key]) { c.it.selected[key] = true; c.it.nSel++; }
                $o.addClass("on");
            } else {
                if (c.it.selected[key]) { delete c.it.selected[key]; c.it.nSel--; }
                $o.removeClass("on");
            }
            syncBadge(c.$c, c.it);
            refresh();
        });
        // Vẽ lại danh sách của 1 bộ lọc từ đầu theo it.view (sau khi tìm / đặt lại)
        function repaintList(c) {
            var $l = c.$c.find(".ee-list");
            c.it.shown = 0;
            $l.children(".ee-opt").remove();
            $l.scrollTop(0);
            $l.children(".ee-empty").before(optsHtml(c.it)).toggle(c.it.view.length === 0);
        }
        // Cuộn gần hết danh sách thì vẽ thêm 1 lô (scroll không nổi bọt lên nên gắn thẳng vào từng danh sách)
        $m.find(".ee-list").on("scroll", function () {
            var c = cardOf(this);
            if (c.it.shown >= c.it.view.length) return;
            if (this.scrollTop + this.clientHeight >= this.scrollHeight - 160) $(this).children(".ee-empty").before(optsHtml(c.it));
        });
        // Tìm trong danh sách (không phân biệt hoa thường, bỏ dấu); tìm trên dữ liệu chứ không trên các dòng đã vẽ
        $m.on("input", ".ee-q", function () {
            var c = cardOf(this), it = c.it, q = fold($(this).val()).trim();
            if (!it.folds) { it.folds = []; for (var a = 0; a < it.keys.length; a++) it.folds.push(fold(it.keys[a])); }
            it.view = !q ? it.order : it.order.filter(function (idx) { return it.folds[idx].indexOf(q) >= 0; });
            repaintList(c);
        });
        // Tích hết các mục đang hiện (sau khi tìm, VD gõ "13.10.1" rồi chọn cả nhóm lớp): gồm cả các mục chưa vẽ vì chưa cuộn tới
        $m.on("click", ".ee-all", function () {
            var c = cardOf(this), it = c.it;
            for (var a = 0; a < it.view.length; a++) {
                var key = it.keys[it.view[a]];
                if (!it.selected[key]) { it.selected[key] = true; it.nSel++; }
            }
            c.$c.find(".ee-opt").addClass("on").find("input").prop("checked", true);
            syncBadge(c.$c, it);
            refresh();
        });
        $m.on("click", ".ee-none", function () {
            var c = cardOf(this);
            c.it.selected = Object.create(null);
            c.it.nSel = 0;
            c.$c.find(".ee-opt").removeClass("on").find("input").prop("checked", false);
            syncBadge(c.$c, c.it);
            refresh();
        });
        $m.on("input", ".ee-kwin", function () {
            var g = groups[parseInt($(this).attr("data-g"), 10)];
            ensureHay(g, specs[g.spec]);
            g.kw = $(this).val();
            g.tokens = fold(g.kw).split(/\s+/).filter(function (t) { return t !== ""; });
            refresh();
        });
        // Đặt lại = về đúng mặc định (những gì đã chọn ở ngoài màn hình tìm kiếm), xóa từ khóa và ô tìm trong danh sách
        $m.on("click", ".ee-clear", function () {
            for (var a = 0; a < groups.length; a++) {
                groups[a].kw = "";
                groups[a].tokens = [];
                for (var b = 0; b < groups[a].items.length; b++) { groups[a].items[b].selected = copySel(groups[a].items[b].def); groups[a].items[b].nSel = groups[a].items[b].defN; }
            }
            $m.find(".ee-card").each(function () {
                var c = cardOf(this);
                c.it.view = c.it.order;
                repaintList(c);
                syncBadge(c.$c, c.it);
            });
            $m.find(".ee-q, .ee-kwin").val("");
            refresh();
        });
        $m.on("click", "#btnEduExporterOk", function () {
            if (bDone) return;
            bDone = true;
            var o2 = filteredOpts(opts, groups);
            // Đóng ngay, không hiệu ứng mờ dần: thẻ "Đã nhận lệnh" hiện liền sau đó, để hộp thoại + lớp nền còn đang mờ dần thì 2 lớp mờ chồng lên nhau
            $m.removeClass("fade").modal("hide");
            fnOk(o2);
        });
        // Mở chồng lên modal khác (VD "Danh sách không đăng ký"): nâng lớp hiển thị; đóng xong trả lại khóa cuộn trang của modal bên dưới
        var bChong = $(".modal.in").length > 0;
        $m.on("hidden.bs.modal", function () {
            ASKING = 0;
            $m.remove();
            if ($(".modal.in").length > 0) $("body").addClass("modal-open");
        });
        $m.on("shown.bs.modal", function () { if (ack) ack.close(); $m.find(".ee-kwin").first().trigger("focus"); });
        refresh();
        $m.modal("show");
        if (bChong) {
            $m.css("z-index", 1070);
            setTimeout(function () { $(".modal-backdrop").last().css("z-index", 1065); }, 0);
        }
    }

    /*------------------------------------------
    --Discription: [6] API công khai
    -------------------------------------------*/
    // Các sheet con thừa hưởng tùy chọn chung ở cấp ngoài (user, footer...) rồi đổi sang sheet model
    function modelsOf(opts) {
        var specs = opts.sheets || [opts], sheets = [];
        for (var i = 0; i < specs.length; i++) {
            var spec = specs[i];
            for (var k in { user: 1, footer: 1, filter: 1, freeze: 1, stt: 1 }) if (spec[k] === undefined && opts[k] !== undefined) spec[k] = opts[k];
            sheets.push(toModel(spec));
        }
        return sheets;
    }
    // Như modelsOf nhưng đổi dữ liệu theo từng lô (nhường luồng giữa các lô); Promise<mảng sheet model>
    function modelsOfCoop(opts, onProgress) {
        var specs = opts.sheets || [opts], sheets = [], chain = Promise.resolve();
        specs.forEach(function (spec, idx) {
            chain = chain.then(function () {
                for (var k in { user: 1, footer: 1, filter: 1, freeze: 1, stt: 1 }) if (spec[k] === undefined && opts[k] !== undefined) spec[k] = opts[k];
                if (!(spec.data || spec.columns || spec.aoColumns)) { sheets.push(toModel(spec)); return null; }
                var plan = fromDataPlan(spec);
                return sliceRun(plan.n, plan.fill, function (a, n) {
                    if (onProgress) onProgress((idx + a / (n || 1)) / specs.length);
                }).then(function () { sheets.push(plan.done()); });
            });
        });
        return chain.then(function () { return sheets; });
    }
    // Nén (nếu trình duyệt có CompressionStream) rồi đóng gói zip; Promise<Uint8Array>
    function packFiles(files) {
        if (typeof CompressionStream === "undefined" || typeof ReadableStream === "undefined" || typeof Response === "undefined") {
            return Promise.resolve(zipStore(files));
        }
        var jobs = [];
        for (var i = 0; i < files.length; i++) {
            (function (f) { jobs.push(deflateRaw(f.data).then(function (p) { f.packed = p; })); })(files[i]);
        }
        return Promise.all(jobs).then(function () { return zipStore(files); }, function () {
            for (var j = 0; j < files.length; j++) delete files[j].packed;
            return zipStore(files);
        });
    }

    return {
        version: "1.9.3",

        // Dựng file .xlsx (Uint8Array, không nén) mà không tải về — dùng cho kiểm thử hoặc gửi lên nơi khác
        buildXlsx: function (opts) {
            return zipStore(buildFiles(modelsOf(opts)));
        },

        // Như buildXlsx nhưng nén (nhỏ hơn ~10 lần) nếu trình duyệt có CompressionStream; trả về Promise<Uint8Array>
        buildXlsxAsync: function (opts) {
            return packFiles(buildFiles(modelsOf(opts)));
        },

        // Như buildXlsxAsync nhưng dựng theo từng lô nhỏ và nhường luồng cho trình duyệt giữa các lô nên dữ liệu hàng chục nghìn dòng
        // không làm trang đứng ("Page Unresponsive"); onProgress(0..1) báo tiến độ. Kết quả file giống hệt buildXlsxAsync.
        buildXlsxCoop: function (opts, onProgress) {
            function part(from, to) { return function (f) { if (onProgress) onProgress(from + (to - from) * f); }; }
            return modelsOfCoop(opts, part(0, 0.4)).then(function (sheets) {
                return buildFilesCoop(sheets, part(0.4, 0.95));
            }).then(function (files) {
                if (onProgress) onProgress(0.95);
                return packFiles(files);
            });
        },

        // Xuất từ mảng dữ liệu (opts xem phần mô tả ở đầu file). Trả về Promise<boolean>
        exportData: function (opts) {
            var me = this, specs = opts.sheets || [opts], iRows = 0, bDom = false, i;
            // Toàn bộ nguồn là mảng dữ liệu rỗng thì báo, không xuất file chỉ có tiêu đề
            for (i = 0; i < specs.length; i++) {
                iRows += (specs[i].data || []).length;
                if (!specs[i].data && specs[i].table && !specs[i].aoColumns) bDom = true;
            }
            if (opts.allowEmpty !== true && !bDom && iRows === 0) {
                warn("Không có dữ liệu để xuất.");
                return Promise.resolve(false);
            }
            var name = toText(opts.fileName || (opts.sheets ? opts.sheets[0].name : opts.name) || "BaoCao").replace(/[\\\/:*?"<>|]/g, "_");
            var ack = ackStart("Xuất Excel", "Đang tạo file Excel…");
            // % tiến độ ghi ngay trên thẻ "Đã nhận lệnh" (thẻ cũ chưa có update thì thôi, không ảnh hưởng việc xuất)
            var onProg = (ack && typeof ack.update === "function") ? function (f) { ack.update("Đang tạo file Excel…", f * 100); } : null;
            // thẻ được vẽ xong rồi mới dựng file; dựng theo từng lô nhỏ để trang không đứng khi có hàng chục nghìn dòng
            return new Promise(function (resolve) {
                function fin(bOk, strErr) {
                    if (ack) ack.close();
                    if (strErr) warn("Không tạo được file Excel: " + strErr);
                    resolve(bOk);
                }
                paintThen(function () {
                    var p;
                    try { p = me.buildXlsxCoop(opts, onProg); }
                    catch (ex) {
                        if (root.console) root.console.log("[edu.exporter] lỗi", ex);
                        fin(false, ex.message);
                        return;
                    }
                    p.then(function (bytes) {
                        download(bytes, name + "_" + stamp(new Date()) + ".xlsx");
                        fin(true);
                    }, function (ex) {
                        if (root.console) root.console.log("[edu.exporter] lỗi", ex);
                        fin(false, ex.message);
                    });
                });
            });
        },

        // Xuất thẳng bảng đang hiển thị trên màn hình
        exportTable: function (strTable_Id, opts) {
            opts = opts || {};
            opts.table = strTable_Id;
            if (!opts.fileName) opts.fileName = strTable_Id;
            opts.allowEmpty = true;
            return this.exportData(opts);
        },

        // Gắn nút "Xuất Excel" cạnh danh sách đang hiển thị: xuất ĐÚNG bảng trên màn hình (tiêu đề, điều kiện lọc, dòng tổng, ngày xuất).
        //   cfg: table (id bảng), before | after | append (bộ chọn chỗ chèn nút), block (true: nút nằm riêng 1 dòng, căn phải),
        //        fileName, title, subTitles (mảng hoặc hàm trả mảng), filters [[{label,id}...]] (ô lọc trên màn hình -> dòng "Điều kiện"),
        //        label ("Xuất Excel"), confirm (mặc định true: hỏi "Bạn có muốn xuất không?"),
        //        paged (true: bảng có phân trang nên chỉ gồm trang đang hiển thị -> ghi rõ trên nút và trong file),
        //        fetchAll + columns (bảng có phân trang mà muốn xuất ĐỦ: fetchAll() trả Promise<mảng dòng> nạp toàn bộ bằng cùng API
        //        với pageSize lớn; columns khai như exportData; có ack "Đã nhận lệnh" trong lúc nạp),
        //        notice (chỉ đi cùng fetchAll: chuỗi hoặc hàm (rows) => chuỗi; khác rỗng thì hiện khung lưu ý màu cam trong hộp thoại xuất, không chặn xuất),
        //        extraFilters (chỉ đi cùng fetchAll; mảng hoặc hàm trả mảng [{ label, field | get(row), selected[] | from }] — các danh sách
        //        "lọc thêm khi xuất" trong hộp thoại, cùng quy tắc mặc định như exportData.filters; hàm được gọi MỖI LẦN bấm nút)
        //   Gọi nhiều lần cho cùng 1 bảng thì chỉ có 1 nút.
        attachTable: function (cfg) {
            var $ = root.$, me = this, id = "btnEduExp_" + cfg.table.replace(/[^A-Za-z0-9_]/g, "_"), full = typeof cfg.fetchAll === "function";
            if (!$ || $("#" + id).length > 0) return;
            var tip = full ? "Xuất toàn bộ danh sách (không chỉ trang đang hiển thị)" : (cfg.paged ? "Chỉ xuất các dòng đang hiển thị (trang hiện tại)" : "Xuất danh sách đang hiển thị ra Excel");
            var $btn = $('<a class="btn btn-success btnEduExp" id="' + id + '" href="#" style="margin-left:6px" title="' + tip + '"><i class="fa fa-file-excel-o"></i> ' + (cfg.label || "Xuất Excel") + (!full && cfg.paged ? " (trang này)" : "") + '</a>');
            var $put = cfg.block ? $('<div class="btnEduExpRow" style="text-align:right;margin:0 0 8px"></div>').append($btn.css("margin-left", 0)) : $btn;
            if (cfg.before && $(cfg.before).length) $(cfg.before).first().before($put);
            else if (cfg.after && $(cfg.after).length) $(cfg.after).first().after($put);
            else if (cfg.append && $(cfg.append).length) $(cfg.append).first().append($put);
            else return;
            function lines() {
                var out = [], i, sub = typeof cfg.subTitles === "function" ? cfg.subTitles() : (cfg.subTitles || []);
                for (i = 0; i < sub.length; i++) if (toText(sub[i]) !== "") out.push(sub[i]);
                if (cfg.filters) for (i = 0; i < cfg.filters.length; i++) { var t = me.filterText(cfg.filters[i]); if (t) out.push(t); }
                if (cfg.paged && !full) out.push("Lưu ý: chỉ gồm các dòng đang hiển thị (trang hiện tại) của danh sách");
                return out;
            }
            if (!full) {
                me.bindButton("#" + id, function () {
                    return { table: cfg.table, fileName: cfg.fileName || cfg.table, title: cfg.title, subTitles: lines(), confirm: cfg.confirm };
                });
                return;
            }
            var busyAt = 0;
            $(document).off("click.eduExp", "#" + id).on("click.eduExp", "#" + id, function (e) {
                e.preventDefault();
                // Đang nạp danh sách / đang mở hộp thoại thì bỏ qua các lần bấm thêm (mỗi lần bấm thêm = 1 lần nạp lại toàn bộ + 1 hộp thoại chồng lên)
                if ((busyAt && Date.now() - busyAt < 180000) || isAsking()) return;
                busyAt = Date.now();
                // Thẻ "Đã nhận lệnh" hiện NGAY; chờ trình duyệt vẽ xong mới bắt đầu dựng yêu cầu nạp dữ liệu
                var ack = ackStart(cfg.label || "Xuất Excel", "Đang nạp toàn bộ danh sách từ máy chủ…");
                var fin = function () { busyAt = 0; if (ack) ack.close(); };
                paintThen(function () {
                    var p;
                    try { p = Promise.resolve(cfg.fetchAll()); } catch (ex) { fin(); warn("Không nạp được danh sách để xuất: " + ex.message); return; }
                    p.then(function (rows) {
                        fin();
                        if (!rows || rows.length === 0) { warn("Không có dữ liệu để xuất."); return; }
                        var flt = typeof cfg.extraFilters === "function" ? cfg.extraFilters() : cfg.extraFilters;
                        var note = "";
                        try { note = typeof cfg.notice === "function" ? (cfg.notice(rows) || "") : (cfg.notice || ""); } catch (ex) { note = ""; }
                        me.exportWithConfirm({ fileName: cfg.fileName || cfg.table, title: cfg.title, subTitles: lines(), columns: cfg.columns, data: rows, filters: flt, notice: note, confirm: cfg.confirm });
                    }, function (ex) { fin(); warn("Không nạp được danh sách để xuất: " + (ex && ex.message ? ex.message : ex)); });
                });
            });
        },

        // Hỏi "Bạn có muốn xuất không?" (kèm các ô lọc thêm nếu opts khai báo filters) rồi mới xuất
        exportWithConfirm: function (opts) {
            var me = this;
            if (opts.confirm === false) return me.exportData(opts);
            if (isAsking()) return;
            ASKING = Date.now();
            var ack = ackStart("Xuất Excel", "Đang lên phương án xuất dữ liệu…");
            paintThen(function () {
                function fail(ex) {
                    ASKING = 0;
                    if (ack) ack.close();
                    if (root.console) root.console.log("[edu.exporter] lỗi", ex);
                    warn("Không mở được hộp thoại xuất: " + ex.message);
                }
                var plan;
                try { plan = filterGroupsPlan(opts.sheets || [opts]); } catch (ex) { fail(ex); return; }
                // đếm giá trị của từng bộ lọc (duyệt hết các dòng), nhường luồng giữa các bộ lọc để trang không đứng
                sliceRun(plan.tasks.length, function (a, b) { for (var t = a; t < b; t++) plan.tasks[t](); }, null, 1)
                    .then(function () { askExport(opts, function (o) { me.exportData(o); }, ack, plan.groups); })
                    .then(null, fail);
            });
        },

        // Gắn nút xuất: fnGetOpts chạy MỖI LẦN bấm để lấy dữ liệu/điều kiện lọc mới nhất; trả về null/false nếu chưa xuất được
        bindButton: function (strSelector, fnGetOpts) {
            var me = this;
            root.$(document).off("click.eduExporter", strSelector).on("click.eduExporter", strSelector, function (e) {
                e.preventDefault();
                var opts = fnGetOpts.call(this);
                if (!opts) return;
                if (opts.table && !opts.data && !opts.columns && !opts.aoColumns && !opts.sheets) {
                    if (!opts.fileName) opts.fileName = opts.table;
                    opts.allowEmpty = true;
                }
                me.exportWithConfirm(opts);
            });
        },

        // Tạo dòng mô tả điều kiện lọc từ các ô chọn: "Hệ đào tạo: A, B; Khóa: C" (ô chưa chọn thì bỏ qua)
        // items: [{ label: "Hệ đào tạo", id: "dropSearch_HeDaoTao" }, ...]
        filterText: function (items) {
            var out = [];
            for (var i = 0; i < items.length; i++) {
                var names = [], seen = {};
                root.$("#" + items[i].id + " option:selected").each(function () {
                    var v = root.$(this).val(), t = root.$(this).text().replace(/\s+/g, " ").trim();
                    if (!v || v === "SELECTALL" || seen[t]) return;
                    seen[t] = true;
                    names.push(t);
                });
                if (names.length === 0) continue;
                var shown = names.length > 8 ? names.slice(0, 8).join(", ") + " ... (+" + (names.length - 8) + ")" : names.join(", ");
                out.push(items[i].label + ": " + shown);
            }
            return out.join("; ");
        },

        // Tên các mục đang chọn của 1 ô chọn trên màn hình (dùng để chụp lại điều kiện lúc tìm kiếm, đưa vào filters[].selected)
        selectedTexts: selectedTexts,

        columnsFromTable: columnsFromTable
    };
})(typeof window !== "undefined" ? window : globalThis);

// Cùng mẫu với util/systemroot: indexi.aspx khởi tạo bằng edu['exporter'] = new exportexcel();
function exportexcel() { };
exportexcel.prototype = exportexcelApi;
