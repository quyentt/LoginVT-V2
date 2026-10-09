/* =========================================================================
   Tốt nghiệp — vẽ PHÔI IN văn bằng theo mẫu CMS_MauPhoiIn_ChiTiet (màn "Thực hiện in").
   Bản gốc: ApisTotNghiep/Modules/vanbang/script/thuchienin.js — getList_NoiDungTheoMa, genData_Phoi,
   genData_ChiTiet, makeQRCode, makePicture, getList_TaoQR, các hàm "Chế độ test".
   ---------------------------------------------------------------------------
   Mẫu phôi = ảnh nền (DUONGDANFILE dạng "<tệp>_<rộng>_<cao>") + các Ô đặt tuyệt đối (LETREN / LETRAI px,
   FONTSIZE, DORONGPHANTUCANLE, DINHDANG, LEPHAI, CANLE_TRAI_PHAI_GIUA, TRANG). Nội dung mỗi ô là một BIỂU THỨC
   JavaScript (NOIDUNG) tính trên bản ghi người học `aData` — gốc chạy eval(NOIDUNG).

   KHÔNG eval (CHUYEN-DOI mục 8): ums.tnvbPhoi.tinh(bieuThuc, ngữCảnh) là bộ tính biểu thức an toàn viết riêng,
   hiểu đúng phần JS mà các biểu thức phôi dùng:
       chữ '…' "…", số, true/false/null/undefined · aData.COT, aData['COT'], aData.DS[0].TEN
       + - * / % · == != === !== < > <= >= · && || ! · a ? b : c · ( )
       phương thức chuỗi / số / mảng an toàn (toUpperCase, substring, split, replace — mẫu là CHUỖI, trim, padStart,
       toFixed, join…), Math.round/floor/ceil/abs/min/max, String(), Number(), parseInt(), parseFloat(),
       edu.util.returnEmpty / returnZero, và ba hàm của màn: me.makeQRCode(vùng, nội dung, rộng, cao),
       me.makePicture(vùng, đường dẫn ảnh, rộng cm, cao cm), me.getList_TaoQR(id ô, nội dung, rộng).
   Không cho truy cập __proto__ / constructor / prototype, không gọi hàm ngoài danh sách. Biểu thức ngoài phạm vi
   đó → ô để trống + ghi console (như gốc bắt lỗi eval rồi bỏ qua) để quản trị sửa mẫu.

   ums.tnvbPhoi.ve(host, chiTiet, ds, o) — dựng khung phôi rồi điền từng bản ghi (mỗi người học một khối
       .tnvb-ban[data-ban=ID]); o = { test: { bat(), chiKyHieu(), giaTri(id), viTri(id) } }
   ums.tnvbPhoi.dien(host, chiTiet, ds, o) — chỉ điền lại nội dung (đổi giá trị test / chế độ ký hiệu)
   ums.tnvbPhoi.fontCss(tenFont, coUrl) — @font-face cho cửa sổ in (UTM HelvetIns hoặc Bitter như gốc)
   ums.tnvbPhoi.taiAnh(el, tenTep) — html2canvas (nạp lười từ ./vendor/html2canvas.min.js) → tải PNG
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, esc = ui.esc;
    var P = ums.tnvbPhoi = ums.tnvbPhoi || {};
    function e(v) { return v === null || v === undefined ? '' : v; }
    function so(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
    /* Chữ trong ô phôi: chặn HTML, chỉ giữ thẻ <br> (dữ liệu cũ có sẵn <br> để xuống dòng) */
    function escBr(v) { return esc(v).replace(/&lt;br\s*\/?&gt;/gi, '<br>'); }
    /* Đường dẫn thư mục của chính tệp này — để nạp thư viện html2canvas đặt cạnh nó */
    var CUR = document.currentScript && document.currentScript.src ? document.currentScript.src.replace(/[?#].*$/, '') : '';
    var DIR = CUR ? CUR.substring(0, CUR.lastIndexOf('/') + 1) : '';

    /* =====================================================================
       BỘ TÍNH BIỂU THỨC AN TOÀN
       ===================================================================== */
    var OPS = ['===', '!==', '==', '!=', '<=', '>=', '&&', '||', '?', ':', '(', ')', '[', ']', '.', ',', '+', '-', '*', '/', '%', '<', '>', '!'];
    function tach(s) {
        var t = [], i = 0, n = s.length;
        while (i < n) {
            var c = s[i];
            if (/\s/.test(c)) { i++; continue; }
            if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1] || ''))) {
                var m = /^[0-9]*\.?[0-9]+(e[+-]?[0-9]+)?/i.exec(s.slice(i));
                t.push({ k: 'so', v: parseFloat(m[0]) }); i += m[0].length; continue;
            }
            if (c === '"' || c === "'") {
                var q = c, v = ''; i++;
                while (i < n && s[i] !== q) {
                    if (s[i] === '\\' && i + 1 < n) {
                        var x = s[i + 1];
                        v += x === 'n' ? '\n' : x === 't' ? '\t' : x; i += 2;
                    } else v += s[i++];
                }
                if (i >= n) throw new Error('chuỗi chưa đóng');
                i++; t.push({ k: 'chu', v: v }); continue;
            }
            if (/[A-Za-z_$]/.test(c)) {
                var w = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(s.slice(i))[0];
                t.push({ k: 'ten', v: w }); i += w.length; continue;
            }
            var op = null;
            for (var j = 0; j < OPS.length; j++) if (s.substr(i, OPS[j].length) === OPS[j]) { op = OPS[j]; break; }
            if (!op) throw new Error('ký tự không hiểu: ' + c);
            t.push({ k: 'op', v: op }); i += op.length;
        }
        return t;
    }
    function phanTich(s) {
        var t = tach(s), p = 0;
        function xem(v) { return t[p] && t[p].k === 'op' && t[p].v === v; }
        function an(v) { if (!xem(v)) throw new Error('thiếu "' + v + '"'); p++; }
        function bt() {
            var c = hoac();
            if (xem('?')) { p++; var a = bt(); an(':'); var b = bt(); return { t: '?', c: c, a: a, b: b }; }
            return c;
        }
        function tang(sau, ops) {
            return function () {
                var l = sau();
                while (t[p] && t[p].k === 'op' && ops.indexOf(t[p].v) >= 0) { var o = t[p++].v; l = { t: 'bin', o: o, l: l, r: sau() }; }
                return l;
            };
        }
        var mot = function () {
            if (xem('!') || xem('-') || xem('+')) { var o = t[p++].v; return { t: 'un', o: o, x: mot() }; }
            return hau();
        };
        var nhan = tang(mot, ['*', '/', '%']), cong = tang(nhan, ['+', '-']);
        var sosanh = tang(cong, ['<', '>', '<=', '>=']), bang = tang(sosanh, ['==', '!=', '===', '!==']);
        var va = tang(bang, ['&&']), hoac = tang(va, ['||']);
        function goc() {
            var k = t[p];
            if (!k) throw new Error('biểu thức cụt');
            if (k.k === 'so' || k.k === 'chu') { p++; return { t: 'lit', v: k.v }; }
            if (k.k === 'ten') {
                p++;
                if (k.v === 'true') return { t: 'lit', v: true };
                if (k.v === 'false') return { t: 'lit', v: false };
                if (k.v === 'null') return { t: 'lit', v: null };
                if (k.v === 'undefined') return { t: 'lit', v: undefined };
                return { t: 'id', v: k.v };
            }
            if (xem('(')) { p++; var x = bt(); an(')'); return x; }
            throw new Error('không hiểu "' + k.v + '"');
        }
        function hau() {
            var x = goc();
            for (;;) {
                if (xem('.')) { p++; var k = t[p++]; if (!k || k.k !== 'ten') throw new Error('sau "." phải là tên'); x = { t: 'mem', o: x, k: { t: 'lit', v: k.v } }; }
                else if (xem('[')) { p++; var i = bt(); an(']'); x = { t: 'mem', o: x, k: i }; }
                else if (xem('(')) {
                    p++; var a = [];
                    if (!xem(')')) { a.push(bt()); while (xem(',')) { p++; a.push(bt()); } }
                    an(')'); x = { t: 'call', f: x, a: a };
                } else return x;
            }
        }
        var kq = bt();
        if (p < t.length) throw new Error('thừa "' + t[p].v + '"');
        return kq;
    }

    var CAM_DS = ['__proto__', 'constructor', 'prototype', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'];
    function cam(k) { return CAM_DS.indexOf(k) >= 0; }
    var PT_CHU = ['toUpperCase', 'toLowerCase', 'toLocaleUpperCase', 'toLocaleLowerCase', 'trim', 'trimStart', 'trimEnd',
        'substring', 'substr', 'slice', 'split', 'replace', 'replaceAll', 'charAt', 'indexOf', 'lastIndexOf', 'includes',
        'startsWith', 'endsWith', 'padStart', 'padEnd', 'concat', 'toString', 'repeat'];
    var PT_SO = ['toFixed', 'toString'], PT_MANG = ['join', 'slice', 'indexOf', 'includes', 'concat'];
    var MATH = { round: Math.round, floor: Math.floor, ceil: Math.ceil, abs: Math.abs, min: Math.min, max: Math.max };
    var EDU = { util: {
        returnEmpty: function (v) { return v === null || v === undefined ? '' : v; },
        returnZero: function (v) { return v === null || v === undefined || v === '' ? 0 : v; }
    } };
    var HAM = { String: String, Number: Number, parseInt: parseInt, parseFloat: parseFloat };

    function docThuoc(o, k) {
        if (o === null || o === undefined) throw new Error('đọc "' + k + '" của ' + o);
        k = String(k);
        if (cam(k)) throw new Error('thuộc tính bị chặn');
        if (typeof o === 'string' || Array.isArray(o)) {
            if (k === 'length') return o.length;
            if (/^\d+$/.test(k)) return o[Number(k)];
            return undefined;
        }
        if (typeof o === 'object' && Object.prototype.hasOwnProperty.call(o, k)) return o[k];
        return undefined;
    }
    function tinhNut(n, ctx) {
        switch (n.t) {
            case 'lit': return n.v;
            case 'id':
                if (n.v === 'aData') return ctx.aData;
                if (n.v === 'me') return ctx.me;
                if (n.v === 'edu') return EDU;
                if (n.v === 'Math') return MATH;
                if (Object.prototype.hasOwnProperty.call(HAM, n.v)) return HAM[n.v];
                throw new Error(n.v + ' is not defined');
            case 'mem': return docThuoc(tinhNut(n.o, ctx), tinhNut(n.k, ctx));
            case 'un': { var x = tinhNut(n.x, ctx); return n.o === '!' ? !x : n.o === '-' ? -x : +x; }
            case '?': return tinhNut(n.c, ctx) ? tinhNut(n.a, ctx) : tinhNut(n.b, ctx);
            case 'bin': {
                if (n.o === '&&') return tinhNut(n.l, ctx) && tinhNut(n.r, ctx);
                if (n.o === '||') return tinhNut(n.l, ctx) || tinhNut(n.r, ctx);
                var l = tinhNut(n.l, ctx), r = tinhNut(n.r, ctx);
                switch (n.o) {
                    case '+': return l + r; case '-': return l - r; case '*': return l * r; case '/': return l / r; case '%': return l % r;
                    case '<': return l < r; case '>': return l > r; case '<=': return l <= r; case '>=': return l >= r;
                    case '==': return l == r; case '!=': return l != r;            // eslint-disable-line eqeqeq
                    case '===': return l === r; case '!==': return l !== r;
                }
                throw new Error('toán tử ' + n.o);
            }
            case 'call': {
                var a = n.a.map(function (x) { return tinhNut(x, ctx); });
                if (n.f.t === 'id') {
                    var g = tinhNut(n.f, ctx);
                    if (typeof g !== 'function' || !Object.prototype.hasOwnProperty.call(HAM, n.f.v)) throw new Error('không gọi được ' + n.f.v);
                    return g.apply(null, a);
                }
                if (n.f.t !== 'mem') throw new Error('lời gọi không hợp lệ');
                var o = tinhNut(n.f.o, ctx), ten = String(tinhNut(n.f.k, ctx));
                if (cam(ten)) throw new Error('thuộc tính bị chặn');
                if (o === ctx.me || o === MATH || o === EDU.util) {
                    if (!Object.prototype.hasOwnProperty.call(o, ten) || typeof o[ten] !== 'function') throw new Error('không có hàm ' + ten);
                    return o[ten].apply(o, a);
                }
                if (typeof o === 'string' && PT_CHU.indexOf(ten) >= 0) {
                    if ((ten === 'replace' || ten === 'replaceAll' || ten === 'split') && a.length && typeof a[0] !== 'string') throw new Error('mẫu phải là chuỗi');
                    if ((ten === 'replace' || ten === 'replaceAll') && typeof a[1] !== 'string') a[1] = String(a[1]);
                    return String.prototype[ten].apply(o, a);
                }
                if (typeof o === 'number' && PT_SO.indexOf(ten) >= 0) return Number.prototype[ten].apply(o, a);
                if (Array.isArray(o) && PT_MANG.indexOf(ten) >= 0) return Array.prototype[ten].apply(o, a);
                throw new Error('không gọi được .' + ten + '()');
            }
        }
        throw new Error('nút lạ');
    }
    var nho = {};
    /** Tính một biểu thức NOIDUNG — ném lỗi khi biểu thức ngoài phạm vi hỗ trợ (gốc: eval ném lỗi) */
    P.tinh = function (bieuThuc, ctx) {
        var s = String(bieuThuc === null || bieuThuc === undefined ? '' : bieuThuc);
        if (!nho[s]) nho[s] = phanTich(s);
        return tinhNut(nho[s], ctx || {});
    };

    /* =====================================================================
       KHUNG PHÔI
       ===================================================================== */
    function anhNen(ct) { return e(ct[0] && ct[0].DUONGDANFILE); }
    function kichThuoc(ct) {
        var a = anhNen(ct);
        if (a.indexOf('_') < 0) return null;
        var x = a.split('_');
        return { w: parseInt(x[1], 10) || 0, h: parseInt(x[2], 10) || 0 };
    }
    function kieuO(d, test) {
        var pos = test && test.viTri ? test.viTri(d.ID) : null;     // tọa độ đã kéo ở chế độ test (lưu trên máy) — gốc áp cả khi tắt test
        var top = pos ? pos.top : so(d.LETREN), left = pos ? pos.left : so(d.LETRAI);
        return 'position:absolute;margin-top:' + top + 'px;' +
            (d.FONTSIZE ? 'font-size:' + so(d.FONTSIZE) + 'px;' : '') +
            (d.DORONGPHANTUCANLE ? 'width:' + so(d.DORONGPHANTUCANLE) + 'px;' : '') +
            'margin-left:' + left + 'px;' + e(d.DINHDANG) + ';' + e(d.LEPHAI) + e(d.CANLE_TRAI_PHAI_GIUA);
    }
    /** HTML một bản phôi trống (chưa điền) — kiểu viết thẳng vào thuộc tính để cửa sổ in giữ nguyên */
    /* Mẫu chưa có ảnh nền: gốc để trang cao 0 nên các bản chồng lên nhau — đặt chiều cao đủ chứa ô thấp nhất */
    function caoTrang(oTrang, d0, test) {
        var day = 0;
        oTrang.forEach(function (d) {
            var p = test && test.viTri ? test.viTri(d.ID) : null;
            day = Math.max(day, (p ? p.top : so(d.LETREN)) + (so(d.FONTSIZE) || so(d0.COCHU) || 16) * 2);
        });
        return day + 20;
    }
    function khungHtml(ct, test) {
        var d0 = ct[0] || {}, kt = kichThuoc(ct), nen = anhNen(ct);
        var maxTrang = 0;
        ct.forEach(function (d) { if (so(d.TRANG) > maxTrang) maxTrang = so(d.TRANG); });
        var le = d0.MARGIN_TOP ? 'margin-top:' + so(d0.MARGIN_TOP) + 'px;margin-left:' + so(d0.MARGIN_LEFT) + 'px;' : '';
        var trang = [];
        for (var i = 0; i <= maxTrang; i++) {
            var st = 'position:relative;' + le;
            var oTrang = ct.filter(function (d) { return so(d.TRANG) === i; });
            if (kt) st += 'background:url(\'' + ums.files.url(nen).replace(/'/g, '%27') + '\') no-repeat;background-size:' + kt.w + 'px;height:' + kt.h + 'px;';
            else st += 'height:' + caoTrang(oTrang, d0, test) + 'px;';
            var o = oTrang.map(function (d) {
                return '<span class="tnvb-o" data-fid="' + esc(d.ID) + '" data-stt="' + (ct.indexOf(d) + 1) + '" style="' + esc(kieuO(d, test)) + '"></span>';
            }).join('');
            trang.push('<div class="tnvb-trang" style="' + esc(st) + '">' + o + '</div>');
        }
        return '<div class="tnvb-giay" style="' + esc('font-family:"' + e(d0.FONT) + '";font-size:' + so(d0.COCHU) + 'px;' +
            (kt ? 'width:' + (kt.w + 40) + 'px;' : '')) + '">' +
            trang.join('<p style="page-break-before:always;margin:0">&nbsp;</p>') + '</div>';
    }

    /* Ba hàm "me." mà biểu thức phôi gọi — phạm vi tìm ô giới hạn trong khối của CHÍNH bản ghi (gốc tìm toàn trang
       bằng id trùng nhau giữa các bản nên chỉ điền được bản đầu) */
    function chonVung(ban, zone) {
        var s = String(zone || '');
        var m = /^#([\w-]+)$/.exec(s);
        if (m) return ban.querySelectorAll('[data-fid="' + m[1] + '"]');
        try { return ban.querySelectorAll(s); } catch (x) { return []; }
    }
    function taoQR(noiDung, cb) {
        return ums.api.call({ action: 'CTT_Token/TaoQRCode', method: 'GET', silent: true, strNoiDung: e(noiDung) })
            .then(function (r) { if (r.data) cb(String(r.data)); })
            .catch(function (err) { ums.api.handle(err, 'CTT_Token/TaoQRCode'); });
    }
    function anhQR(b64, rong) {
        var img = document.createElement('img');
        img.alt = 'QR'; img.src = 'data:image/png;base64, ' + b64;
        if (rong) img.style.width = so(rong) + 'px';
        return img;
    }
    function hamMe(ban) {
        return {
            /* gốc: new QRCode(...) — thư viện qrcode KHÔNG được nạp ở vỏ indexi nên luôn hỏng (bắt lỗi rồi bỏ qua).
               Làm theo ý định: lấy ảnh QR từ máy chủ (CTT_Token/TaoQRCode, như getList_TaoQR) rồi đặt vào vùng. */
            makeQRCode: function (zone, qrcode, width, height) {
                var vung = chonVung(ban, zone);
                if (!vung.length) return undefined;
                taoQR(qrcode, function (b64) {
                    Array.prototype.forEach.call(vung, function (v) {
                        var img = anhQR(b64, width); if (height) img.style.height = so(height) + 'px';
                        v.innerHTML = ''; v.appendChild(img);
                    });
                });
                return undefined;
            },
            makePicture: function (zone, strAnh, width, height) {
                Array.prototype.forEach.call(chonVung(ban, zone), function (v) {
                    v.innerHTML = '<img alt="" src="' + esc(ums.files.url(e(strAnh))) + '" style="width:' + (so(width) / 2.54 * 96) +
                        'px;height:' + (so(height) / 2.54 * 96) + 'px">';
                });
                return undefined;
            },
            getList_TaoQR: function (strDivId, strNoiDung, dChieuDai) {
                var vung = chonVung(ban, '#' + strDivId);
                taoQR(strNoiDung, function (b64) {
                    Array.prototype.forEach.call(vung, function (v) { v.innerHTML = ''; v.appendChild(anhQR(b64, dChieuDai)); });
                });
                return undefined;
            }
        };
    }

    function coGiaTri(v) { return v !== null && v !== undefined && v !== ''; }
    /** Điền nội dung một bản ghi vào khối của nó (genData_ChiTiet) */
    function dienMot(ban, aData, ct, o) {
        var test = o.test || {}, bat = test.bat && test.bat(), kyHieu = bat && test.chiKyHieu && test.chiKyHieu();
        var ctx = { aData: aData, me: hamMe(ban) };
        var lap = [];
        ct.forEach(function (d, i) {
            var nd = e(d.NOIDUNG);
            if (nd.indexOf('[x].') >= 0) { lap.push(d); return; }
            var o1 = ban.querySelector('[data-fid="' + d.ID + '"]');
            if (!o1) return;
            var v;
            if (kyHieu) v = '(' + (i + 1) + ')';
            else {
                var gtTest = bat && test.giaTri ? test.giaTri(d.ID) : null;
                if (coGiaTri(gtTest)) v = gtTest;
                else {
                    try { v = P.tinh(nd, ctx); } catch (ex) { v = undefined; console.warn('[tnvbPhoi] biểu thức phôi không tính được (gốc eval):', nd, '—', ex.message); }
                }
            }
            if (coGiaTri(v)) o1.innerHTML = escBr(v);
            else if (o1.getAttribute('data-dien') === '1' && !o1.querySelector('img')) o1.innerHTML = '';
            o1.setAttribute('data-dien', '1');
        });
        /* Ô dạng BẢNG LẶP: NOIDUNG "aData.DS[x].COT" — mỗi phần tử của aData.DS một dòng, cách nhau KHOGIAY px (mặc định 30).
           Gốc viết hỏng (dùng biến j / point chưa có, regex /[x]./g khớp sai) nên luôn ném lỗi và dừng điền các bản sau;
           bản mới làm theo ý định. */
        var cach = ct.length && ct[0].KHOGIAY !== null && ct[0].KHOGIAY !== undefined && ct[0].KHOGIAY !== '' ? so(ct[0].KHOGIAY) : 30;
        Array.prototype.forEach.call(ban.querySelectorAll('[data-lap]'), function (x) { x.parentNode.removeChild(x); });
        lap.forEach(function (d) {
            var mau = ban.querySelector('[data-fid="' + d.ID + '"]');
            if (!mau) return;
            var nd = e(d.NOIDUNG), ds;
            try { ds = P.tinh(nd.substring(0, nd.indexOf('[x].')), ctx); } catch (ex) { ds = null; }
            if (!Array.isArray(ds)) { console.warn('[tnvbPhoi] ô bảng lặp không có danh sách:', nd); return; }
            var top = parseFloat(mau.style.marginTop) || 0;
            ds.forEach(function (x, j) {
                var c = mau.cloneNode(false);
                c.removeAttribute('data-fid');
                c.setAttribute('data-lap', d.ID);
                c.style.marginTop = (top + j * cach) + 'px';
                var v;
                try { v = P.tinh(nd.split('[x].').join('[' + j + '].'), ctx); } catch (ex) { v = undefined; }
                if (coGiaTri(v)) c.innerHTML = escBr(v);
                mau.parentNode.appendChild(c);
            });
            mau.innerHTML = '';
        });
    }

    P.ve = function (host, ct, ds, o) {
        o = o || {};
        var khung = khungHtml(ct, o.test);
        host.innerHTML = ds.map(function (r) {
            return '<div class="tnvb-ban" data-ban="' + esc(r.ID) + '">' + khung + '</div>';
        }).join('');
        P.dien(host, ct, ds, o);
    };
    P.dien = function (host, ct, ds, o) {
        o = o || {};
        ds.forEach(function (r) {
            var ban = host.querySelector('.tnvb-ban[data-ban="' + String(r.ID).replace(/"/g, '\\"') + '"]');
            if (ban) dienMot(ban, r, ct, o);
        });
    };

    /** @font-face cho cửa sổ in — gốc printHTML chọn theo FONT của mẫu */
    P.fontCss = function (font) {
        var tep = font === 'Bitter-VariableFont_wght' ? ['Bitter-VariableFont_wght', 'Bitter-VariableFont_wght.ttf'] : ['UTM HelvetIns', 'HelvetIns.ttf'];
        var url = new URL('../App_Themes/Cms/fonts/' + tep[1], location.href).href;
        return '@font-face{font-family:"' + tep[0] + '";src:url("' + url + '") format("truetype");}';
    };

    var napH2c = null;
    function html2canvasP() {
        if (window.html2canvas) return Promise.resolve(window.html2canvas);
        if (!napH2c) {
            napH2c = new Promise(function (ok, hong) {
                var s = document.createElement('script');
                s.src = DIR + 'vendor/html2canvas.min.js';
                s.onload = function () { window.html2canvas ? ok(window.html2canvas) : hong(new Error('Không nạp được html2canvas')); };
                s.onerror = function () { napH2c = null; hong(new Error('Không nạp được thư viện chụp ảnh (html2canvas)')); };
                document.head.appendChild(s);
            });
        }
        return napH2c;
    }
    /** "Tải file ảnh" — chụp khối phôi thành PNG (gốc: html2canvas scale devicePixelRatio × 3, nền trắng) */
    P.taiAnh = function (el, tenTep) {
        return html2canvasP().then(function (h2c) {
            return h2c(el, { scale: (window.devicePixelRatio || 1) * 3, backgroundColor: '#ffffff', useCORS: true, allowTaint: false, logging: false });
        }).then(function (canvas) {
            var a = document.createElement('a');
            a.download = tenTep || 'bang-in.png';
            a.href = canvas.toDataURL('image/png');
            document.body.appendChild(a); a.click(); a.parentNode.removeChild(a);
        });
    };
})();
