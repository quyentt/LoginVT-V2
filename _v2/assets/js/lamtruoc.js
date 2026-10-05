/* =========================================================================
   ums.lamTruoc — khung "Cần làm trước" (người dùng chốt 2026-10-05)
   ---------------------------------------------------------------------------
   Màn thiếu DỮ LIỆU NGHIỆP VỤ mà người dùng tự khai được ở một màn khác
   (danh mục chưa có giá trị, chưa có bản ghi cha, mẫu import chưa phân quyền…)
   thì KHÔNG phải lỗi backend: vỏ TỰ PHÁT HIỆN lúc nạp màn và bật một khung
   ngay dưới khung "Ghi chú chuyển đổi": việc cần làm + liên kết mở thẳng màn
   khai + dấu × để tắt.

   Phát hiện:
     · TỰ ĐỘNG — mọi danh mục dùng chung (ums.api.dm) trả 0 dòng trong lúc màn
       đang mở → "Danh mục <MÃ> chưa có giá trị". Liên kết: màn Danh mục dữ liệu
       của vai trò đang mở, không có thì bản Quản trị hệ thống (CMS) ở vai trò
       khác; mở xong tự chọn đúng danh mục (bản DKH / Tài chính đọc
       ums.lamTruoc.layDanhMucCho()).
     · BẢNG NGUỒN (L.NGUON) — lời gọi khác trả rỗng mà đã biết phải khai ở màn
       nào (hệ thống biên lai, mẫu hồ sơ…): khai một dòng, mọi màn dùng nguồn đó
       tự có thông báo.
     · MÀN TỰ KHAI — nguồn khác trả rỗng mà màn biết phải khai ở đâu:
           ums.lamTruoc.can({
               o: 'Kế hoạch tuyển dụng',            // ô / vùng đang thiếu
               viec: 'Thêm ít nhất một kế hoạch',    // cần làm gì
               man: '/Modules/kehoach/html/kehoach.html',   // ĐUÔI đường dẫn màn khai (tuỳ chọn)
               tenMan: 'Kế hoạch tuyển dụng'         // tên hiện khi chưa tìm được màn
           });
       hoặc gọn trong .then của lời gọi nạp:  rows = ums.lamTruoc.neuRong(rows, { … })
     Trùng (cùng danh mục / cùng ô) chỉ hiện một lần.

   Tắt: site.config.js → behavior.lamTruoc = false. Chế độ dữ liệu mẫu chỉ bật
   khi URL có `lamtruoc` (dữ liệu mẫu thiếu nhiều danh mục → báo nhiễu).
   Bấm × : ẩn khung của MÀN đó tới hết phiên (sessionStorage), mục mới phát sinh
   sau đó vẫn hiện lại.
   ========================================================================= */
(function (global) {
    'use strict';
    var ums = global.ums = global.ums || {};
    var CFG = ums.config || {};

    var DM_MAN = '/danhmuc/html/danhmucdulieu.html';
    var DM_CMS = 'apiscms/modules/danhmuc/html/danhmucdulieu.html';
    var KHOA_TAT = 'ums.lamTruoc.tat';

    var cur = null;          // { host, url, ten, ds: [], keys: {}, box, hen }
    var moDanhMuc = '';      // mã danh mục màn Danh mục dữ liệu cần chọn sẵn

    function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

    function bat() {
        var b = (ums.config || CFG).behavior || {};
        if (b.lamTruoc === false) return false;
        if (ums.state && ums.state.mode === 'demo') return /[?&]lamtruoc\b/.test(location.search);
        return true;
    }
    function tatDoc() { try { return JSON.parse(sessionStorage.getItem(KHOA_TAT) || '{}'); } catch (e) { return {}; } }
    function tatGhi(o) { try { sessionStorage.setItem(KHOA_TAT, JSON.stringify(o)); } catch (e) { /* bộ nhớ phiên bị chặn: lần sau hiện lại */ } }

    var L = ums.lamTruoc = {};

    /* Vỏ gọi mỗi lần mở một chức năng (app.js openFunction) — xoá khung cũ, bắt đầu gom cho màn mới. */
    L.batDau = function (host, url, cn) {
        if (cur && cur.hen) clearTimeout(cur.hen);
        cur = bat() ? { host: host, url: String(url || ''), ten: (cn && cn.name) || '', ds: [], keys: {}, box: null, hen: 0 } : null;
    };

    /* Thêm một việc. m = { loai: 'dm', ma } | { o, viec, man, tenMan } */
    function them(m) {
        if (!cur) return;
        var k = m.loai === 'dm' ? 'dm:' + m.ma : 'o:' + (m.o || '') + '|' + (m.man || '');
        if (cur.keys[k]) return;
        cur.keys[k] = true;
        m.k = k;
        cur.ds.push(m);
        if (cur.hen) clearTimeout(cur.hen);
        var c = cur;
        cur.hen = setTimeout(function () { if (c === cur) ve(); }, 400);   // đợi các lời gọi nạp cùng lúc rồi vẽ một lần
    }

    /* api.js gọi khi một danh mục dùng chung trả 0 dòng */
    L.danhMucRong = function (ma) { if (ma) them({ loai: 'dm', ma: String(ma) }); };

    /* BẢNG NGUỒN — lời gọi trả rỗng nghĩa là người dùng phải khai ở một màn khác trước. Khoá = action, hoặc tên thủ tục
       (phần sau dấu chấm của func, không phân biệt hoa thường). man = ĐUÔI đường dẫn màn khai; màn đó tự mở thì không báo.
       Kiểm host gặp loại "thiếu dữ liệu khai được ở màn khác" thì THÊM DÒNG VÀO ĐÂY, không ghi sổ backend. */
    L.NGUON = {
        'TC_BienLai/LayDanhSach': { o: 'Hệ thống biên lai', viec: 'Chưa khai hệ thống biên lai nào (mẫu số, ký hiệu, dải số) — không chọn được mẫu biên lai.',
            man: '/Modules/danhmucheso/html/hethongbienlai.html', tenMan: 'Khai báo hệ thống biên lai' },
        'TC_PhieuThu/LayDanhSach': { o: 'Hệ thống phiếu thu', viec: 'Chưa khai hệ thống phiếu thu nào — không chọn được mẫu phiếu thu.',
            man: '/Modules/danhmucheso/html/hethongphieuthu.html', tenMan: 'Khai báo hệ thống phiếu thu' },
        'TC_HoaDon/LayDanhSach': { o: 'Hệ thống hoá đơn', viec: 'Chưa khai hệ thống hoá đơn nào — không chọn được mẫu hoá đơn.',
            man: '/Modules/danhmucheso/html/hethonghoadon.html', tenMan: 'Khai báo hệ thống hoá đơn' },
        'layDSNhanSu_MauHoSo': { o: 'Mẫu hồ sơ', viec: 'Chưa có mẫu hồ sơ nào — khai ít nhất một mẫu hồ sơ.',
            man: '/Modules/hoso/html/cauhinhhoso.html', tenMan: 'Cấu hình hồ sơ' }
    };
    var NGUON_THUONG = null;
    function traNguon(opts) {
        if (!NGUON_THUONG) { NGUON_THUONG = {}; Object.keys(L.NGUON).forEach(function (k) { NGUON_THUONG[k.toLowerCase()] = L.NGUON[k]; }); }
        var a = String(opts.action || '').toLowerCase(), f = String(opts.func || '').toLowerCase();
        return NGUON_THUONG[a] || (f && NGUON_THUONG[f.slice(f.lastIndexOf('.') + 1)]) || null;
    }
    /* api.js gọi khi MỌI lời gọi trả 0 dòng */
    L.sauGoi = function (opts) {
        if (!cur || !opts) return;
        if (opts.action === 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM') { L.danhMucRong(opts.strMaBangDanhMuc); return; }
        var n = traNguon(opts);
        if (!n || String(opts.strTuKhoa || '').trim()) return;                // đang tìm theo từ khoá mà không ra: không phải thiếu dữ liệu
        var u = cur.url.toLowerCase().split('?')[0];
        if (n.man && u.slice(-n.man.length) === n.man.toLowerCase()) return;    // đang ở chính màn khai
        L.can(n);
    };
    /* Màn tự khai */
    L.can = function (o) { if (o && (o.o || o.viec)) them({ o: o.o || '', viec: o.viec || '', man: o.man || '', tenMan: o.tenMan || '' }); };
    L.neuRong = function (rows, o) { if (!rows || !rows.length) L.can(o); return rows; };

    /* Màn Danh mục dữ liệu đọc một lần sau khi nạp cây danh mục */
    L.layDanhMucCho = function () { var m = moDanhMuc; moDanhMuc = ''; return m; };

    function dongHtml(m, i) {
        var noi;
        if (m.loai === 'dm') {
            noi = 'Danh mục <b>' + esc(m.ma) + '</b> chưa có giá trị nào (hoặc chưa được tạo) — các ô lấy lựa chọn từ danh mục này đang trống. ' +
                'Cần khai giá trị cho danh mục ở màn <b>Danh mục dữ liệu</b>.';
        } else {
            noi = (m.o ? '<b>' + esc(m.o) + '</b>: ' : '') + esc(m.viec) +
                (m.tenMan ? ' (màn <b>' + esc(m.tenMan) + '</b>)' : '');
        }
        var coLink = m.loai === 'dm' || m.man;
        return '<li>' + noi + (coLink ? ' <button type="button" class="ums-lamtruoc__mo" data-lt="' + i + '">' +
            '<i class="fa-light fa-arrow-up-right-from-square"></i><span>' + (m.loai === 'dm' ? 'Mở Danh mục dữ liệu' : 'Mở màn khai') +
            '</span></button>' : '') + '</li>';
    }

    function ve() {
        if (!cur || !cur.ds.length || !cur.host || !cur.host.isConnected) return;
        var tat = tatDoc()[cur.url] || [];
        var ds = cur.ds.filter(function (m) { return tat.indexOf(m.k) < 0; });
        if (cur.box) cur.box.remove();
        cur.box = null;
        if (!ds.length) return;
        var d = document.createElement('div');
        d.className = 'ums-lamtruoc';
        d.setAttribute('role', 'status');
        d.innerHTML = '<div class="ums-lamtruoc__dau"><i class="fa-light fa-circle-exclamation"></i>' +
            '<b>Cần làm trước</b><span class="ums-lamtruoc__phu">thiếu dữ liệu để dùng đủ màn này — khai ở màn khác rồi quay lại</span>' +
            '<button type="button" class="ums-lamtruoc__x" data-lt-x title="Tắt thông báo" aria-label="Tắt thông báo">' +
            '<i class="fa-light fa-xmark"></i></button></div>' +
            '<ol>' + ds.map(function (m) { return dongHtml(m, cur.ds.indexOf(m)); }).join('') + '</ol>';
        var cq = cur.host.querySelector(':scope > .ums-canquyet');
        cur.host.insertBefore(d, cq ? cq.nextSibling : cur.host.firstChild);
        cur.box = d;
        var c = cur;
        d.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-lt-x]')) {
                var o = tatDoc();
                o[c.url] = c.ds.map(function (m) { return m.k; });
                tatGhi(o);
                d.remove();
                if (c.box === d) c.box = null;
                return;
            }
            var b = ev.target.closest('[data-lt]');
            if (b) mo(c.ds[+b.getAttribute('data-lt')], b);
        });
    }

    /* Khung Ghi chú vẽ SAU khung này (veCanQuyet chèn lên đầu) → giữ khung này ngay dưới Ghi chú */
    L.giuViTri = function () {
        if (!cur || !cur.box || !cur.box.isConnected) return;
        var cq = cur.host.querySelector(':scope > .ums-canquyet');
        if (cq && cq.nextSibling !== cur.box) cur.host.insertBefore(cur.box, cq.nextSibling);
    };

    /* Tệp màn có thật trong _v2 chưa (màn chưa chuyển thì không nhảy tới) — nhớ theo phiên */
    var coTep = {};
    function tepCo(url) {
        if (!url) return Promise.resolve(false);
        if (coTep[url] === undefined) {
            coTep[url] = fetch(url.split('?')[0], { method: 'HEAD', cache: 'no-store' })
                .then(function (r) { return r.ok; }, function () { return false; });
        }
        return coTep[url];
    }
    /* Ứng viên đầu tiên có tệp — giữ thứ tự ưu tiên của danh sách */
    function dauTienCoTep(ds) {
        var i = 0;
        function thu() {
            if (i >= ds.length) return Promise.resolve(null);
            var x = ds[i++];
            return tepCo(x.url).then(function (ok) { return ok ? x : thu(); });
        }
        return thu();
    }

    function mo(m, nut) {
        if (!m || !ums.app || !ums.app.timManTheoDuongDan) return;
        nut.disabled = true;
        var span = nut.querySelector('span'), chu = span ? span.textContent : '';
        if (span) span.textContent = 'Đang tìm màn…';
        var vt = ums.state && ums.state.roleId;
        /* Danh mục: màn Danh mục dữ liệu của vai trò đang mở (lọc theo nhóm danh mục của vai trò) → bản Quản trị hệ thống (mọi danh mục)
           → bản của phân hệ khác. Loại khác: màn khai theo bảng nguồn, vai trò đang mở trước. */
        var p = m.loai === 'dm'
            ? Promise.all([ums.app.timManTheoDuongDan(DM_MAN), ums.app.timManTheoDuongDan(DM_CMS)]).then(function (x) {
                var tat = x[0], cms = x[1];
                return [].concat(tat.filter(function (y) { return y.r === vt; }), cms, tat.filter(function (y) { return y.r !== vt; }));
            })
            : ums.app.timManTheoDuongDan(m.man);
        p.then(dauTienCoTep).then(function (x) {
            nut.disabled = false;
            if (span) span.textContent = chu;
            if (!x) {
                ums.ui.toast('Tài khoản chưa được cấp màn ' + (m.loai === 'dm' ? '"Danh mục dữ liệu"' : '"' + (m.tenMan || m.man) + '"') +
                    ' (bản giao diện mới) ở vai trò nào — nhờ quản trị cấp quyền hoặc khai giúp.', 'warn');
                return;
            }
            if (m.loai === 'dm') moDanhMuc = m.ma;
            if (x.r !== vt) ums.ui.toast('Chuyển sang vai trò "' + x.rn + '" để mở ' + x.n, 'info');
            location.hash = x.hash;
        });
    }
})(window);
