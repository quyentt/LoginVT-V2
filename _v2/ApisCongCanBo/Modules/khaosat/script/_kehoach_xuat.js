/* =========================================================================
   Kế hoạch khảo sát — XUẤT EXCEL "Kết quả chi tiết" — ums.ks.xuatKetQua(kh)
   ---------------------------------------------------------------------------
   Chuyển từ gốc kehoach.js export_KetQuaChiTiet / getCell_KetQuaChiTiet / showExportDialog (gốc 20/10):
   lấy TOÀN BỘ kết quả của kế hoạch, không phụ thuộc trang đang xem. Dùng lại đúng hai API của màn:
       [1] KS_ThongTin/LayDSKS_KetQuaKhaoSat   → danh sách dòng + danh sách câu hỏi (pageSize 100000)
       [2] KS_TaoPhieu/LayDSKetQuaTraLoiTheo   → đáp án TỪNG Ô (dòng × câu hỏi), chạy theo số luồng chọn
   Máy chủ chưa có API trả gộp đáp án ⇒ số lượt gọi = số dòng × số câu hỏi ĐÃ CHỌN; lọc bớt là cách nhanh nhất.
   Một hộp thoại ba pha: [tải danh sách] → tuỳ chọn (lọc phiếu / trạng thái, phạm vi dòng, chọn câu hỏi,
   số luồng) → tiến độ (đổi số luồng ngay khi đang chạy; "Dừng & xuất phần đã tải") → kết quả.
   Khác gốc: thư viện SheetJS lấy từ assets/vendor (ums.ui.napXLSX), không gọi CDN; hộp thoại là ums.ui.dialog
   (Đóng = huỷ, Esc như Đóng); không có trần luồng chung iGioiHanLuong (ums.api.call không xếp hàng).
   Tệp: hai sheet "Kết quả chi tiết" + "Thông tin xuất" (bộ lọc đã dùng), tên KetQuaKhaoSat_<kế hoạch>[_MotPhan]_<yyyyMMdd_HHmm>.xlsx.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var ks = ums.ks = ums.ks || {};
    var LUONG = [4, 8, 12, 16, 24, 32, 48], KEY = 'ums.ks.xuat';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function so(n) { return Number(n || 0).toLocaleString('vi-VN'); }
    function fmt(sec) {
        var s = Math.round(sec);
        if (s >= 3600) return Math.floor(s / 3600) + 'g ' + Math.floor((s % 3600) / 60) + 'p';
        return s >= 60 ? Math.floor(s / 60) + 'p ' + (s % 60) + 's' : s + 's';
    }
    /* Đáp án có thể chứa HTML (màn gốc hiển thị bằng .html()) → lấy chữ thuần, không chạy script / ảnh */
    function txt(s) {
        s = String(e(s));
        if (/<[a-z!\/][^>]*>/i.test(s)) { try { return new DOMParser().parseFromString(s, 'text/html').body.textContent; } catch (x) { } }
        return s;
    }
    function luu() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (x) { return {}; } }

    /* Danh sách chọn nhiều: ô tìm (tuỳ chọn) + Chọn hết / Bỏ hết áp cho các mục ĐANG HIỆN */
    function checklist(host, label, items, coTim, onChange) {
        var on = items.map(function () { return true; });
        var el = document.createElement('div');
        el.className = 'ks-xuat__cl';
        el.innerHTML = '<div class="ums-row ums-row--between ums-u-mb-2"><b data-cl="title"></b>' +
            '<span class="ums-u-fz13"><a href="javascript:void(0)" data-cl="all">Chọn hết</a> · <a href="javascript:void(0)" data-cl="none">Bỏ hết</a></span></div>' +
            (coTim ? '<input type="text" class="ums-input ums-input--sm ums-u-mb-2" data-cl="q" placeholder="Tìm nhanh…">' : '') +
            '<div class="ums-checklist ks-xuat__list">' + items.map(function (it, i) {
                return '<label class="ums-check" data-i="' + i + '"><input type="checkbox" checked><span class="ums-u-flex1">' + esc(it.label) + '</span>' +
                    (it.count != null ? '<span class="ums-u-muted ums-u-nowrap">' + so(it.count) + '</span>' : '') + '</label>';
            }).join('') + '</div>';
        host.appendChild(el);
        var title = el.querySelector('[data-cl="title"]');
        function ve() { title.textContent = label + ' (' + on.filter(Boolean).length + '/' + items.length + ')'; }
        function datHien(b) {
            Array.prototype.forEach.call(el.querySelectorAll('.ums-check'), function (l) {
                if (l.hidden) return;
                on[Number(l.getAttribute('data-i'))] = b;
                l.querySelector('input').checked = b;
            });
            ve(); onChange();
        }
        el.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-cl]');
            if (!a) return;
            if (a.getAttribute('data-cl') === 'all') datHien(true);
            else if (a.getAttribute('data-cl') === 'none') datHien(false);
        });
        el.addEventListener('change', function (ev) {
            var l = ev.target.closest('.ums-check');
            if (!l) return;
            on[Number(l.getAttribute('data-i'))] = ev.target.checked;
            ve(); onChange();
        });
        var q = el.querySelector('[data-cl="q"]');
        if (q) q.addEventListener('input', function () {
            var k = q.value.toLowerCase();
            Array.prototype.forEach.call(el.querySelectorAll('.ums-check'), function (l) {
                l.hidden = items[Number(l.getAttribute('data-i'))].label.toLowerCase().indexOf(k) < 0;
            });
        });
        ve();
        return {
            chon: function () { var o = {}; items.forEach(function (it, i) { if (on[i]) o[it.key] = true; }); return o; },
            nhan: function () { return items.filter(function (it, i) { return on[i]; }).map(function (it) { return it.label; }); },
            dem: function () { return on.filter(Boolean).length; },
            tong: items.length
        };
    }

    ks.xuatKetQua = function (kh) {
        if (ks._dangXuat) return;
        ks._dangXuat = true;
        var huy = false, xong = false, batDau = false, motPhan = false;
        var hang = [], cau = [], dap = [], hangXong = [], moTa = [];
        var iHang = 0, iCot = 0, tong = 0, ke = 0, daXong = 0, loi = 0, dangChay = 0, tongBE = 0, luong = 8;
        var tDau = 0, tRate = 0, nRate = 0, rate = 0;
        var batDauXuat = function () { };

        var dlg = ui.dialog({
            title: 'Xuất kết quả khảo sát', icon: 'fa-file-excel', size: 'lg',
            body: '<div class="ums-u-muted ums-u-mb-4" data-x="note">Đang tải danh sách kết quả…</div>' +
                '<div data-x="opt" hidden></div>' +
                '<div data-x="run" hidden><div class="ums-meter"><div class="ums-meter__track"><div class="ums-meter__fill" data-x="bar" style="width:0"></div></div></div>' +
                '<div class="ums-u-fz13 ums-u-mt-2" data-x="count"></div></div>' +
                '<div class="ks-xuat__sum" data-x="sum" hidden></div>' +
                '<div class="ums-row ks-xuat__luong" data-x="luong" hidden><label class="ums-check">Số luồng <select class="ums-select ums-input--sm" data-x="sel">' +
                LUONG.map(function (n) { return '<option value="' + n + '">' + n + '</option>'; }).join('') + '</select></label>' +
                '<span class="ums-u-muted ums-u-fz13">(đổi được ngay khi đang chạy)</span></div>',
            buttons: [
                { kind: 'excel', text: 'Dừng & xuất phần đã tải', mod: 'out-warn', keepOpen: true, onClick: function () { dungSom(); return false; } },
                { kind: 'excel', text: 'Bắt đầu xuất', keepOpen: true, onClick: function () { batDauXuat(); return false; } }
            ],
            onClose: function () { if (!xong) { huy = true; ket(); } }
        });
        var q = function (k) { return dlg.el.querySelector('[data-x="' + k + '"]'); };
        var note = q('note'), opt = q('opt'), run = q('run'), sum = q('sum'), sel = q('sel'), bar = q('bar'), count = q('count');
        var nutPhan = dlg.el.querySelector('[data-dlg="0"]'), nutBatDau = dlg.el.querySelector('[data-dlg="1"]');
        nutPhan.hidden = true; nutBatDau.hidden = true;
        var da = luu();
        sel.value = String(LUONG.indexOf(da.w) >= 0 ? da.w : 8);
        sel.addEventListener('change', function () { luong = parseInt(sel.value, 10) || 8; if (batDau && !xong) bom(); });
        function tieuDe(icon, s) { dlg.el.querySelector('.ums-dialog__title').innerHTML = '<i class="fa-light ' + icon + '"></i> ' + esc(s); }

        function ket() {
            if (xong) return;
            xong = true; ks._dangXuat = false;
        }
        function ketThuc(icon, tieu, msg, tone) {
            if (xong) return;
            ket();
            opt.hidden = true; sum.hidden = true; q('luong').hidden = true; run.hidden = !batDau;
            nutPhan.hidden = true; nutBatDau.hidden = true; sel.disabled = true;
            tieuDe(icon, tieu); note.textContent = msg;
            note.className = 'ums-u-mb-4' + (tone === 'bad' ? ' ums-u-danger' : tone === 'warn' ? ' ks-xuat__warn' : '');
            if (tone) ui.toast(msg, tone);
        }
        function tienDo() {
            if (xong || !tong) return;
            var now = Date.now();
            if (!tRate) { tRate = now; nRate = daXong; }
            else if (now - tRate >= 3000) { rate = (daXong - nRate) / ((now - tRate) / 1000); tRate = now; nRate = daXong; }
            var pct = Math.floor(daXong * 100 / tong), troi = (now - tDau) / 1000;
            var perSec = rate > 0 ? rate : (daXong > 0 ? daXong / troi : 0);
            bar.style.width = pct + '%';
            count.textContent = so(daXong) + ' / ' + so(tong) + ' (' + pct + '%) · đã chạy ' + fmt(troi) +
                (perSec > 0 && daXong < tong ? ' · còn khoảng ' + fmt((tong - daXong) / perSec) : '') +
                (perSec > 0 ? ' · ~' + so(Math.round(perSec)) + ' ô/giây' : '') + (loi ? ' · lỗi ' + so(loi) : '');
        }
        /* Đáp án một ô — thử lại một lần nếu lỗi, không báo; hết phiên thì dừng cả lượt */
        function layO(r, cauHoiId, done) {
            var lan = 0;
            (function go() {
                ums.api.call({ action: 'KS_TaoPhieu/LayDSKetQuaTraLoiTheo', method: 'GET', silent: true,
                    strKS_DoiTuongThamGiaKS_Id: r.KS_DOITUONGTHAMGIAKHAOSAT_ID, strKS_DoiTuongDuocKhaoSat_Id: r.KS_DOITUONGDUOCKHAOSAT_ID,
                    strKS_PhieuKhaoSat_Id: r.KS_PHIEUKHAOSAT_ID, strKS_KeHoachKhaoSat_Id: r.KS_KEHOACHKHAOSAT_ID, strKS_CauHoi_Id: cauHoiId, strLoaiDapAn: '' })
                    .then(function (x) { var v = arr(x.data)[0]; done(true, v ? v.KETQUA : ''); },
                          function (err) {
                              if (err && err.expired) { huy = true; ums.api.handle(err); done(false, ''); return; }
                              if (++lan < 2) go(); else done(false, '');
                          });
            })();
        }
        function bom() {
            if (xong) return;
            if (huy || motPhan) { if (dangChay === 0) { if (huy) dlg.close(); else dung(); } return; }
            if (daXong >= tong) { dung(); return; }
            while (dangChay < luong && ke < tong) {
                (function (k) {
                    var iR = Math.floor(k / iCot), iC = k % iCot;
                    dangChay++;
                    layO(hang[iR], cau[iC].KS_CAUHOI_ID, function (ok, v) {
                        dap[iR][iC] = ok ? v : '(lỗi tải)';
                        if (!ok) loi++;
                        hangXong[iR]++; daXong++; dangChay--;
                        tienDo(); bom();
                    });
                })(ke++);
            }
        }
        function dungSom() {
            motPhan = true;
            nutPhan.disabled = true;
            note.textContent = 'Đang chờ các lượt đang chạy xong để xuất phần đã tải…';
            bom();
        }
        function dung() {
            if (xong) return;
            if (huy) { dlg.close(); return; }
            note.textContent = 'Đang tạo tệp Excel…';
            ui.napXLSX().then(function (XLSX) {
                if (xong) return;
                var idx = [];
                hang.forEach(function (r, i) { if (!motPhan || hangXong[i] >= iCot) idx.push(i); });
                if (!idx.length) { ketThuc('fa-circle-info', 'Chưa có dữ liệu', 'Chưa có dòng nào tải xong để xuất.', 'warn'); return; }
                var dau = ['STT', 'Người tham gia - Mã số', 'Người tham gia - Họ tên', 'Người tham gia - Ghi chú', 'Phiếu khảo sát', 'Trạng thái khảo sát',
                    'Đối tượng được khảo sát - Mã số', 'Đối tượng được khảo sát - Họ tên'].concat(cau.map(function (c) { return txt(c.KS_CAUHOI_TEN); }));
                var aoa = [dau];
                idx.forEach(function (i, n) {
                    var r = hang[i];
                    var d = [n + 1, e(r.KS_DOITUONGTHAMGIAKHAOSAT_MA), (e(r.KS_DOITUONGTHAMGIAKHAOSAT_HO) + ' ' + e(r.KS_DOITUONGTHAMGIAKHAOSAT_TEN)).trim(), e(r.GHICHU),
                        e(r.KS_PHIEUKHAOSAT_TEN), e(r.KETQUA), e(r.KS_DOITUONGDUOCKHAOSAT_MA), e(r.KS_DOITUONGDUOCKHAOSAT_TEN)];
                    for (var j = 0; j < iCot; j++) d.push(txt(dap[i][j]));
                    aoa.push(d);
                });
                var ws = XLSX.utils.aoa_to_sheet(aoa);
                ws['!cols'] = dau.map(function (h, c) { return { wch: [6, 14, 24, 20, 40, 16, 16, 28][c] || 22 }; });
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Kết quả chi tiết');
                var now = new Date(), dungSomThat = idx.length < iHang, thieu = tongBE > iHang && !moTa.length;
                var info = [['Kế hoạch', String(e(kh.TENKEHOACH))], ['Thời điểm xuất', now.toLocaleString('vi-VN')],
                    ['Số dòng đã xuất', idx.length + (dungSomThat ? ' / ' + iHang + ' (dừng sớm, chỉ gồm các dòng đã tải xong)' : '')],
                    ['Số câu hỏi', iCot], ['Số ô không tải được', loi]];
                moTa.forEach(function (s) { info.push(['Bộ lọc', s]); });
                if (thieu) info.push(['Lưu ý', 'Máy chủ chỉ trả ' + iHang + '/' + tongBE + ' dòng']);
                var wsInfo = XLSX.utils.aoa_to_sheet(info);
                wsInfo['!cols'] = [{ wch: 20 }, { wch: 90 }];
                XLSX.utils.book_append_sheet(wb, wsInfo, 'Thông tin xuất');
                var ten = String(kh.TENKEHOACH || 'KeHoach').replace(/[\\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 60);
                var p2 = function (n) { return n < 10 ? '0' + n : n; };
                var moc = now.getFullYear() + p2(now.getMonth() + 1) + p2(now.getDate()) + '_' + p2(now.getHours()) + p2(now.getMinutes());
                XLSX.writeFile(wb, 'KetQuaKhaoSat_' + ten + (dungSomThat ? '_MotPhan' : '') + '_' + moc + '.xlsx');
                /* Nhớ tốc độ + số luồng để lần sau ước tính thời gian */
                try {
                    var giay = (Date.now() - tDau) / 1000;
                    if (daXong >= 200 && giay > 0) localStorage.setItem(KEY, JSON.stringify({ w: luong, rate: Math.round(daXong / giay) }));
                } catch (x) { }
                var msg = 'Đã xuất ' + so(idx.length) + (dungSomThat ? '/' + so(iHang) : '') + ' dòng × ' + iCot + ' câu hỏi.';
                if (thieu) msg += ' LƯU Ý: máy chủ chỉ trả ' + iHang + '/' + tongBE + ' dòng.';
                if (loi) ketThuc('fa-triangle-exclamation', 'Đã xuất tệp (có ô lỗi)', msg + ' Có ' + loi + ' ô không tải được, trong tệp ghi "(lỗi tải)".', 'warn');
                else if (dungSomThat || thieu) ketThuc('fa-triangle-exclamation', 'Đã xuất tệp (một phần)', msg, 'warn');
                else { ketThuc('fa-circle-check', 'Hoàn tất', msg, 'ok'); setTimeout(function () { dlg.close(); }, 2500); }
            }).catch(function (err) { ketThuc('fa-circle-xmark', 'Lỗi tạo tệp Excel', String(err && err.message || err), 'bad'); });
        }

        /* Pha 2: tuỳ chọn */
        function tuyChon(dsHang, dsCau) {
            var phieuKey = function (r) { return String(r.KS_PHIEUKHAOSAT_ID || r.KS_PHIEUKHAOSAT_TEN || ''); };
            var ttKey = function (r) { return String(e(r.KETQUA)); };
            function nhom(fk, fl) {
                var m = {}, out = [];
                dsHang.forEach(function (r) {
                    var k = fk(r);
                    if (!Object.prototype.hasOwnProperty.call(m, k)) { m[k] = { key: k, label: fl(r), count: 0 }; out.push(m[k]); }
                    m[k].count++;
                });
                return out;
            }
            var dsPhieu = nhom(phieuKey, function (r) { return String(r.KS_PHIEUKHAOSAT_TEN || '(không tên)'); });
            var dsTT = nhom(ttKey, function (r) { return String(e(r.KETQUA)) || '(trống)'; });
            var dsQ = dsCau.map(function (c, i) { return { key: String(i), label: txt(c.KS_CAUHOI_TEN) || ('Câu hỏi ' + (i + 1)), count: null }; });
            opt.innerHTML = '';
            var clPhieu = dsPhieu.length > 1 ? checklist(opt, 'Phiếu khảo sát', dsPhieu, true, tinh) : null;
            var clTT = dsTT.length > 1 ? checklist(opt, 'Trạng thái khảo sát', dsTT, false, tinh) : null;
            var pv = document.createElement('div');
            pv.className = 'ums-row ks-xuat__pv';
            pv.innerHTML = '<b class="ums-u-flex1">Phạm vi dòng <span class="ums-u-muted ums-u-semi">(sau khi lọc)</span></b>' +
                '<span>Từ dòng</span> <input type="number" min="1" class="ums-input ums-input--sm" data-pv="tu" placeholder="1">' +
                '<span>đến</span> <input type="number" min="1" class="ums-input ums-input--sm" data-pv="den" placeholder="hết">';
            opt.appendChild(pv);
            var tu = pv.querySelector('[data-pv="tu"]'), den = pv.querySelector('[data-pv="den"]');
            tu.addEventListener('input', tinh); den.addEventListener('input', tinh);
            var clCau = dsQ.length ? checklist(opt, 'Câu hỏi (cột)', dsQ, true, tinh) : null;

            function chon() {
                var oP = clPhieu ? clPhieu.chon() : null, oS = clTT ? clTT.chon() : null;
                var a = dsHang.filter(function (r) { return (!oP || oP[phieuKey(r)]) && (!oS || oS[ttKey(r)]); });
                var iTu = Math.max(1, parseInt(tu.value, 10) || 1), iDen = parseInt(den.value, 10) || 0;
                if (iTu > 1 || iDen > 0) a = a.slice(iTu - 1, iDen > 0 ? iDen : undefined);
                var oQ = clCau ? clCau.chon() : {};
                return { hang: a, cau: dsCau.filter(function (c, i) { return oQ[String(i)]; }) };
            }
            function tinh() {
                var o = chon(), goi = o.hang.length * o.cau.length;
                var h = 'Sẽ xuất <b>' + so(o.hang.length) + '</b> dòng × <b>' + o.cau.length + '</b> câu hỏi = <b>' + so(goi) + '</b> lượt gọi.';
                if (goi > 0 && da.rate > 0) h += '<br><span class="ums-u-muted">Ước tính khoảng <b>' + fmt(goi / da.rate) + '</b> (theo lần chạy trước: ' + da.w + ' luồng, ~' + so(da.rate) + ' ô/giây)</span>';
                if (goi > 200000) h += '<br><span class="ks-xuat__warn">Số lượt gọi rất lớn: nên lọc bớt phiếu / câu hỏi hoặc giới hạn số dòng.</span>';
                if (o.hang.length && !o.cau.length) h += '<br><span class="ums-u-muted">Không chọn câu hỏi nào: chỉ xuất các cột thông tin.</span>';
                if (tongBE > dsHang.length) h += '<br><span class="ks-xuat__warn">Lưu ý: máy chủ chỉ trả ' + so(dsHang.length) + '/' + so(tongBE) + ' dòng.</span>';
                sum.innerHTML = h;
                nutBatDau.disabled = o.hang.length === 0;
            }
            batDauXuat = function () {
                var o = chon();
                moTa = [];
                if (clPhieu && clPhieu.dem() < clPhieu.tong) moTa.push('Phiếu khảo sát: ' + clPhieu.dem() + '/' + clPhieu.tong + ' phiếu');
                if (clTT && clTT.dem() < clTT.tong) moTa.push('Trạng thái khảo sát: ' + clTT.nhan().join(', '));
                if (tu.value || den.value) moTa.push('Phạm vi dòng: từ ' + (parseInt(tu.value, 10) || 1) + ' đến ' + (parseInt(den.value, 10) || 'hết'));
                if (clCau && clCau.dem() < clCau.tong) moTa.push('Câu hỏi: ' + clCau.dem() + '/' + clCau.tong);
                hang = o.hang; cau = o.cau; luong = parseInt(sel.value, 10) || 8;
                iHang = hang.length; iCot = cau.length; tong = iHang * iCot;
                dap = hang.map(function () { return new Array(iCot); });
                hangXong = hang.map(function () { return 0; });
                opt.hidden = true; sum.hidden = true; run.hidden = false;
                nutBatDau.hidden = true; nutPhan.hidden = false;
                tieuDe('fa-spinner fa-spin', 'Đang xuất kết quả khảo sát…');
                note.textContent = 'Đang tải đáp án từng ô…';
                tDau = Date.now(); batDau = true;
                if (!tong) { dung(); return; }
                tienDo(); bom();
            };
            tieuDe('fa-sliders', 'Tuỳ chọn xuất Excel');
            note.textContent = 'Mặc định xuất tất cả. Lọc bớt phiếu / câu hỏi / số dòng để chạy nhanh hơn (số lượt gọi = số dòng × số câu hỏi).';
            opt.hidden = false; sum.hidden = false; q('luong').hidden = false; nutBatDau.hidden = false;
            tinh();
        }

        /* Pha 1: tải toàn bộ danh sách (tham số như tab Kết quả chi tiết, pageSize lớn) */
        ums.api.call({ action: 'KS_ThongTin/LayDSKS_KetQuaKhaoSat', method: 'GET', silent: true, strTuKhoa: '', strKS_LoaiDoiTuong_Id: '', strKS_PhieuKhaoSat_Mau_Id: '',
            strKS_KeHoachKhaoSat_Id: kh.ID, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 }).then(function (r) {
            if (xong) return;
            var d = r.data || {}, dsHang = arr(d.rs), dsCau = arr(d.rsCauHoi);
            tongBE = parseInt(r.pager, 10) || 0;
            if (!dsHang.length) { ketThuc('fa-circle-info', 'Không có dữ liệu', 'Kế hoạch này chưa có kết quả để xuất.', 'warn'); return; }
            tuyChon(dsHang, dsCau);
        }).catch(function (err) {
            if (xong) return;
            ketThuc('fa-circle-xmark', 'Không tải được dữ liệu', err && err.message ? err.message : 'Lỗi kết nối khi tải danh sách kết quả.', 'bad');
            ums.api.handle(err, 'tải danh sách kết quả');
        });
    };
})();
