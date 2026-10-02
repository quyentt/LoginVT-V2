/* =========================================================================
   ApisNCKH / xacnhankekhai — XÁC NHẬN KÊ KHAI bài báo / kỷ yếu / sách: ums.nckhBB.xnMan(root, kieu)
   Bản gốc: ApisNCKH/Modules/xacnhankekhai/script/{tapchiquocte,tapchiquocgia,kyyeuhoinghi,thongtinsach}.js
   Cấu hình sản phẩm dùng chung với màn quản lý: ums.nckhBB.SP (quanlysanpham/script/_bb_chung.js).
   ---------------------------------------------------------------------------
   Bố cục gốc MỘT CỘT (col-lg-12): khung "Tìm kiếm" (ô lọc + Tìm kiếm + Xuất báo cáo + Tải file) · bảng sản phẩm
   (tên bấm được, tệp đính kèm, nút xác nhận nhanh từng loại, xác nhận cuối cùng, nội dung) · bấm tên → khung
   "Kê khai …" THAY CHỖ danh sách (biểu mẫu KHÔNG có nút Lưu → ở đây là khung CHỈ XEM) + nút "Xác nhận sản phẩm"
   (hộp: nội dung, nút lớn từng loại xác nhận, lịch sử).
   Lời gọi (chép nguyên):
     NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung  strChucNang_Id, strNguoiThucHien_Id — loại xác nhận người
         dùng được làm (bỏ MA = XNKKCHUAKHAI như gốc)
     NCKH_SP_XacNhanKeKhai/ThemMoi (POST)  strId '', strSanPham_Id, strNoiDung, strTinhTrang_Id, strNguoiXacnhan_Id
     NCKH_SP_XacNhanKeKhai/LayDanhSach     strTuKhoa '', strSanPham_Id, strTinhTrang_Id '', strNguoiThucHien_Id '', 1, 100000
     NCKH_Files/GopFile (POST)             arrTuKhoa (đường dẫn), arrDuLieu (tên), strNguoiThucHien_Id → mở tệp gộp
   Khác bản gốc:
     · Ô lọc "Tình trạng" gốc KHÔNG nạp gì (dòng nạp NCKH.XNKK bị chú thích) → nạp danh mục NCKH.XNKK
       (như màn tinhdiemsanpham) — gửi strTinhTrangXacNhan_Id như gốc.
     · "Tải file" gốc gộp tệp đang VẼ trên trang (bảng + biểu mẫu ẩn) → gộp tệp của các dòng trang đang xem.
     · Ô Thành viên đăng ký khoá tới khi chọn Đơn vị (luật cha → con).
     · Hệ số IF / "Vai trò" (sách) — xem _bb_chung.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, BB = ums.nckhBB;
    var e = BB.e, arr = BB.arr, uid = BB.uid;
    function esc(s) { return ui.esc(s); }
    function icon(c) { c = e(c) || 'fa-circle-check'; return ums.iconFA4 ? ums.iconFA4(c) : c; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }

    /* ---------- Loại xác nhận của người dùng (nhớ theo chức năng) ---------- */
    var dmP = {};
    BB.dmXacNhan = function () {
        var k = cn();
        if (!dmP[k]) dmP[k] = ums.api.call({ action: 'NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung', method: 'GET', strChucNang_Id: k,
            strNguoiThucHien_Id: uid(), silent: true })
            .then(function (r) { return arr(r.data).filter(function (x) { return e(x.MA) !== 'XNKKCHUAKHAI'; }); },
                function (err) { delete dmP[k]; ums.api.handle(err, 'loại xác nhận'); return []; });
        return dmP[k];
    };
    BB.luuXacNhan = function (spId, ttId, noiDung) {
        return ums.api.call({ action: 'NCKH_SP_XacNhanKeKhai/ThemMoi', method: 'POST', strId: '', strSanPham_Id: spId, strNoiDung: noiDung || '',
            strTinhTrang_Id: ttId, strNguoiXacnhan_Id: uid() })
            .then(function () { ui.toast('Xác nhận thành công', 'ok'); return true; },
                function (err) { ums.api.handle(err, 'xác nhận'); return false; });
    };

    /** Hộp "Xác nhận sản phẩm" (modal_XacNhan gốc). o = { id, ten, onDone } */
    BB.hopXacNhan = function (o) {
        var dlg = ui.dialog({ title: 'Xác nhận sản phẩm: ' + o.ten, icon: 'fa-circle-check', size: 'lg', body:
            ui.field('Nội dung xác nhận', '<input class="ums-input" data-x="nd" autocomplete="off">') +
            '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div><div class="bb-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
            '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-x="ls"></div>' });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        BB.dmXacNhan().then(function (d) {
            q('nut').innerHTML = d.length ? d.map(function (h) {
                return '<button type="button" class="bb-xn__nut" data-hd="' + esc(h.ID) + '"><i class="' + esc(icon(h.THONGTIN1)) + '"' +
                    (h.THONGTIN2 ? ' style="' + esc(h.THONGTIN2) + '"' : '') + '></i><span>' + esc(e(h.TEN)) + '</span></button>';
            }).join('') : ui.empty('Bạn chưa được phân loại xác nhận nào');
        });
        q('ls').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'NCKH_SP_XacNhanKeKhai/LayDanhSach', method: 'GET', strTuKhoa: '', strSanPham_Id: o.id, strTinhTrang_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                ui.table({ el: q('ls'), rows: arr(r.data), stt: true, empty: 'Chưa có lịch sử xác nhận', columns: [
                    { title: 'Xác nhận', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' }, { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
            }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử xác nhận'); });
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hd]');
            if (!b) return;
            var nd = q('nd').value.trim();
            dlg.close();
            BB.luuXacNhan(o.id, b.getAttribute('data-hd'), nd).then(function (ok) { if (ok && o.onDone) o.onDone(); });
        });
        return dlg;
    };

    /* =====================================================================
       Màn xác nhận kê khai
       ===================================================================== */
    BB.xnMan = function (root, kieu) {
        var D = BB.SP[kieu];
        var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, tong = 0, rows = [], token = 0, dmXN = [];
        var locs = [{ key: 'q', label: 'Nhập từ khóa tìm kiếm' }];
        locs = D.locXN().concat(locs);
        var tenNhan = D.ten === 'TENSACH' ? 'Tên sách' : 'Tên bài báo';
        root.innerHTML = pat.page(D.tieuDe) +
            '<div data-bb="ds">' +
            pat.filterBar(locs, { extra: '<div class="ums-field ums-field--fit" data-bb="bc"></div>' +
                (D.taiFile === false ? '' : '<div class="ums-field ums-field--fit"><button type="button" class="ums-btn ums-btn--out-info" data-bb-a="tep">' +
                    '<i class="fa-light fa-cloud-arrow-down"></i><span>Tải file</span></button></div>') }) +
            pat.panel({ title: D.dsTieuDe || D.tieuDe, icon: D.icon, count: 'bbDem', flush: true, zone: 'bbBang',
                tools: ui.btn('reload', { attr: { 'data-bb-a': 'tai' } }) }) +
            '</div><div data-bb="ct" hidden></div>';
        var ds = root.querySelector('[data-bb="ds"]'), ct = root.querySelector('[data-bb="ct"]');
        function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function giaTri() { var o = {}; locs.forEach(function (l) { var el = F(l.key); o[l.key] = el ? (el.value || '').trim() : ''; }); return o; }
        ui.enhance(root);

        /* Nạp ô lọc */
        var cho = [];
        D.locXN().forEach(function (l) {
            if (!l.source) return;
            var el = F(l.key);
            cho.push(ums.crud.loadSource(l.source).then(function (d) {
                pat.fill(el, d, { head: l.label, name: l.source.name || 'TEN' });
                if (l.first && d.length) { el.value = d[0].ID; if (window.jQuery) jQuery(el).trigger('change.select2'); }
            }).catch(function (err) { ums.api.handle(err, l.label); }));
        });
        BB.ganDonVi(F('dv'), F('tv'), { pageSize: D.tvPageSize, onDoi: function () { tai(1); } });
        if (window.jQuery) jQuery(ds).on('change', 'select[data-f]', function () { if (this.getAttribute('data-f') !== 'dv') tai(1); });
        F('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
        ums.report.mount(ds.querySelector('[data-bb="bc"]'), { reportText: 'Xuất báo cáo', import: false, collect: function (add) {
            var p = D.bc(giaTri()); Object.keys(p).forEach(function (k) { add(k, p[k]); });
        } });

        /* Danh sách */
        function tai(p) {
            if (p) page = p;
            var my = ++token, host = root.querySelector('[data-z="bbBang"]');
            if (!rows.length) host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call(Object.assign({ action: D.ctl + '/LayDanhSach', method: 'GET' }, D.dsXN(giaTri()), { pageIndex: page, pageSize: size }))
                .then(function (r) {
                    if (my !== token) return;
                    rows = arr(r.data); tong = Number(r.pager) || rows.length;
                    var dem = root.querySelector('[data-z="bbDem"]'); if (dem) dem.textContent = '(' + tong + ')';
                    ve();
                }).catch(function (err) { if (my !== token) return; rows = []; host.innerHTML = ui.fail(err.message); ums.api.handle(err, D.tieuDe); });
        }
        function ve() {
            var host = root.querySelector('[data-z="bbBang"]');
            var cot = [{ title: tenNhan, render: function (r, i) {
                return '<a href="javascript:void(0)" class="bb-ten" data-bb-xem="' + i + '">' + esc(e(r[D.ten])) + '</a>';
            } }].concat(D.cotXN, [
                { title: 'File đính kèm', render: function (r, i) { return '<div data-bb-tep="' + i + '"></div>'; } },
                { title: 'Xác nhận', cls: 'is-center', render: function (r, i) {
                    return '<div class="bb-xnn">' + dmXN.map(function (h, j) {
                        return '<button type="button" class="ums-iconbtn" data-bb-xnn="' + i + ':' + j + '" title="' + esc(e(h.TEN)) + '"><i class="' + esc(icon(h.THONGTIN1)) + '"' +
                            (h.THONGTIN2 ? ' style="' + esc(h.THONGTIN2) + '"' : '') + '></i></button>';
                    }).join('') + '</div>';
                } },
                { title: 'Xác nhận cuối cùng', cls: 'is-center', render: function (r) {
                    if (!e(r.KETQUAXACNHAN_TEN)) return '';
                    return '<span class="bb-kq" title="' + esc(e(r.KETQUAXACNHAN_TEN)) + '"><i class="' + esc(icon(r.KETQUAXACNHAN_THONGTIN1)) + '"' +
                        (r.KETQUAXACNHAN_THONGTIN2 ? ' style="' + esc(r.KETQUAXACNHAN_THONGTIN2) + '"' : '') + '></i> ' + esc(e(r.KETQUAXACNHAN_TEN)) + '</span>';
                } },
                { title: 'Nội dung xác nhận', prop: 'KETQUAXACNHAN_NOIDUNG' }]);
            ui.table({ el: host, rows: rows, stt: true, columns: cot, empty: 'Không có dữ liệu',
                page: { index: page, size: size, total: tong, onChange: tai, onSize: function (n) { size = n; tai(1); } } });
            rows.forEach(function (r, i) {
                var el = host.querySelector('[data-bb-tep="' + i + '"]');
                if (el) ums.files.mount(el, { api: 'NCKH_Files', readonly: true }).load(r.ID);
            });
        }
        root.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-bb-a]');
            if (a) {
                var k = a.getAttribute('data-bb-a');
                if (k === 'tai') tai(1);
                else if (k === 'tep') gopFile();
                else if (k === 'dong') dong();
                else if (k === 'xn' && dangXem) BB.hopXacNhan({ id: dangXem.ID, ten: e(dangXem[D.ten]), onDone: function () { dong(); tai(); } });
                return;
            }
            if (ev.target.closest('[data-a="search"]')) { tai(1); return; }
            var x = ev.target.closest('[data-bb-xem]');
            if (x) { var r = rows[Number(x.getAttribute('data-bb-xem'))]; if (r) xem(r); return; }
            var n = ev.target.closest('[data-bb-xnn]');
            if (n) {
                var p = n.getAttribute('data-bb-xnn').split(':');
                xacNhanNhanh(rows[Number(p[0])], dmXN[Number(p[1])]);
            }
        });
        /* btnxacnhan_small gốc: hỏi lại kèm ô "Mô tả xác nhận" */
        function xacNhanNhanh(r, h) {
            if (!r || !h) return;
            ui.dialog({ title: 'Xác nhận', icon: 'fa-circle-check', size: 'md', body:
                '<p>Xác nhận <b>' + esc(e(h.TEN)) + '</b> cho sản phẩm <b>' + esc(e(r[D.ten])) + '</b>!</p>' +
                '<input class="ums-input" data-x="mt" placeholder="Mô tả xác nhận" autocomplete="off">',
                buttons: [{ kind: 'confirm', text: 'Đồng ý', onClick: function (api) {
                    var mt = api.body.querySelector('[data-x="mt"]').value.trim();
                    BB.luuXacNhan(r.ID, h.ID, mt).then(function (ok) { if (ok) tai(); });
                } }] });
        }
        /* Tải file: gộp mọi tệp đính kèm của trang đang xem */
        function gopFile() {
            if (!rows.length) { ui.toast('Không có sản phẩm nào để tải tệp', 'warn'); return; }
            Promise.all(rows.map(function (r) {
                return ums.api.call({ action: 'NCKH_Files/LayDanhSach', method: 'GET', strDuLieu_Id: r.ID, silent: true }).then(function (x) { return arr(x.data); }, function () { return []; });
            })).then(function (ls) {
                var tk = [], dl = [];
                ls.forEach(function (l) { l.forEach(function (x) { if (x.FILEMINHCHUNG) { tk.push(x.FILEMINHCHUNG); dl.push(e(x.TENHIENTHI)); } }); });
                if (!tk.length) { ui.toast('Các sản phẩm trang này chưa có tệp đính kèm', 'info'); return; }
                return ums.api.call({ action: 'NCKH_Files/GopFile', method: 'POST', arrTuKhoa: tk, arrDuLieu: dl, strNguoiThucHien_Id: uid() }).then(function (r) {
                    var d = typeof r.data === 'string' ? r.data : (r.raw && r.raw.Data);
                    if (d) window.open(ums.files.url(d), '_blank');
                });
            }).catch(function (err) { ums.api.handle(err, 'tải file'); });
        }

        /* ---------- Khung "Kê khai …" CHỈ XEM (thay chỗ danh sách) ---------- */
        var dangXem = null, mapNguon = {};
        function tenNguon(src, id) {
            if (!id) return Promise.resolve('');
            return ums.crud.loadSource(src).then(function (d) {
                var hit = d.filter(function (x) { return e(x[src.id || 'ID']) === e(id); })[0];
                return hit ? e(hit[src.name || 'TEN']) : '';
            }, function () { return ''; });
        }
        function xem(r) {
            dangXem = r;
            var body = D.fields.map(function (fd, i) {
                if (fd.xn === false || fd.type === 'note') return '';
                if (fd.type === 'legend') return '<div class="ums-legend' + (i ? ' ums-legend--cach' : '') + '">' + esc(fd.label) + '</div>';
                if (fd.type === 'files') return '<div class="ums-kv"><span>' + esc(fd.label) + '</span><b data-bb="tep"></b></div>';
                if (fd.type === 'select') return '<div class="ums-kv"><span>' + esc(fd.label) + '</span><b data-bb-chon="' + i + '"></b></div>';
                return BB.kv(fd.label, r[fd.col]);
            }).join('');
            ct.innerHTML =
                pat.panel({ title: 'Kê khai ' + D.formTitle, icon: 'fa-file-lines', body: body,
                    tools: ui.btn('close', { attr: { 'data-bb-a': 'dong' } }) + ui.btn('confirm', { text: 'Xác nhận sản phẩm', attr: { 'data-bb-a': 'xn' } }) }) +
                pat.panel({ title: 'Thành viên trong trường tham gia', icon: 'fa-users', flush: true, cls: 'ums-u-mt-4', body: '<div data-bb="tvT"></div>' }) +
                pat.panel({ title: 'Thành viên ngoài trường tham gia', icon: 'fa-user-group', flush: true, cls: 'ums-u-mt-4', body: '<div data-bb="tvN"></div>' }) +
                pat.panel({ title: 'Đề tài của sản phẩm', icon: 'fa-flask', cls: 'ums-u-mt-4', body: '<div data-bb="dt"></div>' });
            D.fields.forEach(function (fd, i) {
                if (fd.type !== 'select' || fd.xn === false) return;
                tenNguon(fd.source, r[fd.col]).then(function (t) { var b = ct.querySelector('[data-bb-chon="' + i + '"]'); if (b) b.textContent = t; });
            });
            ums.files.mount(ct.querySelector('[data-bb="tep"]'), { api: 'NCKH_Files', readonly: true }).load(r.ID);
            tenNguon(BB.nguonDeTai(true), r.NCKH_QUANLYDETAI_ID).then(function (t) {
                ct.querySelector('[data-bb="dt"]').innerHTML = BB.kv('Thuộc đề tài', t || '—');
            });
            thanhVien(r);
            ui.swap(ds, ct, { top: true });
        }
        function thanhVien(r) {
            var hT = ct.querySelector('[data-bb="tvT"]'), hN = ct.querySelector('[data-bb="tvN"]');
            hT.innerHTML = hN.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            Promise.all([ums.api.call({ action: 'NCKH_ThanhVien/LayDanhSach', method: 'GET', strSanPham_Id: r.ID, pageIndex: 1, pageSize: 100 }),
                D.vaiTro ? ums.api.dm(D.vaiTro).catch(function () { return []; }) : []])
                .then(function (x) {
                    var ds_ = arr(x[0].data), vt = {};
                    arr(x[1]).forEach(function (v) { vt[e(v.ID)] = e(v.TEN); });
                    function vaiTro(t) { return e(t.VAITRO_TEN) || vt[e(t.VAITRO_ID)] || ''; }
                    var cotT = [{ title: 'Hình ảnh', cls: 'is-center', width: '80px', render: function (t) { return pat.anhNguoi(t.ANH); } },
                        { title: 'Họ tên', render: function (t) { return ui.cell(e(t.HOTEN), e(t.MACANBO)); } },
                        { title: 'Vai trò', render: function (t) { return esc(vaiTro(t)); } }];
                    if (D.tyLe) cotT.push({ title: 'Tỷ lệ tham gia', prop: 'TYLETHAMGIA', cls: 'is-center' });
                    ui.table({ el: hT, stt: true, empty: 'Chưa có thành viên', columns: cotT,
                        rows: ds_.filter(function (t) { return e(t.LATHANHVIENCUATRUONG) !== '1'; }) });
                    ui.table({ el: hN, stt: true, empty: 'Chưa có thành viên', columns: [{ title: 'Họ tên', prop: 'HOTEN' },
                        { title: 'Vai trò', render: function (t) { return esc(vaiTro(t)); } }],
                        rows: ds_.filter(function (t) { return e(t.LATHANHVIENCUATRUONG) === '1'; }) });
                }).catch(function (err) { hT.innerHTML = ui.fail(err.message); hN.innerHTML = ''; ums.api.handle(err, 'thành viên'); });
        }
        function dong() { dangXem = null; ui.swap(ct, ds, { top: true }); }

        /* Khởi động: loại xác nhận trước (cột "Xác nhận" cần nó), rồi ô lọc, rồi danh sách — như gốc */
        BB.dmXacNhan().then(function (d) { dmXN = d; return Promise.all(cho); }).then(function () { tai(1); });
        return { tai: tai };
    };
})();
