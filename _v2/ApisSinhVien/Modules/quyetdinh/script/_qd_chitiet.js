/* =========================================================================
   Quyết định — tab "Danh sách chi tiết" + "Xuất báo cáo" — ums.svqd.chiTiet(o)
   ---------------------------------------------------------------------------
   Chuyển từ gốc quyetdinh.js (20/10: switch_TabQuyetDinh / loadChiTiet / genTable_ChiTiet / exportExcel_ChiTiet):
   dải tab "Danh sách | Danh sách chi tiết" trên khung danh sách; tab chi tiết lấy TOÀN BỘ quyết định theo bộ lọc
   của lần tìm gần nhất (bỏ phân trang, pageSize 100000) rồi mỗi quyết định gọi một lần
   SV_QuyetDinh_NguoiHoc/LayDanhSach (GET strChucNang_Id · strQLSV_QuyetDinh_Id · strQLSV_NguoiHoc_Id '') — 6 luồng,
   thanh tiến độ trong khung + nút Hủy. Mỗi quyết định = một dòng nhóm (bấm để thu / mở), bên dưới là sinh viên.
   Dữ liệu giữ lại (cache) tới khi danh sách quyết định đổi (tìm / đổi trang / lưu / xoá → o.crud.onLoad gọi CT.cu()).
   "Xuất báo cáo" (nút đầu trang, cạnh Thêm mới): một sheet, mỗi dòng = một sinh viên kèm thông tin quyết định
   (quyết định chưa có sinh viên vẫn một dòng) — SheetJS từ assets/vendor (ums.ui.napXLSX), không gọi CDN như gốc.
   o = { list: vùng danh sách của crud, panel: khung bảng quyết định, thamSo(): tham số lời gọi danh sách (không phân trang) }
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, Q = ums.svqd, esc = ui.esc, e = Q.e, arr = Q.arr;
    var COT = ['Stt', 'Mã số', 'Họ tên', 'Lớp', 'Nhóm lớp', 'Chương trình', 'Khóa', 'Trạng thái mới', 'Lớp mới', '% tính phí', 'Lớp ngành 2', 'Kỳ hiệu lực'];
    var LUONG = 6;
    function so(n) { return Number(n || 0).toLocaleString('vi-VN'); }

    Q.chiTiet = function (o) {
        var tab = 'list', du = [], cu = true, dangTai = false, token = 0, cho = [], coThamSo = false;

        var tabs = document.createElement('div');
        tabs.className = 'svqd-ct__tabs';
        tabs.innerHTML = ui.tabs([{ key: 'list', text: 'Danh sách', icon: 'fa-list' }, { key: 'detail', text: 'Danh sách chi tiết', icon: 'fa-list-tree' }], tab, 'data-qdtab');
        o.list.insertBefore(tabs, o.panel);

        var pane = document.createElement('section');
        pane.className = 'ums-panel';
        pane.hidden = true;
        pane.innerHTML = '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-tree"></i> Danh sách chi tiết ' +
            '<span class="ums-u-faint ums-u-fz13" data-ct="tong"></span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('reload', { attr: { 'data-ct': 'reload', title: 'Tải lại toàn bộ kết quả' } }) + '</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush">' +
            '<div class="svqd-ct__status" data-ct="status" hidden><span class="ums-u-nowrap"><i class="fa-light fa-spinner fa-spin"></i> <span data-ct="log"></span></span>' +
            '<div class="ums-meter"><div class="ums-meter__track"><div class="ums-meter__fill" data-ct="bar" style="width:0"></div></div><b class="ums-u-fz12" data-ct="pct">0%</b></div>' +
            '<button type="button" class="ums-btn ums-btn--ghost ums-btn--sm" data-ct="huy"><i class="fa-light fa-xmark"></i><span>Hủy</span></button></div>' +
            '<div class="ums-tablewrap"><table class="ums-table svqd-ct__bang"><thead><tr>' +
            COT.map(function (t, i) { return '<th scope="col"' + (i === 0 || i === 9 ? ' class="is-center"' : '') + '>' + esc(t) + '</th>'; }).join('') +
            '</tr></thead><tbody data-ct="tbody"></tbody></table></div></div>';
        o.panel.parentNode.insertBefore(pane, o.panel.nextSibling);
        function x(k) { return pane.querySelector('[data-ct="' + k + '"]'); }

        function trangThai(log, pct) {
            x('status').hidden = false;
            x('log').textContent = log;
            x('bar').style.width = pct + '%';
            x('pct').textContent = pct + '%';
        }
        function anTrangThai() { x('status').hidden = true; }

        /* Vẽ bảng: mỗi quyết định một dòng nhóm, bên dưới các sinh viên. msg: chữ khi chưa có dữ liệu */
        function ve(msg, loi) {
            var h = '', tongSV = 0;
            du.forEach(function (d, i) {
                var qd = d.qd, sv = d.sv;
                tongSV += sv.length;
                h += '<tr class="svqd-ct__qd" data-g="' + i + '"><td colspan="' + COT.length + '"><div class="svqd-ct__head">' +
                    '<span><i class="fa-light fa-caret-down svqd-ct__caret"></i><b class="svqd-ct__ten">' + esc(e(qd.LOAIQUYETDINH_TEN)) + '</b></span>' +
                    '<span class="svqd-ct__meta">Số QĐ: <b>' + esc(e(qd.SOQUYETDINH)) + '</b></span>' +
                    '<span class="svqd-ct__meta">Ngày QĐ: <b>' + esc(e(qd.NGAYQUYETDINH)) + '</b></span>' +
                    '<span class="svqd-ct__meta">Hiệu lực: <b>' + esc(e(qd.NGAYHIEULUC)) + '</b></span>' +
                    (e(qd.NGAYHETHIEULUC) ? '<span class="svqd-ct__meta">Hết hiệu lực: <b>' + esc(qd.NGAYHETHIEULUC) + '</b></span>' : '') +
                    '<span class="svqd-ct__meta">Cấp: <b>' + esc(e(qd.CAPQUYETDINH_TEN)) + '</b></span>' +
                    '<span class="svqd-ct__meta">Học kỳ: <b>' + esc(e(qd.THOIGIAN)) + '</b></span>' +
                    '<span class="svqd-ct__meta">Số sinh viên: <b>' + sv.length + '</b></span></div>' +
                    (e(qd.NGUYENNHAN_LYDO) ? '<div class="svqd-ct__nd">' + esc(qd.NGUYENNHAN_LYDO) + '</div>' : '') + '</td></tr>';
                if (d.err) h += '<tr class="svqd-ct__trong" data-g="' + i + '"><td colspan="' + COT.length + '" class="ums-u-danger">Không tải được danh sách sinh viên của quyết định này. Bấm "Tải lại" để thử lại.</td></tr>';
                else if (!sv.length) h += '<tr class="svqd-ct__trong" data-g="' + i + '"><td colspan="' + COT.length + '">Quyết định chưa có sinh viên</td></tr>';
                sv.forEach(function (s, j) {
                    h += '<tr data-g="' + i + '"><td class="is-center">' + (j + 1) + '</td><td>' + esc(e(s.QLSV_NGUOIHOC_MASO)) + '</td><td>' + esc(Q.hoTen(s)) + '</td>' +
                        '<td>' + esc(e(s.DAOTAO_LOPQUANLY_TEN)) + '</td><td>' + esc(e(s.NHOMLOP_TEN)) + '</td><td>' + esc(e(s.DAOTAO_TOCHUCCHUONGTRINH_TEN)) + '</td>' +
                        '<td>' + esc(e(s.DAOTAO_KHOADAOTAO_TEN)) + '</td><td>' + esc(e(s.TRANGTHAINGUOIHOC_MOI_TEN)) + '</td><td>' + esc(e(s.DAOTAO_LOPQUANLY_MOI_TEN)) + '</td>' +
                        '<td class="is-center">' + esc(e(s.PHAMTRAMTINHPHI)) + '</td><td>' + esc(e(s.DAOTAO_LOPQUANLY_N2_TEN)) + '</td><td>' + esc(e(s.DSKETQUANHIEUKY)) + '</td></tr>';
                });
            });
            if (!du.length) h = '<tr><td colspan="' + COT.length + '" class="is-center ums-u-muted">' + esc(msg || 'Không tìm thấy dữ liệu!') + '</td></tr>';
            x('tbody').innerHTML = h;
            x('tong').innerHTML = du.length ? '— ' + so(du.length) + ' quyết định · ' + so(tongSV) + ' sinh viên' + (loi ? ' · <span class="ums-u-danger">' + loi + ' quyết định tải lỗi</span>' : '') : '';
        }

        function huy() {
            token++; dangTai = false; cu = true; cho = []; du = [];
            anTrangThai();
            ve('Đã hủy tải. Bấm "Tải lại" để tải lại.');
        }
        function laySV(id) {
            return ums.api.call({ action: 'SV_QuyetDinh_NguoiHoc/LayDanhSach', method: 'GET', silent: true, timeout: 30000,
                strChucNang_Id: Q.cn(), strQLSV_QuyetDinh_Id: id, strQLSV_NguoiHoc_Id: '' })
                .then(function (r) { return { data: arr(r.data) }; }, function (err) {
                    if (err && err.expired) ums.api.handle(err);
                    return { error: err && err.message || 'lỗi' };
                });
        }
        /* Tải toàn bộ quyết định + sinh viên từng quyết định. ep=true: bỏ cache. xong: gọi khi tải xong */
        function tai(ep, xong) {
            if (!ep && !cu) { ve(); if (xong) xong(); return; }
            if (xong) cho.push(xong);
            if (dangTai && !ep) return;
            var tk = ++token;
            dangTai = true; du = [];
            ve('Đang tải dữ liệu…');
            trangThai('Đang lấy danh sách quyết định…', 0);
            function ketThuc(kq, loi) {
                du = kq; dangTai = false; cu = false;
                anTrangThai(); ve(null, loi);
                var c = cho; cho = [];
                c.forEach(function (f) { f(); });
            }
            function hong(msg) { dangTai = false; cho = []; anTrangThai(); ve('Lỗi: ' + msg); }
            var p = o.thamSo(); p.pageIndex = 1; p.pageSize = 100000;
            ums.api.call(p).then(function (r) {
                if (tk !== token) return;
                var d = r.data, ds = Array.isArray(d) ? d : arr(d && d.rs);
                var tong = ds.length;
                if (!tong) { ketThuc([], 0); return; }
                var hoi = tong > 500 ? ui.confirm('Kết quả có ' + so(tong) + ' quyết định, hệ thống sẽ gọi ' + so(tong) + ' lần để lấy danh sách sinh viên nên có thể mất vài phút. Tiếp tục?', { title: 'Danh sách chi tiết', ok: 'Tiếp tục' }) : Promise.resolve(true);
                hoi.then(function (yes) {
                    if (tk !== token) return;
                    if (!yes) { huy(); return; }
                    var kq = new Array(tong), daXong = 0, loi = 0, ke = 0, chay = 0;
                    function tienDo() { trangThai('Đã tải sinh viên của ' + daXong + '/' + tong + ' quyết định' + (loi ? ' (lỗi: ' + loi + ')' : ''), Math.round(daXong / tong * 100)); }
                    function bom() {
                        if (tk !== token) return;
                        while (chay < LUONG && ke < tong) {
                            (function (i) {
                                chay++;
                                laySV(ds[i].ID).then(function (r) {
                                    if (tk !== token) return;
                                    chay--; daXong++;
                                    if (r.error) loi++;
                                    kq[i] = { qd: ds[i], sv: r.data || [], err: !!r.error };
                                    tienDo();
                                    if (daXong === tong) ketThuc(kq, loi); else bom();
                                });
                            })(ke++);
                        }
                    }
                    tienDo(); bom();
                });
            }).catch(function (err) { if (tk === token) { hong(err && err.message || 'Không lấy được danh sách quyết định'); ums.api.handle(err, 'danh sách quyết định'); } });
        }

        function doiTab(k) {
            tab = k;
            ui.tabsActive(tabs, k, 'data-qdtab');
            o.panel.hidden = k === 'detail';
            pane.hidden = k !== 'detail';
            if (k === 'detail') tai(false);
        }
        tabs.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-qdtab]');
            if (a) doiTab(a.getAttribute('data-qdtab'));
        });
        pane.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-ct="reload"]')) { tai(true); return; }
            if (ev.target.closest('[data-ct="huy"]')) { huy(); return; }
            var g = ev.target.closest('.svqd-ct__qd');
            if (!g) return;
            var thu = g.classList.toggle('is-collapsed'), id = g.getAttribute('data-g');
            Array.prototype.forEach.call(x('tbody').querySelectorAll('tr[data-g="' + id + '"]'), function (tr) { if (tr !== g) tr.hidden = thu; });
        });

        /* Xuất báo cáo: tải (dùng cache nếu còn) rồi sinh tệp */
        function xuat() {
            if (!coThamSo) { ui.toast('Vui lòng tìm kiếm trước khi xuất báo cáo.', 'warn'); return; }
            if (tab !== 'detail' && cu) doiTab('detail');     // người dùng thấy tiến độ tải trong khung chi tiết
            tai(false, sinhTep);
        }
        function sinhTep() {
            var loi = du.filter(function (d) { return d.err; }).length, dong = 0;
            du.forEach(function (d) { dong += Math.max(d.sv.length, 1); });
            if (!du.length) { ui.toast('Không có dữ liệu để xuất.', 'warn'); return; }
            var hoi = loi ? ui.confirm(loi + ' quyết định không tải được danh sách sinh viên (sẽ để trống trong tệp). Vẫn xuất?', { title: 'Xuất báo cáo', ok: 'Vẫn xuất' }) : Promise.resolve(true);
            hoi.then(function (yes) {
                if (!yes) return false;
                return dong > 5000 ? ui.confirm('Bạn sắp xuất ' + so(dong) + ' dòng dữ liệu. Quá trình có thể mất vài giây và dùng nhiều bộ nhớ. Tiếp tục?', { title: 'Xuất báo cáo', ok: 'Tiếp tục' }) : true;
            }).then(function (yes) {
                if (!yes) return;
                return ui.napXLSX().then(function (XLSX) {
                    var rows = [];
                    du.forEach(function (d) {
                        var qd = d.qd;
                        (d.sv.length ? d.sv : [null]).forEach(function (s) {
                            s = s || {};
                            rows.push({
                                'STT': rows.length + 1, 'Loại quyết định': e(qd.LOAIQUYETDINH_TEN), 'Số quyết định': e(qd.SOQUYETDINH), 'Ngày quyết định': e(qd.NGAYQUYETDINH),
                                'Ngày hiệu lực': e(qd.NGAYHIEULUC), 'Ngày hết hiệu lực': e(qd.NGAYHETHIEULUC), 'Cấp quyết định': e(qd.CAPQUYETDINH_TEN), 'Học kỳ': e(qd.THOIGIAN),
                                'Nội dung quyết định': e(qd.NGUYENNHAN_LYDO), 'Mã số': e(s.QLSV_NGUOIHOC_MASO), 'Họ tên': s.QLSV_NGUOIHOC_MASO ? Q.hoTen(s) : '',
                                'Lớp': e(s.DAOTAO_LOPQUANLY_TEN), 'Nhóm lớp': e(s.NHOMLOP_TEN), 'Chương trình': e(s.DAOTAO_TOCHUCCHUONGTRINH_TEN), 'Khóa': e(s.DAOTAO_KHOADAOTAO_TEN),
                                'Trạng thái mới': e(s.TRANGTHAINGUOIHOC_MOI_TEN), 'Lớp mới': e(s.DAOTAO_LOPQUANLY_MOI_TEN), '% tính phí': e(s.PHAMTRAMTINHPHI),
                                'Lớp ngành 2': e(s.DAOTAO_LOPQUANLY_N2_TEN), 'Kỳ hiệu lực': e(s.DSKETQUANHIEUKY),
                                'Ngày tạo quyết định': e(qd.NGAYTAO_DD_MM_YYYY_HHMMSS), 'Người tạo quyết định': e(qd.NGUOITAO_TAIKHOAN)
                            });
                        });
                    });
                    var ws = XLSX.utils.json_to_sheet(rows), dau = Object.keys(rows[0]);
                    ws['!cols'] = dau.map(function (h) {
                        var m = h.length;
                        rows.forEach(function (r) { var l = String(r[h] || '').length; if (l > m) m = l; });
                        return { wch: Math.min(m + 2, h === 'Nội dung quyết định' ? 60 : 40) };
                    });
                    var wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Chi tiết quyết định');
                    var now = new Date(), p2 = function (n) { return n < 10 ? '0' + n : n; };
                    XLSX.writeFile(wb, 'DSChiTietQuyetDinh_' + now.getFullYear() + p2(now.getMonth() + 1) + p2(now.getDate()) + '_' + p2(now.getHours()) + p2(now.getMinutes()) + '.xlsx');
                    ui.toast('Đã xuất ' + so(rows.length) + ' dòng.', 'ok');
                });
            }).catch(function (err) { ums.api.handle(err, 'xuất báo cáo'); });
        }

        return {
            /* Danh sách quyết định vừa nạp lại (tìm / đổi trang / lưu / xoá) → chi tiết cũ hết hạn; đang mở tab chi tiết thì tải lại luôn */
            cu: function () { coThamSo = true; cu = true; if (tab === 'detail' && !pane.hidden) tai(true); },
            xuat: xuat,
            tab: doiTab
        };
    };
})();
